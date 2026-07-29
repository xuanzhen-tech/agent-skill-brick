<!--
文件功能：作为 Agent 生成渠道中立促销消息brief、状态规则与第12专家交接时使用的稳定模板。
职责边界：只约束Offer事实和规则，不预填完整邮件/短信/社媒文案、渠道、发送或ESP配置。
重要关联：由 ../../SKILL.md 写入 outputs/promotion-management/<case-id>/04-message-brief/ 前读取或物化；字段语义见 ../../references/promotion-offer-message-contract.md。
-->

# Amazon 促销消息 brief

## 任务摘要

- Case ID：
- Offer ID：
- Amazon 站点：
- SKU/ASIN/变体：
- 总体状态：`approved_for_channel_brief | draft_facts | tbd_eligibility | tbd_timing | suppression_incomplete | blocked_conflict | do_not_activate | out_of_scope`
- 第 12 接收责任方：

## 已批准 Offer 事实

| 字段 | 值 | Source Evidence ID | 状态/限制 |
|---|---|---|---|
| 批准状态 |  |  |  |
| 优惠 |  |  |  |
| 币种/价格口径 |  |  |  |
| 开始 |  |  |  |
| 结束 |  |  |  |
| 时区 |  |  |  |
| 资格 |  |  |  |
| 排除/上限 |  |  |  |
| 可叠加 |  |  |  |

## 状态逻辑

| Rule ID | 类型 | 条件 | 结果 | Evidence IDs | 责任方 | 状态 |
|---|---|---|---|---|---|---|
|  | `trigger` |  |  |  |  |  |
|  | `delay` |  |  |  |  |  |
|  | `branch` |  |  |  |  |  |
|  | `exit` |  |  |  |  |  |
|  | `suppression` |  |  |  |  |  |

## 允许表述

| Fact ID | 可表达事实 | 必须保留的限定 | 禁止扩张 |
|---|---|---|---|
|  |  |  |  |

## 禁止表述

| 项目 | 原因 | 所需证据/责任方 |
|---|---|---|
|  |  |  |

## 第 12 专家交接

- Offer 事实与 Evidence IDs：
- 目标对象业务条件：
- 期限与时区：
- 触发/分支/退出/抑制：
- 品牌语气待第 12 处理：
- 同意、频率与渠道合规待第 12 核验：
- 待确认项：

## 双层证据账本

### 来源证据层

| Source Evidence ID | 来源/路径 | 原字段/值 | 时间 | 上游 Evidence ID | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

若来源为 `sif_mcp`，同一来源对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、覆盖/分页、`estimation_status`、`transformation_type=reported` 和 `raw_result_locator`。

### 派生 brief 层

| Decision Evidence ID | 输入 Evidence IDs | Offer/Rule ID | 编码逻辑 | 状态 | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 能力声明

- 本文件不是完整营销文案。
- 本 Skill 未选择渠道、发送消息、配置 ESP 或写回客户状态。
- 未批准、过期、撤销或 no-go Offer 不得激活。
