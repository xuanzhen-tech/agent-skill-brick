/**
 * Smoke-test the public SDK and brick metadata contract.
 *
 * This test does not touch the filesystem-heavy install path. It verifies that
 * product repositories can import the stable SDK exports and that the descriptor
 * shape remains compatible with the release foundation.
 */

import assert from "node:assert/strict";

import { validateBrickDefinition } from "@xuanzhen-tech/agent-release-foundation";

import {
  brickDefinition,
  createAgentSkillIndex,
  createAgentSkillLaunchConfig,
  createAgentSkillRuntimeContract,
  validateAgentSkillIndex,
  validateAgentSkillLaunchConfig
} from "../index.mjs";

assert.equal(brickDefinition.id, "agent-skill");
assert.equal(brickDefinition.kind, "config");
assert.equal(brickDefinition.version, "0.1.0");
assert.equal(validateBrickDefinition(brickDefinition).ok, true);
assert.equal(brickDefinition.runtimeDependencies.some((item) => item.type === "node-runtime" && item.required === true), true);
assert.equal(brickDefinition.capabilities.some((item) => item.id === "agent-skill.registry"), true);
assert.equal(brickDefinition.capabilities.some((item) => item.id === "agent-skill.install"), true);

const launchConfig = createAgentSkillLaunchConfig({
  workspace: process.cwd(),
  indexPath: `${process.cwd()}\\agent-skill.index.json`
});
assert.equal(validateAgentSkillLaunchConfig(launchConfig).ok, true);
assert.equal(launchConfig.command, "agent-skill");
assert.equal(launchConfig.env.AGENT_SKILL_WORKSPACE, process.cwd());

const runtimeContract = createAgentSkillRuntimeContract({ platform: "win32-x64" });
assert.equal(runtimeContract.schemaVersion, "agent-skill.runtime.v1");
assert.equal(runtimeContract.artifactType, "skills-index");
assert.equal(runtimeContract.command, "agent-skill");
assert.equal(runtimeContract.runtimeDependencies.required[0].type, "node-runtime");

const index = createAgentSkillIndex({
  roots: [
    {
      root: process.cwd(),
      source: "workspace",
      exists: true,
      skills: [
        {
          id: "demo",
          name: "demo",
          version: "0.1.0",
          description: "Demo skill",
          path: `${process.cwd()}\\skills\\demo\\SKILL.md`,
          source: "workspace",
          capabilities: ["demo"],
          requiredTools: [],
          optionalTools: [],
          requiredEnv: [],
          enabled: true,
          contentHash: "a".repeat(64),
          bytes: 42
        }
      ],
      diagnostics: []
    }
  ]
});
assert.equal(validateAgentSkillIndex(index).ok, true);
assert.equal(index.skills.length, 1);

console.log("[smoke-contract] ok");
