<!--
文件功能：提供供应商身份、证据矩阵、要求匹配、核验计划和阶段决策的正式交付模板。
职责边界：模板不执行外部核验，不把占位或供应商陈述当事实，也不提供永久可信结论。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/supplier-evidence-and-verification-contract.md。
-->

# 供应商评估与尽调交付

## A. 元数据与结论上限

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `supplier_candidate_id` | `<candidate-id>` |
| `product_id/version` | `<value>` |
| `evaluation_date` | `<timestamp + timezone>` |
| `evaluation_status` | `<evidence_ready/partial/identity_conflict/stale_evidence/verification_required/blocked>` |
| `decision_scope` | `<进入询价/打样/进一步核验>` |
| `limitation` | `本报告不等于绝对可信、官方真伪鉴定或永久供应商批准` |

## B. 身份节点

| Identity ID | 类型 | 名称/标识陈述 | 地区/地址 | Parent Evidence IDs | 关系状态 | 核验状态 |
|---|---|---|---|---|---|---|
| `<identity-id>` | `<legal_entity/factory/trader/contract_party/payee/contact>` | `<reported>` | `<reported>` | `<ids>` | `<reported_same/evidence_linked/conflicted/unknown>` | `<status>` |

### Identity links

| Identity Link ID | From/To Identity IDs | Relation Status | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Verification/Limitations |
|---|---|---|---|---|---|---|---|---|
| `<identity-link-id>` | `<ids>` | `<reported_same/evidence_linked/verified_by_qualified_owner/conflicted/unknown>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<status/limits>` |

## C. 身份冲突

| Conflict ID | 涉及身份 | 观察 | 影响 | 替代解释 | 所需核验 | 状态 |
|---|---|---|---|---|---|---|
| `<conflict-id>` | `<ids>` | `<observation>` | `<impact>` | `<alternatives>` | `<action-id>` | `<open/resolved>` |

## D. 证据矩阵

| 维度 | 证据 ID | 陈述/观察 | 证据状态 | 日期/有效期 | 限制 | 结论上限 |
|---|---|---|---|---|---|---|
| `<identity/process/quality/capacity/sample/commercial/compliance/history>` | `<ids>` | `<value>` | `<supplier_reported/document_supported/sample_observed/verified_by_qualified_owner/conflicted/stale/not_assessed>` | `<dates>` | `<limits>` | `<what can be said>` |

## E. 采购要求匹配

| Match ID | Requirement ID | 要求 | Match Status | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Verification Action ID |
|---|---|---|---|---|---|---|---|---|---|
| `<match-id>` | `<req-id>` | `<requirement>` | `<supported_by_evidence/supplier_reported/partially_supported/not_supported/conflicted/not_assessed>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<action-id>` |

### 独立缺口记录

| Gap ID | Match/Requirement/Candidate IDs | 缺失或冲突 | 影响范围 | 所需证据 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `<gap-id>` | `<ids>` | `<description>` | `<scope>` | `<evidence>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<owner>` | `<open/resolved/blocked>` |

## F. 风险信号

| Signal ID | 观察 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 可能影响 | 替代解释 | 需要核验 | 决策闸门 |
|---|---|---|---|---|---|---|---|---|---|---|
| `<signal-id>` | `<observation>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<inference/hypothesis>` | `<impact>` | `<alternatives>` | `<action>` | `<gate>` |

## G. 核验计划

| Action ID | 问题 | 所需证据 | Qualified Owner | 完成标准 | 截止时间 | 失败规则 | 状态 |
|---|---|---|---|---|---|---|---|
| `<action-id>` | `<question>` | `<evidence>` | `<owner>` | `<rule>` | `<date/tbd>` | `<rule>` | `<open/in_progress/completed/failed/waived_by_owner>` |

## H. 阶段决策

| Decision ID | Decision Scope | Decision Status | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Conditions | Unresolved Risks | Approved By/Date | Next Review Trigger |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `<decision-id>` | `<scope>` | `<proceed_to_rfq/proceed_to_sample_with_conditions/hold_for_verification/do_not_proceed_on_current_evidence/not_assessable>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `inference` | `<conditions>` | `<ids>` | `<human owner or pending / date>` | `<new evidence/sample/contract/payment gate>` |

## I. 输入证据账本

| Evidence ID | Source Path | Provided By | Subject ID | Document Type | Date | Expiry | Version | Source Type | Temporal Scope | Estimation Status | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<path>` | `<provider>` | `<subject>` | `<type>` | `<date>` | `<date/unknown>` | `<version>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<limits>` |

## J. Agent 输出谱系

| Output ID | Output Type | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Assumption Status | Confidence Note |
|---|---|---|---|---|---|---|---|---|
| `<identity-link-id>` | `identity_link` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<status>` | `<note>` |
| `<match-id>` | `match` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<status>` | `<note>` |
| `<gap-id>` | `gap` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<status>` | `<note>` |
| `<signal-id>` | `risk_signal` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<inference/hypothesis>` | `<status>` | `<note>` |
| `<decision-id>` | `decision` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `inference` | `<status>` | `<note>` |

## K. 质量门

- [ ] 只分析用户已有候选
- [ ] 不同主体和角色未被自动合并
- [ ] 供应商陈述与责任方核验分开
- [ ] 文件外观未被当成官方真伪结论
- [ ] 每个风险信号有替代解释和核验动作
- [ ] 没有综合可信分或绝对保证
- [ ] 阶段决策有条件、范围和人工批准
- [ ] 无外部 OSINT、企业搜索或平台回退
- [ ] `uploads/` 未改变，正式文件仅在 `outputs/`
