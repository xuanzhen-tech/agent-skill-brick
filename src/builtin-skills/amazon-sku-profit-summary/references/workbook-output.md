# Workbook Output

## Workbook Artifact Requirement

最终用户可见的电子表格文件必须遵循此参考，涉及SKU利润工作簿结构、费用池披露、来源可追溯性、公式和回读检查。创建或修改 `.xlsx` 文件，应用格式和公式，导出任何必要的 `.csv` 文件，并用 `run_shell` 验证工作簿/回读结果。

不要将节点报告、JSON 证据文件、脚本日志或纯文本摘要当作最终电子表格文件的替代品。工作流程只有在用户可见的 `.xlsx` 路径和任何必要的 `.csv` 路径被写入输出目录、用 `run_shell` 解析、验证无误，并列入最终产物索引后，才算完成。

本文件定义 SKU 利润 workbook asset、`利润统计`、`费用池`、`未计入利润项目`、`数据溯源`、利润合计、最终合并和写入读回规则。

正式 workbook 使用汇总披露页；逐源交易行披露保存在结构化 evidence 或节点报告中，用于支撑 workbook 中的汇总结论。

字段含义、归因规则和具体计算由前序 reference 与 Node 01-06 的已验证事实负责。最终输出节点只负责合并这些事实，参考 asset 重新生成正式 workbook，并执行读回复检；不在最终节点重新发明字段公式或归因逻辑。

## 1. 输出契约

### 1.1 中间输出

执行过程中应形成以下可审计中间结果：

- `source_profile`：源文件、字段、行数、type/description 分布。
- `row_resolution`：每行交易的归因状态和证据。
- `field_consumption`：字段到利润列的消耗矩阵。
- `fee_allocations`：费用池锚定、分摊基准、尾差处理和 MSKU 分摊结果。
- `unresolved_rows`：未解决、排除或冲突行的原始明细和原因。
- `currency_profile`：主交易报告、Settlement report、采购成本、头程费用、广告和其他辅助文件的币种画像。
- `settlement_rate_profile`：Settlement report 中可回勾本次期间、账号和币种对的结算汇率；不存在时记录缺失。
- `currency_conversion_evidence`：跨币种换算证据，记录原始币种、目标币种、原始金额、折算金额、汇率、汇率日期、来源、是否财务人员确认和适用范围。

### 1.2 正式输出

正式输出使用 Skill 资产：

```text
assets/SKU利润汇总表模板.xlsx
```

写入 workspace 输出目录，例如：

```text
outputs/某公司+某年+某月+某店铺+SKU利润汇总表+版本/处理时间.xlsx
```

最终 workflow 完成时，必须向用户提供可直接打开的产出文件路径。SKU 利润正式结果至少包含一个 `.xlsx`；如流程额外生成 CSV 明细或索引，也必须写入输出目录并纳入最终产物清单。只给节点报告、JSON evidence 或文字总结不算完成正式输出。

最终产物交付前必须执行 `workspace_parse_table` 解析实际输出文件。解析范围至少覆盖所有用户可见 `.xlsx` 的 sheet、表头、明细行数、合计行、公式结果、关键金额列、状态列中文展示和费用池披露；如生成 `.csv`，也必须解析 CSV 表头、行数、关键列和金额合计。解析发现错误、空表、表头错位、公式结果异常、状态列英文枚举或合计不一致时，必须修正并重新解析；不得先输出文件路径给用户。

### 1.2.1 Template Reference Gate

生成正式 workbook 前，先 inspect `assets/SKU利润汇总表模板.xlsx`。模板只作为输出蓝图：参考它的 sheet 组织、标题层级、表头、分组方式、说明文字密度和整体视觉风格，然后根据本次数据重新生成完整 workbook。

检查动作：

1. 读取四个 sheet 的名称、标题、表头和主要分组。
2. 归纳四个 sheet 的职责：`利润统计`、`费用池`、`未计入利润项目`、`数据溯源`。
3. 识别模板中的样例数据和占位文本，只作为参考，不作为正式结果。
4. 生成后使用 `workspace_parse_table` 重新解析 workbook，对照 asset 检查整体结构、sheet 职责、关键分组和视觉风格是否一致。

