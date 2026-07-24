/**
 * skill 包校验、受管安装和替换事务。
 *
 * 本模块是 managed skills 的唯一写入方。它支持本地目录、zip、HTTP(S) zip、
 * registry-index、受控 inline skill 来源和随已安装 SDK 发布的 bundled skill 来源；所有
 * 来源都必须在暂存区完成包校验。
 * 目录替换使用同根事务目录，避免失败时丢失原有 skill。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

import {
  createManagedSkillInstallation,
  getManagedSkillInstallation,
  removeManagedSkillInstallation,
  setManagedSkillInstallation
} from "./installation-registry.mjs";
import {
  isBuiltinSkillSource,
  resolveBuiltinSkillSource
} from "./builtin-skill-catalog.mjs";
import { normalizeSkillName } from "./skill-index.mjs";

const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const MAX_FILE_COUNT = 500;
const MAX_SINGLE_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_ROOT_FILES = new Set(["SKILL.md"]);
const ALLOWED_ROOT_DIRS = new Set(["references", "scripts", "assets"]);
const INLINE_SKILL_SOURCE_KIND = "agent-skill.inline.v1";
const BUNDLED_SKILL_SOURCE_KIND = "agent-skill.bundled.v1";
const TRANSACTION_PREFIX = ".agent-skill-transaction-";
// bundled skill 已随受控 npm SDK 落盘，不是网络下载包。它仍禁止 symlink 和任意顶层
// 目录，只放宽文件数量与许可/依赖说明文件，适配大型组件库而不降低普通安装来源的限制。
const BUNDLED_PACKAGE_POLICY = Object.freeze({
  maxTotalBytes: 50 * 1024 * 1024,
  maxFileCount: 20_000,
  maxSingleFileBytes: 5 * 1024 * 1024,
  // 随 SDK 交付的大型能力包可携带模板和按需工作说明；普通本地/网络 skill
  // 仍只能使用最小目录集合，避免扩大不受控安装来源的攻击面。
  allowedRootFiles: new Set(["SKILL.md", "THIRD_PARTY_NOTICES.md", "requirements.txt", "PPT_MASTER_SOURCE.json"]),
  allowedRootDirs: new Set(["references", "scripts", "assets", "templates", "workflows"])
});

export async function validateSkillPackage(skillDir, policy = undefined) {
  const root = path.resolve(skillDir);
  const limits = normalizePackagePolicy(policy);
  const diagnostics = [];
  // 校验会遍历真实文件系统，而不是信任压缩包文件名；这样可以在暂存后
  // 捕获不支持的顶层文件和本地 symlink。
  const entries = await listPackageEntries(root);
  const files = entries.filter((entry) => entry.type === "file").map((entry) => entry.path);
  const symlinks = entries.filter((entry) => entry.type === "symlink");
  for (const symlink of symlinks) {
    diagnostics.push(`symlink is not allowed: ${toPosix(path.relative(root, symlink.path))}`);
  }
  if (!files.some((file) => path.basename(file) === "SKILL.md" && path.dirname(file) === root)) {
    diagnostics.push("SKILL.md not found");
  }
  if (files.length > limits.maxFileCount) {
    diagnostics.push(`skill package contains more than ${limits.maxFileCount} files`);
  }
  let totalBytes = 0;
  for (const file of files) {
    const relativePath = toPosix(path.relative(root, file));
    if (!isAllowedPackagePath(relativePath, limits.allowedRootFiles, limits.allowedRootDirs)) {
      diagnostics.push(`unsupported skill package path: ${relativePath}`);
    }
    const stat = await fs.stat(file);
    totalBytes += stat.size;
    if (stat.size > limits.maxSingleFileBytes) diagnostics.push(`file exceeds ${limits.maxSingleFileBytes} bytes: ${relativePath}`);
  }
  if (totalBytes > limits.maxTotalBytes) diagnostics.push(`skill package exceeds ${limits.maxTotalBytes} bytes`);

  const metadata = files.some((file) => path.basename(file) === "SKILL.md" && path.dirname(file) === root)
    ? parseSkillMetadata(await fs.readFile(path.join(root, "SKILL.md"), "utf8"))
    : {};
  if (!metadata.name) diagnostics.push("SKILL.md frontmatter missing name");
  if (!metadata.description) diagnostics.push("SKILL.md frontmatter missing description");

  return {
    valid: diagnostics.length === 0,
    diagnostics,
    metadata,
    fileCount: files.length,
    totalBytes
  };
}

export async function installSkillPackage({ source, managedRoot, conflict } = {}) {
  const root = path.resolve(managedRoot);
  await recoverManagedSkillTransactions(root);
  const resolvedSource = await resolveInstallSource(source);
  const conflictMode = normalizeConflictMode(conflict, resolvedSource);
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-install-"));
  try {
    const stagedDir = await stageInstallSource(resolvedSource, tempRoot);
    const skillDir = await resolveSkillDirectory(stagedDir);
    const validation = await validateSkillPackage(skillDir, resolvedSource.packagePolicy);
    if (!validation.valid) {
      throw new Error(`Invalid skill package: ${validation.diagnostics.join("; ")}`);
    }

    const skillName = normalizeSkillName(validation.metadata.name);
    const destination = path.resolve(root, skillName);
    // 规范化后的 skill name 理论上已经安全；这里在替换文件的位置再次显式
    // 检查写入边界。
    if (!isInsideOrEqual(destination, root)) {
      throw new Error("skill destination escapes managed root");
    }

    const skillContent = await fs.readFile(path.join(skillDir, "SKILL.md"), "utf8");
    const contentHash = sha256Buffer(Buffer.from(skillContent, "utf8"));
    const incomingInstallation = createManagedSkillInstallation({
      skillName,
      version: validation.metadata.version ?? "0.1.0",
      contentHash,
      revision: resolvedSource.provenance?.revision ?? contentHash,
      sourceKind: resolvedSource.kind,
      provenance: resolvedSource.provenance
    });
    const existingInstallation = await getManagedSkillInstallation({ managedRoot: root, skillName });
    const destinationExists = await pathExists(destination);

    // 生态市场等远端目录使用 check 时，冲突是正常业务结果而不是异常。产品层
    // 可据此展示升级确认，不会在用户确认前触碰本地文件。
    if (conflictMode === "check" && destinationExists) {
      if (sameInstallation(existingInstallation, incomingInstallation)) {
        return {
          installed: false,
          status: "unchanged",
          name: skillName,
          managedRoot: root,
          path: destination,
          source: resolvedSource.kind,
          installation: existingInstallation,
          validation
        };
      }
      return {
        installed: false,
        status: "conflict",
        name: skillName,
        managedRoot: root,
        path: destination,
        source: resolvedSource.kind,
        existingInstallation,
        incomingInstallation,
        validation
      };
    }

    const transaction = await prepareManagedSkillReplacement({
      root,
      skillName,
      sourceDirectory: skillDir,
      destination,
      previousInstallation: existingInstallation,
      incomingInstallation
    });
    let installation;
    try {
      installation = await setManagedSkillInstallation({
        managedRoot: root,
        record: incomingInstallation
      });
      // 文件已切换且安装记录已落盘后，才标记为可提交。进程在此之前退出时，
      // 下一次安装会回滚目录和记录，避免目录内容与 provenance 失配。
      await transaction.markRegistryUpdated();
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      await restoreManagedSkillInstallation({
        managedRoot: root,
        skillName,
        previousInstallation: existingInstallation
      });
      throw error;
    }

    return {
      installed: true,
      status: destinationExists ? "replaced" : "installed",
      name: skillName,
      managedRoot: root,
      path: destination,
      source: resolvedSource.kind,
      installation,
      validation
    };
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

export async function removeManagedSkill({ skill, managedRoot } = {}) {
  const skillName = normalizeSkillName(skill);
  const root = path.resolve(managedRoot);
  await recoverManagedSkillTransactions(root);
  const destination = path.resolve(root, skillName);
  if (!isInsideOrEqual(destination, root)) {
    throw new Error("skill destination escapes managed root");
  }
  await fs.rm(destination, { recursive: true, force: true });
  const installation = await removeManagedSkillInstallation({ managedRoot: root, skillName });
  return {
    removed: true,
    name: skillName,
    path: destination,
    installation
  };
}

async function resolveInstallSource(source) {
  if (!source) throw new Error("install source is required");
  if (isBuiltinSkillSource(source)) {
    return await resolveBuiltinSkillSource(source);
  }
  if (isBundledSkillSource(source)) {
    return await resolveBundledSkillSource(source);
  }
  if (isInlineSkillSource(source)) {
    const content = requiredContent(source.content, "inline skill content");
    const expectedHash = source.integrity?.sha256;
    if (expectedHash && sha256Buffer(Buffer.from(content, "utf8")) !== String(expectedHash).toLowerCase()) {
      throw new Error("inline skill content sha256 mismatch");
    }
    return {
      kind: "inline",
      content,
      provenance: normalizeInlineProvenance(source.provenance)
    };
  }
  if (typeof source !== "string") {
    throw new Error("install source must be a path, URL, agent-skill.inline.v1 object, agent-skill.builtin.v1 object, or agent-skill.bundled.v1 object");
  }
  if (/^https?:\/\//i.test(source)) {
    // registry 只负责指向可安装 archive；选择和展示策略由调用方处理。
    if (source.endsWith(".json")) {
      const registry = await fetchJson(source);
      const first = Array.isArray(registry.skills) ? registry.skills[0] : undefined;
      if (!first?.url) throw new Error("registry index does not contain skills[0].url");
      return { kind: "url", url: first.url, provenance: { type: "url", sourceUrl: first.url } };
    }
    return { kind: "url", url: source, provenance: { type: "url", sourceUrl: source } };
  }
  const absolutePath = path.resolve(source);
  const stat = await fs.stat(absolutePath);
  return stat.isDirectory()
    ? { kind: "directory", path: absolutePath, provenance: { type: "directory" } }
    : { kind: "zip", path: absolutePath, provenance: { type: "zip" } };
}

async function stageInstallSource(source, tempRoot) {
  if (source.kind === "inline") {
    const output = path.join(tempRoot, "inline-skill");
    await fs.mkdir(output, { recursive: true });
    await fs.writeFile(path.join(output, "SKILL.md"), source.content, "utf8");
    return output;
  }
  if (source.kind === "directory" || source.kind === "builtin" || source.kind === "bundled") return source.path;
  const zipPath = source.kind === "zip"
    ? source.path
    : await downloadFile(source.url, path.join(tempRoot, "download.zip"));
  const output = path.join(tempRoot, "unzipped");
  await fs.mkdir(output, { recursive: true });
  await unzip(zipPath, output);
  return output;
}

async function resolveSkillDirectory(stagedDir) {
  const skillMd = path.join(stagedDir, "SKILL.md");
  try {
    const stat = await fs.stat(skillMd);
    if (stat.isFile()) return stagedDir;
  } catch {
    // 继续尝试单目录包布局。
  }
  const entries = await fs.readdir(stagedDir, { withFileTypes: true });
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(stagedDir, entry.name);
    try {
      const stat = await fs.stat(path.join(candidate, "SKILL.md"));
      if (stat.isFile()) candidates.push(candidate);
    } catch {
      // 忽略非 skill 目录。
    }
  }
  if (candidates.length !== 1) {
    throw new Error("skill package must contain exactly one SKILL.md root");
  }
  return candidates[0];
}

async function prepareManagedSkillReplacement({
  root,
  skillName,
  sourceDirectory,
  destination,
  previousInstallation,
  incomingInstallation
}) {
  await fs.mkdir(root, { recursive: true });
  const transactionRoot = path.join(root, `${TRANSACTION_PREFIX}${crypto.randomUUID()}`);
  const stagedDirectory = path.join(transactionRoot, "next");
  const backupDirectory = path.join(transactionRoot, "previous");
  const statePath = path.join(transactionRoot, "transaction.json");
  let previousMoved = false;
  const state = {
    skillName,
    destination,
    previousInstallation: previousInstallation ?? null,
    incomingInstallation,
    phase: "preparing",
    previousMoved: false
  };
  try {
    await fs.mkdir(transactionRoot, { recursive: true });
    await writeTransactionState(statePath, state);
    await copyDirectory(sourceDirectory, stagedDirectory);
    if (await pathExists(destination)) {
      await fs.rename(destination, backupDirectory);
      previousMoved = true;
    }
    await fs.rename(stagedDirectory, destination);
    state.phase = "files_swapped";
    state.previousMoved = previousMoved;
    await writeTransactionState(statePath, state);
  } catch (error) {
    if (previousMoved && await pathExists(backupDirectory)) {
      await fs.rm(destination, { recursive: true, force: true });
      await fs.rename(backupDirectory, destination);
    }
    await fs.rm(transactionRoot, { recursive: true, force: true });
    throw error;
  }
  return {
    async markRegistryUpdated() {
      state.phase = "registry_updated";
      await writeTransactionState(statePath, state);
    },
    async commit() {
      await fs.rm(transactionRoot, { recursive: true, force: true });
    },
    async rollback() {
      await fs.rm(destination, { recursive: true, force: true });
      if (previousMoved && await pathExists(backupDirectory)) {
        await fs.rename(backupDirectory, destination);
      }
      await fs.rm(transactionRoot, { recursive: true, force: true });
    }
  };
}

async function recoverManagedSkillTransactions(root) {
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith(TRANSACTION_PREFIX)) continue;
    const transactionRoot = path.join(root, entry.name);
    const statePath = path.join(transactionRoot, "transaction.json");
    try {
      const state = JSON.parse(await fs.readFile(statePath, "utf8"));
      const destination = path.resolve(state.destination);
      const backupDirectory = path.join(transactionRoot, "previous");
      if (!isInsideOrEqual(destination, root)) continue;

      if (state.phase !== "registry_updated") {
        if (await pathExists(backupDirectory)) {
          await fs.rm(destination, { recursive: true, force: true });
          await fs.rename(backupDirectory, destination);
        } else if (state.previousMoved === false) {
          await fs.rm(destination, { recursive: true, force: true });
        }
        await restoreManagedSkillInstallation({
          managedRoot: root,
          skillName: state.skillName,
          previousInstallation: state.previousInstallation
        });
      }
    } finally {
      await fs.rm(transactionRoot, { recursive: true, force: true });
    }
  }
}

// 安装记录使用独立文件，因此回滚时也必须显式恢复旧记录或清除新记录。
async function restoreManagedSkillInstallation({ managedRoot, skillName, previousInstallation }) {
  if (previousInstallation) {
    await setManagedSkillInstallation({
      managedRoot,
      record: previousInstallation
    });
    return;
  }
  await removeManagedSkillInstallation({ managedRoot, skillName });
}

async function writeTransactionState(statePath, state) {
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

async function unzip(zipPath, outputDir) {
  await assertZipEntriesSafe(zipPath);
  const command = [
    "Add-Type -AssemblyName System.IO.Compression.FileSystem;",
    `[System.IO.Compression.ZipFile]::ExtractToDirectory(${psString(zipPath)}, ${psString(outputDir)})`
  ].join(" ");
  const result = await runProcess("powershell.exe", ["-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command]);
  if (result.exitCode !== 0) {
    throw new Error(result.stderr || "zip extraction failed");
  }
}

async function assertZipEntriesSafe(zipPath) {
  // 解压前先检查，避免 archive traversal 有机会写出临时暂存目录。
  const command = [
    "Add-Type -AssemblyName System.IO.Compression.FileSystem;",
    `$archive = [System.IO.Compression.ZipFile]::OpenRead(${psString(zipPath)});`,
    "try { foreach ($entry in $archive.Entries) { [Console]::Out.WriteLine($entry.FullName) } }",
    "finally { $archive.Dispose() }"
  ].join(" ");
  const result = await runProcess("powershell.exe", ["-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command]);
  if (result.exitCode !== 0) {
    throw new Error(result.stderr || "zip inspection failed");
  }
  for (const rawName of result.stdout.split(/\r?\n/)) {
    const name = rawName.trim();
    if (!name) continue;
    if (isUnsafeArchiveEntryName(name)) {
      throw new Error(`zip entry escapes package root: ${name}`);
    }
  }
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`download failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, buffer);
  return outputPath;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`registry fetch failed: ${response.status}`);
  return await response.json();
}

function runProcess(executable, args) {
  return new Promise((resolve) => {
    const child = spawn(executable, args, { windowsHide: true, shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => { stdout += Buffer.from(chunk).toString("utf8"); });
    child.stderr?.on("data", (chunk) => { stderr += Buffer.from(chunk).toString("utf8"); });
    child.on("error", (error) => resolve({ exitCode: 1, stdout, stderr: error.message }));
    child.on("close", (code) => resolve({ exitCode: code ?? 0, stdout, stderr }));
  });
}

function psString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function listPackageEntries(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const packageEntries = [];
  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isSymbolicLink()) {
      packageEntries.push({ type: "symlink", path: absolutePath });
    } else if (entry.isDirectory()) {
      packageEntries.push(...await listPackageEntries(absolutePath));
    } else if (entry.isFile()) {
      packageEntries.push({ type: "file", path: absolutePath });
    }
  }
  return packageEntries;
}

async function listFiles(root) {
  return (await listPackageEntries(root))
    .filter((entry) => entry.type === "file")
    .map((entry) => entry.path);
}

async function copyDirectory(source, destination) {
  // 安装前 validateSkillPackage 已遍历并拒绝 symlink、路径逃逸和超限文件。
  // 大型受控 skill（模板、图标、脚本包）可能包含上万小文件。单线程递归复制在
  // Windows 上会长期占用安装目录，因此这里采用固定并发数复制；仍然只复制已验证
  // 的常规文件，不使用链接或外部命令。
  const files = await listFiles(source);
  await fs.mkdir(destination, { recursive: true });
  const concurrency = Math.min(32, Math.max(4, os.cpus().length * 2));
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, files.length) }, async () => {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= files.length) return;
      const file = files[index];
      const target = path.join(destination, path.relative(source, file));
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(file, target);
    }
  }));
}

function normalizeConflictMode(value, source) {
  // 内置和 inline 来源都可能由上层按名称选择；默认先检查冲突，避免覆盖
  // 用户自行安装或修改的同名 skill。
  if (value === undefined) return source.kind === "inline" || source.kind === "builtin" || source.kind === "bundled" ? "check" : "replace";
  if (value === "check" || value === "replace") return value;
  throw new Error("conflict must be check or replace");
}

function sameInstallation(existing, incoming) {
  if (!existing) return false;
  const existingRemoteId = existing.provenance?.remoteId;
  const incomingRemoteId = incoming.provenance?.remoteId;
  if (existingRemoteId && incomingRemoteId) {
    return existingRemoteId === incomingRemoteId && existing.revision === incoming.revision;
  }
  return existing.contentHash === incoming.contentHash;
}

function isInlineSkillSource(source) {
  return source && typeof source === "object" && !Array.isArray(source) && source.kind === INLINE_SKILL_SOURCE_KIND;
}

/**
 * 判断来源是否为已随 npm SDK 安装到本机的受控 skill pack。
 *
 * 它不是对普通本地目录开放的“大包开关”：调用者必须显式提供包身份、版本和期望
 * skill 名称，安装器仍会校验完整目录、路径白名单、大小、symlink 和 frontmatter。
 */
