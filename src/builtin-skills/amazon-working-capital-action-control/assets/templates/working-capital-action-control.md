<!--
文件功能：承载既有领域 action 的资金影响、状态证据、依赖和人工门禁议程。
职责边界：模板不生成或修改 action，不代表审批、承诺或执行，也不发送任何外部指令。
重要关联：../../SKILL.md 定义流程；../../references/working-capital-action-contract.md 定义字段与状态。
-->

# 营运资金行动控制

## 1. 控制批次

- `case_id`: `{{CASE_ID}}`
- `control_batch_id`: `{{CONTROL_BATCH_ID}}`
- `created_at`: `{{CREATED_AT}}`
- `control_status`: `{{CONTROL_STATUS}}`
- `marketplace`: `{{MARKETPLACE}}`
- `account_or_entity`: `{{ACCOUNT_OR_ENTITY}}`
- `output_evidence_id`: `{{OUTPUT_EVIDENCE_ID}}`
- `parent_evidence_ids`: `{{PARENT_EVIDENCE_IDS}}`
- `source_type`: `agent`
- `temporal_scope`: `{{TEMPORAL_SCOPE}}`
- `estimation_status`: `not_applicable`
- `transformation_type`: `gate_assessment`

## 2. 内置现金流情景

- `cashflow_output_id`: `{{CASHFLOW_OUTPUT_ID}}`
- `cashflow_output_version`: `{{CASHFLOW_OUTPUT_VERSION}}`
- `cashflow_scenario_id`: `{{CASHFLOW_SCENARIO_ID}}`
- `currency`: `{{CURRENCY}}`
- `time_range`: `{{TIME_RANGE}}`
- `timezone`: `{{TIMEZONE}}`
- `upstream_limitations`: `{{UPSTREAM_LIMITATIONS}}`

## 3. 来源行动登记

