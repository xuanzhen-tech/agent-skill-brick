<!--
文件功能：提供报价版本、情景、可比性、成本差异、重报价和证据谱系的正式交付模板。
职责边界：模板不提供汇率或未知成本，不把占位值视为零，也不产生供应商选择或下单动作。
重要关联：由 ../../SKILL.md 物化；计算与状态遵循 ../../references/quote-normalization-and-comparability-contract.md。
-->

# 供应商报价与成本比较

## A. 比较元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `product_spec_version` | `<version>` |
| `comparison_status` | `<comparable/comparable_with_adjustments/partially_comparable/not_comparable/expired/conflicted/blocked>` |
| `scenario_count` | `<count>` |
| `prepared_at` | `<timestamp + timezone>` |
| `conclusion_limit` | `只比较报价明确范围，不代表 landed cost、利润或供应商批准` |

## B. 报价版本登记

| Quote ID | Candidate ID | Source Path | Date | Version | Valid Until | Currency | Unit | Tax Basis | Product Version |
|---|---|---|---|---|---|---|---|---|---|
| `<quote-id>` | `<candidate-id>` | `<path>` | `<date>` | `<version>` | `<date/missing>` | `<currency>` | `<unit>` | `<basis>` | `<version>` |

## C. 贸易与范围

| Quote ID | Incoterm | Version | Named Place | Included | Excluded | Optional | Unknown | Payment | Lead Time / Start Event |
|---|---|---|---|---|---|---|---|---|---|
| `<quote-id>` | `<rule>` | `<version>` | `<place>` | `<items>` | `<items>` | `<items>` | `<items>` | `<terms>` | `<value/event>` |

## D. 比较情景

| Scenario ID | Quantity/Unit | Product Version | Packaging | Delivery Scope | Target Date | Comparison Currency | FX Evidence ID | One-time Allocation |
|---|---|---|---|---|---|---|---|---|
| `<scenario-id>` | `<value>` | `<version>` | `<pack>` | `<scope>` | `<date>` | `<currency/original>` | `<id/not_available>` | `<rule>` |

## E. 可比性矩阵

| 检查项 | Quote A | Quote B | 状态 | 合法调整 | Parent Evidence IDs | 影响 |
|---|---|---|---|---|---|---|
| `<product/quantity/unit/currency/incoterm/scope/validity/tax>` | `<value>` | `<value>` | `<same/adjustable/different/missing>` | `<conversion-id/none>` | `<ids>` | `<impact>` |

## F. 报价范围成本

| Scenario ID | Quote ID | Recurring Unit | Tier Amount | One-time Cost | Allocated One-time | Included Cost | Excluded Known | Optional | Unknown | Quoted Scope Total | Status |
|---|---|---:|---:|---:|---:|---:|---|---|---|---:|---|
| `<scenario-id>` | `<quote-id>` | `<value currency/unit>` | `<value>` | `<value>` | `<value>` | `<items>` | `<items>` | `<items>` | `<items>` | `<value>` | `<comparable/not_comparable>` |

## G. 转换账本

| Conversion ID | Input Value/Unit | Output Value/Unit | Formula | Evidence IDs | Rate Timestamp/Direction | Rounding |
|---|---|---|---|---|---|---|
| `<conversion-id>` | `<value>` | `<value>` | `<formula>` | `<ids>` | `<value/not_applicable>` | `<rule>` |

## H. 差异解释

| Difference ID | Field | Quote A | Quote B | Normalized Difference | Driver | Decision Relevance | Uncertainty | Evidence IDs |
|---|---|---|---|---|---|---|---|---|
| `<difference-id>` | `<field>` | `<value>` | `<value>` | `<value/not_comparable>` | `<price/tier/one_time/scope/payment/lead_time/quality/unknown>` | `<note>` | `<note>` | `<ids>` |

## I. 重报价清单

| Gap ID | Quote ID | 缺失/冲突字段 | 精确问题 | 要求格式 | 责任人 | 截止时间 | 缺失后果 |
|---|---|---|---|---|---|---|---|
| `<gap-id>` | `<quote-id>` | `<field>` | `<question>` | `<unit/currency/version>` | `<owner>` | `<date/tbd>` | `<not_comparable/hold>` |

## J. 证据与 Agent 输出

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Formula/Limitations |
|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<path-or-ids>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<value>` |

## K. 质量门

- [ ] 未拼接多个报价版本
- [ ] 数量、单位、币种、有效期和产品版本完整
- [ ] Incoterms 包含版本和指定地点
- [ ] 未知费用没有按零处理
- [ ] 每次转换有证据、公式和舍入规则
- [ ] `not_comparable` 没有被隐藏为排名
- [ ] quoted scope 未冒充 landed cost 或利润
- [ ] 无抓价、询价、谈判或下单
- [ ] 正式交付仅位于 `outputs/`
