<!--
文件功能：提供供应商寻源准备、RFQ、候选池和证据账本的正式交付模板。
职责边界：模板中的占位符不是事实；只有通过证据和授权检查的内容才能进入正式 outputs。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/sourcing-readiness-contract.md。
-->

# 供应商寻源准备交付

## A. 交付元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `product_id` | `<product-id>` |
| `product_version` | `<version>` |
| `target_market` | `<market>` |
| `decision_date` | `<YYYY-MM-DD>` |
| `readiness_status` | `<ready_for_rfq / ready_with_assumptions / clarification_required / conflicted / blocked>` |
| `prepared_at` | `<timestamp + timezone>` |
| `prepared_by` | `<agent/human>` |

## B. 结论摘要

- 当前是否可外发 RFQ：`<yes / conditional / no>`
- 已确认硬约束：`<count>`
- 关键缺口：`<count + summary>`
- 需用户或责任方决策：`<items>`
- 本交付不代表：`<未搜索供应商、未询价、未核验、未下单>`

## C. 采购对象

| 对象 ID | 类型 | 名称/版本 | 范围 | 使用场景 | 证据 ID |
|---|---|---|---|---|---|
| `<object-id>` | `<finished/component/package/service>` | `<value>` | `<scope>` | `<scenario>` | `<evidence-id>` |

## D. 需求与验收矩阵

| Requirement ID | 类别 | 要求 | 优先级 | 值/单位/公差 | 验收方法 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 状态 | 批准人 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `<req-id>` | `<category>` | `<requirement>` | `<must/should/option/supplier_to_propose/tbd>` | `<value>` | `<method>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<normalized/inference>` | `<confirmed/proposed/conflicted/missing>` | `<owner>` |

## E. 数量与交付情景

| Scenario ID | 阶段 | 数量/单位 | 目标出货 | 目标到货 | 时区 | 地点 | Incoterms/版本/地点 | 假设 ID |
|---|---|---|---|---|---|---|---|---|
| `<scenario-id>` | `<sample/pilot/first_order/replenishment>` | `<value>` | `<date>` | `<date>` | `<tz>` | `<location>` | `<rule/version/place>` | `<ids>` |

### 正式假设记录

| Assumption ID | Scenario ID | Assumption | Impact | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Assumption Status | Invalidated By |
|---|---|---|---|---|---|---|---|---|---|---|
| `<assumption-id>` | `<scenario-id>` | `<assumption>` | `<impact>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `hypothesis` | `<proposed/user_approved/rejected>` | `<trigger>` |

## F. 可外发 RFQ

### 项目与保密

`<项目简介、披露范围、保密要求和非承诺声明>`

### 供应商必须回应

| Clause ID | Clause Category | Question | Response Format | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | External Share Status | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
| `<clause-id>` | `<spec/sample/commercial/delivery/identity>` | `<exact question>` | `<required response/evidence>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<normalized/inference>` | `<approved/pending/rejected>` | `<limits>` |

### 附件清单

| 附件 ID | 文件/版本 | 外发授权 | 敏感级别 | 用途 |
|---|---|---|---|---|
| `<attachment-id>` | `<path/version>` | `<approved/pending/rejected>` | `<level>` | `<purpose>` |

## G. 候选池登记

没有候选时明确写：`当前候选池为空；本 Skill 未执行供应商搜索。`

| Candidate ID | 法定名称（陈述） | 来源证据 | 角色陈述 | 产品/工艺陈述 | 身份冲突 | 核验状态 | 负责人 | 下一步 |
|---|---|---|---|---|---|---|---|---|
| `<candidate-id>` | `<reported-name>` | `<evidence-id>` | `<claim>` | `<claim>` | `<none/open>` | `<unverified/partial/verified_by_qualified_owner>` | `<owner>` | `<action>` |

### 正式候选字段记录

| Candidate Field ID | Candidate ID | Field Name | Field Value/Status | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Provided By | Verification Status/Required |
|---|---|---|---|---|---|---|---|---|---|---|
| `<candidate-field-id>` | `<candidate-id>` | `<field>` | `<reported value/missing/conflicted>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<normalized/coding>` | `<provider>` | `<status/action>` |

## H. 缺口与决策

| Gap ID | 缺失/冲突 | 影响 | 所需证据或决策 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 责任人 | 截止时间 | 状态 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `<gap-id>` | `<description>` | `<scope>` | `<request>` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<owner>` | `<date/tbd>` | `<open/resolved/blocked>` |

