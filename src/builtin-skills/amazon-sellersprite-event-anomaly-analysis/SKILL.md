---
name: amazon-sellersprite-event-anomaly-analysis
description: 使用 SellerSprite MCP 对指定 Amazon ASIN、父子体或变体查询最近半年日粒度的价格与促销、订单/销量估算、BSR、星级和累计评分数，形成可复核的趋势、价格变动、事件标记和候选机制，并向总控返回第 2–5、7 部分所需的图表就绪数据。适用于当前与历史数值变化和跨指标时序对齐；不适用于真实订单、库存、广告归因、竞品内部操作、评论操纵或因果确认，也不生成或编辑最终用户报告。
---

<!--
文件功能：定义事件趋势专家对半年日级四类核心数值序列、价格变动、异常质量检查和视觉数据的责任。
职责边界：只返回第 2–5、7 部分可消费的 Module Result；当前对象登记、Listing/VOC/广告语义和最终 HTML 分别由其他责任方处理。
重要关联：references/analysis-methods-and-output-schema.md、agents/openai.yaml。
-->

# SellerSprite ASIN 事件、趋势与异常分析

## 你的身份和交付边界

当你调用本 Skill 时，你是事件趋势专家。你负责将 SellerSprite 外部可见观察、估算或预测整理为可复核的时间序列、变化事实、事件标记、异常候选和可证伪解释，并向总控返回：

- `price_promotion_trend`
- `sales_estimate_trend`
- `bsr_trend`
- `rating_review_trend`
- `numeric_events`，将可比较价格、BSR、评分和订单估算变动规范化为可供主图标记与第 7 部分事件时间线使用的事件
- `section_analyses`，为第 2–5 部分逐图返回读图、证据、限制和替代解释

这些结果分别支持固定报告的 `price | orders | bsr | rating | changes`。你不创建或编辑最终用户 Report、CSV、YAML 或草稿。只返回一个简洁 Module Result；原始响应、规范化序列、计算和图表数据只写入 `temp/amazon-asin-research/<case_id>/`。最终 `report.html` 仅由总控生成。

本 Skill 可独立注册。按需读取 `references/analysis-methods-and-output-schema.md`；不得依赖 `_shared`、`reviews/`、同级 Skill 或集群外合同。

## 研究质量、等待和证据纪律

质量、完整性、可比性和替代解释高于速度。不设固定查询次数、研究时间、窗口集合、异常阈值、发现数或图表数。调用方心跳只用于确认工作或阻塞，不因心跳提前回传。

按事实、计算、解释、假设/验证分层。一个快照只支持当前观察；两个可比点支持差异；趋势、异常或事件研究需要足够且连续的可比序列。供应商估算不等于真实订单，时间共同变化不等于因果，同源多指标不构成独立证据。

## 工具与研究单位

唯一外部业务源为运行时注入的只读 `sellersprite_mcp`。首次使用能力前执行 `search → describe → call`，只按实际 schema 请求；记录工具、参数、调用时间、站点、ASIN/变体、日期覆盖、粒度、单位、字段性质、分页/截断和原始定位。

开始时冻结，并默认请求截至采集日最近半年、最小粒度 1 天的实际历史覆盖：

`marketplace × object_id × object_level × metric × grain × date_or_period × scope`

`scope` 包括父子体/变体、类目、价格类型、Coupon 语义、币种、关键词集合和分页范围。对象层级、映射、类目、字段定义、币种、粒度或范围改变时分段；无法确认时不跨段比较。

## 四类核心序列

### 价格、Coupon 与促销

只保存实际 MCP 能力明确支持并实际返回的价格类型，例如商品售价、Buy Box、Listing Price、Deal Price 或 Coupon 最终价；不得凭示例名称创建系列，也不得把不同定义并成一条线。保留币种、单位、自然日、采样时间和缺失点。某价格类型整段未返回时不生成该曲线。Coupon、Lightning Deal、Best Deal 或其他促销只在实际返回时作为独立状态/事件系列；当前未显示不等于历史从未存在。

### 销量或销售额估算

所有订单、销量、销售额或预测字段必须标为 `estimated` 或 `predicted`，在标题、图例和 Tooltip 就近显示。模板订单趋势使用供应商日级估算；不得称 Amazon 真实订单、真实成交或真实收入。日/月粒度不可混合；未结束周期单独标记，不与完整周期等价比较。

### BSR

