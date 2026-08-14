# Skill 安装与生效机制

## 路径真值

AgentSkill 默认使用 `~/.agent-cli/skills`。产品可以注入自己的 `skillsPath`，但该路径仍应位于产品管理的 `.agent-cli/skills` 范围。运行时注入值优先于通用默认值。

Agent 不应直接写该目录。远端安装由 `skill_find` 委托 AgentSkill，创建由 `skill_create` 先在系统临时目录组包再调用 `AgentSkill.install()`。最终路径、包校验、事务替换、安装登记和索引刷新都由 AgentSkill 决定。

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

产品如果给 AgentSkill 包装了选择代理，成功安装会把 canonical name 加入产品白名单。没有选择代理时，selected 模式下的新 Skill 可能已经落盘但尚不可见；宿主应通过公开 `setSkillNames()` 更新选择，不直接修改 JSON 状态文件。

## 状态语义

- `installed`：此前不存在，本次成功安装。
- `replaced`：用户授权后成功替换已有 Skill。
- `unchanged`：相同内容已经存在，本次没有重复写入。
- `conflict`：同名但内容或来源不同，默认未写入。

安装结果中的 `managedRoot`、`path` 或 `managedSkillsPath` 表示本次真实路径，只用于展示和核验。

## 删除与更新

删除只能通过 AgentSkill 的公开删除合同，并受产品默认 Skill 保护规则约束。更新默认先检查冲突；未知来源或用户手工修改的同名 Skill 不应被自动覆盖。

安装、替换或删除失败时，旧 Skill 应继续可用，不留下半安装目录或错误登记。
