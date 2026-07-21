---
name: amazon-inventory-ledger-summary
displayChineseName: 亚马逊库存分类账汇总
description: "亚马逊库存分类账 / Inventory Ledger 数量核算与闭环汇总。仅在需要根据 Amazon 库存分类账生成 SKU/FNSKU/ASIN/MSKU/库存属性/店铺/仓库位置维度的库存数量事实、库存动作汇总、库存闭环校验、库存异常和后续经营分析输入时使用。不负责利润核算、费用分摊、采购成本估值、现金流预测或老板经营分析。"
---

# Amazon Inventory Ledger Summary

## 1. Skill 目标

本 Skill 是库存数量事实生成器。

它只回答一个问题：

```text
在指定期间内，每个 SKU 相关库存主体的期初库存、库存动作、期末库存是否可信、是否闭环、有哪些库存风险需要披露？
```

本 Skill 的输出应能被后续节点直接使用：

- `amazon-sku-profit-reconciliation` 用于验证库存汇总表是否可读、字段是否正确、闭环差异是否披露。
- `amazon-sku-profit-health-monitor` 用于分析库存周转、不可售库存、滞销、断货风险和现金流压力。

## 2. 适用范围

### 2.1 本 Skill 负责

- 识别 Amazon 库存分类账 / Inventory Ledger 文件。
- 读取字段、表头、有效数据行和期间。
- 标准化 `Date`、`Store`、`FNSKU`、`ASIN`、`MSKU`、`Disposition`、`Location`。
- 汇总库存动作数量。
- 保留 Amazon 源字段的正负号。
- 计算库存闭环差异。
- 披露库存标识缺失、映射冲突、负库存、非可售库存、未知动作和闭环差异。
- 生成库存汇总表、闭环校验表、异常与风险清单、位置明细和字段画像。

### 2.2 职责交接

| 内容 | 负责方 |
|---|---|
| 库存数量、库存动作、库存闭环 | 本 Skill |
| 利润字段、交易行归因、费用池分摊 | `amazon-sku-profit-summary` |
| 跨表一致性、workbook 读回、完成门禁 | `amazon-sku-profit-reconciliation` |
| SKU 经营判断、补货/清仓/停采/现金流建议 | `amazon-sku-profit-health-monitor` |

### 2.3 执行顺序

第一步，确认主输入是 Inventory Ledger，而不是仓储费、退货、赔偿或入库配置服务费等利润归因辅助文件。

第二步，读取并标准化库存期间、Store、FNSKU、ASIN、MSKU、Disposition、Location 和库存动作数量。

第三步，按固定粒度生成库存数量事实和闭环校验；不得在本 Skill 内计算利润、采购成本、费用分摊或现金流。

第四步，复制库存汇总模板生成正式 workbook，并读回校验。

## 3. 输入数据契约

### 3.1 主输入文件

主输入必须是 Amazon 库存分类账 / Inventory Ledger 文件。

常见文件名：

```text
库存分类账-一览*.csv
库存分类账*.csv
Inventory Ledger*.csv
Inventory Ledger*.xlsx
```

同一工作区可能存在仓储费、退货、赔偿、入库配置服务费等库存目录文件。那些文件可以服务利润归因或经营分析，但不是本 Skill 的主输入。库存数量闭环只以 Inventory Ledger 为准。

### 3.2 必需字段

| 源字段 | 含义 | 要求 |
|---|---|---|
| `Date` | 期间或日期 | 必需 |
| `FNSKU` | FBA 库存标识 | 必需 |
| `ASIN` | Amazon 商品标识 | 必需 |
| `MSKU` | 卖家 SKU | 必需 |
| `Title` | 商品名称 | 必需，但不作为默认分组主键 |
| `Disposition` | 库存属性 | 必需 |
| `Starting Warehouse Balance` | 期初库房余量 | 必需 |
| `In Transit Between Warehouses` | 库房间转运量 | 必需 |
| `Receipts` | 接收数量 | 必需 |
| `Customer Shipments` | 买家发货数量 | 必需 |
| `Customer Returns` | 买家退货数量 | 必需 |
| `Vendor Returns` | 供应商退货数量 | 必需 |
| `Warehouse Transfer In/Out` | 库房转入/转出数量 | 必需 |
| `Found` | 找到数量 | 必需 |
| `Lost` | 丢失数量 | 必需 |
| `Damaged` | 残损数量 | 必需 |
| `Disposed` | 弃置数量 | 必需 |
| `Other Events` | 其他动作数量 | 必需 |
| `Ending Warehouse Balance` | 期末库房余量 | 必需 |
| `Unknown Events` | 未知动作数量 | 必需 |
| `Location` | 仓库位置 | 必需 |
| `Store` | 店铺或账号 | 可选；存在时必须保留 |

