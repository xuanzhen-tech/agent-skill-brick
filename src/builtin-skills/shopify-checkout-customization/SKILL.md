---
name: "shopify-checkout-customization"
description: "用于 Shopify 结账转化、支付/配送展示或 B2B/订阅结账体验优化场景，评估可定制范围、信任信息和合规限制，输出结账调整方案、测试清单与转化指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 结账定制"
platforms: ["shopify"]
sceneTags: ["inventory-supply-chain", "brand-compliance", "store-operations"]
searchTags: ["shopify", "inventory-supply-chain", "brand-compliance", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-checkout-customization"
originKind: "template"
---

# shopify-checkout-customization

## 适用场景与边界
用于 Shopify Plus 或支持范围内的 checkout 调整，处理支付方式、配送信息、信任提示、B2B 字段或订阅说明。结账优化应减少疑虑而不是增加干扰。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 Shopify 计划、checkout 配置、支付方式、配送/税费、转化漏斗、客户字段需求、订阅/B2B 要求、app 和合规文本。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 判断可用能力：checkout editor、extension、Functions、Plus 限制。`n2. 只添加对支付决策必要的信息。`n3. 检查折扣、配送、税费和订阅条款展示。`n4. 对改动做测试订单和多设备 QA。`n5. 监控支付失败和转化。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
checkout completion、payment success、shipping selection、support tickets、refund、AOV 和 speed。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
结账问题清单、可定制范围、字段/文案方案、测试订单结果、风险和回滚计划。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得隐藏费用、默认勾选订阅或采集非必要敏感数据。支付和隐私必须合规。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
想在结账页加大量品牌故事。合格方案应拒绝，改为简短退货/配送信任提示，避免分散支付动作。

## 验证方式
上线后 7/14 天看支付成功、CVR 和客服问题。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
