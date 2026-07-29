<!--
文件功能：提供商品事实、现行依据、要求候选、文件覆盖、缺口、专业咨询问题和证据谱系模板。
职责边界：模板不宣布合规或提供法律意见；所有占位依据必须由用户或可信上游带日期资料替换。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/product-compliance-evidence-contract.md。
-->

# 跨境商品合规就绪包

## A. 元数据与免责声明

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `product/variant/version` | `<values>` |
| `jurisdiction/marketplace` | `<values>` |
| `planned_activity_date` | `<date>` |
| `analysis_as_of` | `<timestamp + timezone>` |
| `readiness_status` | `<ready_for_qualified_review/partial/current_authority_missing/blocked>` |
| `conclusion_limit` | `非法律意见、非认证结论、非上市批准` |

## B. 产品事实

| Fact ID | Product/Variant | Field | Value/Unit | Version | Evidence IDs | Status |
|---|---|---|---|---|---|---|
| `<id>` | `<scope>` | `<material/function/use/claim/etc>` | `<value>` | `<version>` | `<ids>` | `<confirmed/conflicted/missing>` |

## C. 现行依据

| Authority ID | Title/Issuer | Source Path | Publication/Effective/Revision | Jurisdiction | Scope | Language | Document Status | Validity Confirmed By | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<value>` | `<path>` | `<dates>` | `<jurisdiction>` | `<scope>` | `<lang>` | `<original/summary/translation/professional_opinion>` | `<owner/unknown>` | `<limits>` |

## D. 证据保真翻译

| Source Segment ID/Location | Target Segment ID | Translation | Terms | Qualifiers/Exceptions/Negation | Dates/Units | Uncertainty | Review Status |
|---|---|---|---|---|---|---|---|
| `<id/location>` | `<id>` | `<text>` | `<terms>` | `<preserved>` | `<values>` | `<note>` | `<translation_review_required/reviewed>` |

## E. 要求候选

| Requirement ID | Trigger | Requirement/Prohibition | Exceptions | Required Evidence/Action | Responsible Party | Timing | Authority Evidence IDs | Interpretation Status |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<conditions>` | `<value>` | `<exceptions>` | `<evidence/action>` | `<role>` | `<timing>` | `<ids>` | `<extracted/needs_qualified_interpretation>` |

## F. 文件覆盖

| Requirement ID | Document/Evidence | Product/Market Scope | Version/Expiry | Status | Gap | Qualified Owner |
|---|---|---|---|---|---|---|
| `<id>` | `<path/id>` | `<scope>` | `<values>` | `<evidence_available/evidence_partial/scope_mismatch/expired_or_stale/qualified_review_required/missing/not_assessed>` | `<gap>` | `<owner>` |

## G. 专业咨询问题

| Question ID | Closed Question | Product/Market Facts | Authority IDs | Existing Evidence | Decision Needed | Qualified Owner | Due |
|---|---|---|---|---|---|---|---|
| `<id>` | `<question>` | `<ids>` | `<ids>` | `<ids>` | `<decision>` | `<owner>` | `<date/tbd>` |

## H. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## I. 来源可用性与业务状态

| Fact/Authority/Document ID | `source_availability_status` | Business `result_status` | Evidence Scope | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<readiness status>` | `<ids/scope>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无要求、无缺口或无风险。正例：完整 BOM 经责任方确认无线模块数为 0，记 `true_zero`；认证适用性仍按当前依据判断。反例：法规原文未查询，记 `not_queried`，不得写“无需认证”。

## J. 质量门

- [ ] 产品、市场、日期和责任主体明确
- [ ] 现行要求来自带日期依据
- [ ] 原文、摘要、翻译和意见分开
- [ ] 翻译保留限定词、例外、日期和单位
- [ ] 文件与产品版本逐项匹配
- [ ] 过期/范围不明未写有效
- [ ] 仅给就绪状态，不宣布合规
- [ ] 无 Web、DeepL、注册或认证执行
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
