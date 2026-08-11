<!--
文件功能：定义总控发送给专家的最小 Task Card，以及专家必须回传的最小 Module Result。
职责边界：只传递本次任务特有信息；通用证据和禁止推断由各 Skill 自身承担，避免字段爆炸和合同漂移。
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
  start: optional
  end: optional
  granularity: required
  timezone: required
questions: required
required_visuals: required
allowed_queries: optional
max_claim_level: required
upstream_refs: optional
```

问题数量由真实研究需要决定，不设固定范围。`allowed_queries` 为空时，专家只消费总控提供的数据；授权补数时必须限定对象、字段、时间和用途。

## Module Result

```yaml
case_id: required
task_id: required
module: required
module_status: ready | ready_with_limits | blocked | failed | not_applicable
dataset_version: required
scope_actual: required
data_quality: required
claims: required
visuals:
  - visual_id: required
    status: ready | baseline_only | unavailable | not_comparable | blocked
    status_reason: required
    chart_type: optional
    title: required
    data_nature: observed | estimated | derived | local_snapshot_diff
    scope: required
    period: optional
    data: required_when_ready
    evidence_refs: required
    limitations: required
evidence_refs: required
limitations: required
follow_up_requests: optional
artifacts_temp: required
```

专家不得复制原始响应、生成独立用户 Report、隐藏核心视觉需求或使用模板数据填充 `data`。
