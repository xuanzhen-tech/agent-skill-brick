<!--
文件功能：定义站外付费媒体的任务、受众假设、素材、落地页、预算、媒体干预事实、测量问题交接和上线闸门合同。
职责边界：不定义 KPI、样本、停止规则、分析窗口或实验协议，不提供平台实时枚举、受众规模或价格，不连接账户、配置追踪或发布广告。
重要关联：由 ../SKILL.md 在编制 brief 时读取；正式字段映射到 ../assets/templates/offsite-paid-media-brief-template.md。
-->

# 站外付费媒体 Brief 合同

## 1. 顶层结果合同

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `MISSING_PLATFORM_RULES | AUDIENCE_UNVERIFIED | CREATIVE_RIGHTS_UNKNOWN | LANDING_PAGE_UNAVAILABLE | MEASUREMENT_HANDOFF_MISSING | ECONOMIC_GUARDRAIL_MISSING | EXPERIMENT_PROTOCOL_MISSING | SIF_SCHEMA_MISMATCH | OUT_OF_SCOPE_REQUEST`

每次运行只允许这一组顶层结果字段；不得并列 `status` 或 `brief_status`。`publication_status` 是局部字段且固定为 `not_published`。

## 2. 媒体任务

- `media_brief_id`
- `brand/product/market scope`
- `platform_candidate`
- `business_objective`
- `decision_window`
- `budget_currency/range`
- `owner/approver`
- `version`
- `parent_evidence_ids`

## 3. 受众假设

| 字段 | 说明 |
|---|---|
| `audience_hypothesis_id` | 稳定编号 |
| `description` | 业务描述 |
| `evidence_ids` | 来源 |
| `need_or_context` | 需求/情境 |
| `include/exclude` | 约束 |
| `product_fit` | 关联 |
| `sensitive_attribute_risk` | 风险 |
| `platform_feasibility` | confirmed_by_user/confirmation_required/not_applicable |
| `validation_method` | 如何验证 |

不得填写未经平台资料支持的可触达规模。

## 4. 素材需求

每项记录：

- `creative_requirement_id`
- `audience_hypothesis_id`
- `fact_ids`
- `claim_restrictions`
- `format_requirement`
- `brand_asset_ids`
- `rights_status`
- `localization/accessibility`
- `platform_spec_status`
- `production_owner`

## 5. 落地页

| 字段 | 说明 |
|---|---|
| `destination_id/version` | 用户提供 |
| `product/offer evidence` | 必填 |
| `cta` | 明确 |
| `locale/device scope` | 范围 |
| `privacy/cookie/consent status` | 责任方确认 |
| `tracking status` | reported/not_assessed |
| `claim_consistency` | supported/conflicted/not_assessed |

## 6. 媒体干预与测量问题交接

| 字段 | 规则 |
|---|---|
| `intervention_id` | 当前媒体干预稳定 ID，必填 |
| `media_intervention_facts` | 平台候选、受众假设、素材/落地页版本、预算情景和人工计划时间等已证事实 |
| `measurement_question` | 交给第13专家的决策问题，必填 |
| `event_label` | 用户或可信上游提供的标签；不在本包定义事件实现 |
| `desired_metric` | 指标名称或上游指标 ID；不在本包定义 KPI 公式 |
| `experiment_protocol_id` | 仅引用第13专家已验收协议；可为 `missing` |
| `protocol_version` | 保留第13上游版本 |
| `protocol_status` | `referenced_applicable/referenced_mismatch/missing` |
| `parent_evidence_ids` | 媒体事实和协议来源 |

禁止在本包新增或覆盖 KPI、分子/分母、样本、分组、停止规则、分析窗口、显著性规则和归因方法。仅当 `experiment_protocol_id` 存在且适用于 `intervention_id` 时才按协议填值。

## 7. 预算

预算只用范围和第14护栏；不定义平台最低预算、行业价格或效果承诺。

## 8. 局部上线字段

- `publication_status`: 固定 `not_published`
- `platform_confirmation_status`: `confirmed_by_user | confirmation_required`
- `human_approval_status`: `pending | approved | rejected`

Agent 不得声称已配置或已发布。

## 9. 四轴与谱系

每条记录包含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。原始 SIF 背景对象额外直接保存 `source_provider=sif`、`source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`query_scope`、覆盖/分页和 `raw_result_locator`，并使用 `transformation_type=reported`；`estimation_status` 按结果自述保留 `reported` 或 `estimated`。`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的真实值；上下文未暴露对应字段时分别写 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`；三类 ID 不得互相代填，也不得以本地 ID 冒充服务端 ID。Agent 派生对象不得继承 `source_type=sif_mcp`。
