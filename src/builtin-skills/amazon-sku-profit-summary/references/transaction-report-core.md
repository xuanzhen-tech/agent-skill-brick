# Transaction Report Core

主交易报告是 SKU 利润核算的唯一金额真相。

辅助文件不得反向新增或修改主交易报告归因。本文件定义源行归因总协议、输入文件角色、行状态闭环和金额 anchor。

空白 SKU 证据查找顺序固定为：`type -> description -> order id -> 映射表/辅助文件`。

## 0. 核心源行归因协议

本 Skill 的第一原则是：以主交易报告的每一条源行为唯一处理对象，按固定顺序寻找直接 MSKU 证据。

固定顺序：

```text
主交易报告源行
  -> SKU 列为正常 SKU/MSKU：直接按公式归因到该 MSKU
  -> SKU 列为 FNSKU：用 FNSKU/ASIN/SKU 映射证据归因到 MSKU
  -> SKU 列为空：按 type -> description -> order id -> 映射表/辅助文件寻找直接 MSKU 证据
  -> 证据成立：归因或按已证明费用池规则分摊
  -> 证据不成立：内部记录 unresolved / missing_required_evidence / missing_required_linkage / mapping_conflict / excluded_with_reason；用户可见产物使用中文状态
```

执行边界：

- 主交易报告是老板实际到账和实际扣款的唯一金额真相。
- 辅助文件只能解释主交易报告源行，不能新增、拆分或重写主交易报告金额。
- 辅助文件中的 SKU/FNSKU/ASIN/MSKU 只有能与主交易报告源行建立直接、明确、可审计的关联时，才允许用于归因。
- anchor 与 detail 不一致时，只分配已证明关联的部分；未证明部分必须披露，不能当作尾差分摊。
- 每次脚本计算后，必须先校验公式、筛选条件、覆盖行数、金额符号、合计、未解决项尝试路径，再进入下一步。
- 每次脚本计算后必须从主交易报告源行反向交叉验证：应该处理的源行是否全部处理、不该处理的源行是否没有越界吸收、已归因金额是否能回到直接证据、未解决项是否真的找不到 MSKU。
- 未解决项必须证明已经按当前节点允许路径尝试完毕，而不是因为某个字段为空就直接放弃。
- 不得盲目猜测归因。MSKU、FNSKU、ASIN、SKU、order id 或费用池证据对不上就是对不上，必须标记为未解决、缺证据、缺关联或冲突。

优先级：

```text
关联证据 > 主交易报告金额锚定 > 金额闭合 > 报表好看
```

## 1. Skill 目标

本 Skill 负责把 Amazon transaction 风格交易数据转成可审计的 SKU/MSKU 利润口径。

核心任务：

- 识别每一行交易的归属对象：MSKU、费用池、排除项或未解决项。
- 将已归因交易的字段映射到利润表列。
- 将广告费、仓储费、长期仓储费、订阅费等费用池按已证明的交易报告 anchor、关联证据和业务规则归因或分摊到 MSKU。
- 生成或核对 `*SKU利润汇总表*.xlsx`。
- 保留所有无法自动归因或需要披露的交易行及原因。

## 2. 适用范围

使用本 Skill 的场景：

- 用户要求计算 Amazon SKU/MSKU 利润。
- 用户要求核对 SKU 利润表、毛利润、费用分摊、退款、广告费、仓储费或 FBA 费用。
- 用户提供的数据来自 Amazon 交易明细、Settlement、Transaction、广告、仓储、移除、库存或 SKU 映射类文件。
- 用户要求判断某些 FNSKU、ASIN、空白 SKU、异常费用如何归属到 MSKU。

协同边界：

- 库存分类账数量核算、库存动作、期初期末闭环由 `amazon-inventory-ledger-summary` 负责。
- 已有利润结果后的经营诊断、预警、老板报表解读由 `amazon-sku-profit-health-monitor` 负责。
- workflow 节点完成前后的强制校验由 `amazon-sku-profit-reconciliation` 负责。

## 3. 数据输入

### 3.1 必需输入

- Amazon transaction 风格交易明细。
- 当前 workspace 中用户提供的相关文件。
- workflow 中运行时，读取前序节点正式报告。

### 3.1.1 输入范围不确定

