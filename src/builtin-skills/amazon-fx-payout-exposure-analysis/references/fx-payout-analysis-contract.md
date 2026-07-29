<!--
文件功能：定义 FX 回款分析的交易链、四类汇率、金额方向、可比性、SIF 排除边界与差额拆分合同。
职责边界：只接受用户、只读 uploads 或可信上游交易证据；当前 SIF 不提供 FX、payout 或到账真相；不提供实时汇率、渠道费率、税务规则、交易建议或会计结论。
重要关联：../SKILL.md 执行本合同；../assets/templates/fx-payout-exposure-report.md 承载正式输出。
-->

# FX 回款分析合同

## 1. 交易链

每条实际分析记录至少包含：

```text
chain_id
payout_id
settlement_id
bank_transaction_id
marketplace
account_or_entity
payout_time
settlement_time
bank_receipt_time
timezone
linkage_status
linkage_evidence_ids
```

`linkage_status` 只允许：

- `confirmed`
- `candidate_linkage`
- `missing`
- `conflicted`

只有 `confirmed` 链路可形成确定的实际差额拆分。金额或日期相近不是充分关联证据。

## 2. 汇率记录

每个汇率对象必须有：

```text
rate_record_id
output_evidence_id（仅 source_type=agent 的正式规范化或计算行必需）
rate_type
numerator_amount
numerator_currency
denominator_amount
denominator_currency
quote_direction
rate_value
amount_basis
fee_inclusion
rate_timestamp
timezone
payout_id
settlement_id
bank_transaction_id
evidence_ids
parent_evidence_ids
source_type=user_input|user_uploaded_file|trusted_upstream_output|agent
temporal_scope=point_in_time|period|scenario
estimation_status=observed|reported|not_applicable|scenario_only
transformation_type=raw|normalized|calculation|reciprocal_direction_conversion
```

正式报告中的规范化或计算汇率行必须使用 `source_type=agent`，并让 `output_evidence_id` 与该行的 `parent_evidence_ids`、四轴一起落盘；来源原始率只进入输入 Evidence，不得借用 Agent 输出 ID。

确定公式：

```text
rate_value = numerator_amount / denominator_amount
quote_direction = numerator_currency_per_denominator_currency
```

`amount_basis` 至少说明 `gross / net`；`fee_inclusion` 至少说明 `fees_excluded / explicit_fees_included / all_known_deductions_included / unknown`。

## 3. 四类汇率

| `rate_type` | 所需证据 | 允许结论 | 禁止结论 |
|---|---|---|---|
| `reference_mid_rate` | 带日期参考率及来源 | 参考换算基准 | 实际成交率、结算率、银行率 |
| `provider_quote_rate` | 渠道对明确金额和条件的报价 | 当时条件下的渠道报价 | 已成交、已到账、最优渠道 |
| `settlement_effective_rate` | 同一 payout 与结算金额对 | 渠道实际结算有效率 | 银行到账率、纯点差 |
| `bank_receipt_effective_rate` | 同一链原始金额与银行到账金额 | 到账有效率；含扣款时称 all-in | 纯 FX 率、渠道报价率 |

四类记录不得相互覆盖。一个来源同时给出多个率时，分别建立对象和 Evidence ID。

## 4. 倒数与方向转换

只有以下条件全部满足才可将一个率倒数：

1. 原始分子、分母金额和币种明确。
2. 原始方向有证据。
3. 转换目的明确。
4. 原始记录保留不变。
5. 新记录写 `transformation_type=reciprocal_direction_conversion`，并指向原记录的 Evidence ID。

不得对缺失、零分母、冲突或仅有格式化文本的率执行倒数。

## 5. 渠道报价可比性

每对报价必须逐项比较：

```text
currency_pair
quote_direction
source_amount
quote_timestamp
settlement_speed
tax_basis
fee_basis
withdrawal_conditions
minimum_amount
gross_or_net_basis
output_evidence_id
parent_evidence_ids
source_type=agent
temporal_scope=point_in_time|period
estimation_status=not_applicable
transformation_type=comparability_assessment
```

全部一致或有可追溯的等价转换时才设 `comparability_status=comparable`。否则设 `blocked_incomparable_basis` 并列差异，禁止排序。

## 6. 金额拆分

在同一交易链、同一币种和同一金额阶段，可使用以下一般恒等关系：

```text
unexplained_difference
= upstream_amount_at_stage
- explicit_fee
- other_evidence_backed_deduction
- downstream_observed_amount
```

