<!--
文件功能：承载单次价格与毛利护栏及可选 SIF 探索性采购阈值附录，确保字段、证据、审批和下游限制可复核。
职责边界：正式护栏只映射 amazon-operating-analysis；SIF 附录固定排除在护栏之外；模板不提供默认价格、费率、阈值或审批结论，也不触发任何平台动作。
重要关联：../../SKILL.md 定义执行流程；../../references/pricing-guardrail-contract.md 定义字段与状态。
-->

# 价格与毛利护栏

## 1. 记录元数据

- `guardrail_id`: `{{GUARDRAIL_ID}}`
- `created_at`: `{{CREATED_AT}}`
- `case_id`: `{{CASE_ID}}`
- `marketplace`: `{{MARKETPLACE}}`
- `sku_or_variant`: `{{SKU_OR_VARIANT}}`
- `currency`: `{{CURRENCY}}`
- `approval_status`: `{{APPROVAL_STATUS}}`
- `output_evidence_id`: `{{OUTPUT_EVIDENCE_ID}}`
- `parent_evidence_ids`: `{{PARENT_EVIDENCE_IDS}}`
- `source_type`: `agent`
- `temporal_scope`: `{{POINT_IN_TIME_CURRENT_RULE_OR_SCENARIO}}`
- `estimation_status`: `not_applicable`
- `transformation_type`: `{{NORMALIZED_OR_GUARDRAIL_TRANSFORMATION}}`

## 2. 上游正式情景

- `upstream_output_id`: `{{UPSTREAM_OUTPUT_ID}}`
- `upstream_version`: `{{UPSTREAM_VERSION}}`
- `upstream_scenario_id`: `{{UPSTREAM_SCENARIO_ID}}`
- `tax_and_fulfillment_basis`: `{{TAX_AND_FULFILLMENT_BASIS}}`
- `source_locator`: `{{SOURCE_LOCATOR}}`
- `upstream_limitations`: `{{UPSTREAM_LIMITATIONS}}`

### 2.1 口径可比性判断

| basis_comparison_id | output_evidence_id | guardrail_id | comparison_status | compared_fields | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|
| `{{BASIS_COMPARISON_ID}}` | `{{BASIS_OUTPUT_EVIDENCE_ID}}` | `{{GUARDRAIL_ID}}` | `{{COMPARISON_STATUS}}` | `{{COMPARED_FIELDS}}` | `{{BASIS_PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `basis_comparison` |

### 2.2 SIF 探索性采购阈值（可选，不得进入护栏）

| evidence_id | record_type | source_type | provider | tool | agent_request_id | tool_call_id | provider_request_id | parent_input_evidence_ids | retrieved_at | marketplace | query_scope | temporal_scope | estimation_status | transformation_type | raw_result_locator | excluded_from_guardrail |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{SIF_EVIDENCE_ID}}` | `exploratory_vendor_calculation` | `sif_mcp` | `sif` | `market_estimate_profit_threshold` | `{{AGENT_REQUEST_ID}}` | `{{TOOL_CALL_ID}}` | `{{PROVIDER_REQUEST_ID_OR_NOT_RETURNED}}` | `{{SIF_INPUT_EVIDENCE_IDS}}` | `{{SIF_RETRIEVED_AT}}` | `{{SIF_MARKETPLACE}}` | `{{SIF_QUERY_SCOPE}}` | `scenario` | `estimated` | `vendor_calculation` | `{{SIF_RAW_RESULT_LOCATOR}}` | `true` |

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的真实值；上下文未暴露对应字段时分别填 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端 ID，否则填 `not_returned`；三类 ID 不得互相代填，也不得以本地 ID 冒充服务端 ID。

- 完整 `arguments_snapshot`：`{{SIF_ARGUMENTS_SNAPSHOT}}`

