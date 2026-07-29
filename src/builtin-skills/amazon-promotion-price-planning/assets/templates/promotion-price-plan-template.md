<!--
文件功能：作为 Agent 生成促销价格方案、四类价格账本和叠加步骤时使用的稳定模板。
职责边界：只约束交付字段，不预填活动规则、历史窗口、费用、折扣或价格结论。
重要关联：由 ../../SKILL.md 写入 outputs/promotion-management/<case-id>/01-price-planning/ 前读取或物化；字段语义见 ../../references/promotion-price-and-stack-contract.md。
-->

# Amazon 促销价格方案

## 任务摘要

- Case ID：
- Amazon 站点：
- SKU/ASIN 与变体：
- 目标币种：
- 时区：
- 价格口径：
- 总体状态：`ready | limited_context | tbd_stackability | blocked_missing_guardrail | blocked_currency_basis | conflicted | out_of_scope`

## 四类价格

| Price Evidence ID | 类型 | 金额 | 币种 | 观测/有效时间 | 商品/卖家口径 | 税费/配送 | 解析状态 | 来源 |
|---|---|---:|---|---|---|---|---|---|
|  | `current_price` |  |  |  |  |  |  |  |
|  | `historical_price` |  |  |  |  |  |  |  |
|  | `competitor_price` |  |  |  |  |  |  |  |
|  | `planned_promotion_price` |  |  |  |  |  |  |  |

## 第 14 价格底线

| 上游路径 | Evidence ID | 金额 | 币种 | SKU/变体 | 时间/口径 | 限制 |
|---|---|---:|---|---|---|---|
|  |  |  |  |  |  |  |

## Offer 叠加核验

| Offer ID | 类型/值 | 有效期 | 资格 | 可叠加证据 | 应用顺序 | 上限/排除 | 状态 |
|---|---|---|---|---|---:|---|---|
|  |  |  |  |  |  |  |  |

## 有效成交价步骤

| 步骤 | 输入价格 | Offer ID | 已确认操作 | 输出价格 | Rule Evidence ID |
|---:|---:|---|---|---:|---|
| 1 |  |  |  |  |  |

## 候选方案

| 方案 | 计划活动价 | 已确认叠加 | 有效成交价 | 价格底线 | 底线余量 | 有效期 | 状态 |
|---|---:|---|---:|---:|---:|---|---|
|  |  |  |  |  |  |  | `go / conditional / no_go / tbd` |

## 待确认与风险

| 项目 | 影响 | 所需证据 | 责任方 | 截止状态 |
|---|---|---|---|---|
|  |  |  |  | `TBD` |

## 双层证据账本

### 来源证据层

| Source Evidence ID | 来源路径/工具 | 上游 Evidence ID | 字段 | 原值/币种 | 时间 | 四轴 | 限制 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

若来源为 `sif_mcp`，同一来源对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、覆盖/分页、`estimation_status`、`transformation_type=reported` 和 `raw_result_locator`。

### 派生决策层

| Decision Evidence ID | 输入 Evidence IDs | 公式/顺序 | 假设 | 派生值 | 状态 | 四轴 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 能力声明

- 本方案未判断活动资格或历史参考价合规。
- 本方案未执行改价、报名或提交。
- 未查询、未返回、解析失败与真实零值已分开。
- SIF 未调用、失败或本次未新增 ASIN 当前画像时，保持对应背景 `not_queried/not_returned/missing`，不得推断零价、无 Offer 或切换数据源。
