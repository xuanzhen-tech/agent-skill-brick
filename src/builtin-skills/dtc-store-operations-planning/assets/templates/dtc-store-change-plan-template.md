<!--
文件功能：提供 DTC 店铺快照、对象身份、变更、依赖、审批、回滚与验证计划的正式输出模板。
职责边界：模板仅表示待人工审批和执行的计划，不表示已读取实时店铺、已提交、已生效、已回滚或已验证。
重要关联：字段语义见 references/dtc-change-plan-contract.md；生成前遵守上级 SKILL.md。
-->

# DTC 店铺运营变更计划

## 1. 运行摘要

| 字段 | 值 |
|---|---|
| Change Set ID / Version |  |
| Store ID / Platform |  |
| Environment / Site / Locale |  |
| Snapshot ID / Version / Time |  |
| Scope |  |
| Owner / Reviewer |  |
| Result Status | `change_plan_ready_for_review / blocked / out_of_scope` |
| Reason Codes | `[none]` |
| Execution Status | `not_executed` |

## 2. 快照证据

| Evidence / Snapshot ID | Source Type | Source Locator | Object Types / Coverage | Observed At | Version | Valid Until | Temporal Scope | Estimation Status | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `point_in_time` |  |  |  |

## 3. 对象身份

| Agent Output ID | Object ID | Type | Platform ID Masked | SKU / Variant | Market / Locale | Snapshot | Current Value Locator | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Identity Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `identity_mapping` | `confirmed / ambiguous / conflicted` |

## 4. 变更登记

| Change ID | Agent Output ID | Object ID | Requested Change | Request Source | Current Evidence | Target State | Preconditions | Domain Owner | Approval | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Execution |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `user / domain_owner` |  |  |  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `normalized / excerpted` | `not_executed` |

四轴与 `parent_evidence_ids` 属于每条正式变更派生记录，不得只在计划正文中说明。

## 5. 领域依赖

| Change ID | Domain | Upstream Object ID / Version | Evidence IDs | Applicable Scope | Owner | Status |
|---|---|---|---|---|---|---|
|  | Listing / Visual / Promotion / Procurement / Inventory / Policy / Customer / Measurement / Price |  |  |  |  |  |

## 6. 回滚计划

| Rollback ID | Agent Output ID | Change ID | Trigger | Restore Target / Evidence | Owner | Dependencies | Verification | Non-reversible Limits | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Execution |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `normalized / excerpted` | `not_executed` |

## 7. 验证计划

| Verification ID | Agent Output ID | Change ID | Object / Field | Expected State | Evidence Capture | Window | Owner | Failure Route | Event / Measurement Handoff | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Execution |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `normalized / excerpted` | `not_executed` |

## 8. 当前性与失效

| Input / Change ID | Verified At | Valid Until | Invalidation Trigger | Recheck Owner | Current Status |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 9. 缺口与冲突

| Gap ID | Agent Output ID | Affected Change / Object | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Reason Code | Evidence State | Required Input / Decision | Owner | Effect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` | `point_in_time` | `not_applicable` | `gap_classification` |  |  |  |  |  |

## 10. 人工门禁

- [ ] 快照有来源、时间、版本和覆盖范围
- [ ] 每个对象身份 confirmed
- [ ] requested change 来自用户或领域 owner
- [ ] Listing/视觉/促销/库存/政策/价格输入来自正确责任方
- [ ] 每项 change 有明确前置、审批、回滚和验证
- [ ] 回滚目标有 Evidence，不是泛称“恢复原值”
- [ ] 未把 Shopify 文档或 SIF 当店铺事实，且本包未调用 SIF
- [ ] 未调用 Web、shell 网络、CLI、API 或店铺平台
- [ ] `execution_status=not_executed`

## 11. 未执行声明

本工作包没有登录或读取实时店铺，没有调用 Shopify CLI/API，没有创建、修改或删除商品、订单、客户、折扣、库存、主题或配置。所有 change、rollback 和 verification 都是静态人工计划。
