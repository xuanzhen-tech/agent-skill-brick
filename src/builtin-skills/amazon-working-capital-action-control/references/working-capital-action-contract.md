<!--
文件功能：定义营运资金行动记录、领域所有权、审批状态、承诺状态、SIF 排除边界和人工门禁的确定性合同。
职责边界：只规范用户、只读 uploads 或可信上游既有领域 action 的资金控制；SIF 不提供 action、现金流、审批或承诺真相；不提出、修改、批准或执行任何经营动作。
重要关联：../SKILL.md 执行本合同；../assets/templates/working-capital-action-control.md 承载正式登记和议程。
-->

# 营运资金行动合同

## 1. 必需字段

每个行动对象必须包含：

| 字段 | 语义 | 失败规则 |
|---|---|---|
| `source_action_id` | 领域 owner 正式输出中的稳定行动 ID | 缺失时 `blocked_missing_source_action` |
| `action_source` | 正式产物 ID、版本和定位 | 无法定位时阻断 |
| `domain_owner` | 对行动内容和执行负责的专家/内置能力 | owner 不明或冲突时阻断 |
| `cashflow_scenario_id` | 内置经营分析的现金流情景 ID | 缺失或跨情景时阻断 |
| `cash_effect_amount` | 上游给出的资金影响金额、币种和方向 | 缺失不补零，不自行重算 |
| `cash_effect_date` | 影响日期/区间与时区 | 缺失不猜测 |
| `deferrability_evidence_id` | 可推迟性、条件和有效期的证据 | 缺失时不得判断可推迟 |
| `approval_state` | 人工审批生命周期 | 只能使用第 4 节枚举 |
| `commitment_state` | 现实承诺生命周期 | 只能使用第 5 节枚举 |

推荐同时保存：

```text
action_version
marketplace
account_or_entity
sku_or_scope
cash_effect_currency
cash_effect_direction
cash_effect_basis
approval_evidence_ids
commitment_evidence_ids
dependency_evidence_ids
constraint_evidence_ids
parent_evidence_ids
```

## 2. 不可变来源行动

本 Skill 对以下字段只读：

- 行动类型与文本
- 数量、金额、日期和期限
- SKU、供应商、渠道、广告、促销或税费对象
- 领域收益、风险与执行条件
- owner 和批准人

需要修改时创建“返回领域 owner 的变更请求”，引用原 `source_action_id`，不得在资金登记册中直接改写。

## 3. 领域所有权

| `domain_owner` | 允许的 action 范围 |
|---|---|
| `amazon-operating-analysis` | 经营权衡与现金流情景，不负责领域执行 |
| `expert-07-procurement` | 采购、供应商、MOQ、账期 |
| `expert-08-logistics-warehouse` | 补货、履约、库存执行准备 |
| `expert-05-advertising` | 广告预算、竞价与投放候选 |
| `expert-06-promotion` | 促销价格、日历与报名候选 |
| `expert-09-compliance-tax` | 税费、法定期限与政策约束 |

实际执行由获授权人工或外部系统承担，不把其写成 Agent owner。

## 4. 审批状态

| `approval_state` | 所需证据 |
|---|---|
| `not_submitted` | 来源明确说明尚未提交，或提交记录不存在且状态被责任方确认 |
| `pending_review` | 当前版本已提交且在审 |
| `approved` | 当前版本、范围、金额和条件获得明确批准 |
| `conditionally_approved` | 明确批准但附有尚需满足的条件 |
| `rejected` | 当前版本被明确拒绝 |
| `expired` | 审批证据超过有效期 |
| `revoked` | 当前批准被明确撤销 |

未知审批不能自动写 `not_submitted`；应使用输入缺失状态 `not_queried` 或 `missing`，并阻断。

## 5. 承诺状态

| `commitment_state` | 所需证据 |
|---|---|
| `candidate` | 领域 action 存在，但没有现实承诺证据 |
| `approved_not_committed` | 来源明确说明已批准且尚未承诺；不能只由审批状态推断 |
| `committed` | 合同、订单、平台记录或其他责任方证据证明已承诺 |
| `blocked` | 来源证据明确说明行动被阻断 |
| `cancelled` | 来源证据明确说明已取消 |

`approval_state` 和 `commitment_state` 互不派生。即使组合看似矛盾，也保留两组来源证据并标记冲突。

