---
name: "shopify-google-channel"
description: "用于 Shopify 接入 Google Merchant Center、Shopping Ads 或免费商品列表场景，检查 feed 字段、GTIN、审核错误、价格库存同步和转化追踪，输出修复清单与投放准备表。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify Google 渠道"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "advertising-growth", "inventory-supply-chain"]
searchTags: ["shopify", "pricing-profit", "advertising-growth", "inventory-supply-chain"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-google-channel"
originKind: "template"
---

# shopify-google-channel

## 适用场景与边界
用于 Shopify 商品同步 Google Merchant Center、处理 feed 错误或启动 Shopping/PMax 前基础检查。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 Merchant Center、Google & YouTube app、feed 字段、GTIN/MPN、图片、价格、库存、配送税费、政策页、Google Ads 和转化追踪。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 先修账号和网站政策：退货、配送、联系信息和安全结账。`n2. 补齐 feed 字段和 product category。`n3. 处理 disapproval、price mismatch 和 availability mismatch。`n4. 验证转化追踪和增强转化。`n5. 先观察 free listings，再决定广告结构。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
approved items、disapproved items、impressions、clicks、CTR、CVR、ROAS、feed freshness 和 conversion accuracy。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
Merchant 诊断、feed 修复表、字段规范、广告启动条件、转化追踪检查和复盘模板。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得虚假价格、错误库存、误导促销或销售 Google 禁限商品。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
Merchant 大量 price mismatch。合格方案应检查 Shopify 折扣、货币、feed 更新频率和落地页结构化数据。

## 验证方式
每天看 feed 错误，14/30 天看 free listing 和广告表现。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
