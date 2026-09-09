# Skill 安装与生效机制

## 路径真值

AgentSkill 的通用默认目录不能代替产品实际注入的 `skillsPath`。本产品默认使用 `<用户主目录>/<产品目录名>/.agent-cli/skills/`，专家使用 `<用户主目录>/<产品目录名>/.agent-cli/operations-experts/<expertId>/skills/`；占位符取自当前环境与宿主信息，实际注入值优先。

Agent 不应直接写该目录。远端安装由 `skill_find` 委托 AgentSkill，创建由 `skill_create` 先在系统临时目录组包再调用 `AgentSkill.install()`，删除由 `skill_remove` 委托 `AgentSkill.remove()`。最终路径、包校验、事务替换、安装登记和索引刷新都由 AgentSkill 决定。

## 安装链路

```text
远端候选或完整本地包
→ AgentSkill 暂存来源
→ 校验 SKILL.md、frontmatter、文件数量、大小、路径和 symlink
→ 处理 conflict 策略
→ 原子切换到当前 skillsPath
→ 更新安装登记
→ refresh 重建索引
→ 产品选择策略决定是否对当前 Agent 可见
```

本产品通过选择代理将成功安装的 canonical name 加入当前 Agent 的用户启用选择；这不是修改产品预置集合。安装后仍需核验实际可用状态。启停通过 Product 公开入口完成，不直接修改 JSON 状态文件，也不以 `skill_activate` 代替持久启用。

## 状态语义

- `installed`：此前不存在，本次成功安装。
- `replaced`：成功替换已有 Skill；用户主动覆盖依据用户授权，启动时预置覆盖依据产品同步策略。
- `unchanged`：相同内容已经存在，本次没有重复写入。
- `conflict`：同名但内容或来源不同，默认未写入。

安装结果中的 `managedRoot`、`path` 或 `managedSkillsPath` 表示本次真实路径，只用于展示和核验。

## 删除与更新

预置 Skill 不允许删除，只能启用或停用；`skill_remove` 和产品删除接口都会拦截预置删除请求。非预置 Skill 在用户明确要求后可通过公开删除入口移除，工具只接收精确 id/name，不接收路径。用户主动同名更新先检查冲突，明确授权后覆盖；长期定制预置项，应先说明重启还原，再建议创建不同名完整副本，验证后停用原项。

非预置删除成功会清理当前 Agent 的受管文件、安装登记、索引及持久启用选择；外部源包、其他 Agent 副本和历史对话保留，该启动策略不会自动补装已删除的非预置项。产品预置集合与用户启用选择是独立概念。

安装、替换和删除通过 SDK 事务处理；失败按实际结果与权威状态报告，不保证旧包一定可用。预置同步失败项本次隔离并记录诊断，下次启动重试；不得强行启用旧包或清空状态绕过失败。
