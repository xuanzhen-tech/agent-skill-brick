# Blank SKU Fees

本文件处理 SKU 列为空的主交易报告费用行。

所有空白 SKU 必须先穷举可用直接证据，失败后才进入内部 unresolved。正式 workbook/csv 的状态列必须写中文展示值，不直接写英文内部状态码。

店铺维度是正式利润统计维度，不是未完成状态。对订阅费、FBA 仓储费、广告费、秒杀推广费、其他费用，同一笔交易报告 anchor 只能选择一个利润落点，不允许同时进入店铺维度和 SKU/MSKU 分摊明细。不得因为这些费用无法分摊到 MSKU/SKU 就默认进入缺证据未完成状态。

订阅费、FBA 仓储费、广告费、秒杀推广费、其他费用均为互斥落点表达：

- SKU/MSKU 分摊：有可靠明细、可靠归因依据或明确经营规则时，费用只写入 SKU/MSKU 明细。
- 店铺维度归结：没有可靠明细、没有可靠分摊依据，或用户明确要求不分摊时，费用只写入 `利润统计` 的 `店铺维度` 行。
- 已写入店铺维度的费用池状态写“缺少分摊明细，已计入店铺维度”或等价说明；已分摊到 SKU/MSKU 的费用不得再保留同一 anchor 的店铺维度金额。

订阅费默认按有交易 MSKU 的销售额或销量占比分摊到 MSKU 明细，不保留店铺维度。只有用户明确要求不分摊时，订阅费才进入店铺维度；用户明确给出其他分摊规则时，按用户规则分摊且仍不保留店铺维度。

长期仓储费等 anchor 与辅助明细无法建立直接关联时，不能按 residual 分摊；无法证明的主交易报告 anchor 必须进入未归因披露。

## 1. 利润列规则（空白 SKU 费用子集）

### 1.1 fba仓租

适用范围：

- `fba仓租` 是组合列，包含仓储相关的多个费用池。
- 主交易报告中的仓储相关费用行通常为空白 SKU，但 Amazon 后台有对应明细文件可定位 FNSKU/ASIN/SKU 或形成 MSKU 级分摊比例。

费用池：

| 费用池 | 主交易报告锚定行 | 明细文件 | 输出列 |
|---|---|---|---|
| 月度仓储费 | `type = FBA Inventory Fee` 且 `description = FBA storage fee` | 有月度仓储费明细且 linkage 通过时分摊到 MSKU/SKU；无明细或 linkage 不足时仅保留店铺维度 | fba仓租 |
| 长期仓储费 / 超龄库存附加费 | `type = FBA Inventory Fee` 且 `description = FBA Long-Term Storage Fee` 或其他超龄库存相关描述 | 有超龄库存附加费报告 / 长期仓储费明细且 linkage 通过时分摊到 MSKU；无明细或 linkage 不足时仅保留店铺维度 | fba仓租 |
| 移除费 | `type = FBA Inventory Fee` 且 `description = FBA Removal Order: Return Fee` | 有移除订单详情 / 移除货件详情且能映射时分摊到 MSKU；无明细时仅保留店铺维度 | fba仓租 |

输出符号：

- `fba仓租` 是费用列，正常输出应小于等于 0。
- 若仓储、长期仓储、移除费明细以正数表示费用支出，写入 利润统计Sheet 前必须转为负数。
- 只有明确费用返还或冲销证据时，才允许写入正数，并在 evidence 中记录原因。

#### 1.1.1 月度仓储费

主交易报告筛选条件：

```text
type = "FBA Inventory Fee"
description = "FBA storage fee"
```

锚定总额：

```text
monthly_storage_anchor =
  SUM(transaction amount WHERE type = "FBA Inventory Fee" AND description = "FBA storage fee")
```

金额字段选择：

- 优先使用主交易报告中能与 settlement 汇总回勾的金额字段。
- 通常检查 `total`、`other` 或该行实际非零金额字段。
- 记录实际采用的字段名和金额合计。

明细文件：

```text
月度仓储费.csv
```

