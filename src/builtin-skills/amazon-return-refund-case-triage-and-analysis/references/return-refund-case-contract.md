<!--
文件功能：定义单笔退货退款案件的证据、事件、理由、状态和跨专家交接字段。
职责边界：只约束分析产物，不授权退款、换货、赔付、仓内处置或平台状态变更。
重要关联：由 ../SKILL.md 在事件链重建前读取；正式字段落入 ../assets/templates/return-refund-case-template.md。
-->

# 退货退款单案合同

## 一、案件标识

| 字段 | 要求 |
|---|---|
| `case_id` | 当前 Agent 任务稳定 ID |
| `order_id_masked` | 掩码订单标识 |
| `return_id_masked` / `refund_id_masked` | 仅材料明确提供时记录 |
| `marketplace` | Amazon 站点 |
| `currency` | ISO 币种；不同币种不得直接相加 |
| `observation_cutoff` / `timezone` | 本次分析观察截止时间 |
| `case_scope` | 必须是单订单单案件，例外需解释 |
| `execution_status` | 恒为 `not_executed` |

## 二、事件字段

允许的 `event_type`：

```text
return_request
return_authorization
physical_return
inspection
refund
replacement
concession
chargeback
```

每个事件记录：

| 字段 | 要求 |
|---|---|
| `event_id` | 稳定 ID |
| `event_type` | 仅使用上表枚举 |
| `source_status` | 原来源原样状态 |
| `normalized_status` | 项目规范化状态，需保留映射规则 |
| `occurred_at` / `timezone` | 未知不补 |
| `actor` | buyer / seller / platform / carrier / warehouse / payment_provider / unknown |
| `amount` / `currency` / `quantity` | 不适用时为空，缺失不填 0 |
| `parent_evidence_ids` | 支撑事件的来源证据 |
| `evidence_state` | observed / inferred / missing / conflicted / parse_failed |
| `limitations` | 覆盖、延迟、解析或身份限制 |

不同事件不得共用一个“已完成”状态掩盖真实流程。

## 三、理由字段

| 字段 | 要求 |
|---|---|
| `reason_id` | 稳定 ID |
| `reason_layer` | source_reported_reason / evidence_supported_reason / agent_hypothesis |
| `reason_code` / `description` | 可理解且不夸大 |
| `parent_evidence_ids` | 直接支撑来源 |
| `support_status` | supported / partially_supported / unsupported / conflicted |
| `alternative_explanations` | 有竞争解释时列出 |
| `next_validation_action` | 人工或相邻专家下一步 |
| `external_statement_allowed` | yes / no / needs_review |

`agent_hypothesis` 不能填入 `evidence_supported_reason`，也不能直接写进买家回复。

## 四、金额与分母

- 退款、补偿、替换价值和拒付金额分别记录；
- 原币金额与换算金额分列，换算需来源、时间和规则；
- `missing` 不得记为 0；
- 本合同不定义总体退货率或退款率；
- 没有有效 numerator 与 denominator 时，`metric_status=not_computable`。

## 五、顶层结果

只允许：

```text
case_ready_for_human_review
blocked_missing_case_record
blocked_missing_order_evidence
blocked_missing_policy_evidence
blocked_event_conflict
blocked_sensitive_case
out_of_scope
```

同时写：

```text
execution_status=not_executed
refund_status=not_executed
replacement_status=not_executed
```

## 六、四轴与谱系

每条来源和 Agent 输出分别记录：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- `parent_evidence_ids`，仅 Agent 输出

缺失枚举固定为：

```text
not_returned / not_queried / parse_failed / missing / conflicted / true_zero
```

## 七、职责路由

| 问题 | 责任方 |
|---|---|
| 买家回复草案 | 本专家消息分诊 Skill |
| 退回商品仓内检验与处置 | 第 08 专家 |
| 当前政策、法规、资格与期限 | 第 09 专家 |
| 跨案件根因、账号级 POA | 第 10 专家 |
| A-to-z / payment chargeback | 本专家索赔 Skill |
| 跨案退货退款 KPI | 第 13 专家 |