### 3.3 期间标准化

`Date` 不一定是具体日期。真实 Amazon 导出中常见值为：

```text
03/2026
2026-03
2026/03/01
```

处理规则：

| 源格式 | 标准字段 |
|---|---|
| `MM/YYYY` | `period = YYYY-MM` |
| `YYYY-MM` | `period = YYYY-MM` |
| 具体日期 | `date = YYYY-MM-DD`，并派生 `period = YYYY-MM` |

默认汇总使用 `period`，不要把 `Date` 直接理解为日维度。

### 3.4 可选辅助输入

| 辅助文件 | 用途 |
|---|---|
| SKU 映射表 | 当 MSKU、FNSKU 或 ASIN 缺失时辅助补齐标识 |
| 上期库存汇总 | 做期间连续性检查，如本期期初是否等于上期期末 |
| 历史库存汇总 | 给经营分析 Skill 使用，本 Skill 只传递数量事实 |

映射表只能用于补齐或核对标识，不能覆盖 Amazon 源行中已经明确且无冲突的 `FNSKU`、`ASIN`、`MSKU`。

## 4. 输出契约

### 4.1 中间输出

执行过程中应形成以下可审计产物：

| 产物 | 内容 |
|---|---|
| `inventory_source_profile` | 源文件路径、编码、sheet、表头、源行数、字段清单、期间、Store 分布 |
| `inventory_row_normalization` | 每行的标准期间、标准标识、数值解析状态、行状态 |
| `inventory_action_summary` | 按汇总粒度聚合后的库存动作数量 |
| `inventory_closure_check` | 每个汇总组和全表的闭环计算、实际期末、差异 |
| `inventory_identifier_quality` | 缺失标识、映射补齐、映射冲突、标题冲突 |
| `inventory_location_distribution` | Location 维度的库存分布和动作汇总 |
| `inventory_anomalies` | 异常、风险、阻塞项和建议下一步 |
| `inventory_output_readback` | 使用 `workspace_parse_table` 解析正式输出文件后的 sheet、表头、行数、关键合计和错误列表 |

### 4.2 正式输出

正式输出必须使用本 Skill 的现有 asset 模板：

```text
assets/库存汇总模板.xlsx
```

正式交付文件固定为：

```text
outputs/库存汇总表.xlsx
```

该模板当前包含：

| Sheet | 内容 |
|---|---|
| `库存汇总` | 正式库存汇总表。A1:U1 为固定表头。 |
| `校验说明` | 模板内置说明，记录默认汇总粒度、闭环公式、转运量规则和异常披露要求。 |

### 4.2.1 Asset Inspection Gate

使用 `assets/库存汇总模板.xlsx` 前，必须先完整 inspect 模板 workbook，不得只凭文件名或记忆写入。

检查动作：

1. 列出 workbook 的全部 sheet 名称。
2. 读取每个 sheet 的第 1 行表头。
3. 读取 `校验说明` 和其他已有说明内容。
4. 判断哪些 sheet 是正式输出，哪些 sheet 是说明或辅助。
5. 建立 `库存输出字段 -> 模板 sheet -> 模板列名` 的映射。
6. 形成 `asset_inspection` evidence 后，才能复制模板并写入。

库存模板至少要确认：

- `库存汇总` 的 A1:U1 固定表头。
- `校验说明` 的闭环公式、转运量规则和异常披露要求。
- 主表允许写入的内容，以及必须写入辅助 sheet 的内容。
- 是否存在说明行、样例行、合计行、格式约束或不可覆盖区域。

阻塞条件：

- 未读取所有 sheet 名称和表头，不得写入 workbook。
- 未读取 `校验说明`，不得写入库存汇总。
- 未建立字段到模板列的映射，不得写入 workbook。
- 模板结构与文档描述不一致时，先按实际模板更新写入计划或阻塞，不得猜测。

