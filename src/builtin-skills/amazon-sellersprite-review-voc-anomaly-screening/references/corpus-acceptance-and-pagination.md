<!--
文件功能：定义第 6 部分评论文本编码、提及率和主题趋势前的语料资格、分页覆盖和跨期可比性门。
职责边界：只说明 SellerSprite 返回语料代表什么，不提供主题编码或异常结论。
重要关联：../SKILL.md、review-coding-and-schema.md、anomaly-matrix-decision-aid.md。
-->

# 评论语料验收与分页

## 分页和范围

1. 冻结 marketplace、ASIN/变体、目标期、语言、筛选、排序、页大小和有界采集计划。
2. 记录实际工具 schema 及每个请求/响应。
3. 每页记录请求页/token、请求/返回大小、下一页或终止标记、响应定位、压缩/截断、评论日期范围和关键字段。
4. 没有终止标记的满页不能证明没有下一页。
5. 区分来源真实零值、空结果、失败、字段不可用、压缩和未查询页。

## 验收状态

- `complete_for_plan`：计划页全部完成且有可信终止，或有界样本全部获得且未截断；
- `partial_pages`：计划页缺失或请求失败；
- `unknown_page_ceiling`：无可信终止且无法确认上限；
- `provider_coverage_insufficient`：响应压缩、截断或无法记录级审计；
- `failed`：允许的有界重试后仍无法取得必需语料。

有界样本只支持对该样本的描述性结论，不得称 ASIN 全量评论。

## 分母

分别记录：`raw_returned_n, eligible_pre_dedup_n, exact_duplicate_n, possible_duplicate_n, eligible_dedup_n, not_codable_n`。

主题提及率使用 `eligible_dedup_n` 或已声明分层后的合格评论数。正式结果同时返回 `mention_review_n` 和 `eligible_review_n`，不能只给百分比。除非逐条语料完整覆盖并审计，不得使用商品页显示的总评论数作为文本主题分母。

## 时间桶和跨期

每个时间桶单独记录返回数、合格数、缺失字段、分页状态和对象范围。缺失时间桶不是零。

跨期趋势要求 marketplace、ASIN/变体、分页计划、筛选、排序、资格、去重、codebook 和关键字段稳定；变化时分段或标记 `not_comparable`。ASIN、父体和类目样本分别建立覆盖与分母，不能借一个层级的总数替代另一个层级。父体或类目样本没有合格覆盖时不返回对应趋势线，不把缺失画成零。
