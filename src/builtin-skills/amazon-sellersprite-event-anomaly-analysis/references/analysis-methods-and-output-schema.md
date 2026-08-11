<!--
文件功能：定义事件趋势专家的最小规范化序列、图表数据、事件比较和异常质量规则。
职责边界：只提供本 Skill 内可复算的详细方法，不依赖外部共享合同，也不要求专家生成独立报告。
重要关联：../SKILL.md。
-->

# 趋势、事件与图表数据方法

## 规范化序列

使用一个长表保存实际需要的字段：

```text
case_id,dataset_version,marketplace,object_id,object_level,parent_asin,variant_key,metric,metric_family,value_raw,value_numeric,unit,currency,rank_direction,category,observation_date,period_start,period_end,grain,source_field,source_tool,data_nature,extraction_time,field_status,coverage_status,comparability,segment_id,break_reason,evidence_id,notes
```

`metric_family` 至少区分 `price_promotion | sales_estimate | bsr | rating_review`。原值永不覆盖；只有实际返回且语义明确时填 `value_numeric`。

## 质量问题

按需记录：

```text
issue_id,object_id,metric,period,issue_type,impact,blocking,status,evidence_id,remediation
```

`issue_type` 可为 `missingness | consecutive_gap | duplicate | unfinished_period | truncation | mapping_change | category_change | definition_change | unit_currency_mismatch | timezone_unknown | coverage_change | outlier | count_reversal_or_revision`。

质量状态影响分析时必须在 visual 的 `status_reason` 和 `limitations` 中暴露，不能只留在 temp。

## 四类 visual 数据

### `price_promotion_trend`

`date, object_id, price_type, price_value, currency, coupon_value_or_state, promotion_type, event_flag, field_status, evidence_id`

价格线和促销事件分层；缺失日期保留空值。不同币种或价格类型默认不合并。

### `sales_estimate_trend`

`period_start, period_end, object_id, metric, value, unit, grain, estimate_or_prediction, unfinished_period, field_status, evidence_id`

标题或图例必须出现“供应商估算/预测”。

### `bsr_trend`

`date, object_id, category_level, category_name, rank_value, rank_direction, segment_id, break_reason, field_status, evidence_id`

父级和子级序列分开；类目变化后开始新 segment。

### `rating_review_trend`

`date_or_period, object_id, rating_value, review_count_cumulative, review_increment, increment_nature, increment_formula, anomaly_status, field_status, evidence_id`

星级和评论数可使用双轴；负增量必须显示异常状态，不能当作正常业务值解释。

## 变化与事件计算

事件记录最少包含：

```text
event_id,t0,t0_source,t0_type,object_id,metric,pre_window,post_window,pre_valid_n,post_valid_n,missingness,comparability,pre_summary,post_summary,absolute_change,relative_change,relative_change_status,overlap_flag,break_flag,evidence_ids,allowed_wording,limitations
```

- `absolute_change = post_summary - pre_summary`，summary 使用均值或中位数必须预先声明。
- `relative_change = absolute_change / pre_summary`；基线为零、缺失或语义不明时为 `not_defined`。
- BSR 改善可计算 `pre_rank - post_rank`，前提是类目和排名定义一致。
- 用户要求的前后 14 天是首选业务窗口，不是默认统计真理；有效观察不足、粒度不符或窗口重叠时停止比较。
- 算法候选 t0 与结果变量共同生成时，只能写探索性候选，不能写事件效果。

## 异常与候选机制

不提供默认阈值。当前任务如采用 z-score、MAD、Theil–Sen、变化点算法或业务阈值，必须记录规则、参数、基线、选择时间、全部候选和敏感性限制。

候选机制最少记录：`mechanism, observation, calculation, temporal_order, scope_match, alternatives, disconfirming_condition, verification_data_needed, evidence_ids, level, status`。排序分数若存在只用于验证优先级，不能转化为概率或证据等级。

## 图表显示

- 时间轴显示实际覆盖，数据量允许时提供缩放或范围选择。
- Tooltip 显示原值、单位、数据性质、类目、字段状态和事件来源。
- 缺失不连线；未结束期使用视觉区分；断点两侧不自动连接。
- 多 ASIN 使用稳定颜色；同一 ASIN 的不同数据性质使用线型或就近标签区分。
- 每张图附 evidence、计算口径和不超过 L2 的解释。
