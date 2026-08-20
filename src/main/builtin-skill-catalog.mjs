/**
 * agent-skill 内置 skill catalog。
 *
 * 本文件声明随 SDK 和 runtime artifact 一起发布的只读 skill 包。它们不是
 * 运行时扫描根，也不会直接进入模型上下文；AgentSkill 只有在产品显式选择
 * 名称后，才会把对应包按既有受管安装流程写入唯一的 skillsPath。
 */

import crypto from "node:crypto";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeSkillName } from "./skill-index.mjs";
import { ASIN_RESEARCH_BUILTIN_SKILLS } from "./asin-research-builtin-skill-catalog.mjs";
import { EXPERT_BUILTIN_SKILLS } from "./expert-builtin-skill-catalog.mjs";

export const BUILTIN_SKILL_SOURCE_KIND = "agent-skill.builtin.v1";

const MODULE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const BUILTIN_SKILL_ROOT = path.resolve(MODULE_DIRECTORY, "../builtin-skills");
const SELF_SERVICE_CATALOG_PATH = path.resolve(MODULE_DIRECTORY, "self-service-builtin-skill-catalog.json");
const ECOSYSTEM_CATALOG_PATH = path.resolve(MODULE_DIRECTORY, "ecosystem-skill-catalog.json");
const CATALOG_CURSOR_VERSION = 1;
const DEFAULT_CATALOG_LIMIT = 50;
const MAX_CATALOG_LIMIT = 200;

// 这里是积木随版本发布的预制目录清单。描述只用于产品选择和诊断，完整说明
// 仍以安装后的 SKILL.md 为准。
const BASE_BUILTIN_SKILLS = [
  Object.freeze({
    id: "amazon-sku-profit-summary",
    name: "amazon-sku-profit-summary",
    version: "0.1.0",
    description: "用于 Amazon SKU/MSKU 利润核算、归因和利润汇总。"
  }),
  Object.freeze({
    id: "amazon-inventory-ledger-summary",
    name: "amazon-inventory-ledger-summary",
    version: "0.1.0",
    description: "用于 Amazon 库存分类账的数量核算、闭环和异常汇总。"
  }),
  Object.freeze({
    id: "amazon-operating-analysis",
    name: "amazon-operating-analysis",
    version: "0.1.0",
    description: "用于 Amazon 经营分析、测算、预测和经营决策辅助。"
  }),
  Object.freeze({
    id: "amazon-product-image-generation",
    name: "amazon-product-image-generation",
    version: "0.4.1",
    description: "用于 Amazon 商品白底主图、卖点图、场景图生成和版本化迭代。"
  }),
  Object.freeze({
    id: "ecommerce-product-video-generation",
    name: "ecommerce-product-video-generation",
    version: "0.1.0",
    description: "把一张真实商品照片和简单意图扩写为高质量商品视频提示词，并调用 Seedance 生成可交付 MP4；适用于电商商品展示、广告素材、详情页动态演示和社媒短视频，不处理真人或数字人视频。"
  }),
  Object.freeze({
    id: "skill-management",
    name: "skill-management",
    version: "0.2.0",
    description: "指导 Agent 查找、安装、激活、使用、创建、更新、删除和验证 Skill，并理解摘要、完整正文、references、assets 与受管路径的加载机制。适用于用户要求寻找能力、安装或移除 Skill、使用 Skill 资源、沉淀新能力或排查 Skill 可见性时。"
  }),
  ...ASIN_RESEARCH_BUILTIN_SKILLS,
  ...EXPERT_BUILTIN_SKILLS
];

// 自助上传只维护独立 JSON 数据文件，不需要解析或改写本模块源码。相同名称的
// 自助条目覆盖历史静态条目，因此既能新增 skill，也能升级早期内置 skill。
const SELF_SERVICE_BUILTIN_SKILLS = readSelfServiceCatalog();
const CORE_BUILTIN_SKILLS = Object.freeze(Array.from(new Map([
  ...BASE_BUILTIN_SKILLS,
  ...SELF_SERVICE_BUILTIN_SKILLS
].map((skill) => [skill.name, Object.freeze(normalizeCatalogEntry({ ...skill, collection: "core" }))])).values()));
const ECOSYSTEM_BUILTIN_SKILLS = Object.freeze(readEcosystemCatalog()
  .map((skill) => Object.freeze(normalizeCatalogEntry({ ...skill, collection: "ecosystem" }))));
