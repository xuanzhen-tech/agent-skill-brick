<!--
文件功能：提供 creator dossier 证据、定性门禁、shortlist、rights/disclosure 缺口和合作 brief 的正式模板。
职责边界：模板只支持人工评审，不表示身份已验证、候选已选定、已联系、已签约、已付款或已发布。
重要关联：字段语义见 references/creator-partnership-evidence-contract.md；生成前遵守上级 SKILL.md。
-->

# Creator 合作规划工作包

## 1. 运行摘要

| 字段 | 值 |
|---|---|
| Partnership / Campaign ID |  |
| Brand / Product |  |
| Marketplace / Locale / Channels |  |
| Goal / Period |  |
| Owner / Reviewer |  |
| Generated At / Version |  |
| Result Status | `plan_ready_for_review / blocked / out_of_scope` |
| Reason Codes | `[none]` |
| Outreach Status | `not_contacted` |
| Contract Status | `not_executed` |
| Payment Status | `not_executed` |
| Publish Status | `not_published` |

## 2. 合作要求

| Requirement ID | Definition | Evidence IDs | Owner | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Currentness | Status |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `current_rule` |  |  |  |  |

## 3. Creator 索引

| Agent Output ID | Creator ID | User-provided Handle / Locator | Dossier Date / Version | Source Owner | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Identity Verification Status | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `identity_mapping` | `not_performed / user_confirmed / qualified_owner_confirmed / conflicted` |  |

## 4. Dossier 证据

| Evidence ID | Creator ID | Record Type | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Observed / Business Time | Verified / Valid Until | Fields Used | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## 5. 评价规则

| Criterion ID | Definition | Scale / Values | Weight | Missing Rule | Threshold / Gate | Owner / Version | Parent Evidence IDs | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  | `current_rule` |  |  |

> 用户未提供权重时：`overall_score=not_computable`，`ranking=not_produced`。

## 6. 逐维度判断

| Agent Output ID | Creator ID | Criterion | Assessment | Supporting Evidence | Contradicting Evidence | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Uncertainty | Open Question |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  | `supported / uncertain / blocked / not_applicable / exclude_by_user_rule` |  |  |  | `agent` |  |  |  |  |  |

## 7. Rights / Disclosure

| Record ID | Creator ID | Type | Channels / Territory / Term | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Currentness | Status | Qualified Owner | Parent Evidence IDs | Conclusion Limit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  | 第 09 / 合格责任人 |  |  |

## 8. 商业条件

### 8.1 来源商业条件

| Source Evidence ID | Term ID | Creator ID | Type | Amount / Currency | Tax Basis | Conditions | Parent Evidence IDs | Source Type | Source Locator / Owner | Temporal Scope | Estimation Status | Transformation Type | Approval |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `user_input / uploaded_file / trusted_upstream_output` |  |  |  | `raw / normalized` |  |

`Source Type` 不得为 `agent`；此表不允许覆盖原始金额、币种、条件或批准状态。

### 8.2 Agent 规范化引用（可选）

| Normalized Term ID | Agent Output ID | Creator ID | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Normalization Summary |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  | `not_applicable` | `normalized` |  |

## 9. Shortlist

| Agent Output ID | Creator ID | Decision | Criterion Results | Supporting Evidence | Contradicting Evidence | Currentness | Open Questions | Human Decision | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  | `include_for_review / hold_for_evidence / exclude_by_user_rule` |  |  |  |  |  | required |  | `agent` |  |  |  |

## 10. 合作 Brief

| 字段 | 内容 |
|---|---|
| Brief ID / Creator ID |  |
| Agent Output ID |  |
| Content Intent |  |
| Approved Claim IDs |  |
| Proposed Deliverables |  |
| Asset Requirements / 04 Handoff |  |
| Draft Timeline / Dependencies |  |
| Rights / Disclosure Gaps |  |
| Commercial Term IDs |  |
| Measurement Question / 13 Handoff |  |
| Parent Evidence IDs |  |
| Source Type | `agent` |
| Temporal Scope |  |
| Estimation Status |  |
| Transformation Type |  |

## 11. Agent 派生记录

每个 eligibility、风险、shortlist 决策和 brief 项必须各占一行。

| Agent Output ID | Output Type | Creator / Object ID | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Transformation Summary | Rule Version | Uncertainty | Human Review |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  |  |  |  |  |  |  |

`temporal_scope`、`estimation_status` 和 `transformation_type` 必须使用 `creator-partnership-evidence-contract.md` 派生 schema 的允许值；身份验证仍单独使用 `identity_verification_status`。

## 12. 缺口与人工待办

| Gap ID | Agent Output ID | Creator / Dimension | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Evidence State | Reason Code | Required Resolution | Owner | Effect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` |  | `not_applicable` | `gap_classification` |  |  |  |  |  |

## 13. 人工审核

- [ ] 每位 creator 有稳定 locator 和资料日期
- [ ] 自报、观察、估算和 Agent 假设分开
- [ ] 未将粉丝/互动写成独立验证事实
- [ ] 未采用用户未批准的评分权重
- [ ] rights/disclosure 已由第 09 或合格责任人提供证据
- [ ] 商业金额保留币种、条件和来源
- [ ] PII 已最小化
- [ ] 未调用 Web、抓取、邮件、shell 网络或社媒 API
- [ ] 外联、合同、付款和发布均未执行

## 14. 未执行声明

本工作包没有抓取或验证任何 creator 账号，没有寻找私人联系方式，没有发送邮件或私信，没有谈判、签约、付款、排程或发布。shortlist 仅供人工进一步尽调与审批。
