/**
 * AgentSkill 对象化运行时入口。
 *
 * 本文件把 skill roots 扫描、摘要注入、查找、激活和 managed 安装封装成
 * 一个可被 AgentCli / AgentTool 直接注入的对象。它只管理 skills，不执行
 * shell、web、python 或模型调用。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { brickDefinition } from "../brick-definition.mjs";
import { createDiagnosticsReport } from "./diagnostics.mjs";
import { resolveSkillConfig } from "./launch-config.mjs";
import { installSkillPackage, removeManagedSkill } from "./skill-package.mjs";
import { scanSkillRoots } from "./skill-index.mjs";

const MAX_ACTIVATED_SKILL_BYTES = 256 * 1024;
const DEFAULT_FIND_LIMIT = 20;
const MAX_FIND_LIMIT = 100;
const DEFAULT_PROMPT_SKILL_LIMIT = 80;
const DEFAULT_PROMPT_BYTES = 24 * 1024;

export class AgentSkill {
  constructor(input = {}) {
    this.env = input.env ?? process.env;
    this.config = resolveSkillConfig(this.env, input);
    this.promptSkillLimit = normalizePositiveInteger(input.promptSkillLimit, DEFAULT_PROMPT_SKILL_LIMIT);
    this.promptBytes = normalizePositiveInteger(input.promptBytes, DEFAULT_PROMPT_BYTES);
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

    return {
      skills,
      count: skills.length,
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
      managedRoot: options.managedRoot ?? this.config.managedRoot
    });
    await this.refresh(options);
    return result;
  }

  async remove(nameOrId, options = {}) {
    const result = await removeManagedSkill({
      skill: nameOrId,
      managedRoot: options.managedRoot ?? this.config.managedRoot
    });
    await this.refresh(options);
    return result;
  }

  async diagnostics(context = {}) {
    return await createDiagnosticsReport(this.contextConfig(context));
  }

  contextConfig(context = {}) {
    return {
      ...this.config,
      workspace: path.resolve(context.workspace ?? context.workingDirectory ?? this.config.workspace),
      managedRoot: context.managedRoot ? path.resolve(context.managedRoot) : this.config.managedRoot,
      extraDirs: Array.isArray(context.extraDirs) ? context.extraDirs.map((item) => path.resolve(item)) : this.config.extraDirs
    };
  }
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
