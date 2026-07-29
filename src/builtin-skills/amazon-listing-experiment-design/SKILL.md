---
name: amazon-listing-experiment-design
description: 为 Amazon Listing 改版定义可交接的实验干预：冻结对照/处理版本、验证单一内容变量、记录实施资格与回滚条件，并把测量问题交给数据分析专家。适用于 Listing A/B 方案、版本差异审查和实验干预就绪检查；不负责 KPI 合同、样本量、观察窗口、停止规则、统计计算、因果解释、后台执行或持续监控。
---

<!--
文件功能：定义 Amazon Listing 实验干预的内容版本、单变量约束、实施证据、回滚条件和面向数据分析专家的测量交接。
职责边界：本文件只拥有 Listing 干预内容，不拥有实验测量协议、统计分析、因果结论、后台执行或自动监控。
重要关联：干预与交接字段见 references/listing-intervention-handoff-contract.md；正式交付使用 assets/templates/listing-intervention-handoff-template.md；候选文案由 amazon-listing-copy-development 生成；测量协议与结果分析交给第 13 数据分析专家。
-->

# Amazon Listing 实验干预定义

## 目标与单一职责

把“试一下新版 Listing”转化为一个可定位、可复核、可移交的数据对象，回答：

1. 哪个 Listing 业务假设值得验证；
2. 对照与处理版本分别是什么；
3. 唯一计划改变的内容变量是什么；
4. 哪些事实、关键词、站点和变体条件必须保持不变；
5. 实施前要满足什么条件，出现什么内容或发布风险必须回滚；
6. 要把什么测量问题和版本证据交给第 13 数据分析专家。

本 Skill 不定义 KPI 的分子分母，不决定分析单位、分组/随机化、样本量、最小可检测效应、观察窗口、停止规则或统计方法，也不计算和解释实验结果。上述测量与分析职责统一属于第 13 数据分析专家的 `amazon-experiment-analysis`。

## 运行合同

### 合法输入

- 用户对话与 `uploads/` 中的业务目标、当前 Listing、候选版本、发布约束和责任人信息；
- 可信上游 `outputs/` 中的产品事实、关键词架构、VOC、质量审计、当前文案与候选文案；
- 第 13 数据分析专家正式输出的可选测量协议或结果分析，只按 ID、版本和适用范围引用；
- Agent 对版本差异、单变量一致性、内容资格和交接完整性的可追溯判断。

### 禁止输入与禁止动作

- 本 Skill 不直接调用 `sif_mcp`；SIF 观察若与假设相关，必须先由第 02/03 的上游研究或审计 Skill 固化为可追溯输出；
- 不使用 Pangolinfo、网页、浏览器、Amazon 抓取、其他 MCP 或 API；
- 不登录或操作 Seller Central，不创建、启动、暂停、结束或切换实验；
- 不创建 cron、后台进程、自动告警或持续监控；
- 不把任何上游供应商排名、搜索、流量或销量估算当作用户一方实验结果；
- 不自行补写第 13 的 KPI、样本量、窗口、停止规则、显著性标准或因果结论；
- 不把没有稳定版本 ID 的草稿称为可执行干预；
- 不接触、索要或保存密钥。

### 工作区

- `uploads/` 只读；
- `temp/listing-optimization/<case-id>/05-experiment-design/` 仅存版本差异草稿、资格检查和交接中间件；
- `outputs/listing-optimization/<case-id>/05-experiment-design/` 存唯一正式干预定义与测量交接。

不得修改用户原件、上游正式输出或第 13 提供的测量协议。

## 证据合同

### 四轴

每条输入证据和 Agent 输出都记录：

