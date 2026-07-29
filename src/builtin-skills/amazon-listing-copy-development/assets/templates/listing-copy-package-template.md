<!--
文件功能：作为 Agent 生成 Amazon Listing 文案包及证据映射时使用的稳定模板。
职责边界：只规定交付结构，不预填产品事实、关键词、固定字段数量或字符限制。
重要关联：由 ../../SKILL.md 写入 outputs/listing-optimization/<case-id>/02-copy-development/ 前读取或物化；宣称等级见 ../../references/listing-copy-evidence-and-localization-contract.md。
-->

# Amazon Listing 文案包

## 任务摘要

- Case ID：
- Amazon 站点：
- 目标语言：
- 产品与变体：
- 写作模式：`new | rewrite | localization | partial`
- 目标字段：
- 总体状态：`ready | limited_keywords | blocked_missing_facts | blocked_claim_risk | conflicted_sources | upstream_contract_mismatch | stale_upstream | out_of_scope`

## 输入证据账本

这里仅记录 `input_evidence`，保留输入原四轴。

| Evidence ID | 来源路径/工具 | 版本/期间 | 使用字段 | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 限制 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 发布前事实边界

### 可使用事实

| Fact ID | 事实 | 适用变体 | 宣称等级 | 来源 |
|---|---|---|---|---|
|  |  |  |  |  |

### 禁止或待确认

| 项目 | 原因 | 影响字段 | 所需确认 |
|---|---|---|---|
|  |  |  |  |

## 字段成稿

### 标题

> 

- 使用的 Fact ID：
- 使用的 Keyword ID：
- 风险状态：

### 要点

#### 要点 1

> 

- 使用的 Fact ID：
- 使用的 Keyword ID：
- 风险状态：

#### 其余要点

按实际任务需要增加，不为凑数量创建空泛要点。

### 描述

> 

- 使用的 Fact ID：
- 使用的 Keyword ID：
- 风险状态：

### 后台词候选

| 候选词 | 来源 Keyword ID | 去重状态 | 政策核验状态 | 风险 |
|---|---|---|---|---|
|  |  |  |  |  |

## 备选表达

仅在用户要求时填写，并说明每个版本唯一改变的表达角度。

| 版本 | 改变的角度 | 文案 | 不变事实 |
|---|---|---|---|
|  |  |  |  |

## 多语言质量检查

| Copy ID | 数字/单位 | 条件/否定 | 事实含义 | 关键词自然度 | 人工审核 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Agent 文案谱系账本

这里仅记录 `agent_output`；Parent Evidence IDs 必须能在输入证据账本中找到。

| Copy ID | 字段 | Fact ID | Keyword ID | Parent Evidence IDs | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | Review status |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` |  |  | `coding` |  |

## 发布前待办

- [ ] 所有事实性句子都有来源。
- [ ] 未证宣称已删除或隔离。
- [ ] 变体范围正确。
- [ ] 数字、单位、条件和否定保持一致。
- [ ] 站点规则由当前可信资料核验。
- [ ] 高风险内容已安排合格人工审核。

## 能力声明

- 本 Skill 未直接调用 SIF 或其他外部业务数据源：
- 使用的上游对象及其原始四轴/父证据 ID：
- 未查询或不可见的内容：
- 本 Skill 未执行上传、发布、索引验证或排名保证。
