<!--
文件功能：定义账号健康快照、证据类别、指标、阈值、趋势、问题和行动状态合同。
职责边界：不提供 Amazon 固定阈值，不拉取账号数据、不监控或提交整改。
重要关联：由 ../SKILL.md 在账号健康评估时读取；正式字段映射到 ../assets/templates/account-health-assessment-template.md。
-->

# 账号健康证据合同

## 1. 快照

- `snapshot_id`
- `account_scope_id_masked`
- `marketplace_id`
- `captured_or_reported_at`
- `metric_period`
- `timezone`
- `source_path`
- `export_type`
- `completeness`
- `parent_evidence_ids`

## 2. 证据类别

- `account_metric`
- `account_notification`
- `policy_reference`
- `corrective_action_evidence`
- `agent_inference`

人工平台导出使用 `source_type=user_uploaded_platform_export`。

## 3. 指标

| 字段 | 说明 |
|---|---|
| `metric_id` | 稳定编号 |
| `metric_name_reported` | 来源原名 |
| `definition` | 来源定义 |
| `numerator/denominator` | 数值和来源 |
| `unit` | 比例/数量等 |
| `period/timezone/snapshot` | 口径 |
| `reported_value/recalculated_value` | 分开 |
| `calculation_status` | reported/calculated/not_computable/conflicted |
| `evidence_ids` | 必填 |

## 4. 阈值

每个阈值记录 `threshold_evidence_id`、政策 ID、站点、发布日期、生效日、指标定义、值/条件、适用范围、确认责任方和限制。

没有该记录不得判断达标/超标。

## 5. 趋势

只有账号、站点、定义、分子/分母、期间、时区和成熟度一致时计算。首次快照状态 `baseline_only`。

## 6. 行动状态

- `proposed`
- `planned`
- `user_claimed_in_progress`
- `user_claimed_completed`
- `verified_completed`
- `blocked`

`verified_completed` 必须有执行证据。

## 7. 四轴与谱系

每条记录包含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。

## 8. 来源可用性与业务状态

`source_availability_status` 与账号健康 `result_status/calculation_status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无指标、无违规或无风险；`true_zero` 只用于完整可验证且口径匹配的真实零。

正例：完整快照明确指标分子为 0，可记 `true_zero`，仍需合法分母才能计算。反例：分母字段未返回时记 `not_returned`，`calculation_status=not_computable`，不得补零。