### 1.3 `利润统计`

`利润统计` 是正式 SKU/MSKU 利润汇总页。参考 asset 生成：

- 顶部标题和期间/币种/站点/数据源说明。
- SKU/MSKU 明细表，列集合参考 asset，行数按本次实际 SKU/MSKU 数量动态生成。
- `店铺维度` 汇总行：用于展示针对店铺发生、属于利润口径、但缺少可靠 SKU/MSKU 明细或用户明确要求不分摊的金额。订阅费、FBA 仓储费、广告费、秒杀推广费、其他费用不能因为无法分摊就默认作为未完成或缺证据。
- 互斥费用展示：订阅费、FBA 仓储费、广告费、秒杀推广费、其他费用不允许双轨；有可靠明细或分摊依据时，只生成 SKU/MSKU 分摊结果；无可靠明细或分摊依据时，只保留店铺维度 anchor。
- FBA 仓储费大类包含月度仓储费、长期仓储费、超龄库存费、移除费、入库配置费以及其他确认属于 FBA 仓储/库存相关的费用。这些子项有可靠明细时进入 SKU/MSKU 分摊结果；无可靠明细时才汇总到店铺维度 `fba仓储费用`。
- 店铺维度列映射必须按费用语义落列：未分摊的 FBA Inventory Fee 空描述/未知仓储项进入 `fba仓储费用`；未分摊的 Coupon/Vine 进入 `广告费合计`；未分摊的 Deal 进入 `秒杀推广费`；未分摊的 Transparency Charges、Adjustment-Other 进入 `其他费用`。
- 订阅费默认按销售额/销量口径分摊到 MSKU 明细，不写入店铺维度；用户明确要求不分摊时，才写入店铺维度订阅费。读回校验时确认同一订阅费 anchor 只落在 MSKU 明细或店铺维度其中一处。
- 表头根据实际落点表达：未分摊并进入店铺维度时使用 `fba仓储费用（未分摊）`、`广告费合计（未分摊）`、`秒杀推广费（未分摊）`、`其他费用（未分摊）`；已完成分摊时可使用 `fba仓储费（已分摊）`、`广告费（已分摊）`、`秒杀推广费（已分摊）`、`其他费用（已分摊）` 或与 asset 等价的清晰列名。
- `合计` 行：汇总 SKU/MSKU 明细和店铺维度。

明细排序、金额口径、利润合计和贡献利润率按前序节点已验证事实生成，并在读回阶段重算校验。

### 1.4 输出符号口径

利润表使用前序节点已经验证的统一经营口径。最终输出节点只负责承接这些结果，并在读回阶段确认 workbook 展示口径与前序事实一致。

### 1.5 异常、费用池和披露页

正式 workbook 使用 `费用池` 和 `未计入利润项目` 做汇总披露；逐源交易行明细保存在中间 evidence、节点报告或结构化事实中，支撑汇总披露的审计粒度。

行级归因流程结束后的以下状态必须进入披露闭环：

| 内部状态码 | 用户可见状态 | 含义 |
|---|---|---|
| `unresolved_with_reason` | 未解决，有原因 | 已尝试所有可用归因路径，仍无法确定 MSKU 或费用池 |
| `excluded_with_reason` | 已排除，有原因 | 当前利润口径明确不吸收，但需要披露 |
| `mapping_conflict` | 映射冲突 | 多个证据路径指向不同 MSKU，无法自动裁决 |
| `missing_required_evidence` | 缺少必要证据 | 当前费用池有规则，但缺少必要辅助明细 |
| `missing_required_linkage` | 缺少必要关联 | 有辅助明细，但无法证明其与主交易报告费用行关联 |

`费用池` 是店铺维度费用、未分摊或需要披露的费用说明页。参考 asset 的竖向分组表达，把本次真实发生且未分摊的费用组织成“汇总类别 + 细分项目”，例如广告费用、FBA 仓储费用、秒杀推广费、其他费用。每个项目展示金额、状态和所需辅助文件；汇总类别由细分项目加总。