关键字段：

```text
asin
fnsku
product_name
average_quantity_on_hand
estimated_monthly_storage_fee
month_of_charge
```

MSKU 映射：

```text
fnsku -> sku映射表.FNSKU -> MSKU
asin  -> sku映射表.ASIN  -> MSKU
```

MSKU 明细直接归属金额：

```text
msku_monthly_storage_detail_amount =
  SUM(estimated_monthly_storage_fee WHERE mapped_msku = MSKU)
```

明细总额：

```text
monthly_storage_detail_total =
  SUM(msku_monthly_storage_detail_amount for all mapped MSKU)
```

尾差：

```text
monthly_storage_residual =
  monthly_storage_anchor - monthly_storage_detail_total
```

尾差分配：

```text
msku_monthly_storage_residual =
  monthly_storage_residual
  * msku_monthly_storage_detail_amount
  / monthly_storage_detail_total
```

最终金额：

```text
msku_monthly_storage_fee =
  msku_monthly_storage_detail_amount
+ msku_monthly_storage_residual
```

写入：

```text
利润统计Sheet.fba仓租 += msku_monthly_storage_fee
```

如果有月度仓储费明细表且 linkage 通过，主交易报告 anchor 只写入 MSKU/SKU 分摊结果，不再写入店铺维度。若无明细表或 linkage 不足，不做 MSKU/SKU 分摊，主交易报告 anchor 才写入利润统计 Sheet 的店铺维度：

```text
利润统计Sheet.店铺维度.fba仓租 += monthly_storage_anchor
```

如在费用池或审计说明中披露，缺明细时记录“月度仓储费明细缺失，已按店铺维度计入”，用户可见状态写“缺少分摊明细，已计入店铺维度”，不得标记为缺少必要证据。

计算口径：

- 月度仓储费明细金额先直接归属到 MSKU。
- 交易报告锚定总额与明细总额之间的尾差，再按已映射明细金额占比分配。
- 不把全部 anchor_total 重新按比例洗一遍；明细金额本身就是直接归属依据。

未映射明细：

- 明细行无法通过 `fnsku` 或 `asin` 映射到 MSKU 时，记录为 `unresolved_detail`。

- 已映射明细继续归属和参与尾差分配。

- 未映射明细金额进入 费用池Sheet 或 reconciliation 报告，说明 FNSKU/ASIN、金额和失败路径。

  验证：

```text
SUM(msku_monthly_storage_detail_amount) = monthly_storage_detail_total
SUM(msku_monthly_storage_residual) = monthly_storage_residual
SUM(msku_monthly_storage_fee) = monthly_storage_anchor
```

互斥落点验证：

```text
有月度仓储费明细表时：
  SUM(msku_monthly_storage_fee) = monthly_storage_anchor
  store_monthly_storage_fee = 0

无月度仓储费明细表时：
  SUM(msku_monthly_storage_fee) = 0
  store_monthly_storage_fee = monthly_storage_anchor
```

#### 1.1.2 长期仓储费 / 超龄库存附加费

主交易报告筛选条件：

```text
type = "FBA Inventory Fee"
description = "FBA Long-Term Storage Fee"
```

如果 description 使用其他超龄库存或长期仓储描述，先按 `type + description` 分组确认业务含义，再纳入本费用池。

锚定总额：

```text
long_term_storage_anchor =
  SUM(transaction amount WHERE type = "FBA Inventory Fee" AND description IN long_term_storage_descriptions)
```

明细文件：

```text
超龄库存附加费报告.csv
```

关键字段：

```text
sku
fnsku
asin
qty-charged
amount-charged
surcharge-age-tier
rate-surcharge
```

MSKU 映射：

```text
sku   -> sku映射表.SKU   -> MSKU
fnsku -> sku映射表.FNSKU -> MSKU
asin  -> sku映射表.ASIN  -> MSKU
```

关联证据门禁：

```text
long_term_linkage_passed =
  transaction source row has direct SKU/FNSKU/ASIN/order_id link
  OR auxiliary detail is proven to belong to the same account + period + fee type + anchor set
```

