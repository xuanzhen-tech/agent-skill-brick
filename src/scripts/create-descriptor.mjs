/**
 * Create the local artifact descriptor for the agent-skill brick.
 *
 * The descriptor is the release-foundation contract consumed by product
 * manifests and installers. This script translates build metadata into a
 * validated `skills-index` artifact descriptor without embedding local secrets.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

import {
  createArtifactDescriptor,
  createArtifactFileName,
  validateArtifactDescriptor
} from "@xuanzhen-tech/agent-release-foundation";

import { brickDefinition } from "../brick-definition.mjs";

const ARTIFACT_TYPE = "skills-index";
const TARGET_PLATFORM = "win32-x64";
const FILE_EXTENSION = ".zip";
const STABLE_SLOT = "skills-index:agent-skill";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const distDir = path.join(repoRoot, "dist");
const buildMetadataPath = path.join(distDir, "build-artifact.json");
const descriptorPath = path.join(distDir, "descriptor.local.json");

console.log("[create-descriptor] 1/5 read build metadata");
const buildMetadata = JSON.parse(await fs.readFile(buildMetadataPath, "utf8"));

console.log("[create-descriptor] 2/5 create local descriptor");
const descriptor = createArtifactDescriptor({
  id: brickDefinition.id,
  type: ARTIFACT_TYPE,
  name: brickDefinition.name,
  version: brickDefinition.version,
  platform: TARGET_PLATFORM,
  url: pathToFileURL(buildMetadata.artifactPath).href,
  size: buildMetadata.size,
  sha256: buildMetadata.sha256,
  fileExtension: FILE_EXTENSION,
  slot: STABLE_SLOT,
  install: {
    strategy: "versioned-directory",
    command: "agent-skill scan"
  },
  metadata: {
    brickId: brickDefinition.id,
    brickKind: brickDefinition.kind,
    runtimeContract: "runtime-contract.json",
    indexSchemaVersion: "agent-skill.index.v1",
    command: "agent-skill",
    managedRootEnv: "AGENT_SKILL_MANAGED_ROOT",
    indexPathEnv: "AGENT_SKILL_INDEX_PATH"
  }
});

console.log("[create-descriptor] 3/5 validate descriptor");
const validation = validateArtifactDescriptor(descriptor);
if (!validation.ok) {
  throw new Error(`Invalid artifact descriptor: ${validation.errors.join("; ")}`);
}

console.log("[create-descriptor] 4/5 create standard file name");
const standardFileName = createArtifactFileName(descriptor);
const output = {
  ...descriptor,
  metadata: {
    ...descriptor.metadata,
    standardFileName
  }
};

await fs.writeFile(descriptorPath, `${JSON.stringify(output, null, 2)}\n`);

console.log("[create-descriptor] 5/5 done");
console.log("[create-descriptor] descriptor", descriptorPath);
console.log("[create-descriptor] id", output.id);
console.log("[create-descriptor] version", output.version);
console.log("[create-descriptor] url", output.url);
console.log("[create-descriptor] standardFileName", standardFileName);
