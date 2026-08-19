/**
 * 将生态服务中已经翻译和加工的 Skill 固化为离线内置资源。
 *
 * 该脚本只供维护者显式运行；SDK 构建、安装和运行时绝不会访问此服务。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { listBuiltinSkills } from "../main/builtin-skill-catalog.mjs";
import { normalizeSkillName } from "../main/skill-index.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../..");
const builtinRoot = path.join(repoRoot, "src", "builtin-skills");
const catalogPath = path.join(repoRoot, "src", "main", "ecosystem-skill-catalog.json");
const sourceBase = process.env.AGENT_SKILL_ECOSYSTEM_API_BASE ?? "http://47.109.82.99/api/ecosystem";
const expectedCount = 203;
const previousCatalog = await readOptionalCatalog(catalogPath);

const list = await fetchJson(`${sourceBase}/skills?limit=500`);
if (!Array.isArray(list) || list.length !== expectedCount) {
  throw new Error(`Expected ${expectedCount} ecosystem skills, received ${Array.isArray(list) ? list.length : "invalid response"}.`);
}

const details = await mapConcurrent(list, 8, async (entry) => {
  const detail = await fetchJson(`${sourceBase}/skills/${encodeURIComponent(entry.id)}`);
  if (!detail?.content?.trim()) throw new Error(`Ecosystem skill has no processed content: ${entry.id}`);
  return detail;
});

const coreNames = new Set(listBuiltinSkills().map((entry) => entry.name));
const names = new Set();
const legacyIds = new Set();
const catalog = [];

for (const detail of details.sort((left, right) => left.id.localeCompare(right.id, "en"))) {
  const name = normalizeSkillName(detail.name);
  if (coreNames.has(name)) throw new Error(`Ecosystem skill collides with core skill: ${name}`);
  if (names.has(name)) throw new Error(`Duplicate ecosystem skill name: ${name}`);
  if (legacyIds.has(detail.id)) throw new Error(`Duplicate ecosystem legacy id: ${detail.id}`);
  names.add(name);
  legacyIds.add(detail.id);

  const searchableText = [
    detail.name,
    detail.displayChineseName,
    detail.description,
    detail.sourcePath
  ].filter(Boolean).join("\n");
  const platforms = inferPlatforms(searchableText, detail.platformId);
  const sceneTags = inferSceneTags(searchableText);
  const searchTags = inferSearchTags(detail, platforms, sceneTags);
  const skillText = renderSkill({ detail, name, platforms, sceneTags, searchTags });
  const contentHash = sha256(skillText);
  const skillDirectory = path.join(builtinRoot, name);
  assertInside(skillDirectory, builtinRoot);
  await fs.mkdir(skillDirectory, { recursive: true });
  await fs.writeFile(path.join(skillDirectory, "SKILL.md"), skillText, "utf8");

  catalog.push({
    id: name,
    name,
    version: "0.1.0",
    description: detail.description.trim(),
    displayName: detail.displayChineseName?.trim() || detail.name.trim(),
    collection: "ecosystem",
    platforms,
    sceneTags,
    searchTags,
    legacyEcosystemId: detail.id,
    originKind: detail.kind,
    sourceRepository: detail.sourceRepository,
    sourcePath: detail.sourcePath,
    sourceLicense: sourceLicense(detail.sourceRepository),
    distributionStatus: detail.sourceRepository === "noique/cross-border-ecommerce-skills"
      ? "review-required"
      : "redistributable",
    contentHash
  });
}

for (const previous of previousCatalog) {
  if (!previous?.name || names.has(previous.name)) continue;
  const staleDirectory = path.join(builtinRoot, normalizeSkillName(previous.name));
  assertInside(staleDirectory, builtinRoot);
  await fs.rm(staleDirectory, { recursive: true, force: true });
}

await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`[import-ecosystem-skills] wrote ${catalog.length} offline skills`);
console.log(`[import-ecosystem-skills] catalog ${path.relative(repoRoot, catalogPath)}`);

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Request failed ${response.status}: ${url}`);
  return await response.json();
}

async function readOptionalCatalog(filePath) {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function mapConcurrent(values, concurrency, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(values[index], index);
    }
  }));
  return results;
}

function renderSkill({ detail, name, platforms, sceneTags, searchTags }) {
  const body = stripFrontmatter(detail.content).trim();
  return [
    "---",
    `name: ${yamlString(name)}`,
    `description: ${yamlString(detail.description.trim())}`,
    "version: 0.1.0",
    "collection: ecosystem",
    `displayName: ${yamlString(detail.displayChineseName?.trim() || detail.name.trim())}`,
    `platforms: ${yamlList(platforms)}`,
    `sceneTags: ${yamlList(sceneTags)}`,
    `searchTags: ${yamlList(searchTags)}`,
    `legacyEcosystemId: ${yamlString(detail.id)}`,
    `originKind: ${yamlString(detail.kind)}`,
    "---",
    "",
    body,
    ""
  ].join("\n");
}

function stripFrontmatter(content) {
  return String(content).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function inferPlatforms(text, fallback) {
  const lower = text.toLowerCase();
  const rules = [
    ["amazon", /\bamazon\b|亚马逊/i],
    ["ebay", /\bebay\b/i],
    ["etsy", /\betsy\b/i],
    ["shopify", /\bshopify\b/i],
    ["tiktok-shop", /tiktok(?:\s+shop)?|抖音/i],
    ["walmart", /\bwalmart\b/i],
    ["woocommerce", /\bwoocommerce\b/i],
    ["mercado-libre", /mercado\s+libre/i]
  ];
  const explicit = rules.filter(([, pattern]) => pattern.test(lower)).map(([platform]) => platform);
  if (explicit.length) return [...new Set(explicit)];
  const normalizedFallback = String(fallback ?? "").trim().toLowerCase();
  return normalizedFallback && normalizedFallback !== "other"
    ? [normalizedFallback]
    : ["cross-platform"];
}

function inferSceneTags(text) {
  const rules = [
    ["product-research", /product research|选品|市场研究|market research|机会分析|需求验证/i],
    ["listing-content", /listing|seo|关键词|keyword|详情页|标题|五点|文案|内容优化|图片/i],
    ["pricing-profit", /pricing|price|定价|价格|利润|profit|毛利|成本|费用/i],
    ["advertising-growth", /advertis|\bads?\b|营销|广告|投放|推广|流量|增长|转化率|促销/i],
    ["customer-voice", /review|feedback|customer|评论|评价|买家|客户|voc|售后/i],
    ["inventory-supply-chain", /inventory|supply chain|物流|库存|供应链|仓储|配送|采购|补货/i],
    ["brand-compliance", /brand|compliance|品牌|合规|侵权|商标|版权|政策|风险/i],
    ["store-operations", /operations|seller|店铺|运营|账号|订单|结账|支付|业务计划/i],
    ["analytics-automation", /analytics|analysis|monitor|api|mcp|automation|分析|监控|自动化|数据|接口|报表|看板/i],
    ["cross-platform", /cross[- ]?platform|cross[- ]?border|跨境|多平台|独立站/i]
  ];
  const matches = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  return matches.length ? matches : ["store-operations"];
}

function inferSearchTags(detail, platforms, sceneTags) {
  const ignored = new Set(["common", "template", "external-listing", detail.sourceRepository?.toLowerCase()]);
  return [...new Set([
    ...platforms,
    ...sceneTags,
    ...(detail.tags ?? []).map((tag) => String(tag).trim().toLowerCase()).filter((tag) => tag && !ignored.has(tag))
  ])];
}

function sourceLicense(repository) {
  if (repository === "nexscope-ai/eCommerce-Skills") return "MIT";
  if (repository === "hikari0511/awesome-amazon-ec-skills") return "CC0-1.0";
  if (repository === "noique/cross-border-ecommerce-skills") return "CC-BY-NC-4.0";
  return "NOASSERTION";
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function yamlList(values) {
  return `[${values.map(yamlString).join(", ")}]`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function assertInside(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Generated skill path escapes builtin root: ${childPath}`);
  }
}