如果 `long_term_linkage_passed = false`，不做 MSKU/SKU 分摊，主交易报告长期仓储费 / 超龄库存费 anchor 写入利润统计 Sheet 的店铺维度：

```text
unresolved_anchor_amount = long_term_storage_anchor
allocated_amount = 0
resolved_status = store_dimension_only
利润统计Sheet.店铺维度.fba仓租 += long_term_storage_anchor
```

此时整条交易报告长期仓储费 / 超龄库存费已进入店铺维度；费用池 Sheet 记录“缺少分摊明细，已计入店铺维度”或“缺少必要关联，已计入店铺维度”。辅助明细中的 MSKU、FNSKU、ASIN、金额只能作为参考差异证据，不得写入 MSKU 明细，不得把明细中可映射的部分先归因。

典型反例：

```text
transaction anchor = -1.08
transaction SKU/FNSKU/ASIN/order_id = empty
aged inventory detail = 0.27 with mapped MSKU
no evidence proving 0.27 belongs to the -1.08 anchor

result:
  store_dimension_amount = -1.08
  allocated_amount = 0
  detail 0.27 = reference/conflict evidence only
```

如果 `long_term_linkage_passed = true`，才允许进入分摊：

```text
msku_long_term_storage_basis =
  SUM(amount-charged WHERE mapped_msku = MSKU AND detail row belongs to linked anchor set)

msku_long_term_storage_fee =
  long_term_storage_anchor
  * msku_long_term_storage_basis
  / SUM(msku_long_term_storage_basis for all mapped MSKU in linked anchor set)
```

写入：

```text
利润统计Sheet.MSKU明细.fba仓租 += msku_long_term_storage_fee
```

长期仓储费不得用“辅助明细有 MSKU”替代 `long_term_linkage_passed`。明细总额与 anchor 不一致时，差异默认不是尾差；只有能证明差异属于同一费用集合内 rounding、期间口径或 Amazon 明确口径差异时，才允许作为 residual 处理。

#### 1.1.3 移除费

主交易报告筛选条件：

```text
type = "FBA Inventory Fee"
description = "FBA Removal Order: Return Fee"
```

处理步骤：

1. 对主交易报告中每一条移除费行读取 `order id`。
2. 用 `order id` 查 `移除订单详情`。
3. 用 `order id` 查 `移除货件详情`。
4. 从明细中读取 `sku`、`fnsku`、`removal-fee`、`requested-quantity`、`shipped-quantity`。
5. 将 `sku` 或 `fnsku` 映射到 MSKU。
6. 明细和映射可用时，按 order id 对应的明细金额或数量拆分该主交易行金额到 MSKU 明细，不写入店铺维度；明细缺失时只保留店铺维度。

明细文件：

```text
移除订单详情.csv
移除货件详情.csv
```

关键字段：

```text
order-id
sku
fnsku
requested-quantity
shipped-quantity
removal-fee
```

单个 order id 只对应一个 MSKU：

```text
msku_removal_fee = transaction_row_amount
```

单个 order id 对应多个 MSKU：

```text
msku_removal_basis =
  removal-fee if available
  else shipped-quantity
  else requested-quantity

msku_removal_fee =
  transaction_row_amount
  * msku_removal_basis
  / SUM(removal_basis for this order id)
```

写入：

```text
利润统计Sheet.MSKU明细.fba仓租 += msku_removal_fee
```

公式：

```text
fba仓租 =
  SUM(msku_monthly_storage_fee)
+ store_monthly_storage_fee
+ SUM(msku_long_term_storage_fee)
+ store_long_term_storage_fee
+ SUM(msku_removal_fee)
+ store_removal_fee
+ SUM(other_confirmed_storage_related_fee)
+ store_inbound_placement_fee
```

未映射处理：

每个仓储相关交易行或明细行必须尝试：

```text
sku   -> MSKU
fnsku -> MSKU
asin  -> MSKU
description 提取 SKU/FNSKU/ASIN/MSKU
order id -> 移除订单详情/移除货件详情 -> SKU/FNSKU -> MSKU
```

