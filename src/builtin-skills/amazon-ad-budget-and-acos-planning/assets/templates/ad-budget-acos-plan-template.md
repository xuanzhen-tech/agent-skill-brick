<!--
文件功能：提供 ACoS/TACoS、经济边界、预算情景、决策候选、复核和证据谱系的正式交付模板。
职责边界：模板不修改预算或竞价，不提供固定比例；占位情景不是效果承诺。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ad-budget-and-acos-contract.md。
-->

# Amazon 广告预算与 ACoS 规划

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/profile/marketplace` | `<values>` |
| `product/entity scope` | `<values>` |
| `currency/timezone` | `<values>` |
| `period/attribution` | `<values>` |
| `result_status` | `<从下方允许值中选择一个>` |
| `reason_codes[]` | `<从下方允许值中选择零个或多个>` |

模板允许的字面合同：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `MISSING_AD_REPORT | MISSING_TOTAL_SALES | MISSING_ECONOMIC_GUARDRAIL | ZERO_DENOMINATOR | CURRENCY_OR_PERIOD_CONFLICT | ATTRIBUTION_IMMATURE | TARGET_NOT_APPROVED | OUT_OF_SCOPE_REQUEST`

## B. 指标账本

| Metric ID | Type | Numerator | Denominator | Raw Ratio | Display Percent | Unit | Rounding Rule | Scope | Period/Attribution | Calculation Status | Evidence IDs |
|---|---|---:|---:|---:|---:|---|---|---|---|---|---|
| `<id>` | `<actual_acos_raw_ratio/target_acos_raw_ratio/breakeven_acos_raw_ratio/tacos>` | `<value>` | `<value>` | `<ratio/not_computable>` | `<raw_ratio*100/not_computable>` | `<ratio + percent>` | `<display-only rule>` | `<scope>` | `<contract>` | `<reported/target/calculated/blocked>` | `<ids>` |

## C. 经济边界

| Guardrail ID | Source | Product Scope | Price/Cost Version | Valid As Of | Currency | Available Ad Contribution | Promotion Stack | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<expert14/user>` | `<scope>` | `<version>` | `<date>` | `<currency>` | `<value/range>` | `<status>` | `<limits>` |

## D. 差距与节奏

| Entity ID | Actual Raw Ratio | Target Raw Ratio | `gap_ratio=actual-target` | `gap_percentage_points=gap_ratio*100` | Breakeven Raw Ratio | Breakeven Gap Ratio | Breakeven Gap Percentage Points | Rounding Rule | Interpretation |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `<id>` | `<ratio>` | `<ratio>` | `<ratio/not_comparable>` | `<percentage points/not_comparable>` | `<ratio>` | `<ratio/not_comparable>` | `<percentage points/not_comparable>` | `<display-only rule>` | `<descriptive/forecast assumption>` |

## E. 预算情景

| Scenario ID | Name | Budget Range | Entity Scope | Target ACoS/TACoS | Breakeven Guardrail | Assumptions | Review Window | Stop Trigger | Approval |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<conservative/base/aggressive/custom>` | `<range currency>` | `<ids>` | `<values>` | `<id>` | `<ids>` | `<window>` | `<trigger>` | `<pending/approved/rejected>` |

## F. 决策候选

| Decision ID | Entity ID | Decision | Evidence IDs | Conditions | Risks | Human Owner | Status |
|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<maintain_for_review/increase_candidate/decrease_candidate/reallocate_candidate/hold_for_data/hold_for_economics/stop_candidate/not_assessable>` | `<ids>` | `<conditions>` | `<risks>` | `<owner>` | `<proposed>` |

## G. 复核与回滚

| Scenario/Decision ID | Manual Action | Observation Window | Required Report Signature | Guardrails | Rollback/Stop | Owner |
|---|---|---|---|---|---|---|
| `<id>` | `<human action>` | `<window>` | `<signature>` | `<metrics>` | `<rule>` | `<owner>` |

## H. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页、`raw_result_locator` 和 `transformation_type=reported`；Agent 输出另建对象并回指 `parent_evidence_ids`。

## I. 质量门

- [ ] 实际、目标、保本 ACoS 分开
- [ ] ACoS 原始值为 ratio；`gap_ratio=actual-target`，`gap_percentage_points=gap_ratio*100`
- [ ] 所有计算使用未舍入 raw ratio，展示舍入规则已记录
- [ ] TACoS 只用一方总销售
- [ ] 期间、币种、归因和范围一致
- [ ] 零分母为 not_computable
- [ ] 第14经济边界有版本和日期
- [ ] 无固定预算比例或行业阈值
- [ ] 情景假设未冒充保证
- [ ] 所有决策等待人工批准
- [ ] 无预算/竞价写入或自动规则
- [ ] 正式文件位于 `outputs/`
