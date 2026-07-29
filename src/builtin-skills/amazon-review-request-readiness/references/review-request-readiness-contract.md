<!--
文件功能：定义 Amazon Review 请求就绪核对的状态、原因、政策窗口和反操纵字段。
职责边界：只约束人工执行前的证据判断，不授权发送、排程、批量触发或评价引导。
重要关联：由 ../SKILL.md 在就绪核对前读取；正式字段落入 ../assets/templates/review-request-readiness-template.md。
-->

# Review 请求就绪合同

## 一、订单范围

| 字段 | 要求 |
|---|---|
| `case_id` | 当前任务稳定 ID |
| `order_id_masked` | 单笔订单掩码标识 |
| `marketplace` | Amazon 站点 |
| `observation_cutoff` / `timezone` | 本次判断时点 |
| `human_reviewer` | 授权人工责任人 |
| `execution_status` | 恒为 `not_executed` |
| `request_status` | 恒为 `not_executed` |

## 二、顶层状态

只允许：

```text
human_execution_ready
blocked
```

`human_execution_ready` 不表示已发送或一定合规；它表示当前证据包通过本 Skill 的人工执行前门禁。

## 三、reason_code

| Reason code | 顶层状态 | 使用条件 |
|---|---|---|
| `evidence_complete` | human_execution_ready | 所有必需证据、政策、窗口、重复与敏感案件检查通过 |
| `needs_policy_evidence` | blocked | 缺当前、适站点、可定位政策证据 |
| `needs_order_evidence` | blocked | 缺订单身份或状态事实 |
| `needs_delivery_evidence` | blocked | 缺政策所需履约/送达锚点 |
| `already_requested` | blocked | 可信记录证明已经请求 |
| `outside_confirmed_policy_window` | blocked | 当前政策和时间证据共同证明不在窗口 |
| `policy_exclusion` | blocked | 当前政策明确排除 |
| `active_sensitive_case` | blocked | 有活跃高风险售后/索赔/安全案件 |
| `policy_conflict` | blocked | 当前政策来源或适用性冲突 |
| `record_conflict` | blocked | 订单、送达、请求或案件记录冲突 |
| `out_of_scope` | blocked | 直接发送、激励、引导或选择性请求 |

不得在没有政策 Evidence 的情况下使用 `outside_confirmed_policy_window`。

## 四、政策证据

| 字段 | 要求 |
|---|---|
| `policy_evidence_id` | 第 09 专家或用户材料中的稳定 ID |
| `marketplace` / `applicable_scope` | 必须匹配当前订单 |
| `source_locator` | 原文、页码或稳定定位 |
| `published_or_updated_at` | 来源明确时记录 |
| `verified_at` | 本次上游核验时间 |
| `window_anchor` | 只用政策明确事件 |
| `window_start_rule` / `window_end_rule` | 原规则，不写死候选 Skill 数值 |
| `boundary_inclusion` | inclusive / exclusive / unclear |
| `exclusions` | 当前政策明确排除 |
| `limitations` | 地区、语言、对象、时效与冲突 |

## 五、窗口计算

| 字段 | 要求 |
|---|---|
| `calculation_id` | 稳定 ID |
| `anchor_evidence_id` | 订单/履约/送达原始 Evidence |
| `anchor_at` / `anchor_timezone` | 未知不补 |
| `policy_evidence_id` | 当前政策依据 |
| `calculation_rule` | 可复核表达式 |
| `calculated_start` / `calculated_end` | 带时区 |
| `observation_cutoff` | 本次判断时点 |
| `boundary_review` | not_required / pending / approved |
| `calculation_status` | supported / missing / conflicted |

## 六、重复与敏感案件

请求历史必须记录覆盖时间、导出条件、原始状态和 Evidence IDs。未返回记录不等于零次：

```text
not_returned / not_queried / parse_failed / missing / conflicted / true_zero
```

敏感案件至少核对退货退款争议、A-to-z、payment chargeback、法律、安全和账户风险；只记录证据明确状态。

## 七、反操纵规则

以下情况一律不能通过门禁：

- 激励、补偿或利益交换；
- 正面/五星引导；
- 先评价后服务；
- 依据满意度或评分预测选择订单；
- 只请求可能好评者或排除可能差评者；
- 将 Review 与 Feedback、问答或客服满意度混淆；
- 直接发送或排程。

## 八、四轴与谱系

每条来源和 Agent 输出分别记录：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- `parent_evidence_ids`，仅 Agent 输出

所有就绪判断必须能回溯至订单、政策、请求历史和案件状态 Evidence。
