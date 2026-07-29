<!--
文件功能：定义 A-to-z Guarantee Claim 与 payment chargeback 单案的类型、期限、主张、附件、回应和状态字段。
职责边界：只约束证据准备与回应草案，不授权提交、改案、退款、伪造证据、法律结论或账号级 POA。
重要关联：由 ../SKILL.md 在索赔分析前读取；正式字段落入 ../assets/templates/buyer-claim-response-template.md。
-->

# 买家索赔单案合同

## 一、案件范围

| 字段 | 要求 |
|---|---|
| `case_id` | 当前 Agent 任务稳定 ID |
| `claim_type` | atoz_guarantee_claim / payment_chargeback |
| `claim_id_masked` / `order_id_masked` | 掩码标识 |
| `marketplace` | Amazon 站点 |
| `observation_cutoff` / `timezone` | 本次分析时点 |
| `human_reviewer` / `submission_owner` | 授权责任人 |
| `execution_status` | 恒为 `not_executed` |
| `submission_status` | 恒为 `not_submitted` |

## 二、期限字段

| 字段 | 要求 |
|---|---|
| `deadline_evidence_id` | 原始通知或案件页 Evidence ID |
| `deadline_original` | 原文日期/时间，不改写 |
| `marketplace` | 必填，否则不能验证 |
| `deadline_timezone` | 来源或当前政策明确的时区 |
| `converted_deadline` | 有透明转换规则时才填 |
| `observation_cutoff` | 计算剩余时间的基准 |
| `deadline_status` | verified / unverified / conflicted / expired_in_source_record |
| `limitations` | 截图截断、时区不明、政策冲突等 |

日期、站点或时区任一缺失时，`deadline_status=unverified`。

## 三、allegation 字段

| 字段 | 要求 |
|---|---|
| `allegation_id` | 稳定 ID |
| `source_locator` | 原始通知定位 |
| `original_text_excerpt` | 最小必要摘录 |
| `subject` | 商品、配送、退款、沟通、支付等 |
| `claimed_amount` / `currency` | 来源明确时记录 |
| `supporting_evidence_ids` | 支持主张的证据 |
| `contradicting_evidence_ids` | 反证 |
| `missing_evidence` | 仍需材料 |
| `support_status` | supported / partially_supported / unsupported / conflicted |
| `allowed_response_conclusion` | 草案可表达上限 |
| `prohibited_expansion` | 不得推断或承诺内容 |

## 四、附件字段

| 字段 | 要求 |
|---|---|
| `attachment_id` | 稳定 ID |
| `source_path_or_locator` | 受控路径或原始定位 |
| `file_type` / `size` | 来源可得时记录 |
| `related_allegation_ids` | 对应主张 |
| `parent_evidence_ids` | 原始证据 |
| `parse_status` | observed / partial / parse_failed / conflicted |
| `privacy_class` | public / internal / sensitive / restricted |
| `minimum_necessary` | yes / no / needs_review |
| `human_inclusion_status` | pending / approved / excluded |

Agent 生成摘要或标注不能冒充原始附件。

## 五、回应声明

| 字段 | 要求 |
|---|---|
| `statement_id` | 草案事实单元 |
| `related_allegation_id` | 对应 allegation |
| `statement_text` | 去标识草案 |
| `parent_evidence_ids` | 直接支撑来源 |
| `support_status` | supported / partially_supported / unsupported / conflicted |
| `attachment_ids` | 需要人工选择的附件 |
| `human_review_status` | pending / approved / revise / rejected |

`unsupported` 与 `conflicted` 声明不得进入人工可提交正文。

## 六、顶层状态

只允许：

```text
draft_for_human_review
blocked_missing_original_notice
blocked_claim_type_unverified
blocked_missing_order_evidence
blocked_missing_policy_evidence
blocked_deadline_unverified
blocked_evidence_conflict
blocked_sensitive_or_legal_review
out_of_scope
```

## 七、四轴、谱系与缺失

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

## 八、职责路由

| 问题 | 责任方 |
|---|---|
| 普通买家消息 | 本专家消息分诊 Skill |
| 单案退货退款 | 本专家退货退款 Skill |
| 当前政策、平台规则、法律/IP | 第 09 专家或合格责任人 |
| 跨案件 RCA、账号健康、POA | 第 10 专家 |
| 退回商品仓内事实 | 第 08 专家 |
| 跨案索赔 KPI | 第 13 专家 |