function isBundledSkillSource(source) {
  return source && typeof source === "object" && !Array.isArray(source) && source.kind === BUNDLED_SKILL_SOURCE_KIND;
}

/**
 * 解析已安装 SDK 中携带的完整 skill pack。
 *
 * 已发布 SDK 的 packageVersion 是不可变发行标识，因此 bundled skill 用它作为 revision。
 * 这样可避免每次安装都逐文件计算大型模板包的内容 hash；安全性仍由安装前的完整
 * 路径、symlink、文件数和大小校验保障，升级则由新的 SDK 版本显式触发。
 */
async function resolveBundledSkillSource(source) {
  const packageName = requiredString(source.packageName, "bundled skill packageName");
  const packageVersion = requiredString(source.packageVersion, "bundled skill packageVersion");
  const skillName = normalizeSkillName(requiredString(source.skillName, "bundled skill skillName"));
  const sourcePath = path.resolve(requiredString(source.path, "bundled skill path"));
  const stat = await fs.stat(sourcePath);
  if (!stat.isDirectory()) throw new Error("bundled skill path must be a directory");
  return {
    kind: "bundled",
    path: sourcePath,
    packagePolicy: BUNDLED_PACKAGE_POLICY,
    provenance: {
      type: "agent-skill-bundled",
      remoteId: `bundle:${packageName}:${skillName}`,
      sourceRepository: packageName,
      sourcePath: "skill-pack",
      revision: packageVersion
    }
  };
}