## I. 输入证据账本

| Evidence ID | Source Path | Source Type | Date | Version | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|
| `<evidence-id>` | `<path>` | `<type>` | `<date>` | `<version>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页和 `raw_result_locator`；ASIN 画像使用 `transformation_type=reported`，供应商阈值使用 `transformation_type=vendor_calculation`。

### SIF 供应商计算对象

只在实际调用 `market_estimate_profit_threshold` 时填写；此对象本体必须保留输入父证据，不得仅在 Agent 输出总账补写。

| Vendor Calculation ID | Source Tool | Call Arguments Snapshot | `parent_input_evidence_ids[]` | Dimension Group Status | Agent Request ID | Tool Call ID | Provider Request ID | Raw Result Locator | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
| `<vendor-calculation-id>` | `market_estimate_profit_threshold` | `<exact arguments>` | `<all mapped input evidence ids>` | `<complete/omitted>` | `<id>` | `<id>` | `<id/not_returned>` | `<path/object locator>` | `vendor_calculation` | `<vendor rate/exchange/schema limits>` |

| Formal Argument | Value | Parent Input Evidence ID | Validation |
|---|---|---|---|
| `price` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `category` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `weight_oz` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `freight_cost` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `target_margin` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `country` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `price_currency` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `tariff_rate` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `is_apparel` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `turnover_days` | `<value>` | `<evidence-id>` | `<verified/conflicted/missing>` |
| `length_in` | `<value/omitted>` | `<evidence-id/not_applicable>` | `<verified/omitted_with_group>` |
| `width_in` | `<value/omitted>` | `<evidence-id/not_applicable>` | `<verified/omitted_with_group>` |
| `height_in` | `<value/omitted>` | `<evidence-id/not_applicable>` | `<verified/omitted_with_group>` |

前十项任一项不是 `verified` 时不得调用。尺寸三项只能全部 `verified` 后成组传入，否则整组省略；任何参数都不得使用默认值。

## J. Agent 输出谱系

| Output ID | Output Type | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Assumption Status | Confidence Note |
|---|---|---|---|---|---|---|---|---|
| `<requirement-id>` | `normalized_requirement` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<normalized/inference>` | `<status>` | `<note>` |
| `<gap-id>` | `gap` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<coding/inference>` | `<status>` | `<note>` |
| `<clause-id>` | `rfq_clause` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<normalized/inference>` | `<status>` | `<note>` |
| `<assumption-id>` | `assumption` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `hypothesis` | `<status>` | `<note>` |
| `<candidate-field-id>` | `candidate_field` | `<ids>` | `agent` | `<current/historical/future/mixed/not_applicable/unknown>` | `<reported/estimated/forecast/mixed/not_applicable/unknown>` | `<normalized/coding>` | `<status>` | `<note>` |

## K. 发布前质量门

- [ ] 所有 `must` 有证据、单位和验收方法
- [ ] 数量、地点、日期、时区和 Incoterms 口径完整
- [ ] 报价包含/排除项与有效期明确
- [ ] 未虚构、搜索、推荐或联系供应商
- [ ] 候选陈述与核验事实分开
- [ ] 敏感信息已按授权控制
- [ ] `uploads/` 未修改
- [ ] 中间资料在 `temp/`
- [ ] 正式交付在 `outputs/`
