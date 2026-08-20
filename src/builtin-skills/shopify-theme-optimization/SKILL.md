---
name: "shopify-theme-optimization"
description: "用于 Shopify 主题升级、模板优化、移动端体验或 app 冲突处理场景，审查 section 结构、PDP/集合页、残留代码和上线风险，输出主题调整方案、QA 清单与回滚步骤。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 主题优化"
platforms: ["shopify"]
sceneTags: ["brand-compliance"]
searchTags: ["shopify", "brand-compliance"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-theme-optimization"
originKind: "template"
---

# shopify-theme-optimization

## 适用场景与边界
用于主题改版、模板混乱、移动体验差、app 残留或页面结构不能支持转化。主题优化应服务购买流程和维护效率。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集主题版本、模板、sections、custom code、app embeds、页面速度、转化数据、设计问题和团队维护需求。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 备份主题并建立 staging。`n2. 检查 PDP、collection、cart、blog 和 landing 模板。`n3. 清理无用 section、脚本和 app 残留。`n4. 优化移动端导航、CTA、筛选和内容顺序。`n5. 上线前做测试订单和回滚。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
theme speed、mobile CVR、ATC、navigation usage、error rate、maintenance time 和 app conflicts。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
主题审计、模板调整、代码风险、移动端 QA、上线步骤和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得直接在生产主题大改无备份；不得删除关键追踪/合规脚本。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
PDP 堆了 12 个 section 导致 CTA 很低。合格方案应重排首屏、保留评价和 FAQ，移除无转化装饰区。

## 验证方式
上线后 7/14 天看速度、CVR 和错误日志。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
