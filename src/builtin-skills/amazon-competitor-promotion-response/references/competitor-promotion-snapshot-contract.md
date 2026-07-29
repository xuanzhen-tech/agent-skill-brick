<!--
文件功能：定义竞品促销快照、字段解析状态、两时点可比性、差异公式和响应证据合同。
职责边界：只规范按需快照与响应；SIF 只能补充 ASIN 当前画像或销量/流量背景，不提供 Deal/Coupon 事实；不提供持续监控、告警、网页抓取或动态改价。
重要关联：由 ../SKILL.md 在快照与差异分析前读取；正式字段落入 ../assets/templates/competitor-promotion-response-template.md。
-->

# 竞品促销快照合同

## 一、快照键

一个快照的稳定键至少包含：

```text
marketplace
asin
variant
seller_scope
fulfillment_scope
product_unit
observed_at
timezone
```

任一关键维度未知时标明，不自动与其他快照联接。

## 二、字段状态

| 状态 | 含义 |
|---|---|
| `observed` | 来源明确返回并成功解析 |
| `not_returned` | 请求成功但字段未返回 |
| `not_queried` | 本次未请求该字段 |
| `parse_failed` | 字段/文本存在但无法可靠解析 |
| `inaccessible` | 权限或服务阻止访问 |
| `unknown` | 无法判断 |

只有 `observed` 可参与数值变化。以上状态都不等于零、无优惠、不存在或下架。

## 三、价格与促销字段

每个字段记录：

- 原始字段名和值；
- 规范化字段及其来源；SIF 字段只能来自实际返回并保留供应商语义；
- 金额与币种；
- 价格类型；
- Deal/Coupon 类型和值（仅用户或可信上游）；
- 税费/配送口径；
- Source Evidence ID；
- 解析状态与限制。

不要从展示文本猜折扣基数或叠加。

## 四、可比性

两个快照只有在以下条件满足时才比较：

- 同站点、ASIN、变体与商品单位；
- 卖家/履约相同或差异已明确控制；
- 币种、税费/配送与价格类型一致；
- 字段语义和解析规则一致；
- 时间戳有序且集合版本一致。

结果使用 `comparable | partially_comparable | not_comparable`。

## 五、差异

```text
absolute_price_change = later_price - earlier_price
relative_price_change =
  absolute_price_change / earlier_price
```

仅限两个 `observed` 金额。早期价格为零时相对差异为 `undefined`。状态字段变化只在两端同语义且都明确观察时编码。

## 六、响应记录

每个响应假设包含：

- `response_id`；
- 竞品 Source/Decision Evidence IDs；
- 我方价格、底线和经济 Evidence IDs；
- 触发与解除条件；
- 可选动作及不动作方案；
- `go | conditional | no_go | tbd`；
- 责任方与复核条件。

响应是计划，不是后台执行。
