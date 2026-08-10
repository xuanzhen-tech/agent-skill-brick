---
contract: collaboration-handoff-contract
version: 2.0.0
cluster: amazon-asin-research-skill-cluster
applies_to: all modules
replaces: all per-module collaboration-handoff-contract copies
---
# 统一协作交接合同

## 合同目的

定义总控与模块间、模块与模块间的交接数据格式、消费条件和禁止行为。所有子 Skill 的跨专家 handoff 节必须引用本文件。

## 交接方向

`
总控 → 子模块：Task Card（任务卡）
子模块 → 总控：Module Result（模块结果）
模块 A → 模块 B：Handoff Package（交接包）
总控 → 总控（内部）：Claim Ledger（主张台账）
`

---

## 一、Task Card（总控→模块）

### Schema

`yaml
task_card:
  case_id: string required
  module: string required  # 五个核心模块名之一
  dataset_version: string required
  marketplace: string required
  own_asins: [string] required
  competitor_asins: [string] required
  parent_child_policy: string required  # parent_only|child_only|all|specified
  period_start: string optional  # ISO date
  period_end: string optional
  granularity: string required  # day|week|month|mixed
  business_questions: [string] required  # 不超过 5 个
  max_claim_level: string required  # L1|L2|L3，按 evidence-claims-contract 速查表
  required_outputs: [string] required  # 必交产物文件名清单
  upstream_artifacts: [string] optional  # 上游模块产出路径
  known_constraints: [string] optional
  deadline_status: string  # normal|expedited
`

### 消费规则

- 模块收到 Task Card 后必须先校验 case_id、marketplace、own_asins、competitor_asins 非空
- max_claim_level 不得超越模块在 evidence-claims-contract 中的最大等级
- 收到含 supersedes 字段的新 Task Card 时，旧任务立即作废，状态改为 superseded

---

## 二、Module Result（模块→总控）

### 最小 Schema（所有模块必须交付）

`yaml
module_result:
  case_id: string required
  module: string required
  module_status: string required  # 来自 module-status-dictionary module_status 枚举
  dataset_version: string required
  scope:
    marketplace: string required
    asins_analyzed: [string] required
    asins_excluded: [string] optional
    period_actual_start: string required
    period_actual_end: string required
    granularity: string required
  comparability:
    overall: string required  # fully_comparable|partially_comparable|not_comparable|single_snapshot
    field_details: [object] required  # 每字段一行：field, status, reason
  quality:
    missing_observations: integer required
    truncation_events: integer required
    field_status_summary: object required  # returned_complete/returned_partial/not_returned/empty_result/query_failed/not_queried 计数
  claims:
    - claim_id: string required
      claim_text: string required
      claim_level: string required  # L0|L1|L2|L3|L4
      claim_status: string required  # 来自 module-status-dictionary claim_status 枚举
      evidence_refs: [string] required
      alternative_explanations: [string] required_if L2+
      falsification_condition: string required_if L3
  artifacts:
    - path: string required
      description: string required
      status: string  # delivered|pending|not_applicable
  limitations: [string] required
  follow_up_requests: [string] optional
`

### 验收规则（总控侧）

- module_status 非 ready 或 ready_with_limits 时，总控不得消费其 claims
- module_status = ready_with_limits 时，总控必须在最终报告中引用其 limitations
- claim_level 超过该模块 max_claim_level 时，总控必须降级或退回
- 多个模块 claim 冲突时，总控必须裁决，不得并列展示后隐去冲突

---

## 三、Handoff Package（模块间交接）

### 最小 Schema

`yaml
handoff_package:
  from_module: string required
  to_module: string required
  case_id: string required
  handoff_purpose: string required  # 为何交接、期望接收方做什么
  evidence:
    - ref: string required  # 源模块 evidence-ledger 中的 ID
      field: string required
      original_value: string required
      provider: string required  # SellerSprite
      tool: string required
      query_time: string required
      limitations: string required
  claims_relevant: [string] required  # 与本次交接相关的 claim_id 清单
  constraints_for_receiver: [string] required  # 接收方不得做的事
  required_response: string  # none|ack|analysis|handoff_back
`

---

## 四、禁止行为

- 模块不得消费非总控正式下发、或状态非 ready/ready_with_limits 的上游产物
- 模块不得将其他模块的 claim 升级后作为自己的一手结论
- 交接包中的 constraints_for_receiver 不可被忽略（如"不得将可见广告词写成真实 Campaign"）
- Handoff 不得替代独立分析：接收方仍需独立核验对象、站点、口径，不可直接复用数值

## 五、冲突处理协议

1. 总控发现两个模块对同一 ASIN/字段/窗口给出冲突 claim 时：
   - 先检查两模块使用的 dataset_version 是否一致
   - 再检查 scope（ASIN范围、期间、粒度）是否一致
   - 若数据集一致但结论冲突，标记为 conflict_unresolved，降级两方 claim 至 L1
   - 若数据集不一致（版本不同），以较新版本为准，旧版本标记 superseded
2. 总控裁决记录在 Claim Ledger 中，包含冲突方、裁决理由、降级后等级r
