/**
 * agent-skill 的启动配置和运行时合同工具。
 *
 * 产品或 client-shell 代码通过这些工具决定 managed skills 的位置，以及
 * 生成的 index 应该写到哪里，从而避免重复维护路径默认值和环境变量名。
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
    args: ["scan", "--workspace", config.workspace, "--index", config.indexPath],
    env: {
      AGENT_SKILL_WORKSPACE: config.workspace,
      AGENT_SKILL_MANAGED_ROOT: config.managedRoot,
      AGENT_SKILL_INDEX_PATH: config.indexPath
    },
    indexPath: config.indexPath,
    managedRoot: config.managedRoot
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
      workspace: "AGENT_SKILL_WORKSPACE",
      managedRoot: "AGENT_SKILL_MANAGED_ROOT",
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
  const workspace = path.resolve(firstNonEmpty(overrides.workspace, env.AGENT_SKILL_WORKSPACE) ?? process.cwd());
  const managedRoot = path.resolve(firstNonEmpty(overrides.managedRoot, env.AGENT_SKILL_MANAGED_ROOT) ?? path.join(homeDir(), DEFAULT_MANAGED_SKILL_ROOT, "skills"));
  const indexPath = path.resolve(firstNonEmpty(overrides.indexPath, env.AGENT_SKILL_INDEX_PATH) ?? path.join(workspace, ".agent", DEFAULT_INDEX_FILE));
  return {
    workspace,
    managedRoot,
    indexPath
  };
}

function homeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}