当 workspace 中存在多份可能相关的主交易报告、映射表或辅助明细，且无法通过文件名、期间、账号、站点、币种、表头或金额 anchor 证明哪一份属于本次任务时，必须调用 `require_more_information` 向用户确认。

确认前只输出候选文件、推断角色和不确定点；不得自行选择其中一份进入正式利润核算，也不得把其他店铺、其他期间、历史样例或测试数据混入本次任务。

### 3.2 实际 Amazon 后台导出辅助文件

以下清单基于真实亚马逊后台的导出文件整理。文件名可变，但字段含义相同即可识别。

#### 3.2.1 交易目录

| 真实文件示例 | 文件角色 | 典型用途 | 关键字段 |
|---|---|---|---|
| `交易报告.csv` | 主交易报告 | 利润核算锚定数据；识别 `type`、`sku`、金额字段、费用字段、空白 SKU 行 | `date/time`, `settlement id`, `type`, `order id`, `sku`, `description`, `quantity`, `product sales`, `shipping credits`, `promotional rebates`, `selling fees`, `fba fees`, `other transaction fees`, `other`, `total` |
| `sku映射表.xlsx` | 映射表 | FNSKU、ASIN、SKU 到 MSKU 的核心映射依据 | `MSKU`, `FNSKU`, `ASIN`, `SKU` |
| `所有订单.txt` | All Orders / 所有订单 | 通过 Amazon order id 反查 `sku`、`asin`、订单状态和数量；用于空白 SKU、description 线索不足时补充归因 | `amazon-order-id`, `sku`, `asin`, `order-status`, `quantity`, `item-price`, `shipping-price`, `item-promotion-discount` |
| `SP-AD.xlsx` | SP 广告报表 | 广告费分摊比例来源；按广告 SKU、ASIN、campaign 或商品维度归属广告花费 | 表头可能不在首行，需先定位含广告指标的真实表头；常见字段包括广告 SKU/ASIN、campaign、spend/花费 |
| `汇总.pdf` / `Settlement report` | Settlement 汇总或结算报告 | 与主交易报告总额交叉核对；提供结算期间、结算/到账币种和可回勾的结算汇率；不作为 SKU 级分摊明细 | 汇总金额、结算期间、账户信息、结算币种、到账币种、币种对、结算汇率 |

#### 3.2.2 库存目录中的利润归因辅助文件

这些文件虽然位于 `库存` 目录，但可辅助利润归因、费用池分摊或费用池 Sheet 未解决原因说明。