const BUILTIN_SKILLS = Object.freeze([...CORE_BUILTIN_SKILLS, ...ECOSYSTEM_BUILTIN_SKILLS]);

const BUILTIN_SKILL_BY_NAME = new Map(BUILTIN_SKILLS.map((skill) => [skill.name, skill]));
const BUILTIN_SKILL_BY_LEGACY_ID = new Map(BUILTIN_SKILLS
  .filter((skill) => skill.legacyEcosystemId)
  .map((skill) => [skill.legacyEcosystemId, skill]));
if (BUILTIN_SKILL_BY_NAME.size !== BUILTIN_SKILLS.length) {
  throw new Error("builtin and ecosystem skill catalogs contain duplicate names");
}
if (BUILTIN_SKILL_BY_LEGACY_ID.size !== BUILTIN_SKILLS.filter((skill) => skill.legacyEcosystemId).length) {
  throw new Error("ecosystem skill catalog contains duplicate legacy ids");
}
const CATALOG_REVISION = crypto.createHash("sha256")
  .update(JSON.stringify(BUILTIN_SKILLS.map((skill) => [skill.name, skill.version, skill.contentHash ?? ""])))
  .digest("hex");

/**
 * 返回可供产品选择的内置 skill 元数据副本。
 *
 * 返回副本而不是内部数组，避免调用方意外修改运行时 catalog。
 */
export function listBuiltinSkills() {
  return CORE_BUILTIN_SKILLS.map(toLegacyBuiltinEntry);
}

/**
 * 查询随当前 artifact 发布的统一 Skill 目录。
 *
 * 目录仅表示可安装资源，不会安装、启用或注入任何 Skill。cursor 与筛选条件
 * 及当前 artifact revision 绑定，避免调用方误用其它查询或版本的游标。
 */
export function listSkillCatalog(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw catalogError("skill_catalog_query_invalid", "skill catalog query must be an object");
  }
  const filters = normalizeCatalogFilters(input);
  const fingerprint = catalogFingerprint(filters);
  const offset = input.cursor ? decodeCatalogCursor(input.cursor, fingerprint) : 0;
  const matches = BUILTIN_SKILLS.filter((skill) => matchesCatalogFilters(skill, filters));
  if (offset > matches.length) {
    throw catalogError("skill_catalog_cursor_invalid", "skill catalog cursor is outside the result set");
  }
  const items = matches.slice(offset, offset + filters.limit).map(cloneCatalogEntry);
  const nextOffset = offset + items.length;
  return {
    items,
    total: matches.length,
    filters: {
      collections: [...filters.collections],
      platforms: [...filters.platforms],
      sceneTags: [...filters.sceneTags],
      ...(filters.query ? { query: filters.query } : {})
    },
    ...(nextOffset < matches.length
      ? { nextCursor: encodeCatalogCursor({ offset: nextOffset, fingerprint }) }
      : {})
  };
}

export function getSkillCatalogEntry(nameOrLegacyId) {
  const skill = resolveCatalogEntry(nameOrLegacyId);
  return skill ? cloneCatalogEntry(skill) : undefined;
}

export function createCatalogSkillSource(nameOrLegacyId) {
  const skill = resolveCatalogEntry(nameOrLegacyId);
  if (!skill) throw catalogError("skill_catalog_entry_not_found", `Unknown catalog skill: ${nameOrLegacyId}`);
  return createBuiltinSkillSource(skill.name);
}

/**
 * 判断一个规范化 skill 名是否由当前 artifact 内置。
 */
export function isBuiltinSkillName(name) {
  try {
    return BUILTIN_SKILL_BY_NAME.has(normalizeSkillName(name));
  } catch {
    return false;
  }
}

/**
 * 为受管安装流程创建一个不可伪造的内置来源标记。
 *
 * 该对象不携带文件路径，实际路径只能在本模块内部解析，避免产品层把任意
 * 本地目录伪装成内置 skill。
 */
export function createBuiltinSkillSource(name) {
  const skillName = normalizeSkillName(name);
  if (!BUILTIN_SKILL_BY_NAME.has(skillName)) {
    throw new Error(`Unknown builtin skill: ${skillName}`);
  }
  return {
    kind: BUILTIN_SKILL_SOURCE_KIND,
    skillName
  };
}

