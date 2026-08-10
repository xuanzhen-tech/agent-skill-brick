---
name: amazon-sellersprite-review-voc-anomaly-screening
description: 仅使用 SellerSprite 中可定位的 Amazon 单条评论结果，构建可审计 VOC 语料并进行有边界的异常模式筛查。覆盖语料验收、分页覆盖、确定性去重、多语言编码、codebook 校准、样本提及率、评论增量与销量估算滞后检查、集中度与近重复筛查、变体范围替代解释及风险交接。不判定评论操纵、买家身份、购买真实性、平台违规或因果归因。
---

# SellerSprite 评论 VOC 与异常模式筛查

## 目的与不可协商的边界

当问题要求针对已冻结的 Amazon ASIN 范围，同时开展严谨的评论文本研究和评论模式异常筛查时，使用本 Skill。唯一允许的外部业务数据路径是运行时注入的 `sellersprite_mcp`；不得使用浏览器、网页、HTTP、SellerSprite CLI、第二个 API 或供应商密钥。查询前必须遵循 `references/shared/sellersprite-mcp-contract.md`、`references/shared/research-contract.md`、`references/shared/evidence-claims-contract.md`、`references/corpus-acceptance-and-pagination.md`、`references/review-coding-and-schema.md` 和 `references/anomaly-matrix-decision-aid.md`。

SellerSprite 返回的评论、星级、变体信息、价格/Coupon 观察、BSR 和销量字段均为供应商可见观察或估算，不是 Amazon 第一方订单、配送、资格、审核或调查记录。本 Skill 可以识别供人工复核的、可复现的**评论模式或数据质量异常候选**。不得陈述、评分、量化或暗示虚假评论、买评、激励、操纵、竞品攻击、评论者身份、购买真实性、政策违规或责任主体。依据证据合同，SellerSprite-only 结论最高为 L2。

## 必需输入与启动门槛

必须收集并冻结：

```yaml
case_id: string
dataset_version: string
marketplace: required
asin_scope:
  variation_policy: parent | child | specified-variants
  included_asins: [ASIN]
  parent_asin: ASIN-or-not-returned
  scope_basis: returned-field | user-supplied | unknown
purpose: voc | anomaly-screening | both
target_period: ISO date range | accept-tool-available-coverage
review_query_plan:
  exact_tool: review
  filters: object
  sort: object-or-not-returned
  page_size: returned-or-requested
  planned_pages: integer-or-open-ended
  stop_condition: explicit
stratification_plan: [rating, review_date_bucket, language, verified_purchase, vine, media, asin]
```

异常筛查还必须具备：固定分桶规则；至少两次评论观察，或可将新增评论归属至分桶的提取结果；以及同时期 SellerSprite 销量估算字段，并记录其定义、对象范围、周期和查询时间。必要输入缺失时，创建 `data-readiness.md`，标记为 `blocked`、`limited` 或 `not_calculable`；不得自行补默认值。

跨期比较前，必须冻结 ASIN 与变体映射。父子体重新归属、子 ASIN 新增或移除、评论池合并，或范围未知时，评论数量和销量估算比例均为 `not_comparable`，直到可重建相同范围。

## 查询、分页与语料验收协议

1. 首次使用时搜索并描述 `review` 工具。仅依据其当前 schema 构建调用，不假设未返回字段、页码语义或排序行为。
2. 在首个查询前冻结市场、ASIN/变体范围、目标期、筛选条件、排序、页大小、停止条件及分层计划。将工具描述和每个请求/响应写入查询日志。
3. 按 `references/corpus-acceptance-and-pagination.md` 建立逐页台账。记录请求页或 token、返回页、请求和返回大小、`next_page` 或终止标记、响应定位符、压缩/截断状态、评论日期范围及字段可用性。
4. 按计划继续翻页；没有终止标记的满页不能证明不存在下一页。若工具无法提供可审计的项级结果，或响应被压缩/截断，则不得把聚合数当作完整文本语料。
5. 仅将处于冻结范围内、文本可定位、可安全脱敏且未被排除的记录列入 `eligible_pre_dedup_n`。无文本、不可定位、不安全脱敏、范围外、压缩响应或不可编码的记录使用受控 `eligibility_status` 单独记录。
6. 按参考协议给每一页和整个语料作出 `page_coverage_status` 判定。计划内完整有界样本只能描述该样本，不能称为 ASIN 的完整评论总体。
7. 对比快照必须保持市场、ASIN 范围、页计划、筛选、排序、资格规则、去重规则版本、codebook 版本和关键字段覆盖一致。任何一项变化均标记 `partially_comparable` 或 `not_comparable`，并保留独立快照。

