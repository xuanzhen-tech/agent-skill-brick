/**
 * Launch configuration and runtime contract helpers for agent-skill.
 *
 * Product/client-shell code uses these helpers to decide where managed skills
 * live and where the generated index should be written, without duplicating
 * path defaults or environment variable names.
 */

import os from "node:os";
import path from "node:path";

import { brickDefinition } from "../brick-definition.mjs";
import { firstNonEmpty, parseList } from "./env.mjs";

const DEFAULT_INDEX_FILE = "agent-skill.index.json";

export function createAgentSkillLaunchConfig(input = {}) {
  const config = resolveSkillConfig(process.env, input);
  return {
    command: "agent-skill",
    args: ["scan", "--workspace", config.workspace, "--index", config.indexPath],
    env: {
      AGENT_SKILL_WORKSPACE: config.workspace,
      AGENT_SKILL_MANAGED_ROOT: config.managedRoot,
      AGENT_SKILL_INDEX_PATH: config.indexPath,
      ...(config.artifactSkillsRoot ? { AGENT_SKILL_ARTIFACT_ROOT: config.artifactSkillsRoot } : {}),
      ...(config.extraDirs.length ? { AGENT_SKILL_EXTRA_DIRS: config.extraDirs.join(";") } : {})
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
      artifactSkillsRoot: "AGENT_SKILL_ARTIFACT_ROOT",
      extraDirs: "AGENT_SKILL_EXTRA_DIRS",
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
  const managedRoot = path.resolve(firstNonEmpty(overrides.managedRoot, env.AGENT_SKILL_MANAGED_ROOT) ?? path.join(homeDir(), ".agent", "skills"));
  const artifactSkillsRoot = firstNonEmpty(overrides.artifactSkillsRoot, env.AGENT_SKILL_ARTIFACT_ROOT);
  const indexPath = path.resolve(firstNonEmpty(overrides.indexPath, env.AGENT_SKILL_INDEX_PATH) ?? path.join(workspace, ".agent", DEFAULT_INDEX_FILE));
  return {
    workspace,
    managedRoot,
    artifactSkillsRoot: artifactSkillsRoot ? path.resolve(artifactSkillsRoot) : undefined,
    extraDirs: parseList(overrides.extraDirs ?? env.AGENT_SKILL_EXTRA_DIRS).map((item) => path.resolve(item)),
    indexPath
  };
}

function homeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}
