/**
 * AgentSkill 对象化运行时入口。
 *
 * 本文件把 skill 扫描、摘要注入、查找、激活和安装封装成可注入对象。
 * 产品主路径只需要传一个 skills 目录；索引路径、prompt 预算和扫描策略
 * 都由本积木内部默认，避免外部组合时泄露过多实现细节。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { brickDefinition } from "../brick-definition.mjs";
import { createDiagnosticsReport } from "./diagnostics.mjs";
import { resolveSkillConfig } from "./launch-config.mjs";
import {
  createDefaultSkillFindClient,
  normalizeSkillFindLimit,
  normalizeSkillFindSource
} from "./skill-finder.mjs";
import { listManagedSkillInstallations } from "./installation-registry.mjs";
import { installSkillPackage, removeManagedSkill } from "./skill-package.mjs";
import { scanSkillRoots } from "./skill-index.mjs";

const MAX_ACTIVATED_SKILL_BYTES = 256 * 1024;
const DEFAULT_FIND_LIMIT = 20;
const MAX_FIND_LIMIT = 100;
const DEFAULT_PROMPT_SKILL_LIMIT = 80;
const DEFAULT_PROMPT_BYTES = 24 * 1024;

export class AgentSkill {
  constructor(input = {}) {
    const normalizedInput = normalizeConstructorInput(input);
    this.config = resolveSkillConfig(process.env, normalizedInput);
    this.promptSkillLimit = DEFAULT_PROMPT_SKILL_LIMIT;
    this.promptBytes = DEFAULT_PROMPT_BYTES;
    this.index = {
      schemaVersion: "agent-skill.index.v1",
      generatedAt: new Date(0).toISOString(),
      roots: [],
      skills: [],
      diagnostics: []
    };
  }

  get definition() {
    return brickDefinition;
  }

  get definitions() {
    return this.index.skills.map(toSkillDefinition);
  }

  async refresh(context = {}) {
    this.index = await scanSkillRoots(this.contextConfig(context));
    return this.index;
  }

  async buildPrompt(context = {}) {
    await this.refresh(context);
    const enabledSkills = this.index.skills
      .filter((skill) => skill.enabled !== false)
      .slice(0, this.promptSkillLimit)
      .map(formatSkillPromptLine);

    if (!enabledSkills.length) return "";
    // 系统提示只注入可用 skills 摘要；完整 SKILL.md 只能通过 activate 按需读取。
    return clampPrompt([
      "## Available Skills",
      "Use these skills when they match the task. Load full instructions with skill_activate before applying a skill.",
      ...enabledSkills
    ].join("\n"), this.promptBytes);
  }

  async find(filter = {}, context = {}) {
    await this.refresh(context);
    const action = normalizeFindAction(filter);
    if (action === "install") {
      return await this.installFromSkillFind(filter, context);
    }

    const query = stringField(filter.query)?.toLowerCase();
    const capability = stringField(filter.capability);
    const requiredTool = stringField(filter.requiredTool ?? filter.tool);
    const includeDisabled = filter.includeDisabled === true;
    const limit = clampLimit(filter.limit);

    const skills = this.index.skills
      .filter((skill) => includeDisabled || skill.enabled !== false)
      .filter((skill) => !query || matchesQuery(skill, query))
      .filter((skill) => !capability || listIncludes(skill.capabilities, capability))
      .filter((skill) => !requiredTool || listIncludes([...toList(skill.requiredTools), ...toList(skill.optionalTools)], requiredTool))
      .slice(0, limit)
      .map(toSkillFindItem);

    const remote = await this.searchRemoteSkills({ ...filter, query, limit }, context);

    return {
      action: "search",
      skills,
      count: skills.length,
      candidates: remote.results,
      diagnostics: remote.diagnostics,
      generatedAt: this.index.generatedAt
    };
  }

  async activate(nameOrId, context = {}) {
    await this.refresh(context);
    const requestedSkill = stringField(nameOrId);
    if (!requestedSkill) {
      throw new Error("skill is required");
    }

    const skill = this.index.skills.find((candidate) => candidate.id === requestedSkill || candidate.name === requestedSkill);
    if (!skill) throw new Error(`Unknown skill: ${requestedSkill}`);
    if (skill.enabled === false) throw new Error(skill.disabledReason || `Skill is disabled: ${skill.name}`);

    const skillFilePath = await resolveIndexedSkillPath(skill);
    const stat = await fs.stat(skillFilePath);
    if (!stat.isFile()) throw new Error(`Skill path is not a file: ${skillFilePath}`);
    if (stat.size > MAX_ACTIVATED_SKILL_BYTES) throw new Error(`SKILL.md exceeds ${MAX_ACTIVATED_SKILL_BYTES} bytes.`);

    const content = await fs.readFile(skillFilePath, "utf8");
    const loadedSkill = {
      id: skill.id,
      name: skill.name,
      path: skillFilePath,
      content,
      contentHash: sha256(content),
      bytes: Buffer.byteLength(content, "utf8")
    };
    return {
      activated: true,
      skillName: skill.name,
      contentHash: loadedSkill.contentHash,
      loadedSkill
    };
  }

  async install(source, options = {}) {
    const result = await installSkillPackage({
      source,
      managedRoot: this.config.skillsPath,
      conflict: options.conflict
    });
    if (result.status !== "conflict") await this.refresh();
    return result;
  }

  async listInstallations() {
    return await listManagedSkillInstallations({
      managedRoot: this.config.skillsPath
    });
  }

  async remove(nameOrId, options = {}) {
    const result = await removeManagedSkill({
      skill: nameOrId,
      managedRoot: this.config.skillsPath
    });
    await this.refresh();
    return result;
  }

  async installFromSkillFind(filter = {}, context = {}) {
    const client = context.skillFindClient ?? createDefaultSkillFindClient();
    const input = normalizeSkillFindInstallInput(filter);
    const result = await client.install({
      ...input,
      skillRoot: this.config.skillsPath
    });
    await this.refresh(context);
    const installedSkills = result.installed
      .map((item) => {
        const normalizedName = item.name?.toLowerCase();
        return this.index.skills.find((skill) => (
          skill.name?.toLowerCase() === normalizedName ||
          path.basename(path.dirname(skill.path || "")).toLowerCase() === normalizedName
        ));
      })
      .filter(Boolean)
      .map(toSkillFindItem);

    return {
      action: "install",
      skillRoot: this.config.skillsPath,
      installed: result.installed,
      skills: installedSkills,
      count: installedSkills.length,
      diagnostics: result.diagnostics ?? [],
      generatedAt: this.index.generatedAt
    };
  }

  async searchRemoteSkills(filter = {}, context = {}) {
    const query = stringField(filter.query);
    if (!query) return { results: [], diagnostics: [] };
    const source = normalizeSkillFindSource(filter.source);
    if (source === "local") return { results: [], diagnostics: [] };

    const client = context.skillFindClient ?? createDefaultSkillFindClient();
    try {
      return await client.search({
        query,
        source,
        limit: normalizeSkillFindLimit(filter.limit),
        skillRoot: this.config.skillsPath
      });
    } catch (error) {
      return {
        results: [],
        diagnostics: [{ source: source === "all" ? "all" : source, message: error instanceof Error ? error.message : String(error) }]
      };
    }
  }

  async diagnostics(context = {}) {
    return await createDiagnosticsReport(this.contextConfig(context));
  }

  contextConfig(context = {}) {
    return {
      ...this.config,
      workspace: this.config.workspace,
      skillsPath: this.config.skillsPath,
      managedRoot: this.config.skillsPath
    };
  }
}

function normalizeConstructorInput(input) {
  if (typeof input === "string") {
    return { skillsPath: input };
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }
  return {
    skillsPath: input.skillsPath ?? input.managedRoot
  };
}

function normalizeFindAction(filter = {}) {
  const action = stringField(filter.action)?.toLowerCase();
  if (action === "search" || action === "find") return "search";
  if (action === "install" || action === "add") return "install";
  if (filter.install === true || stringField(filter.package ?? filter.packageName ?? filter.slug ?? filter.url)) {
    return "install";
  }
  return "search";
}

function normalizeSkillFindInstallInput(filter = {}) {
  const source = normalizeInstallSource(filter);
  if (source === "skills-sh") {
    const packageName = stringField(filter.packageName ?? filter.package);
    if (!packageName) throw new Error("skill_find install requires package for skills-sh.");
    return { source, packageName };
  }
  if (source === "skillhub") {
    const slug = stringField(filter.slug);
    if (!slug) throw new Error("skill_find install requires slug for skillhub.");
    return { source, slug };
  }

  const name = stringField(filter.name);
  const url = stringField(filter.url);
  if (!name && !url) throw new Error("skill_find install requires name or url for openai-curated.");
  return { source, name, url };
}

function normalizeInstallSource(filter = {}) {
  const rawSource = normalizeSkillFindSource(filter.source);
  if (rawSource === "local") throw new Error("skill_find install does not support source=local.");
  if (rawSource !== "all") return rawSource;
  if (stringField(filter.slug)) return "skillhub";
  if (stringField(filter.packageName ?? filter.package)) return "skills-sh";
  return "openai-curated";
}

function toSkillDefinition(skill) {
  return {
    id: skill.id,
    name: skill.name,
    version: skill.version,
    description: skill.description,
    source: skill.source,
    capabilities: toList(skill.capabilities),
    requiredTools: toList(skill.requiredTools),
    optionalTools: toList(skill.optionalTools),
    requiredEnv: toList(skill.requiredEnv),
    enabled: skill.enabled !== false,
    ...(skill.disabledReason ? { disabledReason: skill.disabledReason } : {})
  };
}

function toSkillFindItem(skill) {
  return {
    ...toSkillDefinition(skill),
    location: skill.path,
    bytes: skill.bytes,
    contentHash: skill.contentHash
  };
}

function formatSkillPromptLine(skill) {
  const parts = [
    `- ${skill.name}: ${skill.description}`,
    toList(skill.capabilities).length ? `capabilities=${toList(skill.capabilities).join(",")}` : undefined,
    toList(skill.requiredTools).length ? `requiredTools=${toList(skill.requiredTools).join(",")}` : undefined,
    toList(skill.optionalTools).length ? `optionalTools=${toList(skill.optionalTools).join(",")}` : undefined
  ].filter(Boolean);
  return parts.join(" | ");
}

function matchesQuery(skill, query) {
  return [
    skill.id,
    skill.name,
    skill.description,
    ...toList(skill.capabilities),
    ...toList(skill.requiredTools),
    ...toList(skill.optionalTools)
  ].join("\n").toLowerCase().includes(query);
}

async function resolveIndexedSkillPath(skill) {
  if (!skill.path) throw new Error(`Skill ${skill.name} is missing path.`);
  const skillFilePath = path.resolve(skill.path);
  if (path.basename(skillFilePath).toLowerCase() !== "skill.md") {
    throw new Error(`Skill ${skill.name} path must point to SKILL.md.`);
  }
  const realSkillFile = await fs.realpath(skillFilePath);
  const realSkillDir = await fs.realpath(path.dirname(skillFilePath));
  const relative = path.relative(realSkillDir, realSkillFile);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Skill ${skill.name} path escapes its skill directory.`);
  }
  return realSkillFile;
}

function clampPrompt(value, maxBytes) {
  const buffer = Buffer.from(value, "utf8");
  if (buffer.byteLength <= maxBytes) return value;
  return `${buffer.subarray(0, maxBytes).toString("utf8")}\n[skill prompt truncated]`;
}

function clampLimit(value) {
  const limit = normalizePositiveInteger(value, DEFAULT_FIND_LIMIT);
  return Math.max(1, Math.min(limit, MAX_FIND_LIMIT));
}

function normalizePositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function listIncludes(list, value) {
  return toList(list).includes(value);
}

function toList(value) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function stringField(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