function normalizeInlineProvenance(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("inline skill source requires provenance");
  }
  return {
    type: requiredString(input.type, "inline provenance.type"),
    remoteId: optionalString(input.remoteId),
    catalogUrl: optionalString(input.catalogUrl),
    sourceUrl: optionalString(input.sourceUrl),
    sourceRepository: optionalString(input.sourceRepository),
    sourcePath: optionalString(input.sourcePath),
    revision: requiredString(input.revision, "inline provenance.revision")
  };
}

function isAllowedPackagePath(
  relativePath,
  allowedRootFiles = ALLOWED_ROOT_FILES,
  allowedRootDirs = ALLOWED_ROOT_DIRS
) {
  const normalized = toPosix(relativePath);
  if (normalized.includes("..") || path.isAbsolute(normalized)) return false;
  if (allowedRootFiles.has(normalized)) return true;
  const first = normalized.split("/")[0];
  return allowedRootDirs.has(first);
}

function normalizePackagePolicy(policy) {
  if (policy !== BUNDLED_PACKAGE_POLICY) {
    return {
      maxTotalBytes: MAX_TOTAL_BYTES,
      maxFileCount: MAX_FILE_COUNT,
      maxSingleFileBytes: MAX_SINGLE_FILE_BYTES,
      allowedRootFiles: ALLOWED_ROOT_FILES,
      allowedRootDirs: ALLOWED_ROOT_DIRS
    };
  }
  return BUNDLED_PACKAGE_POLICY;
}

function isUnsafeArchiveEntryName(name) {
  const normalized = name.replaceAll("\\", "/");
  if (normalized.startsWith("/") || /^[a-zA-Z]:\//.test(normalized)) return true;
  return normalized.split("/").some((segment) => segment === "..");
}

function parseSkillMetadata(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  if (!match) return {};
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return values;
}

function isInsideOrEqual(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function requiredString(value, label) {
  const normalized = optionalString(value);
  if (!normalized) throw new Error(`${label} is required`);
  return normalized;
}

function requiredContent(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required`);
  return value;
}

function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
