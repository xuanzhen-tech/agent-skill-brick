---
name: "shopify-international"
description: "用于 Shopify 多国家销售、本地化或 Markets 配置场景，评估货币、语言、配送、税费、支付和国家级利润，输出国际化配置方案、上线检查与市场复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 国际化"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "inventory-supply-chain", "store-operations"]
searchTags: ["shopify", "pricing-profit", "inventory-supply-chain", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-international"
originKind: "template"
---

# shopify-international

## 适用场景与边界
用于 Shopify 从单一市场扩展到多国家/多语言/多币种。核心是市场本地化和利润验证，不是简单打开货币转换。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集目标国家、Shopify Markets、语言、货币、价格表、税费、配送、支付方式、翻译、域名/subfolder、SEO 和客服能力。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 按国家评估需求、竞争、物流、税费和支付。`n2. 配置 Markets、货币、价格和配送。`n3. 翻译关键页面并本地化尺寸、单位、客服和退货。`n4. 检查 hreflang、URL、税费展示和支付。`n5. 按国家复盘利润和投诉。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
sessions by market、CVR、AOV、payment success、shipping cost、tax/duty issues、refund、margin 和 organic visibility。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
市场评分、配置清单、翻译优先级、配送税费风险、支付建议和 90 天扩张路线。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得用机器直译误导买家；税费、关务和退货责任要清楚。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
美国站想开德国市场。合格方案应先确认 VAT、退货地址、德语政策、欧盟隐私和配送时效，再做广告。

## 验证方式
30/60/90 天按国家看转化、利润、退款和客服。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
