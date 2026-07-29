<!--
文件功能：定义邮件 lifecycle、audience、consent、suppression、流程节点、内容声明、状态与测量交接字段。
职责边界：只描述静态设计和证据合同，不提供联系人采集、ESP 连接、名单上传、排程或发送实现。
重要关联：由上级 SKILL.md 在设计前读取；正式输出结构见 assets/templates/email-lifecycle-campaign-template.md。
-->

# 邮件生命周期证据合同

## 1. 来源证据

```yaml
evidence_id: ev-...
record_type: lifecycle_definition | audience_rule | consent_record_set | suppression_record_set | email_rule | brand_fact | product_fact | approved_claim | promotion_brief | historical_result
source_type: user_input | uploaded_file | trusted_upstream_output
source_locator: ""
source_owner: ""
observed_at: null
business_time: null
retrieved_at: ""
applicable_scope: ""
locale: ""
version: ""
verified_at: ""
valid_until: null
invalidation_triggers: []
fields_used: []
limitations: []
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: observed | reported | estimated | not_applicable
transformation_type: raw | normalized | excerpted | aggregated | translated
```

正式输出不包含原始邮箱或联系人 PII。

## 2. Consent/suppression 集合

```yaml
permission_set_id: permission-...
evidence_id: ev-...
permission_type: consent | suppression
audience_scope: ""
channel: email
market_or_jurisdiction: ""
purpose: ""
source_type: user_input | uploaded_file | trusted_upstream_output
source_locator: ""
captured_or_updated_at: ""
version: ""
verified_at: ""
valid_until: null
withdrawal_or_expiry_semantics: ""
coverage: ""
limitations: []
parent_evidence_ids: []
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: observed | reported | not_applicable
transformation_type: raw | normalized | excerpted
policy_evidence_ids: []
qualified_owner: expert-09-or-other
status: supported | missing | conflicted | stale | requires_qualified_review
```

第 12 只消费 `status` 与限制，不自行升级为法律结论。

## 3. Audience 规则

```yaml
audience_rule_id: audience-...
agent_output_id: ao-...
output_type: audience_rule
definition: ""
include_conditions: []
exclude_conditions: []
consent_evidence_requirements: []
suppression_set_ids: []
market_or_locale: ""
version: ""
verified_at: ""
valid_until: null
missing_data_behavior: exclude_and_block | route_for_review
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: estimated | not_applicable
transformation_type: normalized | excerpted | aggregated | translated
```

来源层的用户 audience rule 仍单独保存为 Evidence；本对象是 Agent 基于合法输入形成的集合规则。禁止 `missing_data_behavior=assume_eligible`。

## 4. 流程节点

```yaml
agent_output_id: ao-...
campaign_id: campaign-...
node_id: node-...
output_type: audience_rule | trigger | branch | exclusion | wait | exit | message | draft_segment | email_draft | claim_map_entry | measurement_handoff
condition_or_rule: ""
source_fields: []
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: estimated | not_applicable
transformation_type: normalized | excerpted | aggregated | translated
evaluation_time_or_timezone: ""
missing_behavior: block | exclude | route_for_review
conflict_behavior: block | route_for_review
next_node_ids: []
owner: ""
invalidation_triggers: []
transformation_summary: ""
rule_version: email-lifecycle-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
human_review_status: pending
```

wait/frequency 值必须链接用户或第 09 当前 Evidence，不能硬编码。每个 trigger、branch、exclusion、wait、exit、draft segment 和 measurement handoff 都必须按该派生 schema 登记四轴与 `parent_evidence_ids`。

## 5. 内容草稿

```yaml
email_draft_id: email-...
agent_output_id: ao-...
output_type: email_draft
campaign_id: campaign-...
node_id: node-...
lifecycle_stage: ""
content_intent: ""
locale: ""
subject_draft: ""
preheader_draft: ""
body_draft: ""
cta_draft: ""
approved_claim_ids: []
asset_requirements: []
approved_promotion_brief_id: null
policy_evidence_ids: []
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: estimated | not_applicable
transformation_type: normalized | excerpted | aggregated | translated
human_review_status: pending
send_status: not_sent
```

