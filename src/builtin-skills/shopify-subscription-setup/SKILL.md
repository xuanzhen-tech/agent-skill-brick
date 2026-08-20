---
name: "shopify-subscription-setup"
description: "用于 Shopify 订阅商品、补货周期或会员续费业务设计场景，规划订阅权益、价格、取消/跳过流程、通知和条款，输出订阅配置方案、留存指标与风险清单。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 订阅业务设置"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "inventory-supply-chain", "brand-compliance"]
searchTags: ["shopify", "pricing-profit", "inventory-supply-chain", "brand-compliance"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-subscription-setup"
originKind: "template"
---

# shopify-subscription-setup

## 适用场景与边界
用于补充型商品、消耗品、会员盒子或定期配送。重点是让订阅对买家和利润都成立，而不是强迫默认订阅。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集复购周期、毛利、配送成本、库存、订阅 app、取消原因、客户服务、支付失败和法规要求。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 判断商品是否适合订阅和周期。`n2. 设计订阅折扣、权益、跳过、暂停和取消。`n3. 配置通知邮件、支付失败重试和客户门户。`n4. 在 PDP/checkout 清楚展示条款。`n5. 监控 churn 和库存。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
subscription attach rate、churn、LTV、failed payment、skip/pause、support tickets 和 margin。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
订阅方案、app 配置、条款文案、邮件流程、取消原因表和留存复盘。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得默认勾选、隐藏取消入口或模糊续费条款。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
护肤品每 60 天用完。合格方案应提供 45/60/90 天周期和可跳过，而不是所有人默认 30 天。

## 验证方式
60/90 天看续订、取消、投诉和利润。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
