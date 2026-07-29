<!--
文件功能：定义供应依赖、风险陈述、情景、触发器、缓解方案和决策闸门的数据合同。
职责边界：不提供实时风险数据、固定概率或自动监控能力，不替代质量、物流、合规和利润责任方。
重要关联：由 ../SKILL.md 在情景规划时读取；正式字段映射到 ../assets/templates/supply-risk-scenario-plan-template.md。
-->

# 供应风险情景合同

## 1. 供应节点

| 字段 | 说明 |
|---|---|
| `node_id` | 产品、部件、材料、供应商、工厂、模具或物流节点 |
| `node_type` | 节点类别 |
| `version_or_scope` | BOM、规格、地点或期间 |
| `status` | `approved`、`candidate`、`reported`、`unknown` |
| `parent_evidence_ids` | 状态证据 |
| `valid_as_of` | 证据日期 |
| `shared_dependency_ids` | 共同依赖 |

多个候选共用关键节点时不得称“完全双源”。

## 2. 风险陈述

每条记录：

- `risk_id`
- `risk_object_ids`
- `observation_or_condition`
- `risk_basis`: `current_issue`、`historical_pattern`、`forward_scenario`、`unknown_exposure`
- `parent_evidence_ids`
- `potential_impact`
- `time_horizon`
- `uncertainty`
- 四轴

没有当前证据时禁止 `risk_basis=current_issue`。

## 3. 情景

| 字段 | 说明 |
|---|---|
| `scenario_id` | 稳定编号 |
| `scenario_name` | 基准、压力或自定义，不暗示概率 |
| `start_conditions` | 起始条件 |
| `trigger_ids` | 可观察触发器 |
| `affected_nodes` | 影响链 |
| `quantity_scope` / `time_window` | 范围 |
| `direct_impacts` / `secondary_impacts` | 分层影响 |
| `assumption_ids` | 假设 |
| `unknowns` | 未知项 |
| `probability` | 只有用户提供合法依据时填写，否则 unknown |

## 4. 触发器

触发器包含：

- `trigger_id`
- `observable_condition`
- `evidence_source`
- `check_owner`
- `planned_check_time_or_frequency`
- `threshold_source_evidence_id`
- `action_if_met`
- `action_if_unknown`

检查计划不等于系统监控。

## 5. 缓解方案

| 字段 | 说明 |
|---|---|
| `option_id` | 稳定编号 |
| `target_risk_ids` | 缓解对象 |
| `action` | 待批准动作 |
| `prerequisites` | 证据、测试、合同和批准 |
| `lead_time` | 来源或 unknown |
| `cost_input_status` | `provided`、`requires_expert14`、`unknown` |
| `reversibility` | 可逆性 |
| `new_dependencies` | 新增风险 |
| `owner` | 执行责任方 |
| `approval_status` | `proposed`、`approved`、`rejected` |

## 6. 决策闸门

允许状态：

- `approve_preparation`
- `approve_mitigation_with_conditions`
- `hold_for_evidence`
- `escalate_to_owner`
- `accept_exposure_by_human_decision`
- `not_assessable`

记录 `decision_scope`、`conditions`、`approved_by`、`decision_date`、`review_trigger`。

## 7. 证据纪律

- 用户陈述和供应商陈述保留来源；
- 当前、历史、未来和混合期间分开；
- 估算、预测和未知分开；
- Agent 风险判断为 inference 或 hypothesis；
- `parent_evidence_ids` 不得为空；
- 缺失和未查询不等于风险不存在。

## 8. SIF 供应商计算对象

`market_estimate_profit_threshold` 的正式 `arguments` 必须显式包含 `price`、`category`、`weight_oz`、`freight_cost`、`target_margin`、`country`、`price_currency`、`tariff_rate`、`is_apparel`、`turnover_days`。每个键都必须映射到已验证输入 Evidence ID；缺失、冲突或未经验证即不得调用，不设默认值。`category` 必须来自用户或可信上游确认的费用类目口径，SIF ASIN 画像类目只能保留供应商快照语义，不能升级为官方类目事实或静默代填。`length_in`、`width_in`、`height_in` 只有三项均有父证据且机器 schema 同时支持时才成组传入，否则整组省略。

每次调用另建 `vendor_calculation` 对象，并在对象本体保存 `vendor_calculation_id`、`source_tool=market_estimate_profit_threshold`、正式 `arguments` 快照、逐参数映射的 `parent_input_evidence_ids[]`、三类 request ID、`raw_result_locator`、`transformation_type=vendor_calculation` 与限制。该对象不能直接证明需求变化、供应商产能、报价、交期、物流或中断。
