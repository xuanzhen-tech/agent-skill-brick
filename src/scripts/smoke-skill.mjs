/**
 * End-to-end smoke test for skill scanning and managed package operations.
 *
 * This script creates disposable skill roots, installs packages from every
 * supported source type, writes an index, and verifies that unsafe packages are
 * rejected. It keeps the test local by serving HTTP fixtures from an in-process
 * server.
 */

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";

import {
  installSkillPackage,
  removeManagedSkill,
  scanSkillRoots,
  validateAgentSkillIndex,
  validateSkillPackage,
  writeSkillIndex
} from "../index.mjs";

const CRC32_TABLE = createCrc32Table();
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-smoke-"));

try {
  const workspace = path.join(tempRoot, "workspace");
  const managedRoot = path.join(tempRoot, "managed");
  const extraRoot = path.join(tempRoot, "extra");
  const indexPath = path.join(tempRoot, "agent-skill.index.json");

  await writeSkill(path.join(workspace, "skills", "alpha"), {
    name: "alpha",
    description: "Workspace alpha skill",
    capabilities: ["search", "workspace"],
    requiredTools: ["run_shell"]
  });
  await writeSkill(path.join(workspace, ".agents", "skills", "project-only"), {
    name: "project-only",
    description: "Project scoped skill"
  });
  await writeSkill(path.join(workspace, "skills", "shared"), {
    name: "shared",
    description: "Workspace shared skill"
  });
  await writeSkill(path.join(managedRoot, "shared"), {
    name: "shared",
    description: "Managed shared skill should lose precedence"
  });
  await writeSkill(path.join(extraRoot, "extra-skill"), {
    name: "extra-skill",
    description: "Extra directory skill"
  });

  const scannedIndex = await scanSkillRoots({
    workspace,
    managedRoot,
    extraDirs: [extraRoot],
    indexPath
  });
  assert.equal(validateAgentSkillIndex(scannedIndex).ok, true);
  assert.equal(scannedIndex.skills.some((skill) => skill.name === "alpha"), true);
  assert.equal(scannedIndex.skills.some((skill) => skill.name === "project-only"), true);
  assert.equal(scannedIndex.skills.some((skill) => skill.name === "extra-skill"), true);
  assert.equal(scannedIndex.skills.find((skill) => skill.name === "shared").source, "workspace");
  await writeSkillIndex(indexPath, scannedIndex);
  assert.equal(JSON.parse(await fs.readFile(indexPath, "utf8")).schemaVersion, "agent-skill.index.v1");

  const localSkill = path.join(tempRoot, "source-local");
  await writeSkill(localSkill, {
    name: "local-install",
    description: "Local directory install"
  });
  assert.equal((await validateSkillPackage(localSkill)).valid, true);
  const localInstall = await installSkillPackage({ source: localSkill, managedRoot });
  assert.equal(localInstall.installed, true);
  assert.equal(localInstall.name, "local-install");

  const zipFile = path.join(tempRoot, "zip-skill.zip");
  await fs.writeFile(zipFile, createZipBuffer([
    {
      path: "zip-skill/SKILL.md",
      content: skillMarkdown({
        name: "zip-install",
        description: "Zip file install"
      })
    },
    { path: "zip-skill/references/readme.md", content: "reference" }
  ]));
  const zipInstall = await installSkillPackage({ source: zipFile, managedRoot });
  assert.equal(zipInstall.name, "zip-install");

  const httpZip = createZipBuffer([
    {
      path: "http-install/SKILL.md",
      content: skillMarkdown({
        name: "http-install",
        description: "HTTP zip install"
      })
    }
  ]);
  const registryZip = createZipBuffer([
    {
      path: "registry-install/SKILL.md",
      content: skillMarkdown({
        name: "registry-install",
        description: "Registry install"
      })
    }
  ]);
  const server = await startFixtureServer({ httpZip, registryZip });
  try {
    const httpInstall = await installSkillPackage({ source: `${server.baseUrl}/skill.zip`, managedRoot });
    assert.equal(httpInstall.name, "http-install");

    const registryInstall = await installSkillPackage({ source: `${server.baseUrl}/registry.json`, managedRoot });
    assert.equal(registryInstall.name, "registry-install");
  } finally {
    await server.close();
  }

  const badSkill = path.join(tempRoot, "bad-skill");
  await fs.mkdir(badSkill, { recursive: true });
  await fs.writeFile(path.join(badSkill, "notes.md"), "missing skill file");
  assert.equal((await validateSkillPackage(badSkill)).valid, false);
  await assert.rejects(() => installSkillPackage({ source: badSkill, managedRoot }), /SKILL\.md|Invalid skill package/);

  const removed = await removeManagedSkill({ skill: "local-install", managedRoot });
  assert.equal(removed.removed, true);

  console.log("[smoke-skill] ok");
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function writeSkill(skillDir, metadata) {
  await fs.mkdir(skillDir, { recursive: true });
  await fs.writeFile(path.join(skillDir, "SKILL.md"), skillMarkdown(metadata), "utf8");
}

function skillMarkdown(metadata) {
  const frontmatter = [
    "---",
    `name: ${metadata.name}`,
    `description: ${metadata.description}`,
    metadata.version ? `version: ${metadata.version}` : "version: 0.1.0",
    metadata.capabilities ? `capabilities: [${metadata.capabilities.join(", ")}]` : undefined,
    metadata.requiredTools ? `requiredTools: [${metadata.requiredTools.join(", ")}]` : undefined,
    "---"
  ].filter(Boolean).join("\n");
  return `${frontmatter}\n\nUse this skill when it is relevant.\n`;
}

function startFixtureServer({ httpZip, registryZip }) {
  const server = http.createServer((request, response) => {
    if (request.url === "/skill.zip") {
      response.writeHead(200, { "content-type": "application/zip" });
      response.end(httpZip);
    } else if (request.url === "/registry-skill.zip") {
      response.writeHead(200, { "content-type": "application/zip" });
      response.end(registryZip);
    } else if (request.url === "/registry.json") {
      const baseUrl = `http://127.0.0.1:${server.address().port}`;
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ skills: [{ name: "registry-install", url: `${baseUrl}/registry-skill.zip` }] }));
    } else {
      response.writeHead(404);
      response.end();
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve({
        baseUrl,
        close: () => new Promise((closeResolve) => server.close(closeResolve))
      });
    });
  });
}

// Store-only zip fixtures are enough for .NET extraction and avoid test deps.
function createZipBuffer(files) {
  const localFileRecords = [];
  const centralDirectoryRecords = [];
  let offset = 0;
  for (const file of files) {
    const nameBuffer = Buffer.from(file.path.replaceAll("\\", "/"), "utf8");
    const data = Buffer.from(file.content);
    const crc = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localFileRecords.push(localHeader, nameBuffer, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralDirectoryRecords.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + data.length;
  }

  const centralDirectoryOffset = offset;
  const centralDirectory = Buffer.concat(centralDirectoryRecords);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(centralDirectoryOffset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localFileRecords, centralDirectory, end]);
}

function createCrc32Table() {
  return new Uint32Array(256).map((_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return crc >>> 0;
  });
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}
