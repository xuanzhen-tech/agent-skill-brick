<!--
文件功能：集中定义 Amazon 评论 VOC 的评论证据、codebook 和样本覆盖三个业务 CSV。
职责边界：模板只定义表头，不承载真实评论；不得加入作者身份、未经允许的外部取数或无来源结论。
关联关系：由 ../../SKILL.md 正式交付阶段使用；证据与编码语义见 ../../references/。
-->

# Amazon 评论 VOC Workbook 模板

## Sheet 1：review-evidence.csv

```csv
review_ref,source_file_or_provider,exact_tool_if_mcp,marketplace,asin,review_date,rating_raw,verified_raw,vine_raw,media_raw,title_excerpt,text_excerpt,language,duplicate_count,original_location,sampling_or_pagination_scope,cleaning_or_dedup_notes,missing_fields,limitations
```

- `review_ref` 是匿名评论引用，例如 `REV-0001`，用于把编码和洞察回到评论原文。
- 来源材料中原样保留的评论与清洗/摘录/去重说明分开；不得覆盖原文。
- 未查询、未返回、解析失败、资料缺失和来源冲突用自然语言写入 `missing_fields` 或 `limitations`，不得补成 0。
- 不写作者姓名、用户名、个人主页、联系方式、地址或订单号。

## Sheet 2：review-codebook.csv

```csv
code_name,code_version,parent_code,code_type,definition,inclusion_rule,exclusion_rule,positive_example_review_ref,counterexample_review_ref,source_or_prior_version,change_rationale
```

- `code_type` 使用 `theme/direction/journey`。
- 修改上游 codebook 时创建新版本，并链接原文件/版本与正反例。

## Sheet 3：review-coverage.csv

```csv
source_or_query,marketplace,asin,period,star_bucket,verified_bucket,vine_bucket,media_bucket,language_bucket,sampling_or_export_scope,provided_count,deduplicated_count,truncated,missing_fields,comparable_with_other_rows,notes
```

- 覆盖只描述已提供材料，不声明覆盖 Amazon 全量评论。
- 等额分层样本不是自然分布，必须在 `notes` 说明。
