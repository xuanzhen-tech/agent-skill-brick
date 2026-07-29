/**
 * 专家预制 skill catalog 生成器。
 *
 * 本脚本从解压后的专家包定位全部 SKILL.md，读取受控 frontmatter，并根据
 * 已迁入 src/builtin-skills 的实际内容生成静态 catalog。它只生成选择所需
 * 的轻量元数据，不把 HANDOFF、专家提示词或连接配置带入 SDK。
 */

import fs from "node:fs/promises";
import path from "node:path";

const EXPECTED_EXPERT_SKILLS = 64;

const [sourceRootInput, targetRootInput, outputPathInput] = process.argv.slice(2);
if (!sourceRootInput || !targetRootInput || !outputPathInput) {
  throw new Error(
    "Usage: node generate-expert-builtin-catalog.mjs <sourceRoot> <builtinRoot> <outputPath>"
  );
}

const sourceRoot = path.resolve(sourceRootInput);
const targetRoot = path.resolve(targetRootInput);
const outputPath = path.resolve(outputPathInput);
const sourceSkillFiles = await findSkillFiles(sourceRoot);

if (sourceSkillFiles.length !== EXPECTED_EXPERT_SKILLS) {
  throw new Error(
    `Expected ${EXPECTED_EXPERT_SKILLS} expert skills, got ${sourceSkillFiles.length}.`
  );
}

const entries = [];
for (const sourceSkillFile of sourceSkillFiles) {
  const directoryName = path.basename(path.dirname(sourceSkillFile));
  const targetSkillFile = path.join(targetRoot, directoryName, "SKILL.md");
  const content = (await fs.readFile(targetSkillFile, "utf8")).replace(/^\uFEFF/, "");
  const metadata = parseFrontmatter(content, directoryName);

  if (metadata.name !== directoryName) {
    throw new Error(
      `Skill name must match its directory: ${directoryName} != ${metadata.name}`
    );
  }

  entries.push({
    id: metadata.name,
    name: metadata.name,
    version: metadata.version ?? "0.1.0",
    description: metadata.description
  });
}

entries.sort((left, right) => left.name.localeCompare(right.name, "en"));
if (new Set(entries.map((entry) => entry.name)).size !== EXPECTED_EXPERT_SKILLS) {
  throw new Error("Expert skill names must be unique.");
}

await fs.writeFile(outputPath, renderCatalog(entries), "utf8");
console.log(JSON.stringify({
  count: entries.length,
  first: entries[0]?.name,
  last: entries.at(-1)?.name,
  outputPath
}));

async function findSkillFiles(root) {
  const results = [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findSkillFiles(entryPath));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      results.push(entryPath);
    }
  }
  return results;
}

function parseFrontmatter(content, directoryName) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Skill is missing frontmatter: ${directoryName}`);

  const name = readScalar(match[1], "name");
  const description = readScalar(match[1], "description");
  if (!name || !description) {
    throw new Error(`Skill is missing name or description: ${directoryName}`);
  }

  return {
    name,
    description,
    version: readScalar(match[1], "version")
  };
}

function readScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^(["'])(.*)\1$/, "$2");
}

function renderCatalog(entries) {
  const lines = [
    "/**",
    " * 14 位专家预制 skill 的静态目录。",
    " *",
    " * 本文件由迁入包的 SKILL.md 元数据机械生成，只保存产品选择所需的名称、",
    " * 版本和摘要；完整指令、reference 与 asset 仍以对应预制目录为准。",
    " */",
    "",
    "export const EXPERT_BUILTIN_SKILLS = Object.freeze(["
  ];

  for (const [index, entry] of entries.entries()) {
    lines.push(
      "  Object.freeze({",
      `    id: ${JSON.stringify(entry.id)},`,
      `    name: ${JSON.stringify(entry.name)},`,
      `    version: ${JSON.stringify(entry.version)},`,
      `    description: ${JSON.stringify(entry.description)}`,
      `  })${index === entries.length - 1 ? "" : ","}`
    );
  }

  lines.push("]);", "");
  return lines.join("\n");
}
