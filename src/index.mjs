/**
 * agent-skill 的公开 SDK 出口。
 *
 * 消费方只应该从这个文件 import。只要这些合同工具保持稳定，内部模块
 * 可以继续演进。
 */

export { brickDefinition } from "./brick-definition.mjs";
export {
  createAgentSkillLaunchConfig,
  createAgentSkillRuntimeContract,
  resolveSkillConfig,
  validateAgentSkillLaunchConfig
} from "./main/launch-config.mjs";
export {
  createAgentSkillIndex,
  normalizeSkillName,
  resolveSkillRoots,
  scanSkillRoots,
  validateAgentSkillIndex,
  writeSkillIndex
} from "./main/skill-index.mjs";
export {
  installSkillPackage,
  removeManagedSkill,
  validateSkillPackage
} from "./main/skill-package.mjs";
