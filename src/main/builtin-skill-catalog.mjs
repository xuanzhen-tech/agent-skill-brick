/**
 * agent-skill 内置 skill catalog。
 *
 * 本文件声明随 SDK 和 runtime artifact 一起发布的只读 skill 包。它们不是
 * 运行时扫描根，也不会直接进入模型上下文；AgentSkill 只有在产品显式选择
 * 名称后，才会把对应包按既有受管安装流程写入唯一的 skillsPath。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeSkillName } from "./skill-index.mjs";

export const BUILTIN_SKILL_SOURCE_KIND = "agent-skill.builtin.v1";

const MODULE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const BUILTIN_SKILL_ROOT = path.resolve(MODULE_DIRECTORY, "../builtin-skills");

// 这里是积木随版本发布的预制目录清单。描述只用于产品选择和诊断，完整说明
// 仍以安装后的 SKILL.md 为准。
const BUILTIN_SKILLS = Object.freeze([
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
  })
]);

const BUILTIN_SKILL_BY_NAME = new Map(BUILTIN_SKILLS.map((skill) => [skill.name, skill]));

/**
 * 返回可供产品选择的内置 skill 元数据副本。
 *
 * 返回副本而不是内部数组，避免调用方意外修改运行时 catalog。
 */
export function listBuiltinSkills() {
  return BUILTIN_SKILLS.map((skill) => ({ ...skill }));
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
