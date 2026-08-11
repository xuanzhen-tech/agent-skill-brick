<!--
文件功能：定义事件趋势专家的半年日级规范化序列、四类图表数据、价格变动和异常质量规则。
职责边界：只提供本 Skill 内可复算的详细方法，不依赖外部共享合同，也不要求专家生成独立报告。
重要关联：../SKILL.md。
-->

# 趋势、事件与图表数据方法

## 规范化序列

使用一个长表保存实际需要的字段：

```text
case_id,dataset_version,marketplace,object_id,object_level,parent_asin,variant_key,metric,metric_family,value_raw,value_numeric,unit,currency,rank_direction,category,observation_date,period_start,period_end,grain,source_field,source_tool,data_nature,extraction_time,field_status,coverage_status,comparability,segment_id,break_reason,evidence_id,notes
```

`metric_family` 至少区分 `price_promotion | sales_estimate | bsr | rating_review`。默认查询最近半年自然日，`grain=day`；记录真实 `period_start/period_end`，覆盖不足不复制、插值或补零。原值永不覆盖；只有实际返回且语义明确时填 `value_numeric`。

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

价格线和促销事件分层；缺失日期保留空值。只为实际能力支持且实际返回的 `price_type` 建立系列，整段未返回不生成曲线。不同币种或价格类型默认不合并。

### `sales_estimate_trend`

`date, object_id, metric, value, unit, grain, estimate_or_prediction, unfinished_period, field_status, evidence_id`

标题或图例必须出现“供应商估算/预测”。

### `bsr_trend`

`date, object_id, category_level, category_id, category_name, rank_value, rank_direction, segment_id, break_reason, field_status, evidence_id`

父级和子级序列分开；类目变化后开始新 segment。

### `rating_review_trend`

`date, object_id, rating_value, rating_count_cumulative, rating_increment_daily, increment_nature, increment_formula, anomaly_status, field_status, evidence_id`

星级和累计评分数可使用双轴。`rating_increment_daily[t] = rating_count_cumulative[t] - rating_count_cumulative[t-1]`，只在相邻自然日均有值时计算；首日或缺失邻日为 `null`。负增量必须显示异常状态，不能当作正常业务值解释。

## 第 7 部分价格变动记录

只有相邻可比较价格点的同一 `price_type` 值发生变化时生成：

`object_id, price_type, before_value, after_value, currency, before_date, after_date, change_observed_date, evidence_ids, limitations`

`change_observed_date` 是首次观察到差异的日期，不自动等于卖家真实改价时点。缺失点两侧不得直接推断连续价格变动。

## 变化与事件计算

事件记录最少包含：

```text
event_id,t0,t0_source,t0_type,object_id,metric,pre_window,post_window,pre_valid_n,post_valid_n,missingness,comparability,pre_summary,post_summary,absolute_change,relative_change,relative_change_status,overlap_flag,break_flag,evidence_ids,allowed_wording,limitations
```

- `absolute_change = post_summary - pre_summary`，summary 使用均值或中位数必须预先声明。
- `relative_change = absolute_change / pre_summary`；基线为零、缺失或语义不明时为 `not_defined`。
- BSR 改善可计算 `pre_rank - post_rank`，前提是类目和排名定义一致。
- 最近半年日级是报告展示窗口，不自动成为事件效果窗口；只有业务问题存在明确 t0 时才另选有依据的前后窗口。
- 算法候选 t0 与结果变量共同生成时，只能写探索性候选，不能写事件效果。

## 异常与候选机制

不提供默认阈值。当前任务如采用 z-score、MAD、Theil–Sen、变化点算法或业务阈值，必须记录规则、参数、基线、选择时间、全部候选和敏感性限制。

候选机制最少记录：`mechanism, observation, calculation, temporal_order, scope_match, alternatives, disconfirming_condition, verification_data_needed, evidence_ids, level, status`。排序分数若存在只用于验证优先级，不能转化为概率或证据等级。

## 图表显示

- 时间轴显示实际覆盖，数据量允许时提供缩放或范围选择。
- 用户选定区间后，返回该区间首尾真实有效值、绝对变化和相对变化；正式模板将结果作为图内浮层实时展示。
- 普通日期 Tooltip 显示原值、单位、数据性质、类目和字段状态；材料性拐点使用富事件 Tooltip，额外展示直接因素、间接因素、影响方向与评估、目标/竞品同口径对比、建议、替代解释、来源、证据和置信度。
- 缺失不连线；未结束期使用视觉区分；断点两侧不自动连接。
- 多 ASIN 使用稳定颜色；同一 ASIN 的不同数据性质使用线型或就近标签区分。
- 每张图附 evidence、计算口径和不超过 L2 的解释。

## 富拐点事件

材料性拐点、转折点或已验证的字段变动使用以下语义字段；没有证据的数组保持空并说明原因，不用模板话术补齐：

```text
date,object_key,event_type,chart,label,before,after,change,source,evidence_id,confidence,direct_factors[],indirect_factors[],impact.direction,impact.label,impact.assessment,comparison,recommendations[],alternative_explanations[]
```

- `direct_factors`：与拐点同窗、同对象且可定位的直接观察，例如价格、Coupon、Listing、评论或排名事实。
- `indirect_factors`：有时序和业务机制支持但尚不能确认的候选解释，必须与事实分层。
- `impact`：分别判断对目标与竞品的短期/中期影响；`mixed` 表示利弊并存，`unknown` 表示证据不足。
- `comparison`：只比较同对象层级、同类目、同时间窗、同粒度和同字段定义的数据。
- `recommendations`：写可逆动作、验证指标、观察窗、停止/回滚条件和所需第一方验证，不保证收益。
- `alternative_explanations`：至少覆盖数据刷新/缺失、季节、促销、变体构成、类目变化或其他当前材料性解释。
