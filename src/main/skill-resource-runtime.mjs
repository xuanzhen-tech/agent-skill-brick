/**
 * skill 包资源的受控访问层。
 *
 * SKILL.md 以外的 references、workflows、assets 和 templates 同样属于 skill 的正式内容，但不能让
 * 上层把它们当作任意工作区文件读取。本模块只接受已索引 skill 的根目录，严格
 * 校验相对路径、真实路径和文件类型，并分别提供文本 reference 读取与二进制
 * asset 定位能力；scripts 永远不在这里暴露或执行。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const MAX_SKILL_REFERENCE_BYTES = 256 * 1024;

const RESOURCE_DIRECTORIES = ["references", "workflows", "assets", "templates"];
const TEXT_RESOURCE_DIRECTORIES = new Set(["references", "workflows"]);
const ASSET_RESOURCE_DIRECTORIES = new Set(["assets", "templates"]);
const TEXT_REFERENCE_EXTENSIONS = new Set([
  ".csv",
  ".html",
  ".htm",
  ".json",
  ".md",
  ".rst",
  ".text",
  ".toml",
  ".tsv",
  ".txt",
  ".xml",
  ".yaml",
  ".yml"
]);

/**
 * 返回已经安装 skill 的轻量资源清单。
 *
 * 清单只包含模型选择资源所需的路径和大小，不读取全文，也不会把 assets
 * 混进 prompt。遇到软链接或逃逸路径时跳过该条目，实际读取时仍会再次校验。
 */
export async function listSkillResources({ skill, skillFilePath } = {}) {
  const context = await resolveSkillResourceContext({ skill, skillFilePath });
  const resources = [];

  for (const directory of RESOURCE_DIRECTORIES) {
    const root = path.join(context.skillRoot, directory);
    const entries = await listSafeResourceEntries({
      skillRoot: context.skillRoot,
      resourceRoot: root,
      directory
    });
    resources.push(...entries);
  }

  return resources.sort((left, right) => {
    const kindOrder = left.kind.localeCompare(right.kind, "en");
    return kindOrder || left.path.localeCompare(right.path, "en");
  });
}

/**
 * 读取一个 reference 或 workflow 文本，并返回可作为专门上下文块保存的 payload。
 */
export async function readSkillReference({ skill, skillFilePath, resourcePath } = {}) {
  const resolved = await resolveSkillResourceFile({
    skill,
    skillFilePath,
    resourcePath,
    directory: normalizeTextResourceDirectory(resourcePath)
  });
  const extension = path.extname(resolved.realFilePath).toLowerCase();
  if (!TEXT_REFERENCE_EXTENSIONS.has(extension)) {
    throw new Error(`Skill reference must be a UTF-8 text file: ${resolved.resourcePath}`);
  }
  if (resolved.stat.size > MAX_SKILL_REFERENCE_BYTES) {
    throw new Error(`Skill reference exceeds ${MAX_SKILL_REFERENCE_BYTES} bytes: ${resolved.resourcePath}`);
  }

  const buffer = await fs.readFile(resolved.realFilePath);
  const content = decodeUtf8Text(buffer, resolved.resourcePath);
  return {
    skillId: resolved.skill.id,
    skillName: resolved.skill.name,
    path: resolved.resourcePath,
    content,
    contentHash: sha256(buffer),
    bytes: buffer.byteLength
  };
}

/**
 * 解析一个 asset 或 template 的真实文件位置。
 *
 * 这里不复制文件，避免 AgentSkill 越界承担工作区副作用；调用方只能使用
 * 返回的受控源文件和 hash，随后按自身的固定策略物化副本。
 */