缺 consent/suppression 时不得创建此对象；只创建 evidence gap。

## 6. Claim map

| Agent Output ID | Statement ID | Draft Location | Text | Claim IDs | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Support | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` |  |  |  | `supported / conditional / unsupported / conflicted` |  |

`unsupported/conflicted` 不得进入 ready 草稿；`conditional` 保留条件。

## 7. 测量交接

```yaml
measurement_handoff_id: measure-...
agent_output_id: ao-...
output_type: measurement_handoff
campaign_id: campaign-...
measurement_question: ""
event_label: ""
intervention_id: ""
desired_metric: ""
analysis_scope: ""
required_exposure_fields: []
required_outcome_fields: []
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: estimated | not_applicable
transformation_type: normalized | excerpted | aggregated | translated
owner: expert-13
```

本包不定义最终 metric formula、归因、实验分流或因果结论。

### 正式 Gap 对象

```yaml
gap_id: gap-...
agent_output_id: ao-...
output_type: evidence_gap
affected_campaign_or_object_id: ""
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period | current_rule | historical
estimation_status: not_applicable
transformation_type: gap_classification
evidence_state: not_returned | not_queried | parse_failed | missing | conflicted
reason_code: missing_lifecycle_definition | missing_consent_evidence | missing_suppression_evidence | missing_current_rule | stale_or_conflicted | missing_approval
required_resolution: ""
owner: ""
campaign_effect: ""
```

`parent_evidence_ids` 优先保存已有、冲突或失效的 consent、suppression、规则或批准 Evidence；只有目标来源完全未提供时可为空。Gap 不得被转换成 eligible、consented、not_suppressed 或指标零值。

## 8. 顶层状态

| Result | Reason | Campaign | Send | Schedule |
|---|---|---|---|---|
| `draft_for_review` | `[none]` | `draft_for_review` | `not_sent` | `not_scheduled` |
| `blocked` | 至少一个缺口 | `not_created` | `not_sent` | `not_scheduled` |
| `out_of_scope` | `[out_of_scope]` | `not_created` | `not_sent` | `not_scheduled` |

允许 reason：

```text
none
missing_lifecycle_definition
missing_consent_evidence
missing_suppression_evidence
missing_current_rule
stale_or_conflicted
missing_approval
out_of_scope
```

## 9. 当前性

以下事件使计划需要重审：

- consent basis、purpose、jurisdiction 或 policy 变化；
- suppression 集合更新；
- audience 规则、lifecycle 定义或数据字段变化；
- 促销 brief 过期/撤销；
- claim 或品牌资产版本变化；
- wait/frequency/quiet-period 规则变化；
- campaign scope 或 locale 改变。

不设默认失效天数。

## 10. 缺失语义

- `not_queried`：本包未查询 ESP/CRM；
- `not_returned`：合法输入没有字段；
- `parse_failed`：文件无法可靠解析；
- `missing`：必要集合或规则缺失；
- `conflicted`：许可/抑制/规则冲突；
- `true_zero`：完整覆盖证明的真实零。

只有 `true_zero` 可作为 0。其余不得推导 eligible 或“无退订”。

## 11. 禁止路径

- 公共信息 → 邮箱地址；
- 订单/姓名 → consent；
- 没有 suppression 文件 → 无退订；
- SIF → ESP 送达/打开/点击/转化；
- 默认行业天数 → wait/frequency；
- campaign draft → 已配置；
- `email_send` 可见 ≠ 获得发送授权；
- 历史前后差异 → 因果；
- 第 12 规则 → 第 09 合规裁定。

## 12. 交付检查

- audience/lifecycle 有稳定版本；
- consent/suppression 当前且范围匹配；
- 缺失不推定 eligible；
- 流程节点有 missing/conflict behavior；
- wait/frequency 有来源；
- 内容 claim 有 Evidence；
- 促销引用第 06；
- 测量交第 13；
- 无 PII/凭据/名单；
- campaign/send/schedule 状态合法。
