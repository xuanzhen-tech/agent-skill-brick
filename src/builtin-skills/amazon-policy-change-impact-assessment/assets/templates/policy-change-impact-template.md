<!--
文件功能：提供政策文档、段落差异、翻译、影响、行动、跨专家 handoff 和证据谱系模板。
职责边界：模板不抓取或监控政策，不将占位摘要当原文，也不执行整改或推送。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/policy-change-evidence-contract.md。
-->

# Amazon 政策变更影响评估

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `policy_identity/marketplace` | `<values>` |
| `assessment_mode` | `one_time` |
| `monitoring_status` | `not_running` |
| `as_of` | `<timestamp + timezone>` |
| `status` | `<baseline_only/diff_ready/impact_ready/current_text_missing/version_conflict/blocked>` |

## B. 政策 manifest

| Document ID | Type | Title/Issuer | Marketplace | Language | Publication/Effective/Revision/Provided | Version | Source Path | Completeness | Validity Confirmed By | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<original_text/summary/notice/translation/professional_opinion>` | `<value>` | `<site>` | `<lang>` | `<dates>` | `<version>` | `<path>` | `<status>` | `<owner/unknown>` | `<limits>` |

## C. 列表到详情

| List Record ID | Detail Document ID | Relation | Evidence IDs | Gap |
|---|---|---|---|---|
| `<id>` | `<id/missing>` | `<linked/ambiguous/missing>` | `<ids>` | `<gap>` |

## D. 段落差异

| Diff ID | Old Segment | New Segment | Change Type | Summary | Substantive Status | Evidence IDs | Translation Review |
|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<id>` | `<added/removed/modified/moved_without_substantive_change/unchanged/not_alignable>` | `<summary>` | `<substantive/structural/uncertain>` | `<ids>` | `<status>` |

## E. 影响

| Impact ID | Diff IDs | Affected Object IDs | Mechanism | Applicability | Responsible Expert/Owner | Unknowns | Evidence IDs |
|---|---|---|---|---|---|---|---|
| `<id>` | `<ids>` | `<ids>` | `<chain>` | `<candidate/confirmed_by_qualified_owner/not_applicable_by_qualified_owner>` | `<owner>` | `<unknowns>` | `<ids>` |

## F. 行动与验证

| Action ID | Impact IDs | Action | Owner | Deadline Source/Date | Preconditions | Status | Verification Evidence | Gate |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<ids>` | `<action>` | `<owner>` | `<source/date>` | `<requirements>` | `<proposed/planned/in_progress_reported/verified_completed/blocked>` | `<ids>` | `<hold/go>` |

## G. Policy Impact Handoff

| 字段 | 内容 |
|---|---|
| `policy_evidence_id` | `<id>` |
| `document/diff/impact/action ids` | `<ids>` |
| `marketplace` | `<site>` |
| `publication/effective dates` | `<dates>` |
| `affected objects` | `<ids>` |
| `responsible owners` | `<owners>` |
| `limitations` | `<limits>` |
| `monitoring_status` | `not_running` |
| `consumer` | `amazon-operating-analysis and relevant domain experts` |

## H. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## I. 来源可用性与业务状态

| Record/Field ID | `source_availability_status` | Business `result_status` | Evidence/Coverage | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<baseline_only/diff_ready/impact_ready/...>` | `<ids/scope>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无政策、无变化或无影响。正例：两版完整正文覆盖后删除条款数为 0，记 `true_zero`，业务状态仍独立判断。反例：当前正文未查询，记 `not_queried`，不得写“变化为零”。

## J. 质量门

- [ ] 原文、摘要、翻译和意见分开
- [ ] 列表有正文才分析条款
- [ ] 两版段落级差异可追溯
- [ ] 首次只有一版时 baseline_only
- [ ] 影响和行动有稳定 ID
- [ ] 计划未冒充执行
- [ ] Handoff 未冒充已调用内置 Skill
- [ ] 无 Web/RSS/推送/Cron/监控
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
