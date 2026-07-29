<!--
文件功能：提供海关商品事实、进口情景、候选编码、原产地、估价、税率/贸易救济证据、专业问题和 handoff 模板。
职责边界：模板不是最终归类、关税计算或报关文件；占位值不得被当成确认编码或税率。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/customs-classification-readiness-contract.md。
-->

# 海关分类与税费就绪包

## A. 元数据与结论上限

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `product/variant/version` | `<values>` |
| `destination/planned date` | `<values>` |
| `status` | `<ready_for_customs_broker_review/product_facts_partial/candidate_code_missing/conflicted/blocked>` |
| `conclusion_limit` | `not_a_final_classification_or_duty_calculation` |

## B. 商品事实

| Fact ID | Field | Value/Unit | Product/Variant | Version | Evidence IDs | Status |
|---|---|---|---|---|---|---|
| `<id>` | `<material/function/use/set/etc>` | `<value>` | `<scope>` | `<version>` | `<ids>` | `<confirmed/conflicted/missing>` |

## C. 进口情景

| Scenario ID | Destination | Date | Importer/Declarant | Origin Reported | Goods State/Quantity | Incoterm/Version/Place | Invoice Currency/Value Evidence |
|---|---|---|---|---|---|---|---|
| `<id>` | `<jurisdiction>` | `<date>` | `<roles>` | `<origin>` | `<state/value>` | `<values>` | `<ids>` |

## D. 候选编码

| Candidate ID | Code/Level | Tariff Schedule/Version/Effective | Provided By | Goods Description | Reasoning Reported | Alternative/Exclusion | Evidence IDs | Status |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<code/level>` | `<values>` | `<owner>` | `<description>` | `<reported>` | `<values>` | `<ids>` | `<candidate_for_review/conflicted/insufficient_basis/confirmed_by_qualified_owner>` |

## E. 原产地

| Origin Record ID | Claimed Origin | Materials/Production Steps/Locations | Evidence | Preferential/Non-Preferential Scope | Rule/Opinion Evidence | Gap | Qualified Owner |
|---|---|---|---|---|---|---|---|
| `<id>` | `<origin>` | `<facts>` | `<ids>` | `<scope>` | `<ids>` | `<gap>` | `<owner>` |

## F. 估价

| Valuation ID | Transaction Price/Currency | Related Parties | Assists/Moulds/Royalties/Commissions/Packaging/Freight Facts | Incoterm | Authority/Opinion IDs | Unknowns | Qualified Owner |
|---|---|---|---|---|---|---|---|
| `<id>` | `<value>` | `<facts>` | `<facts>` | `<values>` | `<ids>` | `<unknowns>` | `<owner>` |

## G. 税率与贸易救济证据

| Evidence ID | Code/Tariff Version | Rate/Type/Basis Reported | Origin/Producer/Exporter Scope | Effective Date | Source Path | Confirmed By | Limitations |
|---|---|---|---|---|---|---|---|
| `<id>` | `<values>` | `<reported values>` | `<scope>` | `<date>` | `<path>` | `<qualified owner/unknown>` | `<limits>` |

## H. 专业问题

| Question ID | Closed Question | Product/Scenario/Candidate IDs | Existing Evidence | Decision Needed | Qualified Owner | Due/Gate |
|---|---|---|---|---|---|---|
| `<id>` | `<question>` | `<ids>` | `<ids>` | `<decision>` | `<owner>` | `<date/hold>` |

## I. 08/14 Handoff

| Field | Value |
|---|---|
| `confirmed classification evidence id` | `<id/pending>` |
| `product/jurisdiction/date scope` | `<scope>` |
| `origin/valuation status` | `<values>` |
| `rate/additional charge source/effective date` | `<values>` |
| `unresolved remedies/restrictions` | `<items>` |
| `conclusion limitations` | `<limits>` |

## J. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## K. 来源可用性与业务状态

| Product/Code/Rate Field ID | `source_availability_status` | Business `result_status/candidate status` | Evidence Scope | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<customs status>` | `<ids/date/scope>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无税费、无限制或无风险。正例：合格责任方以带日期税则确认附加税率为 0，记 `true_zero`；最终归类仍由责任方确认。反例：税率字段未返回，记 `not_returned`，不得补成 0%。

## L. 质量门

- [ ] 商品、变体、辖区和日期明确
- [ ] 候选编码有提供者、版本和证据
- [ ] Agent 未自定 final code
- [ ] 原产地、估价和 Incoterms 完整
- [ ] 税率/贸易救济来自带日期依据
- [ ] 未计算完税价格或应缴金额
- [ ] Handoff 只传合格确认结论
- [ ] 无 Web/HS API/报关/缴税
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
