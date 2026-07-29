<!--
文件功能：提供 IP 对象、使用情境、权利链、商标检索/专业证据、风险信号、闸门和专业问题模板。
职责边界：模板只供初筛与交接，不输出侵权、有效性、可注册性或自由实施结论。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ip-risk-triage-contract.md。
-->

# 跨境知识产权风险初筛

## A. 元数据与结论上限

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `product/market/use scope` | `<values>` |
| `analysis_as_of` | `<timestamp + timezone>` |
| `status` | `<ready_for_qualified_ip_review/risk_signal_present/rights_chain_incomplete/trademark_preliminary_only/blocked>` |
| `conclusion_limit` | `preliminary_only；非侵权、可注册性、FTO 或诉讼意见` |

## B. IP 对象

| Object ID | Type | Name/Description | Version | Source Path | Creator/Provider | Date | Product/Market Scope | Evidence IDs |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<word_mark/logo/copy/photo/video/music/package/design/technical_feature/etc>` | `<value>` | `<version>` | `<path>` | `<party>` | `<date>` | `<scope>` | `<ids>` |

## C. 使用情境

| Use Context ID | Object ID | Jurisdiction/Marketplace/Language | Goods/Services | Placement | Use Character | Temporal Scope | Replaceability |
|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<scope>` | `<value>` | `<placement>` | `<brand/descriptive/comparative/compatibility/reference/decorative>` | `<axis>` | `<value>` |

## D. 权利链

| Rights ID | Object ID | Creator/Provider/Rightsholder/Licensee | Agreement | Territory/Media/Term | Sublicense/Modification | Signature Status | Evidence IDs | Gap |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<parties>` | `<type>` | `<scope>` | `<rights>` | `<status>` | `<ids>` | `<gap>` |

## E. 商标检索与专业证据

| Evidence ID | Source Type | Source Locator | Provider/Qualified Owner | Database/Material Type | Query/Scope | Pagination/Coverage | Returned Fields/Result | Evidence Class | As Of/Valid As Of | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<user_input/user_upload/trusted_upstream_output>` | `<path/segment>` | `<party/unknown>` | `<type>` | `<terms/jurisdiction/class/goods>` | `<coverage>` | `<fields/summary/zero_results>` | `<official_record/qualified_opinion/trusted_upstream_summary/user_provided_material>` | `<times>` | `<scope/time/conclusion limits>` |

> 本节只登记用户、只读上传或可信上游提供的既有材料；不调用 `sif_mcp`、Web、浏览器或其他商标/IP 数据源。

## F. 专利/设计/版权缺口

| Gap ID | Right Type | Object/Feature | Existing Evidence | Missing Search/Right | Qualified Owner | Business Gate |
|---|---|---|---|---|---|---|
| `<id>` | `<patent/design/copyright>` | `<value>` | `<ids>` | `<gap>` | `<owner>` | `<hold/review>` |

## G. 风险信号

| Signal ID | Object/Use IDs | Observation | Evidence IDs | Potential Impact | Alternative Explanations | Qualified Question | Gate |
|---|---|---|---|---|---|---|---|
| `<id>` | `<ids>` | `<observation>` | `<ids>` | `<impact>` | `<alternatives>` | `<question>` | `<status>` |

## H. 证据谱系

| Record ID | Layer | Source Path/Query Ref / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

## I. 来源可用性与业务状态

| Object/Field ID | `source_availability_status` | Business `result_status/gate_status` | Coverage | Interpretation |
|---|---|---|---|---|
| `<id>` | `<not_returned/not_queried/parse_failed/missing/conflicted/true_zero>` | `<IP status>` | `<query/evidence scope>` | `<bounded meaning>` |

前五种来源状态不得写成 0、无权利、无相似记录或无风险。正例：完整官方检索材料由合格责任方确认范围内记录数为 0，记 `true_zero`，结论仍受材料范围与专业意见限制。反例：未提供检索材料时记 `not_queried` 或 `missing`，不得写“零近似商标”。

## J. 质量门

- [ ] IP 对象、版本和使用情境分开
- [ ] 权利链含主体、地区、媒介、期限和修改权
- [ ] 商标检索/专业证据只来自用户、只读上传或可信上游，并保留范围、日期、责任方和限制
- [ ] 无结果未写无风险
- [ ] 专利、设计和版权缺口明确
- [ ] 风险信号未写成侵权结论
- [ ] 与第10账号执法边界清楚
- [ ] 无外部抓取、注册或诉讼执行
- [ ] 来源六态与业务状态分列，前五项未补零
- [ ] 正式文件位于 `outputs/`
