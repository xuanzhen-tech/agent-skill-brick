---
name: "shopify-dropshipping"
description: "用于 Shopify 代发货选品、供应商验证或履约风险控制场景，核查样品、交付时效、售后承诺和利润结构，输出供应商评估、商品上架要求与风险预案。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 代发货运营"
platforms: ["shopify"]
sceneTags: ["product-research", "pricing-profit", "customer-voice", "brand-compliance", "store-operations"]
searchTags: ["shopify", "product-research", "pricing-profit", "customer-voice", "brand-compliance", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-dropshipping"
originKind: "template"
---

# shopify-dropshipping

## 适用场景与边界
用于代发模式选品、供应商评估、交付承诺和售后风险控制。重点是建立真实可履约的供应链，而不是只复制爆品页面。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集供应商、成本、生产/发货国家、时效、追踪、样品、退货地址、竞品、广告素材、商品 claim 和客服历史。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 先订样验证质量、包装、尺寸和时效。`n2. 建立供应商备选和缺货通知。`n3. 商品页透明展示配送时间、退货和售后。`n4. 广告承诺不能快于实际履约。`n5. 用小预算验证后再放量。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
delivery time、tracking rate、refund、chargeback、CVR、CAC、contribution margin 和 complaint rate。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
供应商评分、样品检查表、页面风险修正、广告承诺审查、售后 SOP 和放量条件。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得虚假本地发货、盗图、误导材质或销售侵权/不合规商品。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
一个爆品从海外发货 15-25 天却广告写 3 天送达。合格方案应改承诺、测试本地 3PL 或停止放量。

## 验证方式
每周看延迟、退款、拒付和差评；风险升高时暂停广告。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