| 真实文件示例 | 文件角色 | 典型用途 | 关键字段 |
|---|---|---|---|
| `月度仓储费.csv` | 月度仓储费明细 | `FBA Inventory Fee / FBA storage fee` 的分摊比例来源 | `asin`, `fnsku`, `product_name`, `average_quantity_on_hand`, `estimated_monthly_storage_fee`, `month_of_charge` |
| `超龄库存附加费报告.csv` | 超龄库存附加费 / 长期仓储费明细 | `FBA Long-Term Storage Fee`、超龄库存附加费的候选辅助依据；必须先证明与交易报告 anchor 关联后才能归因或分摊 | `sku`, `fnsku`, `asin`, `qty-charged`, `amount-charged`, `surcharge-age-tier`, `rate-surcharge` |
| `移除订单详情.csv` | Removal Order Detail | 通过 removal order id 或 order id 查 `sku`、`fnsku`，用于移除费归因 | `order-id`, `sku`, `fnsku`, `disposition`, `requested-quantity`, `shipped-quantity`, `removal-fee` |
| `移除货件详情.csv` | Removal Shipment Detail | 与移除订单详情互证；通过 order id 查 `sku`、`fnsku` 和发货数量 | `order-id`, `shipment-date`, `sku`, `fnsku`, `shipped-quantity`, `tracking-number` |
| `亚马逊物流入库配置服务费.csv` | FBA Inbound Placement Service Fee Detail | `Service Fee / FBA Inbound Placement Service Fee` 的归因或分摊依据 | `入库计划编号`, `亚马逊物流货件编号`, `FNSKU`, `ASIN`, `实际接收数量`, `亚马逊物流入库配置服务费用总计`, `总费用` |
| `退货处理费.csv` | Customer Returns Fee Detail | `FBA Transaction fees` 中退货处理费的 ASIN/FNSKU 归因依据 | `asin`, `fnsku`, `sku_returned_units_charged`, `sku_fee_per_unit`, `sku_returns_fee`, `month_of_charge` |
| `低库存水平费用报告.csv` | Low Inventory Level Fee Detail | 低库存水平费归因依据；可通过 order id、ASIN、FNSKU、SKU 定位 MSKU | `Order ID`, `Parent ASIN`, `ASIN`, `FNSKU`, `SKU`, `Quantity`, `Fulfillment fee amount`, `Low-inventory-level fee amount` |
| `赔偿数量.csv` | Reimbursements / 赔偿数量 | 亚马逊赔偿、赔偿冲回和库存赔偿数量的归因证据 | `reimbursement-id`, `amazon-order-id`, `reason`, `sku`, `fnsku`, `asin`, `amount-total`, `quantity-reimbursed-total` |
| `亚马逊物流买家退货.csv` | FBA Customer Returns | 退货行的 order id、SKU、ASIN、FNSKU、库存属性和原因证据 | `return-date`, `order-id`, `sku`, `asin`, `fnsku`, `quantity`, `detailed-disposition`, `reason`, `status` |
| `已完成订单销售.csv` | 已完成订单销售 | 通过订单号反查卖家 SKU、FNSKU、ASIN、商品金额、运费和礼品金额 | `亚马逊订单编号`, `卖家 SKU`, `FNSKU`, `ASIN`, `数量`, `商品金额`, `运费`, `礼品金额` |
| `亚马逊配送货件.csv` | Amazon Fulfilled Shipments | 通过订单号、卖家 SKU、商品价格、运费、促销折扣、货件号辅助回勾订单 | `亚马逊订单编号`, `货件编号`, `卖家 SKU`, `已发货数量`, `商品价格`, `运费`, `商品促销折扣`, `货件促销折扣`, `运营中心` |
| `亚马逊配送货件-汇出税.csv` | Amazon Fulfilled Shipments with Tax | 与配送货件类似，包含税费口径；用于订单回勾和 Tax 披露，不进入利润字段 | `亚马逊订单编号`, `卖家 SKU`, `商品税`, `运费税`, `礼品包装税费`, `商品促销折扣`, `货件促销折扣` |
| `换货.csv` | Replacements / 换货 | 通过 replacement order id 和 original order id 识别换货关系 | `shipment-date`, `sku`, `asin`, `quantity`, `replacement-amazon-order-id`, `original-amazon-order-id` |
| `库存分类账-一览.csv` | Inventory Ledger | 辅助识别 FNSKU、ASIN、MSKU 关系、库存属性和异常；库存数量闭环由库存 Skill 负责 | `Date`, `FNSKU`, `ASIN`, `MSKU`, `Disposition`, `Customer Shipments`, `Customer Returns`, `Unknown Events`, `Location` |

#### 3.2.3 使用原则

- 主交易报告是利润核算主账，决定是否计入、计入金额、费用池类型和源行闭环。
- 主交易报告代表商家实际到账和实际被 Amazon 扣款的钱，是 SKU 利润核算的唯一金额真相。
- 本 Skill 的核心任务是解释主交易报告的每一条有效数据行，不是汇总所有 Amazon 辅助文件。
- 辅助文件只用于帮助主交易报告行寻找 MSKU、比例、关联证据、冲突证据或未解决原因。
- “当前 workspace 的相关辅助文件”仅指已确认属于本次任务范围，或能用期间、账号、站点、费用类型、order id、FNSKU、ASIN、SKU、金额 anchor 等证据证明相关的文件。多个候选无法裁定时，先调用 `require_more_information`；不要为了穷举而把其他店铺、其他期间、历史样例或测试数据纳入归因。
- 辅助文件不代表商家最终到账或扣款金额，只能解释交易报告里的钱为什么发生、可能属于谁、哪里存在差异。
- 辅助文件不得新增主交易报告不存在的利润金额，不得改写主交易报告金额，不得在主交易报告行缺少可审计关联时反向创造 MSKU 归属。
- `sku映射表.xlsx` 是 FNSKU/ASIN/SKU 到 MSKU 的核心映射依据。
- `所有订单`、`已完成订单销售`、`亚马逊配送货件` 可通过 order id 反查 SKU/ASIN/FNSKU，不能只看主交易报告中的空白 SKU 就直接判定未归因。
- `移除订单详情` 和 `移除货件详情` 必须一起用于移除费归因，能互证时优先使用。
- `月度仓储费`、`超龄库存附加费报告`、`退货处理费`、`低库存水平费用报告`、`亚马逊物流入库配置服务费` 是具体费用池的候选辅助明细；只有证明与交易报告 anchor 关联后，才能用于分摊或归因。
- `库存分类账` 可辅助识别映射线索和经营风险，不替代费用金额分摊依据。
- `SP-AD` 这类 Excel 可能存在说明行或多行表头，读取前先定位真实表头行。

