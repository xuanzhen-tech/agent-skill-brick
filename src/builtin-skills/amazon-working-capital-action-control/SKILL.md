---
name: amazon-working-capital-action-control
description: "治理已有领域责任方提出的 Amazon 资金行动候选；适用于把内置现金流情景与采购、补货、广告、促销、税费等正式 action 关联，登记资金影响和依赖，分开人工 approval_state 与 commitment_state，并在 action ID、领域 owner、可推迟证据或关键字段缺失时失败关闭；不适用于根据现金流发明行动、自动审批或排序，也不执行下单、调拨、付款或融资。"
---

<!--
文件功能：指导 Agent 对已有领域行动候选执行资金影响登记、依赖核对和人工门禁编排。
职责边界：只治理用户、只读 uploads 或可信上游已有 action；当前 SIF 没有现金流、审批、承诺或领域 action 真相，因而不调用 SIF；不发明或修改动作、数量、时点和领域结论，不审批、不融资、不下单、不调拨、不付款。
重要关联：references/working-capital-action-contract.md 定义行动、审批与承诺状态；assets/templates/working-capital-action-control.md 是正式交付模板。
-->

# Amazon 营运资金行动控制

## 先读取哪些资源

- 每次执行都读取 `references/working-capital-action-contract.md`，按其 schema 接收行动，禁止自由补字段。
- 生成正式登记册时复制 `assets/templates/working-capital-action-control.md` 到本次 `outputs/`，只填充已有证据。

## 结果与非目标

把内置 `amazon-operating-analysis` 的同一现金流情景与各领域 owner 已经提出的行动候选关联，回答：

- 行动的资金影响金额和日期是否有证据？
- 行动是否属于明确的领域责任方？
- 前置依赖、法定/合同限制和可推迟性是否已核验？
- 人工审批与现实承诺是否分别有当前证据？
- 哪些行动可进入人工门禁议程，哪些必须失败关闭？

严格禁止：

- 不从经营数据发明新的采购、补货、广告、促销、税费、付款或融资动作。
- 不改来源行动的数量、金额、时点、优先级、供应商、渠道或条件。
- 不自行判断行动可推迟、可取消、可拆分或必须执行。
- 不用一个行动的审批推断另一个行动，也不用 `approval_state` 推断 `commitment_state`。
- 不代替领域 owner、批准人、财务、法务或平台执行方。
- 不下采购单、不调拨库存、不改广告、不报名促销、不付款、不融资、不发送指令。
- 不重算现金流、库存数量、利润、定价或领域收益。

## 输入合同

### 必需输入

每个行动必须来自可信领域责任方的正式输出，并至少包含：

- `source_action_id`
- `action_source`
- `domain_owner`
- `cashflow_scenario_id`
- `cash_effect_amount`
- `cash_effect_date`
- `deferrability_evidence_id`
- `approval_state`
- `commitment_state`

还必须能定位：

- 内置 `amazon-operating-analysis` 的正式现金流输出 ID 和版本
- 行动版本、站点/实体、币种、金额方向与适用期间
- 审批、承诺、依赖和限制的 Evidence ID

缺任一关键字段即失败关闭；不向空字段填默认值。

### 允许来源

- 用户明确提供并可定位的行动记录。
- 只读 `uploads/` 中领域 owner 的正式行动、审批、合同、订单或承诺证据。
- 可信上游 `outputs/` 中的版本化领域 action 和内置现金流情景。

当前 `sif_mcp` 的关键词、ASIN、流量、销量、广告和采购阈值计算不能提供成本、现金流、审批、承诺或领域 action 真相，本 Skill 不调用 SIF。合法输入不足时失败关闭，不回退 Web、浏览器、SP-API、Sorftime、金融平台或其他来源。

## 工作区

- 中间登记与核对：`temp/profit-management/<case-id>/working-capital-action-control/`
- 唯一正式交付：`outputs/profit-management/<case-id>/working-capital-action-control/`

`uploads/` 只读；不得覆写、移动、删除。正式结果不得写入 `temp/` 或 Skill 包目录。

## 证据与缺失语义

每个行动、金额、日期、依赖、可推迟性、审批和承诺证据记录：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

同时记录站点/实体、SKU 或行动对象、原币、目标币、金额方向、单位、期间/时区、来源定位和限制。

每个门禁判断、冲突、缺口、议程排序或人工核验请求都直接使用：

```text
output_evidence_id
output_type=gate_assessment|conflict_classification|gap_classification|agenda_ordering|verification_request
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|period|current_rule|scenario
estimation_status=not_applicable
transformation_type=gate_assessment|conflict_classification|gap_classification|agenda_ordering|verification_request
created_at
decision_status
limitations[]
```

每个正式对象本体都必须包含父证据与四轴，不能只在总谱系中登记一次。

冲突与缺口必须分别物化，不能只成为通用 `output_type`：

```text
conflict_id
output_evidence_id
source_action_ids[]
conflicted_fields[]
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|period|current_rule|scenario
estimation_status=not_applicable
transformation_type=conflict_classification
decision_status
```

```text
gap_id
output_evidence_id
source_action_id
missing_status
affected_field_or_evidence
impact
owner
next_step
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|period|current_rule|scenario
estimation_status=not_applicable
transformation_type=gap_classification
```

缺失状态只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五种不等于零，不能通过门禁；真实零也只表示有证据的零金额，不表示行动无风险或已批准。

## 责任矩阵

