<!--
文件功能：定义政策文档、列表详情关系、版本、翻译、差异、适用性、影响、行动和跨专家 handoff 合同。
职责边界：不获取政策、不判断法律效力、不执行监控、推送或整改。
重要关联：由 ../SKILL.md 在差异与影响评估时读取；正式字段映射到 ../assets/templates/policy-change-impact-template.md。
-->

# 政策变更证据合同

## 1. 政策文档

- `policy_document_id`
- `policy_identity`
- `title/issuer`
- `marketplace/jurisdiction`
- `language`
- `publication/effective/revision/provided dates`
- `version`
- `source_path`
- `document_type`
- `completeness`
- `validity_confirmed_by`
- `limitations`

`document_type`：`original_text`、`summary`、`notice`、`translation`、`professional_opinion`。

## 2. 列表到详情

| 字段 | 说明 |
|---|---|
| `list_record_id` | 通知/列表记录 |
| `detail_document_id` | 正文 ID |
| `relation_status` | linked/ambiguous/missing |
| `parent_evidence_ids` | 必填 |

详情缺失时不能分析条款。

## 3. 差异

每项记录：

- `diff_id`
- `old_document/segment_id`
- `new_document/segment_id`
- `change_type`
- `old/new text evidence ids`
- `change_summary`
- `substantive_status`
- `translation_review_status`

`change_type` 使用 added/removed/modified/moved_without_substantive_change/unchanged/not_alignable。

## 4. 影响

| 字段 | 说明 |
|---|---|
| `impact_id` | 稳定编号 |
| `diff_ids` | 来源变化 |
| `affected_object_ids` | 商品/流程/资产/账号 |
| `impact_mechanism` | 推断链 |
| `applicability_status` | candidate/confirmed_by_qualified_owner/not_applicable_by_qualified_owner |
| `responsible_expert_or_owner` | 责任方 |
| `unknowns` | 未知 |

## 5. 行动

状态：

- `proposed`
- `planned`
- `in_progress_reported`
- `verified_completed`
- `blocked`
- `not_applicable`

只有验证证据可进入 `verified_completed`。

## 6. Handoff

必须包含 `policy_evidence_id`、document/diff/impact/action IDs、站点、发布日期、生效日、as_of、责任方、限制和 `monitoring_status=not_running`。

## 7. 四轴与谱系

每条记录含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。

## 8. 来源可用性与业务状态

`source_availability_status` 与政策 `result_status` 必须分列：

| 来源状态 | 含义 |
|---|---|
| `not_returned` | 已核验合法来源未返回目标字段 |
| `not_queried` | 本次未查询合法来源 |
| `parse_failed` | 材料存在但无法可靠解析 |
| `missing` | 范围确定后必需材料仍缺失 |
| `conflicted` | 同范围证据互相冲突 |
| `true_zero` | 完整可验证覆盖明确证明为零 |

前五项不得写成 0、无政策、无变化或无影响。正例：两版完整正文覆盖后删除条款数为 0，可记 `true_zero`，但仍按业务门禁形成 diff 状态。反例：当前正文未查询时必须为 `not_queried`，不得得出“变化为零”。
