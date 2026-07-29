<!--
文件功能：提供 SIF 供应商观察、数据质量预检、基线阈值、偏离、候选驱动、反证和下一步检查的正式交付模板。
职责边界：模板只承载按需异常候选诊断；SIF 诊断不替代第一方基线或因果；不创建监控、告警，不宣称根因或执行领域动作。
重要关联：字段和状态由 references/business-anomaly-contract.md 定义；由上级 SKILL.md 物化到 outputs。
-->

# Amazon 经营异常候选诊断

## 1. 分析控制

- Analysis ID：
- Metric ID / contract version：
- 分析期间 / 时区：
- Marketplace / entity scope：
- Grain / unit：
- 用户问题：
- Owner / reviewer：
- Analysis mode：`on_demand`

## 2. SIF 供应商观察（可选）

| Evidence ID | Source Type | Provider | Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace | Query Scope | Temporal Scope | Coverage / Pagination | Estimation Status | Transformation Type | Raw Result Locator | 诊断上限 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` |  | `vendor_observation_only` |

> `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文中的对应真实值；若上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

## 3. 数据质量预检

| Precheck ID | 检查 | 状态 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 影响 | 下一步 |
|---|---|---|---|---|---|---|---|---|---|
|  | 新鲜度 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |
|  | 延迟 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |
|  | 覆盖 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |
|  | Schema/版本 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |
|  | 粒度/时区/币种 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |
|  | 去重 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |
|  | 缺失/冲突 |  |  | `agent` |  | `not_applicable` | `data_quality_assessment` |  |  |

## 4. 基线与阈值

| Baseline/threshold ID | 来源 | 历史期间 | 样本数 | 方法/参数 | 季节/事件处理 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 状态 |
|---|---|---|---:|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` |  |  |  |  |

阈值来源只能：

```text
user_defined | transparently_derived
```

## 5. 观察偏离

| Agent Output ID | Observed | Expected | Absolute deviation | Relative deviation | Threshold | Status | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---:|---:|---:|---:|---:|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `agent` |  |  | `deviation_calculation` |

`diagnostic_status`：

```text
anomaly_candidate | insufficient_history | expected_event_effect | data_quality_issue
```

## 6. 已知事件对齐

| Agent Output ID | Event ID | 类型 | 时间/范围 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 与偏离对齐 | 解释上限 |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` |  | `not_applicable` | `context_alignment` |  | `association_only` |

## 7. 分解

| Agent Output ID | 维度/实体 | Observed contribution | Coverage | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 可比性 | 限制 |
|---|---|---:|---:|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` |  |  | `decomposition` |  |  |

## 8. 候选驱动矩阵

| Hypothesis ID | Observed deviation | Candidate driver | Parent Evidence IDs | Supporting evidence | Contradicting evidence | Source type | Temporal scope | Estimation status | Transformation type | Falsification condition | Next check | Domain owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` |  | `agent_hypothesis` | `hypothesis` |  |  |  |

所有候选：

```text
estimation_status=agent_hypothesis
causal_status=not_established
```

## 9. 缺失与冲突

| Agent Output ID | 对象/字段 | 状态 | 对基线/阈值/偏离的影响 | 精确补数请求 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` |  | `not_applicable` | `gap_classification` |

```text
not_returned | not_queried | parse_failed | missing | conflicted | true_zero
```

## 10. 责任路由

- 第 05 广告：
- 第 06 促销：
- 第 08 库存/履约：
- 第 09 政策：
- 第 10 RCA/POA：
- 第 14/内置包利润、价格、资金：

## 11. 人工复核

- [ ] 数据质量先于经营解释
- [ ] 阈值来源透明，无固定 30%
- [ ] 历史充分或明确 `insufficient_history`
- [ ] 前五类缺失未补零
- [ ] 支持和反证同时展示
- [ ] 下一步检查可证伪
- [ ] 每个已调用 SIF 工具均先 `describe`，供应商诊断未被写成根因或因果
- [ ] 未声称已证根因
- [ ] 未创建后台、告警或执行动作

## 12. 最终状态

```text
analysis_status=
diagnostic_status=
reason_codes=[]
monitoring_status=not_created
alert_status=not_sent
action_status=not_executed
causal_status=not_established
```
