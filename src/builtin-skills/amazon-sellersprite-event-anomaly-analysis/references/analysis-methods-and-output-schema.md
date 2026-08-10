# 分析方法与输出 Schema

本参考文件供 `amazon-sellersprite-event-anomaly-analysis` 使用。它定义可复算字段、公式和最小交付结构；不替代 `research-contract.md`、`sellersprite-mcp-contract.md` 或 `evidence-claims-contract.md`。

## 1. 长表与质量账本

### `field-comparability.csv`

```text
field_id,metric,source_field,metric_definition,unit,currency,rank_direction,grain,scope_definition,object_level,comparable_requirements,comparability,status,known_limitations
```

### `data-quality-register.csv`

```text
issue_id,object_id,metric,period,issue_type,severity,affected_rows,affected_window,detected_rule,impact,on_main_conclusion,blocking_flag,remediation_request,status
```

`issue_type` 可为：`missingness, consecutive_gap, duplicate, date_parse, granularity_mismatch, unit_currency_mismatch, unfinished_period, truncation, mapping_change, definition_change, outlier, timezone_unknown, coverage_change`。

### `normalized-trend-series.csv`

```text
case_id,dataset_version,marketplace,object_id,object_level,parent_asin,variant_key,metric,metric_family,value_raw,value_numeric,unit,currency,rank_direction,observation_date,period_start,period_end,grain,scope_definition,source_field,source_tool,data_nature,extraction_time,coverage_status,comparability,mapping_segment_id,break_id,notes
```

## 2. 计算字段

### `trend-and-change-ledger.csv`

```text
analysis_id,object_id,metric,segment_id,analysis_date,window_days,pre_start,pre_end,post_start,post_end,pre_valid_n,post_valid_n,pre_missing_rate,post_missing_rate,pre_mean,post_mean,pre_median,post_median,absolute_change,relative_change,relative_change_status,sd_pre,mad_pre,z_score,robust_z_score,rank_improvement,persistence_rate,trend_slope_pre,trend_slope_post,candidate_change_date,trigger_rules,comparability,interpretation_limitations
```

规则：
- `absolute_change = post_mean - pre_mean`。
- `relative_change = absolute_change / pre_mean`；`pre_mean=0`、缺失或语义不明时写 `not_defined`。
- `rank_improvement = pre_mean - post_mean`，仅 `rank_direction=lower_is_better` 且排名口径相同。
- `persistence_rate` 为后窗中位于前窗中位数同一改善/恶化方向的有效日比例。
- 斜率建议用 Theil–Sen；若用线性斜率，登记方法与敏感性结果。

### `event-study.csv`

```text
event_id,t0_source,t0_type,object_id,metric,window_days,pre_window,post_window,t0_included,pre_valid_n,post_valid_n,pre_missing_rate,post_missing_rate,pre_mean,post_mean,pre_median,post_median,pre_min,pre_max,post_min,post_max,absolute_change,relative_change,relative_change_status,anomaly_days_pre,anomaly_days_post,overlap_flag,break_flag,comparability,level,allowed_wording,limitations
```

`t0_type` 为 `user_or_upstream_event | algorithmic_candidate`。算法候选 t0 不得表述为已知业务事件。

### `candidate-drivers-and-falsification.csv`

```text
candidate_id,mechanism,affected_object,affected_metric,result_window,signal_window,temporal_order_score,scope_match_score,multidimensional_score,baseline_deviation_score,confounding_score,falsifiability_score,mechanism_score,evidence_ids,observation,calculation,interpretation,alternative_1,alternative_2,disconfirming_prediction,verification_data_needed,level,allowed_wording,prohibited_wording,status
```

`mechanism_score` 是六个 0–2 分维度之和，范围 0–12；只用于验证优先级排序。

## 3. 报告核心表

`event-analysis-report.md` 至少包含以下 Markdown 表：

### 核心结果

| 对象/变体 | 指标 | 窗口 | 基线 | 后窗 | 绝对变化 | 相对变化 | 有效日 | 可比性 | 结论等级 |
|---|---|---:|---:|---:|---:|---:|---:|---|---|

### 候选机制与反证

| 候选机制 | 时间顺序 | 机制分数/12 | 支持观察 | 替代解释 | 可证伪条件 | 当前等级 | 最小补数 |
|---|---|---:|---|---|---|---|---|

## 4. 最小 Handoff YAML

```yaml
case_id: required
dataset_version: required
scope:
  marketplace: required
  object_ids: []
  object_level: required
  analysis_window: required
  primary_metric: required
data_quality:
  comparability: fully_comparable | partially_comparable | not_comparable
  blocking_issues: []
  coverage_limitations: []
methods:
  baseline: required
  windows: [7, 14, 28]
  anomaly_rules: []
  change_point_rules: []
results:
  observed_changes: []
  candidate_change_points: []
  event_studies: []
  candidate_mechanisms: []
claims:
  max_level: L0 | L1 | L2 | L3
  prohibited_inferences: []
next_steps:
  data_requests: []
  falsification_checks: []
artifacts: []
```

## 5. 实例化计算（示例，不是阈值承诺）

假设某 child ASIN 的日粒度 `estimated_sales` 是同一字段、同一变体、同一连续段的供应商估算值。候选日为 2025-06-15：

- 前 14 日 `[-14,-1]` 有效 13/14 天，均值 100，中位数 98，MAD 8；
- 后 14 日 `[+1,+14]` 有效 14/14 天，均值 130，中位数 128；
- 则 `absolute_change = 30`，`relative_change = 30%`。

它可被登记为“供应商估算销量在该后窗较前窗高 30（30%）的可见变化”，但不能写为真实订单增加 30%。若 candidate day 的值 135，则使用前窗中位数计算：

`robust_z = 0.6745 × (135 - 98) / 8 = 3.12`

该值未达到默认单点筛查 3.5，不应仅凭该单点标为异常；应继续检查 7/14/28 窗口、持续性、缺失、映射断点与多信号。若同日 Coupon 状态变化且固定关键词集合的自然名次改善，但类目对照同样改善，则“Coupon 机制”仍需与类目需求等替代解释并列，不能确认归因。