处理动作：

- 已证明与交易报告 anchor 关联且已映射的明细继续写入利润统计 Sheet。
- 未映射明细进入内部状态码 `unresolved_with_reason`，用户可见状态写“未解决，有原因”。
- 缺少仓储大类分摊明细文件时，相关 anchor 保留在店铺维度；费用池 Sheet 用户可见状态写“缺少分摊明细，已计入店铺维度”，不默认写“缺少必要证据”。
- 不得因为部分明细无法映射而放弃整个费用池。
- 对长期仓储费/超龄库存费，如果无法证明交易报告 anchor 与辅助明细关联，整条 anchor 保留在店铺维度；用户可见状态写“缺少必要关联，已计入店铺维度”，不得写入 MSKU 明细。

逐费用池验证：

```text
store_monthly_storage_fee = monthly_storage_anchor
有月度仓储明细时：SUM(msku_monthly_storage_fee) = monthly_storage_anchor

store_long_term_storage_fee = long_term_storage_anchor
linkage 通过时：SUM(msku_long_term_storage_fee) = long_term_storage_anchor

store_removal_fee = removal_fee_anchor
有移除明细时：SUM(msku_removal_fee) = removal_fee_anchor
```

总体验证：

```text
SUM(利润统计Sheet.全部行.fba仓租) =
  monthly_storage_anchor
+ long_term_storage_anchor
+ removal_fee_anchor
+ inbound_placement_anchor
+ other_confirmed_storage_related_anchor
```

尾差：

```text
residual = storage_fee_anchor - SUM(mapped_msku_storage_fee)
```

- `|residual| <= 0.10`：归入该费用池金额绝对值最大的 MSKU。
- `|residual| > 0.10`：按比例迭代分配到多个 MSKU。
- 调整后重新校验该费用池合计。
- 对长期仓储费/超龄库存费，`transaction anchor` 与辅助明细总额对不上且没有 linkage evidence 时，该差异不是 residual，必须进入 unresolved anchor。

### 1.2 广告费

适用范围：

- `type = Service Fee`
- `description = Cost of Advertising`

归属方式：

- transaction 广告费金额为 anchor_total。
- 有 SP 广告明细时，SP 广告明细决定 MSKU 分摊比例，只写入 MSKU 明细广告费分摊结果。
- 无 SP 广告明细或无法可靠映射到 MSKU/SKU 时，不做强行分摊，只保留店铺维度广告费。
- 广告 spend/花费属于费用支出，写入利润统计 Sheet 的 `广告费` 时必须为负数。
- 若 transaction 或 SP 广告明细以正数表示花费，分摊前先转为负数；锚定校验使用绝对金额闭环，输出校验使用负数费用口径。

公式：

```text
有明细时：
  利润统计Sheet.店铺维度.广告费 += 0
  利润统计Sheet.MSKU明细.广告费 += -ABS(SUM(advertising_fee_spend_allocation))

无明细时：
  利润统计Sheet.店铺维度.广告费 += advertising_anchor_total
```

验证：

```text
有明细时：ABS(SUM(利润统计Sheet.MSKU明细.广告费)) = ABS(advertising_anchor_total)
有明细时：利润统计Sheet.店铺维度.广告费 = 0
无明细时：SUM(利润统计Sheet.MSKU明细.广告费) = 0
无明细时：ABS(利润统计Sheet.店铺维度.广告费) = ABS(advertising_anchor_total)
SUM(利润统计Sheet.全部行.广告费) <= 0，除非存在明确广告费返还证据
```

### 1.3 秒杀推广费

适用范围：

- 主交易报告存在 Coupon、Deal、Vine 或其他秒杀/推广相关费用。

处理动作：

- 有 Coupon / Deal / Vine 明细且能映射到 MSKU/SKU：按明细归属或分摊到 MSKU 明细，不写入店铺维度。
- 无明细或无法可靠映射到 MSKU/SKU：不做强行分摊，只保留店铺维度秒杀推广费，用户可见状态写“缺少分摊明细，已计入店铺维度”。

