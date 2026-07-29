<!--
文件功能：定义异常预检、SIF 供应商观察、基线、阈值、偏离、候选驱动、反证和状态不变量。
职责边界：只规定按需诊断合同；SIF 诊断只能作为候选背景，不拥有第一方基线或因果；不创建后台监控或告警，不输出已证根因或领域执行动作。
重要关联：由上级 SKILL.md 在异常识别前读取；交付结构见 assets/templates/business-anomaly-template.md。
-->

# 经营异常诊断合同

## 1. 分析控制

```yaml
analysis_id: ana-...
metric_id: metric-...
metric_contract_version: ""
analysis_period: ""
timezone: ""
marketplace: ""
entity_scope: []
grain: ""
question: ""
analysis_mode: on_demand
owner: ""
```

`analysis_mode` 固定为 `on_demand`。

## 2. 来源证据

```yaml
evidence_id: ev-...
record_type: metric_observation | event_observation | data_quality_metadata
source_type: user_input | uploaded_file | trusted_upstream_output | sif_mcp
source_locator: ""
source_owner: ""
metric_id: null
business_time: ""
observed_at: ""
retrieved_at: ""
marketplace: ""
entity_scope: []
grain: ""
unit_or_currency: ""
coverage: ""
source_latency: ""
version: ""
limitations: []
temporal_scope: point_in_time | period | historical | current_rule | scenario
estimation_status: observed | reported | estimated | agent_estimated | not_applicable
transformation_type: raw | reported | normalized | deduplicated | aggregated
```

当 `source_type=sif_mcp` 时，同一来源对象必须直接增加：

```yaml
source_provider: sif
source_tool: verified-tool-name
agent_request_id: agent-request-id
tool_call_id: tool-call-id
provider_request_id: provider-id-or-not_returned
query_scope: explicit-object-time-grain-and-filters
coverage_or_pagination: explicit-coverage
raw_result_locator: temp-relative-raw-result-location
```

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的对应真实值；若该上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

SIF 原始对象固定 `transformation_type=reported`，按结果自述选择 `estimation_status=reported` 或 `estimated`。每个业务工具首次调用前必须 `describe` 并只服从机器 `inputSchema`；当前没有机器 `outputSchema`。`analyze_traffic_anomaly` 的结果仍是供应商诊断，只能成为候选驱动的父 Evidence，不得自动升级为根因或因果。

## 3. 数据质量预检

```yaml
precheck_id: pre-...
parent_evidence_ids: []
freshness_status: pass | fail | unknown
latency_status: pass | fail | unknown
coverage_status: pass | fail | unknown
schema_version_status: pass | fail | unknown
grain_status: pass | fail | unknown
timezone_status: pass | fail | unknown
currency_status: pass | fail | unknown
deduplication_status: pass | fail | unknown
missing_states: []
precheck_status: pass | data_quality_issue | blocked
source_type: agent
temporal_scope: point_in_time | period | historical
estimation_status: not_applicable
transformation_type: data_quality_assessment
```

任何必要检查 fail 时不得继续输出无条件经营解释。

## 4. 基线与阈值

```yaml
baseline_id: base-...
metric_id: metric-...
history_period: ""
sample_count: null
seasonality_handling: ""
event_handling: ""
method: ""
parameters: {}
minimum_history_rule: ""
parent_evidence_ids: []
baseline_status: ready | insufficient_history | conflicted
source_type: agent
temporal_scope: historical
estimation_status: not_applicable | agent_estimated
transformation_type: baseline_construction

threshold_id: threshold-...
threshold_source: user_defined | transparently_derived
direction: upper | lower | two_sided
value: null
unit: ""
derivation_summary: ""
parameters: {}
parent_evidence_ids: []
valid_until: null
invalidation_triggers: []
source_type: agent
temporal_scope: current_rule
estimation_status: not_applicable | agent_estimated
transformation_type: direct_carry_forward | threshold_derivation
```

禁止 `threshold_source=industry_default` 或未记录推导过程。

## 5. 偏离

```yaml
agent_output_id: ao-...
output_type: observed_deviation
metric_id: metric-...
observed_value: null
expected_value: null
absolute_deviation: null
relative_deviation: null
threshold_id: threshold-...
parent_evidence_ids: []
source_type: agent
temporal_scope: period
estimation_status: not_applicable | agent_estimated
transformation_type: deviation_calculation
transformation_summary: ""
rule_version: business-anomaly-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
diagnostic_status: anomaly_candidate | insufficient_history | expected_event_effect | data_quality_issue
reason_codes: []
```

expected 为真实零时 `relative_deviation=undefined`。

## 6. 候选驱动链

```yaml
hypothesis_id: hyp-...
observed_deviation_id: ao-...
parent_evidence_ids: []
candidate_driver: ""
candidate_scope: ""
supporting_evidence_ids: []
contradicting_evidence_ids: []
missing_evidence_ids: []
falsification_condition: ""
next_check: ""
domain_owner: ""
source_type: agent
temporal_scope: point_in_time | period
estimation_status: agent_hypothesis
transformation_type: hypothesis
causal_status: not_established
```

`agent_hypothesis` 是候选驱动派生记录专用的 `estimation_status`；它不属于来源证据枚举，也不能替代 observed cause。

没有反证搜寻或可证伪条件的候选不得升级。

## 7. 上下文、分解与缺口派生记录

```yaml
agent_output_id: ao-...
output_type: context_alignment | decomposition | diagnostic_gap
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period
estimation_status: not_applicable | agent_estimated
transformation_type: context_alignment | decomposition | gap_classification
transformation_summary: ""
rule_version: business-anomaly-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
reason_codes: []
```

事件本身仍保留来源 Evidence ID；Agent 只派生时间对齐。分解与缺口记录不得脱离父证据，也不得升级为根因。

## 8. 缺失语义

```text
not_returned
not_queried
parse_failed
missing
conflicted
true_zero
```

前五项不得进入数值补零、基线或阈值推导。

## 9. 状态解释

| 状态 | 含义 |
|---|---|
| `anomaly_candidate` | 偏离超过透明阈值，原因仍未建立 |
| `insufficient_history` | 历史不足以建立所需基线 |
| `expected_event_effect` | 偏离与已证事件一致，但因果仍有限 |
| `data_quality_issue` | 数据质量足以妨碍经营解释 |

不允许 `root_cause_confirmed`。

## 10. 不变量

```text
monitoring_status=not_created
alert_status=not_sent
action_status=not_executed
causal_status=not_established
```

## 11. 交付检查

- KPI 合同和版本明确；
- 数据质量预检优先；
- 阈值来自用户或透明历史；
- 无固定 30%；
- 缺失未补零；
- 支持与反证并列；
- 下一步检查可证伪；
- 无“已证根因”；
- 无后台、告警或执行动作。
