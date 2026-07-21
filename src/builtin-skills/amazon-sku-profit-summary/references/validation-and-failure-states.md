# Validation and Failure States

本文件定义脚本级验证、节点级交叉验证、字段消耗、Tax 处理、写入后读回、失败状态和阻塞条件。

校验失败必须修正或使用 `workflow_block_current_node`，不得继续推进。Node 07 必须完成全量源行闭环。

节点报告必须记录 `scriptAudits`、`crossValidationChecks`、`sourceRowClosure`、`attributionEvidenceChecks`、`unresolvedClosure`、`templateReadbackChecks` 和 `completionCriteriaResults`。

### 1.1 字段消耗

每个源字段在字段消耗矩阵中必须落入一个状态：

| 内部状态码 | 用户可见状态 | 说明 |
|---|---|---|
| `consumed` | 已消耗 | 已进入某个利润列 |
| `excluded_tax` | 税费字段已排除 | Tax 类字段，利润表不吸收 |
| `excluded_with_reason` | 已排除，有原因 | 有业务原因的排除字段 |
| `unresolved_field` | 字段未解决 | 字段语义或数据质量未解决 |
| `not_applicable` | 不适用 | 当前规则不适用 |

### 1.2 Tax 处理

Tax 类字段处理动作：

- 识别字段名或业务含义中的税费字段。
- 统计行数和金额合计。
- 在字段消耗矩阵中使用内部状态码 `excluded_tax`（用户可见状态为“税费字段已排除”）。
- 在报告、费用池 Sheet 或未计入利润项目 Sheet 中披露原因。

### 1.3 写入后读回

正式 xlsx 写入后必须使用 `workspace_parse_table` 解析实际输出文件并执行读回校验：

- 文件可打开。
- `workspace_parse_table` 能解析所有用户可见 sheet，且解析结果没有错误。
- 利润统计 Sheet 表头与模板一致。
- 利润统计 Sheet 合计行等于已写入 MSKU 行和店铺维度行累加值。
- 利润统计 Sheet 每个 MSKU 行的 `毛利润` 等于该行各利润字段代数和，允许误差不超过 `0.01`。
- 利润统计 Sheet 合计行的 `毛利润` 同时满足：
  - `合计行.毛利润 = SUM(所有 MSKU 行.毛利润) + 店铺维度行.毛利润`
  - `合计行.毛利润 = 合计行各利润字段代数和`
- 总账级毛利闭环必须满足：
  - `合计行.毛利润 = 交易报告全部利润口径收入 - 交易报告全部利润口径支出`
  - 除明确的数据错误、异常、排除依据或已披露未解决原因外，交易报告利润口径金额不得从 SKU 利润汇总闭环中消失。
- 容易出现由于精度和四舍五入导致的误差，一定要在计算过程中保持最高精度，最后汇总再保留两位小数，避免精度导致的误差。
- 费用类字段符号符合输出符号口径，尤其是 `广告费`、`fba仓租`、`fba运费`、`手续费`。
- 费用池 Sheet 和未计入利润项目 Sheet 有数据行，或显式标注无此类数据。
- 费用池 Sheet 保留费用池汇总类别和细分项目结构；逐源交易明细保存在结构化 evidence 或节点报告中，不用分类摘要替代必要审计事实。
- 每个金额列读回值与预期值一致。
- `状态`、`最终状态`、`处理状态`、`审计状态` 等用户可见状态列使用中文状态，不直接暴露英文内部状态码。

只校验“列合计残差 = 0”不能视为通过；必须通过 `workspace_parse_table` 解析、毛利润公式、总账级毛利闭环和符号口径校验。未执行 `workspace_parse_table` 或解析发现错误时，必须标记 `validation_failed`，不得交付最终产物。

## 2. 校验入口

在 workflow 中运行时，调用 `amazon-sku-profit-reconciliation`：

| 阶段 | 调用时机 | 校验重点 |
|---|---|---|
| 阶段二 | 正常 MSKU 字段消耗后 | 字段消耗、金额、数量闭环 |
| 阶段三 | FNSKU / 空白 SKU 归属后 | 映射穷举、费用锚定、尾差 |
| 阶段四 | 最终合并前 | MSKU 覆盖、逐列总计、行数闭环 |
| 阶段五 | xlsx 写入后 | 使用 `workspace_parse_table` 解析实际产物；校验文件结构、表头、合计行、符号口径、毛利润公式、费用池 Sheet 和未计入利润项目 Sheet 读回 |

校验结果进入节点报告 evidence 或 metrics。

## 3. 失败状态

| 内部状态码 | 用户可见状态 | 触发条件 | 输出动作 |
|---|---|---|---|
| `missing_column` | 缺少字段 | 公式需要的源字段不存在 | 记录字段、公式、影响金额 |
| `missing_required_evidence` | 缺少必要证据 | 费用池缺少必要辅助明细，且无店铺维度兜底口径 | 写入费用池 Sheet 或未决报告 |
| `missing_required_linkage` | 缺少必要关联 | 辅助明细无法证明与交易报告费用行关联 | 写入费用池 Sheet，禁止反向归属 |
| `mapping_conflict` | 映射冲突 | 多路径映射到不同 MSKU | 写入费用池 Sheet，等待确认 |
| `input_scope_ambiguous` | 输入范围不明确 | 多份候选源文件、辅助文件或数据集无法凭证据裁定是否属于本次任务 | 调用 `require_more_information`；未确认前阻塞或输出候选清单，不得正式计算 |
| `currency_conversion_missing` | 缺少汇率证据 | 跨币种金额缺少 `currency_conversion_evidence`，或缺少原币、目标币种、汇率、来源、日期、确认状态 | 阻塞正式核算或降级披露 |
| `settlement_rate_not_used` | 结算汇率未优先使用 | Settlement report 存在可用结算汇率，但未使用且无原因 | 阻塞 clean pass，要求补充原因或改用结算汇率 |
| `unresolved_with_reason` | 未解决，有原因 | 全部可用归因路径失败 | 写入费用池 Sheet |
| `workbook_write_failed` | 工作簿写入失败 | 模板复制或写入失败 | 标记阻塞，保留中间产物 |
| `validation_failed` | 校验失败 | `workspace_parse_table` 解析失败、读回或闭环校验失败 | 定位根因，修正后重跑 |

内部状态码用于节点事实、闭环校验和故障定位；面向用户的 workbook/csv 状态列使用“用户可见状态”。
