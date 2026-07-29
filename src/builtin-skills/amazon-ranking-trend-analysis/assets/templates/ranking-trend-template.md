<!--
文件功能：提供四类排名观测、SIF 供应商原始来源、同类序列、上下文事件、趋势限制和证据谱系的正式交付模板。
职责边界：模板只承载按需趋势分析；SIF 结果仍须通过类型与实际字段门；不执行关键词发现、排名监控、告警、自然排名保证或领域动作。
重要关联：严格类型与字段由 references/ranking-trend-contract.md 定义；由上级 SKILL.md 物化到 outputs。
-->

# Amazon 排名趋势报告

## 1. 分析控制

- Analysis ID：
- Stable object / ASIN：
- Marketplace / locale / language：
- 分析期间：
- 目标关键词/类目：
- 生成时间：
- 人工审核人：
- Monitoring status：`not_created`

## 2. 允许的排名类型

本报告只能使用：

```text
bsr_category_rank
organic_keyword_position
sponsored_position
visibility_observation
```

## 3. 来源观测账本

| Evidence ID | Type | Keyword/category | Rank value | Provider/method | Estimated status | Observed at | Sampling scope | Coverage | Limitations |
|---|---|---|---:|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |

### 3.1 SIF 原始来源（可选）

| Evidence ID | Source Type | Provider | Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace | Query Scope | Temporal Scope | Coverage / Pagination | Estimation Status | Transformation Type | Raw Result Locator |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` |  |

> `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文中的对应真实值；若上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

## 4. 序列登记

| Series ID | Type | Object | Keyword/category | Marketplace/locale | Method/scope contract | Observation IDs | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Series status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `agent` |  | `not_applicable` | `series_construction` |  |

不同类型、关键词、类目、站点、方法或采样范围必须拆序列。

## 5. 基线与趋势

| Agent Output ID | Series ID | 时点 | Rank value / range | 相邻变化 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 状态 | 限制 |
|---|---|---|---:|---:|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` |  |  |  |  |  |

单点只允许：

```text
series_status=baseline_only
```

## 6. 上下文事件与协变量

| Context ID | Type | 值/描述 | Business time | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 与序列对齐 | 解释上限 |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` |  | `not_applicable` | `context_alignment` |  | `association_only` |

价格和流量不得进入排名值。

## 7. 缺失、冲突与采样边界

| Agent Output ID | Series / time | 状态 | 供应商哨兵/采样上限 | 影响 | 后续所需输入 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` |  | `not_applicable` | `gap_classification` |

状态：

```text
not_returned | not_queried | parse_failed | missing | conflicted | true_zero
```

## 8. 观察与解释上限

- 可证明的同类位次趋势：
- 供应商估算与采样限制：
- 不可证明的销量、转化、利润或原因：
- 需要第 02/03/04/05/06/08/14 处理的问题：

## 9. 派生谱系

| Agent Output ID | Output type | Series ID | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Rule version | Uncertainty |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  |  |  |  |  |

## 10. 人工复核

- [ ] 只使用四个允许类型
- [ ] Provider/method/estimated 只在证据属性
- [ ] 流量/价格只作为带 Evidence ID 的 context
- [ ] BSR/自然/广告/可见性未拼接
- [ ] 每个已调用 SIF 工具均先 `describe`，且未返回未被写成掉榜
- [ ] 单点未写成趋势
- [ ] 未返回未写成掉榜
- [ ] 未声称自然排名保证
- [ ] 未调用 SIF、Sorftime 或 Web
- [ ] 未创建后台监控或告警

## 11. 最终状态

```text
analysis_status=
reason_codes=[]
monitoring_status=not_created
alert_status=not_sent
rank_change_action_status=not_executed
causal_status=not_claimed
```
