/**
 * agent-skill 的启动配置和运行时合同工具。
 *
 * host 代码通过这些工具决定唯一的 skills 托管目录，以及兼容索引文件的
 * 输出位置。产品主路径只需要关心 skillsPath，不再暴露 workspace、index
 * 等内部细节。
 */

import os from "node:os";
import path from "node:path";

import { brickDefinition } from "../brick-definition.mjs";
import { firstNonEmpty } from "./env.mjs";

const DEFAULT_INDEX_FILE = "agent-skill.index.json";
const DEFAULT_MANAGED_SKILL_ROOT = ".agent-cli";

export function createAgentSkillLaunchConfig(input = {}) {
  const config = resolveSkillConfig(process.env, input);
  return {
    command: "agent-skill",
    args: ["scan", "--skills-path", config.skillsPath, "--index", config.indexPath],
    env: {
      AGENT_SKILL_SKILLS_PATH: config.skillsPath,
      AGENT_SKILL_INDEX_PATH: config.indexPath
    },
    indexPath: config.indexPath,
    skillsPath: config.skillsPath
  };
}

export function validateAgentSkillLaunchConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return { ok: false, errors: ["launch config must be an object"] };
  }
  if (config.command !== "agent-skill") errors.push("command must be agent-skill");
  if (!Array.isArray(config.args)) errors.push("args must be an array");
  if (!config.indexPath || typeof config.indexPath !== "string") errors.push("indexPath must be a string");
  return { ok: errors.length === 0, errors, value: errors.length === 0 ? config : undefined };
}

export function createAgentSkillRuntimeContract(input = {}) {
  const platform = input.platform ?? "win32-x64";
  return {
    schemaVersion: "agent-skill.runtime.v1",
    brickId: brickDefinition.id,
    version: brickDefinition.version,
    platform,
    command: "agent-skill",
    artifactType: "skills-index",
    env: {
      skillsPath: "AGENT_SKILL_SKILLS_PATH",
      indexPath: "AGENT_SKILL_INDEX_PATH",
      nodeBin: "AGENT_SKILL_NODE_BIN"
    },
    outputs: {
      indexFile: DEFAULT_INDEX_FILE,
      schemaVersion: "agent-skill.index.v1"
    },
    runtimeDependencies: {
      required: [
        {
          type: "node-runtime",
          injectedEnv: "AGENT_SKILL_NODE_BIN"
        }
      ],
      optional: []
    }
  };
}

export function resolveSkillConfig(env = process.env, overrides = {}) {
  const skillsPath = path.resolve(firstNonEmpty(
    overrides.skillsPath,
    overrides.managedRoot,
    env.AGENT_SKILL_SKILLS_PATH,
    env.AGENT_SKILL_MANAGED_ROOT
  ) ?? defaultSkillsPath());
  const workspace = path.resolve(firstNonEmpty(overrides.workspace, env.AGENT_SKILL_WORKSPACE) ?? process.cwd());
  const indexPath = path.resolve(firstNonEmpty(
    overrides.indexPath,
    env.AGENT_SKILL_INDEX_PATH
  ) ?? defaultIndexPath(skillsPath));
  return {
    workspace,
    skillsPath,
    managedRoot: skillsPath,
    indexPath
  };
}

function homeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

function defaultSkillsPath() {
  return path.join(homeDir(), DEFAULT_MANAGED_SKILL_ROOT, "skills");
}

function defaultIndexPath(skillsPath) {
  return path.join(path.dirname(path.resolve(skillsPath)), DEFAULT_INDEX_FILE);
}
