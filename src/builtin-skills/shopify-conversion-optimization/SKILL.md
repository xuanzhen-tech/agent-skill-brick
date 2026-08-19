---
name: "shopify-conversion-optimization"
description: "用于 Shopify 流量充足但购买转化偏低场景，诊断商品页、集合页、购物车、信任资产和移动端阻力，输出转化优化清单、实验优先级与复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 转化优化"
platforms: ["shopify"]
sceneTags: ["advertising-growth"]
searchTags: ["shopify", "advertising-growth"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-conversion-optimization"
originKind: "template"
---

# Shopify Conversion Optimization

## 适用场景与边界
用于 Shopify 有流量但购买少、商品页跳出高、加购低或结账流失。重点是按漏斗定位阻力，而不是堆弹窗和折扣。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集渠道、落地页、设备、商品页、热图/录屏、ATC、checkout、purchase、AOV、退款、客服问题和竞品页面。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 按渠道/设备/国家拆漏斗。`n2. 检查首屏是否讲清商品、价格、优惠、配送和 CTA。`n3. 处理信任资产：评价、UGC、退货、FAQ、支付图标和客服。`n4. 简化购物车和结账前阻力。`n5. 用小样本先做启发式修复，再做 A/B。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
CVR、ATC rate、checkout start、payment success、AOV、refund rate、support tickets 和 contribution margin。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
漏斗诊断、页面问题清单、实验假设、文案/布局建议、埋点检查和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得用虚假倒计时、隐藏费用、强迫订阅或误导性前后对比。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
广告流量多但 ATC 低。合格方案应检查广告承诺与商品页首屏是否一致、价格/配送是否清楚，而不是先加折扣弹窗。

## 验证方式
7 天验证埋点，14/30 天看漏斗和利润。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