执行规则：

1. 先复制 `assets/库存汇总模板.xlsx` 到 workspace 输出目录，再写入复制后的文件。
2. `库存汇总` sheet 是正式交付主表，必须保留模板既有 sheet 名、表头顺序和字段含义。
3. 不得把 `库存汇总` 主表替换为自建新表。
4. 可以新增辅助 sheet 承载证据，但不能删除或破坏模板已有 `库存汇总` 和 `校验说明`。
5. 辅助 sheet 名称建议为 `闭环校验`、`异常与风险`、`位置明细`、`字段画像`。
6. 如果模板字段不足以表达源数据维度，例如 `Store` 存在非空值，应在辅助 sheet 中完整披露，不得静默合并或丢弃。
7. `库存汇总` 主表只写库存明细行和模板允许的合计行，不得在主表下方追加闭环说明、异常清单、字段画像或节点报告文字。
8. 如果在库存汇总过程中遇到了无法归因的异常或者数据对不上，应该单独开sheet详细记录原始数据，矛盾数据，异常原因。

多 Store 处理：

- 当 `Store` 字段不存在、全空或只有一个有效值时，可按模板主表正常输出，并在 `字段画像` 中记录 Store 状态。
- 当 `Store` 存在多个有效值时，内部汇总仍必须包含 `Store` 维度；由于现有主表没有 `Store` 列，必须在 `字段画像` 或 `闭环校验` 中保留 Store 维度。若多个 Store 下出现相同 `FNSKU + ASIN + MSKU + Disposition`，不得只在主表合并后交付 clean pass，必须标记为 `completed_with_template_dimension_gap` 或拆分为多个库存汇总输出。

### 4.3 `库存汇总` 字段

`库存汇总` sheet 必须使用模板 A1:U1 的固定字段：

```text
日期
FNSKU
ASIN
MSKU
商品名称
库存属性
初始库房余量
库房间转运量
已接收
买家包裹
买家退货
供应商退货
库房转入/转出
已找到
已丢失
已残损
已弃置
其他动作
期末库房余量
未知动作
位置
```

字段写入规则：

| 模板字段 | 写入规则 |
|---|---|
| `日期` | 写入标准化期间 `period`；如果用户要求日维度，再写入标准日期 |
| `FNSKU` / `ASIN` / `MSKU` | 写入源值或映射补齐后的值；补齐和冲突必须在辅助 sheet 披露 |
| `商品名称` | 不作为默认分组主键；同组多个 Title 时写入主标题，冲突写入辅助 sheet |
| `库存属性` | 写入 `Disposition` |
| 库存动作字段 | 按模板字段对应源字段求和，保留源正负号 |
| `库房间转运量` | 单独展示，不进入默认闭环公式 |
| `位置` | 默认写入去重 Location 清单；如按 Location 拆分，则写入单个 Location |

模板主表不包含 `Store`、`闭环计算期末`、`闭环差异`、`风险等级` 等字段。这些字段必须写入辅助 sheet，不得强行插入 `库存汇总` 主表导致模板表头漂移。

主表结构门禁：

- `库存汇总` 第 1 行必须是模板 A1:U1 表头。
- 第 2 行开始只能是库存明细行，或一个明确的合计行。
- `闭环校验`、`异常与风险`、`位置明细`、`字段画像` 等说明性内容必须写入辅助 sheet。
- 读回校验统计主表明细行时，不得把辅助说明行误算为库存明细。

### 4.4 辅助 sheet 字段

辅助 sheet 用于保存证据，不替代 `库存汇总` 主表。

`闭环校验` 建议字段：

```text
期间
Store
FNSKU
ASIN
MSKU
库存属性
位置范围
初始库房余量
动作合计
闭环计算期末
期末库房余量
闭环差异
库房间转运量
状态
原因
```

`位置明细` 建议字段：

```text
期间
Store
FNSKU
ASIN
MSKU
商品名称
库存属性
Location
初始库房余量
库房间转运量
已接收
买家包裹
买家退货
供应商退货
库房转入/转出
已找到
已丢失
已残损
已弃置
其他动作
期末库房余量
未知动作
闭环计算期末
闭环差异
```

`异常与风险` 建议字段：