## 去重、近重复与语言处理

1. 先生成稳定的匿名 `anon_review_id`，不得使用或输出作者身份、昵称、主页、联系方式、地址、订单标识或其他个人信息。
2. 仅可按稳定的供应商记录 ID，或由完整的非身份字段组成的确定性指纹，去除精确重复。记录规则版本、匹配依据和保留的 canonical 记录至 `review-dedup-log.csv`。
3. 当指纹字段不完整、文本相近但非完全相同、或可能来自共同短语、模板、翻译、转载内容时，标记 `possible_duplicate_retained`。近重复候选必须保留在分母中，且不得与精确去重混合。
4. 近重复筛查可使用预先声明的规范化和相似度方法，例如小写化、空白归一、标点规范化、语言内 token 或 character n-gram 相似度。记录方法版本、阈值和全部命中/未命中情况。不得跨语言仅凭机器翻译相似度认定重复；需要时先在原语言比较并标记翻译限制。
5. 对每条可编码记录保存 `language_code`、`language_status` 和 `language_method_version`。供应商返回语言时仍应记录其来源；未返回时可使用已声明的检测方法。混合语言、无法判断语言及不可翻译文本必须保留状态，不能视为主语言或阴性编码。
6. 翻译仅用于人工理解或辅助编码。主题、情感和摘录必须可回溯至原文；不得将译文中的新增含义当作原文证据。

## Codebook 校准与逐评编码

1. 在主语料编码前创建带版本的 `review-codebook.csv`。每个主题必须包含 `theme_code`、定义、包含项、排除项、可允许的 `theme_direction`、最小证据要求、使用场景规则和示例边界。
2. 将主题、情感和使用场景分开编码。主题回答“在谈什么”；`theme_direction` 回答主题体验方向；`overall_sentiment` 仅描述整条评论；`use_scene_codes` 记录明确或审慎推断的使用场景。不得用星级替代文本情感，也不得用文本情感推断购买、真实性或满意度总体。
3. 在覆盖目标语言、星级和日期桶的预定校准子样本上进行至少两次独立编码或两轮盲编码。记录分歧、解决规则、无法解决的歧义和更新后的 codebook 版本。未校准的主题不得用于比较性结论。
4. 校准后冻结 `codebook_version`，对所有 canonical eligible 评论进行项级、多标签编码。使用 `explicit`、`implied`、`unclear` 区分证据强度；`implied` 不可单独支撑强断言。
5. 没有明确文本证据时使用 `unclear` 或不编码，不将未提及解释为否定体验。`not_codable_n` 必须从可编码分母中分开报告，并保留原因。
6. 对于每个主题、情感或使用场景，输出明确的分子、分母、资格规则、覆盖状态、codebook 版本和适用分层。提及率是样本描述，不是全体发生率，除非项级语料已按计划完整覆盖。

## VOC 计算与分层

主分母为 `eligible_dedup_n - not_codable_n`。任何主题的样本提及率为：

```text
mention_rate(theme, stratum) = coded_reviews_with_theme_in_stratum / codable_canonical_reviews_in_stratum
```

方向性主题率为：

```text
directional_mention_rate(theme, direction, stratum) = coded_reviews_with_theme_and_direction_in_stratum / codable_canonical_reviews_in_stratum
```

每个率均须标注为样本率，且报告 `n` 和范围。按以下维度分层，但仅在字段实际返回且状态可用时计算：`rating`、`review_date_bucket`、`language`、`verified_purchase`、`vine`、`media` 和 `asin`。缺失字段必须保持 `not_returned`、`unknown_definition` 或其他共享状态，不得当成 `false`、非 Vine、非 VP、无媒体或主语言。

星级、VP、Vine、媒体、语言或 ASIN 分层之间的差异，只有在相同资格、去重、codebook、范围、查询条件和足够覆盖下才可描述。样本量小、字段缺失率变化或语料不完整时，只报告观察到的构成与限制。

## 时间序列、评论增量与销量估算滞后

1. 预先声明日、周或月的完整日历分桶规则、时区、目标期、基线期和滞后集合。候选期、基线和滞后不得在查看结果后选择。
2. 评论增量优先由可比较的项级评论日期计数计算。若只提供累计评论计数，记录两个抓取时点、定义、范围和供应商字段语义；仅在同范围、同定义下计算差值。
3. 任何 SellerSprite 销量字段均明确标为 `provider estimate`，并记录估算期、定义、范围和查询时间。它不是订单真相、购买资格或真实性证据。
4. 对每个预声明滞后 `l` 计算并完整保留：

