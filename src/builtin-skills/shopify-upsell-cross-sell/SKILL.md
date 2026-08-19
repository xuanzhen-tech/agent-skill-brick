---
name: "shopify-upsell-cross-sell"
description: "用于 Shopify 提升 AOV、组合销售或购买后推荐场景，分析互补品、触发位置、包邮门槛、库存和毛利，输出推荐矩阵、bundle 方案与利润复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 加购与交叉销售"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "inventory-supply-chain", "analytics-automation"]
searchTags: ["shopify", "pricing-profit", "inventory-supply-chain", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-upsell-cross-sell"
originKind: "template"
---

# shopify-upsell-cross-sell

## 适用场景与边界
用于提高 AOV 和利润，适合已有稳定主商品和明确互补品。加购不是随意弹窗，应基于购买场景和库存利润。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集订单搭配、商品成本、库存、AOV、毛利、购物车、购买后页面、邮件、退货和客户分群。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 找自然互补组合和购买时机。`n2. 设计 PDP、cart、checkout 后或 post-purchase 推荐。`n3. 设定包邮门槛或 bundle，测算毛利。`n4. 控制弹窗频率和移动端干扰。`n5. 复盘 AOV 与 CVR 的平衡。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
AOV、attach rate、bundle conversion、CVR、refund、margin、inventory turn 和 support issues。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
推荐矩阵、bundle 方案、触发位置、文案、实验计划和利润复盘。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得强制加购、隐藏费用或误导折扣。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
卖相机包可推荐清洁套装和肩带。合格方案应在购物车展示组合优惠，不打断结账。

## 验证方式
14/30 天看 AOV、CVR、毛利和退款。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
