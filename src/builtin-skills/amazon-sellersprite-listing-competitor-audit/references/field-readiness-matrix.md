<!--
文件功能：定义 Listing 文本、变体和媒体字段能否进入报告概览、第 7 部分版本 diff 与 HTML 展示。
职责边界：只判断字段就绪和允许分析，不替代具体编码或差异算法。
重要关联：../SKILL.md、snapshot-diff-and-voc-alignment.md。
-->

# Listing 字段就绪矩阵

## 最小状态

- `ready`：完整原值或结构可定位，可做当前审计；
- `ready_with_limits`：部分字段或仅部分结构，只做明确有限观察；
- `baseline_only`：当前值合格但没有可比旧版本；
- `unavailable`：未返回、不支持、截断到不可审计或工具失败；
- `not_comparable`：两期对象、字段定义、范围或完整度不一致；
- `blocked`：身份、父子体/变体或关键来源无法确认。

具体原因写入 `status_reason`，使用 `not_returned | truncated | metadata_only | remote_reference | not_verifiable | tool_failure | insufficient_history | definition_changed | scope_changed` 等可读原因，不扩充另一套状态机。

## 最小矩阵

`marketplace, asin, parent_child, variation, field, status, status_reason, completeness, evidence_id, source_tool, captured_at, baseline_status, allowed_analysis, prohibited_analysis, supplement_needed`

标题和每条 Bullet 只有完整可定位时才做全文编码和 diff。变体必须保留父子关系、属性和值。媒体另外记录：

`media_access = embedded | remote_reference | metadata_only | unavailable`

以及 `semantic_slot, url_or_asset_id_present, stable_hash_possible, order_present, historical_source`。`semantic_slot` 使用 `main_image | dimension_image | feature_image | usage_scene | comparison_image | package_contents | other_<position>` 等有业务语义名称，不使用 `asset1/asset2`。仅有 URL/数量/顺序时不能做图像语义、质量、合规或转化判断。
