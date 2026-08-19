---
name: "e-commerce-customer-retention"
description: "用于 Shopify 独立站复购下降、客户流失或 LTV 提升场景，分析购买周期、客户分群、触达节奏和售后体验，输出留存策略、自动化触达方案与复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "电商客户留存"
platforms: ["shopify"]
sceneTags: ["customer-voice", "analytics-automation", "cross-platform"]
searchTags: ["shopify", "customer-voice", "analytics-automation", "cross-platform"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-ecommerce-customer-retention"
originKind: "template"
---

# E-Commerce Customer Retention

## 适用场景与边界
用于 Shopify 或独立站复购低、CAC 高、客户买一次就流失。重点是用产品周期和体验设计留存，而不是不断发折扣。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集客户订单历史、商品消耗周期、LTV、复购间隔、退款、客服、邮件/SMS、会员、订阅和 NPS/评价。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 按新客、二购、VIP、流失、退款高风险分群。`n2. 识别复购触发：补货、配件、升级、礼品、内容教育。`n3. 设计购买后、补货、交叉销售、赢回 flow。`n4. 把客服和评价问题作为留存输入。`n5. 控制优惠频率和毛利。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
repeat purchase rate、LTV、time to second purchase、churn、email revenue、refund、NPS 和 margin。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
客户分群、生命周期 flow、优惠成本、会员/订阅建议、售后修复和 90 天留存看板。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
营销触达需有同意；不得骚扰、隐藏退订或用误导标题。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
保健品首购多二购少。合格方案应围绕使用周期做第 20 天教育、第 35 天补货提醒，并分析取消/退款原因。

## 验证方式
60/90 天看二购率、LTV、退订和投诉。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
