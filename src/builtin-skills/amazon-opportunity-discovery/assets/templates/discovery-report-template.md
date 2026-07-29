<!--
文件功能：提供机会发现正式报告的可复制结构，确保候选池、证据、缺口和下一步同时交付。
职责边界：这是输出模板，不提供数据、阈值或结论；使用时复制到 outputs/ 并删除不适用占位符。
关联关系：由 ../../SKILL.md 的正式交付阶段使用，字段口径遵循 ../../references/sif-research-contract.md。
-->

# Amazon 选品机会发现报告

## 1. 任务边界

- Case ID：
- Amazon 站点：
- 类目、关键词或产品主题：
- 数据期间：
- 用户硬约束：
- 用户偏好：
- 本次假设：

## 2. 数据准备状态

| 能力 | SIF 工具 | 状态 | 时间/覆盖 | 缺口 |
|---|---|---|---|---|
| 关键词需求与竞争 |  |  |  |  |
| 竞品与 ASIN |  |  |  |  |
| 销量与流量 |  |  |  |  |

## 3. 关键词主题地图

| 主题簇 | 关键词 | parent_evidence_ids | 纳入/排除 | 理由 |
|---|---|---:|---|---|
|  |  |  |  |  |

## 4. 市场比较

| 细分市场 | 需求证据 | 竞争结构 | 价格带 | 新品接受度 | 数据覆盖 | 初筛状态 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 5. 候选池

| ASIN/候选 | 入选 evidence_ids | 反证或风险 | 六态缺口 | estimation_status | 状态 |
|---|---|---|---|---|---|
|  |  |  |  |  | advance/watch/exclude/blocked |

## 6. 被排除项

| 候选 | 命中的硬约束 | 证据 | 是否可恢复 |
|---|---|---|---|
|  |  |  |  |

## 7. 结论边界

- 本报告能证明：
- 本报告不能证明：
- 供应商估算：
- 样本与分页限制：
- 时间范围与 schema 风险：

## 8. SIF 证据索引

| evidence_id | source_type | source_provider | source_tool | agent_request_id | tool_call_id | provider_request_id | retrieved_at | marketplace | query_scope | temporal_scope | coverage_or_pagination | estimation_status | transformation_type | raw_result_locator | parent_input_evidence_ids | field_state |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | sif_mcp | sif |  | `not_returned` | `not_returned` | `not_returned` |  |  |  |  |  |  | reported |  |  |  |
|  | sif_mcp | sif | market_estimate_profit_threshold | `not_returned` | `not_returned` | `not_returned` |  |  |  |  |  |  | vendor_calculation |  |  |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`；利润门槛行还必须记录本次全部显式输入的 Evidence ID。

## 9. 下一步

| 优先级 | 候选 | 需要补充的证据 | 建议下游 Skill |
|---:|---|---|---|
| 1 |  |  | amazon-opportunity-validation |
