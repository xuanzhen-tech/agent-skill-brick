<!--
文件功能：提供品牌内容策略、SIF Amazon 站内背景证据、证据账本和静态人工审批日历的正式交付模板。
职责边界：模板只承载待人工复核的策略与计划；SIF 仅作关键词、ASIN 与流量供应商背景，不表示已排程、发布、批准促销、验证热点或完成视觉制作。
重要关联：字段语义见 references/brand-content-evidence-contract.md；生成前遵守上级 SKILL.md。
-->

# 品牌内容策略与静态日历

## 1. 运行摘要

| 字段 | 值 |
|---|---|
| Plan ID / Version |  |
| Brand / Product Scope |  |
| Marketplace / Locale |  |
| Channels |  |
| Planning Period / Timezone |  |
| Generated At |  |
| Reviewer / Owner |  |
| Result Status | `draft_for_review / blocked / out_of_scope` |
| Reason Codes | `[none]` |
| Schedule Status | `not_scheduled` |
| Publish Status | `not_published` |

## 2. 输入与当前性

| Evidence ID | Record Type | Source Type | Locator | Observed / Business Time | Verified At | Valid Until | Applicable Scope | Temporal Scope | Estimation Status | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

### 2.1 SIF Amazon 站内背景（可选）

| Evidence ID | Source Type | Provider | Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace | Query Scope | Temporal Scope | Coverage / Pagination | Estimation Status | Transformation Type | Raw Result Locator | 使用限制 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` |  |  |

> `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文中的对应真实值；若上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。本表只承载 SIF 原始供应商证据；后续 pillar、brief 与日历项仍以 `source_type=agent` 直接链接父 Evidence IDs。

## 3. 品牌与声明边界

| Claim ID | Approved Text | Evidence IDs | Product / Marketplace / Channel | Approval | Valid Until | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Prohibited Expansion |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  | `current_rule` |  |  |  |

## 4. 站外内容观察

| Observation ID | Stable Profile / URL ID | Channel | Observed At | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Observable Pattern | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

> 这里只记录用户提供的可见观察。任何意图、受众或效果解释必须另列为 `agent_hypothesis`。

## 5. 内容支柱

| Agent Output ID | Pillar ID | Content Intent | Audience Problem / Job | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Allowed Claims | Asset Requirements | Channels / Locales | Hypotheses | Invalidation Triggers |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` |  |  |  |  |  |  |  |  |

## 6. 信息架构

| Agent Output ID | Brief ID | Pillar ID | Primary Message | Supporting Message | CTA Boundary | Claim IDs | Channel Context | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 04 Handoff | 09 Question | 13 Measurement Question |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` |  |  |  |  |  |  |

## 7. 促销引用

| Promotion Brief ID | Approval | Marketplace / Scope | Valid From / To | Approved Claim IDs | Parent Evidence IDs | Source Type | Source Locator | Temporal Scope | Estimation Status | Transformation Type | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

缺正式批准 brief 时，不在内容中写价格、折扣、窗口、资格、倒计时或紧迫性。

## 8. 静态内容日历

| Agent Output ID | Calendar Item ID | Proposed Slot / Timezone | Slot Basis Evidence | Pillar / Brief | Channel / Locale | Content Intent | Claim IDs | Asset Requirement | Dependencies | Owner / Reviewer | Valid Until | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Schedule Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  | `agent` |  |  |  | `not_scheduled` |

## 9. 派生记录

| Agent Output ID | Output Type | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Transformation Summary | Rule Version | Uncertainty | Human Review | Result / Reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  | `agent` |  |  |  |  |  |  |  |  |

`temporal_scope`、`estimation_status` 和 `transformation_type` 必须使用 `brand-content-evidence-contract.md` 派生 schema 的允许值；四轴不可合并成单一说明字段。

## 10. 缺口、冲突与失效

| Gap ID | Agent Output ID | Affected Output | Missing / Conflicted Evidence | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Current State | Reason Code | Owner | Required Resolution | Effect | Invalidation Trigger |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  | `agent` |  | `not_applicable` | `gap_classification` |  |  |  |  |  |  |

## 11. 人工审批

- [ ] 品牌事实和 claims 可追溯且未扩张
- [ ] 站外观察与 Agent 假设分开
- [ ] 平台规则、事件和观察仍在有效范围内
- [ ] 促销内容引用第 06 正式批准 brief
- [ ] 视觉要求已路由第 04，未越界制作规格
- [ ] 政策问题已路由第 09
- [ ] 测量问题已路由第 13
- [ ] 每个已调用 SIF 工具均先 `describe`，且只作 Amazon 关键词、ASIN 或流量背景
- [ ] SIF 未被用于 Review 正文、creator、社媒、DTC、邮件、促销或站外效果事实
- [ ] 未调用 Web、邮件、抓取、shell 网络或外部平台
- [ ] `schedule_status=not_scheduled`
- [ ] `publish_status=not_published`

## 12. 未执行声明

本交付没有抓取社媒或 creator 数据，没有调用 Shopify/ESP/发布平台，没有创建后台任务，没有排程或发布任何内容，也没有验证所谓“最佳发布时间”。
