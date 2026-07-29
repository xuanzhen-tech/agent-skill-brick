<!--
文件功能：定义实际/目标/保本 ACoS、TACoS、经济边界、预算情景和人工决策状态合同。
职责边界：不提供固定行业阈值，不重建利润，不执行预算、竞价或自动规则。
重要关联：由 ../SKILL.md 在预算与经济判断时读取；正式字段映射到 ../assets/templates/ad-budget-acos-plan-template.md。
-->

# 广告预算与 ACoS 合同

## 1. 顶层结果合同

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `MISSING_AD_REPORT | MISSING_TOTAL_SALES | MISSING_ECONOMIC_GUARDRAIL | ZERO_DENOMINATOR | CURRENCY_OR_PERIOD_CONFLICT | ATTRIBUTION_IMMATURE | TARGET_NOT_APPROVED | OUT_OF_SCOPE_REQUEST`

每次运行只允许这一组顶层结果字段；不得并列 `planning_status`。指标 `calculation_status`、情景批准和决策候选状态是局部字段。

## 2. 指标身份

每个指标记录：

- `metric_id`
- `metric_type`
- `numerator`
- `denominator`
- `currency_or_unit`
- `account/entity/product_scope`
- `period/timezone`
- `attribution_contract`
- `source_evidence_ids`
- `calculation_status`
- `rounding_rule`

## 3. ACoS 类型

| 类型 | 来源 | 规则 |
|---|---|---|
| `actual_acos_raw_ratio` | 一方广告报表 | spend / attributed sales |
| `target_acos_raw_ratio` | 用户批准目标 | future，不是实际 |
| `breakeven_acos_raw_ratio` | 第14或用户验证经济边界 | 不在本包重建 |

三者不得共用一个无类型字段。

raw ratio 是无量纲值，例如 `0.25`。展示百分比只在最后通过 `display_percent = raw_ratio * 100` 得到；计算和比较始终使用未舍入 raw ratio。

差距合同固定为：

- `gap_ratio = actual_acos_raw_ratio - target_acos_raw_ratio`
- `gap_percentage_points = gap_ratio * 100`
- `breakeven_gap_ratio = actual_acos_raw_ratio - breakeven_acos_raw_ratio`
- `breakeven_gap_percentage_points = breakeven_gap_ratio * 100`

`gap_percentage_points` 的单位是 percentage points，不是 percent change。每项必须记录 raw ratio、展示百分比和 `rounding_rule`。

## 4. TACoS

`tacos = actual_spend / first_party_total_sales`

必须满足：

- 同站点、币种、商品范围和期间；
- 总销售为一方资料；
- 花费和销售期间已对齐；
- 零/缺失分母为 `not_computable`；
- 不做自然销量因果推断。

## 5. 经济边界

| 字段 | 说明 |
|---|---|
| `economic_guardrail_id` | 上游稳定 ID |
| `source_expert_or_user` | 14或用户 |
| `price/cost version` | 必填 |
| `valid_as_of` | 必填 |
| `currency` | 必填 |
| `product_scope` | 必填 |
| `promotion_stack_status` | 价格变化是否处理 |
| `available_ad_contribution` | 数值或范围 |
| `limitations` | 结论上限 |

## 6. 情景

每个情景记录：

- `scenario_id`
- `scenario_name`
- `budget_range`
- `currency`
- `entity_scope`
- `target_acos/tacos`
- `breakeven_guardrail_id`
- `assumption_ids`
- `review_window`
- `stop_trigger`
- `approval_owner/status`

场景名不携带固定比例。

## 7. 决策状态

- `maintain_for_review`
- `increase_candidate`
- `decrease_candidate`
- `reallocate_candidate`
- `hold_for_data`
- `hold_for_economics`
- `stop_candidate`
- `not_assessable`

每项必须有 `parent_evidence_ids`、条件、风险和人工批准状态。

## 8. 四轴与谱系

记录 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。

实际指标为 reported/calculation；目标为 future；预算情景为 forecast/hypothesis。
