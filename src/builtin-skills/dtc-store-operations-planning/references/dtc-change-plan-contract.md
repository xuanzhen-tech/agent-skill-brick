<!--
文件功能：定义 DTC 店铺快照、对象身份、变更计划、审批、回滚、验证和跨专家交接的稳定字段合同。
职责边界：只描述人工计划与证据结构，不提供 Shopify 或其他店铺平台连接和写操作实现。
重要关联：由上级 SKILL.md 在规划前读取；正式输出结构见 assets/templates/dtc-store-change-plan-template.md。
-->

# DTC 变更计划合同

## 1. 店铺快照

```yaml
source_snapshot_id: snapshot-...
store_id: ""
platform: ""
environment: production | staging | unknown
marketplace_or_site: ""
locale: ""
source_type: user_input | uploaded_file | trusted_upstream_output
source_locator: ""
exported_by: ""
observed_at: ""
business_time: null
retrieved_at: ""
object_types: []
object_count_or_coverage: ""
version: ""
verified_at: ""
valid_until: null
invalidation_triggers: []
limitations: []
temporal_scope: point_in_time
estimation_status: observed | reported
transformation_type: raw | normalized | excerpted
```

`object_count_or_coverage` 不完整时不得把未出现对象解释为不存在。

## 2. 对象身份

```yaml
object_id: object-...
agent_output_id: ao-...
output_type: object_identity_mapping
object_type: product | variant | collection | page | menu | theme | order | inventory_record | promotion_config | customer_config | policy_config | other
platform_object_id_masked: ""
sku_or_variant: null
market_or_locale: ""
source_snapshot_id: snapshot-...
current_value_locator: ""
identity_confidence: confirmed | ambiguous | conflicted
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time
estimation_status: not_applicable
transformation_type: identity_mapping
```

`identity_mapping` 只表示把快照对象映射到稳定内部 ID；`ambiguous/conflicted` 对象不能进入 ready change plan。

## 3. 变更记录

```yaml
change_id: change-...
object_id: object-...
source_snapshot_id: snapshot-...
requested_change: ""
request_source: user | domain_owner
current_value_evidence_ids: []
target_value_or_state: ""
preconditions: []
domain_owner: ""
approval_status: pending | approved | rejected | changes_requested | unknown
approval_evidence_ids: []
dependencies: []
rollback_plan_id: rollback-...
verification_plan_id: verify-...
parent_evidence_ids: []
agent_output_id: ao-...
source_type: agent
temporal_scope: point_in_time
estimation_status: not_applicable
transformation_type: normalized | excerpted
transformation_summary: ""
rule_version: dtc-change-plan-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
human_review_status: pending
execution_status: not_executed
```

Agent 不得把自己提出的建议写成 `request_source=user/domain_owner`。四轴必须逐字段保存在每条正式变更派生记录中，且不得省略 `parent_evidence_ids`。

## 4. 回滚计划

```yaml
rollback_plan_id: rollback-...
agent_output_id: ao-...
output_type: rollback_plan
change_id: change-...
rollback_trigger: ""
restore_target: ""
restore_target_evidence_ids: []
owner: ""
dependencies: []
verification_criteria: []
known_non_reversible_limits: []
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time
estimation_status: not_applicable
transformation_type: normalized | excerpted
status: drafted_for_review | blocked_missing_restore_evidence
execution_status: not_executed
```

没有已知恢复值时必须 blocked，不得写“恢复原值”而不说明原值。

## 5. 验证计划

```yaml
verification_plan_id: verify-...
agent_output_id: ao-...
output_type: verification_plan
change_id: change-...
object_and_field_to_check: ""
expected_state: ""
evidence_capture_requirement: ""
verification_window: ""
owner: ""
failure_route: ""
event_label: ""
measurement_question: ""
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time
estimation_status: not_applicable
transformation_type: normalized | excerpted
status: drafted_for_review | blocked_missing_criteria
execution_status: not_executed
```

本字段只定义检查，不声称已验证。

### 正式 Gap 对象

```yaml
gap_id: gap-...
agent_output_id: ao-...
output_type: evidence_gap
affected_change_or_object_id: ""
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time
estimation_status: not_applicable
transformation_type: gap_classification
evidence_state: not_returned | not_queried | parse_failed | missing | conflicted
reason_code: missing_store_snapshot | missing_requested_change | missing_domain_input | stale_or_conflicted | missing_approval
required_input_or_decision: ""
owner: ""
effect: ""
```

`parent_evidence_ids` 优先保存已有、冲突或失效的快照及领域证据；只有目标来源完全未提供时可为空。Gap 是 Agent 的证据状态分类，不表示对象不存在、数值为零或任何变更已执行。

## 6. 领域输入

| Domain | Required Upstream Object |
|---|---|
| Listing | 第 03 批准的内容 ID/version |
| Visual | 第 04 批准资产 ID/version |
| Promotion | 第 06 `approved_promotion_brief_id` |
| Procurement | 第 07 正式 action candidate |
| Inventory/Fulfillment | 第 08 或内置库存正式输出 |
| Policy/Consent/Tax | 第 09 当前证据 |
| Customer Service | 第 11 案件/模板 handoff |
| Measurement | 第 13 协议或字段要求 |
| Price/Margin | 第 14 `approved_for_planning` 护栏或内置正式输出 |

上游对象缺版本、Evidence ID 或适用范围时使用 `missing_domain_input`。

## 7. 顶层状态

```yaml
result_status: change_plan_ready_for_review | blocked | out_of_scope
reason_codes:
  - none
execution_status: not_executed
```

允许 reason：

```text
none
missing_store_snapshot
missing_requested_change
missing_domain_input
stale_or_conflicted
missing_approval
out_of_scope
```

组合：

- ready → 仅 `[none]`；
- blocked → 至少一个缺口；
- out_of_scope → 仅 `[out_of_scope]`；
- approval approved 仍不表示执行。

## 8. 当前性与失效

下列任一事件触发重新核对：

- 快照对象或版本更新；
- 商品/变体身份改变；
- 上游 Listing/visual/promotion/policy/guardrail 版本变化；
- 变更窗口结束；
- 权限或 owner 改变；
- rollback target 不再可用；
- 用户明确撤销。

不设固定陈旧天数。

## 9. 缺失语义

| 值 | 含义 |
|---|---|
| `not_queried` | 本包没有查询外部店铺 |
| `not_returned` | 合法快照没有该字段 |
| `parse_failed` | 文件存在但不能可靠解析 |
| `missing` | 必要输入不存在 |
| `conflicted` | 对象或值冲突 |
| `true_zero` | 完整覆盖证明的真实零 |

前五项不得进入数值或状态结论。

## 10. 禁止路径

- Shopify 文档 → 店铺当前事实；
- SIF Amazon 供应商观察 → DTC 库存/订单/折扣；
- web/shell/API → 补快照；
- Agent 建议 → 已批准 requested change；
- approval → executed；
- `rollback_plan` → 已回滚；
- `verification_plan` → 已验证；
- 缺库存字段 → 库存 0；
- 无折扣记录 → 无折扣。

## 11. 交付检查

- store/environment/snapshot 唯一；
- object identity 稳定；
- 每个 change 有 request source；
- 每个 change 有前置、owner、审批、回滚、验证和 Evidence；
- 领域输入按责任路由；
- PII 和凭据未进入输出；
- 状态组合合法；
- 所有执行状态为 `not_executed`。
