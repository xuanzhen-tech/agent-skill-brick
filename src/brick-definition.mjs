/**
 * agent-skill 的公开积木定义。
 *
 * 这个合同告诉 baseLine 和产品仓库：当前积木产出 skills-index artifact，
 * 并暴露一个可按名称选择预制 skill 的 SDK 对象。它刻意不声明工具执行或模型
 * 编排能力。
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
const BRICK_VERSION = "0.4.2";
const BRICK_KIND = "config";

const registryCapability = createBrickCapability({
  id: "agent-skill.registry",
  name: "Agent Skill Registry",
  type: "config",
  description: "扫描托管 skill 目录，校验 skill 包，并生成 agent-skill.index.v1 索引。"
});

const installCapability = createBrickCapability({
  id: "agent-skill.install",
  name: "Agent Skill Install",
  type: "config",
  description: "安装、更新和删除托管 skill 包，维护安装来源记录和替换事务，支持受控 templates/workflows 资源，但不执行 skill 脚本。"
});

const builtinCatalogCapability = createBrickCapability({
  id: "agent-skill.builtin-catalog",
  name: "Agent Skill Builtin Catalog",
  type: "config",
  description: "提供随 SDK 与 runtime artifact 发布的预制 skill，并只在产品按名称选择后受控安装到托管目录。"
});

export const brickDefinition = createBrickDefinition({
  id: BRICK_ID,
  name: BRICK_NAME,
  version: BRICK_VERSION,
  kind: BRICK_KIND,
  description: "独立的 agent skill 注册管理积木，负责 skill 发现、校验、安装和 skills-index 打包。",
  entrypoints: [
    {
      name: "agent-skill",
      type: "cli",
      description: "面向 host 的命令入口，支持 diagnostics、roots、scan、install、update、remove、manifest 和 version。"
    },
    {
      name: "AgentSkill",
      type: "api",
      description: "SDK 对象入口，用于按名称选择预制或已安装 skill，并提供注册管理、受控安装来源和 prompt 摘要。"
    },
    {
      name: "listBuiltinSkills",
      type: "api",
      description: "列出当前 artifact 随附、可由产品按名称选择的预制 skill。"
    },
    {
      name: "createAgentSkillIndex",
      type: "api",
      description: "用于生成 agent-skill.index.v1 索引的 SDK helper。"
    },
    {
      name: "validateAgentSkillIndex",
      type: "api",
      description: "用于校验 skills index 合同的 SDK helper。"
    },
    {
      name: "scanSkillRoots",
      type: "api",
      description: "用于扫描托管 skill 目录的 SDK helper。"
    },
    {
      name: "validateSkillPackage",
      type: "api",
      description: "用于校验 skill 包目录的 SDK helper。"
    }
  ],
  capabilities: [
    registryCapability,
    installCapability,
    builtinCatalogCapability
  ],
  configSchema: {
    type: "object",
    properties: {
      skills: {
        type: "array",
        items: { type: "string" },
        description: "产品要在当前 AgentSkill 实例中启用的 skill 名称数组。"
      },
      skillsPath: {
        type: "string",
        description: "唯一托管目录；不传时默认为 ~/.agent-cli/skills。"
      }
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
