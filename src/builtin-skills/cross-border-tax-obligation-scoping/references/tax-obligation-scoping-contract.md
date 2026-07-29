<!--
文件功能：定义跨境税务的实体、业务流、事件、现行依据、义务候选、资料覆盖和专业问题合同。
职责边界：不提供税率、阈值、税额或确定义务，不替代税务顾问、会计师或税务机关。
重要关联：由 ../SKILL.md 在范围界定时读取；正式字段映射到 ../assets/templates/tax-obligation-scoping-template.md。
-->

# 税务义务范围合同

## 1. 实体

- `entity_id`
- `legal_name_masked`
- `jurisdiction`
- `tax_identifier_masked`
- `roles`
- `contract/account/payee references`
- `parent_evidence_ids`
- `identity_conflicts`

## 2. 业务流

每种模式记录：

- `flow_id`
- `goods_flow`
- `ownership_transfer`
- `inventory_locations`
- `seller_of_record`
- `invoice_issuer`
- `collection/refund party`
- `platform_role_reported`
- `currency`
- `period`
- `evidence_ids`

## 3. 税务事件

| 字段 | 说明 |
|---|---|
| `tax_event_id` | 稳定编号 |
| `jurisdiction` | 必填 |
| `event_type` | 进口、库存、销售、服务、退款等 |
| `event_date` | 必填或 unknown |
| `entity/product/order scope` | 范围 |
| `amount_or_quantity_reported` | 输入事实，不计算税额 |
| `parent_evidence_ids` | 必填 |
| `authority_evidence_needed` | 所需依据 |

## 4. 义务候选

| 字段 | 说明 |
|---|---|
| `obligation_candidate_id` | 稳定编号 |
| `question_type` | registration/filing/invoice/platform_collection/import/records/refund |
| `trigger_facts` | 事实 |
| `authority_evidence_ids` | 带日期依据 |
| `status` | candidate/qualified_confirmation_required/confirmed_by_qualified_owner/not_applicable_by_qualified_owner |
| `responsible_owner` | 合格责任方 |
| `deadline_or_gate` | 日期或业务闸门 |
| `limitations` | 结论上限 |

Agent 不得自行进入后两种责任方状态。

## 5. 阈值/税率证据

若用户提供，记录：

- 数值和币种；
- 计算基础；
- 期间；
- 适用主体/交易；
- 生效日期；
- 来源段落；
- 确认责任方。

不得自行计算应税额或判断触发。

## 6. 四轴与谱系

每条记录包含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。

Agent 的义务候选属于 inference，不是税务结论。

## 7. 来源可用性与业务状态

`source_availability_status` 与税务 `result_status/obligation status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无交易、无义务或无风险；`true_zero` 必须来自完整可验证覆盖。

正例：完整期间交易导出明确退款笔数为 0，可记 `true_zero`。反例：平台代征字段未返回时记 `not_returned`，不能写代征额为 0 或无需申报。