### 3.3 交易报告主账原则

交易报告金额真相：

```text
老板实际收了多少钱、实际被 Amazon 扣了多少钱，以主交易报告为准。
SKU 利润表只能吸收主交易报告中的收入和费用金额。
辅助明细表不是入账或扣款真相，只能解释主交易报告金额。
```

逐行处理主交易报告。每一条主交易报告有效数据行只能进入一个最终状态：

| 内部状态码 | 用户可见状态 | 含义 |
|---|---|---|
| `processed` | 已处理 | 已直接归属到 MSKU 并进入利润字段 |
| `allocated` | 已分摊 | 已证明可按费用池规则归属或分摊到 MSKU |
| `excluded_with_reason` | 已排除，有原因 | 按利润口径明确不吸收，但保留原因 |
| `unresolved_with_reason` | 未解决，有原因 | 已尝试所有可用路径，仍无法建立 MSKU 关联 |
| `mapping_conflict` | 映射冲突 | 多个证据路径互相冲突，不能自动裁决 |
| `missing_required_evidence` | 缺少必要证据 | 当前费用行需要特定辅助证据，但证据缺失或无法证明关联 |
| `missing_required_linkage` | 缺少必要关联 | 辅助明细存在，但缺少与主交易报告费用行的可审计关联 |

辅助文件使用边界：

- 辅助文件中存在某个 SKU、FNSKU、ASIN 或金额，不代表主交易报告中的空白 SKU 费用可以归属到该 MSKU。
- 辅助文件金额大于、小于或不同于主交易报告金额时，以主交易报告金额为准；差异进入告警或 reconciliation evidence。
- 必须先证明主交易报告行与辅助明细属于同一费用集合，才能使用辅助明细归因或分摊。
- 可审计关联链路可以来自 `order id`、`shipment id`、`transaction id`、`FNSKU`、`ASIN`、`SKU`、期间、账户、费用类型和金额闭环等组合证据。
- 若主交易报告行无法与辅助明细建立关联，主交易报告金额进入费用池 Sheet 告警；辅助明细本身不进入利润统计 Sheet。
- 若辅助文件与主交易报告冲突，以主交易报告为金额权威；冲突必须披露。
- 辅助文件有、但主交易报告没有对应记录的费用，不进入 SKU 利润表。

## 5. 全局不变量

### 5.1 行状态闭环

每一条主交易报告有效数据行必须进入且只进入一个行状态。辅助文件行不参与主账行状态闭环，只作为证据、映射、比例或冲突来源。

| 内部状态码 | 用户可见状态 | 说明 |
|---|---|---|
| `processed` | 已处理 | 已进入利润字段或费用分摊 |
| `allocated` | 已分摊 | 已作为费用池分摊到 MSKU |
| `excluded_with_reason` | 已排除，有原因 | 明确不进入利润列，但保留披露 |
| `unresolved_with_reason` | 未解决，有原因 | 所有可用路径均失败，当前无法归因 |
| `mapping_conflict` | 映射冲突 | 证据冲突，等待人工确认 |
| `missing_required_evidence` | 缺少必要证据 | 需要的辅助证据缺失 |
| `missing_required_linkage` | 缺少必要关联 | 辅助明细存在但无法证明与交易报告行关联 |
| `not_applicable` | 不适用 | 当前节点不处理，交由其他节点 |

内部证据、节点 report、脚本校验可以继续使用内部状态码；正式 xlsx/csv 中名为 `状态`、`最终状态`、`处理状态`、`审计状态` 的用户可见列必须写中文状态，不直接写英文枚举。

最终校验：

```text
processed + allocated + excluded_with_reason + unresolved_with_reason + mapping_conflict + missing_required_evidence + missing_required_linkage + not_applicable = transaction_report_source_rows
```

