---
name: "shopify-seo"
description: "用于 Shopify 自然搜索增长、集合页/商品页关键词布局或技术 SEO 诊断场景，分析索引、结构化数据、内链、速度和内容机会，输出 SEO 优化清单与 Search Console 复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 搜索优化"
platforms: ["shopify"]
sceneTags: ["listing-content", "advertising-growth", "analytics-automation"]
searchTags: ["shopify", "listing-content", "advertising-growth", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-seo"
originKind: "template"
---

# Shopify SEO

## 适用场景与边界
用于 Shopify 自然流量低、商品页不收录、集合页关键词弱、博客没有转化或迁移后流量下降。重点是页面类型分工和技术基础，而不是只改 meta title。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 sitemap、robots、Search Console、GA4、商品/集合 URL、标题、meta、H1、schema、canonical、博客、内部链接、竞品关键词和页面速度。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 区分商品页、集合页、博客和指南页各自承接的关键词。`n2. 检查索引、canonical、重复变体、过滤参数和重定向。`n3. 优化集合页标题、描述、首段内容和内部链接。`n4. 商品页补齐属性、FAQ、评价和结构化数据。`n5. 用博客承接信息型词，并链接到集合或商品。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
Impressions、CTR、average position、organic sessions、organic CVR、indexed pages、Core Web Vitals、schema errors 和自然收入。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
技术 SEO 清单、关键词映射、页面改写、内部链接计划、内容 brief、重定向修复和 30/60 天复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得堆关键词、隐藏文字、采集内容或使用无授权素材。多语言/多市场 hreflang 需要谨慎校验。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
迁移后自然流量掉 40%。合格方案应先查 301、canonical、sitemap 和索引，再重建集合页关键词，不应直接写博客。

## 验证方式
14 天查索引和技术错误，30/60 天看自然曝光、点击和收入。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
