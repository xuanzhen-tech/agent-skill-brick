<!--
文件功能：定义仓库退货处置候选的证据字段、顺序门控、审批和负面测试合同。
使用方式：由 SKILL.md 在候选生成、人工审批门和正式质量门时引用。
维护边界：不定义仓内执行、库存调整、财务记账、清关税务或运输经济算法。
-->

# 退货处置决策合同

## 1. 统一证据与派生合同

### 原始证据 envelope

| 字段 | 要求 |
|---|---|
| `evidence_id` | 当前任务内唯一 |
| `source_type` | `user_input` / `user_upload` / `trusted_upstream_output` |
| `source_locator` | 文件/产物、页/表/行、图片/视频区域或记录定位 |
| `source_version` | 来源或上游版本 |
| `observed_at` | 本任务读取时间及时区 |
| `business_time` | 收货、检验、盘点、估值、合规或批准业务时间 |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `unknown` |
| `transformation_type` | `raw` / `provider_derived` |
| `raw_value` | 不覆盖的原始值 |
| `raw_unit_or_currency` | 原单位/币种 |
| `provider_or_owner` | 仓库、检验、专家09/14、批准人等责任方 |
| `limitations` | 覆盖、时效、辖区和适用限制 |

### 派生 record

正式派生对象本体：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 必要载荷 |
|---|---|---|---|---|---|---|---|
| `candidate` | `candidate_id` | 支撑候选资格、范围、可逆性和限制的原始 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | `normalized` / `planning` | 候选类型、覆盖身份/数量、资格规则、可逆性、合规/价值/审批状态和撤回点 |
| `gate` | `gate_id` | 支撑门结果的 Evidence/Candidate IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | `comparison` / `decision` | 门类型、适用候选、规则、结果、阻塞原因、最小补充材料和下一责任人 |

两类对象还必须直接关联 `output_id`、`rule_version`、`generated_at`、`uncertainty`、`result_status` 与 `reason_codes[]`。`result_status` 只允许 `ready` / `ready_with_limitations` / `blocked` / `out_of_scope`；`reason_codes[]` 只允许 `IDENTITY_UNRESOLVED` / `QUANTITY_CONFLICT` / `STATE_EVIDENCE_INSUFFICIENT` / `OWNERSHIP_BLOCKED` / `LOCATION_UNCONFIRMED` / `COMPLIANCE_CONSTRAINT_UNKNOWN` / `APPROVAL_INCOMPLETE` / `VALUE_EVIDENCE_MISSING` / `OUT_OF_SCOPE_REQUEST`。

对象、时间、单位/币种和口径仅为额外比较维度，不能替代两类对象本体的五项血缘字段。

## 2. 单位/批次证据表

| 强制维度 | 最小字段 | 失败结果 |
|---|---|---|
| 身份 | 稳定退货/批次 ID、SKU、可选序列/RMA 关联 | `EVIDENCE_INCOMPLETE` |
| 数量 | 收到、已检、未检、其他去向、单位、时点 | `QUANTITY_CONFLICT` |
| 状态证据 | 原文、检验人、方法、日期、覆盖范围、定位 | `EVIDENCE_INCOMPLETE` |
| 所有权 | 货权、决策权、争议、证据时点 | `OWNERSHIP_BLOCKED` |
| 地点 | 仓库、区域/库位、保管人、确认时间 | `LOCATION_UNCONFIRMED` |
| 可逆性 | 等级、撤回点、条件、错误影响 | 不得进入批准 |
| 回收价值 | 金额/区间、币种、毛净口径、时点、来源 | `unknown`，不得填零 |
| 审批 | 人、权限、范围、状态、时间、证据 | `CANDIDATE_ONLY` |

## 3. 数量闭环

在同一身份范围、同一时点和同一单位下检查：

`收到数量 = 已检数量 + 未检数量 + 已确认的其他去向数量`

要求：

- 所有项具有证据。
- 不同单位先保持分开；只有换算规则已由用户提供时才换算。
- 差额不自动命名。
- 重复行不静默去重。
- 抽检数量和全批数量分开。

## 4. 状态证据等级

| 等级 | 说明 | 可支持范围 |
|---|---|---|
| `unit_verified` | 单件/序列级检验可定位 | 对应单位 |
| `lot_verified` | 全批按明确规则检验 | 对应批次 |
| `sample_only` | 仅抽样且抽样规则有限 | 样本本身；外推需人工规则 |
| `statement_only` | 无可定位检验材料的声明 | 背景，不支持不可逆候选 |
| `unknown` | 无证据 | 只能等待检验 |

商品详情页、历史差评或过往批次问题不能替代当前实物状态证据。

## 5. 所有权与批准分离

所有权回答“谁有权处分资产”，审批回答“有权者是否批准本候选”。两者都必须存在。

所有权字段：

- `asset_owner`
- `custody_owner`
- `decision_right_holder`
- `dispute_status`
- `effective_at`
- `evidence_id`

审批字段：

- `candidate_id`
- `approver`
- `authority_scope`
- `covered_item_ids`
- `covered_quantity`
- `status`
- `approved_at`
- `conditions`
- `evidence_id`

审批人身份存在但权限范围未知，不算批准。

## 6. 合规约束与审批分离

