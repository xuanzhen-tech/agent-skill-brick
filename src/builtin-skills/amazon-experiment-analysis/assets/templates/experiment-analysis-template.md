<!--
文件功能：提供实验测量协议、SIF 供应商背景、数据质量检查、效应估计、结论上限和证据谱系的正式交付模板。
职责边界：模板只承载设计审查与结果分析；SIF 背景不得进入实验事实、效应或因果；不执行实验、分流、平台改动或自动停止。
重要关联：字段与因果门由 references/experiment-analysis-contract.md 定义；由上级 SKILL.md 物化到 outputs。
-->

# Amazon 实验测量与结果分析

## 1. 实验控制

- Experiment ID / version：
- Business question：
- Domain owner：
- Analysis unit：
- Design type：
- Marketplace / timezone / entity scope：
- Protocol frozen at：
- Reviewer：
- Experiment execution status：`not_executed_by_agent`

## 2. 测量协议

- Protocol Output ID：
- Parent Evidence IDs：
- Source type：`agent`
- Temporal scope：`current_rule`
- Estimation status：`not_applicable`
- Transformation type：`protocol_normalization`

| 合同项 | 定义 | Evidence/approval | 状态或限制 |
|---|---|---|---|
| Eligibility |  |  |  |
| Assignment/randomization |  |  |  |
| Treatment/control |  |  |  |
| Exposure |  |  |  |
| Primary metric |  |  |  |
| Guardrail metrics |  |  |  |
| Sample size basis / MDE |  |  |  |
| Analysis/attribution window |  |  |  |
| Stopping rule |  |  |  |
| Multiple comparisons |  |  |  |
| Contamination rule |  |  |  |
| Missing-data rule |  |  |  |

本表只规范化登记由 domain owner / reviewer 提供并版本化的测量控制内容。批准事实仍属于父 Evidence；Agent 不得自行补齐缺失协议，也不得把规范化记录描述为 Agent 批准。

## 3. 数据就绪度

| Record type | Source / version | Coverage | Evidence IDs | Missing/conflict status | 影响 |
|---|---|---:|---|---|---|
| Eligibility |  |  |  |  |  |
| Assignment |  |  |  |  |  |
| Exposure |  |  |  |  |  |
| Outcome |  |  |  |  |  |
| Exclusion |  |  |  |  |  |

### 3.1 SIF `public_market_context`（可选）

| Evidence ID | Record Type | Source Type | Provider | Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace | Query Scope | Temporal Scope | Coverage / Pagination | Estimation Status | Transformation Type | Raw Result Locator | 与实验事实的隔离说明 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `public_market_context` | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` |  |  |

> `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文中的对应真实值；若上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

## 4. 质量检查

| Quality Check ID | Check | Method/rule | Observed result | Status | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Interpretation impact |
|---|---|---|---|---|---|---|---|---|---|---|
|  | Sample ratio mismatch |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Missingness |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Cross contamination |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Early stopping / repeated peeking |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Concurrent intervention |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Metric version drift |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Multiple comparisons |  |  |  |  | `agent` |  |  | `quality_check` |  |
|  | Window mismatch |  |  |  |  | `agent` |  |  | `quality_check` |  |

## 5. 效应估计

| Agent Output ID | Metric ID | Treatment n/value | Control n/value | Absolute effect | Relative effect | Uncertainty interval | Method | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---|---|---:|---:|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` |  | `agent_estimated` | `effect_estimation` |

对照基数为真实零：

```text
relative_effect=undefined
```

## 6. 护栏与取舍

| Guardrail Assessment ID | Agent Output ID | Guardrail metric | Treatment | Control | Effect/uncertainty | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 状态 | 决策限制 |
|---|---|---|---:|---:|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` | `period` | `agent_estimated` | `guardrail_assessment` |  |  |

## 7. 结论上限

- Conclusion Output ID：
- Parent Evidence IDs：
- Source type：`agent`
- Temporal scope：`period`
- Estimation status：`not_applicable`
- Transformation type：`interpretation_classification`

- 随机化是否有证据：
- 实际曝光是否有证据：
- 可允许的解释：
- 不可允许的因果表述：
- 样本、期间、对象与外推限制：
- p 值不能证明的内容：
- SIF 供应商背景与实验结果的分界：

非随机时固定：

```text
analysis_status=result_limited_observational
causal_status=causal_interpretation_not_permitted
```

## 8. 派生谱系

| Agent Output ID | Output type | Metric/check | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Rule version | Uncertainty |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  |  |  |  |  |

## 9. 领域交接

- 第 03 Listing 干预：
- 第 04 视觉干预：
- 第 05 广告干预：
- 第 06 促销干预：
- 第 08 履约/库存：
- 第 09 政策：
- 第 14/内置包利润与价格护栏：

## 10. 人工复核

- [ ] 协议已冻结或明确事后修改
- [ ] Assignment、exposure、outcome 分开
- [ ] SRM、缺失、污染、提前停止和多重比较已查
- [ ] 同时报绝对/相对效应与不确定性
- [ ] p 值未写成业务保证
- [ ] SIF 未作为实验结果或进入效应分子/分母
- [ ] 每个已调用 SIF 工具均在本任务首次 `call` 前完成 `describe`
- [ ] 非随机结果未称因果
- [ ] Agent 未执行分流、实验或领域动作

## 11. 最终状态

```text
conclusion_output_id=
analysis_status=
causal_status=
reason_codes=[]
experiment_execution_status=not_executed_by_agent
external_change_status=not_executed
automation_status=not_created
```
