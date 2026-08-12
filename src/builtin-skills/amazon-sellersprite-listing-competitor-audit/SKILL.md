---
name: amazon-sellersprite-listing-competitor-audit
description: 使用 SellerSprite MCP 审计指定 Amazon ASIN 的当前标题、Bullet Points、父子体/变体和媒体字段，并通过供应商历史或本地重复快照生成可追溯的文本、图片与变体差异数据。用于向总控提供报告概览的当前 Listing 字段和第 7 部分变动监控数据；不适用于网页抓取、无数据的历史重建、图片视觉质量或合规判断、广告/转化归因、无事实文案及最终用户报告生成或编辑。
---

<!--
文件功能：定义 Listing 专家对概览当前字段、文本/变体/媒体快照和第 7 部分可比差异数据的责任。
职责边界：只返回 `overview | changes` 可消费的 Module Result；不评价未取得的页面或图片语义，不生成或编辑最终 HTML，也不把差异写成业务效果。
重要关联：references/field-readiness-matrix.md、references/listing-encoding-taxonomy.md、references/snapshot-diff-and-voc-alignment.md。
-->

# SellerSprite 竞品 Listing 快照与差异审计

## 你的身份和交付边界

当你调用本 Skill 时，你是 Listing 审计专家。你负责当前 Listing 字段就绪、表达结构、父子体/变体、媒体快照和可比较版本差异，并向总控返回：

- `listing_text_events`
- `listing_media_events`
- 当前 Listing 快照中需要合并进 `current_snapshot` 的字段

这些结果支持固定报告的 `overview | changes`。你不创建或编辑最终用户 Report、CSV、YAML、台账、建议书或草稿。只返回一个简洁 Module Result；原始响应、字段摘录、规范化、快照、hash、diff、编码和图表数据只写入 `temp/amazon-asin-research/<case_id>/`。最终 `report.html` 仅由总控生成。

本 Skill 可独立注册。按分支读取本 Skill 的三个 reference；不得依赖 `_shared`、`reviews/`、同级 Skill 或集群外合同。

## 研究质量与证据边界

质量、完整性、可比性和替代解释高于速度。不设固定查询次数、快照数、发现数、建议数或图表数。调用方心跳只用于确认 working 或阻塞，不因心跳提前交付。

标题和 Bullet 是竞品文本表达，不自动成为产品事实、合规证明、关键词需求或效果证据。媒体字段只支持实际取得的 URL、资产标识、数量、顺序、尺寸或内容；仅有元数据时不得评价画面、设计、可读性、合规或转化。

历史差异只能说明可比快照之间的观察变化，不能自动证明 Amazon 页面真实生效时点、修改主体、中间版本或业务效果。

## 工具与范围

唯一外部业务源为运行时注入的只读 `sellersprite_mcp`。首次使用能力前执行 `search → describe → call`，按实际 schema 调用；记录工具、参数、调用时间、站点、ASIN/父子体/变体、字段、版本、分页/截断、数据性质和原始定位。

调用时`sellersprite_mcp`，若无明确的说明时间跨度，默认为180天，若用户或者调度Agent说明了时间跨度，以说明时间为准。最小粒度为一天。

通过Tool调用`sellersprite_mcp`时，Tool Result会有长度截断，响应内容超过32000字符会被丢弃，因此调用`sellersprite_mcp`时需要注意时间跨度，单次调用时间跨度建议10天，18次调用获取累计180天的数据，若因为不合理的时间跨度请求或者不合理的`sellersprite_mcp`调用方式导致没有获取到任何数据，应当及时调整调用和请求的策略，不得假设MCP不可用或者无数据可获取，应当充分研究发挥`sellersprite_mcp`的能力。

若遇到`sellersprite_mcp`的并发调用次数限制，使用run_shell等待一分钟再继续调用。不得因为并发限制就终止数据获取或者谎称数据充足。

冻结 marketplace、ASIN、父子体/变体、语言、字段范围、采集时间、基线和业务问题。用户指定竞品不可替换。`not_returned`、`truncated`、`metadata_only`、`remote_reference`、`not_verifiable`、`not_comparable`、`blocked`、空值和真实零值分开。

## 快照生命周期

