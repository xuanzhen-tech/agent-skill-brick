<!--
文件功能：定义促销消息brief中的Offer事实、批准状态、期限、资格、触发、退出和抑制合同。
职责边界：只规范渠道中立事实，不提供完整文案、渠道策略、ESP配置、发送或客户状态写回。
重要关联：由 ../SKILL.md 在Offer事实和状态逻辑整理前读取；正式字段落入 ../assets/templates/promotion-message-brief-template.md。
-->

# 促销 Offer 消息合同

## 一、Offer 事实

| 字段 | 含义 |
|---|---|
| `offer_id` | 稳定业务 ID |
| `approval_status` | `approved`、`draft`、`withdrawn`、`expired` 或 `unknown` |
| `approval_evidence_ids` | 用户或可信上游批准证据 |
| `marketplace/product_scope` | 站点、SKU/ASIN/变体 |
| `benefit` | 准确优惠类型与数值 |
| `currency/price_basis` | 币种及基础/有效价格口径 |
| `start/end/timezone` | 有效期 |
| `eligibility` | 已确认适用条件 |
| `exclusions` | 排除、上限和限制 |
| `stackability` | 只记录已确认关系 |
| `go_no_go` | 内部就绪状态，不等于平台上线 |

## 二、状态逻辑

| 类型 | 必须回答 |
|---|---|
| `trigger` | 哪个已证事实使对象进入候选 |
| `delay` | 是否存在用户/渠道确认的等待 |
| `branch` | 哪些资格或 Offer 状态需要分支 |
| `exit` | 购买、过期、撤销、价格/库存变化等何时退出 |
| `suppression` | 哪些对象明确不得继续；同意与频率由第12核验 |

规则记录 `rule_id`、输入 Evidence IDs、条件、结果、责任方和状态。未知条件为 `TBD`，不默认允许。

## 三、激活闸门

只有同时满足时状态可为 `approved_for_channel_brief`：

- 批准证据存在；
- 优惠和价格口径一致；
- 起止时间和时区明确；
- 资格和排除足够；
- 价格、经济和日历没有 no-go；
- 必要抑制规则已定义；
- 第 12 接收责任明确。

这只允许交接 brief，不等于允许发送。

## 四、禁止表述

- 未证稀缺、库存、销量、最低价或节省；
- 未确认叠加或人人可用；
- 过期/撤销 Offer 的现在时表述；
- 把内部计划写成平台批准；
- 把 SIF ASIN 当前画像写成 Offer 批准、Deal/Coupon、用户资格、活动费、库存或消息状态。

## 五、双层谱系

来源层保留批准记录、价格、日历和上游原状态；派生层保留规范化 Offer、规则、允许/禁止表述和交接状态。每个派生字段引用 Source Evidence IDs。