| 输入或动作 | 单一责任方 | 本 Skill 允许动作 |
|---|---|---|
| 经营权衡、未来现金流、库存资金、定价情景 | 内置 `amazon-operating-analysis` | 消费同一版本情景，登记行动资金影响 |
| 采购、供应商、MOQ、账期 | 第 07 采购专家 | 核对 action ID、影响、依赖和审批 |
| 补货、履约、库存执行准备 | 第 08 物流仓储专家 | 核对 action ID、影响、依赖和审批 |
| 广告预算、竞价、投放动作 | 第 05 广告投放专家 | 核对 action ID、影响、依赖和审批 |
| 促销价格、日历、报名动作 | 第 06 活动促销专家 | 核对 action ID、影响、依赖和审批 |
| 税费、法定期限、政策与合同限制 | 第 09 合规税务专家 | 消费当前限制证据，不能覆盖其结论 |
| 实际付款、融资、下单、调拨或平台动作 | 获授权人工/外部系统 | 只列为非本 Skill 执行责任 |

如果请求没有来源 action，而是要求“根据现金流给出该做什么”，路由内置经营分析和相应领域 owner，不在本 Skill 中创建候选。

## 执行流程

### 1. 冻结现金流情景

记录 `cashflow_output_id`、版本、`cashflow_scenario_id`、站点/实体、币种、期间、时区和上游限制。不同情景、版本或币种的行动不得直接合计或排序。

### 2. 验证来源行动身份

逐条确认：

- `source_action_id` 唯一且可回到正式输出。
- `action_source` 与 `domain_owner` 一致且属于责任矩阵。
- 行动版本、内容、数量和时点未被本 Skill 修改。
- 行动明确关联当前 `cashflow_scenario_id`。

只有口头想法、无 action ID、owner 不明或跨情景记录时，设置阻断状态，不能补造行动。

### 3. 原样登记资金影响

保存：

- 金额值、币种和流入/流出方向
- `cash_effect_date` 与时区
- 一次性/分期/区间口径
- 来源 Evidence ID
- 上游不确定性和限制

不从领域收益、库存数量或行动描述重算金额。不把缺失金额写成零，不把区间中点当确定金额，不把多币种静默换算。

### 4. 核对可推迟性和依赖

`deferrability_evidence_id` 必须来自领域 owner、合同/订单或第 09 当前限制证据。它应明确说明可推迟性、允许窗口、条件、批准人和有效期。

没有证据时，状态是缺失或阻断，不允许 Agent 根据“通常”“经验”“现金紧张”判断可以延期。

依赖至少检查：

- 领域前置条件
- 库存、交期或服务影响证据
- 合同、税费、法定或平台期限
- 相关审批与条件
- 其他行动的先后或互斥关系

### 5. 分开审批与承诺

`approval_state` 只允许：

- `not_submitted`
- `pending_review`
- `approved`
- `conditionally_approved`
- `rejected`
- `expired`
- `revoked`

`commitment_state` 只允许：

- `candidate`
- `approved_not_committed`
- `committed`
- `blocked`
- `cancelled`

两个状态必须分别有证据 ID 和观察时间，只能由来源证据更新：

- **状态独立不变量**：`approval_state` 与 `commitment_state` 不得互相推断。
- `approved` 不自动变成 `approved_not_committed` 或 `committed`。
- `committed` 不证明审批有效。
- `rejected` 不自动变成 `cancelled`。
- `cancelled` 不允许推断审批已撤销。
- `conditionally_approved` 必须保存条件；条件满足也需新审批证据才能更新。

发现不一致时并列证据并标 `conflicted`，不替责任方修正。

### 6. 执行人工门禁

顶层控制状态只允许：

- `ready_for_human_gate`
- `blocked_missing_field`
- `blocked_missing_source_action`
- `blocked_missing_cashflow_scenario`
- `blocked_owner_conflict`
- `blocked_dependency`
- `blocked_evidence_conflict`
- `out_of_scope`

只有 schema 完整、来源 action 可定位、同一现金流情景、依赖可核验且状态证据无冲突时，才可使用 `ready_for_human_gate`。它只表示资料可供人工审查，不表示行动已批准或可执行。

### 7. 比较资金影响

只在同一现金流情景、币种、金额口径和期间内并列资金影响。可以暴露：

- 时间段资金流出/流入分布
- 已承诺与未承诺影响
- 审批或依赖缺口
- 条件冲突和待决议题

不得因此生成新动作、改顺序、改金额或自动优先级。人工议程可按证据明确的截止日组织，但不能把日期排序包装成经营建议。

### 8. 写入正式产物

至少输出：

- `working-capital-action-control.md`
- `action-and-evidence-register.md`
- `human-gate-agenda.md`

报告不得声称已经批准、承诺、延期、取消、下单、调拨、投放、报名、付款或融资，除非相应来源证据明确证明状态；即使证明，也只描述已观察事实，不执行后续动作。

## 完成前自检

- 每个记录是否都有来源 `source_action_id` 和明确 `domain_owner`？
- 是否完全保留来源行动的数量、金额、时点和条件？
- 是否关联同一版本的内置现金流情景？
- `deferrability_evidence_id` 是否真实存在且当前有效？
- `approval_state` 与 `commitment_state` 是否严格分列、各有证据？
- 是否没有从一个状态推断另一个状态？
- 四轴、双层谱系与缺失枚举是否完整？
- 是否没有发明动作、提供融资建议或执行任何副作用？
- 正式产物是否只位于 `outputs/`？

任一答案为“否”时，保持阻断状态。