每个拆分分量和剩余差额都是独立正式对象，必须直接保存：

```text
output_evidence_id
component=rate_spread|explicit_fee|other_deduction|unexplained_difference
amount
currency
formula_or_evidence
parent_evidence_ids
source_type=agent
temporal_scope=period
estimation_status=not_applicable
transformation_type=difference_decomposition
status
```

使用前必须明确：

- 每个金额属于哪个阶段和币种。
- `explicit_fee` 来自明确费用凭证。
- `other_evidence_backed_deduction` 有名称、来源和 Evidence ID。
- 上下游金额没有重复包含或排除同一费用。

`rate_spread` 是参考率、报价率或有效率之间的率差描述，不自动等于费用金额。需要金额化时，必须声明基准金额、方向、选择的两个率、公式和父证据；不可比时不计算。

## 7. 银行到账有效率

当银行到账金额包含任何已扣费用或扣款：

```text
rate_type = bank_receipt_effective_rate
fee_inclusion = explicit_fees_included | all_known_deductions_included | unknown
display_label = 含费用的到账有效率
```

该有效率沿用第 2 节的正式汇率对象，因此对象本体也必须包含 `output_evidence_id / parent_evidence_ids / source_type=agent / temporal_scope / estimation_status / transformation_type=calculation`。不得使用 `spot_rate`、`pure_fx_rate` 或类似名称。未知扣款时保留 `unknown` 与 `unexplained_difference`。

## 8. 未来情景

未来情景对象至少有：

```text
scenario_id
output_evidence_id
scenario_rate
quote_direction
effective_period
assumption_source
estimation_status = scenario_only
parent_evidence_ids
source_type = agent
temporal_scope = scenario
transformation_type = scenario_construction
limitations
```

未来情景不能和实际交易记录合并，也不能描述为预测、承诺或交易建议。

## 9. 证据四轴与谱系

每个原始记录必须有：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

每个计算或判断必须有：

- `output_evidence_id`
- `output_type=rate_calculation|effective_rate|comparability_assessment|difference_decomposition|scenario_record|gap_classification`
- `parent_evidence_ids`
- `source_type=agent`
- `temporal_scope=point_in_time|period|scenario`
- `estimation_status=not_applicable|scenario_only`
- `transformation_type=calculation|reciprocal_direction_conversion|comparability_assessment|difference_decomposition|scenario_construction|gap_classification`
- `created_at`
- `limitations`

每个正式计算或判断对象本体都必须直接携带这些字段。至少让读者能从报告的每个率和差额回到原始金额、原始汇率、交易链和费用凭证。

## 10. 缺失枚举

| 状态 | 处理 |
|---|---|
| `not_returned` | 来源未返回，不能补零 |
| `not_queried` | 尚未核验，不能写“没有” |
| `parse_failed` | 保留原始定位并交人工解析 |
| `missing` | 关键字段缺失，按影响阻断 |
| `conflicted` | 并列冲突证据，不自行挑选 |
| `true_zero` | 只有来源明确真实为零时使用 |

每个正式缺口对象直接保存：

```text
gap_id
output_evidence_id
missing_status
affected_field_or_evidence
impact
owner
next_step
parent_evidence_ids
source_type=agent
temporal_scope=point_in_time|period|scenario
estimation_status=not_applicable
transformation_type=gap_classification
```

## 11. 顶层状态

| 状态 | 条件 |
|---|---|
| `analysis_ready_for_review` | 实际交易链、金额口径和证据满足分析要求 |
| `scenario_only` | 仅有用户指定或透明未来情景 |
| `blocked_missing_transaction_linkage` | 无法证明同一交易链 |
| `blocked_missing_amounts` | 分子、分母或关键阶段金额缺失 |
| `blocked_incomparable_basis` | 渠道报价或金额阶段不可比 |
| `conflicted` | 核心证据冲突且无法消解 |
| `out_of_scope` | 请求要求监控、交易、划款、套保或法律/会计结论 |

## 12. 来源限制

- ExchangeRate-API 的参考数据即使由用户提供，也按参考率证据使用；它不能证明 bid/ask、渠道点差或实际结算。
- SIF 不提供结算、汇率、payout 或银行到账真相，本合同不调用它。
- WhaleBridge 的 CC BY-NC 4.0 内容、表格和模板不复制、不翻译、不改编；本合同只独立使用一般金额恒等关系。