1. 采集当前字段，保存原值、工具、证据定位和 `captured_at`。
2. 对文本、变体和媒体列表做稳定规范化，但不覆盖原值。
3. 生成内容 hash；图片优先使用实际资产标识或规范化 URL hash，不下载或解释未经授权内容。
4. 将不可变快照保存到 `temp/amazon-asin-research/<case_id>/snapshots/`。
5. 查找同站点、同 ASIN/变体、同字段语义且完整的上一个快照；没有则建立基线。
6. 只有可比性通过才计算 added/removed/replaced/reordered/format_only 或媒体 added/removed/replaced/moved。
7. 返回前后数据、发现时间、日期语义、evidence 和限制。

`captured_at` 是采集时间；`first_observed_at` 是本地首次看到该版本；`change_detected_at` 是相邻采集首次发现差异；只有供应商明确返回时才可使用 `provider_changed_at`。前三者不得写成真实修改时间。

如果运行环境未保留同一 case 的旧快照，返回 `baseline_only`；不得从其他 ASIN、父体、站点或当前缺失反推历史。

## 当前字段与文本编码

先按 `references/field-readiness-matrix.md` 判断标题、每条 Bullet、变体和媒体是否完整可定位。只有完整字段可做全文结构和 diff；截断文本不能冒充完整标题或五点。

按需使用 `references/listing-encoding-taxonomy.md` 将标题 span 和 Bullet 表达拆为事实声明、用户利益、证据和适用条件。编码只描述文本如何表达；没有自有产品事实、合规依据或合格关键词/VOC 时，不生成可发布改写。

## 文本与媒体可视化

### `listing_text_events`

`ready` 时返回字段页签、前后完整值或最小充分片段、差异类型、token/span 定位、两侧 evidence、采集/发现时间和限制。第一次运行返回 `baseline_only`。字段不完整或版本不可比时返回 `unavailable` 或 `not_comparable`。

### `listing_media_events`

逐位置返回前后图片 URL/资产标识/hash、顺序、语义槽位和 added/removed/replaced/moved。槽位优先采用来源或可验证用途，例如 `main_image | dimension_image | feature_image | usage_scene | comparison_image | package_contents | other`；无法确定时使用 `other_<position>`，不得写 `asset1/asset2`。图片能力使用：

- `embedded`：运行时实际取得可内嵌内容；
- `remote_reference`：只有供应商返回 URL，最终 HTML 依赖网络；
- `metadata_only`：只能展示数量、顺序或资产标识；
- `unavailable`：字段未返回、工具不支持或失败。

不得为了生成前后画廊而用模板图、搜索图片或肉眼摘要替代原始证据。

## Module Result

返回 `report_sections: [overview, changes]`、实际范围、字段就绪、当前快照字段、文本/媒体差异、编码/计算规则、`listing_text_events`、`listing_media_events`、evidence、限制、VOC 对齐、可迁移机制、假设和补数请求。每个事件使用 `date, object_key, event_type=listing, chart=listing, label, before, after, change, source, evidence_id, confidence, direct_factors, indirect_factors, impact, comparison, recommendations, alternative_explanations`，供总控与数值/VOC证据综合后写入富事件 Tooltip；直接因素只写可观察字段变化，间接因素和策略动机保持候选解释，影响判断与目标/竞品对比必须同窗同口径，建议带验证指标和停止条件。专家不要求独立前后对比表。无可比旧快照时必须返回 `baseline_only` 和“已建立基线”，不能生成演示差异。

每个 visual 使用：`visual_id, status, status_reason, chart_type, title, data_nature, scope, period, data, evidence_refs, limitations`。专家不生成用户报告。

## 提交前检查

- 每项观察可回溯到站点、ASIN、父子体/变体、字段、版本/时间、工具和原始定位。
- 当前快照、旧快照和 diff 使用同一字段语义和完整度。
- 首次发现、采集、供应商日期和真实修改时间没有混写。
- 图片能力状态真实，未越权获取、伪造或解释图片内容。
- 竞品文本、自有产品事实、VOC、关键词、广告和业务效果保持分离。
- 标题、Bullet、媒体对应第 7 部分的交互事件或状态均明确；没有历史时为 `baseline_only`，不生成独立 diff 表。
