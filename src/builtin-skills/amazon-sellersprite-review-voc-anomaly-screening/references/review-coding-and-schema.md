# 评论编码与输出 Schema

本参考文件为 `amazon-sellersprite-review-voc-anomaly-screening` 定义最低可审计 schema。所有正式文件必须为 UTF-8 CSV 或 Markdown。正式行必须使用匿名 ID，且不得包含作者身份、完整评论文本、联系方式、个人主页 URL、地址或订单标识。

## 枚举

共享数据状态必须原样使用：`reported_zero | present | not_queried | not_returned | empty_result | failed | truncated | not_comparable | unknown_definition`。

其他受控值：

- `eligibility_status`: `eligible | excluded_no_text | excluded_unlocatable | excluded_unsafe_redaction | excluded_out_of_scope | excluded_compressed | not_codable`
- `page_coverage_status`: `complete_for_plan | partial_pages | unknown_page_ceiling | provider_coverage_insufficient | failed | not_queried`
- `dedup_disposition`: `canonical | exact_duplicate_provider_id | exact_duplicate_fingerprint | possible_duplicate_retained | unresolved`
- `language_status`: `provider_returned | agent_detected | mixed | undetermined | not_returned`
- `sentiment` 和 `theme_direction`: `positive | negative | mixed | neutral | unclear`
- `evidence_strength`: `explicit | implied | unclear`
- `anomaly_status`: `observed | screen_positive | not_screened | not_calculable | explained_by_scope_change | insufficient_coverage`

## `review-coverage.csv`

每个查询/分页尝试一行，可附加汇总行。

`coverage_id, case_id, dataset_version, marketplace, asin_scope_id, parent_asin, child_asin, variation_policy, query_id, provider, exact_tool, describe_time_utc, call_time_utc, query_arguments_hash, filters_summary, sort_summary, page_requested, page_returned, page_size_requested, page_size_returned, next_page_observed, terminal_response_observed, returned_record_n, eligible_pre_dedup_n, exact_duplicate_n, possible_duplicate_n, eligible_dedup_n, review_date_min, review_date_max, response_locator, compression_status, truncation_status, page_coverage_status, missing_fields, limitations`

## `review-evidence.csv`

每条 canonical 且合格评论一行。多标签主题和场景以分号分隔的受控代码表示；可另行提供规范化长表导出。

`anon_review_id, case_id, dataset_version, marketplace, asin_scope_id, parent_asin, child_asin, variation_policy, source_query_id, source_page, source_locator, review_date, review_date_precision, retrieval_time_utc, rating_value, rating_status, title_present, language_code, language_status, language_method_version, verified_purchase_value, verified_purchase_status, vine_value, vine_status, media_value, media_status, eligibility_status, dedup_disposition, canonical_fingerprint_hash, theme_codes, theme_directions, overall_sentiment, use_scene_codes, evidence_strength, excerpt_redacted, excerpt_start_locator, codebook_version, coding_pass_id, coding_notes, data_limitations`

`excerpt_redacted` 必须最小充分且有边界。`canonical_fingerprint_hash` 仅为审计键，不是个人标识符。

## `review-dedup-log.csv`

`dedup_event_id, case_id, source_query_id, source_page, source_record_locator, anon_review_id_or_temp_key, canonical_anon_review_id, dedup_rule_version, dedup_disposition, match_basis, fingerprint_completeness, reviewer_identity_used, retained_in_denominator, analyst_resolution_required, notes`

`reviewer_identity_used` 必须始终为 `false`。

## `review-codebook.csv`

每个主题代码一行，版本化且可回溯。

`codebook_version, theme_code, theme_label, definition, include_rule, exclude_rule, allowed_theme_directions, minimum_evidence_rule, use_scene_rule, examples_redacted, calibration_notes, status`

## `review-voc-summary.csv`

每个主题、方向、场景和声明的分层一行。不得将未提及解释为负向，或将星级替代文本编码。

`summary_id, case_id, dataset_version, marketplace, asin_scope_id, analysis_period_start, analysis_period_end, stratum_dimensions, stratum_values, codebook_version, metric_name, theme_code, theme_direction, sentiment, use_scene_code, numerator, denominator, rate, rate_status, page_coverage_status, eligibility_rule_version, dedup_rule_version, coding_universe, missing_field_status, limitations`

## `review-series.csv`

每个日历分桶及每个预先声明滞后一行。销量字段必须标示为供应商估算，且不可与 Amazon 第一方订单数据混同。

`series_id, case_id, dataset_version, marketplace, asin_scope_id, bucket_unit, bucket_timezone, bucket_start, bucket_end, review_count, review_count_status, review_increment, review_increment_formula, coverage_status, sales_estimate_value, sales_estimate_period_start, sales_estimate_period_end, sales_estimate_scope, sales_estimate_definition, sales_estimate_status, sales_data_nature, lag_value, lag_unit, lag_predeclared, screen_ratio, ratio_status, ratio_formula, variation_mapping_version, price_or_coupon_context_id, bsr_context_id, limitations`

## `review-anomaly-matrix.csv`

每个信号族和候选分桶一行。

`matrix_id, case_id, dataset_version, marketplace, asin_scope_id, bucket_start, bucket_end, candidate_id, signal_family, signal_name, signal_status, observed_value, numerator, denominator, formula_or_method_version, baseline_id, baseline_comparability, baseline_value, screen_line_source, coverage_status, scope_check_status, supporting_evidence_ids, conflicting_evidence_ids, alternative_explanations, disconfirming_evidence, unknowns, minimum_validation, claim_level_cap, allowed_wording, prohibited_wording, owner, review_status`

## `review-risk-handoff.md` 标题

1. 目的与有边界结论
2. 已冻结对象、变体、期间与数据集版本
3. 查询与覆盖台账
4. 语料资格与确定性去重
5. Codebook 与编码审计
6. 序列计算与完整滞后敏感性
7. 多信号矩阵与证据摘录
8. 替代解释、反证与未知项
9. 最低验证请求与负责人
10. 明确限制：不认定真实性、违规、责任主体或因果

## 证据摘录规范

每当摘录支撑已发布洞察时，使用以下记录格式：

`[anon_review_id | ASIN scope | review date/bucket | rating if returned | returned VP/Vine/media/language fields | codebook version | source locator] "bounded redacted excerpt"`

不得将不同评论的片段拼入同一个引文。省略号只能移除无关文本；不得改变语序，或在引文中插入解释。
