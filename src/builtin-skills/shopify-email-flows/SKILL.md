---
name: "shopify-email-flows"
description: "用于 Shopify 邮件/SMS 自动化搭建、弃购挽回或复购提升场景，设计欢迎、浏览放弃、购买后、赢回和分群流程，输出触达地图、文案要点与收入复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 邮件自动化"
platforms: ["shopify"]
sceneTags: ["listing-content", "analytics-automation"]
searchTags: ["shopify", "listing-content", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-email-flows"
originKind: "template"
---

# shopify-email-flows

## 适用场景与边界
用于建立或优化 Klaviyo/Mailchimp/Shopify Email 等邮件流程。目标是用生命周期沟通提升转化和复购，而不是无差别群发。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集客户同意、订单历史、商品分类、邮件工具、事件埋点、分群、模板、优惠、退订和 spam complaint。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 先确认 consent 和事件触发准确。`n2. 建立核心 flow：welcome、abandoned checkout、post-purchase、review、winback。`n3. 按新客、老客、品类、国家、购买周期分群。`n4. 控制频率和优惠成本。`n5. 每月复盘收入、退订和投诉。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
open、click、placed order rate、revenue per recipient、unsubscribe、spam complaint、LTV 和 repeat purchase。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
flow 架构、触发条件、分群规则、邮件文案、优惠策略、合规检查和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
必须遵守同意和退订规则；不得购买名单或发送误导标题。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
护肤品牌复购周期 45 天。合格方案应在购买后提供用法教育，第 35 天提醒补货，而不是第 3 天就狂发折扣。

## 验证方式
14 天查触发和送达，30/60 天看收入、退订和复购。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
