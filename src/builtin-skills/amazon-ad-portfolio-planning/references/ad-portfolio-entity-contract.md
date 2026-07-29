<!--
文件功能：定义广告规划中的账户锚点、实体层级、稳定 ID、目标、预算护栏和实施状态合同。
职责边界：不提供平台枚举或 Ads API 字段，不执行创建、修改、启用、暂停或预算操作。
重要关联：由 ../SKILL.md 在建立广告结构时读取；正式字段映射到 ../assets/templates/ad-portfolio-plan-template.md。
-->

# 广告组合实体合同

## 1. 顶层结果合同

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `ACCOUNT_SCOPE_MISSING | PRODUCT_SCOPE_CONFLICT | KEYWORD_EVIDENCE_MISSING | ECONOMIC_GUARDRAIL_MISSING | PLATFORM_ENUM_CONFIRMATION_REQUIRED | PARTIAL_RESULT | OUT_OF_SCOPE_REQUEST`

每次运行只允许这一组顶层结果字段；不得并列 `planning_status` 或 `readiness_status`。实体 `status` 和人工实施状态只描述局部对象生命周期。

## 2. 账户锚点

| 字段 | 规则 |
|---|---|
| `marketplace_id` | 必填 |
| `account_scope_id` | 用户或一方资料提供 |
| `profile_id` | 缺失时不得进入实施就绪 |
| `brand_scope` | 品牌/主体范围 |
| `currency` | 不从站点猜测 |
| `timezone` | 不从站点猜测 |
| `source_evidence_ids` | 必填 |

## 3. 规划实体

所有层级共用：

- `plan_entity_id`
- `entity_level`
- `parent_plan_entity_id`
- `platform_entity_id`
- `display_name`
- `marketplace_id`
- `product_scope_ids`
- `objective_id`
- `status`
- `version`
- `parent_evidence_ids`

`platform_entity_id` 只有人工执行并回填后才能填写。名称不可替代稳定 ID。

## 4. 实体状态

- `draft`
- `ready_for_human_implementation`
- `blocked`
- `human_created_unverified`
- `platform_id_verified`
- `human_enabled`
- `superseded`

Agent 不得自行进入 `human_created_unverified` 之后的状态。

## 5. 目标与指标

| 字段 | 说明 |
|---|---|
| `objective_id` | 稳定编号 |
| `business_question` | 要解决的决策 |
| `primary_metric` | 指标合同而非口号 |
| `guardrail_metrics` | 利润、库存、Listing 等 |
| `measurement_window` | 期间和时区 |
| `required_report_type` | 抽象描述，不猜平台枚举 |
| `causal_limit` | 观察或实验结论上限 |

## 6. Target 规划

每项记录：

- `plan_target_id`
- `target_source_id`
- `target_source_type`
- `include_attributes`
- `exclude_attributes`
- `product_anchor_ids`
- `target_type_abstract`
- `platform_enum_status`
- `overlap_purpose`
- `migration_evidence_required`

第02专家拥有关键词研究；本包只消费其稳定 ID。

## 7. 预算与竞价护栏

| 字段 | 规则 |
|---|---|
| `scenario_id` | 保守/基准/进取仅为用户情景 |
| `budget_currency` | 必填 |
| `total_budget_limit` | 用户或上游提供 |
| `entity_budget_range` | 范围而非执行值 |
| `bid_range` | 无经济边界时 tbd |
| `economic_guardrail_evidence_ids` | 来自14或用户 |
| `approval_owner` | 必填 |
| `stop_or_review_trigger` | 可观察条件 |

禁止固定预算比例或行业基准。

## 8. 四轴

每条输入和输出记录：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- `source_path` 或 `parent_evidence_ids`

规划结构通常是 `agent` + `future` + `not_applicable|unknown` + `inference`。
