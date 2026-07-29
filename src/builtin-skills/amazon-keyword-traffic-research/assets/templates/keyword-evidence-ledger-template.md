<!--
文件功能：提供关键词与流量研究的正式证据账本结构，确保四类通道、SIF 请求谱系、四轴和 Agent 血缘可追溯。
职责边界：模板只定义记录字段，不规定具体返回字段或默认值。
关联关系：由 ../../SKILL.md 的正式交付阶段使用，证据合同见 ../../references/sif-keyword-evidence-contract.md。
-->

# Amazon 关键词与流量证据账本

## 1. 元数据

- Case ID：
- Amazon 站点：
- 创建时间：
- 研究期间：
- ASIN/主题：
- 账本版本：

## 2. SIF 查询清单

| Query ID | 通道 | source_tool | 实际参数 | parent_input_evidence_ids | 时间/分页覆盖 | 状态 | agent_request_id | tool_call_id | provider_request_id | raw_result_locator |
|---|---|---|---|---|---|---|---|---|---|---|
|  | market_keyword/asin_keyword/listing_traffic/ads_visible |  |  |  |  |  | `not_returned` | `not_returned` | `not_returned` |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`。

## 3. 原始 SIF 证据

| Evidence ID | 通道 | ASIN | 原始关键词 | 原字段/值 | marketplace | temporal_scope | estimation_status | transformation_type | coverage_or_pagination | field_state | source_tool |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | current/historical/unknown | reported/estimated/unknown | reported |  | not_returned/not_queried/parse_failed/missing/conflicted/true_zero |  |

## 4. 用户与上游证据

| Evidence ID | source_type | 来源路径 | 上游 Evidence ID | upstream_source_type | upstream_temporal_scope | upstream_estimation_status | upstream_transformation_type | 限制 |
|---|---|---|---|---|---|---|---|---|
|  | user_input/upstream_output |  |  |  |  |  |  |  |

## 5. Agent 派生对象

| Object ID | 类型 | parent_evidence_ids | 公式/规则/解释 | 结果 | temporal_scope | estimation_status | transformation_type | 反证/限制 |
|---|---|---|---|---|---|---|---|---|
|  | normalized/calculation/inference/hypothesis |  |  |  |  |  |  |  |

## 6. 缺失与冲突

| 通道/字段 | field_state | 说明 | 影响 | 可恢复条件 |
|---|---|---|---|---|
|  | not_returned/not_queried/parse_failed/missing/conflicted/true_zero |  |  |  |
