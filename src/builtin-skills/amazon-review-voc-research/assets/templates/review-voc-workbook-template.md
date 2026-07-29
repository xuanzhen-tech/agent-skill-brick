<!--
文件功能：集中定义 Amazon 评论 VOC 的 evidence、codebook 和 coverage 三个标准 CSV sheet。
职责边界：模板只定义表头，不承载真实评论；不得加入作者身份、外部取数或无来源结论。
关联关系：由 ../../SKILL.md 正式交付阶段使用；证据与编码语义见 ../../references/。
-->

# Amazon 评论 VOC Workbook 模板

## Sheet 1：review-evidence.csv

```csv
evidence_id,source_type,source_record_id,parent_evidence_ids,temporal_scope,estimation_status,transformation_type,marketplace,asin,review_date,rating_raw,verified_raw,vine_raw,media_raw,title_excerpt,text_excerpt,language,duplicate_count,evidence_location,upstream_source_file,upstream_evidence_id,upstream_source_type,upstream_temporal_scope,upstream_estimation_status,upstream_transformation_type,field_states,limitations
```

- `source_type` 只使用 `user_input`、`upstream_output`、`agent`；来源评论不得使用 `agent`。
- `transformation_type` 只使用 `reported`、`normalized`、`calculation`、`coding`、`inference`、`hypothesis`。
- 来源材料中原样保留的评论为 `reported`；匿名化、摘录或去重表示为 `normalized`，并填写直接 `parent_evidence_ids`。
- 字段状态只使用 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。
- 不写作者姓名、用户名、个人主页、联系方式、地址或订单号。

## Sheet 2：review-codebook.csv

```csv
code_id,source_type,parent_evidence_ids,temporal_scope,estimation_status,transformation_type,upstream_source_file,upstream_evidence_id,upstream_source_type,upstream_temporal_scope,upstream_estimation_status,upstream_transformation_type,code_version,parent_code,code_type,code_name,definition,inclusion_rule,exclusion_rule,positive_example_evidence_id,counterexample_evidence_id,status,change_rationale
```

- `code_type` 使用 `theme/direction/journey`。
- Agent 新建 codebook 使用 `source_type=agent`、`transformation_type=coding`。
- 修改上游 codebook 时创建新版本，并链接上游与直接父证据。

## Sheet 3：review-coverage.csv

```csv
coverage_id,source_record_ids,source_type,parent_evidence_ids,temporal_scope,estimation_status,transformation_type,marketplace,asin,period,star_bucket,verified_bucket,vine_bucket,media_bucket,language_bucket,sampling_or_export_scope,provided_count,deduplicated_count,truncated,field_states,comparability,notes
```

- 覆盖、去重和样本比例使用 `source_type=agent`、`transformation_type=calculation`。
- 覆盖只描述已提供材料，不声明覆盖 Amazon 全量评论。
- 等额分层样本不是自然分布，必须在 `notes` 说明。