| source_action_id | action_source/version | domain_owner | 行动摘要（原样） | cashflow_scenario_id | output_evidence_id | control_status | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{SOURCE_ACTION_ID}}` | `{{ACTION_SOURCE_AND_VERSION}}` | `{{DOMAIN_OWNER}}` | `{{SOURCE_ACTION_SUMMARY}}` | `{{CASHFLOW_SCENARIO_ID}}` | `{{OUTPUT_EVIDENCE_ID}}` | `{{CONTROL_STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `gate_assessment` |

> 本表不得改写来源行动的数量、金额、时点、对象或条件。

## 4. 资金影响

| source_action_id | amount | currency | direction | date/range | basis | estimation_status | evidence_id |
|---|---:|---|---|---|---|---|---|
| `{{SOURCE_ACTION_ID}}` | `{{AMOUNT}}` | `{{CURRENCY}}` | `{{DIRECTION}}` | `{{DATE_OR_RANGE}}` | `{{BASIS}}` | `{{ESTIMATION_STATUS}}` | `{{EVIDENCE_ID}}` |

## 5. 可推迟性

- `deferrability_evidence_id`: `{{DEFERRABILITY_EVIDENCE_ID}}`
- `deferrability_status`: `{{DEFERRABILITY_STATUS}}`
- `allowed_window`: `{{ALLOWED_WINDOW}}`
- `conditions`: `{{CONDITIONS}}`
- `approver_or_owner`: `{{APPROVER_OR_OWNER}}`
- `effective_from`: `{{EFFECTIVE_FROM}}`
- `effective_to`: `{{EFFECTIVE_TO}}`

没有证据时使用明确缺失状态并阻断，不由 Agent 判断可推迟。

## 6. 审批与承诺

| source_action_id | approval_state | approval_evidence_ids | commitment_state | commitment_evidence_ids | observed_at |
|---|---|---|---|---|---|
| `{{SOURCE_ACTION_ID}}` | `{{APPROVAL_STATE}}` | `{{APPROVAL_EVIDENCE_IDS}}` | `{{COMMITMENT_STATE}}` | `{{COMMITMENT_EVIDENCE_IDS}}` | `{{OBSERVED_AT}}` |

审批和承诺是两条独立证据链；不得互相推断。

## 7. 依赖与限制

| dependency_id | dependency_type | required_state | observed_state | owner | due_at | evidence_id | missing_status |
|---|---|---|---|---|---|---|---|
| `{{DEPENDENCY_ID}}` | `{{DEPENDENCY_TYPE}}` | `{{REQUIRED_STATE}}` | `{{OBSERVED_STATE}}` | `{{OWNER}}` | `{{DUE_AT}}` | `{{EVIDENCE_ID}}` | `{{MISSING_STATUS}}` |

## 8. 证据登记

| evidence_id | source_type | temporal_scope | estimation_status | transformation_type | source locator | limitations |
|---|---|---|---|---|---|---|
| `{{EVIDENCE_ID}}` | `{{SOURCE_TYPE}}` | `{{TEMPORAL_SCOPE}}` | `{{ESTIMATION_STATUS}}` | `{{TRANSFORMATION_TYPE}}` | `{{SOURCE_LOCATOR}}` | `{{LIMITATIONS}}` |

## 9. Agent 输出谱系

| output_evidence_id | output_type | decision_status | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | limitations |
|---|---|---|---|---|---|---|---|---|
| `{{OUTPUT_EVIDENCE_ID}}` | `{{OUTPUT_TYPE}}` | `{{DECISION_STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `{{TRANSFORMATION_TYPE}}` | `{{LIMITATIONS}}` |

### 9.1 冲突分类

| conflict_id | output_evidence_id | source_action_ids | conflicted_fields | decision_status | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|
| `{{CONFLICT_ID}}` | `{{CONFLICT_OUTPUT_EVIDENCE_ID}}` | `{{SOURCE_ACTION_IDS}}` | `{{CONFLICTED_FIELDS}}` | `{{CONFLICT_DECISION_STATUS}}` | `{{CONFLICT_PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `conflict_classification` |

### 9.2 缺口分类

| gap_id | output_evidence_id | source_action_id | missing_status | affected_field_or_evidence | impact | owner | next_step | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{GAP_ID}}` | `{{GAP_OUTPUT_EVIDENCE_ID}}` | `{{SOURCE_ACTION_ID}}` | `{{MISSING_STATUS}}` | `{{AFFECTED_FIELD_OR_EVIDENCE}}` | `{{IMPACT}}` | `{{OWNER}}` | `{{NEXT_STEP}}` | `{{GAP_PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `gap_classification` |

## 10. 人工门禁议程

| agenda_id | output_evidence_id | source_action_id | 待人工决定 | 决定责任方 | 证据截止/有效期 | 阻断项 | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{AGENDA_ID}}` | `{{OUTPUT_EVIDENCE_ID}}` | `{{SOURCE_ACTION_ID}}` | `{{HUMAN_DECISION}}` | `{{DECISION_OWNER}}` | `{{EVIDENCE_DUE_OR_VALIDITY}}` | `{{BLOCKER}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `agenda_ordering` |

议程顺序仅反映可证截止日和依赖，不代表 Agent 给出的经营优先级。

## 11. 返回领域 owner 的变更请求

| request_id | output_evidence_id | source_action_id | 请求核验/变更的字段 | 原因与证据 | domain_owner | 状态 | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `{{REQUEST_ID}}` | `{{OUTPUT_EVIDENCE_ID}}` | `{{SOURCE_ACTION_ID}}` | `{{FIELD}}` | `{{REASON_AND_EVIDENCE}}` | `{{DOMAIN_OWNER}}` | `{{STATUS}}` | `{{PARENT_EVIDENCE_IDS}}` | `agent` | `{{TEMPORAL_SCOPE}}` | `not_applicable` | `verification_request` |

本节只发起人工核验请求，不直接修改来源 action。

## 12. 非执行声明

本记录只组织人工门禁。它未发明或修改任何领域行动，也未执行审批、延期、取消、采购、补货、广告、促销、付款、融资或平台操作。