| Argument | Value | Unit/Basis | Input Evidence ID | Validation |
|---|---|---|---|---|
| `price` | `{{SIF_PRICE}}` | `{{SIF_PRICE_BASIS}}` | `{{SIF_PRICE_EVIDENCE_ID}}` | `validated/blocked` |
| `category` | `{{SIF_FEE_CATEGORY}}` | `{{SIF_CATEGORY_BASIS}}` | `{{SIF_CATEGORY_EVIDENCE_ID}}` | `validated/blocked` |
| `weight_oz` | `{{SIF_WEIGHT_OZ}}` | `oz` | `{{SIF_WEIGHT_EVIDENCE_ID}}` | `validated/blocked` |
| `freight_cost` | `{{SIF_FREIGHT_COST}}` | `{{SIF_FREIGHT_COST_BASIS}}` | `{{SIF_FREIGHT_EVIDENCE_ID}}` | `validated/blocked` |
| `target_margin` | `{{SIF_TARGET_MARGIN}}` | `{{SIF_MARGIN_BASIS}}` | `{{SIF_TARGET_MARGIN_EVIDENCE_ID}}` | `validated/blocked` |
| `call.arguments.country` | `{{SIF_COUNTRY}}` | `{{SIF_MARKETPLACE}}` | `{{SIF_COUNTRY_PARENT_EVIDENCE_ID}}` | `validated/blocked` |
| `price_currency` | `{{SIF_PRICE_CURRENCY}}` | `ISO-4217` | `{{SIF_CURRENCY_EVIDENCE_ID}}` | `validated/blocked` |
| `tariff_rate` | `{{SIF_TARIFF_RATE}}` | `{{SIF_TARIFF_BASIS}}` | `{{SIF_TARIFF_EVIDENCE_ID}}` | `validated/blocked` |
| `is_apparel` | `{{SIF_IS_APPAREL}}` | `boolean` | `{{SIF_APPAREL_EVIDENCE_ID}}` | `validated/blocked` |
| `turnover_days` | `{{SIF_TURNOVER_DAYS}}` | `days` | `{{SIF_TURNOVER_EVIDENCE_ID}}` | `validated/blocked` |
| `length_in` | `{{SIF_LENGTH_IN_OR_NOT_PROVIDED}}` | `in` | `{{SIF_LENGTH_EVIDENCE_ID_OR_NOT_PROVIDED}}` | `group_validated/group_omitted/blocked` |
| `width_in` | `{{SIF_WIDTH_IN_OR_NOT_PROVIDED}}` | `in` | `{{SIF_WIDTH_EVIDENCE_ID_OR_NOT_PROVIDED}}` | `group_validated/group_omitted/blocked` |
| `height_in` | `{{SIF_HEIGHT_IN_OR_NOT_PROVIDED}}` | `in` | `{{SIF_HEIGHT_EVIDENCE_ID_OR_NOT_PROVIDED}}` | `group_validated/group_omitted/blocked` |

前十项任一缺失、冲突、未经验证或不受实时 schema 支持时，不得调用；尺寸三项只允许全部有证据时成组传入，否则整组省略。`category` 不得用 SIF 画像中的供应商类目快照代填，`call.arguments.country` 必须直接引用已确认站点的父 Evidence ID，禁止默认 US。

> 本节只服务采购侧探索。其任何数值都不得填入第 3 节，不得成为口径、有效性或审批判断的父证据。

## 3. 护栏字段

- `minimum_effective_price`: `{{MINIMUM_EFFECTIVE_PRICE}}`
- `contribution_floor_value`: `{{CONTRIBUTION_FLOOR_VALUE}}`
- `contribution_floor_unit`: `{{CONTRIBUTION_FLOOR_UNIT}}`
- `contribution_floor_basis`: `{{CONTRIBUTION_FLOOR_BASIS}}`
- `applicable_offer_stack`: `{{APPLICABLE_OFFER_STACK}}`
- `valid_from`: `{{VALID_FROM}}`
- `valid_to`: `{{VALID_TO}}`

> 数值映射声明：以上所有数值均应原样来自所列 `amazon-operating-analysis` 正式情景；若不是，请将记录改为阻断状态。

## 4. 限制证据

