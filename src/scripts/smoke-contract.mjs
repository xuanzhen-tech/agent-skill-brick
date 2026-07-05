/**
 * smoke 测试公开 SDK 和积木元数据合同。
 *
 * 这个测试不触碰偏重文件系统的安装路径。它验证产品仓库可以 import 稳定的
 * SDK exports，并确认 descriptor 形状仍然兼容 release foundation。
 */

import assert from "node:assert/strict";

import { validateBrickDefinition } from "@xuanzhen-tech/agent-release-foundation";

import {
  brickDefinition,
  createAgentSkillIndex,
  createAgentSkillLaunchConfig,
  createAgentSkillRuntimeContract,
  resolveSkillRoots,
  validateAgentSkillIndex,
  validateAgentSkillLaunchConfig
} from "../index.mjs";

assert.equal(brickDefinition.id, "agent-skill");
assert.equal(brickDefinition.kind, "config");
assert.equal(brickDefinition.version, "0.1.2");
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
assert.match(launchConfig.managedRoot.replaceAll("\\", "/"), /\/\.agent-cli\/skills$/);

const defaultRoots = resolveSkillRoots({
  workspace: process.cwd(),
  managedRoot: launchConfig.managedRoot,
  extraDirs: [],
  indexPath: launchConfig.indexPath
});
assert.deepEqual(defaultRoots.map((root) => root.source), ["workspace", "project", "managed"]);

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
