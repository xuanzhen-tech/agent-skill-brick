<!--
文件功能：定义 POA 通知、根因输入、行动状态、陈述证据映射、附件索引和草案状态合同。
职责边界：只约束证据化草案，不生成新根因、不提交申诉、不保证恢复。
重要关联：由 ../SKILL.md 在 POA 准备时读取；正式字段映射到 ../assets/templates/poa-evidence-and-draft-template.md。
-->

# POA 证据与草案合同

## 1. 输入对象

### `notice_record`

- `notice_evidence_id`
- `account_scope_id_masked`
- `marketplace_id`
- `object_scope`
- `notice_date/deadline/timezone`
- `issue_reported`
- `request_reported`
- `source_path`
- `completeness`

### `rca_handoff`

- `root_cause_id`
- `enforcement_event_ids`
- `root_cause_statement`
- `causal_link_ids`
- `support_status`
- `unknowns/limitations`
- `human_approval_status`
- `policy_or_ip_evidence_ids`

没有可用 `root_cause_id` 时不得产生完整 POA。

## 2. 行动状态

只允许：

| 状态 | 含义 | 可否写成已完成 |
|---|---|---|
| `verified_completed` | 范围、日期和执行证据已核对 | 是 |
| `user_claimed_unverified` | 用户声称完成但证据不足 | 否 |
| `planned` | 尚未执行或仅有计划 | 否 |
| `blocked` | 明确依赖阻塞 | 否 |

行动类型为 `containment`、`immediate_correction`、`corrective_action`、`preventive_control` 或 `effectiveness_verification`。

## 3. 陈述—证据映射

| 字段 | 约束 |
|---|---|
| `statement_id` | 稳定编号 |
| `section` | root cause/correction/prevention/verification |
| `statement_text` | 草案中的事实陈述 |
| `claim_type` | observed/inferred/action_completed/action_planned |
| `parent_evidence_ids` | 必填 |
| `support_status` | supported/partially_supported/unsupported/conflicted |
| `limitations` | 缺口、冲突、范围 |
| `human_review_status` | pending/approved/rejected |

`unsupported`、`conflicted` 或未经人工审核的高风险陈述不得进入提交候选。

## 4. 附件索引

- `attachment_id`
- `safe_display_name`
- `source_path`
- `supported_statement_or_action_ids`
- `document_date/provider/scope`
- `version_or_hash`
- `language/translation_status`
- `redaction_status`
- `completeness/conflicts`
- `human_review_status`

## 5. 草案状态

正式草案状态只能是 `draft_for_human_review`。交付中禁止使用 `submitted`、`accepted`、`reinstated` 等未经外部证据证明的状态。

## 6. 证据谱系

输入记录 `evidence_id`、`source_path`、`source_type`、`evidence_class`、范围和四轴；Agent 输出记录 `parent_evidence_ids`、转换方法、支持状态和结论上限。

## 7. 不变量

- 通知、根因、行动和附件范围一致；
- POA 不重新做 RCA；
- 已完成动作必须有执行证据；
- 完成与有效性分开；
- 政策/IP判断来自第09或合格责任方；
- 所有交付都保留人工审核门。

## 8. 来源可用性与业务状态

`source_availability_status` 与 POA `workflow_status/action_status/support_status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无问题、无附件需求或无风险；`true_zero` 仅用于完整可验证覆盖明确为零的计数。

正例：完整陈述—证据矩阵确认未支持陈述数为 0，可记 `true_zero`，草案仍是 `draft_for_human_review`。反例：附件无法解析时记 `parse_failed` 并保持 `attachment_gap`，不能写“无需附件”。
