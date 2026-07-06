#!/usr/bin/env node
/**
 * agent-skill 面向 host 的命令入口。
 *
 * 这个可执行入口供 host launcher 和 release workflow 扫描托管目录、写入 index、
 * 管理已安装 skills。它只在配置的 managed root 内执行文件操作，并且永不
 * 执行 skill scripts。
 */

import process from "node:process";

import { brickDefinition } from "./brick-definition.mjs";
import { createDiagnosticsReport } from "./main/diagnostics.mjs";
import { resolveSkillConfig } from "./main/launch-config.mjs";
import { resolveSkillRoots, scanSkillRoots, writeSkillIndex } from "./main/skill-index.mjs";
import { installSkillPackage, removeManagedSkill } from "./main/skill-package.mjs";

const command = process.argv[2] || "help";
const args = process.argv.slice(3);

try {
  if (command === "version" || command === "--version" || command === "-v") {
    console.log(brickDefinition.version);
  } else if (command === "diagnostics") {
    const config = resolveSkillConfig(process.env, parseCommonOptions(args));
    writeOutput(await createDiagnosticsReport(config), args);
  } else if (command === "roots") {
    const config = resolveSkillConfig(process.env, parseCommonOptions(args));
    writeOutput({ roots: resolveSkillRoots(config) }, args);
  } else if (command === "scan") {
    const config = resolveSkillConfig(process.env, parseCommonOptions(args));
    const index = await scanSkillRoots(config);
    await writeSkillIndex(config.indexPath, index);
    writeOutput({ indexPath: config.indexPath, ...index }, args);
  } else if (command === "install") {
    const config = resolveSkillConfig(process.env, parseCommonOptions(args));
    const source = getPositionalArgs(args)[0];
    writeOutput(await installSkillPackage({ source, managedRoot: config.managedRoot }), args);
  } else if (command === "update") {
    throw new Error("update requires an install source in this brick version. Use agent-skill install <source>.");
  } else if (command === "remove") {
    const config = resolveSkillConfig(process.env, parseCommonOptions(args));
    const skill = getPositionalArgs(args)[0];
    writeOutput(await removeManagedSkill({ skill, managedRoot: config.managedRoot }), args);
  } else if (command === "manifest") {
    writeOutput({
      schemaVersion: "agent-skill.manifest.v1",
      id: brickDefinition.id,
      version: brickDefinition.version,
      indexSchemaVersion: "agent-skill.index.v1",
      artifactType: "skills-index"
    }, args);
  } else {
    printHelp();
    process.exitCode = command === "help" || command === "--help" || command === "-h" ? 0 : 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function parseCommonOptions(args) {
  const options = {};
  // 这些选项由所有子命令共享，让命令处理器可以只关注自己的操作。
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--workspace" && next) {
      options.workspace = next;
      index += 1;
    } else if (arg === "--managed-root" && next) {
      options.managedRoot = next;
      index += 1;
    } else if (arg === "--index" && next) {
      options.indexPath = next;
      index += 1;
    }
  }
  return options;
}

function getPositionalArgs(args) {
  const optionNamesWithValues = new Set(["--workspace", "--managed-root", "--index"]);
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (optionNamesWithValues.has(arg)) {
      index += 1;
    } else if (!arg.startsWith("--")) {
      values.push(arg);
    }
  }
  return values;
}

function writeOutput(value, args) {
  if (args.includes("--json")) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  if (value?.schemaVersion === "agent-skill.index.v1") {
    console.log(`skills=${value.skills.length} index=${value.indexPath ?? ""}`);
    return;
  }
  console.log(JSON.stringify(value, null, 2));
}

function printHelp() {
  console.log(`agent-skill ${brickDefinition.version}

用法:
  agent-skill version
  agent-skill diagnostics [--json]
  agent-skill roots [--json]
  agent-skill scan --workspace <path> --index <path> [--json]
  agent-skill install <local-dir|zip-file|https-url|registry-json-url> [--managed-root <path>] [--json]
  agent-skill remove <skill> [--managed-root <path>] [--json]
  agent-skill manifest [--json]
`);
}
