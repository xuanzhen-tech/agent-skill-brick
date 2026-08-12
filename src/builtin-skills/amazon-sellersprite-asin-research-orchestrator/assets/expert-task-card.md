<!--
文件功能：定义总控发送给专家的最小 Task Card，以及专家必须回传并映射到固定七部分报告的最小 Module Result。
职责边界：传递本次任务特有信息、能力预检和授权加工规则；通用证据和禁止推断由各 Skill 自身承担，避免字段爆炸和合同漂移。
重要关联：../SKILL.md、../references/orchestration-runbook.md。
-->

# 专家任务与结果合同

## Task Card

```yaml
case_id: required
task_id: required
module: required
dataset_version: required
marketplace: required
object_scope:
  own_or_target: required
  competitors: optional
  parent_child_policy: required
  variations: optional
period:
  requested_start: optional
  requested_end: optional
  timezone: required
  preferred_granularity: optional
  actual_minimum_qualified_granularity: required_from_capability_precheck
questions: required
report_sections: required
required_visuals: required
capability_precheck:
  capability_landscape_search: required  # relevant MCP categories searched; include excluded categories and rationale
  validated_sources: required
  parameter_behavior: required
  object_scope_actual: required
  time_grain_actual: required
  period_coverage_actual: required
  unit_and_field_semantics: required
  nearest_related_evidence: required
  analysis_route: required
authorized_local_processing:
  - operation: filter | clean | deduplicate | normalize | aggregate | difference | align | code | snapshot_compare
    input_and_scope: required
    reproducible_rule: required
    purpose: required
    prohibited_inference: required
allowed_queries: optional
max_claim_level: required
upstream_refs: optional
```

`report_sections` 只能引用 `overview | price | orders | bsr | rating | reviews | changes`，用于说明本结果支持哪些固定部分，不授权专家编辑 HTML。问题数量由真实研究需要决定，不设固定范围。`allowed_queries` 为空时，专家只消费总控提供的数据；授权补数时必须限定对象、字段、时间和用途。

`capability_precheck` 不是状态表演，而是专家的取数与分析边界：总控必须先宽范围搜索与本模块问题直接或合理关联的 MCP 能力，记录已搜索的能力类别、已验证端点，以及未纳入的类别和理由；不设置 MCP 种类或端点种类上限，也不得因已有局部结果就跳过可能提供交叉验证、反证或因素线索的相关能力。schema 中的参数或字段在实际 `call` 中未验证有效时不得假定可用。专家必须追求最细合格粒度，但可使用总控确认的周/月/快照/逐条记录粒度；不得强迫日级、不得将粗粒度伪装成日级。

`authorized_local_processing` 明确允许以 MCP 原始响应为原料进行可复算加工。若服务端时间参数未验证有效、但原始记录日期语义已验证，可在完整分页原料上本地筛选；不得凭空补值、无依据均摊，或把对象/期间/单位不一致的数据写作同口径数值。

## Module Result

```yaml
case_id: required
task_id: required
module: required
module_status: ready | ready_with_limits | needs_more_evidence | failed | not_applicable
dataset_version: required
scope_actual:
  object_scope: required
  period_and_timezone: required
  actual_granularity: required
  units_or_semantics: required
  pagination_or_coverage: required
parameter_behavior_relevant_to_result: required
data_quality: required
local_processing_applied: required
claims: required
related_evidence_and_analysis_route: required
visuals:
  - visual_id: required
    status: ready | baseline_only | evidence_signal | not_comparable | needs_more_evidence
    status_reason: required
    chart_type: optional
    title: required
    data_nature: observed | estimated | derived | local_snapshot_diff | evidence_signal
    scope: required
    period: optional
    granularity: required
    data: required_when_ready_or_evidence_signal
    evidence_refs: required
    limitations: required
event_factor_inputs: optional
  # material signals: observed result, direct factors, indirect factors, alternatives, validation evidence
evidence_refs: required
limitations: required
follow_up_requests: optional
artifacts_temp: required
```

专家不得复制原始响应、生成或编辑用户 Report、隐藏原料的实际粒度/对象范围或使用模板数据填充 `data`。当直接目标字段不足时，专家应返回经审查的邻近关联证据和它可支持的分析路线；总控决定跨模块因素链与最终叙述。HTML 模板只由总控复制和编辑。
