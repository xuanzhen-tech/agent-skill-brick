import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  AgentSkill,
  getManagedSkillInstallation,
  installSkillPackage,
  listManagedSkillInstallations,
  removeManagedSkill
} from "../index.mjs";

const BUILTIN_NAME = "amazon-operation-review";
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-source-conflict-"));

try {
  await testKeepLocalAndStaleDecision(path.join(tempRoot, "keep-local"));
  await testUseOfficialAndIsolation(path.join(tempRoot, "use-official"));
  await testResolutionFailureRollback(path.join(tempRoot, "resolution-failure"));
  await testOfficialUpgradeKeepsInstallationIdentity(path.join(tempRoot, "official-upgrade"));
  await testLegacyInstallationIdentity(path.join(tempRoot, "legacy-installation"));
  console.log("[smoke-source-conflict] ok");
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function testKeepLocalAndStaleDecision(root) {
  const localSource = path.join(root, "source");
  const managedRoot = path.join(root, "managed");
  await writeSkill(localSource, BUILTIN_NAME, "Local operation review instructions");
  const localInstall = await installSkillPackage({ source: localSource, managedRoot });
  assert.match(localInstall.installation.installationId, /^installation-/);

  const runtime = new AgentSkill({ skillsPath: managedRoot, skills: [BUILTIN_NAME] });
  const conflictedIndex = await runtime.refresh();
  assert.deepEqual(conflictedIndex.skills, []);
  assert.equal(conflictedIndex.diagnostics.some((item) => item.code === "builtin_skill_conflict"), true);

  const [pending] = await runtime.listSourceConflicts({ status: "pending" });
  assert.equal(pending.skillName, BUILTIN_NAME);
  assert.equal(pending.status, "pending");
  assert.deepEqual(pending.allowedDecisions, ["keep-local", "use-official"]);
  assert.equal(pending.existingSource.installationId, localInstall.installation.installationId);
  assert.equal(pending.incomingSource.sourceIdentity, `agent-skill-builtin:builtin:${BUILTIN_NAME}`);
  assert.equal(JSON.stringify(pending).includes(path.resolve(root)), false);

  const kept = await runtime.resolveSourceConflict(pending.conflictId, { decision: "keep-local" });
  assert.equal(kept.conflict.status, "resolved");
  assert.equal(kept.conflict.decision, "keep-local");
  assert.equal(runtime.definitions.some((skill) => skill.name === BUILTIN_NAME), true);
  assert.match((await runtime.activate(BUILTIN_NAME)).loadedSkill.content, /Local operation review instructions/);

  const replay = await Promise.all([
    runtime.resolveSourceConflict(pending.conflictId, { decision: "keep-local" }),
    runtime.resolveSourceConflict(pending.conflictId, { decision: "keep-local" })
  ]);
  assert.equal(replay.every((item) => item.conflict.decision === "keep-local"), true);
  await assert.rejects(
    () => runtime.resolveSourceConflict(pending.conflictId, { decision: "use-official" }),
    (error) => error?.code === "skill_source_decision_conflict"
  );

  // 保留本地后允许用户继续编辑；contentHash 变化不能让来源决策失效。
  await writeSkill(path.join(managedRoot, BUILTIN_NAME), BUILTIN_NAME, "Locally edited after keep-local");
  const restarted = new AgentSkill({ skillsPath: managedRoot, skills: [BUILTIN_NAME] });
  await restarted.refresh();
  assert.match((await restarted.activate(BUILTIN_NAME)).loadedSkill.content, /Locally edited after keep-local/);
  assert.equal((await restarted.listSourceConflicts({ status: "pending" })).length, 0);

  // 删除并重新安装会获得新 installation identity，不能继承旧决定。
  await removeManagedSkill({ skill: BUILTIN_NAME, managedRoot });
  const reinstalled = await installSkillPackage({ source: localSource, managedRoot });
  assert.notEqual(reinstalled.installation.installationId, localInstall.installation.installationId);
  const afterReinstall = new AgentSkill({ skillsPath: managedRoot, skills: [BUILTIN_NAME] });
  await afterReinstall.refresh();
  const nextPending = await afterReinstall.listSourceConflicts({ status: "pending" });
  assert.equal(nextPending.length, 1);
  assert.notEqual(nextPending[0].conflictId, pending.conflictId);
  assert.equal((await afterReinstall.listSourceConflicts({ status: "stale" }))
    .some((item) => item.conflictId === pending.conflictId), true);
  await assert.rejects(
    () => afterReinstall.resolveSourceConflict(pending.conflictId, { decision: "keep-local" }),
    (error) => error?.code === "skill_source_conflict_stale"
  );
}

async function testUseOfficialAndIsolation(root) {
  const localSource = path.join(root, "source");
  const managedRoot = path.join(root, "managed");
  await writeSkill(localSource, BUILTIN_NAME, "Local source to replace");
  await installSkillPackage({ source: localSource, managedRoot });

  const runtime = new AgentSkill({
    skillsPath: managedRoot,
    skills: [BUILTIN_NAME, "amazon-inventory-ledger-summary"]
  });
  const index = await runtime.refresh();
  assert.equal(index.skills.some((skill) => skill.name === BUILTIN_NAME), false);
  assert.equal(index.skills.some((skill) => skill.name === "amazon-inventory-ledger-summary"), true);

  const [pending] = await runtime.listSourceConflicts({ status: "pending" });
  const resolved = await runtime.resolveSourceConflict(pending.conflictId, { decision: "use-official" });
  assert.equal(resolved.conflict.status, "resolved");
  assert.equal(resolved.installation.sourceKind, "builtin");
  assert.equal(resolved.installation.provenance.remoteId, `builtin:${BUILTIN_NAME}`);
  assert.doesNotMatch((await runtime.activate(BUILTIN_NAME)).loadedSkill.content, /Local source to replace/);

  const restarted = new AgentSkill({ skillsPath: managedRoot, skills: [BUILTIN_NAME] });
  await restarted.refresh();
  assert.equal((await restarted.listSourceConflicts({ status: "pending" })).length, 0);
  const replay = await restarted.resolveSourceConflict(pending.conflictId, { decision: "use-official" });
  assert.equal(replay.conflict.decision, "use-official");
  await assert.rejects(
    () => restarted.resolveSourceConflict("missing-conflict", { decision: "keep-local" }),
    (error) => error?.code === "skill_source_conflict_not_found"
  );
  await assert.rejects(
    () => restarted.resolveSourceConflict(pending.conflictId, { decision: "invalid" }),
    (error) => error?.code === "skill_source_decision_invalid"
  );
}

async function testResolutionFailureRollback(root) {
  const name = "source-resolution-fixture";
  const localSource = path.join(root, "local");
  const bundledSource = path.join(root, "bundle");
  const managedRoot = path.join(root, "managed");
  await writeSkill(localSource, name, "Original local source survives failure");
  await writeSkill(bundledSource, name, "Incoming bundled source");
  await installSkillPackage({ source: localSource, managedRoot });

  const runtime = new AgentSkill({ skillsPath: managedRoot });
  const conflictResult = await runtime.install({
    kind: "agent-skill.bundled.v1",
    packageName: "@xuanzhen-tech/source-fixture",
    packageVersion: "1.0.0",
    skillName: name,
    path: bundledSource
  }, { conflict: "check" });
  assert.equal(conflictResult.status, "conflict");
  assert.equal(conflictResult.sourceConflict.status, "pending");

  await fs.rm(bundledSource, { recursive: true, force: true });
  await assert.rejects(
    () => runtime.resolveSourceConflict(conflictResult.sourceConflict.conflictId, { decision: "use-official" }),
    (error) => error?.code === "skill_source_resolution_failed"
  );
  assert.match(
    await fs.readFile(path.join(managedRoot, name, "SKILL.md"), "utf8"),
    /Original local source survives failure/
  );
  const stillPending = await runtime.getSourceConflict(conflictResult.sourceConflict.conflictId);
  assert.equal(stillPending.status, "pending");
  assert.equal(stillPending.decision, undefined);
}

async function testLegacyInstallationIdentity(root) {
  await fs.mkdir(root, { recursive: true });
  const contentHash = "a".repeat(64);
  await fs.writeFile(path.join(root, ".agent-skill-installations.json"), `${JSON.stringify({
    schemaVersion: "agent-skill.installations.v1",
    installations: {
      legacy: {
        skillName: "legacy",
        version: "0.1.0",
        contentHash,
        revision: contentHash,
        sourceKind: "directory",
        provenance: { type: "directory" },
        installedAt: "2026-01-01T00:00:00.000Z"
      }
    }
  }, null, 2)}\n`, "utf8");
  const first = await listManagedSkillInstallations({ managedRoot: root });
  const second = await listManagedSkillInstallations({ managedRoot: root });
  assert.match(first[0].installationId, /^installation-legacy-/);
  assert.equal(first[0].installationId, second[0].installationId);
  assert.equal((await getManagedSkillInstallation({ managedRoot: root, skillName: "legacy" })).updatedAt,
    "2026-01-01T00:00:00.000Z");
}

async function testOfficialUpgradeKeepsInstallationIdentity(root) {
  const name = "official-upgrade-fixture";
  const bundledSource = path.join(root, "bundle");
  const managedRoot = path.join(root, "managed");
  await writeSkill(bundledSource, name, "Official bundle version one");
  const first = await installSkillPackage({
    source: bundledSourceDescriptor(bundledSource, name, "1.0.0"),
    managedRoot,
    conflict: "replace"
  });
  await writeSkill(bundledSource, name, "Official bundle version two");
  const second = await installSkillPackage({
    source: bundledSourceDescriptor(bundledSource, name, "2.0.0"),
    managedRoot,
    conflict: "replace"
  });
  assert.equal(second.installation.installationId, first.installation.installationId);
  assert.equal(second.installation.installedAt, first.installation.installedAt);
  assert.equal(second.installation.revision, "2.0.0");
}

async function writeSkill(directory, name, description) {
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "SKILL.md"), [
    "---",
    `name: ${name}`,
    `description: ${description}`,
    "version: 0.1.0",
    "---",
    "",
    description,
    ""
  ].join("\n"), "utf8");
}

function bundledSourceDescriptor(directory, skillName, packageVersion) {
  return {
    kind: "agent-skill.bundled.v1",
    packageName: "@xuanzhen-tech/source-fixture",
    packageVersion,
    skillName,
    path: directory
  };
}
