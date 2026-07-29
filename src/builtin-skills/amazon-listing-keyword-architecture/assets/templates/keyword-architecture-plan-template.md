<!--
文件功能：作为 Agent 生成关键词架构正式报告时使用的稳定输出模板。
职责边界：只约束交付字段和阅读顺序，不预填业务结论、固定阈值或候选来源内容。
重要关联：由 ../../SKILL.md 在写入 outputs/listing-optimization/<case-id>/01-keyword-architecture/ 前读取或物化；详细字段语义见 ../../references/keyword-placement-contract.md。
-->

# Listing 关键词架构

## 任务摘要

- Case ID：
- Amazon 站点：
- 目标语言：
- 产品与变体口径：
- 用户目标：
- 生成时间：
- 总体状态：`ready | limited | stale | conflicted | blocked | out_of_scope`

## 输入与证据范围

| 输入路径或来源 | 版本/期间 | 使用字段 | 证据 ID 范围 | 限制 |
|---|---|---|---|---|
|  |  |  |  |  |

## 产品事实与限制

### 已证事实

| Fact ID | 产品事实 | 适用变体 | 来源 | 四轴标签 |
|---|---|---|---|---|
|  |  |  |  |  |

### 禁止或待确认

| 项目 | 状态 | 原因 | 所需证据 |
|---|---|---|---|
|  |  |  |  |

## 关键词分层

| Keyword ID | 原始词 | 意图 | Evidence tier | Review status | 关键证据 | 反证/限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 字段架构

### 标题

- 目标：
- 推荐词：
- 必须保留的产品事实：
- 风险与待确认：

### 要点

| 要点角色 | 推荐词 | 支撑事实 | 重复理由 | 风险 |
|---|---|---|---|---|
|  |  |  |  |  |

### 描述

- 适合承载的场景或长尾：
- 不得扩写的宣称：

### 后台词候选

| 原始词 | 使用理由 | 政策核验状态 | 风险 |
|---|---|---|---|
|  |  |  |  |

## 覆盖与冲突

| 问题 ID | 状态 | 受影响词/字段 | 证据 | 建议动作 |
|---|---|---|---|---|
|  |  |  |  |  |

## 下游文案交接

- 推荐字段组：
- 允许的语法变体：
- 禁用词与风险词：
- 未解决证据缺口：
- 下游不得改变的事实：

## 证据谱系账本

`input_evidence` 保留输入原四轴；`agent_output` 记录本层分层、字段放置或风险判断，并通过 Parent Evidence IDs 指回输入。

| Record ID | Record type | Parent Evidence IDs | 来源路径/工具 | 使用字段 | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` |
|---|---|---|---|---|---|---|---|---|
|  | `input_evidence` 或 `agent_output` |  |  |  |  |  |  |  |

## 证据声明

- SIF 供应商口径说明：
- 本次未查询或不可见的内容：

### SIF 原始证据（仅实际调用时）

| Evidence ID | Source type | Source tool | Agent request ID | Tool call ID | Provider request ID | Retrieved at | Marketplace | Query scope | Temporal scope | Coverage or pagination | Estimation status | Transformation type | Result state | Raw result locator | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` |  |  |  |  |  |  |  |  |  |  | `reported` | `not_returned/not_queried/parse_failed/missing/conflicted/true_zero` |  |  |

`agent_request_id` 与 `tool_call_id` 仅填当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅填 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。不要复制 `_formatted`、`_next_step` 或供应商给其他 Agent 的格式要求。