### 5.2 金额锚定

需要归因或分摊的费用池必须使用主交易报告中的费用行作为 `anchor_total`。

`anchor_total` 是商家实际到账或实际扣款金额。辅助明细的金额只能作为解释、比例或冲突证据；无论辅助明细金额多于还是少于 `anchor_total`，都不得替代主交易报告金额。

总账闭环以主交易报告为准。除非存在明确的数据错误、异常、排除依据或已披露的未解决原因，属于利润口径的交易报告金额必须全部进入 SKU/MSKU 明细、店铺维度、费用池、未计入利润项目或行级 evidence。最终总毛利必须回勾：

```text
总毛利 = 交易报告全部利润口径收入 - 交易报告全部利润口径支出
```

辅助明细只能在满足以下前提后用于决定比例和归属：

- `anchor_total` 来自主交易报告。
- 辅助明细与该交易报告费用池属于同一期间、同一账户、同一费用类型。
- 辅助明细能通过标识链路或金额闭环证明与该 `anchor_total` 有关。
- 关联证据已写入 `fee_allocations.linkage_evidence`。

禁止行为：

- 不得用辅助明细新增主交易报告中不存在的费用。
- 不得用辅助明细修改主交易报告金额。
- 不得因为辅助明细显示某 MSKU 有费用，就把无法关联的主交易报告扣款写到该 MSKU。
- 不得在交易报告行没有可审计关联时，把辅助明细中的 MSKU 反向写入利润统计 Sheet。
- 不得把无关联金额作为尾差分摊。

示例判断：

```text
主交易报告显示实际扣款 1.08。
辅助明细显示某 MSKU 金额 0.27。
如果无法证明 0.27 与这条 1.08 属于同一费用集合：
  - 1.08 进入费用池 Sheet 告警
  - 0.27 只作为参考线索或差异证据
  - 不得把 0.27 或 1.08 写入该 MSKU
```

分摊后校验：

```text
SUM(msku_allocated_amount) + unresolved_anchor_amount = anchor_total
```

### 5.3 币种与汇率协议

第一步，保留主交易报告原始金额和原始币种。主交易报告仍是到账和扣款金额真相；不得用汇率换算改写源行金额，也不得用折算金额替代 `anchor_total`。

第二步，建立 `currency_profile`。至少记录主交易报告币种、Settlement report 结算/到账币种、采购成本币种、头程费用币种、广告或其他辅助文件币种、目标展示币种。

第三步，确定 `target_currency`。用户已指定时按用户指定；未指定时优先使用 Settlement report 的结算/到账币种；仍无法确定时调用 `require_more_information`。

第四步，按以下优先级选择汇率：

1. Settlement report 中可回勾当前账号、期间和币种对的结算汇率。
2. 用户或财务人员明确提供并确认的汇率。
3. 通过 `exchange_rate_lookup`（汇率查询 / Rate Exchange 工具）取得的外部市场参考汇率；只可作为参考或降级测算，不能自动等同于财务记账汇率。

第五步，涉及采购成本、头程费用、广告费、Amazon 交易金额或其他辅助文件跨币种时，必须形成 `currency_conversion_evidence`，至少记录：

```text
source_currency
target_currency
original_amount
converted_amount
exchange_rate
rate_date
rate_source
finance_confirmed
usage_scope
```

第六步，执行汇率门禁：

- 有 Settlement report 且存在适用结算汇率时，必须优先使用；未使用时必须在 evidence 中说明原因。
- 用户或财务人员已提供汇率时，记录确认人、日期和适用范围。
- 用户未提供汇率且 Settlement report 不含适用汇率时，调用 `exchange_rate_lookup`（汇率查询 / Rate Exchange 工具）查询市场参考汇率，或要求用户/财务人员确认；不得自行估算。
- 汇率缺失、查询失败或未确认且影响重大时，相关金额不得进入正式利润统计 Sheet 结论；应写入费用池 Sheet、节点报告或使用 `workflow_block_current_node` 阻塞。
- 汇率换算只能产生披露或统一展示口径，不能改变主交易报告源行闭环、金额 anchor、归因证据或费用池分摊依据。

## 6. 执行顺序

按以下顺序执行，不跳过前置步骤：