对缺少 SKU/MSKU 分摊明细并已按店铺维度计入 `利润统计` 的费用池，状态写“缺少分摊明细，已计入店铺维度”或拆成状态“缺少分摊明细”+说明“已计入店铺维度”，不是“缺少必要证据”。已分摊到 SKU/MSKU 的同一费用 anchor 不得再进入费用池店铺维度说明。只有该费用规则必须依赖辅助文件且没有店铺维度口径时，才写“缺少必要证据”。

`未计入利润项目` 是排除项说明页。参考 asset 生成项目、金额和排除原因，用于说明哪些金额按利润口径不进入 SKU 利润。

`数据溯源` 是审计说明页。参考 asset 的键值结构，写入本次真实数据源、期间、原始币种、目标币种、汇率来源、站点、SKU 数量、核算口径、费用池处理、源行闭环和读回校验结果。

### 1.6 用户可见状态语言

正式 workbook 和导出的用户可见 `.csv` 中，所有名为 `状态`、`最终状态`、`处理状态`、`审计状态` 或同义含义的列必须写中文展示值，不得直接写英文内部枚举。

内部 evidence、节点报告和脚本中可以保留 `status_code`、`resolved_status`、`field_status` 等英文状态码，用于闭环、过滤和交叉校验；但正式产物中展示给用户的状态列必须使用对应中文标签。

常用展示映射：

| 内部状态码 | 用户可见状态 |
|---|---|
| `processed` | 已处理 |
| `allocated` | 已分摊 |
| `unresolved_with_reason` | 未解决，有原因 |
| `excluded_with_reason` | 已排除，有原因 |
| `mapping_conflict` | 映射冲突 |
| `missing_required_evidence` | 缺少必要证据 |
| `missing_required_linkage` | 缺少必要关联 |
| `not_applicable` | 不适用 |
| `missing_column` | 缺少字段 |
| `blank_value` | 空值 |
| `zero_value` | 零值 |
| `sign_review_required` | 符号需复核 |
| `field_semantics_conflict` | 字段语义冲突 |

如果遇到新的内部状态码，先按业务含义生成简洁中文状态；不能把英文状态码原样写入正式 workbook。需要保留英文 code 时，只能写入隐藏审计列、结构化 evidence 或节点报告，不应出现在用户主要查看的状态列中。

### 1.16 利润合计

`利润合计` 和 `贡献利润率` 使用前序节点已验证的计算事实生成。最终输出节点在读回阶段复检：

- SKU/MSKU 明细行、店铺维度行和合计行的利润合计与前序事实一致。
- 合计行能回勾到明细行和店铺维度行，且同一费用 anchor 不得同时出现在两类行。
- 合计行毛利润必须回勾主交易报告全量利润口径：`总毛利 = 交易报告全部利润口径收入 - 交易报告全部利润口径支出`。
- 未进入 `利润统计` 的交易报告利润口径金额，必须进入费用池、未计入利润项目或行级 evidence，并说明数据错误、异常、排除依据或未解决原因。
- 贡献利润率展示清晰，销售额为 0 时有稳定展示结果。

## 2. 最终合并

最终 MSKU 集合：

```text
S_final =
  S_normal_msku
∪ S_fnsku_mapping
∪ S_fee_allocation
∪ S_cost_files
```

处理动作：

- 只有费用分摊、没有交易的 MSKU 也进入 `利润统计`。
- 零交易 MSKU 的无来源交易列按字段语义填 0 或 NULL。
- 每个 MSKU 保留来源证据。
- 每个利润列保留字段消耗或费用分摊证据。

## 3. Workbook 写入

步骤：

