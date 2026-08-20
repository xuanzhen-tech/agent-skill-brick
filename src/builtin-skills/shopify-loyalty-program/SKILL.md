---
name: "shopify-loyalty-program"
description: "用于 Shopify 会员、积分、推荐或复购激励设计场景，评估客户分层、奖励成本、LTV 和滥用风险，输出忠诚度机制、触达规则与效果复盘表。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 会员忠诚度"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "customer-voice", "brand-compliance"]
searchTags: ["shopify", "pricing-profit", "customer-voice", "brand-compliance"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-loyalty-program"
originKind: "template"
---

# shopify-loyalty-program

## 适用场景与边界
用于提高复购和客户留存，适合已有稳定订单和可复购品类。新店流量不足时不应先做复杂会员体系。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集复购率、购买周期、毛利、客户分层、AOV、LTV、优惠成本、邮件/SMS、会员 app 和历史促销。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 判断是否有复购基础和足够毛利。`n2. 设计积分获取与兑换，避免成本失控。`n3. 分层会员权益：复购、推荐、生日、VIP。`n4. 与邮件/SMS 自动化联动。`n5. 监控作弊、优惠叠加和利润。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
repeat purchase、LTV、redemption rate、liability、AOV、margin、referral orders 和 churn。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
会员方案、积分成本模型、分层权益、flow 触发、反滥用规则和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得隐藏积分限制或制造无法兑现的权益。客户数据和营销同意需合规。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
咖啡品牌 45 天复购。合格方案应设置补货提醒和积分兑换，不必一开始做复杂 VIP 社区。

## 验证方式
60/90 天看复购、LTV 和优惠成本。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