1. 建立源数据画像：文件、sheet、表头、字段、行数、type/description 分布。
2. 以主交易报告为主账，遍历每一条有效数据行。
3. 执行行级归因：为每一条主交易报告行确定 MSKU、费用池、排除项或未解决状态。
4. 执行字段级公式：对已归因行，将字段映射到利润表列。
5. 执行费用池分摊：仅对已证明可关联的主交易报告费用行生成 MSKU 分摊结果。
6. 合并 MSKU 集合：交易结果、FNSKU 映射结果、费用分摊结果、成本文件结果取并集。
7. 写入 workbook：复制模板，写入利润统计 Sheet、费用池 Sheet、未计入利润项目 Sheet 和数据溯源 Sheet。
8. 读回校验：文件结构、表头、合计行、逐列金额、符号口径、毛利润公式、费用池 Sheet 披露。

## 7. Row Resolution：行级归因

### 7.1 目标

行级归因只回答一个问题：

```text
这行交易最终属于哪个 MSKU、哪个费用池、哪个排除状态，或为什么当前无法解决？
```

行级归因的输出字段：

| 字段 | 说明 |
|---|---|
| `source_row_id` | 源数据行号或稳定标识 |
| `resolved_status` | 内部行状态码 |
| `resolved_msku` | 已归属 MSKU，可为空 |
| `resolved_fee_pool` | 费用池，可为空 |
| `resolution_path` | 命中的归因路径 |
| `attempted_paths` | 已尝试路径 |
| `missing_evidence` | 缺失证据 |
| `reason` | 状态原因 |

### 7.2 归因路径

对每一行按顺序尝试以下路径。

#### Step 1：检查 SKU 列

检查当前行 `sku` 是否是：

- 正常 MSKU。
- FNSKU。
- ASIN。
- 可在映射表中查到的 SKU 或历史 SKU。

交易报告 SKU 原值保留原则：

- 主交易报告 `sku` 非空，且不像 FNSKU、ASIN、平台编码、历史别名或辅助文件标识时，默认该 `sku` 本身就是利润表 MSKU。
- 映射表查不到该 `sku` 不是错误；保留原 `sku` 作为独立 MSKU。
- 映射表不得把主交易报告中的 seller SKU 反向规范化、合并或替换为另一个 MSKU。
- 只有存在明确、可审计、用户确认或映射表显式声明的别名关系时，才允许把主交易报告 `sku` 映射为另一个 MSKU。
- 若别名关系不确定，保留原 `sku`，并把冲突或疑点写入 evidence；不得静默合并。

处理动作：

| 识别结果 | 动作 |
|---|---|
| 正常 MSKU | `resolved_status = processed`，进入字段公式 |
| FNSKU | 查 `FNSKU -> MSKU` |
| ASIN | 查 `ASIN -> MSKU` |
| 其他非空 seller SKU | 默认保留原 SKU 作为 MSKU；仅在明确别名证据存在时查 `SKU -> MSKU` |

#### Step 2：检查独立标识字段

若源数据存在以下字段，逐一检查：

```text
fnsku, FNSKU, asin, ASIN, msku, MSKU, seller_sku, merchant_sku, sku
```

处理动作：

- MSKU 命中：直接归属。
- FNSKU 命中：查映射表归属到 MSKU。
- ASIN 命中：查映射表归属到 MSKU。
- seller_sku / merchant_sku 命中：默认按原值作为 MSKU；仅在明确别名证据存在时映射到其他 MSKU。

#### Step 3：解析 description

从 `description` 中提取：

```text
MSKU, FNSKU, ASIN, SKU, order id, removal order id, shipment id, reference id
```

常见模式：

```text
for ASIN: XXXXXXXXXX
ASIN XXXXXXXXXX
FNSKU X00...
SKU: ...
MSKU: ...
Order ID: ...
Removal Order: ...
Shipment ID: ...
```

处理动作：

- 提取 MSKU：直接归属。
- 提取 FNSKU：查映射表归属。
- 提取 ASIN：查映射表归属。
- 提取 SKU：查映射表归属。
- 提取 order/shipment/removal/reference id：进入 Step 4。

#### Step 4：使用 order_id / reference id 查辅助文件

当当前行存在以下任一标识时，使用当前 workspace 的相关辅助文件反查：

