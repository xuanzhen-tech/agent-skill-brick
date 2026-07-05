/**
 * Public brick definition for agent-skill.
 *
 * This contract tells baseLine and product repositories that the brick produces
 * a skills-index artifact and exposes SDK/CLI helpers for skill discovery,
 * validation, and managed installation. It deliberately does not claim tool
 * execution or model orchestration capabilities.
 */

import {
  createBrickCapability,
  createBrickDefinition,
  validateBrickDefinition
} from "@xuanzhen-tech/agent-release-foundation";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BRICK_ID = "agent-skill";
const BRICK_NAME = "Agent Skill";
const BRICK_VERSION = "0.1.1";
const BRICK_KIND = "config";

const registryCapability = createBrickCapability({
  id: "agent-skill.registry",
  name: "Agent Skill Registry",
  type: "config",
  description: "Scans skill roots, validates skill packages, and emits an agent-skill.index.v1 registry."
});

const installCapability = createBrickCapability({
  id: "agent-skill.install",
  name: "Agent Skill Install",
  type: "cli",
  description: "Installs, updates, and removes managed skill packages without executing skill scripts."
});

export const brickDefinition = createBrickDefinition({
  id: BRICK_ID,
  name: BRICK_NAME,
  version: BRICK_VERSION,
  kind: BRICK_KIND,
  description: "Independent agent skill registry brick for skill discovery, validation, install, and skills-index packaging.",
  entrypoints: [
    {
      name: "agent-skill",
      type: "cli",
      description: "CLI entry. Supports diagnostics, roots, scan, install, update, remove, manifest, and version commands."
    },
    {
      name: "createAgentSkillIndex",
      type: "api",
      description: "SDK helper for generating an agent-skill.index.v1 index."
    },
    {
      name: "validateAgentSkillIndex",
      type: "api",
      description: "SDK helper for validating the skills index contract."
    },
    {
      name: "scanSkillRoots",
      type: "api",
      description: "SDK helper for scanning configured skill roots."
    },
    {
      name: "validateSkillPackage",
      type: "api",
      description: "SDK helper for validating a skill package directory."
    }
  ],
  capabilities: [
    registryCapability,
    installCapability
  ],
  configSchema: {
    type: "object",
    properties: {
      workspace: { type: "string" },
      managedRoot: { type: "string" },
      artifactSkillsRoot: { type: "string" },
      extraDirs: { type: "array", items: { type: "string" } },
      indexPath: { type: "string" }
    }
  },
  runtimeDependencies: [
    {
      type: "node-runtime",
      required: true,
      injectedEnv: "AGENT_SKILL_NODE_BIN"
    }
  ]
});

const validation = validateBrickDefinition(brickDefinition);
if (!validation.ok) {
  throw new Error(`Invalid brick definition: ${validation.errors.join("; ")}`);
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun) {
  console.log("brick.id", brickDefinition.id);
  console.log("brick.version", brickDefinition.version);
  console.log("brick.capabilities", brickDefinition.capabilities.map((capability) => capability.id).join(", "));
}
