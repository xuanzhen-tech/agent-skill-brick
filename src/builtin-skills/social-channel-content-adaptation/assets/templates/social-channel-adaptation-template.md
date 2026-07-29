<!--
文件功能：提供社媒渠道草稿、规则证据、声明映射和视觉需求交接的正式输出模板。
职责边界：模板中的内容均为待人工审核草稿，不构成发布、排程、互动回复或平台规则核验。
重要关联：字段语义见 references/social-channel-adaptation-contract.md；生成前遵守上级 SKILL.md。
-->

# 社媒渠道内容适配工作包

## 1. 状态

| 字段 | 值 |
|---|---|
| Adaptation ID / Version |  |
| Core Content ID / Version |  |
| Core Approval Evidence |  |
| Channels / Locales |  |
| Generated At |  |
| Reviewer |  |
| Result Status | `draft_for_review / blocked / out_of_scope` |
| Reason Codes | `[none]` |
| Publish Status | `not_published` |
| Schedule Status | `not_scheduled` |
| Interaction Reply Status | `not_created` |

## 2. 核心内容门禁

### 2.1 核心内容来源

| Core Content ID | Source Evidence ID | Version / Approval | Parent Evidence IDs | Source Type | Source Locator / Owner | Temporal Scope | Estimation Status | Transformation Type | Applicable Scope | Valid Until |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `current_rule` |  |  |  |  |

### 2.2 Agent 分段对象

| Agent Output ID | Core Segment ID | Type | Approved Text | Claim IDs | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Prohibited Expansion |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` | `current_rule` | `not_applicable` | `segmentation` |  |

## 3. 当前渠道规则

| Rule ID | Channel / Locale | Category | Constraint | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Version | Verified At | Valid Until | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `current_rule` | `reported` |  |  |  |  |  |  |

## 4. 逐渠道草稿

### 渠道：`<channel>` / Locale：`<locale>`

| Agent Output ID | Draft Segment ID | Core Segment ID | Adapted Text | Applied Rule IDs | Claim IDs | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Transformation Summary | Uncertainty | Human Review |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` | `current_rule` | `not_applicable` |  |  |  |  |

`transformation_type` 只允许 `normalized / excerpted / translated`；四轴不可省略或合并。

## 5. 声明—规则证据矩阵

| Agent Output ID | Draft Statement ID | Text | Claim Evidence | Rule Evidence | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Support | Required Change |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` | `current_rule` | `not_applicable` |  | `supported / conditional / unsupported / conflicted` |  |

## 6. 资产需求交接

| Agent Output ID | Requirement ID | Channel Draft ID | Content Intent | Channel Context | Approved Claims | Existing Assets | Gap | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 04 Owner | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` | `current_rule` | `not_applicable` |  | 第 04 专家 |  |

## 7. 促销与政策依赖

| Dependency | Upstream ID | Version / Date | Applicable Scope | Parent Evidence IDs | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Status | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Promotion Brief |  |  |  |  |  |  |  |  |  |  | 第 06 专家 |
| Policy / Disclosure / Rights |  |  |  |  |  |  |  |  |  |  | 第 09 专家 |

## 8. 缺口和冲突

| Gap ID | Agent Output ID | Channel / Draft | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Reason Code | Evidence State | Required Input | Owner | Effect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` | `current_rule` | `not_applicable` | `gap_classification` |  |  |  |  |  |

## 9. 人工审核

- [ ] 核心内容版本和批准状态有效
- [ ] 每个事实性句子有 claim Evidence
- [ ] 每个格式改变有当前规则 Evidence
- [ ] 未猜字符、媒体、标签、链接或 CTA 限制
- [ ] 未引入未经批准的功效、比较、折扣或紧迫性
- [ ] 视觉只形成第 04 的 asset requirement
- [ ] 促销引用第 06 正式 brief
- [ ] 政策问题引用第 09 当前证据
- [ ] 未调用 Web、邮件、shell 网络或任何发布平台
- [ ] 发布、排程和互动回复状态均为 `not_*`

## 10. 未执行声明

本工作包没有抓取渠道规则或社媒数据，没有登录任何账号，没有上传资产，没有回复评论或私信，没有排程、发布、删除或同步任何内容。