```text
review_increment(t) = eligible_dedup_review_count_in_bucket(t)
review_to_sales_ratio(t, l) = review_increment(t) / sales_estimate(t - l)
```

仅在分子和分母市场、ASIN/变体范围、分桶单位和期间定义对齐时计算。零、缺失、估算定义未知、累计/期间混用或不同比例范围时标记 `not_calculable` 或 `not_comparable`，而非除以零或补值。

5. 审视所有预声明滞后，包括无结果和冲突结果。不得挑选最显著滞后。评论发布延迟、销量估算建模、断货、促销、价格、Coupon、排名、数据刷新和范围变更都必须作为替代解释记录。

## 异常模式多信号筛查

本 Skill 的异常筛查不是欺诈检测或违规判定模型，不提供合规、行业或“正常率”阈值。一个候选定义为一个冻结的 ASIN 范围和一个已完成的日历分桶。

可观察的信号族包括：评论日期集中、评论增量变化、评论/销量估算比例变化、星级或情感构成变化、VP/Vine/媒体/语言字段构成变化、近重复文本集中、父子/子体范围不连续，以及价格/Coupon/BSR 等同时期上下文变化。每项信号都必须有公式或方法版本、范围检查、覆盖检查、基线可比性、证据 ID、反证和替代解释。

仅当以下全部满足时，候选可标记 `screen_positive`：

1. 至少两个不同的描述性信号族在同一分桶或有合理预先声明滞后对应的分桶中一致。
2. 基线完全可比，或唯一限制已明确界定且不可能合理地产生该模式。
3. 分页覆盖、父子映射与字段定义均通过检查。
4. 至少记录一个实质性替代解释和一个反向检查。
5. 未作任何禁止推断。

如任一结构性范围或覆盖检查失败，使用 `explained_by_scope_change`、`insufficient_coverage` 或 `not_calculable`，而不是 `screen_positive`。详细反向检查见 `references/anomaly-matrix-decision-aid.md`。

## 证据摘录、输出与风险交接

仅使用最小充分、已脱敏且可回溯的摘录。每条摘录必须按以下格式保存：

```text
[anon_review_id | ASIN scope | review date/bucket | rating if returned | returned VP/Vine/media/language fields | codebook version | source locator] "bounded redacted excerpt"
```

不得将多条评论片段拼接成一段引文。省略号只能删除无关文本；不得改变语序或在引文内加入解释。完整输出 schema 见 `references/review-coding-and-schema.md`，最低交付包括：

- `data-readiness.md`
- `review-coverage.csv`
- `review-evidence.csv`
- `review-dedup-log.csv`
- `review-codebook.csv`
- `review-voc-summary.csv`
- `review-series.csv`
- `review-anomaly-matrix.csv`
- `review-risk-handoff.md`，仅在需要人工升级时生成

风险交接不是举报、申诉、提交平台材料或定论。交给获授权的账户风险、合规或市场负责人时，必须包含冻结范围、数据集版本、查询日志、覆盖状态、匿名证据 ID/摘录、确定性去重方法、codebook 版本、全部公式和滞后视图、矩阵行、替代解释、反证、缺失字段和最低验证请求。明确声明 SellerSprite-only 证据不能判定真实性或违规。

## 返工判据

出现以下任一情形时，必须返工，不能发布推断性结论：未按计划完成分页；响应压缩导致记录不可审计；范围或父子映射变化；后续查询改变筛选、排序、字段语义或 codebook 却未重新编码；比率没有声明分母；比例混用累计与期间量、范围或窗口；查看结果后选择滞后；将近重复候选合并；将缺失 VP/Vine/媒体/语言值视为 `false`；或摘录无法追溯和安全脱敏。

## 完成清单

- SellerSprite `review` 记录按所述范围可定位、可安全脱敏、符合资格并具有声称的分页覆盖。
- 所有零值与缺失值均使用共享数据状态词汇。
- 去重是确定性且可复现的；相似度筛查不改变分母。
- Codebook 已校准、版本化、冻结并逐项应用。
- 每个 VOC 比率有明确样本分母，比较性结论通过可比性门槛。
- 每个异常信号具有分桶、公式、基线或预先声明的筛查线、覆盖结果、替代解释和反证。
- 评论/销量比例使用对齐范围和预先声明的滞后敏感性；销量明确标为供应商估算。
- 任何结论均不识别不当行为、买家身份、真实性、平台违规、因果关系或责任主体。