export async function resolveSkillAsset({ skill, skillFilePath, resourcePath } = {}) {
  const resolved = await resolveSkillResourceFile({
    skill,
    skillFilePath,
    resourcePath,
    directory: normalizeAssetResourceDirectory(resourcePath)
  });
  const contentHash = await hashFile(resolved.realFilePath);
  return {
    skillId: resolved.skill.id,
    skillName: resolved.skill.name,
    path: resolved.resourcePath,
    fileName: path.basename(resolved.realFilePath),
    absolutePath: resolved.realFilePath,
    contentHash,
    bytes: resolved.stat.size
  };
}

async function resolveSkillResourceContext({ skill, skillFilePath } = {}) {
  if (!skill || typeof skill !== "object" || Array.isArray(skill)) {
    throw new Error("skill metadata is required");
  }
  if (typeof skillFilePath !== "string" || !skillFilePath.trim()) {
    throw new Error(`Skill ${String(skill.name ?? "unknown")} is missing SKILL.md path.`);
  }

  const resolvedSkillFilePath = path.resolve(skillFilePath);
  if (path.basename(resolvedSkillFilePath).toLowerCase() !== "skill.md") {
    throw new Error(`Skill ${String(skill.name ?? "unknown")} path must point to SKILL.md.`);
  }
  const skillRoot = await fs.realpath(path.dirname(resolvedSkillFilePath));
  const realSkillFilePath = await fs.realpath(resolvedSkillFilePath);
  assertInside(skillRoot, realSkillFilePath, "SKILL.md escapes its skill directory");
  return {
    skill,
    skillRoot,
    skillFilePath: realSkillFilePath
  };
}

async function listSafeResourceEntries({ skillRoot, resourceRoot, directory }) {
  let realResourceRoot;
  try {
    const stat = await fs.lstat(resourceRoot);
    if (stat.isSymbolicLink()) return [];
    if (!stat.isDirectory()) return [];
    realResourceRoot = await fs.realpath(resourceRoot);
    assertInside(skillRoot, realResourceRoot, `${directory} escapes skill directory`);
  } catch (error) {
    if (isMissingPathError(error)) return [];
    throw error;
  }

  const resources = [];
  await walkResourceDirectory({
    skillRoot,
    resourceRoot: realResourceRoot,
    currentDirectory: realResourceRoot,
    directory,
    resources
  });
  return resources;
}

async function walkResourceDirectory({ skillRoot, resourceRoot, currentDirectory, directory, resources }) {
  const entries = await fs.readdir(currentDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const candidate = path.join(currentDirectory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      await walkResourceDirectory({ skillRoot, resourceRoot, currentDirectory: candidate, directory, resources });
      continue;
    }
    if (!entry.isFile()) continue;

    const realFilePath = await fs.realpath(candidate);
    if (!isInside(resourceRoot, realFilePath) || !isInside(skillRoot, realFilePath)) continue;
    const stat = await fs.stat(realFilePath);
    if (TEXT_RESOURCE_DIRECTORIES.has(directory)) {
      const extension = path.extname(realFilePath).toLowerCase();
      if (!TEXT_REFERENCE_EXTENSIONS.has(extension) || stat.size > MAX_SKILL_REFERENCE_BYTES) continue;
    }
    resources.push({
      kind: TEXT_RESOURCE_DIRECTORIES.has(directory) ? "reference" : "asset",
      path: toPosix(path.join(directory, path.relative(resourceRoot, realFilePath))),
      bytes: stat.size
    });
  }
}

