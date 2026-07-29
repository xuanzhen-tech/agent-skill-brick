<!--
文件功能：提供仓库退货证据台账、处置候选、审批门和人工交接的正式模板。
使用方式：按 ../../SKILL.md 填写，并以 ../../references/return-disposition-decision-contract.md 为证据和门控依据。
维护边界：模板不执行移库、返工、退供、清算、捐赠、销毁、库存调整或对外沟通。
-->

# 仓库退货处置候选计划

> 未获匹配范围的人工批准时，所有方案只能写 `CANDIDATE_ONLY`。未知价值不得填零。

## 1. 任务范围

| 字段 | 内容 |
|---|---|
| 任务 ID |  |
| 退货批次 ID |  |
| 仓库/站点 |  |
| 单位粒度 | 单件/序列/箱/托/批次 |
| 证据截止时间及时区 |  |
| 计划生成时间及时区 |  |
| 货权主体 |  |
| 决策权主体 |  |

## 2. 原始证据 envelope

| evidence_id | source_type | source_locator | source_version | observed_at | business_time | temporal_scope | estimation_status | transformation_type | raw_value | raw_unit_or_currency | provider_or_owner | limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |

## 3. 身份、数量与地点台账

| return_item/lot_id | SKU | RMA/序列/批次 | 收到量 | 已检量 | 未检量 | 其他去向 | 单位 | 仓库/库位 | 保管人 | 闭环状态 |
|---|---|---|---:|---:|---:|---:|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

## 4. 状态证据

| 身份范围 | 检验结果原文 | 证据等级 | 检验人 | 检验时间 | 方法 | 覆盖数量 | 图片/报告定位 | 限制 |
|---|---|---|---|---|---|---:|---|---|
|  |  |  |  |  |  |  |  |  |

## 5. 所有权与决策权

| 身份范围 | 货权主体 | 保管主体 | 决策权主体 | 争议状态 | 生效时间 | 证据 | 门结果 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 6. 合规约束

| candidate_id | compliance_constraint_status | compliance_expert09_output_id | professional_evidence_ids[] | compliance_evidence_business_time | valid_as_of | jurisdiction_scope | limitations | 门结果 |
|---|---|---|---|---|---|---|---|---|
|  | `not_applicable/verified_clear/constraints_present/unknown/conflicted/expired` |  |  |  |  |  |  |  |

> 合规证据与人工审批必须分列。不可逆候选在适用约束为 `unknown`、`conflicted` 或 `expired` 时必须阻塞；人工批准不能覆盖该阻塞。

## 7. 处置候选矩阵

| Candidate ID | 候选类型 | 覆盖身份/数量 | 支持证据/缺失条件 | 可逆性 | 合规状态/证据 | 撤回点 | 错误影响 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 状态 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `normalized/planning` | `CANDIDATE_ONLY` |

## 8. 预期回收价值

| candidate_id | 金额/区间 | 币种 | 单件/整批 | 毛额/净额 | 估值时点 | 有效期 | 包含/排除 | 来源/版本 | 可比性 |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |

> 价值只能来自用户或专家 14 的带版本正式输出；本计划不重算处理费、运输费、税费、利润或贡献。

## 9. 顺序决策门

| Gate ID | 门 | Candidate ID | 结果 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 阻塞原因 | 最小补充材料 | 下一责任人 |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 身份唯一 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 数量闭环 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 状态证据 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 所有权/决策权 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 地点/保管 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 候选资格 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 可逆性 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 合规约束 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 价值边界 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |
|  | 人工审批 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |

## 10. 人工审批

| candidate_id | 审批人 | 权限范围 | 覆盖身份/数量 | 状态 | 批准/拒绝时间 | 条件 | 证据 |
|---|---|---|---|---|---|---|---|
|  |  |  |  | `not_requested` / `pending` / `approved` / `rejected` / `expired` / `scope_mismatch` |  |  |  |

## 11. 总体结论

| 身份/批次 | 结论 | 候选/批准计划 | 关键阻塞 | 人工下一步 |
|---|---|---|---|---|
|  | `EVIDENCE_INCOMPLETE` / `QUANTITY_CONFLICT` / `OWNERSHIP_BLOCKED` / `LOCATION_UNCONFIRMED` / `COMPLIANCE_BLOCKED` / `CANDIDATE_ONLY` / `APPROVED_FOR_MANUAL_HANDOFF` / `REJECTED` |  |  |  |

## 12. 派生 record 与双层谱系

| output_id | output_type | object_id | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | rule_version | generated_at | uncertainty | result_status | reason_codes[] | 规则/结果 | 对象轴 | 时间轴 | 单位/币种轴 | 口径轴 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `candidate` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `normalized/planning` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |
|  | `gate` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |

对象、时间、单位/币种和口径列仅为额外比较维度，不能替代两类对象本体的五项血缘字段。

`reason_codes[]` 只允许：`IDENTITY_UNRESOLVED | QUANTITY_CONFLICT | STATE_EVIDENCE_INSUFFICIENT | OWNERSHIP_BLOCKED | LOCATION_UNCONFIRMED | COMPLIANCE_CONSTRAINT_UNKNOWN | APPROVAL_INCOMPLETE | VALUE_EVIDENCE_MISSING | OUT_OF_SCOPE_REQUEST`。

## 13. 人工交接声明

- [ ] 实际执行方再次核对身份、数量、地点和批准范围。
- [ ] 不可逆候选再次核对可逆性、影响和批准条件。
- [ ] 不可逆候选再次核对带日期的专家09/专业合规证据；合规与人工批准不得相互替代。
- [ ] 买家侧退货/退款案件、索赔和客户沟通交专家11。
- [ ] HS、税率、清关、反倾销问题交专家 09。
- [ ] 运输经济、利润和费用模型交专家 14。
- [ ] 仓内动作、库存调整和财务记账由授权系统/人工执行。

本产物未执行任何移库、返工、退供、清算、捐赠、销毁、库存调整或消息发送。
