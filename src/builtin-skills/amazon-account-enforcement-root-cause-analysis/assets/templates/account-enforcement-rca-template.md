<!--
文件功能：提供账号执法事件、时间线、证据类别、因果链接、root cause、整改和POA交接模板。
职责边界：模板不处理单案回复、政策/IP裁决、POA撰写或提交；占位根因不是事实。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/account-enforcement-rca-contract.md。
-->

# Amazon 账号执法事件根因分析

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/marketplace/object scope` | `<masked values>` |
| `analysis_as_of` | `<timestamp + timezone>` |
| `status` | `<rca_ready/event_partial/policy_or_ip_missing/root_cause_unresolved/single_case_route_to_expert11/blocked>` |
| `conclusion_limit` | `不保证 Amazon 接受或账号恢复` |

## B. 执法事件

| Event ID | Type | Account/Site/ASIN Scope | Notice/Deadline | Source Path | Issue/Request Reported | Status Reported | Policy/IP IDs | Action Evidence |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<performance/policy/ip/safety/deactivation/restriction>` | `<scope>` | `<dates/tz>` | `<path>` | `<reported>` | `<reported>` | `<ids>` | `<ids>` |

## C. 证据分类

| Evidence ID | Class | Source Path/Query Ref | Scope | Linkability | Limitations |
|---|---|---|---|---|---|
| `<id>` | `<account_enforcement_event/policy_reference/ip_qualified_output/aggregated_customer_case_handoff/public_product_voc/corrective_action_evidence>` | `<value>` | `<scope>` | `<linked/not_linked>` | `<limits>` |

## D. 时间线

| Timeline ID | Event/Change | Date/Timezone | Object | Evidence IDs | Date Status |
|---|---|---|---|---|---|
| `<id>` | `<value>` | `<date/unknown>` | `<scope>` | `<ids>` | `<reported/verified/unknown>` |

## E. 因果链接

| Link ID | From Observation | To Hypothesis | Evidence IDs | Support Status | Alternative Explanations | Unknowns |
|---|---|---|---|---|---|---|
| `<id>` | `<observation>` | `<hypothesis>` | `<ids>` | `<supported/partially_supported/unsupported/not_tested>` | `<alternatives>` | `<unknowns>` |

## F. Root Cause

| Root Cause ID | Applicable Events/Objects | Statement | Causal Link IDs | Evidence IDs | Unknowns/Limitations | Human Approval |
|---|---|---|---|---|---|---|
| `<id/pending>` | `<ids>` | `<statement/candidate>` | `<ids>` | `<ids>` | `<limits>` | `<approved/pending>` |

## G. 整改

| Action ID | Type | Action | Root Cause ID | Owner | Due | Status | Verification Requirement/Evidence |
|---|---|---|---|---|---|---|---|
| `<id>` | `<containment/immediate_correction/corrective_action/preventive_control/effectiveness_verification>` | `<action>` | `<id>` | `<owner>` | `<date>` | `<proposed/planned/user_claimed/verified_completed/blocked>` | `<requirement/ids>` |

## H. POA 交接

| Field | Value |
|---|---|
| `enforcement_event_ids` | `<ids>` |
| `root_cause_id/status` | `<value>` |
| `action ids/statuses` | `<values>` |
| `attachment evidence ids` | `<ids>` |
| `policy/ip ids` | `<ids>` |
| `unknowns/blockers` | `<items>` |

## I. 证据谱系

| Record ID | Layer | Evidence Class | Source Path/Query Ref / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<class>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## J. 第11单案/第13聚合输入与来源状态

| Input ID | Owner/Type | Version | Source Case Handoff IDs/Versions | Population/Period/Timezone | Numerator/Denominator or Reason Code | Calculation/Pattern | Missingness | Parent Evidence IDs | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<expert11_single_case/expert13_aggregation>` | `<version>` | `<ids/versions or not_applicable>` | `<scope or not_applicable>` | `<value>` | `<method or not_applicable>` | `<summary>` | `<ids>` | `<limits>` |

第11行必须逐个保留 `case_handoff_id/case_handoff_version/case_id_masked/case_type/reason_code/evidence_ids/as_of/limitations`。第13聚合对象字段固定为 `aggregation_id/aggregation_version/source_case_handoff_ids/source_case_versions/population_definition/inclusion_exclusion/period_timezone/numerator_denominator/metric_or_pattern/calculation_method/missingness_summary/parent_evidence_ids/generated_at/limitations`。第11不提供聚合统计，第13拥有聚合/KPI，10只做跨案 RCA/POA 交接。

| Input/Field ID | `source_availability_status` | Business `result_status/root_cause status` | Interpretation |
|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<RCA status>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无案件、无投诉、无根因或无风险。正例：第13固定集合确认某原因编码计数为 0，记 `true_zero`，不等于根因已验证。反例：第11单案未返回 `reason_code`，记 `not_returned`，不能当作无原因。

## K. 质量门

- [ ] 单案路由11，政策/IP判断路由09
- [ ] 公共 Review 仅为 VOC
- [ ] 每条因果链接有支持状态和替代解释
- [ ] 证据不足未生成已验证 root cause
- [ ] 行动未冒充执行
- [ ] RCA 未重写 POA
- [ ] 无 SP-API、登录、监控或提交
- [ ] 敏感信息已掩码
- [ ] 第11仅为版本化单案输入，第13聚合 schema 完整
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