## 6. 状态证据

每次状态观察至少记录：

```text
state_record_id
state_type
state_value
observed_at
effective_at
source_locator
evidence_id
supersedes_state_record_id
```

新证据追加新状态记录，不覆盖历史。没有 `supersedes_state_record_id` 时，不自行认定旧记录失效。

## 7. 可推迟性证据

`deferrability_evidence_id` 指向的记录至少有：

```text
deferrability_status
allowed_window
conditions
approver_or_owner
effective_from
effective_to
constraint_evidence_ids
```

`deferrability_status` 可以保存来源原有语义，但 Agent 不得从交期、现金缺口或行业经验自行生成“可推迟”。缺证据时阻断，不推荐延期。

## 8. 现金影响

每个金额至少包含：

```text
amount_value
currency
direction = inflow | outflow
date_or_range
timezone
basis
estimation_status
evidence_id
```

规则：

1. 原样消费领域 owner 或内置经营分析的金额，不重算。
2. 区间值保留区间，不取中点。
3. 多币种不静默换算；需要 FX 情景时引用明确情景 Evidence ID。
4. 未解决金额不归零、不按比例分摊。
5. 只有同一 `cashflow_scenario_id`、版本、币种和口径才可汇总。

## 9. 人工门禁

| `control_status` | 条件 |
|---|---|
| `ready_for_human_gate` | 必需字段、来源 action、同一现金流情景、依赖和状态证据完整 |
| `blocked_missing_field` | 任一一般必需字段缺失 |
| `blocked_missing_source_action` | 无可定位 action ID/正式输出 |
| `blocked_missing_cashflow_scenario` | 无正式现金流情景或版本不一致 |
| `blocked_owner_conflict` | owner 缺失、越界或来源冲突 |
| `blocked_dependency` | 前置依赖、限制或可推迟性证据不足 |
| `blocked_evidence_conflict` | 核心金额、日期、审批或承诺证据冲突 |
| `out_of_scope` | 请求要求发明、修改、批准或执行动作 |

`ready_for_human_gate` 只说明资料可以进入人工议程，不表示 `approved`、`committed` 或可执行。

## 10. 依赖对象

```text
dependency_id
dependency_type
required_state
observed_state
owner
due_at
evidence_id
missing_status
```

未查询依赖写 `not_queried`，不能写“无依赖”。法定、税费、合同或平台限制必须引用第 09 或用户的当前证据。

## 11. 四轴和双层谱系

输入证据统一保存：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

Agent 门禁判断统一保存：

```text
output_evidence_id
output_type=gate_assessment|conflict_classification|gap_classification|agenda_ordering|verification_request
parent_evidence_ids
source_type=agent
temporal_scope=point_in_time|period|current_rule|scenario
estimation_status=not_applicable
transformation_type=gate_assessment|conflict_classification|gap_classification|agenda_ordering|verification_request
decision_status
created_at
limitations
```

每个门禁、冲突、缺口、议程和核验请求对象本体都直接携带父证据与四轴。议程排序必须指向截止日、依赖和状态证据；它不能被描述为经营优先级。

冲突分类对象：

```text
conflict_id
output_evidence_id
source_action_ids
conflicted_fields
parent_evidence_ids
source_type=agent
temporal_scope=point_in_time|period|current_rule|scenario
estimation_status=not_applicable
transformation_type=conflict_classification
decision_status
limitations
```

缺口分类对象：

```text
gap_id
output_evidence_id
source_action_id
missing_status
affected_field_or_evidence
impact
owner
next_step
parent_evidence_ids
source_type=agent
temporal_scope=point_in_time|period|current_rule|scenario
estimation_status=not_applicable
transformation_type=gap_classification
limitations
```

## 12. 缺失枚举

`not_returned / not_queried / parse_failed / missing / conflicted / true_zero` 是唯一缺失语义。前五种不能补零或通过门禁；`true_zero` 只适用于来源明确的真实零金额。

## 13. 零拷贝说明

本合同针对当前内置能力、专家责任矩阵和 Agent CLI 工作区独立设计。WhaleBridge 为 CC BY-NC 4.0，本商业项目不复制、翻译或改编其资金规划正文、表格、模板、固定费率或表达结构。