验证：

```text
有明细时：SUM(利润统计Sheet.MSKU明细.秒杀推广费) = promotion_anchor_total
有明细时：利润统计Sheet.店铺维度.秒杀推广费 = 0
无明细时：SUM(利润统计Sheet.MSKU明细.秒杀推广费) = 0
无明细时：利润统计Sheet.店铺维度.秒杀推广费 = promotion_anchor_total
```

### 1.4 其他费用

适用范围：

- 已归因但不属于其他明确费用列的费用。
- `other_transaction_fees WHERE type = Order`。

处理动作：

- 有明确业务语义且能可靠归因到 MSKU/SKU 时，只进入 MSKU 明细的 `其他费用`。
- 有明确业务语义但无法可靠归因到 MSKU/SKU 时，只保留店铺维度其他费用，用户可见状态写“缺少分摊明细，已计入店铺维度”。
- 语义不明确：返回 Row Resolution 或标记内部状态码 `unresolved_with_reason`，用户可见状态写“未解决，有原因”。

### 1.5 采购成本

适用范围：

- 存在采购成本文件。
- 文件可映射到 MSKU。
- 多份采购成本候选无法证明属于本次任务时，先调用 `require_more_information` 确认，不得自行选用。

处理动作：

- 有文件：按 MSKU 写入采购成本；若采购成本币种与目标币种不同，先按 `transaction-report-core.md` 的汇率优先级生成 `currency_conversion_evidence`。
- 无文件：记录缺失证据，内部字段状态码使用 `missing_required_evidence`，用户可见状态写“缺少必要证据”。
- 原币采购金额必须保留；折算金额只作为统一展示或利润口径计算输入，不得覆盖原始采购成本。

### 1.6 头程费用

适用范围：

- 存在头程费用文件。
- 文件可映射到 MSKU。
- 多份头程费用候选无法证明属于本次任务时，先调用 `require_more_information` 确认，不得自行选用。

处理动作：

- 有文件：按 MSKU 写入头程费用；若头程费用币种与目标币种不同，先按 `transaction-report-core.md` 的汇率优先级生成 `currency_conversion_evidence`。
- 无文件：记录缺失证据，内部字段状态码使用 `missing_required_evidence`，用户可见状态写“缺少必要证据”。
- 原币头程金额必须保留；折算金额只作为统一展示或利润口径计算输入，不得覆盖原始头程费用。

## 2. 空白 SKU 专属费用明细与费用池规则

空白 SKU 费用行的第一目标是解释主交易报告中的具体费用行，而不是从辅助明细中反向创造利润归属。

费用池 Sheet 只接收已经完成主交易报告行自身字段、可用辅助文件、关联链路、映射和分摊判断后仍无法解决或已按店铺维度归结、需要汇总披露的交易报告费用。

全局边界：

- 交易报告金额是唯一 anchor_total。
- 专属明细文件必须先通过期间、账户、费用类型、金额闭环或标识链路证明与 anchor_total 关联。
- 辅助明细中可映射到 MSKU 的金额，只有在通过关联判断后才可进入利润统计 Sheet。
- 辅助明细不能新增交易报告中不存在的费用，也不能把交易报告无法关联的空白 SKU 费用分配给明细中的 MSKU。

### 2.1 FBA Inventory Fee

