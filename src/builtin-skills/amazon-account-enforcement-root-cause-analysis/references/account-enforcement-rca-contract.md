<!--
文件功能：定义账号执法事件、证据类别、跨事件时间线、因果链接、root_cause_id 和整改状态。
职责边界：不处理单个买家案件回复，不判断政策/IP实体问题，不撰写或提交 POA。
重要关联：由 ../SKILL.md 在执法根因分析时读取；正式字段映射到 ../assets/templates/account-enforcement-rca-template.md。
-->

# 账号执法 RCA 合同

## 1. 证据类别

- `account_enforcement_event`
- `policy_reference`
- `ip_qualified_output`
- `aggregated_customer_case_handoff`
- `public_product_voc`
- `corrective_action_evidence`
- `agent_inference`

公共 VOC 不能产生 case/enforcement event ID。

## 2. 执法事件

- `enforcement_event_id`
- `event_type`
- `account/marketplace/ASIN/SKU scope`
- `notice/deadline dates/timezone`
- `source_path`
- `issue_and_request_reported`
- `status_reported`
- `policy/ip evidence ids`
- `action evidence ids`

## 3. 因果链接

| 字段 | 说明 |
|---|---|
| `causal_link_id` | 稳定编号 |
| `from_observation/to_hypothesis` | 链接 |
| `parent_evidence_ids` | 必填 |
| `support_status` | supported/partially_supported/unsupported/not_tested |
| `alternative_explanations` | 至少一个 |
| `unknowns` | 未知 |

## 4. Root cause

仅证据门满足时记录：

- `root_cause_id`
- `applicable_event/object ids`
- `root_cause_statement`
- `causal_link_ids`
- `supporting_evidence_ids`
- `unknowns/limitations`
- `human_approval_status`

候选不得伪装成已验证 root cause。

## 5. 行动

类型：

- `containment`
- `immediate_correction`
- `corrective_action`
- `preventive_control`
- `effectiveness_verification`

状态：`proposed`、`planned`、`user_claimed_in_progress`、`user_claimed_completed`、`verified_completed`、`blocked`。

## 6. 四轴与谱系

每条记录含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path/query_ref` 或 `parent_evidence_ids`。

## 7. 第11单案与第13聚合输入

第11只提供多个版本化单案 handoff，每项最少包含：

- `case_handoff_id`
- `case_handoff_version`
- `case_id_masked`
- `case_type`
- `reason_code`
- `evidence_ids`
- `as_of`
- `limitations`

第13拥有聚合/KPI，其可追溯聚合 handoff 必须包含：

- `aggregation_id/aggregation_version`
- `source_case_handoff_ids/source_case_versions`
- `population_definition/inclusion_exclusion`
- `period_timezone`
- `numerator_denominator`
- `metric_or_pattern/calculation_method`
- `missingness_summary`
- `parent_evidence_ids`
- `generated_at/limitations`

10可从多个第11单案建立 `rca_case_set_id` 并分析跨案共因，或消费符合上述 schema 的第13聚合；不要求第11聚合，不重算第13通用 KPI。

## 8. 来源可用性与业务状态

`source_availability_status` 与 RCA `result_status/root_cause status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无案件、无投诉、无根因或无风险；`true_zero` 只用于集合、期间和覆盖完整时明确为零的计数。

正例：第13按固定集合确认某原因编码计数为 0，可记 `true_zero`，但不能据此验证根因。反例：第11单案未返回 `reason_code` 时记 `not_returned`，不得当作无原因或无案件。
