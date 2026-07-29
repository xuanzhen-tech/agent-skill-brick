<!--
文件功能：提供 POA 证据准备、行动状态、陈述映射、附件索引、草案和人工审核模板。
职责边界：模板不生成根因、不表示已提交或已恢复；所有占位内容都必须由证据替换。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/poa-evidence-and-draft-contract.md。
-->

# Amazon POA 证据与草案

## A. 元数据与状态

| 字段 | 内容 |
|---|---|
| `poa_case_id` | `<case-id>` |
| `account/marketplace/object scope` | `<masked values>` |
| `notice evidence/date/deadline` | `<id + dates + timezone>` |
| `root_cause_id/status` | `<id/status>` |
| `as_of` | `<timestamp + timezone>` |
| `workflow_status` | `<poa_ready_for_drafting/notice_missing/root_cause_missing/action_evidence_incomplete/attachment_gap/material_conflict/draft_for_human_review/blocked>` |
| `submission_status` | `not_submitted_by_this_skill` |
| `conclusion_limit` | `不保证 Amazon 接受或账号恢复` |

## B. Amazon 通知要求

| Requirement ID | Amazon Reported Issue/Request | Original Evidence ID | Scope | Completeness | Interpretation Limit |
|---|---|---|---|---|---|
| `<id>` | `<verbatim-safe summary>` | `<id>` | `<scope>` | `<complete/partial>` | `<limit>` |

## C. RCA 交接

| Root Cause ID | Enforcement Event IDs | Root Cause Statement | Causal Link IDs | Support | Unknowns/Limitations | Human Approval |
|---|---|---|---|---|---|---|
| `<id>` | `<ids>` | `<statement>` | `<ids>` | `<status>` | `<items>` | `<status>` |

## D. 行动状态

| Action ID | Type | Action | Root Cause ID | Owner | Planned/Completed Date | Status | Completion Evidence IDs | Effectiveness Evidence/Requirement |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<containment/immediate_correction/corrective_action/preventive_control/effectiveness_verification>` | `<action>` | `<id>` | `<owner>` | `<date>` | `<verified_completed/user_claimed_unverified/planned/blocked>` | `<ids>` | `<ids/requirement>` |

## E. 陈述—证据映射

| Statement ID | Section | Statement | Claim Type | Parent Evidence IDs | Support Status | Limitations | Human Review |
|---|---|---|---|---|---|---|---|
| `<id>` | `<root cause/correction/prevention/verification>` | `<statement>` | `<observed/inferred/action_completed/action_planned>` | `<ids>` | `<supported/partially_supported/unsupported/conflicted>` | `<limits>` | `<pending/approved/rejected>` |

## F. 附件索引

| Attachment ID | Safe Name | Source Path | Supports Statement/Action IDs | Date/Provider/Scope | Version/Hash | Language/Translation | Redaction | Completeness/Conflict | Human Review |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<name>` | `<path>` | `<ids>` | `<values>` | `<value>` | `<value>` | `<status>` | `<status>` | `<status>` |

## G. POA 草案

> 状态：`draft_for_human_review`

### 1. 通知与范围

`<只写可证实的通知、账号、站点和对象范围。>`

### 2. 已证实根因

`<只引用已批准 root_cause_id，不添加新根因。>`

### 3. 立即纠正

`<只有 verified_completed 才使用完成时；其他状态明确标记。>`

### 4. 预防控制

`<区分已完成控制、计划动作和阻塞。>`

### 5. 有效性验证

`<说明已存在的验证证据或未来验证方法，不把动作完成等同于有效。>`

### 6. 附件

`<使用 attachment_id 引用。>`

## H. 证据缺口

| Gap ID | Missing/Conflicting Item | Blocks Which Statement/Action | Required Evidence | Owner | Due | Status |
|---|---|---|---|---|---|---|
| `<id>` | `<item>` | `<ids>` | `<requirement>` | `<owner>` | `<date>` | `<open/blocked/resolved>` |

## I. 证据谱系

| Record ID | Layer | Evidence Class | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<class>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## J. 来源可用性与业务状态

| Notice/Root Cause/Action/Attachment Field ID | `source_availability_status` | Business `workflow/action/support status` | Evidence Scope | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<POA status>` | `<ids/scope>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无问题、无附件需求或无风险。正例：完整映射确认未支持陈述数为 0，记 `true_zero`，草案仍为 `draft_for_human_review`。反例：附件不可解析，记 `parse_failed` 并保持 `attachment_gap`，不得写“无需附件”。

## K. 人工审核清单

- [ ] 通知问题和范围与原文一致
- [ ] `root_cause_id` 有充分支持且未被改写
- [ ] 所有完成式动作均为 `verified_completed`
- [ ] 每项陈述有证据映射
- [ ] 附件完整、可读且已遮蔽不必要敏感信息
- [ ] 政策、法律、IP和产品安全判断已由适格责任方复核
- [ ] 草案未承诺接受或恢复
- [ ] 最终提交由授权人员在当前 Seller Central 界面人工完成
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
