/**
 * Diagnostics for agent-skill roots and output paths.
 *
 * agent-skill is allowed to run before any managed skills exist. Missing roots
 * are informational, while an unwritable index directory is actionable because
 * it blocks producing the registry consumed by other bricks.
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
      summary: "Skill index output directory is accessible.",
      detail: config.indexPath
    };
  } catch (error) {
    return {
      id: "index.path",
      status: "fail",
      summary: "Skill index output directory is not accessible.",
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
      summary: stat.isDirectory() ? "Skill root is available." : "Skill root is not a directory.",
      detail: root.path
    };
  } catch {
    return {
      id: `root.${root.source}`,
      status: "warn",
      summary: "Skill root does not exist yet.",
      detail: root.path
    };
  }
}
