---
name: amazon-sellersprite-event-anomaly-analysis
description: 对 SellerSprite-only 的 Amazon ASIN、父子变体、价格/Coupon、供应商估算销量、BSR、评分与评论、关键词自然/广告可见性和类目背景序列，执行可复算的数据规范化、趋势/异常/拐点筛查、7/14/28 日事件研究、多信号候选机制推理和可证伪检查。适用于指定对象的历史变化、异常窗口与事件假设研究；不适用于持续监控、第一方经营归因、竞品内部操作确认、评论操纵认定或因果确认。
---

# SellerSprite ASIN 事件、趋势与异常分析

## 任务定位与硬边界

本 Skill 将 SellerSprite 返回的外部可见观察、估算或预测，转化为可复核的**变化事实、异常候选、拐点候选和候选机制**。它不把供应商字段当作 Amazon 第一方事实，也不把同期相关写成因果。

**只允许的外部业务数据源：** 当前运行环境已注入的只读 `sellersprite_mcp`。不得用网页、浏览器、HTTP、SellerSprite CLI、其他 MCP/API、密钥或抓取补数。用户或可信上游已经提供的材料可作为独立输入，但必须保留来源、日期和原有限制。

**不得声称：**
- 竞品真实 Campaign、竞价、预算、搜索词、花费、订单、库存、人员意图或内部操作；
- 刷评、买评、激励评价、评论操纵主体或平台违规；
- 单凭 BSR、排名、评论或供应商销量估算确认真实销量、转化、广告归因或根因；
- L4 已确认归因。SellerSprite-only 最高为 L3 候选机制；评论操纵及竞品内部事实最高为 L2 模式筛查。

开始前读取：`references/shared/research-contract.md`、`references/shared/sellersprite-mcp-contract.md`、`references/shared/evidence-claims-contract.md`。计算和交付 schema 见 `references/analysis-methods-and-output-schema.md`。

## 适用输入、研究单位与启动门

先用一句话固定决策问题，例如：`在 US、ASIN B0XXXX、child 变体层级，2025-05-01 至 2025-06-30 的估算销量异常是否与可见价格/Coupon、排名、评论或关键词可见性变化在时间上吻合？`

研究单位必须为：

`marketplace × object_id × object_level × metric × grain × date_or_period × scope`

其中 `object_level` 为 `parent | child | specified-variants | asin_unresolved`；`scope` 至少说明类目节点、关键词集合/Top N、分页范围、价格/Coupon 定义和货币。

最低输入：

```yaml
case_id: required
dataset_version: required
marketplace: required
asin_scope: parent | child | specified-variants
object_ids: required
primary_metric: required
analysis_window: required
source_fields: required
extraction_time: required
```

事件研究额外需要明确 `t0`、其来源、日粒度序列和可用窗口。只有一个快照时仅登记当前观察（L0/L1），不得描述趋势、异常或变化。只有两个完全可比点时可报告差异（L1/L2），但不得称长期趋势。

## 运行步骤

### 1. 冻结对象、查询与原始证据

1. 为每次 MCP 调用先 `search`（工具名未知时）并在本任务首次使用前 `describe`；仅按实时 `inputSchema` 调用，不猜参数、默认站点、字段或分页。
2. 每次查询记录：

`provider, exact_tool, describe_time, call_time, marketplace, object_id, object_level, period, grain, arguments_summary, page_coverage, returned_count, raw_result_locator, truncation_status, data_nature, limitations`

3. 原始响应写入 `temp/`；正式结论须能定位到原始值。若响应压缩或截断，按 schema 缩小对象/日期/分页重取；仍不完整时标记 `provider_coverage_insufficient`，不得称全量。
4. 建立 ASIN 身份与变体映射。父体、子体、指定变体集合不得混合成一个连续序列。映射、变体属性或组成改变时，在断点前后分段；无法映射则为 `asin_unresolved`，停止跨期计算。

### 2. 字段规范化与数据质量账本

先形成规范化长表；一行只代表一个研究单位。保留原值与规范化值，绝不覆盖原值。

必填标准列：

`case_id, dataset_version, marketplace, object_id, object_level, parent_asin, variant_key, metric, metric_family, value_raw, value_numeric, unit, currency, rank_direction, observation_date, period_start, period_end, grain, scope_definition, source_field, source_tool, data_nature, extraction_time, coverage_status, comparability, mapping_segment_id, notes`

