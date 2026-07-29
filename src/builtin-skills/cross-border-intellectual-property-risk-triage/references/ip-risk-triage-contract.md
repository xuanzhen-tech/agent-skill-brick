<!--
文件功能：定义知识产权对象、使用情境、权利链、既有商标检索/专业证据、风险信号和专业复核状态。
职责边界：不提供侵权、有效性、可注册性、FTO 或诉讼结论，不执行外部检索和注册。
重要关联：由 ../SKILL.md 在初筛时读取；正式字段映射到 ../assets/templates/ip-risk-triage-template.md。
-->

# 知识产权初筛合同

## 1. IP 对象

- `ip_object_id`
- `object_type`
- `name_or_description`
- `version`
- `source_path`
- `creator/provider`
- `creation/acquisition date`
- `product/market scope`
- `parent_evidence_ids`

## 2. 使用情境

| 字段 | 说明 |
|---|---|
| `use_context_id` | 稳定编号 |
| `ip_object_id` | 对象 |
| `marketplace/jurisdiction/language` | 范围 |
| `goods_or_services` | 商品/服务 |
| `placement` | 页面、广告、包装、产品等 |
| `use_character` | brand/descriptive/comparative/compatibility/reference/decorative |
| `temporal_scope` | 当前/计划/历史 |
| `replaceability` | 可替换性 |

## 3. 权利链

记录：

- `rights_record_id`
- `ip_object_id`
- `creator/provider/rightsholder/licensee`
- `agreement_type`
- `territory/media/term`
- `sublicense/modification rights`
- `signature/status`
- `evidence_ids`
- `gap`

付款或交付不自动等于权利转让。

## 4. 商标检索与专业证据

| 字段 | 规则 |
|---|---|
| `trademark_evidence_id` | 稳定编号 |
| `source_type` | `user_input` / `user_upload` / `trusted_upstream_output` |
| `source_locator` | 文件、页/段/表/行或正式上游定位 |
| `provided_by/qualified_owner` | 材料提供者与合格责任方；未知须明示 |
| `database_or_material_type` | 材料声明的数据库、官方记录、检索报告或专业意见 |
| `query_terms/figure_description` | 材料声明的检索词或图形描述 |
| `jurisdiction/class/goods scope` | 材料明确覆盖的辖区、类别和商品/服务 |
| `pagination/coverage` | 材料声明的分页、覆盖与截断情况 |
| `returned_fields` | 材料实际提供字段 |
| `evidence_class` | `official_record` / `qualified_opinion` / `trusted_upstream_summary` / `user_provided_material` |
| `as_of/valid_as_of` | 检索或意见日期及有效时点 |
| `limitations` | 不完备、范围、时效与非终局限制 |

本 Skill 不主动调用 `sif_mcp`、Web、浏览器或任何商标/IP 数据源。`zero_results` 只能描述材料声明范围内的结果数，不能映射成 `no_risk`。

## 5. 风险信号

每项记录：

- `signal_id`
- `ip_object/use_context IDs`
- `observation`
- `parent_evidence_ids`
- `potential_impact`
- `alternative_explanations`
- `qualified_review_question`
- `gate_status`

## 6. 闸门

- `proceed_to_qualified_review`
- `hold_use_pending_rights_evidence`
- `hold_launch_pending_search`
- `replace_asset_candidate`
- `not_assessable`

不使用 `infringing/non_infringing`。

## 7. 四轴与谱系

每条记录含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path/source_locator` 或 `parent_evidence_ids`。

## 8. 来源可用性与业务状态

`source_availability_status` 与 IP `result_status/gate_status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无权利、无相似记录或无风险；`true_zero` 只表示完整可验证覆盖下的真实零，不改变专业复核门禁。

正例：用户提供的完整官方检索材料由合格责任方确认其范围内记录数为 0，可将记录数记 `true_zero`，仍不得写 `no_risk`。反例：未提供商标检索材料时记 `not_queried` 或 `missing`，不能生成“零近似商标”。
