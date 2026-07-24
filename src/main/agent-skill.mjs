/**
 * AgentSkill 对象化运行时入口。
 *
 * 本文件把 skill 扫描、摘要注入、查找、激活和安装封装成可注入对象。
 * 产品主路径只需要传要启用的 skill 名称数组；预制 skill 的受控安装、索引
 * 路径、prompt 预算和扫描策略都由本积木内部默认，避免外部组合时泄露过多
 * 实现细节。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { brickDefinition } from "../brick-definition.mjs";
import {
  createBuiltinSkillSource,
  isBuiltinSkillName,
  listBuiltinSkills
} from "./builtin-skill-catalog.mjs";
import { createDiagnosticsReport } from "./diagnostics.mjs";
import { resolveSkillConfig } from "./launch-config.mjs";
import {
  createDefaultSkillFindClient,
  normalizeSkillFindLimit,
  normalizeSkillFindSource
} from "./skill-finder.mjs";
import {
  getManagedSkillInstallation,
  listManagedSkillInstallations
} from "./installation-registry.mjs";
import { installSkillPackage, removeManagedSkill } from "./skill-package.mjs";
import { normalizeSkillName, scanSkillRoots } from "./skill-index.mjs";
import {
  listSkillResources,
  readSkillReference,
  resolveSkillAsset
} from "./skill-resource-runtime.mjs";

const MAX_ACTIVATED_SKILL_BYTES = 256 * 1024;
const DEFAULT_FIND_LIMIT = 20;
const MAX_FIND_LIMIT = 100;
const DEFAULT_PROMPT_SKILL_LIMIT = 80;
const DEFAULT_PROMPT_BYTES = 24 * 1024;

export class AgentSkill {
  constructor(input = {}) {
    const normalizedInput = normalizeConstructorInput(input);
    this.config = resolveSkillConfig(process.env, normalizedInput);
    this.visibilityMode = normalizedInput.visibilityMode;
    this.skillNames = normalizeSkillNames(normalizedInput.skillNames);
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

  /**
   * 返回当前 artifact 可供产品选择的预制 skill。
   *
   * 该列表不会自动启用或安装；产品必须通过构造函数数组或 setSkillNames()
   * 显式选择，才能让对应 skill 进入运行时可见列表。
   */
  get builtinSkills() {
    return listBuiltinSkills();
  }

  /**
   * 返回当前对象采用的 skill 可见性选择。
   *
   * all 仅用于旧版路径构造兼容；新产品应传数组并使用 selected 模式。
   */
  get selectedSkillNames() {
    return [...this.skillNames];
  }

  /**
   * 动态切换当前 AgentSkill 实例的可见 skill 白名单。
   *
   * 选择内置名称时会按受控安装流程写入 skillsPath；选择外部名称时只会在
   * 该名称已经由产品或远端安装到 skillsPath 后变为可见。
   */
  async setSkillNames(skillNames) {
    this.visibilityMode = "selected";
    this.skillNames = normalizeSkillNames(skillNames);
    return await this.refresh();
  }

  async refresh(context = {}) {
    const provisioning = await this.provisionSelectedBuiltinSkills();
    const scannedIndex = await scanSkillRoots(this.contextConfig(context));
    this.index = createVisibleSkillIndex(scannedIndex, {
      visibilityMode: this.visibilityMode,
      skillNames: this.skillNames,
      blockedSkillNames: provisioning.blockedSkillNames,
      diagnostics: provisioning.diagnostics
    });
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
    const { skill, skillFilePath } = await this.resolveActiveSkill(nameOrId, context);
    const stat = await fs.stat(skillFilePath);
    if (!stat.isFile()) throw new Error(`Skill path is not a file: ${skillFilePath}`);
    if (stat.size > MAX_ACTIVATED_SKILL_BYTES) throw new Error(`SKILL.md exceeds ${MAX_ACTIVATED_SKILL_BYTES} bytes.`);

    const content = await fs.readFile(skillFilePath, "utf8");
    const resources = await listSkillResources({ skill, skillFilePath });
    const loadedSkill = {
      id: skill.id,
      name: skill.name,
      path: skillFilePath,
      content,
      contentHash: sha256(content),
      bytes: Buffer.byteLength(content, "utf8"),
      resources
    };
    return {
      activated: true,
      skillName: skill.name,
      contentHash: loadedSkill.contentHash,
      loadedSkill
    };
  }

  /**
   * 返回一个 skill 可供受控访问的 references、workflows、assets 与 templates 清单。
   *
   * 清单不包含文件全文，也不暴露 scripts；模型需要具体内容时必须通过
   * AgentTool 的 skill_resource 合同继续请求。
   */
  async listResources(nameOrId, context = {}) {
    const { skill, skillFilePath } = await this.resolveActiveSkill(nameOrId, context);
    const resources = await listSkillResources({ skill, skillFilePath });
    return {
      skillId: skill.id,
      skillName: skill.name,
      resources
    };
  }

  /**
   * 读取 skill references 或 workflows 目录下的一个 UTF-8 文本文件。
   *
   * 返回的 loadedSkillReference 由 AgentCli 升级为专门上下文事件，不能把
   * 它当成任意工作区文件或普通 shell 输出使用。
   */
  async readReference(nameOrId, resourcePath, context = {}) {
    const { skill, skillFilePath } = await this.resolveActiveSkill(nameOrId, context);
    const loadedSkillReference = await readSkillReference({
      skill,
      skillFilePath,
      resourcePath
    });
    return {
      read: true,
      skillId: skill.id,
      skillName: skill.name,
      resourcePath: loadedSkillReference.path,
      contentHash: loadedSkillReference.contentHash,
      bytes: loadedSkillReference.bytes,
      loadedSkillReference
    };
  }

  /**
   * 解析 skill assets 或 templates 目录下的一个受控文件。
   *
   * AgentSkill 只证明源文件安全且提供不可变 hash，不写入 workspace；实际
   * 物化由 AgentTool 按固定的 temp/skill-assets 路径完成。
   */
  async resolveAsset(nameOrId, resourcePath, context = {}) {
    const { skill, skillFilePath } = await this.resolveActiveSkill(nameOrId, context);
    const asset = await resolveSkillAsset({
      skill,
      skillFilePath,
      resourcePath
    });
    return {
      resolved: true,
      skillId: skill.id,
      skillName: skill.name,
      resourcePath: asset.path,
      contentHash: asset.contentHash,
      bytes: asset.bytes,
      asset
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
    const skillName = normalizeSkillName(nameOrId);
    const result = await removeManagedSkill({
      skill: skillName,
      managedRoot: this.config.skillsPath
    });
    // 当前实例已经明确移除该 skill 时，不应在本次 refresh 中因仍留在白名单
    // 而被预制 catalog 立即装回。产品若在下次创建对象时继续传入该名称，
    // 则表示它仍希望启用，届时会按配置重新准备。
    if (this.visibilityMode === "selected") {
      this.skillNames = this.skillNames.filter((name) => name !== skillName);
    }
    await this.refresh();
    return result;
  }

  // 集中执行索引刷新、启用状态和 SKILL.md 路径检查，保证 activate、资源清单、
  // reference 读取与 asset 解析始终面对同一份受控 skill 元数据。
  async resolveActiveSkill(nameOrId, context = {}) {
    await this.refresh(context);
    const requestedSkill = stringField(nameOrId);
    if (!requestedSkill) throw new Error("skill is required");

    const skill = this.index.skills.find((candidate) => candidate.id === requestedSkill || candidate.name === requestedSkill);
    if (!skill) throw new Error(`Unknown skill: ${requestedSkill}`);
    if (skill.enabled === false) throw new Error(skill.disabledReason || `Skill is disabled: ${skill.name}`);

    return {
      skill,
      skillFilePath: await resolveIndexedSkillPath(skill)
    };
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

    const invisibleInstalledNames = this.visibilityMode === "selected"
      ? result.installed
        .map((item) => normalizeOptionalSkillName(item.name))
        .filter(Boolean)
        .filter((name) => !this.skillNames.includes(name))
      : [];

    return {
      action: "install",
      skillRoot: this.config.skillsPath,
      installed: result.installed,
      skills: installedSkills,
      count: installedSkills.length,
      diagnostics: [
        ...(result.diagnostics ?? []),
        ...invisibleInstalledNames.map((name) => ({
          level: "info",
          code: "skill_not_selected",
          message: `Skill was installed but remains inactive until selected: ${name}`
        }))
      ],
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

  async provisionSelectedBuiltinSkills() {
    if (this.visibilityMode !== "selected") {
      return {
        diagnostics: [],
        blockedSkillNames: []
      };
    }

    const diagnostics = [];
    const blockedSkillNames = [];
    for (const skillName of this.skillNames) {
      if (!isBuiltinSkillName(skillName)) continue;

      const source = createBuiltinSkillSource(skillName);
      try {
        let result = await installSkillPackage({
          source,
          managedRoot: this.config.skillsPath,
          conflict: "check"
        });

        // 内置 skill 的旧版本可自动升级，但仅限安装记录和磁盘内容都表明它
        // 没有被用户改写。未知来源或手工修改的同名目录必须保留并报告冲突。
        if (result.status === "conflict" && await this.canReplaceBuiltinSkill(result, skillName)) {
          result = await installSkillPackage({
            source,
            managedRoot: this.config.skillsPath,
            conflict: "replace"
          });
        }

        if (result.status === "conflict") {
          blockedSkillNames.push(skillName);
          diagnostics.push({
            level: "warn",
            code: "builtin_skill_conflict",
            skillName,
            message: `Builtin skill was not installed because a local skill already owns the name: ${skillName}`
          });
        }
      } catch (error) {
        blockedSkillNames.push(skillName);
        diagnostics.push({
          level: "warn",
          code: "builtin_skill_install_failed",
          skillName,
          message: `Unable to prepare builtin skill ${skillName}: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    }
    return {
      diagnostics,
      blockedSkillNames
    };
  }

  async canReplaceBuiltinSkill(result, skillName) {
    const existingInstallation = result.existingInstallation
      ?? await getManagedSkillInstallation({
        managedRoot: this.config.skillsPath,
        skillName
      });
    if (!isManagedBuiltinInstallation(existingInstallation, skillName)) return false;

    const installedSkillPath = path.join(this.config.skillsPath, skillName, "SKILL.md");
    try {
      const currentContent = await fs.readFile(installedSkillPath, "utf8");
      return sha256(currentContent) === existingInstallation.contentHash;
    } catch {
      return false;
    }
  }
}

function normalizeConstructorInput(input) {
  if (Array.isArray(input)) {
    return {
      skillNames: input,
      visibilityMode: "selected"
    };
  }
  if (typeof input === "string") {
    // 字符串路径是旧版公开入口；保留“所有已安装 skills 可见”的语义，
    // 避免既有 host 升级 SDK 后突然失去已安装 skill。
    return {
      skillsPath: input,
      visibilityMode: "all"
    };
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    // 无参构造是既有公开用法，继续显示默认托管目录中已安装的全部 skill。
    // 预制 catalog 只由显式名称数组触发，不会改变旧产品的启动结果。
    return { visibilityMode: "all" };
  }
  const hasSkills = Object.hasOwn(input, "skills") || Object.hasOwn(input, "skillNames");
  const hasExplicitPath = Object.hasOwn(input, "skillsPath") || Object.hasOwn(input, "managedRoot");
  return {
    skillsPath: input.skillsPath ?? input.managedRoot,
    skillNames: input.skills ?? input.skillNames,
    visibilityMode: input.allInstalled === true
      ? "all"
      : hasSkills
        ? "selected"
        : hasExplicitPath
          ? "all"
          : "all"
  };
}

function normalizeSkillNames(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error("skills must be an array of skill names");
  }
  return [...new Set(value.map((name) => normalizeSkillName(name)))];
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

function createVisibleSkillIndex(scannedIndex, {
  visibilityMode,
  skillNames,
  blockedSkillNames,
  diagnostics
}) {
  const selectedNames = new Set(skillNames);
  const blockedNames = new Set(blockedSkillNames);
  const skills = visibilityMode === "all"
    ? scannedIndex.skills
    : visibilityMode === "selected"
      ? scannedIndex.skills.filter((skill) => (
        (selectedNames.has(skill.name) || selectedNames.has(skill.id))
        && !blockedNames.has(skill.name)
        && !blockedNames.has(skill.id)
      ))
      : [];

  return {
    ...scannedIndex,
    skills,
    diagnostics: [
      ...(scannedIndex.diagnostics ?? []),
      ...diagnostics
    ]
  };
}

function isManagedBuiltinInstallation(installation, skillName) {
  return installation?.sourceKind === "builtin"
    && installation.provenance?.type === "agent-skill-builtin"
    && installation.provenance?.remoteId === `builtin:${skillName}`;
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

function normalizeOptionalSkillName(value) {
  try {
    return value === undefined ? undefined : normalizeSkillName(value);
  } catch {
    return undefined;
  }
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
