/**
 * 用户来源与官方来源同名时的冲突和持久决策。
 *
 * 该登记属于 AgentSkill 私有持久状态。公开读取会移除 incomingSourceRef，避免向
 * Product 暴露本地包路径或完整 inline 内容；Product 只消费安全来源摘要。
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const SOURCE_CONFLICT_REGISTRY_FILE = ".agent-skill-source-decisions.json";
const SOURCE_CONFLICT_REGISTRY_SCHEMA = "agent-skill.source-conflicts.v1";
const SOURCE_CONFLICT_MUTATION_QUEUES = new Map();
const ALLOWED_STATUSES = new Set(["pending", "resolved", "stale"]);

export async function listManagedSkillSourceConflicts({ managedRoot, status = "all" }) {
  if (status !== "all" && !ALLOWED_STATUSES.has(status)) {
    throw sourceConflictError(
      "skill_source_conflict_status_invalid",
      "source conflict status must be pending, resolved, stale, or all"
    );
  }
  const registry = await readSourceConflictRegistry(managedRoot);
  return Object.values(registry.conflicts)
    .filter((conflict) => status === "all"
      || conflict.status === status
      || (status === "pending" && conflict.status === "resolving"))
    .sort(compareConflicts)
    .map(toPublicSourceConflict);
}

export async function getManagedSkillSourceConflict({ managedRoot, conflictId }) {
  const registry = await readSourceConflictRegistry(managedRoot);
  const conflict = registry.conflicts[conflictId];
  return conflict ? toPublicSourceConflict(conflict) : undefined;
}

export async function getManagedSkillSourceConflictRecord({ managedRoot, conflictId }) {
  const registry = await readSourceConflictRegistry(managedRoot);
  return registry.conflicts[conflictId];
}

export async function recordManagedSkillSourceConflict({
  managedRoot,
  skillName,
  existingInstallation,
  incomingInstallation,
  incomingSourceRef
}) {
  return await withSourceConflictMutationLock(managedRoot, async () => {
    const registry = await readSourceConflictRegistry(managedRoot);
    const existingSource = existingInstallationSummary(existingInstallation);
    const incomingSource = incomingInstallationSummary(incomingInstallation);
    const conflictId = createSourceConflictId({ skillName, existingSource, incomingSource });
    const now = new Date().toISOString();

    for (const conflict of Object.values(registry.conflicts)) {
      if (conflict.skillName === skillName && conflict.conflictId !== conflictId && conflict.status !== "stale") {
        conflict.status = "stale";
        conflict.staleAt = now;
        conflict.updatedAt = now;
      }
    }

    const previous = registry.conflicts[conflictId];
    const next = normalizeSourceConflictRecord({
      ...(previous ?? {}),
      conflictId,
      skillName,
      status: previous?.status ?? "pending",
      reason: "user_source_conflicts_with_official",
      existingSource,
      incomingSource,
      incomingSourceRef: cloneJson(incomingSourceRef),
      allowedDecisions: ["keep-local", "use-official"],
      createdAt: previous?.createdAt ?? now,
      updatedAt: now
    });
    registry.conflicts[conflictId] = next;
    await writeSourceConflictRegistry(managedRoot, registry);
    return toPublicSourceConflict(next);
  });
}

export async function setManagedSkillSourceConflictState({
  managedRoot,
  conflictId,
  status,
  decision,
  resolvedInstallationId,
  clearDecision = false
}) {
  return await withSourceConflictMutationLock(managedRoot, async () => {
    const registry = await readSourceConflictRegistry(managedRoot);
    const conflict = registry.conflicts[conflictId];
    if (!conflict) {
      throw sourceConflictError("skill_source_conflict_not_found", `Unknown source conflict: ${conflictId}`);
    }
    const now = new Date().toISOString();
    conflict.status = status;
    conflict.updatedAt = now;
    if (clearDecision) {
      delete conflict.decision;
      delete conflict.decidedAt;
      delete conflict.resolvedInstallationId;
    } else if (decision) {
      conflict.decision = decision;
      if (status === "resolved") conflict.decidedAt = conflict.decidedAt ?? now;
    }
    if (resolvedInstallationId) conflict.resolvedInstallationId = resolvedInstallationId;
    if (status === "stale") conflict.staleAt = conflict.staleAt ?? now;
    registry.conflicts[conflictId] = normalizeSourceConflictRecord(conflict);
    await writeSourceConflictRegistry(managedRoot, registry);
    return toPublicSourceConflict(registry.conflicts[conflictId]);
  });
}

export async function reconcileManagedSkillSourceConflicts({ managedRoot, installations }) {
  return await withSourceConflictMutationLock(managedRoot, async () => {
    const registry = await readSourceConflictRegistry(managedRoot);
    const byName = new Map(installations.map((installation) => [installation.skillName, installation]));
    let changed = false;
    const now = new Date().toISOString();

    for (const conflict of Object.values(registry.conflicts)) {
      if (conflict.status === "stale") continue;
      const current = byName.get(conflict.skillName);
      const currentIdentity = current ? createSkillSourceIdentity(current) : undefined;

      if (conflict.status === "resolving") {
        if (currentIdentity === conflict.incomingSource.sourceIdentity) {
          conflict.status = "resolved";
          conflict.decision = "use-official";
          conflict.decidedAt = conflict.decidedAt ?? now;
          conflict.resolvedInstallationId = current.installationId;
        } else if (current?.installationId === conflict.existingSource.installationId) {
          conflict.status = "pending";
          delete conflict.decision;
          delete conflict.decidedAt;
          delete conflict.resolvedInstallationId;
        } else {
          conflict.status = "stale";
          conflict.staleAt = now;
        }
        conflict.updatedAt = now;
        changed = true;
        continue;
      }

      if (conflict.status === "pending" && current?.installationId !== conflict.existingSource.installationId) {
        conflict.status = "stale";
        conflict.staleAt = now;
        conflict.updatedAt = now;
        changed = true;
        continue;
      }

      if (conflict.status === "resolved" && conflict.decision === "keep-local"
        && current?.installationId !== conflict.existingSource.installationId) {
        conflict.status = "stale";
        conflict.staleAt = now;
        conflict.updatedAt = now;
        changed = true;
        continue;
      }

      if (conflict.status === "resolved" && conflict.decision === "use-official"
        && currentIdentity !== conflict.incomingSource.sourceIdentity) {
        conflict.status = "stale";
        conflict.staleAt = now;
        conflict.updatedAt = now;
        changed = true;
      }
    }

    if (changed) await writeSourceConflictRegistry(managedRoot, registry);
    return Object.values(registry.conflicts).map(toPublicSourceConflict);
  });
}

export function createSkillSourceIdentity(installation) {
  const type = optionalString(installation?.provenance?.type) ?? "local";
  const remoteId = optionalString(installation?.provenance?.remoteId);
  return remoteId
    ? `${type}:${remoteId}`
    : `${optionalString(installation?.sourceKind) ?? "unknown"}:${type}`;
}

export function isOfficialSkillInstallation(installation) {
  const type = installation?.provenance?.type;
  return installation?.sourceKind === "builtin"
    || installation?.sourceKind === "bundled"
    || type === "agent-skill-builtin"
    || type === "agent-skill-bundled"
    || type === "agent-ecosystem";
}

export function sourceConflictError(code, message, cause = undefined) {
  const error = new Error(message, cause ? { cause } : undefined);
  error.code = code;
  return error;
}

function existingInstallationSummary(installation) {
  return {
    installationId: requiredString(installation?.installationId, "installationId"),
    sourceKind: requiredString(installation?.sourceKind, "sourceKind"),
    sourceIdentity: createSkillSourceIdentity(installation),
    revision: requiredString(installation?.revision, "revision"),
    version: requiredString(installation?.version, "version"),
    contentHash: requiredString(installation?.contentHash, "contentHash"),
    installedAt: requiredString(installation?.installedAt, "installedAt"),
    updatedAt: optionalString(installation?.updatedAt) ?? installation.installedAt
  };
}

function incomingInstallationSummary(installation) {
  return {
    sourceKind: requiredString(installation?.sourceKind, "sourceKind"),
    sourceIdentity: createSkillSourceIdentity(installation),
    revision: requiredString(installation?.revision, "revision"),
    version: requiredString(installation?.version, "version"),
    contentHash: requiredString(installation?.contentHash, "contentHash")
  };
}

function createSourceConflictId({ skillName, existingSource, incomingSource }) {
  const fingerprint = JSON.stringify([
    skillName,
    existingSource.installationId,
    incomingSource.sourceIdentity
  ]);
  return `skill-source-conflict-${crypto.createHash("sha256").update(fingerprint).digest("hex").slice(0, 32)}`;
}

async function readSourceConflictRegistry(managedRoot) {
  const filePath = registryPath(managedRoot);
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    if (!parsed || parsed.schemaVersion !== SOURCE_CONFLICT_REGISTRY_SCHEMA || !isPlainObject(parsed.conflicts)) {
      throw new Error("来源冲突登记格式无效");
    }
    return {
      schemaVersion: SOURCE_CONFLICT_REGISTRY_SCHEMA,
      conflicts: Object.fromEntries(Object.entries(parsed.conflicts)
        .map(([conflictId, conflict]) => [conflictId, normalizeSourceConflictRecord(conflict)]))
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { schemaVersion: SOURCE_CONFLICT_REGISTRY_SCHEMA, conflicts: {} };
    }
    throw new Error(`无法读取 skill 来源冲突登记：${error instanceof Error ? error.message : String(error)}`);
  }
}

async function writeSourceConflictRegistry(managedRoot, registry) {
  const root = path.resolve(managedRoot);
  await fs.mkdir(root, { recursive: true });
  const filePath = registryPath(root);
  const temporaryPath = path.join(root, `.${SOURCE_CONFLICT_REGISTRY_FILE}.${crypto.randomUUID()}.tmp`);
  await fs.writeFile(temporaryPath, `${JSON.stringify({
    schemaVersion: SOURCE_CONFLICT_REGISTRY_SCHEMA,
    conflicts: registry.conflicts
  }, null, 2)}\n`, "utf8");
  try {
    await fs.rename(temporaryPath, filePath);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
}

function normalizeSourceConflictRecord(input) {
  if (!isPlainObject(input)) throw new Error("来源冲突记录必须是对象");
  const status = requiredString(input.status, "status");
  if (status !== "resolving" && !ALLOWED_STATUSES.has(status)) {
    throw new Error(`来源冲突状态无效：${status}`);
  }
  const decision = optionalString(input.decision);
  if (decision && decision !== "keep-local" && decision !== "use-official") {
    throw new Error(`来源冲突决策无效：${decision}`);
  }
  return {
    conflictId: requiredString(input.conflictId, "conflictId"),
    skillName: requiredString(input.skillName, "skillName"),
    status,
    reason: requiredString(input.reason, "reason"),
    existingSource: normalizeExistingSourceSummary(input.existingSource),
    incomingSource: normalizeIncomingSourceSummary(input.incomingSource),
    incomingSourceRef: cloneJson(input.incomingSourceRef),
    allowedDecisions: ["keep-local", "use-official"],
    createdAt: requiredString(input.createdAt, "createdAt"),
    updatedAt: requiredString(input.updatedAt, "updatedAt"),
    ...(decision ? { decision } : {}),
    ...(optionalString(input.decidedAt) ? { decidedAt: input.decidedAt } : {}),
    ...(optionalString(input.staleAt) ? { staleAt: input.staleAt } : {}),
    ...(optionalString(input.resolvedInstallationId)
      ? { resolvedInstallationId: input.resolvedInstallationId }
      : {})
  };
}

function normalizeExistingSourceSummary(input) {
  if (!isPlainObject(input)) throw new Error("来源摘要必须是对象");
  return {
    installationId: requiredString(input.installationId, "source.installationId"),
    sourceKind: requiredString(input.sourceKind, "source.sourceKind"),
    sourceIdentity: requiredString(input.sourceIdentity, "source.sourceIdentity"),
    revision: requiredString(input.revision, "source.revision"),
    version: requiredString(input.version, "source.version"),
    contentHash: requiredString(input.contentHash, "source.contentHash"),
    installedAt: requiredString(input.installedAt, "source.installedAt"),
    updatedAt: requiredString(input.updatedAt, "source.updatedAt")
  };
}

function normalizeIncomingSourceSummary(input) {
  if (!isPlainObject(input)) throw new Error("来源摘要必须是对象");
  return {
    sourceKind: requiredString(input.sourceKind, "source.sourceKind"),
    sourceIdentity: requiredString(input.sourceIdentity, "source.sourceIdentity"),
    revision: requiredString(input.revision, "source.revision"),
    version: requiredString(input.version, "source.version"),
    contentHash: requiredString(input.contentHash, "source.contentHash")
  };
}

function toPublicSourceConflict(conflict) {
  const { incomingSourceRef: _privateSource, ...publicConflict } = conflict;
  if (publicConflict.status === "resolving") {
    publicConflict.status = "pending";
    delete publicConflict.decision;
  }
  return cloneJson(publicConflict);
}

function compareConflicts(left, right) {
  return right.updatedAt.localeCompare(left.updatedAt, "en")
    || left.skillName.localeCompare(right.skillName, "en");
}

function registryPath(managedRoot) {
  return path.join(path.resolve(managedRoot), SOURCE_CONFLICT_REGISTRY_FILE);
}

async function withSourceConflictMutationLock(managedRoot, operation) {
  const root = path.resolve(managedRoot);
  const previous = SOURCE_CONFLICT_MUTATION_QUEUES.get(root) ?? Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  const tail = previous.catch(() => {}).then(() => current);
  SOURCE_CONFLICT_MUTATION_QUEUES.set(root, tail);
  await previous.catch(() => {});
  try {
    return await operation();
  } finally {
    release();
    if (SOURCE_CONFLICT_MUTATION_QUEUES.get(root) === tail) SOURCE_CONFLICT_MUTATION_QUEUES.delete(root);
  }
}

function cloneJson(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function requiredString(value, label) {
  const normalized = optionalString(value);
  if (!normalized) throw new Error(`来源冲突记录缺少 ${label}`);
  return normalized;
}

function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
