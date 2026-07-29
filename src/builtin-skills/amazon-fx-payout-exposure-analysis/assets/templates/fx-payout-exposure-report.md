<!--
文件功能：承载 FX、渠道结算与银行到账暴露分析的正式交付结构。
职责边界：模板只组织已有证据和可复核计算，不获取汇率、不推荐渠道、不执行交易、划款或套保。
重要关联：../../SKILL.md 定义流程；../../references/fx-payout-analysis-contract.md 定义率、方向与交易链。
-->

# FX 与回款暴露分析

## 1. 分析状态

- `case_id`: `{{CASE_ID}}`
- `analysis_status`: `{{ANALYSIS_STATUS}}`
- `created_at`: `{{CREATED_AT}}`
- `marketplace`: `{{MARKETPLACE}}`
- `account_or_entity`: `{{ACCOUNT_OR_ENTITY}}`
- `actual_or_scenario`: `{{ACTUAL_OR_SCENARIO}}`

## 2. 交易链

| chain_id | payout_id | settlement_id | bank_transaction_id | linkage_status | linkage_evidence_ids |
|---|---|---|---|---|---|
| `{{CHAIN_ID}}` | `{{PAYOUT_ID}}` | `{{SETTLEMENT_ID}}` | `{{BANK_TRANSACTION_ID}}` | `{{LINKAGE_STATUS}}` | `{{LINKAGE_EVIDENCE_IDS}}` |

### 时间

- `payout_time`: `{{PAYOUT_TIME}}`
- `settlement_time`: `{{SETTLEMENT_TIME}}`
- `bank_receipt_time`: `{{BANK_RECEIPT_TIME}}`
- `timezone`: `{{TIMEZONE}}`

## 3. 四类汇率