```text
anomaly_id
severity
category
期间
Store
FNSKU
ASIN
MSKU
库存属性
source_row_ids
expected
actual
residual
reason
next_action
```

`字段画像` 建议字段：

```text
source_path
source_rows
columns
period_values
store_values
required_columns_missing
numeric_parse_errors
template_path
template_sheets
main_sheet_header
readback_status
```

## 5. 全局不变量

### 5.1 源行状态闭环

每一行源库存分类账必须进入且只进入一个行状态：

| 行状态 | 说明 |
|---|---|
| `included` | 标识和数值正常，已进入汇总 |
| `included_with_warning` | 可汇总，但存在非阻塞风险，例如非 SELLABLE 或 Unknown Events |
| `included_with_mapping_fill` | 使用映射表补齐了缺失标识 |
| `identifier_unresolved` | 标识缺失或冲突，仍保留原始数量并进入异常清单 |
| `source_error` | 缺少关键字段或数值无法解析，无法可信汇总 |

最终校验：

```text
included
+ included_with_warning
+ included_with_mapping_fill
+ identifier_unresolved
+ source_error
= source_rows
```

### 5.2 数值字段不变量

所有库存动作字段必须保留 Amazon 源数据正负号：

```text
输出字段 = SUM(源字段原始数值)
```

不得因为字段名包含“发货”“丢失”“残损”“弃置”而取绝对值或二次取负。

空白数值单元格处理：

| 情况 | 处理 |
|---|---|
| 源列存在，单元格为空 | 按 0 处理，并记录空白数量 |
| 源列存在，单元格为不可解析文本 | 进入 `source_error` |
| 源列不存在 | 阻塞正式汇总 |

### 5.3 库存闭环不变量

默认闭环公式：

```text
闭环计算期末 =
  初始库房余量
+ 已接收
+ 买家包裹
+ 买家退货
+ 供应商退货
+ 库房转入/转出
+ 已找到
+ 已丢失
+ 已残损
+ 已弃置
+ 其他动作
+ 未知动作
```

```text
闭环差异 = 期末库房余量 - 闭环计算期末
```

`库房间转运量` 默认不进入闭环公式，但必须单独汇总和展示。

如果大量闭环差异与 `In Transit Between Warehouses` 高度相关，应在 `闭环校验` 中增加诊断说明，但不得在没有证据时擅自改写默认公式。

### 5.4 汇总粒度不变量

默认汇总主键：

```text
period + Store + FNSKU + ASIN + MSKU + Disposition
```

规则：

- `Title` 是属性，不作为默认主键。
- `Location` 默认不作为主键，在 `库存汇总` 的 `位置` 列输出去重位置清单；位置数量写入 `位置明细` 或 `字段画像`。
- `Location` 明细必须在 `位置明细` sheet 中保留。
- 如果用户明确要求按仓库位置核算，主键改为：

```text
period + Store + FNSKU + ASIN + MSKU + Disposition + Location
```

### 5.5 标识映射不变量

映射表只用于补齐和冲突识别：

- 源行已有 `MSKU` 且无冲突时，以源行为准。
- 源行缺 `MSKU` 但有 `FNSKU` 或 `ASIN` 时，可用映射表补齐。
- 源行标识与映射表冲突时，不覆盖源值，进入 `mapping_conflict`。
- 一个 MSKU 对多个 FNSKU 不天然异常；只有无法解释且影响汇总判断时才列为风险。
- 一个 FNSKU 对多个 MSKU 通常需要进入冲突清单。

## 6. 执行顺序

### Step 1：定位库存分类账

在当前 workspace 中查找 Inventory Ledger 文件。

优先级：

1. 用户明确指定的文件。
2. 节点 01 或上游报告识别出的库存分类账。
3. 文件名命中 `库存分类账` 或 `Inventory Ledger`。

不要把仓储费、退货处理费、低库存费、赔偿、入库配置服务费等明细误当作库存分类账主输入。

### Step 2：生成源文件画像

记录：

```text
source_path
encoding
sheet_name
header_row
source_rows
columns
period_values
store_values
numeric_columns_parse_status
```

### Step 3：标准化字段

处理动作：

