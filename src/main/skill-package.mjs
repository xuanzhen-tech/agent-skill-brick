/**
 * skill 包校验和 managed install 操作。
 *
 * 本模块是 managed skills 的唯一写入方。它接受本地目录、本地 zip 文件、
 * HTTP(S) zip 文件和 registry-index JSON 条目，并在替换 managed 副本前
 * 校验暂存包。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

import { normalizeSkillName } from "./skill-index.mjs";

const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const MAX_FILE_COUNT = 500;
const MAX_SINGLE_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_ROOT_FILES = new Set(["SKILL.md"]);
const ALLOWED_ROOT_DIRS = new Set(["references", "scripts", "assets"]);

export async function validateSkillPackage(skillDir) {
  const root = path.resolve(skillDir);
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
  if (files.length > MAX_FILE_COUNT) {
    diagnostics.push(`skill package contains more than ${MAX_FILE_COUNT} files`);
  }
  let totalBytes = 0;
  for (const file of files) {
    const relativePath = toPosix(path.relative(root, file));
    if (!isAllowedPackagePath(relativePath)) {
      diagnostics.push(`unsupported skill package path: ${relativePath}`);
    }
    const stat = await fs.stat(file);
    totalBytes += stat.size;
    if (stat.size > MAX_SINGLE_FILE_BYTES) diagnostics.push(`file exceeds ${MAX_SINGLE_FILE_BYTES} bytes: ${relativePath}`);
  }
  if (totalBytes > MAX_TOTAL_BYTES) diagnostics.push(`skill package exceeds ${MAX_TOTAL_BYTES} bytes`);

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

export async function installSkillPackage({ source, managedRoot }) {
  const resolvedSource = await resolveInstallSource(source);
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-install-"));
  try {
    const stagedDir = await stageInstallSource(resolvedSource, tempRoot);
    const skillDir = await resolveSkillDirectory(stagedDir);
    const validation = await validateSkillPackage(skillDir);
    if (!validation.valid) {
      throw new Error(`Invalid skill package: ${validation.diagnostics.join("; ")}`);
    }
    const skillName = normalizeSkillName(validation.metadata.name);
    const destination = path.resolve(managedRoot, skillName);
    // 规范化后的 skill name 理论上已经安全；这里在替换文件的位置再次显式
    // 检查写入边界。
    if (!isInsideOrEqual(destination, path.resolve(managedRoot))) {
      throw new Error("skill destination escapes managed root");
    }
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.rm(destination, { recursive: true, force: true });
    await copyDirectory(skillDir, destination);
    return {
      installed: true,
      name: skillName,
      managedRoot: path.resolve(managedRoot),
      path: destination,
      source: resolvedSource.kind,
      validation
    };
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

export async function removeManagedSkill({ skill, managedRoot }) {
  const skillName = normalizeSkillName(skill);
  const destination = path.resolve(managedRoot, skillName);
  if (!isInsideOrEqual(destination, path.resolve(managedRoot))) {
    throw new Error("skill destination escapes managed root");
  }
  await fs.rm(destination, { recursive: true, force: true });
  return {
    removed: true,
    name: skillName,
    path: destination
  };
}

async function resolveInstallSource(source) {
  if (!source) throw new Error("install source is required");
  if (/^https?:\/\//i.test(source)) {
    // v1 的 registry 刻意保持很小：它只指向可安装 skill archive，选择策略
    // 后续可以在不改变本地安装流程的情况下演进。
    if (source.endsWith(".json")) {
      const registry = await fetchJson(source);
      const first = Array.isArray(registry.skills) ? registry.skills[0] : undefined;
      if (!first?.url) throw new Error("registry index does not contain skills[0].url");
      return { kind: "url", url: first.url };
    }
    return { kind: "url", url: source };
  }
  const absolutePath = path.resolve(source);
  const stat = await fs.stat(absolutePath);
  return stat.isDirectory()
    ? { kind: "directory", path: absolutePath }
    : { kind: "zip", path: absolutePath };
}

async function stageInstallSource(source, tempRoot) {
  if (source.kind === "directory") return source.path;
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
  const files = await listFiles(source);
  for (const file of files) {
    const relativePath = path.relative(source, file);
    const target = path.join(destination, relativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(file, target);
  }
}

function isAllowedPackagePath(relativePath) {
  const normalized = toPosix(relativePath);
  if (normalized.includes("..") || path.isAbsolute(normalized)) return false;
  if (ALLOWED_ROOT_FILES.has(normalized)) return true;
  const first = normalized.split("/")[0];
  return ALLOWED_ROOT_DIRS.has(first);
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

export function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
