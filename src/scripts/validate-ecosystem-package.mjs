/**
 * 从 npm pack 的公开文件清单验证生态目录确实进入最终 SDK 包。
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { listSkillCatalog } from "../index.mjs";

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("npm_execpath is required to validate the package");
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packed = spawnSync(process.execPath, [npmCli, "pack", "--dry-run", "--json"], {
  cwd: process.cwd(),
  encoding: "utf8"
});
if (packed.status !== 0) {
  throw new Error(`npm pack --dry-run failed: ${packed.error?.message || packed.stderr || packed.stdout || "unknown error"}`);
}
const report = JSON.parse(packed.stdout);
const files = new Set((report[0]?.files ?? []).map((file) => file.path.replaceAll("\\", "/")));
assert.equal(files.has("src/main/ecosystem-skill-catalog.json"), true);
assert.equal(files.has("THIRD_PARTY_NOTICES.md"), true);

const ecosystemSkills = readAllEcosystemCatalog();
assert.equal(ecosystemSkills.length, 203);
for (const skill of ecosystemSkills) {
  assert.equal(
    files.has(`src/builtin-skills/${skill.name}/SKILL.md`),
    true,
    `npm package is missing ${skill.name}`
  );
}

console.log(`[validate-ecosystem-package] ok (${ecosystemSkills.length} packaged skills)`);
await validateInstalledPackage();

function readAllEcosystemCatalog() {
  const items = [];
  let cursor;
  do {
    const page = listSkillCatalog({
      collections: ["ecosystem"],
      limit: 200,
      ...(cursor ? { cursor } : {})
    });
    items.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return items;
}

async function validateInstalledPackage() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-package-smoke-"));
  try {
    const packResult = runNpm(["pack", "--json", "--pack-destination", temporaryRoot], repoRoot);
    const report = JSON.parse(packResult.stdout);
    const tarballPath = path.join(temporaryRoot, report[0].filename);
    const extractedRoot = path.join(temporaryRoot, "extracted");
    await fs.mkdir(extractedRoot, { recursive: true });
    const extracted = spawnSync("tar", ["-xzf", tarballPath, "-C", extractedRoot], {
      cwd: temporaryRoot,
      encoding: "utf8"
    });
    if (extracted.status !== 0) {
      throw new Error(`unable to extract npm package: ${extracted.error?.message || extracted.stderr || extracted.stdout || "unknown error"}`);
    }
    const packageRoot = path.join(extractedRoot, "package");
    const dependencySource = path.join(repoRoot, "node_modules", "@xuanzhen-tech", "agent-release-foundation");
    const dependencyTarget = path.join(packageRoot, "node_modules", "@xuanzhen-tech", "agent-release-foundation");
    await fs.mkdir(path.dirname(dependencyTarget), { recursive: true });
    await fs.cp(dependencySource, dependencyTarget, { recursive: true });

    const smokePath = path.join(packageRoot, "package-smoke.mjs");
    await fs.writeFile(smokePath, `
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { AgentSkill, getSkillCatalogEntry, listSkillCatalog } from "./src/index.mjs";

globalThis.fetch = async () => { throw new Error("package smoke must remain offline"); };
const page = listSkillCatalog({ collections: ["ecosystem"], query: "价格优化" });
assert.equal(page.total > 0, true);
const entry = getSkillCatalogEntry("nexscope-ai-ecommerce-skills-price-optimization-tool");
assert.equal(entry.name, "price-optimization-tool");
const skillsPath = path.join(process.cwd(), "managed-skills");
const runtime = new AgentSkill({ skillsPath, skills: [entry.name] });
const prompt = await runtime.buildPrompt();
assert.match(prompt, /price-optimization-tool/);
const activated = await runtime.activate(entry.name);
assert.match(activated.loadedSkill.content, /Price Optimization Tool/);
assert.equal((await fs.readdir(skillsPath)).includes(entry.name), true);
console.log("[package-root-smoke] ok");
`, "utf8");

    const smoke = spawnSync(process.execPath, [smokePath], {
      cwd: packageRoot,
      encoding: "utf8"
    });
    if (smoke.status !== 0) {
      throw new Error(`installed package smoke failed: ${smoke.error?.message || smoke.stderr || smoke.stdout || "unknown error"}`);
    }
    process.stdout.write(smoke.stdout);
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
}

function runNpm(argumentsList, cwd) {
  const result = spawnSync(process.execPath, [npmCli, ...argumentsList], {
    cwd,
    encoding: "utf8",
    env: process.env
  });
  if (result.status !== 0) {
    throw new Error(`npm ${argumentsList[0]} failed: ${result.error?.message || result.stderr || result.stdout || "unknown error"}`);
  }
  return result;
}
