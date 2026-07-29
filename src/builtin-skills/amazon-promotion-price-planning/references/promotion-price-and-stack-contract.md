<!--
文件功能：定义促销价格四分类、币种与时间字段、Offer 叠加证据、有效成交价步骤和底线比较合同。
职责边界：只提供价格记录与计算语义，不定义活动资格、历史窗口、平台费用或动态调价规则。
重要关联：由 ../SKILL.md 在价格规范化与叠加计算前读取；正式字段落入 ../assets/templates/promotion-price-plan-template.md。
-->

# 促销价格与叠加合同

## 一、价格记录

每条价格至少包含：

| 字段 | 含义 |
|---|---|
| `price_evidence_id` | 来源证据层稳定 ID |
| `price_type` | `current_price`、`historical_price`、`competitor_price` 或 `planned_promotion_price` |
| `amount` | 原币金额 |
| `currency` | 明确币种 |
| `observed_at` | 当前、历史或竞品价格的观测时间 |
| `effective_from` / `effective_to` | 计划活动价的有效期 |
| `timezone` | 时间解释时区 |
| `marketplace` | Amazon 站点 |
| `product_scope` | SKU/ASIN、变体、套装数量 |
| `seller_scope` | 卖家或 Offer 口径 |
| `tax_shipping_basis` | 是否包含税费/配送；未知时写 `unknown` |
| `parse_status` | `observed`、`not_returned`、`not_queried`、`parse_failed` 或 `unknown` |
| `source_locator` | 用户文件、上游路径或实际工具与查询 |

`amount=0` 只有在来源明确返回真实零值时使用。解析失败或缺失不得填零。

## 二、可比性

只有以下条件足够一致时才计算差异：

- 币种一致，或有带日期与来源的汇率；
- 商品单位、变体和套装数量一致；
- 税费与配送口径一致；
- 站点、卖家/Offer 口径清楚；
- 时间点或窗口适合当前问题。

不满足时标记 `not_comparable`，并列展示原值。

## 三、叠加证据

每个 Offer 记录：

| 字段 | 含义 |
|---|---|
| `offer_id` | 稳定 ID |
| `offer_type` | 来源明确的优惠类型 |
| `value` / `currency` | 折扣数值和币种 |
| `eligibility` | 已确认资格条件 |
| `effective_period` | 起止时间和时区 |
| `stackable_with` | 有明确证据的 Offer ID |
| `application_order` | 已确认顺序 |
| `caps_exclusions` | 上限与排除 |
| `rule_evidence_ids` | 支撑规则的证据 |
| `confirmation_status` | `confirmed`、`tbd` 或 `conflicted` |

不能用“通常可以”推断可叠加。任意相邻步骤为 `tbd` 时，整个基准叠加链不成立。

## 四、叠加步骤

每一步记录：

| 步骤 | 输入 | 操作 | 输出 | 证据 |
|---:|---:|---|---:|---|
| 1 |  |  |  |  |

只有规则证据明确时才解释百分比基数、定额先后、固定活动价或封顶方式。计算后金额为负数或币种混合时，状态为 `invalid_stack_calculation`。

## 五、底线比较

价格底线记录必须包含：

- 第 14 上游路径与 Evidence ID；
- 金额、币种、SKU/变体；
- 成本与税费口径；
- 生成时间和适用期间；
- 上游四轴与限制。

只有同口径时计算：

```text
floor_headroom = effective_customer_price - price_floor
```

该差值只表示价格相对底线的空间，不等于促销总利润。总经济性由相邻经济评估 Skill 计算。

## 六、双层谱系

派生价格或决策记录至少包含：

- `decision_evidence_id`；
- 输入的 `price_evidence_id` 与 `rule_evidence_id`；
- 计算顺序/公式；
- 汇率或其他显式假设；
- 结果金额与币种；
- `go | conditional | no_go | tbd`；
- 生成时间与限制。
