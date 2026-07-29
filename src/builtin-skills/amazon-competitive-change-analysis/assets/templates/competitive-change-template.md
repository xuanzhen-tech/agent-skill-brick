<!--
文件功能：提供稳定竞品对象、SIF 供应商快照、快照基线、可比性、字段变化和证据限制的正式交付模板。
职责边界：模板只记录按需分析；SIF 观察不替代一方事实或竞品集合，不创建后台监控、告警、促销响应或外部写入。
重要关联：字段与状态由 references/competitive-change-contract.md 定义；由上级 SKILL.md 物化到 outputs。
-->

# Amazon 竞品可比变化报告

## 1. 分析控制

- Analysis ID：
- Competitor set ID / version：
- Owner：
- Marketplace / locale：
- 分析期间：
- 生成时间：
- 人工审核人：
- Monitoring status：`not_created`
- Response action status：`not_executed`

## 2. 稳定对象登记

| Stable object ID | ASIN | Seller | Parent/child/variation | Marketplace | Identity status | Evidence IDs |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 3. 快照账本

| Evidence ID | Object ID | Field | Raw/normalized value | 单位/币种 | 业务时间 | 采集方法 | 采样范围 | 覆盖 | 估算状态 | 限制 |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

### 3.1 SIF 原始快照来源（可选）

| Evidence ID | Source Type | Provider | Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace | Query Scope | Temporal Scope | Coverage / Pagination | Estimation Status | Transformation Type | Raw Result Locator |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` |  |

> `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文中的对应真实值；若上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

## 4. 可比性矩阵

| Comparability ID | Object / field | Same identity | Same field semantics | Same unit/basis | Comparable method/scope | Ordered time | Coverage sufficient | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 状态 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` | `period` | `not_applicable` | `comparability_assessment` |  |

## 5. 首次基线

| Agent Output ID | Object / field | Baseline value | Observed at | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 状态 |
|---|---|---:|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `baseline_construction` | `baseline_only` |

单点不得出现“上涨、下降、新增、消失或变化”。

## 6. 可比变化

| Agent Output ID | Object / field | Baseline | Current | Absolute change | Relative change | Change status | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 限制 |
|---|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `agent` | `period` |  | `comparison` |  |

基数为真实零时：

```text
relative_change=undefined
```

## 7. 缺失与冲突

| Agent Output ID | Object / field | 缺失状态 | 影响 | 所需输入 | 可继续的有限结论 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` |  | `not_applicable` | `gap_classification` |

缺失状态：

```text
not_returned | not_queried | parse_failed | missing | conflicted | true_zero
```

## 8. 观察与解释上限

- 可证明的字段变化：
- 不能证明的对手意图、广告、销量、利润或原因：
- SIF 供应商观察限制：
- 需要第 06/14 等责任方处理的问题：

## 9. 派生谱系

| Agent Output ID | Output type | Object / field | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Rule version | Uncertainty |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  |  |  |  |  |

## 10. 人工复核

- [ ] 竞品集合由第 02/用户冻结
- [ ] 对象身份和变体层级稳定
- [ ] 单点只标 `baseline_only`
- [ ] 单位、币种、价格口径与采样可比
- [ ] 前五类缺失未写成变化或零
- [ ] 真实零基数的相对变化为 `undefined`
- [ ] 未推断对手内部策略或因果
- [ ] 未创建监控、告警或响应动作

## 11. 最终状态

```text
analysis_status=
reason_codes=[]
monitoring_status=not_created
alert_status=not_sent
response_action_status=not_executed
```
