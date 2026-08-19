---
name: "shopify-a-b-testing"
description: "用于 Shopify 页面、价格、优惠或结账路径需要实验验证的场景，设计假设、样本、指标和停止条件，输出 A/B 测试方案与结果判读口径。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify A/B 测试"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "store-operations"]
searchTags: ["shopify", "pricing-profit", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-ab-testing"
originKind: "template"
---

# Shopify A/B Testing

## 适用场景与边界
用于验证页面、文案、价格、优惠、图片或结账前体验变更是否有效。重点是测试一个明确假设，而不是把改版包装成实验。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集实验页面、流量、当前 CVR、目标提升、渠道、设备、主要指标、副指标、样本量、实验工具和上线风险。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 写清假设、变量、受众和成功标准。`n2. 确认样本量和观察周期，低流量页面不做伪 A/B。`n3. 只改一个关键变量，并保证埋点准确。`n4. 监控退款、AOV、速度和客服副作用。`n5. 结束后决定推广、停止或重测。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
primary metric、CVR、AOV、revenue per visitor、refund、speed、statistical confidence 和 guardrail metrics。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
实验方案、变体说明、样本估算、埋点清单、结果解读、上线/回滚建议。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得用实验掩盖误导性价格、隐藏费用或违反隐私的追踪。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
测试 sticky ATC。合格方案应只对移动商品页测试，主指标 ATC/CVR，副指标页面速度和误触退款。

## 验证方式
实验结束后保留截图、数据和结论；无显著结果也要记录。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