/**
 * 把内置来源标记解析为既有安装器可处理的目录来源。
 *
 * revision 使用整个包的稳定 hash，而不是只看 SKILL.md；这样 reference 或
 * asset 更新也会触发受控升级检查。
 */
export async function resolveBuiltinSkillSource(source) {
  if (!isBuiltinSkillSource(source)) {
    throw new Error(`builtin source kind must be ${BUILTIN_SKILL_SOURCE_KIND}`);
  }
  const skillName = normalizeSkillName(source.skillName);
  const skill = BUILTIN_SKILL_BY_NAME.get(skillName);
  if (!skill) throw new Error(`Unknown builtin skill: ${skillName}`);

  const skillPath = path.resolve(BUILTIN_SKILL_ROOT, skill.name);
  if (!isInsideOrEqual(skillPath, BUILTIN_SKILL_ROOT)) {
    throw new Error("builtin skill path escapes catalog root");
  }
  const stat = await fs.stat(skillPath);
  if (!stat.isDirectory()) {
    throw new Error(`Builtin skill package is missing: ${skill.name}`);
  }

  const revisionHash = await hashDirectory(skillPath);
  return {
    kind: "builtin",
    path: skillPath,
    provenance: {
      type: "agent-skill-builtin",
      remoteId: `builtin:${skill.name}`,
      sourceRepository: "@xuanzhen-tech/agent-skill-brick",
      sourcePath: `src/builtin-skills/${skill.name}`,
      revision: `${skill.version}:${revisionHash}`
    }
  };
}

/**
 * 判断对象是否为内部内置来源标记。
 */
export function isBuiltinSkillSource(source) {
  return source
    && typeof source === "object"
    && !Array.isArray(source)
    && source.kind === BUILTIN_SKILL_SOURCE_KIND;
}

async function hashDirectory(root) {
  const files = await listFiles(root);
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    const relativePath = path.relative(root, file).replaceAll(path.sep, "/");
    hash.update(relativePath, "utf8");
    hash.update("\0", "utf8");
    hash.update(await fs.readFile(file));
    hash.update("\0", "utf8");
  }
  return hash.digest("hex");
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, "en"))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    } else {
      throw new Error(`Unsupported builtin skill entry: ${entryPath}`);
    }
  }
  return files;
}

