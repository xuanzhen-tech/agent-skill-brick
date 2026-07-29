<!--
文件功能：定义报价版本、范围、单位币种转换、成本字段和可比性判定合同。
职责边界：只约束报价范围内的比较，不提供实时汇率、运价、关税、利润或供应商报价。
重要关联：由 ../SKILL.md 在归一与计算时读取；正式字段映射到 ../assets/templates/supplier-quote-comparison-template.md。
-->

# 报价归一与可比性合同

## 1. 报价身份

| 字段 | 必填 | 规则 |
|---|---:|---|
| `quote_id` | 是 | 一个版本一个 ID |
| `supplier_candidate_id` | 是 | 不用名称直接联接 |
| `source_path` | 是 | 文件、页码、消息或附件定位 |
| `quote_date` | 是 | 不明写 unknown |
| `quote_version` | 是 | 不得合并多个版本字段 |
| `valid_until` | 是 | 缺失写 missing |
| `product_spec_version` | 是 | 必须可与比较情景对应 |
| `currency` | 是 | ISO 代码或来源原值 |
| `pricing_unit` | 是 | 件、套、箱、千克等 |
| `tax_basis` | 是 | 含税、不含税或 unknown |

## 2. 贸易与范围

记录：

- `incoterm_rule`
- `incoterm_version`
- `named_place`
- `included_items`
- `excluded_items`
- `optional_items`
- `unknown_items`
- `payment_terms`
- `lead_time_value`
- `lead_time_start_event`

Incoterms 缺版本或地点时，不可假定责任范围相同。

## 3. 数量阶梯

每一档单独记录：

| 字段 | 说明 |
|---|---|
| `tier_id` | 稳定编号 |
| `minimum_quantity` | 起始数量 |
| `maximum_quantity` | 上限或 open |
| `quantity_unit` | 与比较情景可转换 |
| `unit_price` | 原币原单位 |
| `conditions` | 付款、包装、材料、交期等 |

比较数量未落在某档时，不得使用该档单价。

## 4. 转换记录

每次转换必须保存：

- `conversion_id`
- `input_value` / `input_unit`
- `output_value` / `output_unit`
- `formula`
- `conversion_evidence_ids`
- `rate_timestamp`
- `rate_direction`
- `rounding_rule`
- `transformation_type=calculation`

没有已证转换关系时保持原值。

## 5. 报价范围成本

允许字段：

- `recurring_unit_cost`
- `quantity_tier_amount`
- `one_time_cost`
- `allocated_one_time_cost`
- `included_cost`
- `excluded_known_cost`
- `optional_cost`
- `unknown_cost`
- `quoted_scope_total`

计算示意：

`quoted_scope_total = quantity_tier_amount + allocated_one_time_cost + 明确纳入本情景的其他报价项`

未知项不进入零值计算；需要单独列示其可能改变比较结论。

## 6. 可比性门

以下字段任一关键不一致且无法合法调整时，状态为 `not_comparable`：

- 产品或规格版本；
- 数量档和 MOQ；
- 计价单位；
- 币种或汇率基准；
- Incoterms 责任范围和地点；
- 包装、测试、模具或运输范围；
- 有效期；
- 税务口径。

若只有局部范围一致，使用 `partially_comparable`，只比较明确区块。

## 7. 差异归因

每项差异记录：

- `difference_id`
- `field`
- `quote_a_value`
- `quote_b_value`
- `normalized_difference`
- `parent_evidence_ids`
- `driver_type`
- `decision_relevance`
- `uncertainty`

`driver_type` 可为 `price`、`tier`、`one_time`、`scope`、`payment`、`lead_time`、`quality`、`unknown`。

## 8. 禁止推论

- 最低单价不等于最低总成本；
- 报价范围总额不等于 landed cost；
- 报价有效不等于供应商已获批；
- 缺失费用不等于零；
- 更长账期不自动等于更优；
- 历史报价不等于当前可获得价格。
