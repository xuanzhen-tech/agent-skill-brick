---
name: "shopify-facebook-instagram-shop"
description: "用于 Shopify 对接 Facebook/Instagram Shop、商品目录审核或社交购物承接场景，检查 catalog、像素/CAPI、商品状态和广告链路，输出配置清单、问题修复与数据一致性指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify Facebook/Instagram 商店"
platforms: ["shopify"]
sceneTags: ["advertising-growth", "analytics-automation"]
searchTags: ["shopify", "advertising-growth", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-facebook-instagram-shop"
originKind: "template"
---

# shopify-facebook-instagram-shop

## 适用场景与边界
用于把 Shopify 商品同步到 Facebook/Instagram Shop，或处理商品审核失败、目录错误、像素归因和社媒购物转化低。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 Meta Business、catalog、Commerce Manager、pixel/CAPI、商品 feed、图片、价格、库存、政策、域名验证和广告账户。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 验证域名、商店资格和政策页面。`n2. 检查 catalog 字段：标题、图片、价格、库存、variant、GTIN。`n3. 配置 Pixel/CAPI 和事件去重。`n4. 按集合组织商品并匹配 Instagram 内容。`n5. 处理审核错误和数据同步。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
catalog match rate、rejected items、event match quality、shop clicks、checkout、ROAS 和 CVR。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
配置检查、feed 错误表、事件验证、集合建议、内容标签策略和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得销售 Meta 禁限品或使用误导图片/价格。客户数据传输需符合隐私要求。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
商品被拒因为图片含前后对比功效。合格方案应修改素材和 claim，再重新提交审核。

## 验证方式
上线后检查 catalog 诊断、事件管理和 shop 流量转化。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
