<!--
文件功能：定义第 6 部分需要的最小评论证据、分析派生主题、主题表和主题趋势数据结构。
职责边界：结构只服务内部复核和总控可视化，不要求每次生成一组固定 CSV 或独立风险报告。
重要关联：../SKILL.md、corpus-acceptance-and-pagination.md、anomaly-matrix-decision-aid.md。
-->

# 评论编码与视觉数据

## 受控值

- `sentiment/theme_direction`: `positive | negative | mixed | neutral | unclear`
- `coverage_status`: `complete_for_plan | partial_pages | unknown_page_ceiling | provider_coverage_insufficient | failed`
- `anomaly_status`: `observed | screen_positive | not_screened | not_calculable | explained_by_scope_change | insufficient_coverage`
- `data_status`: `present | reported_zero | not_queried | not_returned | empty_result | failed | truncated | not_comparable | unknown_definition`

缺失状态不得变成 `reported_zero`。

## 语料覆盖

每个查询/时间桶保存：

`coverage_id, case_id, dataset_version, marketplace, asin_scope, filters, sort, page_plan, returned_n, eligible_n, exact_duplicate_n, possible_duplicate_n, review_date_min, review_date_max, field_coverage, coverage_status, response_locator, limitations`

## 匿名评论证据

每条 canonical 合格评论保存：

`anon_review_id, asin_scope, source_locator, review_date, rating, language, returned_vp_vine_media_fields, theme_codes, theme_directions, overall_sentiment, use_scene_codes, excerpt_redacted, codebook_version, evidence_strength, limitations`

不得保存或正式输出作者身份、个人主页、联系方式、地址或订单标识。摘录只保留最小充分内容，不能拼接不同评论。

逐条评论及实际返回字段属于 `observed`；主题编码、情感方向、命中计数、提及率、摘要和趋势属于 `derived`。Module Result 和图表规格必须保留该数据性质，不能将派生主题包装为 MCP 原生字段。

## 主题表

`review_topic_table.data` 使用：

`parent_theme, child_theme, theme_direction, mention_review_n, eligible_review_n, mention_rate, rate_status, asin_scope, analysis_period, codebook_version, coverage_status, summary_derived, excerpt_refs, evidence_ids, limitations`

父子主题可重叠时必须标记，父主题唯一评论数按原始评论去重计算，不能简单累加子主题。

## 主题趋势

`review_topic_trend.data` 使用：

`bucket_start, bucket_end, bucket_unit, asin_scope, comparison_level, parent_theme, child_theme, theme_direction, mention_review_n, eligible_review_n, mention_rate, codebook_version, coverage_status, evidence_ids, limitations`

不同 comparison level 各自保存分母，`comparison_level=category_sample` 时显示名必须为“类目样本”。时间桶覆盖不足、codebook 变化或对象映射变化时中断趋势。父体或类目样本没有合格覆盖时不创建该层级记录。

## 描述性异常

只有研究问题需要且质量门通过时才生成异常记录：

`candidate_id, asin_scope, bucket, signal_family, observed_value, numerator, denominator, baseline, coverage_status, alternatives, disconfirming_evidence, minimum_validation, evidence_ids, level, status`

它是可选内部结果，不要求独立文件或用户报告。