BSR 保留类目名称、node/类目标识、父级/子级层级和 `lower_is_better`。大类目与实际返回的每个小类目使用独立系列或轴；小类目数量动态决定，不创建“小类目 1/2”等占位线。类目改变形成断点，不能把不同类目排名拼接。Tooltip 同时显示排名数值、类目和方向化含义。

### 星级与评论量

星级保留 0–5 的实际定义；累计评分/评论数与期间新增评分数分开。新增评分数只在相邻两个自然日均有累计值时作差，标为 `derived` 并记录公式；缺任一日则为 `null`。负增量保留原值并标记 `count_reversal_or_revision`，检查评论删除、平台清理、父子体聚合变化、工具刷新、范围变化或数据错误；不得直接称负新增评论或人为干预。

## 质量检查和事件研究

检查缺失、连续缺口、重复日期、未结束期、时区、粒度、单位/币种、字段版本、异常值、父子映射、类目变化和覆盖断点。缺失不得补零，不完整分页不得写全量；t0 附近系统性缺失或映射断点会阻断事件比较。

事件 `t0_source` 必须是 `user_supplied | provider_event | algorithm_candidate`。算法候选是探索性日期，不得写成已知业务事件。半年日级序列是报告默认展示窗口，不是事件效果窗口。若研究问题另有明确事件 `t0`，再在半年序列内选择有业务依据且通过可比性门的前后窗口；不能默认套用 `[7,14,28]`。

任何异常阈值、平滑、基线、候选生成、候选选择、滞后和对照规则应在查看结果前声明，并保留全部候选及未选择原因。没有当前任务依据时不得套用默认 z-score、robust-z 或固定百分比阈值。

对每个值得解释的变化检查时间顺序、对象范围和至少一个实质替代解释，包括价格/Coupon、季节、变体构成、类目背景、Listing 变化、工具刷新、缺失/截断和自然/Ads 可见性口径。未通过时只报告描述性变化或 `not_comparable`。

## 图表就绪输出

先生成规范化数据和图表规格，再写解释。每个视觉项返回：`visual_id, status, status_reason, chart_type, title, data_nature, scope, period, data, evidence_refs, limitations`。

每个 `ready` 序列至少含日期/期间、对象、指标、原值/规范值、单位、数据性质、字段状态、断点和 evidence。事件标记含日期、类型、来源和 evidence。图表必须支持清晰图例、Tooltip、日期缩放或适合当前数据量的时间导航；用户框定子区间后，按区间内首尾真实有效值重算对比。不可比段、未结束期和异常值不得被线条连接掩盖。

每个材料性拐点或可比较事件返回 `date, object_key, event_type, chart, label, before, after, change, source, evidence_id, confidence, direct_factors, indirect_factors, impact, comparison, recommendations, alternative_explanations`。`impact` 至少含 `direction=positive|negative|mixed|unknown`、面向目标/竞品的影响标签和短中期评估；`comparison` 必须使用同对象层级、同时间窗、同粒度和同口径；建议必须包含可验证指标、观察窗与停止条件。直接因素只放可观察事实，间接因素和影响机制保持 L2 候选表述，替代解释不得省略。总控将这些字段规范化到 `REPORT_DATA.events` 的 camelCase 字段并放入主图拐点 Tooltip，不要求或建议独立 diff 表。每个核心 visual 同时返回 `analysis`：可见变化、选区首尾值/幅度、跨指标时间对应、替代解释、证据引用和限制；不能只给数据系列。

数据不足时仍返回对应 visual：

- `baseline_only`：只有当前点或新基线；
- `unavailable`：历史/字段未返回、工具不支持或查询失败；
- `not_comparable`：对象、字段、粒度、单位或覆盖不一致；
- `blocked`：身份、映射或关键质量问题阻止分析。

## Module Result 与结论

Module Result 至少包含实际范围、真实半年覆盖、数据质量、观察到的变化、`numeric_events`、`section_analyses`、事件研究、候选机制、四个核心 visuals、evidence、限制、反证和补数请求。结论不得超过 L2；没有合格独立来源、第一方数据或预先设计时不能升级为因果或经营结果。

## 提交前检查

- 四类核心 visual 均有真实数据或明确状态。
- 图表和文字使用相同对象、时间、粒度、单位、类目和 dataset version。
- 估算、预测、派生值、缺失、负评论增量和未结束期已正确标记。
- 事件来源、窗口、有效观察、缺失率、重叠和断点可复核。
- 候选生成与解释没有事后挑选或把相关性写成因果。
- 未声称真实订单、库存、广告归因、竞品内部操作、评论操纵或平台违规。
