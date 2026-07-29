<!--
文件功能：定义客服模板的来源、变量、声明、翻译、风险、生命周期、版本和人工使用字段。
职责边界：只约束模板治理，不授权消息发送、平台同步、自动批准或跨客户数据复用。
重要关联：由 ../SKILL.md 在模板治理前读取；正式字段落入 ../assets/templates/template-governance-register.md。
-->

# 客服模板治理合同

## 一、模板记录

| 字段 | 要求 |
|---|---|
| `template_id` / `version` | 稳定 ID 与显式版本 |
| `use_case` | 单一、可理解场景 |
| `marketplace` / `language` | 适用站点和语言 |
| `owner` / `approvers` | 业务、政策、隐私、语言责任人 |
| `applicable_scope` / `exclusions` | 适用与禁止范围 |
| `source_evidence_ids` | 历史材料、政策和品牌证据 |
| `authorization_status` | verified / unverified / conflicted |
| `policy_evidence_ids` | 当前政策依据 |
| `lifecycle_status` | 仅使用允许枚举 |
| `risk_status` | 标准、待审或敏感阻塞 |
| `supersedes` / `superseded_by` | 版本关系 |
| `execution_status` / `send_status` | not_executed / not_sent |

## 二、生命周期

只允许：

```text
draft_for_review
approved_for_manual_use
deprecated
retired
```

状态转换需要操作人、时间、理由、Evidence IDs 与批准记录。不得静默覆盖旧版。

## 三、风险状态

```text
standard_review
needs_policy_review
needs_language_review
needs_privacy_review
blocked_sensitive_promise
source_or_authorization_unverified
```

生命周期与风险状态分开：模板可以处于 `draft_for_review + blocked_sensitive_promise`，但不能以风险字段替代审批状态。

## 四、变量字段

| 字段 | 要求 |
|---|---|
| `variable_id` / `name` | 稳定、可读名称 |
| `meaning` / `data_type` | 业务定义与类型 |
| `required` | yes / no / conditional |
| `allowed_source` | 当前案件 Evidence 类型 |
| `validation_rule` | 格式、范围、一致性和时效 |
| `missing_action` | block / clarify / omit |
| `conflict_action` | block_and_escalate |
| `display_format` | 呈现规则 |
| `privacy_class` | public / internal / sensitive / restricted |
| `default_value` | 高风险和事实变量禁止默认 |

## 五、声明与承诺

| 字段 | 要求 |
|---|---|
| `statement_id` | 模板事实或政策单元 |
| `source_locator` | 历史候选或 Agent 生成定位 |
| `template_text` | 去标识、变量化文本 |
| `parent_evidence_ids` | 直接支撑 |
| `statement_type` | courtesy / case_fact / policy / procedure / promise / escalation |
| `support_status` | supported / partially_supported / unsupported / conflicted |
| `promise_class` | none / informational / procedural / financial / legal_or_policy |
| `human_review_status` | pending / approved / revise / rejected |

未经批准的 financial/legal_or_policy 声明必须 `blocked_sensitive_promise`。

## 六、翻译字段

| 字段 | 要求 |
|---|---|
| `translation_id` / `segment_id` | 稳定且一一对应 |
| `source_locator` | 原文定位 |
| `translation_type` | agent_generated_translation |
| `glossary_version` | 无术语表时 none |
| `numbers_dates_negations_preserved` | yes / no / needs_review |
| `qualifier_notes` | 条件、例外、责任、程度 |
| `human_language_review` | not_required / pending / approved / rejected |

翻译不得覆盖原文或改变变量语义。

## 七、来源准入与隐私

每份历史材料必须记录：

- owner 与授权；
- 版本、时间、站点、语言、场景；
- 完整性与上下文；
- PII、支付、法律、安全和承诺风险；
- policy Evidence；
- 是否允许抽取。

来源不明、未授权、截断或含不可去除敏感数据的材料不得进入批准模板。

## 八、四轴、谱系与缺失

每条来源和 Agent 输出分别记录：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- `parent_evidence_ids`，仅 Agent 输出

缺失枚举固定为：

```text
not_returned / not_queried / parse_failed / missing / conflicted / true_zero
```

## 九、人工使用

`approved_for_manual_use` 模板每次使用仍需：

- 当前案件 Evidence；
- 变量验证；
- 当前政策检查；
- PII 和敏感承诺检查；
- 人工语言复核；
- 授权人员在本 Skill 外决定是否发送。
