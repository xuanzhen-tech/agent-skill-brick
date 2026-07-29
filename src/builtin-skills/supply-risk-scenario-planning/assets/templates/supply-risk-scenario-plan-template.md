<!--
文件功能：提供供应依赖、风险、情景、触发器、缓解方案、决策闸门和证据的正式交付模板。
职责边界：模板不执行监控或行动，不提供固定概率、阈值和财务影响，不把情景占位当当前事实。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/supply-risk-scenario-contract.md。
-->

# 供应风险情景计划

## A. 元数据与结论状态

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `product/BOM version` | `<value>` |
| `analysis_window` | `<start/end + timezone>` |
| `evidence_status` | `<evidence_based/scenario_only/mixed/stale/conflicted/blocked>` |
| `prepared_at` | `<timestamp + timezone>` |
| `monitoring_status` | `not_running` |

## B. 供应依赖

| Node ID | 类型 | 名称/范围 | 版本/地点 | 状态 | Evidence IDs | Valid As Of | Shared Dependencies |
|---|---|---|---|---|---|---|---|
| `<node-id>` | `<type>` | `<value>` | `<scope>` | `<approved/candidate/reported/unknown>` | `<ids>` | `<date>` | `<ids>` |

## C. 风险登记

| Risk ID | 对象 | 观察或条件 | Basis | Evidence IDs | Potential Impact | Time Horizon | Uncertainty |
|---|---|---|---|---|---|---|---|
| `<risk-id>` | `<node-ids>` | `<observation-or-condition>` | `<current_issue/historical_pattern/forward_scenario/unknown_exposure>` | `<ids>` | `<impact>` | `<window>` | `<note>` |

## D. 情景

| Scenario ID | 名称 | 起始条件 | Trigger IDs | 影响节点 | 数量/时间范围 | 直接影响 | 二阶影响 | Assumption IDs | Unknowns | Probability |
|---|---|---|---|---|---|---|---|---|---|---|
| `<scenario-id>` | `<baseline/stress/custom>` | `<conditions>` | `<ids>` | `<ids>` | `<scope>` | `<impacts>` | `<impacts>` | `<ids>` | `<unknowns>` | `<provided/unknown>` |

## E. 触发器与人工检查

| Trigger ID | Observable Condition | Evidence Source | Check Owner | Planned Time/Frequency | Threshold Evidence | If Met | If Unknown |
|---|---|---|---|---|---|---|---|
| `<trigger-id>` | `<condition>` | `<source>` | `<owner>` | `<plan>` | `<id/tbd>` | `<action>` | `<hold/escalate>` |

> 上表是人工检查计划，不代表后台监控、Cron 或自动告警已经运行。

## F. 缓解方案

| Option ID | Target Risks | Action | Prerequisites | Lead Time | Cost Input | Reversibility | New Dependencies | Owner | Approval |
|---|---|---|---|---|---|---|---|---|---|
| `<option-id>` | `<ids>` | `<action>` | `<requirements>` | `<value/unknown>` | `<provided/requires_expert14/unknown>` | `<value>` | `<ids>` | `<owner>` | `<proposed/approved/rejected>` |

## G. 方案比较

| Option ID | 缓解机制 | 适用触发 | 时间 | 质量/合规影响 | 成本/现金资料 | 新风险 | 失效条件 |
|---|---|---|---|---|---|---|---|
| `<option-id>` | `<mechanism>` | `<trigger-ids>` | `<evidence/unknown>` | `<impact>` | `<expert14/human input>` | `<risks>` | `<conditions>` |

## H. 决策闸门

| Decision ID | Decision | Scope | Conditions | Unresolved Risks | Approved By | Date | Review Trigger |
|---|---|---|---|---|---|---|---|
| `<decision-id>` | `<approve_preparation/approve_mitigation_with_conditions/hold_for_evidence/escalate_to_owner/accept_exposure_by_human_decision/not_assessable>` | `<scope>` | `<conditions>` | `<ids>` | `<human/pending>` | `<date>` | `<trigger>` |

## I. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页和 `raw_result_locator`；ASIN 画像使用 `transformation_type=reported`，供应商阈值使用 `transformation_type=vendor_calculation`。

### SIF 供应商计算对象

只在实际调用 `market_estimate_profit_threshold` 时填写；此对象本体必须保留输入父证据，不得仅在风险情景总账补写。

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

## J. 质量门

- [ ] 当前问题、历史模式、未来情景和未知暴露分开
- [ ] 每项风险有证据或显式假设
- [ ] 单次快照未写成趋势
- [ ] 无 Agent 自定概率、损失率或固定阈值
- [ ] 缓解方案未冒充已执行
- [ ] 检查计划未冒充后台监控
- [ ] SIF ASIN 画像或探索性采购上限未被当成需求变化、供应商、报价、交期、物流或中断事实
- [ ] 财务和库存影响转交责任方
- [ ] `uploads/` 未修改，正式文件在 `outputs/`
