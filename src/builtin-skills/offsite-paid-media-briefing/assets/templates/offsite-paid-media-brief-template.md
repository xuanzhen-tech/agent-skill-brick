<!--
文件功能：提供站外付费媒体目标、受众、素材、落地页、预算、媒体干预交接和人工上线闸门模板。
职责边界：模板不连接或发布平台广告；所有平台字段和上线状态必须由有权限人员确认。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/offsite-paid-media-brief-contract.md。
-->

# 站外付费媒体 Brief

## A. 元数据

| 字段 | 内容 |
|---|---|
| `media_brief_id` | `<id>` |
| `brand/product/market` | `<scope>` |
| `platform_candidate` | `<Meta/Google/other>` |
| `business_objective` | `<objective>` |
| `decision_window` | `<window/timezone>` |
| `budget_currency/range` | `<values>` |
| `result_status` | `<从下方允许值中选择一个>` |
| `reason_codes[]` | `<从下方允许值中选择零个或多个>` |
| `publication_status` | `not_published` |

模板允许的字面合同：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `MISSING_PLATFORM_RULES | AUDIENCE_UNVERIFIED | CREATIVE_RIGHTS_UNKNOWN | LANDING_PAGE_UNAVAILABLE | MEASUREMENT_HANDOFF_MISSING | ECONOMIC_GUARDRAIL_MISSING | EXPERIMENT_PROTOCOL_MISSING | SIF_SCHEMA_MISMATCH | OUT_OF_SCOPE_REQUEST`

## B. 受众假设

| Audience ID | Description | Need/Context | Include/Exclude | Product Fit | Evidence IDs | Sensitive Risk | Platform Feasibility | Validation |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<description>` | `<context>` | `<rules>` | `<fit>` | `<ids>` | `<risk>` | `<confirmed_by_user/confirmation_required>` | `<method>` |

## C. 素材需求

| Requirement ID | Audience ID | Fact IDs | Claims/Restrictions | Format | Brand Assets | Rights | Localization/Accessibility | Platform Spec | Owner |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<ids>` | `<rules>` | `<abstract>` | `<ids>` | `<approved/pending/blocked>` | `<requirements>` | `<confirmed/confirmation_required>` | `<owner>` |

## D. 落地页

| Destination ID/Version | Product/Offer Evidence | CTA | Locale/Device | Privacy/Cookie/Consent | Tracking | Claim Consistency | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| `<id/version>` | `<ids>` | `<cta>` | `<scope>` | `<owner-confirmed/pending>` | `<reported/not_assessed>` | `<supported/conflicted/not_assessed>` | `<owner>` | `<ready/blocked>` |

## E. 媒体干预与测量问题交接

| Intervention ID | Media Intervention Facts | Measurement Question | Event Label | Desired Metric | Experiment Protocol ID | Protocol Version | Protocol Status | Parent Evidence IDs |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<platform/audience/creative/destination/budget/manual timing facts>` | `<decision question>` | `<user/upstream label>` | `<metric name or upstream metric id>` | `<expert13 id/missing>` | `<version/missing>` | `<referenced_applicable/referenced_mismatch/missing>` | `<ids>` |

本节不得填写本包自创的 KPI 公式、样本、分组、停止规则、分析窗口、显著性规则或归因方法。

## F. 预算护栏

| Scenario ID | Budget Range | Economic Guardrail IDs | Price/Offer Version | Assumptions | Stop/Review Trigger | Human Approver |
|---|---|---|---|---|---|---|
| `<id>` | `<range currency>` | `<ids>` | `<version>` | `<ids>` | `<trigger>` | `<owner>` |

## G. 人工上线闸门

| Gate | Status | Evidence/Owner | Blocker | Next Action |
|---|---|---|---|---|
| `<account/platform fields/audience/creative/rights/landing/tracking/privacy/budget/measurement>` | `<ready/pending/blocked>` | `<ids/owner>` | `<blocker>` | `<human action>` |

## H. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页、`raw_result_locator` 和 `transformation_type=reported`；Agent 输出另建对象并回指 `parent_evidence_ids`。

## I. 质量门

- [ ] 品牌策略与付费媒体职责分开
- [ ] 受众事实与假设分开
- [ ] 无平台规模或枚举猜测
- [ ] 素材和落地页权利完整
- [ ] 交接只含测量问题、事件标签、干预 ID、希望指标和可选第13协议 ID
- [ ] 无第13协议 ID 时未自建 KPI、样本、停止规则或分析窗口
- [ ] SIF 仅作带调用谱系的 Amazon 外部背景，未冒充站外平台数据
- [ ] 无固定价格、预算比例或效果承诺
- [ ] 无账户连接、像素配置或发布
- [ ] 人工批准人与停止条件明确
- [ ] 正式文件位于 `outputs/`
