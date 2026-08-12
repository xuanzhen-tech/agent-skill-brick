<!--
文件功能：定义不可变 Listing 快照、第 7 部分文本/变体/媒体差异和与合格 VOC 证据对齐的方法。
职责边界：只描述可见快照之间的变化，不确认真实修改时间、修改主体、视觉质量或业务效果。
重要关联：../SKILL.md、field-readiness-matrix.md、listing-encoding-taxonomy.md。
-->

# Listing 快照差异与 VOC 对齐

## 快照最小结构

`snapshot_id, case_id, marketplace, asin, parent_asin, variation, captured_at, first_observed_at, source_tool, source_query_id, field_name, field_value_raw, normalized_value, content_hash, completeness, media_access, evidence_id, limitations`

快照写入同一 case 的 `temp/.../snapshots/`，已有快照不可覆盖。新 dataset version 可以引用旧快照，但必须重新检查对象、字段语义和范围。

## 可比性门

只有站点、ASIN/变体、语言、字段定义、完整度、工具语义、采集范围和版本可比较时为 `fully_comparable`。否则仍可保留当前快照或来源差异作为材料，但必须标注 `source_field_difference`、`metadata_only` 或 `not_comparable`，不得写新增、删除、优化或换图。跨端点的标题截断、品牌前缀、URL 参数或缓存差异，默认不是 Listing 变更。

## 文本 diff

1. 保存基线和当前完整原文及 hash；
2. 先按标题/Bullet 项，再按句、token 或 span 比较；
3. 分类 `added | removed | replaced | reordered | format_only`；
4. 每条 diff 链接两侧 evidence；
5. 两时点只称相对基线差异，报告“变更发生在两次观测之间”；不确定真实修改日、次数和中间版本。只有供应商明确提供变更时间语义时，才使用该时间。

最小事件数据：`field, before, after, diff_type, before_captured_at, after_captured_at, change_detected_at, before_evidence, after_evidence, limitations`。总控将其规范化为 `REPORT_DATA.events`，前后内容仅在图中事件 Tooltip 显示，不再独立输出前后对比表。

## 变体和媒体 diff

变体比较父子关系、属性和值，分类 added/removed/changed/reordered；当前未返回的变体先检查分页、映射和字段状态。

媒体按返回顺序保存 `semantic_slot, url_or_asset_id, stable_hash, position, media_access`，分类：

- `added`：新版本出现且旧版本无匹配；
- `removed`：旧版本存在且新版本无匹配，前提是两期集合完整；
- `replaced`：同一位置的稳定资产不同；
- `moved`：同一稳定资产位置改变。

无法取得稳定资产或完整列表时降级为元数据事件，不能生成确定性换图结论；但当前快照中的媒体访问状态、数量、顺序和远程引用仍可作为可观察事实或后续因素搜索输入。没有可比旧快照时返回 `baseline_only`，第 7 部分显示“已建立基线”，不填模板演示前后值。

## VOC 对齐

只消费有 codebook、分母和 evidence 的正式 VOC 结果。记录：

`theme_id, direction, listing_field, text_span, coverage, listing_evidence_ids, voc_evidence_ids, limitation`

`coverage = explicit | partial | absent_from_returned_text | not_verifiable`。`absent_from_returned_text` 不等于 Amazon 页面完全未处理；它只说明本次合格返回文本中未观察到。
