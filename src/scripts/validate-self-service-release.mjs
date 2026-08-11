/**
 * 自助发版版本与标记校验。
 *
 * 管理后台不是发布可信边界；CI 会独立确认 package、lock、发布标记和变更 Skill
 * 的版本一致，并在 PR 场景确认新版本严格大于目标分支版本。
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { brickDefinition } from "../brick-definition.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packageJson = JSON.parse(await fs.readFile(path.join(repoRoot, "package.json"), "utf8"));
const packageLock = JSON.parse(await fs.readFile(path.join(repoRoot, "package-lock.json"), "utf8"));
const catalog = JSON.parse(await fs.readFile(path.join(repoRoot, "src", "main", "self-service-builtin-skill-catalog.json"), "utf8"));
const version = stableVersion(packageJson.version, "package version");

if (packageLock.version !== version || packageLock.packages?.[""]?.version !== version) {
  throw new Error("package.json and package-lock.json versions must match");
}
if (brickDefinition.version !== version) {
  throw new Error("package.json and brick definition versions must match");
}
const markerPath = path.join(repoRoot, ".skill-releases", `${version}.json`);
const marker = JSON.parse(await fs.readFile(markerPath, "utf8"));
if (marker.schemaVersion !== "agent-skill.self-service-release.v1" || marker.version !== version) {
  throw new Error("self-service release marker does not match package version");
}
if (!Array.isArray(marker.skills) || marker.skills.length === 0) {
  throw new Error("self-service release marker must contain changed skills");
}
const byName = new Map(catalog.map((entry) => [entry?.name, entry]));
for (const skill of marker.skills) {
  if (!byName.has(skill?.name) || byName.get(skill.name)?.version !== version) {
    throw new Error(`Changed skill is missing from catalog at ${version}: ${skill?.name}`);
  }
}

const baseVersion = process.env.AGENT_SKILL_BASE_VERSION;
if (baseVersion && compareVersions(version, stableVersion(baseVersion, "base version")) <= 0) {
  throw new Error(`Self-service release version ${version} must be greater than ${baseVersion}`);
}

console.log(`Self-service release validation passed (${version}, ${marker.skills.length} skills).`);

function compareVersions(left, right) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
  }
  return 0;
}

function stableVersion(value, label) {
  const normalized = String(value ?? "").trim();
  if (!/^\d+\.\d+\.\d+$/.test(normalized)) throw new Error(`${label} must use x.y.z`);
  return normalized;
}
