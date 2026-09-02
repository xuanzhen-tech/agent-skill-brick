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
  listBuiltinSkills,
  listManagedSkillInstallations,
  removeManagedSkill,
  scanSkillRoots,
  validateAgentSkillIndex,
  validateSkillPackage,
  writeSkillIndex
} from "../index.mjs";

const CRC32_TABLE = createCrc32Table();
const ASIN_RESEARCH_SKILL_NAMES = [
  "amazon-sellersprite-ad-visibility-gap-analysis",
  "amazon-sellersprite-asin-research-orchestrator",
  "amazon-sellersprite-competitive-landscape",
  "amazon-sellersprite-event-anomaly-analysis",
  "amazon-sellersprite-listing-competitor-audit",
  "amazon-sellersprite-review-voc-anomaly-screening"
];
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
  // references、workflows、assets 与 templates 是 skill 包的一部分。这里用真实文件验证它们只能
  // 经由 AgentSkill 的受控接口访问，而不会被扫描成独立 skill。
  await fs.mkdir(path.join(managedRoot, "alpha", "references"), { recursive: true });
  await fs.mkdir(path.join(managedRoot, "alpha", "workflows"), { recursive: true });
  await fs.mkdir(path.join(managedRoot, "alpha", "assets"), { recursive: true });
  await fs.mkdir(path.join(managedRoot, "alpha", "templates"), { recursive: true });
  await fs.writeFile(
    path.join(managedRoot, "alpha", "references", "usage.md"),
    "\uFEFF# Alpha Reference\n\nUse the packaged reference instructions.\n",
    "utf8"
  );
  await fs.writeFile(path.join(managedRoot, "alpha", "references", "ignored.bin"), Buffer.from([0, 1, 2]));
  await fs.writeFile(path.join(managedRoot, "alpha", "workflows", "draft.md"), "# Draft workflow\n", "utf8");
  await fs.writeFile(path.join(managedRoot, "alpha", "assets", "template.txt"), "asset template\n", "utf8");
  await fs.writeFile(path.join(managedRoot, "alpha", "templates", "layout.svg"), "<svg/>\n", "utf8");
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

  // `.ppt-master-library` 只允许随受控 SDK 发布的 bundled skill 使用；普通本地目录
  // 即使体积很小也不能借此扩大可安装的顶层目录。
  const localLibrarySkill = path.join(tempRoot, "local-library-skill");
  await writeSkill(localLibrarySkill, {
    name: "local-library-skill",
    description: "Untrusted local library must be rejected"
  });
  await fs.mkdir(path.join(localLibrarySkill, ".ppt-master-library"), { recursive: true });
  await fs.writeFile(path.join(localLibrarySkill, ".ppt-master-library", "manifest.json"), "{}\n", "utf8");
  assert.equal((await validateSkillPackage(localLibrarySkill)).valid, false);
  await assert.rejects(() => installSkillPackage({ source: localLibrarySkill, managedRoot }), /unsupported skill package path/);

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
    { kind: "asset", path: "templates/layout.svg", bytes: 7 },
    { kind: "reference", path: "references/usage.md", bytes: 63 },
    { kind: "reference", path: "workflows/draft.md", bytes: 17 }
  ]);
  const listedResources = await agentSkill.listResources("alpha");
  assert.equal(listedResources.resources.length, 4);
  const loadedReference = await agentSkill.readReference("alpha", "references/usage.md");
  assert.equal(loadedReference.loadedSkillReference.skillName, "alpha");
  assert.equal(loadedReference.loadedSkillReference.path, "references/usage.md");
  assert.match(loadedReference.loadedSkillReference.content, /Alpha Reference/);
  assert.equal(loadedReference.loadedSkillReference.content.startsWith("\uFEFF"), false);
  const loadedWorkflow = await agentSkill.readReference("alpha", "workflows/draft.md");
  assert.match(loadedWorkflow.loadedSkillReference.content, /Draft workflow/);
  const resolvedAsset = await agentSkill.resolveAsset("alpha", "assets/template.txt");
  assert.equal(resolvedAsset.asset.path, "assets/template.txt");
  assert.equal(resolvedAsset.asset.bytes, 15);
  const resolvedTemplate = await agentSkill.resolveAsset("alpha", "templates/layout.svg");
  assert.equal(resolvedTemplate.asset.path, "templates/layout.svg");
  await assert.rejects(() => agentSkill.readReference("alpha", "assets/template.txt"), /references/);
  await assert.rejects(() => agentSkill.resolveAsset("alpha", "references/usage.md"), /assets or templates/);
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

  await selectedBuiltinSkill.setSkillNames(["amazon-product-image-generation"]);
  assert.equal(selectedBuiltinSkill.definitions[0].version, "0.4.1");
  assert.deepEqual(selectedBuiltinSkill.definitions[0].requiredTools, [
    "ecommerce_image_generate",
    "ecommerce_image_edit",
    "ecommerce_image_list"
  ]);
  const imageSkillActivated = await selectedBuiltinSkill.activate("amazon-product-image-generation");
  assert.equal(imageSkillActivated.loadedSkill.name, "amazon-product-image-generation");
  assert.deepEqual(
    imageSkillActivated.loadedSkill.resources.map((resource) => resource.path).sort(),
    [
      "references/amazon-listing-set.md",
      "references/amazon-us-guidance.md",
      "references/production-quality-gate.md",
      "references/prompt-playbook.md",
      "references/reference-analysis.md",
      "references/tool-examples.md"
    ]
  );
  assert.match(imageSkillActivated.loadedSkill.content, /ecommerce_image_generate/);
  assert.match(imageSkillActivated.loadedSkill.content, /只使用三个模型可见的 `ecommerce_image_\*` 工具/);
  assert.doesNotMatch(imageSkillActivated.loadedSkill.content, /ecommerce_image_batch/);
  assert.match(imageSkillActivated.loadedSkill.content, /不要擅自补足固定七张/);
  assert.match(imageSkillActivated.loadedSkill.content, /生成和编辑统一使用 `quality: "high"`/);
  assert.match(imageSkillActivated.loadedSkill.content, /Skill 不维护固定比例选项/);
  assert.doesNotMatch(imageSkillActivated.loadedSkill.content, /ARK|KIE/);
  const toolExamples = await selectedBuiltinSkill.readReference(
    "amazon-product-image-generation",
    "references/tool-examples.md"
  );
  assert.match(toolExamples.loadedSkillReference.content, /"requests": \[/);
  assert.match(toolExamples.loadedSkillReference.content, /deliveryReady=true/);
  assert.doesNotMatch(toolExamples.loadedSkillReference.content, /"action": "status"/);
  assert.match(toolExamples.loadedSkillReference.content, /"edits":/);
  assert.match(toolExamples.loadedSkillReference.content, /"assetId":/);
  assert.match(toolExamples.loadedSkillReference.content, /"size": "4:5"/);
  assert.match(toolExamples.loadedSkillReference.content, /"resolution": "2K"/);
  assert.match(toolExamples.loadedSkillReference.content, /"quality": "high"/);
  assert.doesNotMatch(toolExamples.loadedSkillReference.content, /"width":|"height":|"quality": "medium"/);
  const referenceAnalysis = await selectedBuiltinSkill.readReference(
    "amazon-product-image-generation",
    "references/reference-analysis.md"
  );
  assert.match(referenceAnalysis.loadedSkillReference.content, /风格契约/);
  assert.match(referenceAnalysis.loadedSkillReference.content, /`product`\|`strict`/);
  assert.doesNotMatch(referenceAnalysis.loadedSkillReference.content, /ARK|KIE/);
  const listingSet = await selectedBuiltinSkill.readReference(
    "amazon-product-image-generation",
    "references/amazon-listing-set.md"
  );
  assert.match(listingSet.loadedSkillReference.content, /不得固定补足到七张/);
  assert.match(listingSet.loadedSkillReference.content, /不同 request/);
  assert.match(listingSet.loadedSkillReference.content, /A\+ 精确尺寸.*不在本文件能力范围/);
  const qualityGate = await selectedBuiltinSkill.readReference(
    "amazon-product-image-generation",
    "references/production-quality-gate.md"
  );
  assert.match(qualityGate.loadedSkillReference.content, /无法看图时只能确认 artifact/);
  assert.match(qualityGate.loadedSkillReference.content, /模型不得自行重放生图调用/);
  assert.match(qualityGate.loadedSkillReference.content, /operationStatus=partial/);
  assert.match(qualityGate.loadedSkillReference.content, /不得自动重新生成整套/);
  assert.match(qualityGate.loadedSkillReference.content, /明确指定生成数量、编辑目标和范围时，即视为本次操作已确认/);
  const promptPlaybook = await selectedBuiltinSkill.readReference(
    "amazon-product-image-generation",
    "references/prompt-playbook.md"
  );
  assert.match(promptPlaybook.loadedSkillReference.content, /Product identity lock/);
  assert.match(promptPlaybook.loadedSkillReference.content, /Style contract/);
  assert.match(promptPlaybook.loadedSkillReference.content, /编辑时待编辑版本是图片 1/);
  assert.doesNotMatch(promptPlaybook.loadedSkillReference.content, /\bmedium\b/);
  const amazonUsGuidance = await selectedBuiltinSkill.readReference(
    "amazon-product-image-generation",
    "references/amazon-us-guidance.md"
  );
  assert.match(amazonUsGuidance.loadedSkillReference.content, /AgentTool 公开 schema/);
  assert.doesNotMatch(amazonUsGuidance.loadedSkillReference.content, /API易|apiyi/i);

  await selectedBuiltinSkill.setSkillNames(["ecommerce-product-video-generation"]);
  assert.equal(selectedBuiltinSkill.definitions[0].version, "0.1.0");
  assert.deepEqual(selectedBuiltinSkill.definitions[0].requiredTools, [
    "ecommerce_video_generate",
    "ecommerce_video_status",
    "ecommerce_video_cancel",
    "ecommerce_video_retry",
    "ecommerce_video_list"
  ]);
  const videoSkillActivated = await selectedBuiltinSkill.activate("ecommerce-product-video-generation");
  assert.deepEqual(
    videoSkillActivated.loadedSkill.resources.map((resource) => resource.path).sort(),
    [
      "references/production-quality-gate.md",
      "references/prompt-playbook.md",
      "references/tool-examples.md"
    ]
  );
  assert.match(videoSkillActivated.loadedSkill.content, /6 秒、1080p、`adaptive`、无音频/);
  assert.match(videoSkillActivated.loadedSkill.content, /不处理真人、数字人/);
  const videoPromptPlaybook = await selectedBuiltinSkill.readReference(
    "ecommerce-product-video-generation",
    "references/prompt-playbook.md"
  );
  assert.match(videoPromptPlaybook.loadedSkillReference.content, /Product identity lock/);
  assert.match(videoPromptPlaybook.loadedSkillReference.content, /Do not add or remove parts/);
  const videoToolExamples = await selectedBuiltinSkill.readReference(
    "ecommerce-product-video-generation",
    "references/tool-examples.md"
  );
  assert.match(videoToolExamples.loadedSkillReference.content, /"modelId": "doubao-seedance-2-0"/);
  assert.match(videoToolExamples.loadedSkillReference.content, /deliveryReady=true/);
  assert.doesNotMatch(videoToolExamples.loadedSkillReference.content, /providerTaskId|api key/i);
  const videoQualityGate = await selectedBuiltinSkill.readReference(
    "ecommerce-product-video-generation",
    "references/production-quality-gate.md"
  );
  assert.match(videoQualityGate.loadedSkillReference.content, /无法播放视频时/);
  assert.match(videoQualityGate.loadedSkillReference.content, /每次生成都可能计费/);

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

  // ASIN 研究集群的六个包必须能够独立安装，并在安装后通过受控资源 API
  // 读取各自携带的共享合同，不能依赖 skillsPath 外的 ../_shared 目录。
  const asinResearchCatalog = listBuiltinSkills()
    .filter((skill) => ASIN_RESEARCH_SKILL_NAMES.includes(skill.name));
  assert.equal(asinResearchCatalog.length, 6);
  const asinResearchByName = new Map(asinResearchCatalog.map((skill) => [skill.name, skill]));
  for (const skillName of ASIN_RESEARCH_SKILL_NAMES) {
    const sourceSkillPath = path.resolve("src", "builtin-skills", skillName);
    const validation = await validateSkillPackage(sourceSkillPath);
    assert.equal(validation.valid, true, `${skillName}: ${validation.diagnostics.join("; ")}`);
    assert.equal(validation.metadata.name, skillName);
    assert.equal(validation.metadata.description, asinResearchByName.get(skillName).description);
    await assertTextResourcesHaveNoControlCharacters(sourceSkillPath);
  }

  const asinResearchRoot = path.join(tempRoot, "asin-research-managed");
  const selectedAsinResearchSkills = new AgentSkill({
    skillsPath: asinResearchRoot,
    skills: ASIN_RESEARCH_SKILL_NAMES
  });
  const asinResearchIndex = await selectedAsinResearchSkills.refresh();
  assert.equal(asinResearchIndex.skills.length, 6);
  for (const skillName of ASIN_RESEARCH_SKILL_NAMES) {
    const activated = await selectedAsinResearchSkills.activate(skillName);
    assert.equal(activated.loadedSkill.name, skillName);
    assert.doesNotMatch(activated.loadedSkill.content, /\.\.\/_shared\//);
    // 新版研究包允许把 MCP 渐进调用合同直接写入正文，不再强制依赖一个
    // 固定名称的共享 reference；实际声明的每个资源仍在下方逐项验真。
    assert.match(activated.loadedSkill.content, /search.*describe.*call/s);
    const referencedResources = [...activated.loadedSkill.content.matchAll(
      /`((?:references|assets)\/[^`]+)`/g
    )].map((match) => match[1]);
    for (const resourcePath of referencedResources) {
      assert.equal(
        await exists(path.join(asinResearchRoot, skillName, ...resourcePath.split("/"))),
        true,
        `${skillName}: referenced resource is missing: ${resourcePath}`
      );
    }
  }
  const claimRegister = await selectedAsinResearchSkills.resolveAsset(
    "amazon-sellersprite-asin-research-orchestrator",
    "assets/claim-register.csv"
  );
  assert.equal(claimRegister.asset.path, "assets/claim-register.csv");

  // 14 位专家提供的 64 个预制包必须全部经过真实目录校验、受管安装和激活，
  // 避免 catalog 只登记名称但发布物缺文件，或单个 reference/asset 破坏整批安装。
  const legacyBuiltinNames = new Set([
    "amazon-sku-profit-summary",
    "amazon-inventory-ledger-summary",
    "amazon-operating-analysis",
    "amazon-product-image-generation",
    "ecommerce-product-video-generation",
    // skill-management 是通用元 Skill，不属于十四位业务专家的 64 项能力。
    "skill-management",
    // 运营复盘自助链路由 Product 按需组合，不属于十四位专家的固定能力集。
    "amazon-monitoring-data-fetch",
    "amazon-operation-review",
    "amazon-report-generate"
  ]);
  const expertBuiltinCatalog = listBuiltinSkills()
    .filter((skill) => !legacyBuiltinNames.has(skill.name))
    .filter((skill) => !ASIN_RESEARCH_SKILL_NAMES.includes(skill.name));
  const expertBuiltinNames = expertBuiltinCatalog.map((skill) => skill.name);
  const expertBuiltinByName = new Map(
    expertBuiltinCatalog.map((skill) => [skill.name, skill])
  );
  assert.equal(expertBuiltinNames.length, 64);

  for (const skillName of expertBuiltinNames) {
    const validation = await validateSkillPackage(path.resolve("src", "builtin-skills", skillName));
    assert.equal(validation.valid, true, `${skillName}: ${validation.diagnostics.join("; ")}`);
    assert.equal(validation.metadata.name, skillName);
    assert.equal(
      validation.metadata.description,
      expertBuiltinByName.get(skillName).description,
      `${skillName}: catalog description must match SKILL.md`
    );
  }

  const expertBuiltinRoot = path.join(tempRoot, "expert-builtin-managed");
  const selectedExpertSkills = new AgentSkill({
    skillsPath: expertBuiltinRoot,
    skills: expertBuiltinNames
  });
  const expertIndex = await selectedExpertSkills.refresh();
  assert.equal(expertIndex.skills.length, 64);
  assert.deepEqual(
    expertIndex.skills.map((skill) => skill.name).sort(),
    [...expertBuiltinNames].sort()
  );
  assert.equal((await selectedExpertSkills.listInstallations())
    .filter((record) => record.sourceKind === "builtin").length, 64);

  for (const skillName of expertBuiltinNames) {
    const activated = await selectedExpertSkills.activate(skillName);
    assert.equal(activated.loadedSkill.name, skillName);
    assert.equal(activated.loadedSkill.content.length > 0, true);
  }

  // 通用 Skill 管理指南也必须作为真实预制包完成安装、激活和 reference 读取，不能
  // 只在 catalog 中登记一条不可用元数据。
  const managementRoot = path.join(tempRoot, "skill-management-managed");
  const managementRuntime = new AgentSkill({
    skillsPath: managementRoot,
    skills: ["skill-management"]
  });
  const managementIndex = await managementRuntime.refresh();
  assert.deepEqual(managementIndex.skills.map((skill) => skill.name), ["skill-management"]);
  const activatedManagement = await managementRuntime.activate("skill-management");
  assert.match(activatedManagement.loadedSkill.content, /skill_find/);
  assert.match(activatedManagement.loadedSkill.content, /skill_activate/);
  assert.match(activatedManagement.loadedSkill.content, /skill_resource/);
  assert.match(activatedManagement.loadedSkill.content, /skill_create/);
  assert.match(activatedManagement.loadedSkill.content, /skill_remove/);
  const managementLifecycle = await managementRuntime.readReference(
    "skill-management",
    "references/installation-lifecycle.md"
  );
  assert.match(managementLifecycle.loadedSkillReference.content, /AgentSkill\.install/);
  const managementUsage = await managementRuntime.readReference(
    "skill-management",
    "references/skill-usage-flow.md"
  );
  assert.match(managementUsage.loadedSkillReference.content, /search.*describe|skill_find/s);

  const opportunityReference = await selectedExpertSkills.readReference(
    "amazon-opportunity-discovery",
    "references/mcp-provider-research-contract.md"
  );
  assert.match(opportunityReference.loadedSkillReference.content, /sif_mcp/);
  assert.match(opportunityReference.loadedSkillReference.content, /sellersprite_mcp/);
  assert.match(opportunityReference.loadedSkillReference.content, /sorftime_mcp/);
  const opportunityAsset = await selectedExpertSkills.resolveAsset(
    "amazon-opportunity-discovery",
    "assets/templates/discovery-report-template.md"
  );
  assert.equal(opportunityAsset.asset.path, "assets/templates/discovery-report-template.md");

  // 五个广告数据 Skill 必须把确定性表格链路作为公开依赖，并在完整正文中明确
  // inspect -> compute -> validate、canonical result 和失败关闭语义。
  const spreadsheetSkillNames = [
    "amazon-ad-performance-diagnosis",
    "amazon-ad-budget-and-acos-planning",
    "amazon-ad-portfolio-planning",
    "amazon-ad-search-term-optimization",
    "amazon-kpi-reporting-system"
  ];
  const spreadsheetSkillRoot = path.join(tempRoot, "spreadsheet-skills-managed");
  const spreadsheetSkills = new AgentSkill({
    skillsPath: spreadsheetSkillRoot,
    skills: spreadsheetSkillNames
  });
  await spreadsheetSkills.refresh();
  assert.deepEqual(spreadsheetSkills.definitions.map((skill) => skill.name).sort(), [...spreadsheetSkillNames].sort());
  for (const definition of spreadsheetSkills.definitions) {
    assert.deepEqual(definition.requiredTools, [
      "spreadsheet_inspect",
      "spreadsheet_compute",
      "spreadsheet_validate"
    ]);
    const activated = await spreadsheetSkills.activate(definition.name);
    assert.match(activated.loadedSkill.content, /spreadsheet_inspect/);
    assert.match(activated.loadedSkill.content, /spreadsheet_compute/);
    assert.match(activated.loadedSkill.content, /spreadsheet_validate/);
    assert.match(activated.loadedSkill.content, /analysisId\/resultId/);
    assert.match(activated.loadedSkill.content, /补数清单/);
  }

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

async function assertTextResourcesHaveNoControlCharacters(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      await assertTextResourcesHaveNoControlCharacters(entryPath);
      continue;
    }
    if (!/\.(?:csv|json|md|txt|ya?ml)$/i.test(entry.name)) continue;
    const content = await fs.readFile(entryPath, "utf8");
    assert.doesNotMatch(
      content,
      /[\u0000-\u0009\u000b-\u001f\u007f]/,
      `Unexpected control character in ${entryPath}`
    );
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