- 将 `Date` 标准化为 `period`。
- 标准化 `Store`；如果字段不存在，设置为空并记录 `store_field_missing`。
- 去除 `FNSKU`、`ASIN`、`MSKU`、`Disposition`、`Location` 前后空格。
- 将数值字段解析为 number。
- 给每行生成稳定 `source_row_id`。

### Step 4：补齐和检查标识

当映射表可用时：

- 缺 `MSKU` 时优先用 `FNSKU -> MSKU` 补齐。
- 其次使用 `ASIN -> MSKU` 或 `SKU -> MSKU`。
- 补齐结果必须记录 `filled_by_mapping = true` 和 `mapping_source`。
- 映射出多个 MSKU 时进入冲突清单，不做自动选择。

### Step 5：选择汇总粒度

默认生成两个层次：

| 层次 | 主键 | 用途 |
|---|---|---|
| 库存汇总 | `period + Store + FNSKU + ASIN + MSKU + Disposition` | 后续利润校验和经营分析 |
| 位置明细 | 默认主键 + `Location` | 仓库位置追踪和差异定位 |

### Step 6：汇总库存动作

对每个汇总组计算：

```text
初始库房余量 = SUM(Starting Warehouse Balance)
库房间转运量 = SUM(In Transit Between Warehouses)
已接收 = SUM(Receipts)
买家包裹 = SUM(Customer Shipments)
买家退货 = SUM(Customer Returns)
供应商退货 = SUM(Vendor Returns)
库房转入/转出 = SUM(Warehouse Transfer In/Out)
已找到 = SUM(Found)
已丢失 = SUM(Lost)
已残损 = SUM(Damaged)
已弃置 = SUM(Disposed)
其他动作 = SUM(Other Events)
期末库房余量 = SUM(Ending Warehouse Balance)
未知动作 = SUM(Unknown Events)
```

### Step 7：执行闭环校验

校验范围：

- 每个 `库存汇总` 组。
- 每个 `位置明细` 组。
- 全表合计。

每条校验记录包含：

```text
check_scope
group_key
starting_balance
action_total_without_in_transit
calculated_ending
actual_ending
closure_diff
in_transit_between_warehouses
status
reason
```

### Step 8：生成异常与风险清单

每条异常记录使用统一结构：

```text
anomaly_id
severity
category
group_key
source_row_ids
expected
actual
residual
reason
next_action
```

`severity` 取值：

| severity | 含义 |
|---|---|
| `blocking` | 无法可信产出库存汇总 |
| `error` | 已产出但不能声明 clean pass |
| `warning` | 不影响数量汇总，但影响解释或后续分析 |
| `info` | 需要披露的背景信息 |

### Step 9：写入并读回输出

写入正式 xlsx 后必须使用 `run_shell` 解析实际输出文件并读回：

- 文件可打开。
- `run_shell` 能解析所有用户可见 sheet，且解析结果没有错误。
- 必需 sheet 存在。
- 输出路径为正式库存 workbook，不能是 JSON evidence。
- 输出文件确认为从 `assets/库存汇总模板.xlsx` 复制后写入。
- `库存汇总` 表头符合本契约或模板契约。
- `库存汇总` 主表没有混入闭环说明、异常说明、字段画像等非库存明细行。
- 源行数、汇总行数、全表动作合计可回勾。
- 闭环差异和异常数量与写入前一致。

readback evidence 至少包含：

```text
inventory_workbook_path
copied_from_asset_template
sheet_names
header_match
detail_row_count
total_row_check
inventory_closure_check
auxiliary_sheet_check
```

## 7. 异常与风险分级

### 7.1 阻塞项

以下情况阻塞正式库存汇总：

