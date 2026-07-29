<!--
文件功能：作为 Agent 生成 Listing 逐问题质量审计时使用的稳定模板。
职责边界：只规定审计报告、问题账本和复核字段，不预填评分、权重或效果承诺。
重要关联：由 ../../SKILL.md 写入 outputs/listing-optimization/<case-id>/03-quality-audit/ 前读取或物化；问题语义见 ../../references/listing-issue-evidence-contract.md。
-->

# Amazon Listing 质量审计

## 审计摘要

- Case ID：
- Amazon 站点：
- 产品与变体：
- Listing 版本/时间：
- 审计字段：
- 审计目标：
- 总体状态：`ready | partial | stale | conflicted | blocked | out_of_scope`

## 审计对象与证据

| 对象或路径 | 版本/期间 | 使用字段 | Evidence ID | 完整性/限制 |
|---|---|---|---|---|
|  |  |  |  |  |

## 保留清单

| Preserve ID | 字段与文本 | 保留理由 | 支撑证据 |
|---|---|---|---|
|  |  |  |  |

## 逐问题审计

### ISSUE-001：问题标题

- 字段与位置：
- 文本证据：
- 问题类型：
- 支撑 Evidence ID：
- 影响机制：
- 优先级：
- 修复动作：
- 必须保留：
- 复核方法：
- 当前状态：
- 不确定性：

按实际证据增加问题，不为凑数量创建问题。

## 问题优先路线

### 发布准备前必须修复

1. 

### 高价值修订

1. 

### 局部优化

1. 

### 需要补证

1. 

## 未评估维度

| 维度 | 状态 | 原因 | 所需资料或责任方 |
|---|---|---|---|
|  | `not_assessed` |  |  |

## 修订验收

| Issue ID | 新版位置 | 状态 | 复核证据 | 新增风险 |
|---|---|---|---|---|
|  |  |  |  |  |

## 证据谱系账本

输入 Listing 与规则使用 `input_evidence` 并保留原四轴；Agent 形成的 Preserve/Issue/修复建议使用 `agent_output` 并通过 Parent Evidence IDs 指回输入。

| Record ID | Record type | Parent Evidence IDs | 来源路径/工具 | 字段/期间 | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` |
|---|---|---|---|---|---|---|---|---|
|  | `input_evidence` 或 `agent_output` |  |  |  |  |  |  |  |

## 能力与限制

- 本次是否新增 SIF 供应商观察：
- 未返回、未查询或 schema 不明的内容：
- 供应商数据口径：
- 本审计不证明排名、转化或审核结果：
- 不属于本 Skill 的后续事项：

### SIF 原始证据（仅实际调用时）

| Evidence ID | Source type | Source tool | Agent request ID | Tool call ID | Provider request ID | Retrieved at | Marketplace | Query scope | Temporal scope | Coverage or pagination | Estimation status | Transformation type | Result state | Raw result locator | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` |  |  |  |  |  |  |  |  |  |  | `reported` | `not_returned/not_queried/parse_failed/missing/conflicted/true_zero` |  |  |

`agent_request_id` 与 `tool_call_id` 仅填当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅填 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。本表不得复制 `_formatted`、`_next_step` 或供应商给其他 Agent 的格式要求。
