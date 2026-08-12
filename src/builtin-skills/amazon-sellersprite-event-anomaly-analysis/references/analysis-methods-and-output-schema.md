<!--
文件功能：定义事件趋势专家按实际最细合格粒度组织四类图表、参数验证、规范化序列、事件—因素搜索和图表数据。
职责边界：只提供本 Skill 内可复算的详细方法，不依赖外部共享合同，也不要求专家生成独立报告。
重要关联：../SKILL.md。
-->

# 趋势、事件与图表数据方法

## 先探查能力、验证参数、再冻结序列

`search → describe → call` 是每项 MCP 能力的前置流程；schema 接受参数不代表服务端真的按参数筛选或投影。对时间、分页、排序、对象层级和字段投影等会影响结论的参数，使用至少两组明显不同的小请求，检查返回记录的日期/期间、对象集、页码、顺序和字段是否相应变化。

参数未生效时，不把该端点视作无数据：改用完整/分段原料、本地筛选、分页采集、其他端点或重复快照。记录参数、对照结果、实际行为、替代采集方法和限制。

对每项指标优先取得最细、稳定、对象和语义可审计的原料：逐条记录、日、周、月、快照区间或当前快照。日级优先但不是合格门槛；使用 MCP 实际支持的最细合格粒度，不把较粗粒度伪装成日级，也不为满足展示窗口插值、补零、复制或均摊。

## 规范化序列

使用一个长表保存实际需要的字段：

```text
case_id,dataset_version,marketplace,object_id,object_level,parent_asin,variant_key,metric,metric_family,value_raw,value_numeric,unit,currency,rank_direction,category,observation_date,period_start,period_end,grain,source_field,source_tool,data_nature,extraction_time,parameter_behavior,field_status,coverage_status,comparability,segment_id,break_reason,evidence_id,notes
```

`metric_family` 至少区分 `price_promotion | sales_estimate | bsr | rating_review`。研究窗口默认努力覆盖最近 180 天或总控指定窗口，但每项实际 `grain` 与 `period_start/period_end` 以返回为准。原值永不覆盖；只有实际返回且语义明确时填 `value_numeric`。

本地允许的处理为筛选、清洗、去重、标准化、分段、聚合、差分、时间对齐与快照比较。另存：

```text
processing_id,input_evidence_ids,input_fields,object_scope,period,method,rule,output_metric,output_scope,limitations
```

本地加工不能创造缺失的销量、价格、类目、对象映射或业务事件；不能日均摊、无依据插值、跨父子体替代或把当前快照延展为历史。

## 质量问题

按需记录：

```text
issue_id,object_id,metric,period,issue_type,impact,blocking,status,evidence_id,remediation
```

`issue_type` 可为 `parameter_ignored | missingness | consecutive_gap | duplicate | unfinished_period | truncation | mapping_change | category_change | definition_change | unit_currency_mismatch | timezone_unknown | coverage_change | outlier | count_reversal_or_revision`。

质量状态影响分析时必须在 visual 的 `status_reason`、`limitations` 和事件解释中暴露，不能只留在 temp。某一直接指标受阻时，继续收集最邻近关联证据；关联证据不得替代被阻断指标本身。

## 四类 visual 数据

### `price_promotion_trend`

```text
date_or_period,object_id,price_type,price_value,currency,grain,coupon_value_or_state,promotion_type,event_flag,field_status,evidence_id
```

价格线和促销事件分层；缺失期间保留空值。只为实际能力支持且实际返回的 `price_type` 建立系列，整段未返回不生成曲线。不同币种或价格类型默认不合并。当前价格仅用于当前快照核验；窗口外 Coupon 历史不混入目标窗口计算或曲线。

### `sales_estimate_trend`

```text
date_or_period,object_id,object_level,metric,value,unit,grain,estimate_or_prediction,unfinished_period,field_status,evidence_id
```

标题或图例必须出现“供应商估算/预测”。优先同对象日级；若只返回周/月级，保留原始期间和对象层级。`parentUnitSales`、`childUnitSales`、变体池及订单/单位销量/销售额必须分开；父体不因子体为空自动成为子体替代。没有合格直接销量时，visual 不伪造趋势，但 `adjacent_evidence` 可记录价格、BSR、评分/评论、Listing、可见性和用户事件等需求/竞争信号。

### `bsr_trend`

```text
date_or_period,object_id,category_level,category_id,category_name,rank_value,rank_direction,grain,segment_id,break_reason,field_status,evidence_id
```

若逐期返回类目层级，父级和子级序列分开，类目变化后开始新 segment。若历史点只含 `rank_value`，则 `category_level/category_id/category_name` 保留未知，标题为“供应商返回 BSR 数值轨迹”；不得把当前详情的类目标签回填进历史。当前大类/小类排名可另以 `current_category_rank_snapshot` 返回，采集时点与历史轨迹分开。

### `rating_review_trend`

```text
date_or_period,object_id,rating_value,rating_count_cumulative,rating_increment,incr_grain,increment_nature,increment_formula,anomaly_status,field_status,evidence_id
```