| constraint_id | 类型 | 地区/渠道/主体 | 原文定位 | 有效期 | evidence_status | evidence_id |
|---|---|---|---|---|---|---|
| `{{CONSTRAINT_ID}}` | `{{CONSTRAINT_TYPE}}` | `{{CONSTRAINT_SCOPE}}` | `{{SOURCE_TEXT_LOCATOR}}` | `{{CONSTRAINT_VALIDITY}}` | `{{EVIDENCE_STATUS}}` | `{{EVIDENCE_ID}}` |

没有限制证据时写明 `not_queried` 或 `missing`，不得写“无限制”。

## 5. 审批

- `approval_evidence_ids`: `{{APPROVAL_EVIDENCE_IDS}}`
- `approver_role`: `{{APPROVER_ROLE}}`
- `approval_scope`: `{{APPROVAL_SCOPE}}`
- `approval_conditions`: `{{APPROVAL_CONDITIONS}}`
- `approval_observed_at`: `{{APPROVAL_OBSERVED_AT}}`

| approval_mapping_id | output_evidence_id | guardrail_id | approval_status | approval_evidence_ids | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|
| `{{APPROVAL_MAPPING_ID}}` | `{{APPROVAL_OUTPUT_EVIDENCE_ID}}` | `{{GUARDRAIL_ID}}` | `{{APPROVAL_STATUS}}` | `{{APPROVAL_EVIDENCE_IDS}}` | `{{APPROVAL_PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `approval_state_mapping` |

## 6. 失效触发器

| trigger_id | condition | observed_status | checked_at | evidence_id |
|---|---|---|---|---|
| `{{TRIGGER_ID}}` | `{{CONDITION}}` | `{{OBSERVED_STATUS}}` | `{{CHECKED_AT}}` | `{{EVIDENCE_ID}}` |

### 6.1 有效性判断

| validity_assessment_id | output_evidence_id | guardrail_id | validity_status | checked_triggers | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|
| `{{VALIDITY_ASSESSMENT_ID}}` | `{{VALIDITY_OUTPUT_EVIDENCE_ID}}` | `{{GUARDRAIL_ID}}` | `{{VALIDITY_STATUS}}` | `{{CHECKED_TRIGGERS}}` | `{{VALIDITY_PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `validity_assessment` |

## 7. 证据登记

| evidence_id | source_type | temporal_scope | estimation_status | transformation_type | 来源定位与限制 |
|---|---|---|---|---|---|
| `{{EVIDENCE_ID}}` | `{{SOURCE_TYPE}}` | `{{TEMPORAL_SCOPE}}` | `{{ESTIMATION_STATUS}}` | `{{TRANSFORMATION_TYPE}}` | `{{SOURCE_LOCATOR_AND_LIMITATIONS}}` |

## 8. Agent 输出谱系

| output_evidence_id | output_type | decision_status | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | limitations |
|---|---|---|---|---|---|---|---|---|
| `{{OUTPUT_EVIDENCE_ID}}` | `{{OUTPUT_TYPE}}` | `{{DECISION_STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `{{TRANSFORMATION_TYPE}}` | `{{LIMITATIONS}}` |

## 9. 下游使用说明

- 第 05 广告投放专家可否作为确定护栏：`{{YES_OR_NO}}`
- 第 06 活动促销专家可否作为确定护栏：`{{YES_OR_NO}}`
- 允许用途：`{{ALLOWED_USE}}`
- 禁止用途：`{{PROHIBITED_USE}}`
- 需要回到内置经营分析的问题：`{{UPSTREAM_RECALCULATION_NEED}}`

## 10. 缺口与人工复核

| gap_id | output_evidence_id | 字段/证据 | 缺失状态 | 影响 | owner | 下一步 | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{GAP_ID}}` | `{{OUTPUT_EVIDENCE_ID}}` | `{{FIELD_OR_EVIDENCE}}` | `{{MISSING_STATUS}}` | `{{IMPACT}}` | `{{OWNER}}` | `{{NEXT_STEP}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `gap_classification` |

## 11. 非执行声明

本记录只用于人工规划与审批编排。它不表示已经改价、投放广告、报名促销、获得法律结论或执行任何平台动作；可选 SIF 计算已固定排除在正式护栏之外。
