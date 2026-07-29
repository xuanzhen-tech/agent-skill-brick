<!--
文件功能：提供账号健康快照、指标、阈值、趋势、问题、行动和证据谱系模板。
职责边界：模板不拉取账号数据或运行监控；占位阈值不得作为 Amazon 当前规则。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/account-health-evidence-contract.md。
-->

# Amazon 账号健康评估

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account_scope_id_masked/marketplace` | `<values>` |
| `snapshot/metric period/timezone` | `<values>` |
| `assessment_mode` | `one_time` |
| `monitoring_status` | `not_running` |
| `status` | `<ready/ready_without_threshold_judgment/not_computable/not_comparable/partial/blocked>` |

## B. 快照

| Snapshot ID | Source Path | Export Type | Reported At | Metric Period | Timezone | Completeness | Evidence IDs |
|---|---|---|---|---|---|---|---|
| `<id>` | `<path>` | `<user_uploaded_platform_export/screenshot/manual>` | `<time>` | `<period>` | `<tz>` | `<complete/partial>` | `<ids>` |

## C. 指标

| Metric ID | Name/Definition | Numerator | Denominator | Unit | Reported | Recalculated | Status | Period/Scope | Evidence IDs |
|---|---|---:|---:|---|---:|---:|---|---|---|
| `<id>` | `<value>` | `<value/missing>` | `<value/missing>` | `<unit>` | `<value>` | `<value/not_computable>` | `<reported/calculated/not_computable/conflicted>` | `<scope>` | `<ids>` |

## D. 阈值依据

| Threshold Evidence ID | Policy ID | Marketplace | Publication/Effective | Metric Definition | Value/Condition | Scope | Confirmed By | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<site>` | `<dates>` | `<definition>` | `<value>` | `<scope>` | `<owner>` | `<limits>` |

## E. 趋势

| Trend ID | Metric ID | Baseline/Comparison Snapshots | Comparability | Change | Interpretation | Evidence IDs |
|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<ids>` | `<comparable/not_comparable/baseline_only>` | `<value/not_computable>` | `<bounded note>` | `<ids>` |

## F. 问题与行动

| Issue ID | Observation | Threshold Status | Impact | Data Gap | Route | Action | Owner | Status | Evidence IDs |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<observation>` | `<within/exceeds/unknown>` | `<impact>` | `<gap>` | `<RCA/09/11/POA>` | `<action>` | `<owner>` | `<proposed/planned/user_claimed/verified_completed/blocked>` | `<ids>` |

## G. 证据谱系

| Record ID | Layer | Evidence Class | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<account_metric/policy_reference/etc>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## H. 来源可用性与业务状态

| Snapshot/Metric/Field ID | `source_availability_status` | Business `result_status/calculation_status` | Evidence Scope | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<health status>` | `<ids/period>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无指标、无违规或无风险。正例：完整快照明确指标分子为 0，记 `true_zero`；仍需合法分母才能计算。反例：分母未返回，记 `not_returned` 且业务状态为 `metric_not_computable`，不得补零。

## I. 质量门

- [ ] 账号、站点、期间和快照明确
- [ ] 指标定义、分子、分母和单位完整
- [ ] 零/缺失分母为 not_computable
- [ ] 阈值来自带日期依据
- [ ] 趋势只比较同口径快照
- [ ] 未调用 SIF，且任何供应商观察均未作为账号事实
- [ ] 无 SP-API、登录、监控或告警
- [ ] 行动未冒充执行
- [ ] 敏感信息已掩码
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
