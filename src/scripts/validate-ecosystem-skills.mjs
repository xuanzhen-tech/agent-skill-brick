/**
 * 发布门禁：验证生态目录、离线包、安装事务和 AgentSkill 可见性。
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  AgentSkill,
  createCatalogSkillSource,
  getSkillCatalogEntry,
  installSkillPackage,
  listBuiltinSkills,
  listManagedSkillInstallations,
  listSkillCatalog,
  scanSkillRoots,
  validateSkillPackage
} from "../index.mjs";

const expectedEcosystemCount = 203;
const builtinRoot = fileURLToPath(new URL("../builtin-skills", import.meta.url));
const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-ecosystem-validation-"));

try {
  assert.equal(listBuiltinSkills().length, 79, "legacy builtin catalog must remain core-only");
  const catalog = readAllCatalog({ collections: ["ecosystem"] });
  assert.equal(catalog.length, expectedEcosystemCount);
  assert.equal(new Set(catalog.map((entry) => entry.name)).size, expectedEcosystemCount);
  assert.equal(new Set(catalog.map((entry) => entry.legacyEcosystemId)).size, expectedEcosystemCount);
  assert.equal(catalog.filter((entry) => entry.originKind === "template").length, 171);
  assert.equal(catalog.filter((entry) => entry.originKind === "external-listing").length, 32);
  assert.equal(catalog.filter((entry) => entry.sourceRepository === "nexscope-ai/eCommerce-Skills").length, 162);
  assert.equal(catalog.filter((entry) => entry.sourceRepository === "noique/cross-border-ecommerce-skills").length, 9);
  assert.equal(catalog.filter((entry) => entry.sourceRepository === "hikari0511/awesome-amazon-ec-skills").length, 32);
  assert.equal(catalog.filter((entry) => entry.distributionStatus === "review-required").length, 9);
  assert.equal(catalog.filter((entry) => entry.distributionStatus === "redistributable").length, 194);

  const priceLegacyId = "nexscope-ai-ecommerce-skills-price-optimization-tool";
  const price = getSkillCatalogEntry(priceLegacyId);
  assert.equal(price?.name, "price-optimization-tool");
  assert.equal(price.collection, "ecosystem");
  assert.equal(price.sceneTags.includes("pricing-profit"), true);
  assert.equal(listSkillCatalog({ collections: ["ecosystem"], query: "价格优化" }).items.some((entry) => entry.name === price.name), true);

  const firstPage = listSkillCatalog({ collections: ["ecosystem"], limit: 17 });
  const secondPage = listSkillCatalog({ collections: ["ecosystem"], limit: 17, cursor: firstPage.nextCursor });
  assert.equal(firstPage.items.length, 17);
  assert.equal(secondPage.items.length, 17);
  assert.equal(firstPage.items.some((left) => secondPage.items.some((right) => right.name === left.name)), false);
  assert.throws(
    () => listSkillCatalog({ collections: ["core"], cursor: firstPage.nextCursor }),
    (error) => error?.code === "skill_catalog_cursor_invalid"
  );
  assert.throws(
    () => listSkillCatalog({ limit: 201 }),
    (error) => error?.code === "skill_catalog_limit_invalid"
  );

  for (const entry of catalog) {
    assert.equal(entry.collection, "ecosystem");
    assert.equal(entry.platforms.length > 0, true, `${entry.name} must have platforms`);
    assert.equal(entry.sceneTags.length > 0, true, `${entry.name} must have scene tags`);
    const skillDirectory = path.join(builtinRoot, entry.name);
    const validation = await validateSkillPackage(skillDirectory);
    assert.equal(validation.valid, true, `${entry.name}: ${validation.diagnostics.join("; ")}`);
    const content = await fs.readFile(path.join(skillDirectory, "SKILL.md"), "utf8");
    assert.equal(sha256(content), entry.contentHash, `${entry.name} content hash mismatch`);
    assert.equal(/\b(?:sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16})\b/.test(content), false);
  }

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("network access is forbidden during catalog installation");
  };
  try {
    const concurrent = catalog.slice(0, 8).map((entry) => installSkillPackage({
      source: createCatalogSkillSource(entry.legacyEcosystemId),
      managedRoot: temporaryRoot,
      conflict: "check"
    }));
    const results = await Promise.all(concurrent);
    assert.equal(results.every((result) => result.status === "installed"), true);

    for (const entry of catalog.slice(8)) {
      const result = await installSkillPackage({
        source: createCatalogSkillSource(entry.name),
        managedRoot: temporaryRoot,
        conflict: "check"
      });
      assert.equal(result.status, "installed");
    }
  } finally {
    globalThis.fetch = originalFetch;
  }

  const installations = await listManagedSkillInstallations({ managedRoot: temporaryRoot });
  assert.equal(installations.length, expectedEcosystemCount);
  const index = await scanSkillRoots({ skillsPath: temporaryRoot });
  assert.equal(index.skills.length, expectedEcosystemCount);

  const selectedRoot = path.join(temporaryRoot, "selected");
  const selected = new AgentSkill({ skillsPath: selectedRoot, skills: [price.name] });
  const prompt = await selected.buildPrompt();
  assert.match(prompt, /price-optimization-tool/);
  const found = await selected.find({ query: "价格", collection: "ecosystem", sceneTag: "pricing-profit" }, { skillFindClient: noRemoteClient() });
  assert.equal(found.skills[0]?.name, price.name);
  const activated = await selected.activate(price.name);
  assert.match(activated.loadedSkill.content, /Price Optimization Tool/);

  console.log(`[validate-ecosystem-skills] ok (${catalog.length} offline skills)`);
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}

function readAllCatalog(input) {
  const items = [];
  let cursor;
  do {
    const page = listSkillCatalog({ ...input, limit: 200, ...(cursor ? { cursor } : {}) });
    items.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return items;
}

function noRemoteClient() {
  return {
    async search() {
      throw new Error("remote search should not run");
    }
  };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