规范化规则：
- 日期统一 ISO `YYYY-MM-DD`；记录原始时区。时区未知时标 `timezone_unknown`，只比较同一来源同一粒度，避免日界限解释。
- 数值仅去除展示符号和千位分隔；不能解析为数值时保留原值并标 `non_numeric`，不填 0。
- 价格记录币种、税费/运费是否包含和 Offer/Coupon 口径；币种或价格口径不同不得做差值。
- `price`、`coupon`、`estimated_sales`、`bsr`、`rating`、`review_count`、`organic_rank`、`ad_visibility_rank`、`keyword_count` 等必须分列为不同 metric；不可合成“表现分”。
- `estimated_sales` 标为 `provider_estimate` 或 `provider_prediction`，不改写成真实订单/销量。
- 排名必须声明方向。通常数值越小越好，故 `rank_direction=lower_is_better`；只有来源字段明确相反时才用 `higher_is_better`。所有解释同时给出“数值变化”和“业务方向”。
- 关键词/广告可见性须固化关键词集合、自然或广告体系、Top N、查询条件和分页；自然排名与广告可见性不互换。
- 同日重复：仅在同一对象、字段、口径、抓取批次可识别且存在明确优先规则时去重；否则保留多条并标冲突，不取平均。

每个字段按下列状态登记：

`present | reported_zero | not_queried | not_returned | empty_result | failed | truncated | not_comparable | unknown_definition`

只有来源明确返回 0 才可用 `reported_zero`。其余任何状态均不得替换为 0、下架、无广告或无评论。

质量检查至少覆盖：完整性、日期唯一性、连续性、粒度一致性、单位/币种一致性、未结束期、截断、异常值、父子变体断点、字段定义/版本变化。输出每个问题的影响范围、严重度、是否阻断和补数动作。

### 3. 缺失、断点、异常值与可比性处理

**缺失：** 不插值、不前向填充、不以 0 替换；计算窗口时报告有效天数和缺失率。若一个窗口有效天数低于窗口长度的 80%，该窗口不得作为主结论基线；可作探索性附录并降级。

**断点：** 连续缺失达到 `max(2 个连续日, 窗口长度的 20%)`、粒度切换、字段口径切换、映射变化、明显供应商覆盖变更，均建立 `break_id`。断点两侧不计算滚动变化、变点或事件效应。若断点恰在 t0 附近，事件研究失败关闭。

**异常值：** 保留原始异常值。仅可在显示“含异常”和“剔除异常敏感性”两种结果后讨论其影响；不得静默删除。单日尖峰先核对单位、重复、未结束期、抓取/分页/定义和变体映射，再进入业务候选解释。

**可比性：** 用 `fully_comparable | partially_comparable | not_comparable`。只有站点、对象/变体、字段语义、单位/币种、粒度、时间窗口和范围均一致，才可为 `fully_comparable` 并计算差异。`partially_comparable` 仅可比较方向或并列描述；`not_comparable` 不计算差异、变化率、排名或贡献。

### 4. 基线、滚动统计与变化计算

优先级从高到低：
1. 同一对象、同一段、同一指标的事件前历史；
2. 同一对象的同星期几历史（有至少 4 个可比周时）；
3. 预先冻结且同口径的同类对照；
4. 仅作探索背景的类目/市场序列。

不得用通用固定阈值代替对象基线。对照必须登记选择规则，且不得因为结果更好看而事后更换。

对日粒度且无断点的连续段，分别计算 7/14/28 日滚动指标；不足对应窗口时不计算该窗口：

- 滚动均值：`mean_t(w) = average(x[t-w+1:t])`
- 滚动中位数：`median_t(w) = median(x[t-w+1:t])`
- 滚动标准差：`sd_t(w)`，仅在有效观测不少于 `max(5, ceil(0.8w))` 时计算。
- 稳健尺度：`MAD_t(w) = median(|x_i - median_t(w)|)`。
- 与前一等长窗口差：`delta_w = mean(post_w) - mean(pre_w)`。
- 相对变化：`pct_change_w = delta_w / mean(pre_w)`；仅当基线非零、定义稳定且分母可解释时计算，否则填 `not_defined`。
- 标准化变化：`z_t = (x_t - mean(pre_w))/sd(pre_w)`；`sd=0` 不计算。
- 稳健异常分数：`robust_z_t = 0.6745 × (x_t - median(pre_w))/MAD(pre_w)`；`MAD=0` 不计算。

每一项同时写明 `w`、有效观测、缺失率、分母、是否含未结束期和是否跨断点。对于排名，除了原数值差值，还要输出方向化变化：

`rank_improvement = rank_before - rank_after`（仅 `lower_is_better`）；正值表示名次数字变小、排名改善。

### 5. 趋势、拐点与异常候选

算法必须事前固定、透明、可复算；它们只产生**候选**，不是根因。