| 情况 | 动作 |
|---|---|
| 找不到 Inventory Ledger 文件 | 输出缺失文件说明 |
| 缺少必需字段 | 列出缺失字段 |
| 关键数值列无法解析 | 列出字段、行号和原始值 |
| 源文件无法读取 | 记录路径、编码和错误 |
| 正式输出无法写入或读回 | 记录输出路径和错误 |
| 没有正式 `库存汇总表.xlsx             | 提示用户                    |
| 未复制 asset 模板而自建 workbook | 重新复制模板并写入 |
| `库存汇总` 主表混入说明行导致结构漂移 | 移至辅助 sheet 后重写并读回 |

### 7.2 计算错误

以下情况不应静默通过：

| 情况 | 动作 |
|---|---|
| 闭环差异不为 0 | 进入 `闭环校验` 和 `异常与风险` |
| 期末库房余量为负 | 进入 `异常与风险` |
| Location 明细闭环通过但汇总闭环失败 | 检查分组和合并逻辑 |
| 汇总动作合计无法回勾源数据 | 重新检查数值解析和过滤逻辑 |

### 7.3 标识问题

| 情况 | 动作 |
|---|---|
| 缺 MSKU，但 FNSKU/ASIN 可映射 | 补齐并记录映射来源 |
| 缺 MSKU 且无法映射 | 保留原始数量，进入 `identifier_unresolved` |
| FNSKU 映射多个 MSKU | 进入 `mapping_conflict` |
| MSKU 映射多个 FNSKU | 默认披露为信息；只有影响判断时升级为 warning |
| 同一主键下 Title 不一致 | 选取出现次数最多的 Title，其他值进入标题冲突清单 |

### 7.4 经营风险

以下不是计算错误，但必须披露给后续经营分析：

| 风险 | 说明 |
|---|---|
| 非 `SELLABLE` 库存 | 不可售、残损、过期或其他属性会影响库存健康 |
| `Unknown Events != 0` | Amazon 无法明确归类的库存动作 |
| `Lost`、`Damaged`、`Disposed` 数量不为 0 | 可能代表赔偿、损耗或清理风险 |
| `Customer Returns` 较高 | 后续健康分析应结合退款率判断 |
| 多 Location 分布 | 可能影响库存调拨和仓储风险 |

## 8. 输出给后续节点的事实

`nextNodeInputs` 或等价结构中至少包含：

```text
inventory_summary_path
source_path
periods
store_values
source_rows
summary_rows
location_detail_rows
action_totals
closure_status
closure_diff_total
closure_diff_group_count
non_sellable_group_count
unknown_events_group_count
negative_ending_group_count
identifier_unresolved_count
mapping_conflict_count
readback_status
```

给 `amazon-sku-profit-health-monitor` 的稳定事实包括：

```text
MSKU
period
Store
sellable_ending_qty
non_sellable_ending_qty
customer_shipments_qty
customer_returns_qty
receipts_qty
lost_qty
damaged_qty
disposed_qty
unknown_events_qty
location_count
location_list
closure_status
```

## 9. 校验清单

正式交付前必须完成：

- 已确认主输入是 Inventory Ledger。
- 已记录源文件画像。
- 已确认所有必需字段存在。
- 已完成 `Date` 到 `period` 的标准化。
- 已保留 `Store` 字段；字段不存在或全空时已披露。
- 所有库存动作字段保留源正负号。
- 源行状态数量合计等于源行数。
- 汇总动作合计可回勾源数据。
- `库存汇总` 和 `位置明细` 均完成闭环校验。
- `库房间转运量` 已单独展示，未进入默认闭环公式。
- 非 `SELLABLE` 库存已统计。
- `Unknown Events != 0` 的组已列出。
- 负库存、标识缺失、映射冲突、标题冲突已披露。
- 正式 xlsx 已写入并通过 `workspace_parse_table` 解析读回。
- 正式 xlsx 已用 `workspace_parse_table` 解析通过。
- 正式 xlsx 路径为 `outputs/库存汇总表.xlsx`，且来自 `assets/库存汇总模板.xlsx`。

## 10. 失败状态

当无法产出可信库存汇总时，输出失败状态而不是补造结果。

失败说明必须包含：

```text
失败阶段
输入文件
缺失字段或错误字段
受影响行数
已完成的检查
不能继续的原因
建议下一步
```

闭环差异不为 0 时，可以产出库存汇总和异常清单，但状态必须标注为：

```text
completed_with_inventory_closure_diff
```

只有以下条件全部满足时，才能声明库存数量事实 clean pass：

- 源文件可读。
- 必需字段齐全。
- 数值字段解析完成。
- 源行状态闭环。
- 汇总合计可回勾源数据。
- 全表闭环差异为 0。
- 每个分组闭环差异为 0，或差异已逐项披露并由后续校验门禁接管。
- 正式输出文件可通过 `run_shell` 解析读回。
- 正式输出文件已用 `run_shell` 解析，且没有错误、空表、表头错位或关键合计异常。
- 正式输出文件来自库存 asset 模板。
