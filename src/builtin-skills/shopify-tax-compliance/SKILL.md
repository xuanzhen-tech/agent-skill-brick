---
name: "shopify-tax-compliance"
description: "用于 Shopify 跨州/跨国销售、VAT/GST 或税费显示异常场景，梳理销售地区、税号、商品税类、发票和报表流程，输出税务配置检查、待确认事项与月度核对清单。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 税务合规"
platforms: ["shopify"]
sceneTags: ["brand-compliance", "analytics-automation"]
searchTags: ["shopify", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-tax-compliance"
originKind: "template"
---

# shopify-tax-compliance

## 适用场景与边界
用于 Shopify 跨州/跨国销售、税费显示不清、VAT/GST 配置或发票需求。该 skill 只做运营配置和风险清单，不给最终税务意见。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集销售国家/州、仓库、公司主体、税号、销售额、商品类别、Shopify Tax/第三方税务 app、发票和会计流程。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 识别销售地区和可能的 nexus/注册义务。`n2. 配置税区、税率、含税/不含税显示和免税客户。`n3. 对数字商品、服饰、食品等特殊税类单独确认。`n4. 检查发票和报表导出。`n5. 建立人工税务确认清单。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
tax collected、checkout mismatch、refund tax、market sales、registration threshold 和 invoice accuracy。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
税务配置检查、地区风险表、待 CPA 确认项、发票流程和月度导出清单。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
必须由专业税务人员确认；不得建议逃避税费或错误申报。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
美国多州销售增长。合格方案应列出各州销售额、仓库、平台代征和待 CPA 判断的 economic nexus。

## 验证方式
每月导出订单税费并与会计系统核对。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