采用下列多规则筛查并保留各规则命中情况：

1. **单点异常候选：** 7 日或 14 日 `|robust_z| >= 3.5`；若 MAD 不可用，可在 SD 有效时以 `|z| >= 3` 作替代，并标记方法变化。
2. **水平变化候选：** 相邻 7、14 或 28 日完整窗口的中位数/均值差，在同一方向上同时满足：绝对变化具有业务可解释性，且 `|robust_z| >= 2.5` 或相对变化达到任务预先声明的实务阈值。
3. **持续性：** 变化方向在变点后至少 `ceil(w/3)` 个有效日维持，或后窗中至少 70% 有效日位于前窗中位数同一侧。
4. **分段趋势候选：** 在候选日前后各至少 7 个有效日时，比较两段 Theil–Sen 斜率或线性斜率；斜率方向翻转或绝对斜率显著放大，并通过留一日敏感性检查。
5. **变点定位：** 对每个候选日期 `c`，仅在同一连续段比较 `[c-w,c-1]` 与 `[c,c+w-1]` 的中位数、均值和 MAD/SD。选择支持规则最多、缺失最少、持续性最高的日期作为 `candidate_change_date`；若相邻候选相距小于 7 日，合并为一个候选区间而非制造多个事件。

7 日窗口用于快速变化筛查，14 日为默认事件主窗口，28 日用于稳定性/慢变量核对。窗口都必须报告；它们冲突时优先报告“结果对窗口敏感”，不能择优挑选。

### 6. 7/14/28 日事件研究

仅对用户/可信上游明确提供的 t0，或前述算法生成并明确标为“数据驱动候选 t0”，执行事件研究。t0 当日若不完整、定义不清或属于断点，排除且说明原因。

默认窗口：

| 研究级别 | 前窗 | 后窗 | 最低有效日 | 用途 |
|---|---:|---:|---:|---|
| 筛查 | [-7,-1] | [+1,+7] | 每窗 ≥6 | 快速候选 |
| 主分析 | [-14,-1] | [+1,+14] | 每窗 ≥12 | 默认结论 |
| 稳定性 | [-28,-1] | [+1,+28] | 每窗 ≥23 | 慢变量与持续性 |

`[0]` 不纳入前后均值，除非业务事件定义明确该日为完整暴露日；无完整后窗不得伪称已有事件效果。每窗输出均值、中位数、最小/最大、有效天数、缺失率、绝对变化、可定义时的相对变化，以及异常天数。若多个 t0 窗口重叠，分别登记但不把重叠期当独立重复证据。

如有冻结的同类对照，可附加差异中的差异描述：

`DiD = (post_target - pre_target) - (post_control - pre_control)`

这仅是控制后关联估计，不是因果确认；须报告对照选择规则、前期共同走势的可见检查、对照自身事件及可比性。没有对照或共同趋势不足时，不计算 DiD。

### 7. 多信号机制推理、混杂与可证伪

将所有信号按日期并列，不拼接成单一事实。候选机制可包括：可见价格变化、Coupon 状态变化、变体重组、关键词自然可见性变化、广告可见性变化、评论数量/评分变化、类目背景变化或供应商覆盖变化。每个机制均须明确它是外部可见候选，不代表内部行为或真实归因。

对每个候选机制使用 0–2 分的透明评分：

| 维度 | 0 | 1 | 2 |
|---|---|---|---|
| 时间顺序 | 结果前后不清/滞后 | 同窗 | 信号先于或紧贴结果且日期明确 |
| 范围匹配 | 影响范围冲突 | 部分吻合 | 对象、变体、关键词/类目范围吻合 |
| 多维一致性 | 无支持或冲突 | 单一同源维度支持 | 至少两类相关维度支持，且不误称独立来源 |
| 基线偏离 | 常态波动 | 轻度偏离 | 超过预先固定的异常/变点规则 |
| 混杂处理 | 未查 | 已列但未排除 | 关键混杂已检查且结果不支持替代解释 |
| 可证伪性 | 无法证伪 | 泛泛验证 | 明确的反向预测、对象/时间和通过失败条件 |

`mechanism_score = sum(dimensions)`，最高 12 分。分数仅用于排序补数与验证优先级，不等于概率或因果强度；必须和 L 级别分开报告。

最少混杂清单：季节性/同星期几、类目需求变化、价格与 Coupon、变体重组、关键词集合变更、广告可见性体系或覆盖变化、评论显示/抓取延迟、供应商模型/字段版本、分页/截断、未结束期、ASIN 映射变更。必要时另加大促、节假日、缺货/配送等；没有第一方证据时仅列为未验证候选，不写成事实。

