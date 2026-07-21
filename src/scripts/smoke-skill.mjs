/**
 * skill 扫描和 managed package 操作的端到端 smoke 测试。
 *
 * 本脚本创建一次性 managed skill root，从每种支持的来源安装 package，写入 index，
 * 并验证不安全 package 会被拒绝。它通过进程内 server 提供 HTTP fixture，
 * 让测试保持本地化。
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";

import {
  AgentSkill,
  installSkillPackage,
  listManagedSkillInstallations,
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
  const indexPath = path.join(tempRoot, "agent-skill.index.json");

  await writeSkill(path.join(workspace, "skills", "ignored-workspace"), {
    name: "ignored-workspace",
    description: "Workspace skill should not be scanned"
  });
  await writeSkill(path.join(managedRoot, "alpha"), {
    name: "alpha",
    description: "Managed alpha skill",
    capabilities: ["search", "managed"],
    requiredTools: ["run_shell"]
  });
  // references 与 assets 是 skill 包的一部分。这里用真实文件验证它们只能
  // 经由 AgentSkill 的受控接口访问，而不会被扫描成独立 skill。
  await fs.mkdir(path.join(managedRoot, "alpha", "references"), { recursive: true });
  await fs.mkdir(path.join(managedRoot, "alpha", "assets"), { recursive: true });
  await fs.writeFile(
    path.join(managedRoot, "alpha", "references", "usage.md"),
    "\uFEFF# Alpha Reference\n\nUse the packaged reference instructions.\n",
    "utf8"
  );
  await fs.writeFile(path.join(managedRoot, "alpha", "references", "ignored.bin"), Buffer.from([0, 1, 2]));
  await fs.writeFile(path.join(managedRoot, "alpha", "assets", "template.txt"), "asset template\n", "utf8");
  await writeSkill(path.join(managedRoot, "shared"), {
    name: "shared",
    description: "Managed shared skill"
  });

  const scannedIndex = await scanSkillRoots({
    workspace,
    skillsPath: managedRoot,
    indexPath
  });
  assert.equal(validateAgentSkillIndex(scannedIndex).ok, true);
  assert.equal(scannedIndex.skills.some((skill) => skill.name === "alpha"), true);
  assert.equal(scannedIndex.skills.some((skill) => skill.name === "ignored-workspace"), false);
  assert.equal(scannedIndex.skills.find((skill) => skill.name === "shared").source, "managed");
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

  const inlineContentV1 = skillMarkdown({
    name: "ecosystem-writer",
    description: "Inline ecosystem skill",
    version: "revision-1"
  });
  const inlineSourceV1 = inlineSkillSource(inlineContentV1, "revision-1");
  const inlineInstalled = await installSkillPackage({ source: inlineSourceV1, managedRoot });
  assert.equal(inlineInstalled.status, "installed");
  assert.equal(inlineInstalled.installation.provenance.remoteId, "ecosystem-writer");

  const inlineUnchanged = await installSkillPackage({ source: inlineSourceV1, managedRoot, conflict: "check" });
  assert.equal(inlineUnchanged.status, "unchanged");

  const inlineContentV2 = skillMarkdown({
    name: "ecosystem-writer",
    description: "Inline ecosystem skill updated",
    version: "revision-2"
  });
  const inlineSourceV2 = inlineSkillSource(inlineContentV2, "revision-2");
  const inlineConflict = await installSkillPackage({ source: inlineSourceV2, managedRoot, conflict: "check" });
  assert.equal(inlineConflict.status, "conflict");
  assert.match(await fs.readFile(path.join(managedRoot, "ecosystem-writer", "SKILL.md"), "utf8"), /revision-1/);

  const inlineReplaced = await installSkillPackage({ source: inlineSourceV2, managedRoot, conflict: "replace" });
  assert.equal(inlineReplaced.status, "replaced");
  assert.match(await fs.readFile(path.join(managedRoot, "ecosystem-writer", "SKILL.md"), "utf8"), /revision-2/);
  assert.equal((await listManagedSkillInstallations({ managedRoot })).some((record) => record.provenance.remoteId === "ecosystem-writer"), true);

  const invalidInline = inlineSkillSource("# 缺少 frontmatter\n", "bad-revision");
  await assert.rejects(() => installSkillPackage({ source: invalidInline, managedRoot, conflict: "replace" }), /Invalid skill package/);
  assert.match(await fs.readFile(path.join(managedRoot, "ecosystem-writer", "SKILL.md"), "utf8"), /revision-2/);

  // 模拟进程在“目录已替换、安装记录尚未提交”之间退出。下一次安装必须恢复
  // 原目录和原 provenance，不能留下新文件配旧安装记录的半完成状态。
  const recoveryOldContent = skillMarkdown({
    name: "recovery-skill",
    description: "Original recovery skill",
    version: "recovery-old"
  });
  const recoveryOld = await installSkillPackage({
    source: inlineSkillSource(recoveryOldContent, "recovery-old", "recovery-skill"),
    managedRoot
  });
  const recoveryDestination = path.join(managedRoot, "recovery-skill");
  const recoveryTransaction = path.join(managedRoot, ".agent-skill-transaction-smoke-recovery");
  const recoveryPrevious = path.join(recoveryTransaction, "previous");
  await fs.mkdir(recoveryTransaction, { recursive: true });
  await fs.rename(recoveryDestination, recoveryPrevious);
  await writeSkill(recoveryDestination, {
    name: "recovery-skill",
    description: "Interrupted replacement",
    version: "recovery-new"
  });
  await fs.writeFile(path.join(recoveryTransaction, "transaction.json"), `${JSON.stringify({
    skillName: "recovery-skill",
    destination: recoveryDestination,
    previousInstallation: recoveryOld.installation,
    phase: "files_swapped",
    previousMoved: true
  }, null, 2)}\n`, "utf8");
  await installSkillPackage({
    source: inlineSkillSource(skillMarkdown({
      name: "recovery-trigger",
      description: "Trigger pending transaction recovery",
      version: "1"
    }), "1", "recovery-trigger"),
    managedRoot
  });
  assert.match(await fs.readFile(path.join(recoveryDestination, "SKILL.md"), "utf8"), /recovery-old/);
  assert.equal((await listManagedSkillInstallations({ managedRoot }))
    .find((record) => record.skillName === "recovery-skill").revision, "recovery-old");

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

  const agentSkill = new AgentSkill(managedRoot);
  const objectIndex = await agentSkill.refresh();
  assert.equal(objectIndex.skills.some((skill) => skill.name === "alpha"), true);
  assert.equal(agentSkill.definitions.some((skill) => skill.name === "alpha"), true);
  assert.equal((await agentSkill.listInstallations()).some((record) => record.provenance.remoteId === "ecosystem-writer"), true);

  const prompt = await agentSkill.buildPrompt();
  assert.match(prompt, /Available Skills/);
  assert.match(prompt, /alpha/);
  assert.doesNotMatch(prompt, /Use this skill when it is relevant/);

  const found = await agentSkill.find({ query: "alpha", source: "local", capability: "search", requiredTool: "run_shell" });
  assert.equal(found.skills.length, 1);
  assert.equal(found.skills[0].name, "alpha");
  assert.deepEqual(found.candidates, []);

  const fakeRemoteClient = {
    async search(input) {
      assert.equal(input.query, "remote");
      assert.equal(input.source, "all");
      return {
        results: [
          {
            id: "skills-sh:owner/repo@remote-writer",
            source: "skills-sh",
            name: "remote-writer",
            package: "owner/repo@remote-writer",
            description: "Remote writer skill"
          }
        ],
        diagnostics: []
      };
    },
    async install(input) {
      assert.equal(input.source, "skills-sh");
      assert.equal(input.packageName, "owner/repo@remote-writer");
      const remoteDir = path.join(input.skillRoot, "remote-writer");
      await writeSkill(remoteDir, {
        name: "remote-writer",
        description: "Installed from remote provider",
        capabilities: ["writing"]
      });
      return {
        installed: [{ name: "remote-writer", path: path.join(remoteDir, "SKILL.md"), source: "skills-sh" }],
        diagnostics: []
      };
    }
  };

  const remoteFound = await agentSkill.find({ query: "remote", source: "all" }, { skillFindClient: fakeRemoteClient });
  assert.equal(remoteFound.skills.length, 0);
  assert.equal(remoteFound.candidates.length, 1);
  assert.equal(remoteFound.candidates[0].package, "owner/repo@remote-writer");

  const remoteInstalled = await agentSkill.find({
    action: "install",
    source: "skills-sh",
    package: "owner/repo@remote-writer"
  }, { skillFindClient: fakeRemoteClient });
  assert.equal(remoteInstalled.action, "install");
  assert.equal(remoteInstalled.installed[0].name, "remote-writer");
  assert.equal(remoteInstalled.skills[0].name, "remote-writer");

  const activated = await agentSkill.activate("alpha");
  assert.equal(activated.loadedSkill.name, "alpha");
  assert.match(activated.loadedSkill.content, /Use this skill when it is relevant/);
  assert.deepEqual(activated.loadedSkill.resources, [
    { kind: "asset", path: "assets/template.txt", bytes: 15 },
    { kind: "reference", path: "references/usage.md", bytes: 63 }
  ]);
  const listedResources = await agentSkill.listResources("alpha");
  assert.equal(listedResources.resources.length, 2);
  const loadedReference = await agentSkill.readReference("alpha", "references/usage.md");
  assert.equal(loadedReference.loadedSkillReference.skillName, "alpha");
  assert.equal(loadedReference.loadedSkillReference.path, "references/usage.md");
  assert.match(loadedReference.loadedSkillReference.content, /Alpha Reference/);
  assert.equal(loadedReference.loadedSkillReference.content.startsWith("\uFEFF"), false);
  const resolvedAsset = await agentSkill.resolveAsset("alpha", "assets/template.txt");
  assert.equal(resolvedAsset.asset.path, "assets/template.txt");
  assert.equal(resolvedAsset.asset.bytes, 15);
  await assert.rejects(() => agentSkill.readReference("alpha", "assets/template.txt"), /references/);
  await assert.rejects(() => agentSkill.resolveAsset("alpha", "references/usage.md"), /assets/);
  await assert.rejects(() => agentSkill.readReference("alpha", "references/../SKILL.md"), /Invalid skill resource path/);
  const activatedRemote = await agentSkill.activate("remote-writer");
  assert.equal(activatedRemote.loadedSkill.name, "remote-writer");
  assert.match(activatedRemote.loadedSkill.content, /Installed from remote provider/);
  await assert.rejects(() => agentSkill.activate("missing-skill"), /Unknown skill/);

  const removedInline = await agentSkill.remove("ecosystem-writer");
  assert.equal(removedInline.removed, true);
  assert.equal((await agentSkill.listInstallations()).some((record) => record.provenance.remoteId === "ecosystem-writer"), false);

  // 预制 skill 只能由产品显式按名称选择。安装源仍然先经过既有 package
  // 校验和受管替换事务，最终唯一运行时目录仍是传入的 skillsPath。
  const builtinRoot = path.join(tempRoot, "builtin-managed");
  const selectedBuiltinSkill = new AgentSkill({
    skillsPath: builtinRoot,
    skills: ["amazon-sku-profit-summary"]
  });
  const selectedBuiltinIndex = await selectedBuiltinSkill.refresh();
  assert.deepEqual(selectedBuiltinIndex.skills.map((skill) => skill.name), ["amazon-sku-profit-summary"]);
  assert.equal(await exists(path.join(builtinRoot, "amazon-sku-profit-summary", "SKILL.md")), true);
  assert.equal(await exists(path.join(builtinRoot, "amazon-inventory-ledger-summary", "SKILL.md")), false);
  assert.equal((await selectedBuiltinSkill.listInstallations())
    .some((record) => record.sourceKind === "builtin" && record.provenance.remoteId === "builtin:amazon-sku-profit-summary"), true);

  const builtinPrompt = await selectedBuiltinSkill.buildPrompt();
  assert.match(builtinPrompt, /amazon-sku-profit-summary/);
  assert.doesNotMatch(builtinPrompt, /amazon-inventory-ledger-summary/);
  const builtinFound = await selectedBuiltinSkill.find({ query: "amazon", source: "local" });
  assert.deepEqual(builtinFound.skills.map((skill) => skill.name), ["amazon-sku-profit-summary"]);
  const builtinActivated = await selectedBuiltinSkill.activate("amazon-sku-profit-summary");
  assert.equal(builtinActivated.loadedSkill.name, "amazon-sku-profit-summary");
  await assert.rejects(
    () => selectedBuiltinSkill.activate("amazon-inventory-ledger-summary"),
    /Unknown skill/
  );

  await selectedBuiltinSkill.setSkillNames(["amazon-inventory-ledger-summary"]);
  assert.deepEqual(selectedBuiltinSkill.definitions.map((skill) => skill.name), ["amazon-inventory-ledger-summary"]);
  assert.equal(await exists(path.join(builtinRoot, "amazon-inventory-ledger-summary", "SKILL.md")), true);
  assert.equal(await exists(path.join(builtinRoot, "amazon-sku-profit-summary", "SKILL.md")), true);

  const removedSelectedBuiltin = await selectedBuiltinSkill.remove("amazon-inventory-ledger-summary");
  assert.equal(removedSelectedBuiltin.removed, true);
  assert.deepEqual(selectedBuiltinSkill.selectedSkillNames, []);
  assert.deepEqual(selectedBuiltinSkill.definitions, []);
  assert.equal(await exists(path.join(builtinRoot, "amazon-inventory-ledger-summary", "SKILL.md")), false);

  await selectedBuiltinSkill.setSkillNames([]);
  assert.deepEqual(selectedBuiltinSkill.definitions, []);
  assert.equal(await selectedBuiltinSkill.buildPrompt(), "");

  // 同名目录若不是由 builtin 安装记录管理，不能被预制 catalog 覆盖或误暴露。
  const collisionRoot = path.join(tempRoot, "builtin-collision");
  await writeSkill(path.join(collisionRoot, "amazon-sku-profit-summary"), {
    name: "amazon-sku-profit-summary",
    description: "Local skill with a protected builtin name"
  });
  const collidingBuiltinSkill = new AgentSkill({
    skillsPath: collisionRoot,
    skills: ["amazon-sku-profit-summary"]
  });
  const collisionIndex = await collidingBuiltinSkill.refresh();
  assert.deepEqual(collisionIndex.skills, []);
  assert.equal(collisionIndex.diagnostics.some((item) => item.code === "builtin_skill_conflict"), true);
  assert.match(
    await fs.readFile(path.join(collisionRoot, "amazon-sku-profit-summary", "SKILL.md"), "utf8"),
    /Local skill with a protected builtin name/
  );

  console.log("[smoke-skill] ok");
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function writeSkill(skillDir, metadata) {
  await fs.mkdir(skillDir, { recursive: true });
  await fs.writeFile(path.join(skillDir, "SKILL.md"), skillMarkdown(metadata), "utf8");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
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

function inlineSkillSource(content, revision, remoteId = "ecosystem-writer") {
  return {
    kind: "agent-skill.inline.v1",
    content,
    integrity: {
      sha256: crypto.createHash("sha256").update(content, "utf8").digest("hex")
    },
    provenance: {
      type: "agent-ecosystem",
      remoteId,
      catalogUrl: "http://127.0.0.1/catalog",
      sourceUrl: "https://example.test/ecosystem-writer",
      revision
    }
  };
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

// store-only zip fixture 足够供 .NET 解压使用，也能避免测试依赖。
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
