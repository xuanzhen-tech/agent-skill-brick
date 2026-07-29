<!--
文件功能：定义广告 Search Term、Target、产品锚点、行动类型、迁移、否定和人工执行状态合同。
职责边界：不定义平台私有枚举，不执行关键词/目标写入，也不替代第02专家的市场关键词研究。
重要关联：由 ../SKILL.md 在行动判定时读取；正式字段映射到 ../assets/templates/ad-search-term-action-template.md。
-->

# 广告搜索词行动合同

## 1. 顶层结果合同

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `NO_SEARCH_TERM_REPORT | REPORT_NOT_INGESTED | REPORT_IMMATURE | UNSTABLE_JOIN | PRODUCT_ANCHOR_MISSING | KEYWORD_CONTEXT_MISSING | LIMITED_HISTORY | PLATFORM_ENUM_CONFIRMATION_REQUIRED | OUT_OF_SCOPE_REQUEST`

每次运行只允许这一组顶层结果字段；不得并列 `readiness_status`。行动、人工复核与执行状态只描述局部对象。

## 2. Search Term 观察

| 字段 | 规则 |
|---|---|
| `search_term_observation_id` | 稳定编号 |
| `search_term_raw` | 保留原文 |
| `target_id` | 一方稳定 ID |
| `campaign_id/ad_group_id/ad_id/product_id` | 可追溯 |
| `report_artifact_id` | 已验收报告 |
| `period/attribution` | 必填 |
| `platform_target_type_reported` | 只用来源真实值 |
| `parent_evidence_ids` | 必填 |

## 3. 产品锚点

每个商品记录：

- `product_id`
- `product_fact_ids`
- `include_attributes`
- `exclude_attributes`
- `brand_scope`
- `claim_restrictions`
- `valid_as_of`

缺锚点时不得给相关性终局结论。

## 4. 关键词上游

| 字段 | 说明 |
|---|---|
| `keyword_or_cluster_id` | 第02专家稳定 ID |
| `mapping_status` | direct/manual_candidate/unmapped/conflicted |
| `intent` | 上游值 |
| `relevance_status` | 上游值或本案编码 |
| `supplier_observation_date` | 保留日期 |
| `include/exclude` | 不得丢失 |
| `mapping_evidence_ids` | 必填 |

## 5. 行动类型

- `harvest_candidate`
- `migration_candidate`
- `negative_candidate`
- `observe`
- `retain`
- `no_action_due_to_conflict`
- `not_assessable`

每项记录 `reason`、`parent_evidence_ids`、`human_review_status` 和 `execution_status`。

## 6. 迁移

| 字段 | 说明 |
|---|---|
| `migration_id` | 稳定编号 |
| `source_entity_ids` | 原结构 |
| `destination_plan_entity_id` | 目的结构或 tbd |
| `search_term_observation_id` | 来源 |
| `new_target_type_abstract` | 不猜平台枚举 |
| `sequence` | 人工顺序 |
| `coverage_risk` | 重复或中断 |
| `rollback_rule` | 回滚 |
| `approval_owner` | 人工批准 |

## 7. 否定候选

记录：

- `negative_candidate_id`
- `object_text_or_id`
- `scope_level`
- `source_target_ids`
- `evidence_reason`
- `collateral_risk`
- `include_exclude_conflicts`
- `platform_enum_status`
- `approval_owner`

没有真实 Search Term 报表不得创建此记录。

## 8. 局部行动状态

- `proposed`
- `human_review_required`
- `approved_for_manual_execution`
- `human_applied_unverified`
- `verified_applied`
- `rejected`
- `superseded`

Agent 只能生成前三种中的前两种；批准和执行状态需要人工证据。

## 9. 四轴与谱系

每条记录包含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。
