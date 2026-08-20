---
name: "shopify-inventory-management"
description: "用于 Shopify 多仓库存、补货预警、预售或 3PL/ERP 同步场景，分析销量预测、批次、退货回库和缺货风险，输出库存策略、补货计划与异常监控指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 库存管理"
platforms: ["shopify"]
sceneTags: ["inventory-supply-chain", "brand-compliance", "analytics-automation"]
searchTags: ["shopify", "inventory-supply-chain", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-inventory-management"
originKind: "template"
---

# shopify-inventory-management

## 适用场景与边界
用于缺货、超卖、库存资金占用、渠道库存不同步或旺季备货。目标是让库存服务销售和现金流，而不是只追求不断货。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 SKU、库存、仓库、供应商 lead time、销量、季节性、退货、采购 MOQ、3PL/ERP、销售渠道和广告计划。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 按 SKU 分层：核心、季节、长尾、清仓。`n2. 计算安全库存、补货点和覆盖天数。`n3. 配置多地点库存和渠道同步。`n4. 处理预售、退货回库和损耗。`n5. 将广告和促销与库存联动。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
sell-through、inventory days、OOS rate、stockout lost sales、overstock value、fulfillment error 和 margin。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
库存看板、补货规则、缺货预警、清仓建议、3PL/ERP 同步检查和旺季备货计划。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得销售无法履约的库存；预售必须清楚交付时间。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
广告放量导致核心 SKU 断货。合格方案应设置库存低于 21 天覆盖时自动降预算，并提前补货。

## 验证方式
每周看库存覆盖和缺货，旺季每日看核心 SKU。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