```text
order_id, order id, reference_id, transaction_id, shipment_id, removal_order_id
```

如果同类辅助文件存在多个候选，且不能证明与当前主交易报告属于同一任务范围，先调用 `require_more_information`。确认前不要把候选文件用于正式 MSKU 归因或费用分摊。

可使用的辅助文件：

| 文件类型 | 查找目标 |
|---|---|
| All Orders / 订单报告 | order id -> sku / asin / merchant-sku |
| Transaction Detail / Settlement Detail | order id / transaction id -> 同订单其他 SKU 行 |
| Removal Order Detail | removal order id / order id -> FNSKU / SKU / ASIN |
| Removal Shipment Detail | shipment id / order id -> FNSKU / SKU / ASIN |
| Inbound Placement Fee Detail | shipment id / order id -> SKU / FNSKU / ASIN |
| SKU 映射表 | FNSKU / ASIN / SKU -> MSKU |

处理动作：

- 找到 MSKU：归属到 MSKU。
- 找到 FNSKU / ASIN / SKU：继续查映射表。
- 找到多个 MSKU：进入 `mapping_conflict`。
- 相关文件不存在：记录 `missing_evidence`，继续 Step 5。

#### Step 5：判断专属费用明细或费用池

当交易行本身无法直接归属单个 MSKU，但 `type + description` 命中结构化费用规则时，先进入专属费用明细归因流程。

这一步不是“定位不上就粗暴分摊”，也不是“辅助明细里出现 MSKU 就反向归属”。仓储费、长期仓储费、移除费、广告费、入库配置费通常都有 Amazon 后台导出的明细文件，但这些明细只能用于解释主交易报告中的费用行。

进入分摊或归因前，必须先完成关联判断：

```text
主交易报告费用行
  -> type/description/period/account/amount anchor
  -> 辅助明细同一费用集合证据
  -> FNSKU/ASIN/SKU/order_id/shipment_id 等标识链路
  -> sku映射表
  -> MSKU
```

如果这条链路断裂，主交易报告金额进入费用池 Sheet 告警；辅助明细中的 SKU/FNSKU/ASIN/MSKU 不得反向写入利润统计 Sheet。

订阅费、FBA 仓储费、广告费、秒杀推广费、其他费用不允许双轨展示；同一交易报告 anchor 只能进入 SKU/MSKU 明细或店铺维度其中一处。有可靠明细或分摊依据时，费用只生成 SKU/MSKU 分摊结果；没有可靠明细或分摊依据时，才写入店铺维度。订阅费默认按销售额或销量等经营规则分摊到 MSKU 明细，不保留店铺维度；用户明确要求不分摊时才写入店铺维度。

费用处理模式：

| type | description | 处理模式 | 必要明细 | 输出列 |
|---|---|---|---|---|
| FBA Inventory Fee | FBA storage fee | 有月度仓储明细时先证明交易报告 anchor 与明细同一费用集合，通过后只写入 MSKU/SKU 分摊结果，尾差仅限已证明集合内的 rounding/residual；无明细时只保留店铺维度 | 月度仓储费明细 + linkage evidence；无明细时记录“缺少分摊明细，已计入店铺维度” | fba仓租 |
| FBA Inventory Fee | FBA Long-Term Storage Fee | 有长期/超龄明细且 linkage 通过时只分摊到 MSKU；无法证明 linkage 时只保留店铺维度，不得用明细中的 MSKU 部分吸收 | 超龄库存附加费报告或长期仓储费明细 + linkage evidence；缺明细/缺 linkage 时记录“已计入店铺维度” | fba仓租 |
| FBA Inventory Fee | FBA Removal Order: Return Fee | order id 对应移除订单/货件明细后只分摊到 MSKU；无明细时只保留店铺维度 | 移除订单详情、移除货件详情；缺明细时记录“缺少分摊明细，已计入店铺维度” | fba仓租 |
| FBA Inventory Fee | 空白或未知 | 交易报告 anchor 仅写入店铺维度 fba仓储；费用池 Sheet 说明 description 为空或无法分类，需业务确认细分项 | 已尝试全部可用路径；业务确认细分项 | fba仓租 |
| Service Fee | Cost of Advertising | 有 SP 广告明细时只用明细归因/尾差按比例分摊到 MSKU；无明细时只保留店铺维度 | SP 广告明细；无明细时记录“缺少分摊明细，已计入店铺维度” | 广告费 |
| Service Fee | FBA Inbound Placement Service Fee | 属于 FBA 仓储大类；有货件/入库计划/FNSKU/ASIN 明细时只分摊到 MSKU；无明细时只保留店铺维度 | 入库配置服务费明细；缺明细时记录“缺少分摊明细，已计入店铺维度” | fba仓租 |
| Service Fee | Subscription | 默认按有交易 MSKU 销售金额或销量分摊到 MSKU 明细；用户明确要求不分摊时才计入店铺维度 | 正常 MSKU 销售金额或销量；或用户明确规则 | 订阅费 / 其他费用 |
| Amazon Fees | Coupon / Vine | 有 SKU 级 Coupon/Vine 明细时只分摊到 MSKU；缺明细时写入店铺维度广告费合计 | Coupon/Vine 明细；缺明细时记录“缺少分摊明细，已计入店铺维度” | 广告费 |
| Amazon Fees | Deal | 有 Deal 明细时只分摊到 MSKU；缺明细时写入店铺维度秒杀推广费 | Deal 明细；缺明细时记录“缺少分摊明细，已计入店铺维度” | 秒杀推广费 |
| Amazon Fees / Adjustment | Transparency Charges / Adjustment-Other | 交易报告 anchor 写入店铺维度其他费用；费用池 Sheet 说明字段语义和业务确认情况 | 业务语义确认 | 其他费用 |