1. Inspect `assets/SKU利润汇总表模板.xlsx`，形成 `template_reference` evidence。
2. 根据模板参考的 sheet 职责、字段语义、视觉风格和本次实际数据，创建或重建正式 workbook。
3. 生成 `利润统计`：标题、期间/币种/站点/数据源说明、SKU/MSKU 明细、店铺维度行、合计行。
4. 生成 `费用池`：按本次实际费用类型组织汇总类别和细分项目，写入金额、状态、所需辅助文件。
5. 生成 `未计入利润项目`：写入明确排除项目及排除原因。
6. 生成 `数据溯源`：写入本次真实数据源、期间、币种、站点、SKU 数量、公式口径、费用池处理、源行闭环和读回校验证据。
7. 保存 workbook。
8. 使用 `workspace_parse_table` 解析 workbook 和用户可见 CSV 校验。

写入规则：

- `利润统计` 费用字段必须先按输出符号口径标准化，再计算 `利润合计`。
- `利润统计` 金额字段必须明确是原币口径还是折算口径；发生币种转换时，必须在节点报告或 workbook evidence 中写入 `currency_profile`、`settlement_rate_profile` 和 `currency_conversion_evidence`。
- 保留主交易报告原始金额和原始币种的可回溯证据；折算金额只作为统一展示或辅助复核口径，不替代 `anchor_total`。
- 汇率来源优先级为 Settlement report 结算汇率 > 用户或财务确认汇率 > `exchange_rate_lookup`（汇率查询 / Rate Exchange 工具）取得的外部市场参考汇率。存在可用 Settlement report 汇率但未使用时，必须在 evidence 中说明原因。
- 用户未提供汇率且 Settlement report 不含适用汇率时，先调用 `exchange_rate_lookup`（汇率查询 / Rate Exchange 工具）或要求财务人员确认；市场参考汇率和财务记账汇率分别记录。
- `利润统计` `利润合计` 优先写公式；若写固定值，必须保留独立重算证据。
- `费用池`、`未计入利润项目` 无数据时，可以只生成标题、表头和“无此类数据”说明。
- 逐源交易行披露不再写入正式 workbook 的第二个 sheet，但必须保留在节点报告或结构化 evidence 中。
- 行级 evidence 逐源交易行记录原始字段、最终状态、原因和审计字段。
- 正式 workbook 和用户可见 CSV 的状态列必须使用中文展示值；读回校验时检查不得出现 `missing_required_evidence`、`missing_required_linkage`、`unresolved_with_reason`、`excluded_with_reason`、`mapping_conflict` 等英文枚举。
- 费用组摘要字段例如 `fee_group_key`、`processing_mode`、`anchor_total`、`detail_total`、`allocation_basis` 可作为 evidence 的补充审计字段。
- 最终产物清单必须包含用户可打开的 `.xlsx` 路径；如生成 `.csv`，也列入清单并说明用途。清单只能在 `workspace_parse_table` 解析通过后生成或交付。

## 4. 行级 evidence 原因模板

每个未归因、排除、冲突或缺证据源交易行在 evidence 中填写以下信息：

```text
未归因原因:
[一句话说明最终状态]

尝试过的映射路径:
SKU列 -> [结果];
独立 FNSKU/ASIN/MSKU 字段 -> [结果];
description 提取 -> [结果];
order_id/reference_id 辅助文件查找 -> [结果];
费用池规则 -> [结果]

缺失的辅助文件:
[缺少哪些文件，若不缺则写无]

可疑标识:
[order_id / asin / fnsku / sku / description 关键词]

金额影响:
[金额字段和 total]

建议下一步:
[需要运营、供应链或财务提供什么证据]
```

示例：

```text
未归因原因:
Amazon Fees / Vine Enrollment Fee 缺少 SKU 级费用明细，当前无法分摊到 MSKU。

尝试过的映射路径:
SKU列为空；独立 ASIN 字段为空；description 未提取到 MSKU/FNSKU/ASIN；
order_id 为空；当前 workspace 未发现 Vine SKU 级明细。

缺失的辅助文件:
Vine Enrollment Fee SKU-level detail

可疑标识:
description=Vine Enrollment Fee

金额影响:
total=-200.00

建议下一步:
向运营获取 Vine 费用对应父体、ASIN 或 SKU 明细，或确认是否按销售额分摊。
```
