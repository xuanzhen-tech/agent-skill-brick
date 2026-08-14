# Skill 包格式

## 目录结构

```text
skill-name/
├─ SKILL.md
├─ references/
├─ scripts/
└─ assets/
```

只有 `SKILL.md` 必须存在。不要创建空目录，也不要添加 README、安装指南或变更记录。

## SKILL.md

```markdown
---
name: marketplace-review-analysis
displayChineseName: 评论洞察
version: 0.1.0
description: 分析电商评论主题、证据和改进机会。适用于用户要求整理评论、发现差评原因或比较竞品口碑时。
requiredTools: [workspace_search]
optionalTools: [web_search]
---

# 评论洞察

## 目标

把评论转化为可复核的主题、证据与行动建议。

## 工作流

1. 确认来源、站点、时间范围和样本量。
2. 区分原始表达、事实和推断。
3. 输出主题、证据、限制和建议。

## 质量门

- 不把少量样本推广为整体结论。
- 每个主要判断保留可复查证据。
```

字段规则：

- `name`：必填，小写字母、数字和连字符，目录名与其一致。
- `description`：必填，是摘要阶段的主要触发依据，必须同时说明能力和使用场景。
- `displayChineseName`：可选，供展示使用。
- `version`：可选，使用 `x.y.z`。
- `capabilities`、`requiredTools`、`optionalTools`：可选，用于查找和能力判断。

## 资源分层

- `references/`：字段口径、API、政策、长示例和领域规则。正文明确何时读取哪一份。
- `scripts/`：稳定、可重复的确定性代码。不得嵌入密钥，激活 Skill 不会自动执行脚本。
- `assets/`：模板、图片、字体和其它可复制文件。通过 `skill_resource` 使用。

正文保持完成任务所需的最小信息，长内容按需放入一层 reference，不建立多层导航迷宫。触发条件必须写入 description，因为正文只有激活后才可见。
