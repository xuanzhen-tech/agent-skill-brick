/**
 * 自助上传 Skill 的发布门禁。
 *
 * 本脚本只验证自助 catalog 声明的目录，确保管理后台创建的 PR 无法绕过
 * AgentSkill 自身的内置来源解析和受管安装校验。它不会修改仓库内容。
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  AgentSkill,
  createBuiltinSkillSource,
  listBuiltinSkills
} from "../index.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const catalogPath = path.join(repoRoot, "src", "main", "self-service-builtin-skill-catalog.json");
const entries = JSON.parse(await fs.readFile(catalogPath, "utf8"));

if (!Array.isArray(entries)) throw new Error("self-service builtin skill catalog must be an array");
const names = entries.map((entry) => entry?.name);
if (new Set(names).size !== names.length) throw new Error("self-service builtin skill names must be unique");

const publicCatalog = new Map(listBuiltinSkills().map((entry) => [entry.name, entry]));
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-self-service-"));
try {
  for (const entry of entries) {
    const publicEntry = publicCatalog.get(entry.name);
    if (!publicEntry || publicEntry.version !== entry.version || publicEntry.description !== entry.description) {
      throw new Error(`Self-service catalog entry is not publicly visible: ${entry.name}`);
    }
    const runtime = new AgentSkill({ skillsPath: path.join(tempRoot, entry.name), skillNames: [entry.name] });
    await runtime.install(createBuiltinSkillSource(entry.name), { conflict: "replace" });
    await runtime.dispose?.();
  }
  await validateCatalogExtensionFixture(tempRoot);
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

console.log(`Self-service builtin skill validation passed (${entries.length} entries).`);

async function validateCatalogExtensionFixture(managedRoot) {
  // 首次上线时正式 catalog 仍为空，因此复制一份运行时并注入临时 Skill，证明
  // JSON catalog、公开枚举和受管安装整条扩展链路确实可用。
  const fixtureRoot = await fs.mkdtemp(path.join(repoRoot, ".self-service-fixture-"));
  try {
    await fs.cp(path.join(repoRoot, "src"), path.join(fixtureRoot, "src"), { recursive: true });
    const skillName = "self-service-validation-fixture";
    const skillRoot = path.join(fixtureRoot, "src", "builtin-skills", skillName);
    await fs.mkdir(skillRoot, { recursive: true });
    await fs.writeFile(
      path.join(skillRoot, "SKILL.md"),
      "---\nname: self-service-validation-fixture\ndescription: 自助 catalog 校验 fixture\n---\n\n# Fixture\n"
    );
    await fs.writeFile(
      path.join(fixtureRoot, "src", "main", "self-service-builtin-skill-catalog.json"),
      `${JSON.stringify([{ id: skillName, name: skillName, version: "9.9.9", description: "自助 catalog 校验 fixture" }], null, 2)}\n`
    );
    const fixtureSdk = await import(`${pathToFileURL(path.join(fixtureRoot, "src", "index.mjs")).href}?fixture=${Date.now()}`);
    const fixtureCatalog = fixtureSdk.listBuiltinSkills();
    if (!fixtureCatalog.some((entry) => entry.name === skillName && entry.version === "9.9.9")) {
      throw new Error("Self-service fixture is not publicly visible");
    }
    const runtime = new fixtureSdk.AgentSkill({
      skillsPath: path.join(managedRoot, "fixture"),
      skillNames: [skillName]
    });
    await runtime.refresh();
    if (!runtime.definitions.some((entry) => entry.name === skillName)) {
      throw new Error("Self-service fixture cannot be installed by AgentSkill");
    }
    await runtime.dispose?.();
  } finally {
    await fs.rm(fixtureRoot, { recursive: true, force: true });
  }
}