| description | 处理方式 | 必要证据 | 输出列 |
|---|---|---|---|
| FBA storage fee | 用主交易报告仓储费作为 anchor_total；有月度仓储明细时先证明明细与 anchor 关联，再按 FNSKU/ASIN/SKU 映射到 MSKU；无明细时不分摊到 MSKU/SKU，只计入店铺维度 | 月度仓储费明细 + linkage evidence；无明细时记录“缺少分摊明细，已计入店铺维度” | fba仓租 |
| FBA Long-Term Storage Fee | 用主交易报告长期仓储费 / 超龄库存费作为 anchor_total；有长期/超龄明细且 linkage 通过时分摊到 MSKU；无法证明时只保留店铺维度 | 长期仓储费或超龄库存明细 + linkage evidence；无明细/缺 linkage 时记录“缺少分摊明细或必要关联，已计入店铺维度” | fba仓租 |
| FBA Removal Order: Return Fee | 用主交易报告移除费作为 anchor_total；有移除订单详情/移除货件详情时通过明细中的 SKU/FNSKU 分摊到 MSKU；无明细时只保留店铺维度 | 移除订单详情、移除货件详情；无明细时记录“缺少分摊明细，已计入店铺维度” | fba仓租 |
| 空白或未知 | 若 `type = FBA Inventory Fee` 且 description 为空或无法分类，先归入 FBA 仓储大类店铺维度；费用池 Sheet 说明“description 为空，已计入店铺维度，需业务确认细分项” | 已尝试全部可用路径；业务确认细分项 | fba仓租 |

处理要求：

- 仓储、长期仓储和移除费都有专属明细优先级，但专属明细优先级不等于可以反向入账。
- 明细文件中的 FNSKU/ASIN/SKU 必须继续通过 `sku映射表.xlsx` 映射到 MSKU。
- 交易报告金额是 anchor_total；明细文件只在证明与 anchor_total 关联后用于确认 MSKU 和比例。
- 在交易报告费用行与明细文件关联已证明的前提下，明细文件中部分行无法映射时，只把这些明细对应的金额或比例标为未解决，已映射部分继续进入利润统计 Sheet。
- 如果交易报告费用行无法证明与明细文件关联，整条交易报告费用行保留在店铺维度并进入费用池 Sheet 说明；明细文件里可映射的 MSKU 不得吸收该费用。

### 2.2 Service Fee

| description | 处理方式 | 必要证据 | 输出列 |
|---|---|---|---|
| Cost of Advertising | 用主交易报告广告费作为 anchor_total；有 SP 广告明细时按广告 SKU/ASIN/campaign 明细映射 MSKU 并确定比例，只写入 MSKU 明细；无明细时不分摊到 MSKU/SKU，只计入店铺维度 | SP 广告明细；无明细时记录“缺少分摊明细，已计入店铺维度” | 广告费 |
| FBA Inbound Placement Service Fee | 属于 FBA 仓储大类；用主交易报告入库配置费作为 anchor_total；有入库配置服务费明细时用 FNSKU/ASIN/货件编号/入库计划编号分摊到 MSKU；无明细时只保留店铺维度 | 入库配置服务费明细；无明细时记录“缺少分摊明细，已计入店铺维度” | fba仓租 |
| Subscription | 无 SKU 级专属明细时，默认按有交易 MSKU 销售金额或销量占比分摊到 MSKU 明细；用户明确要求不分摊时才计入店铺维度 | 正常 MSKU 销售金额或销量；或用户明确规则 | 订阅费 / 其他费用 |
| 其他服务费 | 先尝试所有行级归因路径和专属明细；全部失败后进入费用池 Sheet | 已尝试所有可用映射路径 | 费用池 Sheet |

处理要求：

- 广告费和入库配置费不属于“定位不上才分摊”，必须优先查对应明细；缺少明细时按店铺维度计入，不强行分摊。
- Subscription 是当前明确的默认经营规则分摊项，默认不写入店铺维度。
- 其他 Service Fee 不能直接套 Subscription 规则，必须先证明没有专属明细或可映射证据。

### 2.3 FBA Transaction fees

处理步骤：

1. 读取独立 ASIN 字段。
2. 无独立 ASIN 时，从 description 提取 `for ASIN: XXXXXXXXXX`。
3. ASIN -> 映射表 -> MSKU。
4. 映射成功后进入 `fba运费`。
5. 映射失败后按 Row Resolution 的最终未解决条件进入费用池 Sheet。

### 2.4 Amazon Fees

常见类型：

- Coupon Performance Based Fee。
- Vine Enrollment Fee。
- Deal Participation / Performance Fee。
- Transparency Charges。
- Adjustment-Other。

处理步骤：

