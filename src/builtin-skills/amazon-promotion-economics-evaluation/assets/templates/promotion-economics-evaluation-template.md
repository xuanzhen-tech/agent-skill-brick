<!--
文件功能：作为 Agent 生成促销增量经济评估、情景账本和无有限解说明时使用的稳定模板。
职责边界：只约束变量、公式和决策字段，不预填成本、费用、销量倍数、lift或活动结论。
重要关联：由 ../../SKILL.md 写入 outputs/promotion-management/<case-id>/02-economics-evaluation/ 前读取或物化；公式语义见 ../../references/promotion-economics-formula-contract.md。
-->

# Amazon 促销经济评估

## 任务摘要

- Case ID：
- 站点与 SKU/变体：
- 币种与期间：
- 贡献目标：
- 总体状态：`ready | limited | blocked_missing_profit_baseline | blocked_missing_volume_baseline | blocked_basis_mismatch | no_finite_solution | conflicted | out_of_scope`

## 第 14 基线

| 变量 | 值 | 单位/币种 | 期间 | 上游路径 | Evidence ID | 口径/限制 |
|---|---:|---|---|---|---|---|
| `C0` |  |  |  |  |  |  |
| `Q0` |  |  |  |  |  |  |
| 价格底线 |  |  |  |  |  |  |

## 促销增量变量

| 变量 | 值 | 单位 | 来源/假设 | Source Evidence ID | 四轴 | 缺失处理 |
|---|---:|---|---|---|---|---|
| `d` |  |  |  |  |  |  |
| `f_redeem` |  |  |  |  |  |  |
| `v_other` |  |  |  |  |  |  |
| `r_delta` |  |  |  |  |  |  |
| `F` |  |  |  |  |  |  |
| `rho` |  |  |  |  |  |  |

## 优惠单位贡献

- `C_offer =`：
- `available_contribution_before_discount =`：
- 状态：`positive | zero | negative | no_finite_solution | blocked`
- 触发解释：

## 情景

| 情景 | `Qp` | 倍数 | lift | `Qc` | `Qi` | `C_offer` | `C_blended` | 固定费 | 总贡献 | 与基线差 | 决策 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 维持基线贡献

- 使用单位贡献：`C_offer | C_blended`
- `required_multiplier =`：
- `required_lift =`：
- 是否有有限解：
- 公式与变量：
- 不允许的解释：

## 敏感项

| 变量 | 当前假设 | 可行范围/来源 | 决策翻转点 | 责任方 |
|---|---|---|---|---|
|  |  |  |  |  |

## 双层证据账本

### 来源证据层

| Source Evidence ID | 来源/上游路径 | 字段 | 原值 | 币种/单位 | 期间 | 四轴 |
|---|---|---|---:|---|---|---|
|  |  |  |  |  |  |  |

若来源为 `sif_mcp`，同一来源对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、覆盖/分页、`estimation_status` 和 `raw_result_locator`；销量趋势使用 `transformation_type=reported`，供应商利润阈值使用 `transformation_type=vendor_calculation`。

### SIF 供应商计算对象

只在实际调用 `market_estimate_profit_threshold` 时填写；此对象本体必须保留输入父证据，不得仅在派生决策总账补写。

| Vendor Calculation ID | Source Tool | Call Arguments Snapshot | `parent_input_evidence_ids[]` | Dimension Group Status | Agent Request ID | Tool Call ID | Provider Request ID | Raw Result Locator | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
| `<vendor-calculation-id>` | `market_estimate_profit_threshold` | `<exact arguments>` | `<all mapped input evidence ids>` | `<complete/omitted>` | `<id>` | `<id>` | `<id/not_returned>` | `<path/object locator>` | `vendor_calculation` | `<vendor rate/exchange/schema limits>` |

| Formal Argument | Value | Parent Input Evidence ID | Validation |
|---|---|---|---|
| `price` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `category` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `weight_oz` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `freight_cost` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `target_margin` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `country` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `price_currency` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `tariff_rate` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `is_apparel` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `turnover_days` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `length_in` | `<value/omitted>` | `<evidence-id/not_applicable>` | `<verified/omitted_with_group>` |
| `width_in` | `<value/omitted>` | `<evidence-id/not_applicable>` | `<verified/omitted_with_group>` |
| `height_in` | `<value/omitted>` | `<evidence-id/not_applicable>` | `<verified/omitted_with_group>` |

前十项任一项不是 `verified` 时不得调用。尺寸三项只能全部 `verified` 后成组传入，否则整组省略；任何参数都不得使用默认值。

### 派生决策层

| Decision Evidence ID | 输入 Evidence IDs | 公式 | 假设 | 结果 | 状态 | 四轴 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 能力声明

- 本评估没有重建第 14 的成本或利润真相。
- SIF 销量趋势或供应商利润阈值没有被当作用户一方订单、`Q0`、转化、第14利润真相或真实增量。
- 本 Skill 未预测实际销量、报名活动或执行改价。
