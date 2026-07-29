<!--
文件功能：提供 KPI 合同登记、SIF 供应商观察附录、读数、覆盖率、比较结果和证据谱系的正式交付模板。
职责边界：模板只承载本次按需报表；SIF 观察与第一方 KPI 分栏且不得进入分子或分母；不创建自动刷新、告警、推送或领域执行动作。
重要关联：字段语义由 references/kpi-reporting-contract.md 定义；由上级 SKILL.md 在正式交付前物化到 outputs。
-->

# Amazon KPI 报表

## 1. 报表控制

- Analysis ID：
- Report ID：
- 报表版本：
- 报表目的：
- Reporting period：
- Comparison period：
- 时区：
- Marketplace：
- Entity scope：
- 生成时间：
- 人工审核人：
- Automation status：`not_created`

## 2. 数据就绪度

| 来源/上游输出 | Owner | 版本 | 业务期间 | 粒度 | 覆盖 | 延迟 | 状态 | Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 限制 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### 2.1 SIF 供应商观察附录（可选）

| Evidence ID | Source Type | Provider | Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace | Query Scope | Temporal Scope | Coverage / Pagination | Estimation Status | Transformation Type | Raw Result Locator | 与第一方 KPI 的隔离说明 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` |  |  |

> `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文中的对应真实值；若上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

缺失状态只能使用：

```text
not_returned | not_queried | parse_failed | missing | conflicted | true_zero
```

## 3. KPI 合同登记

| Agent Output ID | Metric ID | 定义 | 分子 | 分母 | 单位/币种 | 粒度 | 时区 | 站点/实体 | 归因 | 覆盖要求 | 聚合规则 | Owner | 版本 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | `agent` | `current_rule` | `not_applicable` | `contract_normalization` |

## 4. KPI 读数

| Agent Output ID | Metric ID | 本期值 | 状态 | 覆盖率 | Source latency | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 计算/变换 | 限制 |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` |  |  |  |  |  |

`metric_status`：

```text
computable | not_computable | partial | conflicted
```

## 5. 期间比较

| Agent Output ID | Metric ID | 本期 | 对比期 | 绝对变化 | 相对变化 | 可比状态 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | 限制 |
|---|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `agent` | `period` |  | `comparison` |  |

若对比基数为真实零：

```text
relative_change=undefined
```

## 6. 覆盖与延迟

| Agent Output ID | Metric ID | Record coverage | Time coverage | Entity coverage | Field coverage | Latency | 状态 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` |  |  | `coverage_assessment` |

## 7. 不可计算与冲突项

| Agent Output ID | Metric ID | 状态 | 缺失/冲突字段 | 影响 | 所需责任方 | 精确补数请求 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `agent` |  | `not_applicable` | `gap_classification` |

## 8. 观察与解释上限

- 已观察变化：
- 可支持的关联描述：
- 不可支持的原因/因果表述：
- SIF 供应商观察与第一方 KPI 的分界：

## 9. 证据谱系

| Agent Output ID | Output type | Metric ID | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Rule version | Generated at | Uncertainty |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  |  |  |  |  |  |

## 10. 人工复核

- [ ] KPI 合同字段齐全
- [ ] 分子、分母和覆盖均可追溯
- [ ] 前五类缺失未补零
- [ ] 混合币种、时区、站点和归因已检查
- [ ] SIF 未替代第一方事实或进入 KPI 分子/分母
- [ ] 每个已调用 SIF 工具均在本任务首次 `call` 前完成 `describe`
- [ ] 未重算内置或领域责任方真相
- [ ] 未创建后台任务、告警或推送
- [ ] 无外部写入或经营动作

## 11. 最终状态

```text
report_status=
reason_codes=[]
external_write_status=not_executed
automation_status=not_created
```