星级和累计评分数可使用双轴。对于连续、对象/字段一致的相邻合格观测期：

```text
rating_increment[t] = rating_count_cumulative[t] - rating_count_cumulative[t-1]
```

首期、缺相邻期、粒度或对象/字段断点为 `null`。只有 `grain=day` 才称“日新增”；其他粒度标注对应期间新增。负增量必须显示异常状态，不能当作正常业务值、负面体验或人为干预解释。

## 第 7 部分价格变动记录

只有相邻可比较点的同一 `price_type` 值发生变化时生成：

```text
object_id,object_level,price_type,before_value,after_value,currency,before_date_or_period,after_date_or_period,grain,change_observed_at,evidence_ids,limitations
```

`change_observed_at` 是首次观察到差异的时间/期间，不自动等于卖家真实改价时点。缺失点两侧不得直接推断连续价格变动。

## 变化、事件和关联因素搜索

事件记录最少包含：

```text
event_id,t0_or_period,t0_source,t0_type,object_id,object_level,metric,grain,pre_window,post_window,pre_valid_n,post_valid_n,missingness,comparability,pre_summary,post_summary,absolute_change,relative_change,relative_change_status,overlap_flag,break_flag,evidence_ids,allowed_wording,limitations
```

- `absolute_change = post_summary - pre_summary`；使用均值、中位数、首尾值或其他 summary 时必须预先声明；
- `relative_change = absolute_change / pre_summary`；基线为零、缺失或语义不明时为 `not_defined`；
- BSR 改善可计算 `pre_rank - post_rank`，前提是相同类目/排名定义已验证；层级未知时仅描述数值变动方向，不解释为特定类目竞争变化；
- 默认研究窗口用于趋势展示，不自动成为事件效果窗口；只有业务问题有明确 t0 时，才按实际合格粒度选择有依据的前后窗口；
- 算法候选 t0 与结果变量共同生成时，只能写探索性候选，不能写事件效果。

不提供默认阈值。当前任务如采用 z-score、MAD、Theil–Sen、变化点算法或业务阈值，必须记录规则、参数、基线、选择时间、全部候选和敏感性限制。

对每个材料性拐点、异常或稳定期，以图搜索方式建立而非计算原因：

```text
观察信号
→ 同期可定位动作/事件（价格、Coupon、Listing/变体/媒体、评论、类目、可见性、用户一方事件）
→ 直接因素（事实）
→ 间接因素（候选机制）
→ 替代解释/反证
→ 可验证或推翻的下一项数据与观察窗
```

候选机制最少记录：

```text
mechanism,observed_signal,direct_observations,indirect_reasoning,temporal_order,scope_match,alternatives,disconfirming_evidence,verification_data_needed,evidence_ids,level,status
```

支持度可按证据强弱排序以确定验证优先级，但不得转化为概率、数值权重或因果贡献。允许跨模块多步关联，但必须标明每一步的观察或假设；同源多指标不作为独立证据。

## 图表显示

- 时间轴显示实际覆盖和实际粒度；日级连续序列可提供缩放或范围选择，周/月/快照序列保留原始期间点，不伪装成日级；
- 用户选定可用区间后，返回该区间首尾真实有效值、绝对变化和相对变化；正式模板将结果作为图内浮层实时展示；
- 普通 Tooltip 显示原值、单位、粒度、数据性质、已知类目和字段状态；材料性拐点使用富事件 Tooltip，额外展示观察信号、直接因素、间接因素、影响方向与评估、目标/竞品同口径对比、建议、替代解释、反证、验证路径、来源、证据和置信度；
- 缺失不连线；未结束期使用视觉区分；断点两侧不自动连接；
- 多 ASIN 使用稳定颜色；同一 ASIN 的不同对象层级或数据性质使用线型/分面/就近标签清楚分开；
- 每张图附 evidence、实际粒度、本地处理口径、关联信号与不超过 L2 的解释。

## 富拐点事件

材料性拐点、转折点或已验证的字段变动使用以下语义字段；没有证据的数组保持空并说明原因，不用模板话术补齐：

```text
date_or_period,object_key,event_type,chart,label,before,after,change,source,evidence_id,confidence,observed_signal,direct_factors[],indirect_factors[],alternative_explanations[],disconfirming_evidence[],impact.direction,impact.label,impact.assessment,comparison,recommendations[],validation_path[]
```

- `direct_factors`：与拐点同窗、同对象且可定位的直接观察，例如价格、Coupon、Listing、评论、可见性或排名事实；
- `indirect_factors`：有时序和业务机制支持但尚不能确认的候选解释，必须与事实分层；
- `alternative_explanations` 与 `disconfirming_evidence`：覆盖数据刷新/缺失、季节、促销、变体构成、类目变化或其他当前材料性解释及其反证；
- `impact`：分别判断对目标与竞品的短期/中期影响；`mixed` 表示利弊并存，`unknown` 表示证据不足；
- `comparison`：只比较同对象层级、同类目、同时间窗、同粒度和同字段定义的数据；
- `recommendations` 与 `validation_path`：写可逆动作、验证指标、观察窗、停止/回滚条件和所需第一方验证，不保证收益。