function isInsideOrEqual(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function readSelfServiceCatalog() {
  const parsed = JSON.parse(fsSync.readFileSync(SELF_SERVICE_CATALOG_PATH, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error("self-service builtin skill catalog must be an array");
  }
  return parsed;
}

function readEcosystemCatalog() {
  const parsed = JSON.parse(fsSync.readFileSync(ECOSYSTEM_CATALOG_PATH, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error("ecosystem skill catalog must be an array");
  }
  return parsed;
}

function normalizeCatalogEntry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("builtin skill catalog entry must be an object");
  }
  const name = normalizeSkillName(input.name ?? input.id);
  const version = String(input.version ?? "").trim();
  const description = String(input.description ?? "").trim();
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Builtin skill ${name} version must use x.y.z.`);
  }
  if (!description) throw new Error(`Builtin skill ${name} description is required.`);
  const collection = input.collection === "ecosystem" ? "ecosystem" : "core";
  const displayName = optionalString(input.displayName ?? input.displayChineseName);
  const legacyEcosystemId = optionalString(input.legacyEcosystemId);
  const originKind = optionalString(input.originKind);
  const contentHash = optionalString(input.contentHash);
  const sourceRepository = optionalString(input.sourceRepository);
  const sourcePath = optionalString(input.sourcePath);
  const sourceLicense = optionalString(input.sourceLicense);
  const distributionStatus = optionalString(input.distributionStatus);
  return {
    id: name,
    name,
    version,
    description,
    collection,
    platforms: normalizeStringList(input.platforms),
    sceneTags: normalizeStringList(input.sceneTags),
    searchTags: normalizeStringList(input.searchTags),
    ...(displayName ? { displayName } : {}),
    ...(legacyEcosystemId ? { legacyEcosystemId } : {}),
    ...(originKind ? { originKind } : {}),
    ...(contentHash ? { contentHash } : {}),
    ...(sourceRepository ? { sourceRepository } : {}),
    ...(sourcePath ? { sourcePath } : {}),
    ...(sourceLicense ? { sourceLicense } : {}),
    ...(distributionStatus ? { distributionStatus } : {})
  };
}

function toLegacyBuiltinEntry(skill) {
  return {
    id: skill.id,
    name: skill.name,
    version: skill.version,
    description: skill.description
  };
}

function cloneCatalogEntry(skill) {
  return {
    ...skill,
    platforms: [...skill.platforms],
    sceneTags: [...skill.sceneTags],
    searchTags: [...skill.searchTags]
  };
}

function resolveCatalogEntry(nameOrLegacyId) {
  const raw = optionalString(nameOrLegacyId);
  if (!raw) return undefined;
  const legacyMatch = BUILTIN_SKILL_BY_LEGACY_ID.get(raw);
  if (legacyMatch) return legacyMatch;
  try {
    return BUILTIN_SKILL_BY_NAME.get(normalizeSkillName(raw));
  } catch {
    return undefined;
  }
}

function normalizeCatalogFilters(input) {
  const collections = normalizeFilterList(input.collections, ["core", "ecosystem"], "collections");
  if (collections.some((collection) => collection !== "core" && collection !== "ecosystem")) {
    throw catalogError("skill_catalog_query_invalid", "collections only supports core and ecosystem");
  }
  const platforms = normalizeFilterList(input.platforms, undefined, "platforms");
  const sceneTags = normalizeFilterList(input.sceneTags, undefined, "sceneTags");
  const query = optionalString(input.query)?.toLowerCase();
  const limit = input.limit === undefined ? DEFAULT_CATALOG_LIMIT : Number(input.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_CATALOG_LIMIT) {
    throw catalogError("skill_catalog_limit_invalid", `skill catalog limit must be between 1 and ${MAX_CATALOG_LIMIT}`);
  }
  return { collections, platforms, sceneTags, query, limit };
}

function normalizeFilterList(value, fallback, field) {
  if (value === undefined) return fallback ? [...fallback] : [];
  if (!Array.isArray(value)) {
    throw catalogError("skill_catalog_query_invalid", `${field} must be an array`);
  }
  return [...new Set(value.map((item) => String(item).trim().toLowerCase()).filter(Boolean))];
}

function matchesCatalogFilters(skill, filters) {
  if (!filters.collections.includes(skill.collection)) return false;
  if (filters.platforms.length && !filters.platforms.some((value) => skill.platforms.includes(value))) return false;
  if (filters.sceneTags.length && !filters.sceneTags.some((value) => skill.sceneTags.includes(value))) return false;
  if (!filters.query) return true;
  return [
    skill.id,
    skill.name,
    skill.displayName,
    skill.description,
    skill.legacyEcosystemId,
    ...skill.platforms,
    ...skill.sceneTags,
    ...skill.searchTags
  ].filter(Boolean).join("\n").toLowerCase().includes(filters.query);
}

function catalogFingerprint(filters) {
  return crypto.createHash("sha256").update(JSON.stringify({
    revision: CATALOG_REVISION,
    collections: filters.collections,
    platforms: filters.platforms,
    sceneTags: filters.sceneTags,
    query: filters.query ?? ""
  })).digest("hex");
}

function encodeCatalogCursor({ offset, fingerprint }) {
  return Buffer.from(JSON.stringify({ v: CATALOG_CURSOR_VERSION, offset, fingerprint }), "utf8").toString("base64url");
}

function decodeCatalogCursor(cursor, fingerprint) {
  try {
    const decoded = JSON.parse(Buffer.from(String(cursor), "base64url").toString("utf8"));
    if (
      decoded.v !== CATALOG_CURSOR_VERSION
      || !Number.isInteger(decoded.offset)
      || decoded.offset < 0
      || decoded.fingerprint !== fingerprint
    ) {
      throw new Error("invalid cursor payload");
    }
    return decoded.offset;
  } catch {
    throw catalogError("skill_catalog_cursor_invalid", "skill catalog cursor is invalid or belongs to another query");
  }
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim().toLowerCase()).filter(Boolean))];
}

function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function catalogError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