处理动作：

- 有专属明细文件：先证明主交易报告费用行与明细文件属于同一费用集合，再用明细文件定位 MSKU 或形成 MSKU 级分摊基准。
- 明细文件总额与交易报告 anchor_total 不一致：只有差异可解释为同一费用集合内的 rounding、期间差异或已披露口径差异时，才以交易报告 anchor_total 为准进行校准。
- 明细文件存在但不能证明与当前交易报告费用行关联：交易报告金额标记为 `missing_required_evidence` 或 `unresolved_with_reason`，进入费用池 Sheet；不得用明细文件中的已映射 MSKU 吸收该金额。
- 明细文件存在且已证明关联，但部分明细无法映射 MSKU：已映射部分继续归因，未映射明细记录为 `unresolved_with_reason`。
- 必要明细文件缺失且无店铺维度兜底口径：`resolved_status = missing_required_evidence`，记录缺失文件、受影响 type/description、金额和建议下一步。
- 对 FBA 仓储费、广告费、秒杀推广费、其他费用，缺少 MSKU/SKU 分摊明细或可靠依据时，交易报告 anchor 写入店铺维度并记录“缺少分摊明细，已计入店铺维度”，不默认标记缺少必要证据；有可靠明细或依据时只写入 MSKU/SKU 分摊结果。
- Subscription：默认 `resolved_status = allocated`，按有交易 MSKU 销售金额或销量占比分摊，不计入店铺维度；用户明确不分摊时才写入店铺维度。

#### Step 6：判断明确排除

以下行进入 `excluded_with_reason`：

| type 或字段 | 原因 |
|---|---|
| Transfer | 平台结算转账，不进入 SKU 利润字段 |
| Order_Retrocharge | 税费或追溯调整，当前利润口径不吸收 |
| Tax 字段 | 代收代缴或税费字段，利润口径排除 |

#### Step 7：最终未解决

只有满足以下条件后，才标记为 `unresolved_with_reason`：

- SKU 列未能识别正常 MSKU、FNSKU、ASIN 或可映射 SKU。
- 独立 FNSKU、ASIN、MSKU、seller_sku、merchant_sku 字段不可用或映射失败。
- description 未提取到可用 MSKU、FNSKU、ASIN、SKU 或相关 id，或提取后映射失败。
- order_id / reference id 不为空时，已尝试当前 workspace 中所有相关辅助文件。
- order_id / reference id 为空时，已记录该事实。
- 当前 `type + description` 没有可执行分摊规则，或缺少必须辅助文件。
- 当前行不是明确排除类行。

### 7.3 冲突处理

当多个路径指向不同 MSKU 时，状态为：

```text
mapping_conflict
```

记录：

- 命中的路径。
- 每条路径对应的 MSKU。
- 冲突金额。
- 需要人工确认的字段或文件。
