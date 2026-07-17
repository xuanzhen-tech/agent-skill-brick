/**
 * agent-skill 托管目录和输出路径的诊断逻辑。
 *
 * agent-skill 允许在没有任何 managed skill 时运行。缺失 root 只是信息提示。
 * AgentSkill 使用实例内索引，因此 diagnostics 不检查或创建外部 index 文件目录。
 */

import fs from "node:fs/promises";

import { brickDefinition } from "../brick-definition.mjs";
import { resolveSkillRoots } from "./skill-index.mjs";

export async function createDiagnosticsReport(config) {
  const checks = [
    ...await Promise.all(resolveSkillRoots(config).map(createRootCheck))
  ];
  const status = checks.some((check) => check.status === "fail")
    ? "fail"
    : checks.some((check) => check.status === "warn")
      ? "warn"
      : "pass";
  return {
    schemaVersion: "agent-skill.diagnostics.v1",
    brick: {
      id: brickDefinition.id,
      version: brickDefinition.version,
      kind: brickDefinition.kind
    },
    status,
    checks
  };
}

async function createRootCheck(root) {
  try {
    const stat = await fs.stat(root.path);
    return {
      id: `root.${root.source}`,
      status: stat.isDirectory() ? "pass" : "warn",
      summary: stat.isDirectory() ? "skill 托管目录可用。" : "skill 托管路径不是目录。",
      detail: root.path
    };
  } catch {
    return {
      id: `root.${root.source}`,
      status: "warn",
      summary: "skill 托管目录尚不存在。",
      detail: root.path
    };
  }
}