async function resolveSkillResourceFile({ skill, skillFilePath, resourcePath, directory }) {
  const context = await resolveSkillResourceContext({ skill, skillFilePath });
  const normalizedPath = normalizeResourcePath(resourcePath, directory);
  const resourceRoot = path.resolve(context.skillRoot, directory);
  const candidatePath = path.resolve(context.skillRoot, ...normalizedPath.split("/"));
  assertInside(context.skillRoot, candidatePath, `Skill resource escapes skill directory: ${normalizedPath}`);
  assertInside(resourceRoot, candidatePath, `Skill resource escapes ${directory}: ${normalizedPath}`);

  const rootStat = await fs.lstat(resourceRoot);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    throw new Error(`Skill ${directory} directory is unavailable: ${directory}`);
  }
  const realResourceRoot = await fs.realpath(resourceRoot);
  assertInside(context.skillRoot, realResourceRoot, `Skill ${directory} directory escapes skill directory.`);

  const entryStat = await fs.lstat(candidatePath);
  if (entryStat.isSymbolicLink() || !entryStat.isFile()) {
    throw new Error(`Skill resource must be a regular file: ${normalizedPath}`);
  }
  const realFilePath = await fs.realpath(candidatePath);
  assertInside(realResourceRoot, realFilePath, `Skill resource escapes ${directory}: ${normalizedPath}`);
  assertInside(context.skillRoot, realFilePath, `Skill resource escapes skill directory: ${normalizedPath}`);
  const stat = await fs.stat(realFilePath);
  if (!stat.isFile()) throw new Error(`Skill resource must be a regular file: ${normalizedPath}`);

  return {
    ...context,
    resourcePath: normalizedPath,
    realFilePath,
    stat
  };
}

function normalizeResourcePath(value, directory) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("skill resource path is required");
  }
  const normalized = value.trim().replaceAll("\\", "/").replace(/^\.\/+/, "");
  if (!normalized.startsWith(`${directory}/`)) {
    throw new Error(`Skill resource path must start with ${directory}/.`);
  }
  const segments = normalized.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`Invalid skill resource path: ${value}`);
  }
  const portable = path.posix.normalize(normalized);
  if (portable !== normalized || path.posix.isAbsolute(portable) || portable.startsWith("../")) {
    throw new Error(`Invalid skill resource path: ${value}`);
  }
  return portable;
}

/**
 * 将 references/ 与 workflows/ 统一作为只读文本资源。
 *
 * action 名仍保持 read_reference，避免引入第二个模型工具；workflow 只是另一类
 * 按需说明文件，不会被自动塞进上下文。
 */
function normalizeTextResourceDirectory(resourcePath) {
  return normalizeResourceDirectory(resourcePath, TEXT_RESOURCE_DIRECTORIES, "references or workflows");
}

/**
 * 将 assets/ 与 templates/ 统一作为可物化的二进制资源。
 */
function normalizeAssetResourceDirectory(resourcePath) {
  return normalizeResourceDirectory(resourcePath, ASSET_RESOURCE_DIRECTORIES, "assets or templates");
}

function normalizeResourceDirectory(resourcePath, allowedDirectories, label) {
  if (typeof resourcePath !== "string" || !resourcePath.trim()) {
    throw new Error("skill resource path is required");
  }
  const normalized = resourcePath.trim().replaceAll("\\", "/").replace(/^\.\/+/, "");
  const directory = normalized.split("/", 1)[0];
  if (!allowedDirectories.has(directory)) {
    throw new Error(`Skill resource path must start with ${label}/.`);
  }
  return directory;
}

function decodeUtf8Text(buffer, resourcePath) {
  let content;
  try {
    content = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new Error(`Skill reference is not valid UTF-8 text: ${resourcePath}`);
  }
  if (content.includes("\u0000")) {
    throw new Error(`Skill reference must not contain binary data: ${resourcePath}`);
  }
  return content.replace(/^\uFEFF/, "");
}

async function hashFile(filePath) {
  const hash = crypto.createHash("sha256");
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.allocUnsafe(64 * 1024);
    let position = 0;
    while (true) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
      if (bytesRead <= 0) break;
      hash.update(buffer.subarray(0, bytesRead));
      position += bytesRead;
    }
  } finally {
    await handle.close();
  }
  return hash.digest("hex");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function assertInside(parentPath, childPath, message) {
  if (!isInside(parentPath, childPath)) throw new Error(message);
}

function isInside(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function isMissingPathError(error) {
  return error && typeof error === "object" && error.code === "ENOENT";
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}
