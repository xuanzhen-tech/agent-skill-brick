/**
 * agent-skill 托管目录和输出路径的诊断逻辑。
 *
 * agent-skill 允许在没有任何 managed skill 时运行。缺失 root 只是信息提示；
 * 无法写入 index 目录才是需要处理的问题，因为它会阻塞其它积木消费 registry。
 */

import fs from "node:fs/promises";
import path from "node:path";

import { brickDefinition } from "../brick-definition.mjs";
import { resolveSkillRoots } from "./skill-index.mjs";

export async function createDiagnosticsReport(config) {
  const checks = [
    await createIndexPathCheck(config),
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

async function createIndexPathCheck(config) {
  try {
    await fs.mkdir(path.dirname(config.indexPath), { recursive: true });
    await fs.access(path.dirname(config.indexPath));
    return {
      id: "index.path",
      status: "pass",
      summary: "skill index 输出目录可访问。",
      detail: config.indexPath
    };
  } catch (error) {
    return {
      id: "index.path",
      status: "fail",
      summary: "skill index 输出目录不可访问。",
      detail: error instanceof Error ? error.message : String(error)
    };
  }
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
