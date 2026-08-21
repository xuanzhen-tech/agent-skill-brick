# Skill 来源冲突合同

## 适用场景

当受管目录已经存在 user、directory 或 upload 来源的 Skill，而当前 SDK 或官方来源
随后提供相同 canonical name 时，AgentSkill 创建来源冲突。仅名称相同不足以证明
可以覆盖；官方来源必须带有可验证的 provenance 和稳定 source identity。

一个 pending 冲突只影响对应 Skill。Backend 不应等待用户选择后才启动，Product
也不应把 unavailable desired Skill 当成 active selection 或让回滚 poison Runtime。

## 查询

```js
const conflicts = await agentSkill.listSourceConflicts({
  status: "pending" // pending | resolved | stale | all
});

const conflict = await agentSkill.getSourceConflict(conflictId);
```

公开记录形状：

```js
{
  conflictId,
  skillName,
  status: "pending" | "resolved" | "stale",
  reason: "user_source_conflicts_with_official",
  existingSource: {
    installationId,
    sourceKind,
    sourceIdentity,
    revision,
    version,
    contentHash,
    installedAt,
    updatedAt
  },
  incomingSource: {
    sourceKind,
    sourceIdentity,
    revision,
    version,
    contentHash
  },
  allowedDecisions: ["keep-local", "use-official"],
  decision,
  decidedAt,
  staleAt
}
```

记录不公开绝对本机路径、完整 Skill 正文或内部 incoming source reference。

## 解决

```js
await agentSkill.resolveSourceConflict(conflictId, {
  decision: "keep-local" // 或 use-official
});
```

- `keep-local` 不修改文件，允许当前本地安装进入可见 index，并抑制同名官方来源。
- `use-official` 在明确授权后使用暂存、校验、原目录备份、原子切换和登记回滚事务。
- 同 conflictId、同 decision 重复调用幂等；已经提交相反 decision 时返回
  `skill_source_decision_conflict`，不会静默改写。
- 替换异常返回 `skill_source_resolution_failed`，原本地目录和安装登记保持可恢复，
  冲突回到 pending，可安全重试。

## 持久化与失效

决策保存在 `skillsPath` 的 AgentSkill 私有登记中。Product 不应依赖文件名或格式。
旧安装记录缺少 `installationId` 时，SDK 会从既有不可变登记字段派生稳定身份，无需
迁移目录或重装 Skill。

决策不因以下变化失效：

- 同一官方 source identity 升级版本、revision 或内容；
- keep-local 后用户继续编辑当前本地安装；
- Product、Client 或 SDK 普通重启和 Repair。

决策在以下情况下失效：

- 本地安装被删除后重新创建，installation identity 改变；
- 本地来源身份或官方 source identity 实质变化；
- 当前登记已无法证明目录属于原决策安装。

失效记录保留为 `stale` 供诊断；新的来源组合产生新的稳定 conflictId。
