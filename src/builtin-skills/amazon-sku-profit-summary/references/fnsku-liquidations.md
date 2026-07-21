# FNSKU and Liquidations

本文件处理 SKU 列为 FNSKU、Liquidations 或需要通过 FNSKU/ASIN/SKU 证据链归因的主交易报告源行。

必须按双轨记录映射状态：内部事实可使用 `mapped` / `mapping_conflict` / `unmapped`，用户可见产物写“已映射”/“映射冲突”/“未映射”。

## 0. 执行顺序

第一步，确认输入行只来自 Node 02 的 `fnsku_or_liquidations_candidate`。

第二步，按 FNSKU、ASIN、description 提取值、order id 辅助证据的顺序寻找可映射标识。

第三步，通过映射表把 FNSKU/ASIN/SKU 映射到 MSKU；多路径冲突时不得自动裁决。

第四步，映射成功的 Liquidations 金额进入对应 MSKU；映射失败或冲突的源行保留状态和原因，交给 Node 07 披露。

### 1.1 清算数量

适用范围：

- 行级归因为 FNSKU/Liquidations 并成功映射到 MSKU。
- `type = Liquidations`。

字段来源：

- `quantity`

公式：

```text
清算数量 = SUM(quantity WHERE type = "Liquidations")
```

输出：

- 进入映射后 MSKU 的 `清算数量` 列。

## 1.2 FNSKU / Liquidations 规则

适用范围：

- `sku` 为 FNSKU，例如 `X00*`。
- 或行级归因为 FNSKU/Liquidations。
- 通常 `type = Liquidations`。

归因路径：

1. FNSKU -> 映射表 -> MSKU。
2. ASIN -> 映射表 -> MSKU。
3. description 提取 FNSKU/ASIN/SKU -> 映射表 -> MSKU。
4. 辅助明细 -> FNSKU/ASIN/SKU -> 映射表 -> MSKU。

金额规则：

```text
清算数量 = SUM(quantity WHERE type = "Liquidations")

Liquidations 销售金额 =
  SUM(product_sales WHERE type = "Liquidations")
+ SUM(other_transaction_fees WHERE type = "Liquidations")
```

若 `total` 与上述合计等价，可使用：

```text
Liquidations 销售金额 = SUM(total WHERE type = "Liquidations")
```

输出：

- 映射成功：进入对应 MSKU 的 `清算数量` 和 `销售金额`。
- 映射失败：按 Row Resolution 的最终未解决条件进入费用池 Sheet，用户可见状态使用中文说明。