| 字段 | 规则 |
|---|---|
| `compliance_constraint_status` | `not_applicable` / `verified_clear` / `constraints_present` / `unknown` / `conflicted` / `expired` |
| `compliance_expert09_output_id` | 涉及跨境退运、HS、税费、清关或反倾销时引用专家09正式产物 |
| `professional_evidence_ids[]` | 其他适用专业/监管证据 |
| `compliance_evidence_business_time` | 证据业务时间及时区 |
| `valid_as_of` | 证据有效时点 |
| `jurisdiction_scope` | 国家/地区与适用范围 |
| `limitations` | 明示限制 |

专家09或专业证据必须带日期、版本、范围和责任方。合规证据与 `human_approval_status` 必须分列；人工批准不能替代、覆盖或推翻适用约束。不可逆候选在 `unknown`、`conflicted` 或 `expired` 时一律 `result_status=blocked`，`reason_codes[]` 包含 `COMPLIANCE_CONSTRAINT_UNKNOWN`。

买家侧退货/退款案件、索赔和客户沟通由专家11处理；本合同只覆盖仓内实物处置。

## 7. 可逆性门

| 可逆性 | 最小要求 |
|---|---|
| `reversible` | 撤回路径、截止点、影响已说明 |
| `conditionally_reversible` | 条件、成本/影响来源、截止点和批准已说明 |
| `irreversible` | 货权、单位范围、数量、证据、影响、适用合规证据和明确人工批准全部闭环 |

不得仅依据候选名称断定可逆性；必须记录本任务具体条件。

## 8. 预期回收价值合同

价值来源只允许：

- 用户明确提供的估值；
- 专家 14 的带版本正式输出。

必需字段：

| 字段 | 说明 |
|---|---|
| `value_evidence_id` | 来源证据 |
| `amount_or_range` | 金额或区间 |
| `currency` | 原币 |
| `basis` | 单件/整批 |
| `gross_or_net` | 毛额/净额/未知 |
| `valuation_at` | 估值时点 |
| `valid_until` | 有效期；未提供则未知 |
| `included_items` | 包含项 |
| `excluded_items` | 排除项 |
| `owner` | 估值责任人/上游 |
| `confidence` | 来源提供时保留 |

本 Skill 不补算处理费、运输费、税费、利润或贡献。不同币种、时点或毛净口径默认不可排名。

## 9. 候选资格表

每个候选必须形成正式对象并回答：

| 字段 | 规则 |
|---|---|
| `candidate_id` | 本层候选稳定唯一 |
| `candidate_type` / `covered_identity_quantity` | 候选类型及覆盖单位/数量 |
| `parent_evidence_ids` | 支撑资格、范围、可逆性和限制的原始 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `not_applicable` / `estimated` / `unknown` |
| `transformation_type` | `normalized` / `planning` |
| `user_allowed` / `state_support` / `missing_conditions` | 用户是否允许、状态证据和缺失条件 |
| `ownership_location_status` / `reversibility` | 所有权、地点和可逆性 |
| `compliance_status_and_evidence` | 合规约束状态及带日期的专家09/专业证据 |
| `value_evidence` / `approval_status` / `withdrawal_point` | 价值、审批和撤回点 |

任一强制问题无法回答时，只能 `CANDIDATE_ONLY` 或更严格的阻塞状态。

每次顺序门判断必须形成正式 `gate` 对象：

| 字段 | 规则 |
|---|---|
| `gate_id` | 本层门控稳定唯一 |
| `gate_type` / `candidate_id` / `gate_rule` | 门类型、适用候选和判定规则 |
| `parent_evidence_ids` | 支撑门结果的 Evidence/Candidate IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `not_applicable` / `estimated` / `unknown` |
| `transformation_type` | `comparison` / `decision` |
| `gate_result` / `blocking_reason` | 门结果与阻塞原因 |
| `minimum_additional_evidence` / `next_owner` | 最小补充材料和下一责任人 |

## 10. 审批门正向测试

若某候选具有：

- 唯一单位范围；
- 数量闭环；
- 带日期且覆盖对应单位的检验证据；
- 明确货权和决策权；
- 明确地点；
- 已记录可逆性与影响；
- 合规约束已核对，且不可逆候选具有适用、带日期的专家09/专业证据；
- 有来源明确的价值或明确 `unknown`；
- 有权审批人对同一范围明确 `approved`；

则可标记 `APPROVED_FOR_MANUAL_HANDOFF`。仍不得执行。

## 11. 反向测试

以下均不得通过：

- 批次 100 件只抽检 5 件，却把 100 件全部列为可返库。
- 收到 100 件、已检 80 件、未检 10 件，差额 10 件自动记为丢失。
- 商品仍在售，于是推断退货实物完好。
- 仓库名称已知但库位未知，却生成移库计划。
- 所有权争议中，却生成销毁候选的批准状态。
- 销毁已有人工批准，但适用合规约束未知，仍标为可交接执行。
- 价值未提供，于是填 0 并据此选择销毁。
- 审批邮件只覆盖 10 件，却把整批 100 件标记已批准。
- 生成 WMS 任务、库存调整或销毁指令。

## 12. 人工交接最小字段

- 候选 ID 和覆盖单位/数量。
- 当前状态和未通过的门。
- 证据 ID。
- 可逆性与最晚撤回点。
- 合规约束状态、专家09/专业证据 ID、日期、辖区和限制。
- 价值来源及限制。
- 审批人、权限、状态和条件。
- 实际执行前需再次复核的事项。
- 明确声明“本产物未执行任何处置”。
