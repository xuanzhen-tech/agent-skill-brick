<!--
文件功能：定义 KPI、来源证据、SIF 供应商观察、Agent 派生读数、覆盖率、比较和状态不变量的字段合同。
职责边界：只规定指标与报表数据合同；SIF 观察必须与第一方 KPI 分栏且不得进入分子或分母；不提供 SP-API/ERP 接入、后台任务、告警或领域事实计算。
重要关联：由上级 SKILL.md 在建立 KPI 合同前读取；交付结构见 assets/templates/kpi-report-template.md。
-->

# KPI 报表合同

## 1. 来源证据

```yaml
evidence_id: ev-...
record_type: first_party_extract | upstream_metric_input | sif_vendor_observation | policy_context
source_type: user_input | uploaded_file | trusted_upstream_output | sif_mcp
evidence_origin: user_uploaded_platform_export | upstream_formal_output | provider_observation | not_applicable
source_locator: ""
source_owner: ""
observed_at: null
business_time: null
retrieved_at: ""
marketplace: ""
entity_scope: []
grain: transaction | order | session | day | week | month | sku | asin | campaign | portfolio
unit_or_currency: ""
coverage:
  expected_records: null
  observed_records: null
  time_coverage: null
  entity_coverage: null
version: ""
fields_used: []
limitations: []
temporal_scope: point_in_time | period | current_rule | historical | scenario
estimation_status: observed | reported | estimated | agent_estimated | not_applicable
transformation_type: raw | reported | normalized | deduplicated | aggregated | translated
```

`null` 表示不适用；`unknown` 表示本应知道但证据缺失。两者不可互换。

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

SIF 原始对象固定 `transformation_type=reported`，按结果自述选择 `estimation_status=reported` 或 `estimated`。每个业务工具首次调用前必须 `describe` 并服从机器 `inputSchema`；当前没有机器 `outputSchema`，不得将 description、`_formatted` 或 `_next_step` 变成结果合同。SIF 观察只能进入供应商观察附录，不能成为第一方 KPI 分子、分母、利润、库存、广告账户或实验事实。

## 2. KPI 合同

```yaml
agent_output_id: ao-...
metric_id: metric-...
name: ""
definition: ""
numerator:
  expression: ""
  evidence_ids: []
denominator:
  expression: ""
  evidence_ids: []
unit_or_currency: ""
grain: ""
time_range: ""
timezone: ""
marketplace: ""
entity_scope: []
attribution_basis: ""
source_latency: ""
coverage_requirement: ""
aggregation_rule: ""
deduplication_rule: ""
zero_denominator_rule: undefined
precision_and_rounding: ""
owner: ""
version: ""
valid_from: ""
valid_until: null
parent_evidence_ids: []
source_type: agent
temporal_scope: current_rule
estimation_status: not_applicable
transformation_type: contract_normalization
```

该对象是 Agent 对用户或领域 owner 已证定义的版本化规范化记录，不是 Agent 自行发明指标。`parent_evidence_ids` 必须指向定义、分子、分母、owner、批准或上游版本证据。即使指标不是比率，也要将不适用的分母明确写成 `not_applicable`，不能留空。

## 3. Agent 读数

```yaml
agent_output_id: ao-...
output_type: metric_contract | kpi_reading | comparison | coverage_assessment | metric_gap
metric_id: metric-...
metric_contract_version: ""
period: ""
value: null
unit_or_currency: ""
metric_status: computable | not_computable | partial | conflicted
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period | current_rule | historical | scenario
estimation_status: not_applicable | agent_estimated
transformation_type: contract_normalization | calculation | comparison | coverage_assessment | gap_classification
transformation_summary: ""
formula_applied: ""
rule_version: kpi-reporting-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
reason_codes: []
```

数字结果的 `parent_evidence_ids` 不得为空。`metric_gap` 可以不含数字，但必须指向造成缺口的来源或合同。

## 4. 缺失状态

| 状态 | 含义 | 可作为 0 |
|---|---|---|
| `not_returned` | schema 或响应没有目标字段 | 否 |
| `not_queried` | 未调用来源 | 否 |
| `parse_failed` | 有响应但无法可靠解析 | 否 |
| `missing` | 合同要求输入但未提供 | 否 |
| `conflicted` | 来源间不能调和 | 否 |
| `true_zero` | 完整覆盖下证据明确为零 | 是 |

前五项不得进入分子、分母、汇总或变化率。

## 5. 比率与聚合

1. 先在合同规定粒度上去重；
2. 先聚合分子和分母，再按合同计算比率；不得默认平均行级比率；
3. 分母为 `true_zero` 时执行合同的 `zero_denominator_rule`，默认不是 0；
4. 混合币种必须有带日期、方向和 Evidence ID 的换算证据，否则 `not_computable`；
5. 混合站点、归因窗口或时区不得无说明聚合；
6. 部分覆盖的结果标 `partial` 并保留分子、分母各自覆盖。

## 6. 期间比较

```yaml
comparison_id: cmp-...
metric_id: metric-...
current_period: ""
comparison_period: ""
comparability_checks:
  same_contract_version: false
  same_timezone: false
  same_marketplace: false
  same_entity_scope: false
  same_grain: false
  same_attribution_basis: false
  comparable_coverage: false
absolute_change: null
relative_change: null
comparison_status: comparable | not_comparable | partial | conflicted
parent_evidence_ids: []
source_type: agent
temporal_scope: period
estimation_status: not_applicable | agent_estimated
transformation_type: comparison
```

比较基数为真实零时，相对变化为 `undefined`；绝对变化仍可在其他条件满足时报告。

## 7. 覆盖与延迟

至少分列：

- `record_coverage`
- `time_coverage`
- `entity_coverage`
- `field_coverage`
- `source_latency`

覆盖率分母不明时输出 `unknown`，不得用现有记录数同时充当分子和分母。

## 8. 报表状态

| 状态 | 允许 | 禁止 |
|---|---|---|
| `ready_for_human_review` | 完整合同、可计算读数、覆盖与限制 | 声称自动刷新 |
| `partial` | 部分读数、缺口、覆盖与影响 | 隐藏不可计算项 |
| `blocked` | 合同草案、数据就绪度 | 生成无支持数字 |
| `out_of_scope` | 责任路由 | 给领域执行动作 |

所有状态下：

```text
automation_status=not_created
external_write_status=not_executed
```

## 9. 责任方交接

向领域责任方提出补数时至少提供：

```text
metric_id
required_field
required_grain
required_period
timezone
marketplace
entity_scope
coverage_requirement
reason
```

不得以“需要更多数据”替代精确缺口。