每条机制至少给出两项替代解释和一项可证伪检查。例如：
- 若“Coupon 触发销量估算上升”成立，则 Coupon 应先于或同期出现、目标变体的变化应大于同类无 Coupon 对照，并且映射/覆盖断点不应同时发生。
- 若“自然可见性改善解释 BSR 改善”成立，则固定关键词集合中自然位置的方向化改善应先于或不晚于 BSR 变化；若仅广告可见性变化或关键词集合变化能解释，则该机制降级。
- 若“评论异常”成立，仅可表述评论数量/评分/文本样本出现异常模式；必须先排除抓取延迟、去重规则、评论页覆盖和父子变体归属变化，不能指控操纵。

### 8. 评论异常专项

评论研究单位为 `ASIN/变体 × 日期 × 评论覆盖范围`。先确认评论数是累计值、增量值还是分页样本；累计计数的日差仅在连续、同定义、非断点日可计算。

可筛查：评论数日增量尖峰、评分均值跳变、低星/高星比例（仅在样本与星级覆盖明确时）、文本样本主题变化（仅有逐条日期、去重键、语言/页码和覆盖账本时）。无逐条日期与覆盖账本，不做文本主题趋势。

报告必须写：覆盖页数/条数、重复处理、日期可用率、父子归属、抓取延迟风险和替代解释。评论模式最高 L2；禁止使用“刷评”“买评”“虚假评论”或主体归责措辞。

## 证据等级与允许措辞

- **L0 不可知：** 关键对象、口径、时间、覆盖或输入缺失；只交付缺口与研究设计。
- **L1 可见观察：** 至少两个可比点，或单一当前快照；可写“SellerSprite 返回显示/观察到”。
- **L2 模式/候选：** 多信号同现或可复算异常/拐点，仍不能归因；可写“与……在时间上吻合”“支持作为候选解释”。
- **L3 较强候选机制：** 明确事件先于结果、连续完整窗口、多维范围匹配、关键混杂已检查、存在并执行可证伪检查；仍写“较强候选机制”，不得写“证明导致”。
- **L4 已确认归因：** 需要第一方/官方记录或有效实验/准实验；本 Skill 不可达到。

同一 SellerSprite 多端点属于同源多维，不是独立数据来源。每条主张分开记录观察、计算、解释和假设/行动。

## 强制交付物

写入当前 workspace 的 `outputs/`：

1. `field-comparability.csv`
2. `data-quality-register.csv`
3. `normalized-trend-series.csv`
4. `trend-and-change-ledger.csv`
5. `event-study.csv`（无合格 t0 时输出阻断原因，不省略）
6. `candidate-drivers-and-falsification.csv`
7. `event-analysis-report.md`
8. `event-analysis-handoff.yaml`

所有 schema、公式字段和 YAML 最小结构见 `references/analysis-methods-and-output-schema.md`。报告正文至少包括：决策问题与单位、数据范围与可信度、指标定义、基线与算法、核心结果表、趋势/拐点候选、事件窗口结果、候选机制与评分、混杂与可证伪、结论等级、补数/返工和下一步验证。

## 补数、返工与失败关闭

发出补数请求而非猜测，若发生任一情况：
- 无明确站点、对象层级、主要指标、日期范围、字段定义或抓取时间；
- 序列少于两个可比点，或事件主窗未达到每窗 12 个有效日；
- 关键窗口缺失率超过 20%、跨断点、混合粒度/币种/变体，或 t0 当日不完整；
- 关键词集合、Top N、分页或自然/广告可见性体系未冻结；
- 评论缺逐条日期、去重键、页码/覆盖账本却要求文本趋势；
- 供应商响应截断、字段定义未知、映射冲突或非零缺失被静默填补。

**返工判据：** 任何结论无法追溯到原始值、计算窗口、分母、单位、对象层级和 comparability；任意因果化措辞；未声明排名方向；只报“最好窗口”而未披露 7/14/28 敏感性；候选机制没有替代解释与可证伪条件；或将供应商估算写为第一方事实，均须返工。

## Handoff

- 第一方经营异常、订单/广告归因：交 `amazon-business-anomaly-diagnostics`。
- 冻结竞品两时点或比较框架：交 `amazon-competitive-change-analysis`。
- 排名系统专门趋势：交 `amazon-ranking-trend-analysis`。
- 逐条评论 VOC：交 `amazon-review-voc-research`。
- 干预效果、实验设计或因果分析：交 `amazon-experiment-analysis`。

交接时附 `dataset_version`、对象/变体范围、时间窗、字段字典、质量账本、原始证据定位、所有计算、L 级别、未验证混杂和最小补数清单。
