---
name: "shopify-migration"
description: "用于迁移到 Shopify 或重建店铺数据与 SEO 资产场景，梳理商品、客户、订单、URL、主题和测试订单风险，输出迁移计划、校验清单与上线回滚方案。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 迁移"
platforms: ["shopify"]
sceneTags: ["listing-content", "customer-voice", "brand-compliance", "store-operations", "analytics-automation"]
searchTags: ["shopify", "listing-content", "customer-voice", "brand-compliance", "store-operations", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-migration"
originKind: "template"
---

# shopify-migration

## 适用场景与边界
用于从 WooCommerce、Magento、BigCommerce、自研站或旧 Shopify 迁移到新 Shopify。重点是不中断交易和尽量保留 SEO/客户数据。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集旧站 URL、商品、客户、订单、博客、图片、元字段、SEO 标题、重定向、域名、支付、税费、配送和 app。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 做数据盘点和字段映射。`n2. 迁移商品、客户、订单和内容，保留 ID 映射。`n3. 建立 301 重定向和 SEO 检查。`n4. 配置主题、支付、配送、税费和 app。`n5. 上线前做冻结窗口、测试订单和回滚计划。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
data completeness、404、organic traffic、checkout success、order sync、speed、refund/customer issues。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
迁移计划、字段映射、重定向表、QA 清单、上线步骤、回滚方案和 30 天监控表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
客户数据迁移必须遵守隐私；密码通常不能明文迁移。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
从 WooCommerce 迁移，若不保留产品 URL，会造成自然流量下跌。合格方案应导出旧 URL 并逐条映射 301。

## 验证方式
上线后每日查 404、订单、支付和 Search Console，持续 30 天。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