| rate_record_id | output_evidence_id | rate_type | numerator amount/currency | denominator amount/currency | quote_direction | rate_value | amount_basis | fee_inclusion | rate_timestamp | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{RATE_RECORD_ID}}` | `{{OUTPUT_EVIDENCE_ID}}` | `{{RATE_TYPE}}` | `{{NUMERATOR_AMOUNT}} {{NUMERATOR_CURRENCY}}` | `{{DENOMINATOR_AMOUNT}} {{DENOMINATOR_CURRENCY}}` | `{{QUOTE_DIRECTION}}` | `{{RATE_VALUE}}` | `{{AMOUNT_BASIS}}` | `{{FEE_INCLUSION}}` | `{{RATE_TIMESTAMP}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `{{ESTIMATION_STATUS}}` | `{{TRANSFORMATION_TYPE}}` |

> 若 `rate_type=bank_receipt_effective_rate` 且到账已扣费用或扣款，展示名称必须为“含费用的到账有效率”。

## 4. 渠道报价可比性

| output_evidence_id | 比较字段 | 报价 A | 报价 B | 是否一致/可转换 | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|
| `{{OUTPUT_EVIDENCE_ID}}` | 币对与方向 | `{{VALUE_A}}` | `{{VALUE_B}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `point_in_time` | `not_applicable` | `comparability_assessment` |
| `{{OUTPUT_EVIDENCE_ID}}` | 原始金额 | `{{VALUE_A}}` | `{{VALUE_B}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `point_in_time` | `not_applicable` | `comparability_assessment` |
| `{{OUTPUT_EVIDENCE_ID}}` | 报价时间 | `{{VALUE_A}}` | `{{VALUE_B}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `point_in_time` | `not_applicable` | `comparability_assessment` |
| `{{OUTPUT_EVIDENCE_ID}}` | 结算速度 | `{{VALUE_A}}` | `{{VALUE_B}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `point_in_time` | `not_applicable` | `comparability_assessment` |
| `{{OUTPUT_EVIDENCE_ID}}` | 税费/提现条件 | `{{VALUE_A}}` | `{{VALUE_B}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `point_in_time` | `not_applicable` | `comparability_assessment` |
| `{{OUTPUT_EVIDENCE_ID}}` | 毛额/净额及含费口径 | `{{VALUE_A}}` | `{{VALUE_B}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `point_in_time` | `not_applicable` | `comparability_assessment` |

- `comparability_status`: `{{COMPARABILITY_STATUS}}`
- 不可比说明：`{{INCOMPARABILITY_REASON}}`

## 5. 实际金额差额

| output_evidence_id | component | amount/currency | 证据或公式 | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | 状态 |
|---|---|---|---|---|---|---|---|---|---|
| `{{OUTPUT_EVIDENCE_ID}}` | `rate_spread` | `{{AMOUNT_AND_CURRENCY}}` | `{{EVIDENCE_OR_FORMULA}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `period` | `not_applicable` | `difference_decomposition` | `{{STATUS}}` |
| `{{OUTPUT_EVIDENCE_ID}}` | `explicit_fee` | `{{AMOUNT_AND_CURRENCY}}` | `{{EVIDENCE_OR_FORMULA}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `period` | `not_applicable` | `difference_decomposition` | `{{STATUS}}` |
| `{{OUTPUT_EVIDENCE_ID}}` | `other_deduction` | `{{AMOUNT_AND_CURRENCY}}` | `{{EVIDENCE_OR_FORMULA}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `period` | `not_applicable` | `difference_decomposition` | `{{STATUS}}` |
| `{{OUTPUT_EVIDENCE_ID}}` | `unexplained_difference` | `{{AMOUNT_AND_CURRENCY}}` | `{{EVIDENCE_OR_FORMULA}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `period` | `not_applicable` | `difference_decomposition` | `{{STATUS}}` |

不要把 `unexplained_difference` 自动命名为汇损、手续费、税款或异常。

## 6. 未来情景

- `scenario_id`: `{{SCENARIO_ID}}`
- `output_evidence_id`: `{{OUTPUT_EVIDENCE_ID}}`
- `scenario_rate`: `{{SCENARIO_RATE}}`
- `quote_direction`: `{{QUOTE_DIRECTION}}`
- `effective_period`: `{{EFFECTIVE_PERIOD}}`
- `estimation_status`: `scenario_only`
- `source_type`: `agent`
- `temporal_scope`: `scenario`
- `transformation_type`: `scenario_construction`
- `parent_evidence_ids`: `{{PARENT_EVIDENCE_IDS}}`
- `assumption_source`: `{{ASSUMPTION_SOURCE}}`
- `limitations`: `{{LIMITATIONS}}`

没有未来情景时填 `not_queried`，不要生成预测。

## 7. 证据登记

| evidence_id | source_type | temporal_scope | estimation_status | transformation_type | source locator | limitations |
|---|---|---|---|---|---|---|
| `{{EVIDENCE_ID}}` | `{{SOURCE_TYPE}}` | `{{TEMPORAL_SCOPE}}` | `{{ESTIMATION_STATUS}}` | `{{TRANSFORMATION_TYPE}}` | `{{SOURCE_LOCATOR}}` | `{{LIMITATIONS}}` |

## 8. Agent 输出谱系

| output_evidence_id | output_type | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | 结论上限 | limitations |
|---|---|---|---|---|---|---|---|---|
| `{{OUTPUT_EVIDENCE_ID}}` | `{{OUTPUT_TYPE}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `{{ESTIMATION_STATUS}}` | `{{TRANSFORMATION_TYPE}}` | `{{CONCLUSION_LIMIT}}` | `{{LIMITATIONS}}` |

## 9. 缺口与下一责任方

| gap_id | output_evidence_id | 缺失/冲突 | missing_status | 对分析的影响 | owner | 下一步 | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{GAP_ID}}` | `{{OUTPUT_EVIDENCE_ID}}` | `{{GAP}}` | `{{MISSING_STATUS}}` | `{{IMPACT}}` | `{{OWNER}}` | `{{NEXT_STEP}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `gap_classification` |

## 10. 非执行声明

本报告未执行汇率监控、换汇、划款、渠道切换或套保，也不构成会计、税务、法律、监管或投资建议。
