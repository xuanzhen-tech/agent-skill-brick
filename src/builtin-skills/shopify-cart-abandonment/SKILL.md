---
name: "shopify-cart-abandonment"
description: "用于 Shopify 弃购率偏高、结账流失或恢复收入复盘场景，分析购物车/结账阻力、触达流程和优惠策略，输出挽回方案与验证指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 弃购挽回"
platforms: ["shopify"]
sceneTags: ["store-operations", "analytics-automation"]
searchTags: ["shopify", "store-operations", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-cart-abandonment"
originKind: "template"
---

# shopify-cart-abandonment

## 适用场景与边界
用于加购多但购买少、结账中断高或弃购邮件效果差。重点是先判断放弃原因，再设计挽回，不是简单发折扣。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 ATC、checkout start、abandoned checkout、email/SMS flow、优惠、运费、税费、支付失败、设备、国家和客服问题。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 拆分购物车放弃和结账放弃。`n2. 检查隐藏费用、配送时效、支付方式和信任资产。`n3. 设计 2-3 封邮件/SMS：提醒、异议处理、有限优惠。`n4. 根据毛利决定是否给折扣。`n5. 排除已购买、退款高风险和订阅敏感人群。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
cart abandonment、checkout abandonment、recovered revenue、open/click、CVR、discount cost、unsubscribe、spam complaint。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
漏斗诊断、flow 文案、分群规则、优惠策略、支付/配送修复清单和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
遵守邮件/SMS 同意规则；不得用虚假库存、虚假倒计时或隐藏订阅。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
美国移动端弃购高，发现结账才显示高运费。合格方案应先在商品页/购物车展示运费门槛，再测试弃购邮件。

## 验证方式
14 天看 flow 指标，30 天看恢复收入扣除折扣后的利润。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
