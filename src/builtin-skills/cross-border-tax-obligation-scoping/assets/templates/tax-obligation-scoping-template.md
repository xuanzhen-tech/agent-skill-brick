<!--
文件功能：提供实体、业务流、税务事件、现行依据、义务候选、资料覆盖和专业咨询问题模板。
职责边界：模板不计算税额、不生成申报或确定税务意见；敏感字段只保留掩码和证据引用。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/tax-obligation-scoping-contract.md。
-->

# 跨境税务义务范围包

## A. 元数据与结论上限

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `business_model_version` | `<version>` |
| `jurisdictions` | `<values>` |
| `analysis_period/as_of` | `<values>` |
| `status` | `<ready_for_qualified_tax_review/facts_partial/current_authority_missing/blocked>` |
| `conclusion_limit` | `范围界定，非税务意见、税额或申报结果` |

## B. 实体与角色

| Entity ID | Legal Name Masked | Jurisdiction | Tax ID Masked | Roles | Contract/Account/Payee Refs | Evidence IDs | Conflicts |
|---|---|---|---|---|---|---|---|
| `<id>` | `<masked>` | `<jurisdiction>` | `<masked>` | `<roles>` | `<refs>` | `<ids>` | `<conflicts>` |

## C. 业务流

| Flow ID | Goods/Ownership | Inventory | Seller of Record | Invoice Issuer | Collection/Refund | Platform Role Reported | Currency/Period | Evidence IDs |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<flow>` | `<locations>` | `<entity>` | `<entity>` | `<entities>` | `<reported>` | `<values>` | `<ids>` |

## D. 税务事件

| Event ID | Jurisdiction | Type | Date | Entity/Product/Order Scope | Amount/Quantity Reported | Evidence IDs | Authority Needed |
|---|---|---|---|---|---|---|---|
| `<id>` | `<jurisdiction>` | `<type>` | `<date>` | `<scope>` | `<reported value>` | `<ids>` | `<request>` |

## E. 现行依据

| Authority ID | Title/Issuer | Source Path | Publication/Effective/Revision | Scope | Status | Confirmed By | Limitations |
|---|---|---|---|---|---|---|---|
| `<id>` | `<value>` | `<path>` | `<dates>` | `<scope>` | `<original/summary/translation/professional_opinion>` | `<owner/unknown>` | `<limits>` |

## F. 义务候选

| Candidate ID | Question Type | Trigger Facts | Authority IDs | Status | Existing Evidence | Gap | Qualified Owner | Deadline/Gate |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<registration/filing/invoice/platform_collection/import/records/refund>` | `<facts>` | `<ids>` | `<candidate/qualified_confirmation_required/confirmed_by_qualified_owner>` | `<ids>` | `<gap>` | `<owner>` | `<date/gate>` |

## G. 阈值/税率证据（仅用户提供时）

| Evidence ID | Value/Currency | Basis | Period | Entity/Transaction Scope | Effective Date | Source Segment | Confirmed By |
|---|---|---|---|---|---|---|---|
| `<id>` | `<value>` | `<basis>` | `<period>` | `<scope>` | `<date>` | `<segment>` | `<owner>` |

## H. 专业咨询问题

| Question ID | Closed Question | Facts/Event IDs | Authority IDs | Existing Evidence | Decision Needed | Qualified Owner | Due |
|---|---|---|---|---|---|---|---|
| `<id>` | `<question>` | `<ids>` | `<ids>` | `<ids>` | `<decision>` | `<owner>` | `<date/tbd>` |

## I. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## J. 来源可用性与业务状态

| Entity/Flow/Field ID | `source_availability_status` | Business `result_status/obligation status` | Evidence Scope | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<tax status>` | `<ids/period>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无交易、无义务或无风险。正例：完整期间导出明确退款笔数为 0，记 `true_zero`；义务仍由依据和责任方确认。反例：代征字段未返回，记 `not_returned`，不得写代征额为 0。

## K. 质量门

- [ ] 实体与角色分开
- [ ] 货物、订单、发票和资金流完整
- [ ] 司法辖区、事件和期间明确
- [ ] 现行事实来自带日期依据
- [ ] 未猜税率、阈值或平台代征
- [ ] 义务保持候选/责任方确认
- [ ] 敏感信息已掩码
- [ ] 无税额、申报、注册或付款执行
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
