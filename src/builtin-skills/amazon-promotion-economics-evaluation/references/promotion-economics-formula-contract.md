<!--
文件功能：定义促销增量经济变量、销量倍数与lift、优惠单位贡献、总贡献和no_finite_solution公式。
职责边界：只在第14提供的贡献基线上计算增量影响，不重建成本、预测销量或提供固定活动参数。
重要关联：由 ../SKILL.md 在情景计算前读取；正式变量和结果落入 ../assets/templates/promotion-economics-evaluation-template.md。
-->

# 促销经济公式合同

## 一、变量

| 变量 | 定义 | 必需口径 |
|---|---|---|
| `C0` | 第14提供的活动前单位贡献 | 金额/单位、币种、期间、SKU |
| `Q0` | 可比基线销量 | 单位、期间、SKU |
| `d` | 每兑换单位相对基线减少的收入 | 金额/兑换单位 |
| `f_redeem` | 每兑换单位新增费用 | 金额/兑换单位 |
| `v_other` | 每促销单位其他增量可变成本 | 金额/单位 |
| `r_delta` | 每促销单位预期退货/退款贡献影响 | 金额/单位 |
| `F` | 活动固定费 | 金额/活动 |
| `rho` | 兑换比例 | 0 到 1；必须有来源或明确情景 |
| `Qp` | 促销期总销量情景 | 与 `Q0` 同期间单位 |
| `Qc` | 蚕食销量情景 | 本来会按基线条件售出的单位 |
| `Qi` | 真正增量销量情景 | 不由供应商销量自动推导 |

变量缺失不填零。费用已被 `C0` 吸收时不得重复扣除。

## 二、优惠单位贡献

```text
C_offer = C0 - d - f_redeem - v_other - r_delta
available_contribution_before_discount =
  C0 - f_redeem - v_other - r_delta
```

若：

```text
C_offer <= 0
```

或：

```text
d >= available_contribution_before_discount
```

则状态为 `no_finite_solution`。增加优惠单位数量只会增加零或负贡献，不能通过销量恢复原贡献目标。

## 三、混合贡献

当 `rho` 合法：

```text
C_blended = (1 - rho) * C0 + rho * C_offer
```

混合贡献用于组合情景，不得掩盖优惠单位的 `no_finite_solution`。

## 四、销量倍数与 lift

仅当 `Q0 > 0`：

```text
sales_multiplier = Qp / Q0
sales_lift = (Qp - Q0) / Q0
sales_lift = sales_multiplier - 1
```

示例语义：`sales_multiplier=1.25` 对应 `sales_lift=0.25`，分别表达 1.25 倍与 25% 增长。`Q0=0` 时全部为 `undefined`。

## 五、维持贡献目标

对全部促销单位均使用 `C_offer` 的情景：

```text
baseline_total_contribution = Q0 * C0
promotion_total_contribution = Qp * C_offer - F
required_multiplier =
  (baseline_total_contribution + F) / (Q0 * C_offer)
required_lift = required_multiplier - 1
```

只有 `Q0 > 0` 且 `C_offer > 0` 才计算。混合兑换情景可用 `C_blended` 替换，但必须显式说明。

## 六、蚕食与增量

蚕食与增量是情景/一方证据，不是 SIF 原生事实。SIF 销量趋势不能替代 `Q0`、`Qc` 或 `Qi`。至少满足：

```text
0 <= Qc <= Qp
Qi = Qp - Qc
```

若用户采用其他反事实定义，应打印定义与公式。前后差异不能自动成为 `Qi`。

## 七、公式证据

每个结果记录：

- `decision_evidence_id`；
- 输入变量及 Source Evidence IDs；
- 公式版本；
- 未四舍五入原值与显示精度；
- 币种、单位和期间；
- 假设、状态与结论限制。

## 八、SIF 供应商计算对象

`market_estimate_profit_threshold` 只形成供应商费率/汇率口径的探索性对象，不进入上述促销公式的第 14 利润真相。

正式调用的 `arguments` 必须显式包含 `price`、`category`、`weight_oz`、`freight_cost`、`target_margin`、`country`、`price_currency`、`tariff_rate`、`is_apparel`、`turnover_days`。每个键都必须映射到已验证输入 Evidence ID；缺失、冲突或未经验证即不得调用，不设默认值。`category` 必须来自用户或可信上游确认的费用类目口径，SIF ASIN 画像类目只能保留供应商快照语义，不能升级为官方类目事实或静默代填。`length_in`、`width_in`、`height_in` 只有三项均有父证据且机器 schema 同时支持时才成组传入，否则整组省略。

每次调用另建 `vendor_calculation` 对象，并在对象本体保存：

- `vendor_calculation_id`
- `source_tool=market_estimate_profit_threshold`
- 正式 `arguments` 快照
- 逐参数映射的 `parent_input_evidence_ids[]`
- `agent_request_id`、`tool_call_id`、`provider_request_id`
- `raw_result_locator`
- `transformation_type=vendor_calculation`
- 供应商费率、汇率、schema 与适用范围限制

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的真实值；上下文未暴露对应字段时分别写 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`；三类 ID 不得互相代填，也不得以本地 ID 冒充服务端 ID。
