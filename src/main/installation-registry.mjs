/**
 * 受管 skill 安装记录的读写工具。
 *
 * 本模块把安装来源、远端身份和内容版本集中保存在 skills 根目录下的隐藏清单中。
 * 它不扫描或加载 SKILL.md，避免把来源信息混入模型上下文；扫描与激活仍由
 * skill-index 和 AgentSkill 负责。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const INSTALLATION_REGISTRY_FILE = ".agent-skill-installations.json";
const INSTALLATION_REGISTRY_SCHEMA = "agent-skill.installations.v1";

export async function listManagedSkillInstallations({ managedRoot }) {
  const registry = await readInstallationRegistry(managedRoot);
  return Object.values(registry.installations)
    .sort((left, right) => left.skillName.localeCompare(right.skillName, "en"));
}

export async function getManagedSkillInstallation({ managedRoot, skillName }) {
  const registry = await readInstallationRegistry(managedRoot);
  return registry.installations[skillName];
}

export async function setManagedSkillInstallation({ managedRoot, record }) {
  const registry = await readInstallationRegistry(managedRoot);
  registry.installations[record.skillName] = normalizeInstallationRecord(record);
  await writeInstallationRegistry(managedRoot, registry);
  return registry.installations[record.skillName];
}

export async function removeManagedSkillInstallation({ managedRoot, skillName }) {
  const registry = await readInstallationRegistry(managedRoot);
  const removed = registry.installations[skillName];
  if (!removed) return undefined;
  delete registry.installations[skillName];
  await writeInstallationRegistry(managedRoot, registry);
  return removed;
}

export function createManagedSkillInstallation(input = {}) {
  return normalizeInstallationRecord({
    skillName: input.skillName,
    version: input.version,
    contentHash: input.contentHash,
    revision: input.revision ?? input.contentHash,
    sourceKind: input.sourceKind,
    provenance: input.provenance,
    installedAt: input.installedAt ?? new Date().toISOString()
  });
}

async function readInstallationRegistry(managedRoot) {
  const filePath = registryPath(managedRoot);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== INSTALLATION_REGISTRY_SCHEMA || !isPlainObject(parsed.installations)) {
      throw new Error("安装记录格式无效");
    }
    const installations = {};
    for (const [skillName, record] of Object.entries(parsed.installations)) {
      installations[skillName] = normalizeInstallationRecord(record);
    }
    return {
      schemaVersion: INSTALLATION_REGISTRY_SCHEMA,
      installations
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        schemaVersion: INSTALLATION_REGISTRY_SCHEMA,
        installations: {}
      };
    }
    throw new Error(`无法读取 skill 安装记录：${error instanceof Error ? error.message : String(error)}`);
  }
}

async function writeInstallationRegistry(managedRoot, registry) {
  const root = path.resolve(managedRoot);
  await fs.mkdir(root, { recursive: true });
  const filePath = registryPath(root);
  const temporaryPath = path.join(root, `.${INSTALLATION_REGISTRY_FILE}.${crypto.randomUUID()}.tmp`);
  const content = `${JSON.stringify({
    schemaVersion: INSTALLATION_REGISTRY_SCHEMA,
    installations: registry.installations
  }, null, 2)}\n`;
  await fs.writeFile(temporaryPath, content, "utf8");
  try {
    await fs.rename(temporaryPath, filePath);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
}

function normalizeInstallationRecord(input) {
  if (!isPlainObject(input)) throw new Error("安装记录必须是对象");
  const skillName = requiredString(input.skillName, "skillName");
  const version = requiredString(input.version, "version");
  const contentHash = requiredSha256(input.contentHash, "contentHash");
  const revision = requiredString(input.revision, "revision");
  const sourceKind = requiredString(input.sourceKind, "sourceKind");
  const installedAt = requiredString(input.installedAt, "installedAt");
  const provenance = normalizeProvenance(input.provenance);
  return {
    skillName,
    version,
    contentHash,
    revision,
    sourceKind,
    provenance,
    installedAt
  };
}

function normalizeProvenance(input) {
  if (!isPlainObject(input)) return { type: "local" };
  const output = { type: optionalString(input.type) ?? "local" };
  for (const key of ["remoteId", "catalogUrl", "sourceUrl", "sourceRepository", "sourcePath"]) {
    const value = optionalString(input[key]);
    if (value) output[key] = value;
  }
  return output;
}

function registryPath(managedRoot) {
  return path.join(path.resolve(managedRoot), INSTALLATION_REGISTRY_FILE);
}

function requiredString(value, label) {
  const normalized = optionalString(value);
  if (!normalized) throw new Error(`安装记录缺少 ${label}`);
  return normalized;
}

function requiredSha256(value, label) {
  const normalized = requiredString(value, label).toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalized)) throw new Error(`安装记录的 ${label} 必须是 SHA-256`);
  return normalized;
}

function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