1. 执行 Row Resolution 全流程。
2. 按费用语义确定利润列：
   - Coupon / Vine：归入 `广告费合计`。
   - Deal：归入 `秒杀推广费`。
   - Transparency Charges、Adjustment-Other：归入 `其他费用`。
3. 查找是否存在 SKU 级 Coupon / Vine / Deal 等明细。
4. 有明确 MSKU 或可执行分摊依据时，按对应费用规则处理 MSKU 明细，不写入店铺维度。
5. 缺少 SKU 级明细时，只保留店铺维度对应列，用户可见状态写“缺少分摊明细，已计入店铺维度”。

## 3. 锚定归因与分摊算法

本节处理两类不同场景：

| 场景 | 含义 | 示例 |
|---|---|---|
| 专属明细归因 | 明细文件可直接提供 SKU/FNSKU/ASIN/MSKU 和费用金额或数量 | 移除费、入库配置费、退货处理费、低库存水平费用 |
| 锚定明细比例分摊 | 交易报告给出费用总额，明细文件给出 MSKU 级金额或数量比例，且二者已证明属于同一费用集合 | 月度仓储费有明细时、广告费有明细时；长期/超龄仓储费仅在 linkage 通过时适用 |
| 店铺维度归结 | 交易报告 anchor 属于店铺整体经营消耗，但缺少可靠明细、可靠分摊依据，或用户明确要求不分摊，只在店铺维度展示 | FBA 仓储费、广告费、秒杀推广费、其他费用；用户明确不分摊的订阅费 |
| 经营规则分摊 | 没有 SKU 级专属明细，但业务规则要求分摊到 MSKU，且不保留店铺维度 | Subscription |

适用项目：

- 广告费，有可靠 SP 广告明细时只分摊到 MSKU；无明细或无法可靠映射时只计入店铺维度。
- 月度仓储费，有月度仓储明细且 linkage 通过时只分摊到 MSKU；无明细或 linkage 不足时只计入店铺维度。
- 长期仓储费，linkage 通过时只分摊到 MSKU；无明细或 linkage 不足时只计入店铺维度。
- 超龄库存费，linkage 通过时只分摊到 MSKU；无明细或 linkage 不足时只计入店铺维度。
- 移除费，有移除明细且可映射时只分摊到 MSKU；无明细时只计入店铺维度。
- 入库配置费，归入 FBA 仓储大类，有明细且可映射时只分摊到 MSKU；无明细时只计入店铺维度。
- 退货处理费。
- 低库存水平费用。
- 秒杀推广费，有明细且可映射时只分摊到 MSKU；无明细时只计入店铺维度。
- 其他费用，有明细或可靠归因时只分摊到 MSKU；无法可靠归因时只计入店铺维度。
- 订阅费，默认按销量或销售额占比分摊到 MSKU，不计入店铺维度；用户明确不分摊时才计入店铺维度。

分摊记录字段：

| 字段 | 说明 |
|---|---|
| `fee_pool_id` | 费用池标识 |
| `anchor_total` | transaction 锚定总额 |
| `anchor_source_row_ids` | 主交易报告费用行 |
| `linkage_evidence` | 主交易报告 anchor 与辅助明细属于同一费用集合的证据 |
| `basis_source` | 分摊明细来源 |
| `basis_total` | 分摊基准合计 |
| `msku_basis` | MSKU 级基准 |
| `allocated_amount` | MSKU 分摊金额 |
| `unresolved_anchor_amount` | 主交易报告中无法关联到 MSKU 的金额 |
| `residual` | 尾差 |
| `residual_action` | 尾差处理 |

### 3.1 专属明细归因

当明细文件已经提供 MSKU，或提供可映射到 MSKU 的 FNSKU/ASIN/SKU 时：

1. 读取主交易报告费用行，确定 `anchor_total` 和 `anchor_source_row_ids`。
2. 读取候选辅助明细行。
3. 证明候选辅助明细与主交易报告 anchor 属于同一费用集合。
4. 用 `sku映射表.xlsx` 将 FNSKU/ASIN/SKU 映射到 MSKU。
5. 将已关联且已映射的明细金额或数量归属到 MSKU。
6. 与主交易报告 anchor_total 对比。
7. 若需要校准，只在已证明同一费用集合内用明细金额或数量占比重新分配 anchor_total。

