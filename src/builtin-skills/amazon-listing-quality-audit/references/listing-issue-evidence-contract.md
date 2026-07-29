<!--
文件功能：定义 Listing 审计中单个问题的证据字段、优先级语义、修复规格和关闭状态。
职责边界：只规范审计记录，不提供万能评分、固定权重、市场阈值或平台政策结论。
重要关联：由 ../SKILL.md 在逐问题审计前读取；正式问题表使用 ../assets/templates/listing-quality-audit-template.md。
-->

# Listing 问题证据合同

## 一、问题最小字段

| 字段 | 要求 |
|---|---|
| `issue_id` | 本任务内稳定 ID |
| `field` | 标题、要点编号、描述或后台词候选 |
| `location` | 可定位到句子、短语或字段范围 |
| `evidence_excerpt` | 支撑问题的最短必要文本，不复制大段来源 |
| `issue_type` | 准确性、字段职责、关键词、清晰度、具体性、一致性、宣称风险或可读性 |
| `evidence_ids` | 产品事实、关键词、用户规则或上游证据 |
| `impact_mechanism` | 问题如何影响理解、匹配、信任或发布准备 |
| `priority` | `must_fix`、`high_value`、`refinement`、`needs_evidence` 或 `not_assessed` |
| `repair_action` | 可执行的删除、保留、补充、重排或澄清 |
| `preserve_items` | 修复中不得丢失的事实或表达 |
| `verification` | 修改后如何判断问题关闭 |
| `status` | `open`、`resolved`、`partially_resolved`、`unresolved` 或 `not_verifiable` |

## 二、影响表述

影响必须连接到可解释机制：

- “产品身份不清，读者无法在标题中确认对象”是可解释影响；
- “转化率会下降 20%”在没有实验或一方数据时不是可接受影响；
- “关键词重复挤压了尺寸条件，可能增加误解”是可解释影响；
- “Rufus 不推荐”若没有当前可验证证据，不是可接受影响。

## 三、优先级规则

### `must_fix`

适用于事实错误、无证高风险宣称、错误变体扩散、产品身份错误或会阻塞下游使用的问题。

### `high_value`

适用于证据充分且修复后可明显改善理解、字段角色或关键词匹配的问题。不得附带固定效果百分比。

### `refinement`

适用于不改变事实的局部简化、自然度或信息顺序改进。

### `needs_evidence`

适用于合理怀疑但缺少产品事实、关键词口径、政策或当前版本的问题。

### `not_assessed`

适用于本次没有文本、证据或职责不属于 Listing 文本专家的维度。

## 四、修复规格

有效修复动作必须包括：

1. 要改变的具体位置；
2. 允许使用的 Fact ID 和 Keyword ID；
3. 不能新增或丢失的含义；
4. 修改后的可观察检查；
5. 若依赖用户或上游资料，明确阻塞条件。

“优化文案”“增强转化”“更自然”不是完整修复动作。

## 五、关闭问题

- `resolved`：修订证据证明问题及其影响机制已消除；
- `partially_resolved`：部分位置或影响已修复，仍有明确残留；
- `unresolved`：修订没有解决问题或引入同类问题；
- `not_verifiable`：缺少新版、事实或必要政策，当前无法核验。

关闭文本问题不等于证明业务指标改善。业务效果需独立实验或一方数据。

## 六、SIF 原始证据状态

直接 SIF 对象固定 `source_type=sif_mcp`、`transformation_type=reported`，并保存三类 request ID、工具、站点、查询/时间范围、覆盖/分页、估算状态和原始定位。`agent_request_id` 与 `tool_call_id` 仅取当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。

`result_state` 只允许 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`。前五项不能解释为无问题、零流量、无关键词或 Listing 内容不存在；只有本次目标字段有明确零证据时才可用 `true_zero`。
