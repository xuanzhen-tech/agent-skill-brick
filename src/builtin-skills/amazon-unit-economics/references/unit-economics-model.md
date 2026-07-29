<!--
文件功能：定义单位经济工作表的成本分类、公式、输入完整性、复核恒等式和情景解释方法。
职责边界：提供内置利润包输入准备与独立复核口径，不提供动态税率、平台费率或会计法律结论；具体数值来自用户输入、内置包输出或受限 SIF 探索性信号。
关联关系：由 ../SKILL.md 在防双算、工作表计算、结果解释和情景分析阶段读取。
-->

# 单位经济模型

## 成本分层

### 价格相关扣减

以售价 `P` 为分母：

- 折扣准备：`P * discount_rate`
- 退款准备：`P * refund_rate`
- 平台佣金：`P * referral_fee_rate`
- 广告：`P * advertising_rate`

退款准备表示预期退还的收入；退货处理成本另行按每次退货成本建模。

### 落地成本

逐单位相加：

```text
product
packaging
quality_control
tooling_amortization
first_mile
international_freight
duty_and_tax
brokerage
prep_and_inbound
```

### 平台与履约成本

逐单位相加：

```text
售价 * referral_fee_rate
fulfillment
storage
other_channel
refund_rate * return_processing_per_return
```

### 固定成本摊销

```text
fixed_launch_amortization = fixed_launch_cost / planned_lifetime_units
```

如果预计销量尚未确认，不计算完全负担贡献和目标完全负担售价。

## 利润瀑布

```text
gross_revenue = P
net_revenue = P - 折扣准备 - 退款准备
CM1 = net_revenue - 落地成本
CM2 = CM1 - 平台与履约成本
CM3 = CM2 - 广告
fully_loaded_contribution = CM3 - 固定成本摊销
```

所有利润率以 `P` 为分母：

```text
margin = contribution / P
```

## 保本指标

### 保本 ACoS

广告前可支配贡献为 CM2：

```text
break_even_acos = max(CM2 / P, 0)
break_even_roas = 1 / break_even_acos
```

CM2 小于等于 0 时不存在可承受广告空间，ROAS 记为不可计算。

### 保本售价

将随售价同比变化的比率相加：

```text
price_linked_rate =
  discount_rate
  + refund_rate
  + referral_fee_rate
  + advertising_rate
```

把所有固定每单位成本和固定成本摊销记为 `F`：

```text
break_even_price = F / (1 - price_linked_rate)
```

若 `price_linked_rate >= 1`，没有有限保本售价。

目标完全负担利润率 `m` 的售价：

```text
target_price = F / (1 - price_linked_rate - m)
```

分母小于等于 0 时目标不可达。

## 输入完整性

每个必填键必须出现。值为 0 不等于缺失；只有用户确认不适用，或有证据证明已被另一行包含时，才允许 0。

工作表中的每个数值都必须有以下字段：

```text
value
status
source
evidence_id
as_of
reason
```

关键状态：

- `ready`：用户确认或可复核事实；
- `provisional`：SIF 供应商信号或用户待确认假设；
- `not_applicable`：明确不适用，数值为 0。

缺值用 `status=missing` 表达并停止盈利计算，不把 `missing` 当数值送入公式。SIF 来源不能直接标 `ready`。0 值必须是 `not_applicable` 且有理由；非 0 值不能标 `not_applicable`。工作表必须汇总 `input_readiness`：只要关键输入存在 `provisional` 就是 `preview`，存在 `missing` 就是 `blocked`，全部关键输入确认后才是 `ready`。

正式利润真相来自内置 `amazon-sku-profit-summary`。本文件公式只用于输入合同、解释和独立复核；复核不一致时停止交付并排查，不用本地结果覆盖内置包。

### SIF 证据状态

SIF 预填与探索性门槛必须为每次调用记录整体 `result_state`，为每个消费字段记录 `field_state`；两者只允许 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。前五态都不是数值 0，不得补成 0 或进入公式；只有响应明确返回零且字段语义可确认时才使用 `true_zero`。

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文确实未暴露对应字段时才写 `not_returned`。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`，三类 ID 不得互代。普通 SIF 调用若传 `arguments.country`，该值必须绑定直接父 Evidence ID 并写入 `parent_input_evidence_ids`；没有直接父证据就不调用，目标非 US 且不受支持时停止分支。

## 计算复核

正式交付前至少做两类核对。

### 层级恒等式

```text
CM1 = net_revenue - landed_cost
CM2 = CM1 - platform_and_fulfillment_cost
CM3 = CM2 - advertising_cost
fully_loaded_contribution = CM3 - fixed_launch_amortization
```

每一层的明细和必须等于该层合计；不允许通过在下一层增加“调整项”掩盖差异。

### 保本反算

把 `break_even_price` 代回同一组费率、单位成本和固定成本摊销，`fully_loaded_contribution` 应在币种舍入容差内等于 0。若不为 0，先检查：

1. 是否漏掉某个随售价变化的费率；
2. 是否把逐单位成本误放进百分比；
3. 是否重复扣除退款或广告；
4. 是否过早四舍五入。

## 情景解释

工作表可支持：

- `selling_price` 或 `price_multiplier`；
- `rate_overrides`；
- `cost_overrides`；
- `cost_multipliers`；
- `fixed_launch_cost` 或其倍数；
- `planned_lifetime_units`。

每个情景只改变显式列出的变量，其余继承基准。报告必须逐项打印变化，不能只显示结果差。

每个进入结果表的情景都必须显式声明 `approved_by_user=true` 和 `evidence_id`；未获用户确认的情景只能留在待确认问题中，不得参与决策。

## 防双算清单

- 报价中的 DDP 运费可能已含关税与清关；
- FBA 总估算可能已含履约但不含仓储；
- 采购价可能已含包装或质检；
- 模具费可能已经摊入采购单价；
- 退款准备与退货处理成本含义不同；
- 广告率若使用 TACoS，不能再额外扣同一广告费用；
- 税额若不属于卖家收入，不应先计入售价再作为成本扣除。