如果第 3 步无法证明关联：

```text
unresolved_anchor_amount = anchor_total
allocated_amount = 0
resolved_status = missing_required_evidence 或 unresolved_with_reason
```

此时辅助明细中的 MSKU 不进入利润统计 Sheet。
若该状态进入正式 workbook/csv 的状态列，`missing_required_evidence` 展示为“缺少必要证据”，`unresolved_with_reason` 展示为“未解决，有原因”。

输出：

```text
msku_detail_amount
msku_basis
anchor_total
linkage_evidence
allocated_amount
unresolved_anchor_amount
residual
```

### 3.2 锚定明细比例分摊

当交易报告是总额、明细文件是比例来源时：

前置条件：

- 交易报告存在明确 anchor_total。
- 明细文件已证明与该 anchor_total 属于同一费用集合。
- 明细中的基准行已映射到 MSKU，或未映射部分已作为 unresolved_detail 披露。

不满足前置条件时，不得执行以下分摊公式，交易报告金额进入费用池 Sheet。

```text
allocated_amount = anchor_total * (msku_basis / basis_total)
```

其中：

- `anchor_total` 来自主交易报告。
- `msku_basis` 来自专属明细文件中已映射到该 MSKU 的金额、数量或费用基准。
- `basis_total` 是全部可用明细基准合计。

尾差：

```text
residual = anchor_total - SUM(allocated_amount)
```

处理动作：

- 尾差只能处理已证明同一费用集合内的 rounding/residual。
- 不能用尾差处理无关联金额、缺失明细金额或辅助明细与交易报告对不上账的金额。
- `|residual| <= 0.10`：归入该费用池金额绝对值最大的 MSKU。
- `|residual| > 0.10`：按分摊比例迭代分配到多个 MSKU。
- 调整后重新校验 `SUM(allocated_amount) = anchor_total`。
- 对长期仓储费/超龄库存费，明细金额与 anchor 金额不一致时不得自动进入本尾差公式；必须先证明是同一费用集合内的 rounding、期间口径或 Amazon 明确口径差异，否则整条未关联 anchor 进入 unresolved。

### 3.3 Subscription 默认分摊

Subscription 当前没有 SKU 级专属明细，但属于可按经营规则分摊的店铺固定消耗。用户未明确要求不分摊时，默认按有交易 MSKU 的销售金额或销量占比分摊，只写入 MSKU 明细，不保留店铺维度：

```text
subscription_allocation =
  subscription_anchor_total * (msku_sales_amount / total_sales_amount_of_trading_mskus)

利润统计Sheet.MSKU明细.订阅费 += subscription_allocation
利润统计Sheet.店铺维度.订阅费 += 0
```

约束：

- 分母只包含有交易记录的 MSKU 销售金额。
- 零交易但只有费用分摊的 MSKU 不参与 Subscription 分摊。
- 分摊后进入 `订阅费` 列；如果最终模板没有独立 `订阅费` 列，可并入 `其他费用`，但必须在 `数据溯源` 和 evidence 中说明。
- 用户明确给出其他分摊规则时，按用户规则分摊到 MSKU/SKU，仍不保留店铺维度。
- 用户明确要求不分摊时，整笔订阅费只写入店铺维度，MSKU 明细订阅费为 0。
- 读回校验时校验同一 subscription anchor 只落在 MSKU 明细或店铺维度其中一处，不把两者重复相加。

验证：

```text
默认分摊时：
  SUM(利润统计Sheet.MSKU明细.订阅费) = subscription_anchor_total
  利润统计Sheet.店铺维度.订阅费 = 0

用户明确不分摊时：
  SUM(利润统计Sheet.MSKU明细.订阅费) = 0
  利润统计Sheet.店铺维度.订阅费 = subscription_anchor_total
```
