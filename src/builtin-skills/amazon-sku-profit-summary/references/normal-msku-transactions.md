# Normal MSKU Transactions

本文件只处理 SKU 列为正常 seller SKU/MSKU 的主交易报告源行。

每个正常 seller SKU 默认保留为独立 MSKU，不因映射表缺失被强行合并到其他 MSKU。

## 0. 执行顺序

第一步，确认输入行只来自 Node 02 的 `normal_msku_candidate`。

第二步，保留正常 seller SKU 为独立 MSKU；只有明确别名证据时才改写为其他 MSKU。

第三步，按本文件字段公式逐列消耗源字段，形成 `field_consumption`。

第四步，逐列校验数量、金额、符号和源行覆盖；不得吸收 FNSKU、空白 SKU 或费用池行。

## 1. Column Mapping：字段级公式

### 1.1 目标

字段级公式只处理已经完成行级归因的交易行。

字段级公式回答：

```text
这行交易中的哪个字段进入利润表哪个列？
```

字段级异常不决定整行是否进入 `异常`。整行状态由 Row Resolution 决定。

### 1.2 字段异常处理

字段级异常状态：

| 内部状态码 | 用户可见状态 | 处理动作 |
|---|---|---|
| `missing_column` | 缺少字段 | 记录缺失字段和受影响公式 |
| `blank_value` | 空值 | 记录空值行数，按源数据空值处理 |
| `zero_value` | 零值 | 保留字段消耗记录，金额为 0 |
| `sign_review_required` | 符号需复核 | 保留源符号，记录需要复核 |
| `field_semantics_conflict` | 字段语义冲突 | 记录字段语义冲突，等待确认 |

字段级异常输出到字段消耗矩阵和报告证据。内部 evidence 可保留英文状态码；写入正式 workbook、CSV 或面向用户的状态列时，必须使用用户可见中文状态，不得直接展示英文枚举。

## 2. 利润列规则（正常 MSKU/SKU 子集）

### 2.1 销量

适用范围：

- 行级归因为正常 MSKU。
- `type = Order`。

字段来源：

- `quantity`

公式：

```text
销量 = SUM(quantity WHERE type = "Order")
```

验证：

```text
SUM(利润统计Sheet.销量) = SUM(source.quantity WHERE resolved_status = processed AND type = "Order")
```

### 2.3 调整数量

适用范围：

- 行级归因为 MSKU。
- `type = Adjustment`。

字段来源：

- `quantity`

公式：

```text
调整数量 = SUM(quantity WHERE type = "Adjustment")
```

验证：

```text
SUM(利润统计Sheet.调整数量) = SUM(source.quantity WHERE type = "Adjustment" AND resolved_msku IS NOT NULL)
```

### 2.4 销售金额

适用范围：

- 正常 MSKU 的 `type = Order`。
- 已映射 Liquidations 销售额。
- 已按规则分摊的 Subscription。

字段来源：

- `product_sales`
- `shipping_credits`
- `gift_wrap_credits`
- Liquidations 的 `product_sales`、`other_transaction_fees` 或 `total`

公式：

```text
销售金额 =
  SUM(product_sales WHERE type = "Order")
+ SUM(shipping_credits WHERE type = "Order")
+ SUM(gift_wrap_credits WHERE type = "Order")
+ SUM(liquidations_sales_amount)
```

### 2.5 折扣

适用范围：

- 已归因行存在 `promotional_rebates`。

字段来源：

- `promotional_rebates`

公式：

```text
折扣 = SUM(promotional_rebates)
```

符号：

- 保留源数据符号。

备注：

- 不区分 `type`，所有存在 `promotional_rebates` 的已归因行都要纳入折扣汇总。

### 2.6 退款

适用范围：

- 已归因行 `type = Refund`。

字段来源：

- `product_sales`
- `shipping_credits`
- `gift_wrap_credits`
- `other`

公式：

```text
退款 =
  SUM(product_sales WHERE type = "Refund")
+ SUM(shipping_credits WHERE type = "Refund")
+ SUM(gift_wrap_credits WHERE type = "Refund")
+ SUM(other WHERE type = "Refund")
```

### 2.7 亚马逊物料赔偿

适用范围：

- 已归因行 `type = Adjustment`。
- `description != "Other"`。

字段来源：

- `other`

公式：

```text
亚马逊物料赔偿 =
  SUM(other WHERE type = "Adjustment" AND description != "Other")
```

description 为 `Other` 的处理：

- 行级归因继续执行。
- 若可归属 MSKU，但业务语义不明确，标记为 `unresolved_with_reason`。
- 费用池Sheet 原因写明：`Adjustment description=Other，需业务确认字段语义`。

### 2.8 手续费

适用范围：

- 已归因行存在 `selling_fees`。

字段来源：

- `selling_fees`

公式：

```text
手续费 = SUM(selling_fees)
```

符号：

- 保留源数据符号。
- 利润表中体现为费用方向。

### 2.9 fba运费

适用范围：

- 已归因行 `type IN ("Order", "Refund", "FBA Transaction fees")`。
- 不包含 `FBA Inbound Placement Service Fee`；入库配置费属于 FBA 仓储大类，按 `blank-sku-fees.md` 的互斥落点规则处理：有可靠明细时只分摊到 MSKU，缺少明细时只计入店铺维度。

字段来源：

- `fba_fees`

公式：

```text
fba运费 =
  SUM(fba_fees WHERE type IN ("Order", "Refund", "FBA Transaction fees"))
```

验证：

- 当源数据存在 FBA 运费时，最终合计行 `fba运费` 不应为 0。
- `fba运费` 是费用列，正常输出应小于等于 0；若出现正数，必须有返还或冲销证据。
