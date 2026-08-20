---
name: "shopify-app-recommendations"
description: "用于 Shopify 功能扩展、插件冗余或工具替换决策场景，评估需求、权限、性能、成本和迁移风险，输出应用候选对比、试用计划与回滚方案。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 应用选型"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "brand-compliance"]
searchTags: ["shopify", "pricing-profit", "brand-compliance"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-app-recommendations"
originKind: "template"
---

# shopify-app-recommendations

## 适用场景与边界
用于选择评论、订阅、邮件、搜索、翻译、库存、客服、会员、优惠等 Shopify app。目标是解决明确流程问题，而不是安装热门插件。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集业务问题、现有 app、主题、预算、数据权限、集成对象、性能指标、团队流程和必须/可选功能。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 把需求拆成 must-have 和 nice-to-have。`n2. 评估权限、脚本体积、主题侵入、导出能力和客服支持。`n3. 优先考虑 Shopify 原生能力或已有 app 能否满足。`n4. 小范围试用，记录速度和转化影响。`n5. 设置卸载和数据迁移方案。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
app cost、load impact、feature adoption、manual time saved、error rate、CVR impact 和 support burden。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
需求评分表、候选 app 对比、权限风险、安装步骤、测试计划、回滚方案和复盘指标。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得把客户数据交给不可信 app；卸载前要确认残留代码和数据导出。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
想装 5 个 upsell app。合格方案应先定义目标场景，选一个能覆盖购物车和售后推荐的工具，并测试速度影响。

## 验证方式
试用 14-30 天，看功能使用、速度、转化和团队维护成本。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
