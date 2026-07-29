<!--
文件功能：提供合法账号运营的实体关系、访问权限、材料一致性、敏感变更、事件和控制路线图模板。
职责边界：模板不得用于设计反检测、身份伪造、代理轮换或封禁规避；占位状态不是事实。
重要关联：由 ../../SKILL.md 物化；字段和硬拒绝遵循 ../../references/account-operational-risk-control-contract.md。
-->

# Amazon 账号运营风险控制

## A. 元数据与安全筛查

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `entity/account/marketplace scope` | `<masked values>` |
| `as_of` | `<timestamp + timezone>` |
| `assessment_status` | `<control_assessment_ready/entity_incomplete/policy_or_approval_missing/material_conflict/high_risk_access_open/prohibited_evasion_request/partial/blocked>` |
| `intent_screen` | `<legitimate_governance/prohibited_evasion_request/mixed>` |
| `monitoring_status` | `not_running` |
| `conclusion_limit` | `不预测平台算法，不保证账号不关联或不受限制` |

## B. 硬拒绝记录

| Request Category | Decision | Safe Reason | Permitted Alternative | Sensitive Detail Retained |
|---|---|---|---|---|
| `<category>` | `<refused/not_applicable>` | `<brief reason>` | `<disclosure/governance/professional review>` | `no` |

## C. 实体—账号关系

| Relationship ID | From → To | Type | Evidence IDs | Status | Effective Dates | Business Reason | Disclosure/Approval | Owner | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<objects>` | `<ownership/control/authorization/service/brand_use>` | `<ids>` | `<verified/reported/unverified/conflicted>` | `<dates>` | `<reason>` | `<status/evidence>` | `<owner>` | `<limits>` |

## D. 授权访问与服务商

| Principal ID | Employment/Contract | Duty | Required/Current Role | MFA | Approved Device/Remote Access | Authorization/Review/Expiry/Revocation | Approver | Evidence IDs | Risk/Action |
|---|---|---|---|---|---|---|---|---|---|
| `<masked id>` | `<relationship>` | `<duty>` | `<roles>` | `<reported/verified/unknown>` | `<approved controls>` | `<dates>` | `<owner>` | `<ids>` | `<item>` |

## E. 材料一致性

| Material ID | Category | Current Value Masked | Evidence ID | Expected Truth | Status | Effective Date | Affected Scope | Professional Review | Owner/Action |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<entity/address/bank/tax/contact/brand/compliance>` | `<value>` | `<id>` | `<truth/unknown>` | `<consistent/explained_difference/unexplained_conflict/unknown>` | `<date>` | `<scope>` | `<required/status>` | `<value>` |

## F. 敏感变更

| Change ID | Reason | Before → After | Evidence IDs | Risk Review | Policy/Professional Review | Approver | Owner/Window | Validation Evidence | Incident/Rollback Plan | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<reason>` | `<masked values>` | `<ids>` | `<result>` | `<status/ids>` | `<owner>` | `<value>` | `<ids/required>` | `<plan>` | `<proposed/approved/in_progress/user_claimed_completed/verified_completed/blocked>` |

## G. 事件登记

| Incident ID | Type | Detected/Reported Time | Affected Scope | Evidence IDs | Containment Owner/Status | RCA Route | Unknowns |
|---|---|---|---|---|---|---|---|
| `<id>` | `<unauthorized_access/material_conflict/credential_exposure/platform_notice/vendor_issue>` | `<time/tz>` | `<scope>` | `<ids>` | `<value>` | `<expert10 RCA/expert09/none>` | `<items>` |

## H. 控制路线图

| Control ID | Risk | Current Evidence | Objective | Control Design | Owner | Dependency | Due | Status | Verification | Residual Risk | Approval |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<risk>` | `<ids>` | `<objective>` | `<control>` | `<owner>` | `<dependency>` | `<date>` | `<proposed/approved/in_progress/user_claimed_completed/verified_completed/blocked>` | `<method/ids>` | `<risk>` | `<status>` |

## I. 证据谱系

| Record ID | Layer | Evidence Class | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<class>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## J. 来源可用性与业务状态

| Entity/Access/Control Field ID | `source_availability_status` | Business `result_status/control status` | Evidence Scope | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<risk/control status>` | `<ids/scope>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无账号、无访问、无冲突或无风险。正例：完整权限登记确认孤儿高权限账号数为 0，记 `true_zero`。反例：服务商访问未核验，记 `not_queried`，不得写“零第三方访问”。

## K. 质量门

- [ ] 请求经过规避意图筛查
- [ ] 多实体有真实理由、完整关系和披露/批准状态
- [ ] 不以隐藏痕迹为目标
- [ ] 访问遵循最小权限、MFA、到期和撤销
- [ ] 设备和远程访问是合法安全控制
- [ ] 材料差异未被自动解释或人为制造
- [ ] 敏感变更有审批与验证
- [ ] 服务商访问有合同边界和撤权
- [ ] 未记录凭据、Cookie、session 或恢复码
- [ ] 不预测算法或保证账号安全
- [ ] 所有实施动作保持真实状态
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
