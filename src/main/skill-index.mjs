/**
 * Skill root scanner and agent-skill.index.v1 builder.
 *
 * This module turns multiple skill roots into one deterministic index. It owns
 * precedence, SKILL.md metadata extraction, content hashes, and lightweight
 * diagnostics. It never executes skill scripts or imports skill code.
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const INDEX_SCHEMA_VERSION = "agent-skill.index.v1";
const MAX_SKILL_FILE_BYTES = 256 * 1024;
const MAX_SKILLS_PER_ROOT = 300;

export function createAgentSkillIndex({ roots = [], generatedAt = new Date().toISOString() } = {}) {
  const merged = new Map();
  const diagnostics = [];
  for (const root of roots) {
    for (const diagnostic of root.diagnostics ?? []) diagnostics.push(diagnostic);
    for (const skill of root.skills ?? []) {
      // Roots are passed highest-precedence first, so keep the first skill name.
      if (!merged.has(skill.name)) {
        merged.set(skill.name, skill);
      }
    }
  }
  return {
    schemaVersion: INDEX_SCHEMA_VERSION,
    generatedAt,
    roots: roots.map((root) => ({
      source: root.source,
      path: root.path,
      precedence: root.precedence,
      skillCount: root.skills?.length ?? 0
    })),
    skills: [...merged.values()].sort((left, right) => left.name.localeCompare(right.name, "en")),
    diagnostics
  };
}

export function validateAgentSkillIndex(index) {
  const errors = [];
  if (!index || typeof index !== "object" || Array.isArray(index)) {
    return { ok: false, errors: ["index must be an object"] };
  }
  if (index.schemaVersion !== INDEX_SCHEMA_VERSION) errors.push(`schemaVersion must be ${INDEX_SCHEMA_VERSION}`);
  if (!Array.isArray(index.roots)) errors.push("roots must be an array");
  if (!Array.isArray(index.skills)) errors.push("skills must be an array");
  for (const [indexNumber, skill] of (index.skills ?? []).entries()) {
    validateSkillRecord(skill, `skills[${indexNumber}]`, errors);
  }
  return { ok: errors.length === 0, errors, value: errors.length === 0 ? index : undefined };
}

export async function scanSkillRoots(config) {
  const roots = resolveSkillRoots(config);
  const scanned = [];
  for (const [precedence, root] of roots.entries()) {
    scanned.push(await scanRoot({ ...root, precedence }));
  }
  return createAgentSkillIndex({ roots: scanned });
}

export function resolveSkillRoots(config) {
  // Order matters: createAgentSkillIndex keeps the first skill with a given
  // name, so this list is the precedence policy in executable form.
  const roots = [
    { source: "workspace", path: path.join(config.workspace, "skills") },
    { source: "project", path: path.join(config.workspace, ".agents", "skills") },
    { source: "managed", path: config.managedRoot },
    { source: "user", path: path.join(homeDir(), ".agents", "skills") }
  ];
  if (config.artifactSkillsRoot) {
    roots.push({ source: "artifact", path: path.join(config.artifactSkillsRoot, "skills") });
  }
  for (const extraDir of config.extraDirs ?? []) {
    roots.push({ source: "extra", path: extraDir });
  }
  return roots;
}

export async function writeSkillIndex(indexPath, index) {
  const validation = validateAgentSkillIndex(index);
  if (!validation.ok) {
    throw new Error(`Invalid skill index: ${validation.errors.join("; ")}`);
  }
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  await fs.writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  return indexPath;
}

async function scanRoot(root) {
  const diagnostics = [];
  const skills = [];
  const rootPath = path.resolve(root.path);
  let entries;
  try {
    entries = await fs.readdir(rootPath, { withFileTypes: true });
  } catch {
    return { ...root, path: rootPath, skills, diagnostics: [{ level: "info", message: `Skill root not found: ${rootPath}` }] };
  }

  let candidateCount = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    candidateCount += 1;
    if (candidateCount > MAX_SKILLS_PER_ROOT) {
      diagnostics.push({ level: "warn", message: `Skill root has more than ${MAX_SKILLS_PER_ROOT} candidates: ${rootPath}` });
      break;
    }
    const skillDir = path.join(rootPath, entry.name);
    const result = await readSkillPackage({ skillDir, source: root.source });
    if (result.skill) skills.push(result.skill);
    diagnostics.push(...result.diagnostics);
  }
  return { ...root, path: rootPath, skills, diagnostics };
}

async function readSkillPackage({ skillDir, source }) {
  const diagnostics = [];
  const skillFile = path.join(skillDir, "SKILL.md");
  try {
    const stat = await fs.stat(skillFile);
    if (!stat.isFile()) {
      return { diagnostics: [{ level: "warn", message: `SKILL.md is not a file: ${skillFile}` }] };
    }
    if (stat.size > MAX_SKILL_FILE_BYTES) {
      return { diagnostics: [{ level: "warn", message: `SKILL.md exceeds ${MAX_SKILL_FILE_BYTES} bytes: ${skillFile}` }] };
    }
    const realSkillDir = await fs.realpath(skillDir);
    const realSkillFile = await fs.realpath(skillFile);
    if (!isInsideOrEqual(realSkillFile, realSkillDir)) {
      return { diagnostics: [{ level: "warn", message: `SKILL.md escapes skill directory: ${skillFile}` }] };
    }
    const content = await fs.readFile(realSkillFile, "utf8");
    const frontmatter = parseFrontmatter(content);
    const name = normalizeSkillName(frontmatter.name ?? path.basename(skillDir));
    const description = frontmatter.description?.trim();
    if (!description) {
      return { diagnostics: [{ level: "warn", message: `Skill is missing description: ${skillFile}` }] };
    }
    return {
      skill: {
        id: name,
        name,
        version: frontmatter.version ?? "0.1.0",
        description,
        path: realSkillFile,
        source,
        capabilities: parseListField(frontmatter.capabilities),
        requiredTools: parseListField(frontmatter.requiredTools),
        optionalTools: parseListField(frontmatter.optionalTools),
        requiredEnv: parseListField(frontmatter.requiredEnv),
        enabled: true,
        contentHash: sha256(content),
        bytes: Buffer.byteLength(content, "utf8")
      },
      diagnostics
    };
  } catch {
    return { diagnostics: [{ level: "warn", message: `Unable to read skill package: ${skillDir}` }] };
  }
}

function validateSkillRecord(skill, pathLabel, errors) {
  if (!skill || typeof skill !== "object" || Array.isArray(skill)) {
    errors.push(`${pathLabel} must be an object`);
    return;
  }
  for (const field of ["id", "name", "description", "path", "source", "contentHash"]) {
    if (typeof skill[field] !== "string" || !skill[field].trim()) errors.push(`${pathLabel}.${field} is required`);
  }
  for (const field of ["capabilities", "requiredTools", "optionalTools", "requiredEnv"]) {
    if (!Array.isArray(skill[field])) errors.push(`${pathLabel}.${field} must be an array`);
  }
  if (typeof skill.enabled !== "boolean") errors.push(`${pathLabel}.enabled must be boolean`);
  if (!Number.isInteger(skill.bytes) || skill.bytes < 0) errors.push(`${pathLabel}.bytes must be a non-negative integer`);
}

function parseFrontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  if (!match) return {};
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    values[key] = value;
  }
  return values;
}

function parseListField(value) {
  if (!value) return [];
  return String(value)
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
}

export function normalizeSkillName(input) {
  const normalized = String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  if (!normalized) throw new Error("skill name is required");
  if (normalized.includes("..") || normalized.includes("/") || normalized.includes("\\")) {
    throw new Error("skill name must not contain path traversal");
  }
  return normalized;
}

function isInsideOrEqual(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function homeDir() {
  return process.env.USERPROFILE || process.env.HOME || process.cwd();
}
