<!--
文件功能：提供广告组合、实体、目标、预算护栏、实施批次和证据谱系的正式交付模板。
职责边界：模板不执行广告账户操作；所有平台 ID、枚举和启用状态必须由人工从真实账户回填。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ad-portfolio-entity-contract.md。
-->

# Amazon 广告组合规划

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `marketplace_id` | `<value>` |
| `account_scope_id` | `<value/missing>` |
| `profile_id` | `<value/missing>` |
| `currency/timezone` | `<values>` |
| `plan_version` | `<version>` |
| `result_status` | `<从下方允许值中选择一个>` |
| `reason_codes[]` | `<从下方允许值中选择零个或多个>` |

模板允许的字面合同：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `ACCOUNT_SCOPE_MISSING | PRODUCT_SCOPE_CONFLICT | KEYWORD_EVIDENCE_MISSING | ECONOMIC_GUARDRAIL_MISSING | PLATFORM_ENUM_CONFIRMATION_REQUIRED | PARTIAL_RESULT | OUT_OF_SCOPE_REQUEST`

## B. 目标合同

| Objective ID | Business Question | Primary Metric | Guardrails | Window/Timezone | Required Report | Causal Limit | Evidence IDs |
|---|---|---|---|---|---|---|---|
| `<id>` | `<question>` | `<metric contract>` | `<metrics>` | `<window>` | `<abstract>` | `<limit>` | `<ids>` |

## C. 实体规划

| Plan Entity ID | Level | Parent Plan ID | Display Name | Platform ID | Product Scope | Objective ID | Budget/Bid Scenario | Status | Version |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<portfolio/campaign/ad_group/target/ad>` | `<id>` | `<name>` | `<pending human fill>` | `<ids>` | `<id>` | `<scenario-id>` | `<draft/ready_for_human_implementation>` | `<version>` |

## D. Target 映射

| Plan Target ID | Source ID/Type | Include | Exclude | Product Anchors | Abstract Type | Platform Enum Status | Overlap Purpose | Migration Evidence |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<id/type>` | `<attributes>` | `<attributes>` | `<ids>` | `<type>` | `<known/tbd_platform_enum>` | `<purpose>` | `<requirements>` |

## E. 预算与竞价护栏

| Scenario ID | Currency | Total Limit | Entity Range | Bid Range | Economic Evidence | Approval Owner | Stop/Review Trigger |
|---|---|---:|---|---|---|---|---|
| `<id>` | `<currency>` | `<value/tbd>` | `<range>` | `<range/tbd>` | `<ids>` | `<owner>` | `<trigger>` |

## F. 实施批次

| Batch ID | Planned Actions | Preconditions | Human Executor | Verification | Rollback/Stop | Status |
|---|---|---|---|---|---|---|
| `<id>` | `<manual actions>` | `<requirements>` | `<owner>` | `<platform IDs/evidence>` | `<rule>` | `<draft/not_started>` |

## G. 数据缺口

| Gap ID | Field | Impact | Required Evidence | Owner | Due | Status |
|---|---|---|---|---|---|---|
| `<id>` | `<field>` | `<impact>` | `<evidence>` | `<owner>` | `<date/tbd>` | `<open/resolved>` |

## H. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页、`raw_result_locator` 和 `transformation_type=reported`；Agent 输出另建对象并回指 `parent_evidence_ids`。

## I. 质量门

- [ ] 站点、账户、profile、币种和时区明确
- [ ] 实体父子关系唯一
- [ ] 名称未替代稳定 ID
- [ ] 元数据与绩效分开
- [ ] 关键词仅消费第02专家证据
- [ ] SIF 可见结构/流量观察未冒充用户广告账户数据或已存在实体
- [ ] 无固定预算比例或行业阈值
- [ ] 平台枚举未知时保留 TBD
- [ ] 所有操作为人工实施计划
- [ ] 正式文件位于 `outputs/`
