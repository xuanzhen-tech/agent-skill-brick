/**
 * Public SDK surface for agent-skill.
 *
 * Consumers should import only from this file. Internal modules may change as
 * long as these contract helpers remain stable.
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
