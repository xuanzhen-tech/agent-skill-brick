---
name: amazon-pricing-margin-guardrails
description: 把 amazon-operating-analysis 已批准的价格与贡献情景原样整理成可审计的 Amazon 价格/毛利护栏，供广告和促销规划使用；适用于建立、复核、更新或撤销价格底线，检查币种、税费、履约、Offer 叠加与有效期口径，以及在上游情景缺失或冲突时失败关闭；不适用于重算利润、生成新底线、动态调价或执行平台动作。
---

<!--
文件功能：指导 Agent 把正式经营情景转成跨专家可用的价格与贡献护栏，并将三 MCP 公开观察隔离为探索性背景。
职责边界：正式护栏只原样映射已批准上游数值、核对口径与有效性；供应商观察不得进入护栏数值、审批或有效性；不重算利润或动态调价。
重要关联：护栏方法见 references/pricing-guardrail-contract.md；正式交付使用 assets/templates/pricing-margin-guardrail.md。
-->

# Amazon 价格与毛利护栏

## 目标

把上游已批准情景转成下游容易遵守的业务边界：

- 适用于哪个站点、ASIN/SKU、Offer 和期间；
- 使用哪个币种、税费、履约、退款和广告口径；
- 正常价、促销价、Coupon、广告与其他叠加怎样影响贡献；
- 哪条是绝对底线，哪条是审批阈值；
- 什么变化会让护栏失效；
- 第05广告与第06促销能否安全消费；
- 谁批准、何时复核或撤销。

本 Skill 不重新计算利润或发明底线。缺上游正式情景时失败关闭。

## 开始条件

至少需要：

- `amazon-operating-analysis` 的已批准、带版本情景；
- 站点、商品/Offer、币种和适用期间；
- 价格、税费、Amazon 费用、履约、采购/制造、退货/退款、广告与其他成本口径；
- 贡献利润或毛利定义；
- 允许的促销/Coupon/广告叠加；
- 最低贡献、目标贡献或审批规则；
- 上游 owner、护栏批准人和下游使用者。

`uploads/` 只读；过程材料写入 `temp/profit-management/<run-id>/02-pricing-guardrail/`，正式结果写入 `outputs/profit-management/<run-id>/02-pricing-guardrail/`。

## 执行流程

### 1. 冻结适用范围

说明护栏对应：

- marketplace、币种和税费模式；
- ASIN/SKU/变体/Offer；
- FBA/FBM 或其他履约模式；
- 日期、促销窗口和版本；
- 成本与费用基准；
- 允许消费护栏的专家/流程。

不同站点、履约、币种或成本版本不能共用一条底线。

### 2. 核对上游责任

确认上游情景确实：

- 已由责任方批准；
- 版本和生成时间明确；
- 关键成本没有缺失/冲突；
- 公式和币种可复核；
- 说明退款、退货、广告和税费口径；
- 有有效期和失效触发。

若缺少任何关键项，停止护栏发布并退回上游。

### 3. 原样映射数值

保留上游的：

- 正常/活动价格情景；
- 单件收入与成本组成；
- 毛利/贡献定义；
- 最低允许结果和目标结果；
- 广告/促销可用空间；
- 数量、变体与叠加假设；
- 场景限制。

不要在映射时重新解释、四舍五入成不同口径或补默认成本。若发现公式错误，标记冲突并退回，不在本 Skill 修正。

### 4. 定义可执行护栏

根据已批准情景表达：

- 低于什么价格或贡献必须阻塞；
- 落在哪个区间需要额外审批；
- 哪些组合（价格 + Coupon + 广告 + 费用）不能叠加；
- 哪些字段必须在执行前重新确认；
- 对第05广告和第06促销分别提供什么边界；
- 当前护栏不覆盖什么。

护栏应以业务语言可执行，而非只给一个数字。

### 5. 判断有效性

以下变化通常触发复核或失效：

- 汇率、税费、Amazon fee 或履约费变化；
- 采购、头程、仓储、退货或退款成本变化；
- 履约模式、包装尺寸或重量变化；
- 价格、Coupon、促销或广告叠加改变；
- 变体/Offer/站点变化；
- 上游情景版本被替换；
- 有效期届满或数据明显过期。

未经复核的旧护栏不能继续作为批准依据。

### 6. 管理审批状态

区分：

- 草案，等待核对；
- 已批准，可在限定范围内消费；
- 暂停，因关键变化或冲突；
- 已撤销，由新版本替代或失效。

每次状态变化写清原因、责任人、生效时间和对下游的影响。批准护栏不等于批准具体广告或促销动作。

### 7. 可选外部价格背景

候选工具：

- SIF：`market_estimate_profit_threshold`，仅在其全部必需输入均有直接材料时作探索性门槛；
- SellerSprite：`market_price_distribution`、`asin_coupon_trend`、`keepa_info`、`asin_detail_with_coupon_trend`；
- Sorftime Amazon：`product_detail`、`product_trend`；
- 明确 1688 采购任务才可用：`ali1688_product_search`、`ali1688_product_request`。

每个工具首次调用前按外层 `search → describe → call`，只按本次 `inputSchema` 传参。禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

这些结果只进入探索性背景：

- SellerSprite Coupon/Keepa 是公开供应商观察；
- Sorftime Amazon 是供应商趋势；
- 1688 是挂牌商品/价格线索，不是正式报价、MOQ、税、运费、交期、质检或合同；
- SIF 门槛是探索性计算。

它们全部不得修改正式护栏、上游利润、审批或有效性。

## 失败与降级

- 上游情景缺失/未批准：不创建护栏；
- 关键成本或口径冲突：暂停并退回上游；
- 下游对象/站点不匹配：不得消费；
- 护栏过期或触发失效：暂停；
- 供应商外部数据失败：不影响已有正式护栏；
- 用户要求动态调价或平台执行：明确越界。

## 正式交付

使用 `assets/templates/pricing-margin-guardrail.md` 生成：

1. `pricing-margin-guardrail.md`
2. `guardrail-scope-and-basis.csv`
3. `approval-and-validity.md`
4. `downstream-usage.md`
5. `external-price-context.md`（调用三 MCP 时）

## 质量门

- 正式数值来自已批准上游情景；
- 站点、Offer、币种、税费、履约和期间匹配；
- 映射未重算或补默认值；
- 最低边界、审批区间和叠加限制可执行；
- 失效触发和复核 owner 清楚；
- 外部供应商观察与正式护栏完全隔离；
- 1688 挂牌未当采购成本；
- 未动态调价或执行平台动作。

## 资源读取

- 开始前读取 `references/pricing-guardrail-contract.md`。
- 写正式交付前读取 `assets/templates/pricing-margin-guardrail.md`。