- `source_type`：`user_input | upstream_output | agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`raw | normalized | calculation | coding | inference | hypothesis`。

Listing 假设标为 `transformation_type=hypothesis`；版本差异归一化标为 `normalized`；单变量与资格判断标为 `inference`。Agent 产物不能回写成来源事实。

### 双层谱系

- `input_evidence` 保存来源路径或工具、原始 Evidence ID、版本、时间和四轴；
- `agent_output` 保存稳定 Record ID、`parent_evidence_ids`、使用字段、变换说明和四轴；
- 第 13 的协议或分析结果作为 `upstream_output` 引用，同时保留其原始四轴与上游限制；
- 其他上游对象在本包固定使用 `source_type=upstream_output`，并在 `upstream_original_axes` 保留其原始四轴、父证据 ID 与限制；
- Listing 干预使用 `intervention_id` 串联版本、交接、实施证据和后续结果，不用文件名猜关联。

### 六种缺失状态

数据状态只允许：

`not_returned | not_queried | parse_failed | missing | conflicted | true_zero`

前五种不等于零、不等于无记录，也不能变成“无变化”或“无风险”。`true_zero` 仅在来源明确返回合法零值且口径可验证时使用；本 Skill 不依赖零值补齐版本或内容证据。

## 启动检查

最低输入包括：

1. `case_id`、Amazon 站点、ASIN/SKU/变体范围；
2. 当前版本与候选版本的稳定 ID、路径或可复核快照；
3. 一个 Listing 业务问题与一个主要内容假设；
4. 计划改变的字段与唯一主要内容变量；
5. 产品事实、关键词和禁用宣称等内容约束的 Evidence IDs；
6. 实施责任方与允许的发布方式说明；
7. 需要第 13 设计测量协议的问题。

缺当前或候选版本、存在多项主要内容变化、关键事实冲突或没有实施责任方时，失败关闭，不把方案标为就绪。

## 上游合同预检

默认消费第 02/03 已有的可信上游输出，不为实验干预重复做市场研究或新增外部取数：

1. 确认来源路径、版本、站点、产品与变体范围可定位；
2. 确认 Fact ID、Keyword ID、VOC/Issue Evidence ID 和 Listing 版本 ID 真实存在；
3. 保留上游原始四轴、父证据 ID、期间、估算属性和限制；
4. 只把供应商观察放入内容机制假设背景，不放入测量指标、实施证据或结果分析；
5. 不从供应商展示块、描述、未返回字段或旧工具名扩写结论；
6. 上游合同、版本或适用范围不匹配时，停止受影响假设，不直接调用 SIF 或其他来源补齐。

若上游版本与事实证据已足够，继续定义干预并披露未新增外部取数；若缺口影响内容资格，则 `blocked`。

## 执行流程

### 第一步：路由职责

先区分请求：

- 写新文案或修订文案：转 `amazon-listing-copy-development`；
- 诊断当前 Listing：转 `amazon-listing-quality-audit`；
- 定义 Listing 版本干预：本 Skill；
- 定义 KPI、样本、分组、窗口、停止规则或分析结果：转第 13 `amazon-experiment-analysis`；
- 发布、切换、监控或后台操作：`out_of_scope`。

一个请求可以形成跨专家链路，但每个字段只有一个 owner。

### 第二步：冻结 Listing 假设

使用：

```text
对于 [站点/产品/变体/目标用户]，
把 Listing 的 [字段] 从 [对照版本] 改为 [处理版本]，
希望验证 [一个可测量的业务问题]，
其内容机制假设是 [由 Evidence IDs 支持的机制]。
```

“希望验证”不是结果承诺。机制必须引用产品事实、关键词、VOC 或质量审计，不能只写“新版更吸引人”。

### 第三步：冻结版本与差异

为 Control 与 Treatment 记录：

- 稳定 `version_id`、来源路径、版本时间及哈希或快照标识；
- 逐字段差异与标准化前后内容；
- `changed_field` 和 `primary_content_variable`；
- 不可避免的伴随变化；
- 必须保持不变的事实、关键词、品牌与风险约束；
- 生成方与审批状态。

若标题、主图、价格、要点和广告等多个主要变量同时变化，本 Skill 不把它包装成单变量干预。可以拆分候选，或标记 `multi_variable_change` 并交给第 13 判断是否还能形成其他测量设计；第 03 不自行降级为因果实验。

### 第四步：审查内容与实施资格

确认：

- Control 与 Treatment 指向同一站点、产品和目标变体范围；
- Treatment 中每个事实性宣称都有有效 Evidence ID；
- 不引入未证认证、性能、比较级、质保或合规结论；
- 关键词改变不破坏事实准确性和自然表达；
- 当前版本、候选版本和上游约束没有 stale/conflicted；
- 实施责任方、人工审批与回滚责任明确；
- 发布后可取得版本激活时间与快照证据。

这里只判断“干预内容能否进入测量设计”，不判断实验统计上是否可行。

### 第五步：创建测量交接

向第 13 提交以下合同：

```text
intervention_id
domain=listing
case_id
marketplace
entity_scope
control_version_id
treatment_version_id
changed_field
primary_content_variable
single_variable_check
eligibility_scope
content_hypothesis
measurement_question
event_label
desired_metric
implementation_owner
activation_evidence_required
rollback_trigger
known_external_changes
parent_evidence_ids
```

`event_label` 只是领域侧可验证的版本激活/曝光事件名称；`desired_metric` 只是业务希望观察的结果名称，不是 KPI 合同。第 13 负责确认或重写正式曝光定义、`metric_id`、定义、分子、分母、单位、分析单位、样本、窗口、停止规则和统计方法。

### 第六步：链接第 13 测量协议

若收到第 13 正式输出，只记录：

- `experiment_protocol_id`、版本、适用 `intervention_id`；
- 协议状态与上游输出路径；
- 第 13 要求的版本激活、分配或事件证据；
- 未满足的实施前置条件。

不得在本包复制、改写或“优化”协议字段。协议缺失时可以输出 `handoff_ready`，不能声称实验已准备执行。

### 第七步：定义实施证据与回滚

本 Skill 只定义由授权责任方提供的静态证据：

- 发布前后版本快照与稳定 ID；
- 实际激活时间、站点、变体范围；
- 错误发布、事实风险、版本污染或非预期字段变化记录；
- 回滚触发条件、责任方与回滚后的版本证据；
- 与计划不同的价格、促销、广告、库存或视觉变化。

这不是监控实现。用户或现有授权系统负责执行、记录和提供证据。

### 第八步：接收结果但不重解释

后续如收到第 13 的 `experiment_analysis_output_id`：

- 验证其 `intervention_id`、协议版本与 Listing 版本是否匹配；
- 原样保留第 13 的结论等级、限制和 Evidence IDs；
- 仅把它作为下一轮 Listing 文案或审计的上游输入；
- 不重算效应、不改变显著性、不把观察性结果升级为因果结论。

## 状态与沟通

`result_status` 只允许：

- `handoff_ready`：Listing 干预合同完整，可交第 13 设计测量协议；
- `protocol_linked`：已关联适用的第 13 正式协议，仍未执行；
- `blocked`：关键版本、事实、单变量、责任或协议关联冲突；
- `out_of_scope`：请求属于写作、统计分析、后台执行或持续监控。

`reason_codes[]` 只允许：

`none | missing_control_version | missing_treatment_version | multi_variable_change | missing_fact_evidence | missing_implementation_owner | stale_or_conflicted | protocol_scope_mismatch | upstream_contract_mismatch | out_of_scope`

另固定：

- `execution_status=not_executed`；
- `analysis_status=not_performed | upstream_result_linked`；
- `publication_status=not_published`。

这些状态相互独立，不能由 `protocol_linked` 推断已发布、已执行或已有结果。

## 正式交付

成功时生成：

1. `listing-intervention-definition.md`：假设、范围、版本、单变量与内容资格；
2. `listing-version-diff.csv`：逐字段、逐证据的 Control/Treatment 差异；
3. `experiment-measurement-handoff.md`：交给第 13 的稳定合同及可选协议链接；
4. `listing-intervention-evidence-ledger.md`：四轴、双层谱系、缺失与限制。

缺最低输入时只生成 `data-readiness.md`，列缺口、责任方和恢复条件。所有正式文件只写入 `outputs/`；最终回复只链接这些文件。

使用 `assets/templates/listing-intervention-handoff-template.md`。不要另造结果复盘、统计表或后台操作清单。

## 质量门

- Listing 假设、站点、产品和变体范围明确；
- Control/Treatment 有稳定版本 ID 与可复核差异；
- 单一主要内容变量通过，伴随变化没有隐藏；
- 每个事实性宣称和约束都有 Evidence ID；
- `intervention_id` 在定义、交接、实施证据和上游结果中一致；
- 第 13 的协议只引用不改写，测量字段没有被第 03 抢占；
- SIF 只可通过可信上游成为可选观察背景，本 Skill 不直接调用；任何供应商观察都不是实验结果；
- 六种缺失状态、四轴和双层谱系完整；
- `execution_status=not_executed`，没有后台执行、监控或效果承诺；
- 正式文件位于 `outputs/`，中间文件位于 `temp/`。

## 资源读取

- 冻结版本、判定单变量和创建交接前，读取 `references/listing-intervention-handoff-contract.md`。
- 写正式干预定义与交接前，读取或物化 `assets/templates/listing-intervention-handoff-template.md`。
