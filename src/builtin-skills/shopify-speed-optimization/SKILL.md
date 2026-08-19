---
name: "shopify-speed-optimization"
description: "用于 Shopify 页面速度、Core Web Vitals 或移动端体验拖累转化场景，排查主题代码、图片、字体、脚本和第三方应用负载，输出性能修复优先级与转化监测方案。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 速度优化"
platforms: ["shopify"]
sceneTags: ["listing-content"]
searchTags: ["shopify", "listing-content"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-speed-optimization"
originKind: "template"
---

# shopify-speed-optimization

## 适用场景与边界
用于 Shopify 页面加载慢、移动端跳出高、LCP/INP/CLS 差或 app 堆叠拖慢转化。目标是降低真实买家等待和交互阻力。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 PageSpeed、CrUX、主题版本、app 列表、图片体积、字体、第三方脚本、转化漏斗、设备/国家和近期改版记录。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 先定位 LCP、INP、CLS 的主要来源。`n2. 压缩首屏图片，使用合适尺寸和 lazy loading。`n3. 清理未使用 app、重复追踪脚本和阻塞字体。`n4. 检查主题 section、视频、弹窗和评价组件。`n5. 分批上线并监控转化和错误。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
LCP、INP、CLS、TTFB、Speed Index、mobile CVR、bounce rate、ATC rate 和 revenue per session。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
速度诊断、脚本/app 清单、图片优化表、主题修改建议、风险分级、回滚方案和复盘报表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得删除必要支付、隐私、客服或合规脚本；性能优化不能破坏埋点和核心购买流程。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
移动端 LCP 6 秒，首屏 hero 图 4MB。合格方案先换 WebP/AVIF 和响应式尺寸，再评估是否延迟加载评价 app。

## 验证方式
上线前后比较 CWV 和转化，至少观察 7-14 天。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
