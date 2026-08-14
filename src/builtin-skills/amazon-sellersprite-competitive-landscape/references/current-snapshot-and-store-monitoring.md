<!--
文件功能：定义模板概览中当前 ASIN 比较快照和可选店铺新品证据所需的最小字段、日期语义与状态。
职责边界：只在对应研究分支需要详细口径时读取，不扩展为常驻监控系统或店铺全量历史。
重要关联：../SKILL.md。
-->

# 当前快照与店铺新品观测

## 当前快照最小记录

每个对象只保留实际返回的字段，并向总控映射为：

`role, name, asin, parent_asin, variation, seller_or_store, brand, category, price, currency, buyBoxLabel, offerLabel, monthlyOrderEstimate, currentBsr, bsrCategory, rating, ratings, variationSummary, listedAt, capturedAt, sourceTool, evidenceId, dataStatus, limitation`

`monthlyOrderEstimate`、最新 BSR、价格或评分若来自事件专家，只引用同一 dataset version 的已审结果，不重复查询后制造冲突。主图字段由 Listing 专家提供：使用 `image.src`、`image.alt`、`image.statusLabel`，无法取得时保持 `src:null` 并给出准确状态，不写 `asset1` 或虚构 URL。

概览使用 KPI 卡和横向比较表。不同币种、父子体、价格类型、BSR 类目或采集时点不可直接排序；缺失字段显示真实状态，不显示为零或制造空白优势。每个字段同时记录 `object_scope`、`grain`、`date_semantics`、`source_tool`、`evidence_id` 和限制；当前快照可以直接展示，不能替代历史趋势。

## 最小合格粒度与本地处理

当前快照、候选商品集合和店铺新品观测不预设日级。优先使用供应商实际返回并可审计的最小粒度：逐条商品/记录、日、周、月、快照区间或当前集合。服务端时间、分页、排序、字段投影和店铺/类目参数须先做行为验证；参数被忽略时，可对完整返回原料在本地按已确认日期语义筛选、去重、聚合、映射父子体和计算窗口统计。所有处理规则、输入范围和证据写入 Module Result 与 temp。

## 店铺实体就绪门

开展新品观测前确认：

- 店铺/卖家标识稳定且能回链原始返回；
- marketplace 和店铺范围冻结；
- 商品集合有明确分页或有界采集计划；
- 日期字段含义可解释；
- ASIN 去重和父子体政策稳定。

任一关键条件失败时返回 `unavailable` 或 `blocked`，不把品牌、卖家名称、店铺 ID 或当前商品列表互相替代。

## 日期语义

- `listed_at_provider`：供应商明确返回的上架或收录日期；
- `first_observed_at_local`：本地同口径采集首次看到该 ASIN 的时间；
- `captured_at`：本次查询时间；
- `change_detected_at`：相邻可比快照首次发现集合差异的时间。

除非工具明确定义，`first_observed_at_local` 和 `change_detected_at` 不得写成 Amazon 实际上架或修改时间。

## 可选窗口统计与时间线

7/15/30/60 日窗口按用户需要展示，但只有当日期语义、范围和分页计划可审计时才称为窗口统计；否则展示当前集合或已返回样本。每个窗口同时显示有效商品数、覆盖状态、日期类型、对象层级和实际粒度。连续同口径快照可绘制新品时间线；一次快照只能显示当前集合中的日期分布或建立基线。

`store_new_listing.data` 最小字段：

`store_scope, window_or_period, date_semantics, asin, title_summary, category, observed_date, captured_at, source_tool, evidence_id, coverage_status`

该结果不是固定报告章节。只有材料性足够时才建议总控将其放入概览补充或既有图表事件；否则只保留在 Module Result 的限制或补证信息中。
