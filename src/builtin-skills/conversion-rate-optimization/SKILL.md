---
name: "conversion-rate-optimization"
description: "用于跨境店铺有流量但订单不足、加购流失或页面改版复盘场景，诊断漏斗、首屏、信任资产、价格配送和结账阻力，输出实验假设、页面改稿与成功指标。"
version: 0.1.0
collection: ecosystem
displayName: "转化率优化"
platforms: ["cross-platform"]
sceneTags: ["pricing-profit", "advertising-growth", "inventory-supply-chain", "store-operations", "cross-platform"]
searchTags: ["cross-platform", "pricing-profit", "advertising-growth", "inventory-supply-chain", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-conversion-rate-optimization"
originKind: "template"
---

# Conversion Rate Optimization

## 适用场景与边界
用于独立站或平台店铺有流量但订单不足、广告点击成本上升、加购到支付流失高或页面改版后转化下降的场景。该 skill 要求先定位漏斗瓶颈，再决定优化动作，不把所有页面元素同时改掉。

不适用于通过虚假折扣、误导承诺、暗黑模式或隐藏费用提高短期转化。涉及医疗功效、金融收益、认证背书等敏感承诺时必须保留证据。

## 输入信息清单
- 流量结构：渠道、关键词、受众、设备、国家、新老客、广告素材和落地页。
- 漏斗数据：PV、PDP view、ATC、checkout、payment、purchase、退款、取消、客服咨询。
- 页面资产：首屏、主图、价格、优惠、配送、退货、评价、FAQ、支付方式、信任徽章。
- 经济约束：毛利、AOV、CAC、库存、履约时效、促销成本和目标利润。

## 诊断流程
1. 按渠道和设备拆分，不把冷流量、品牌词和复购用户混在一起。
2. 找最大掉点：点击到落地页、商品页到加购、加购到结账、结账到支付分别判断。
3. 检查承诺一致性：广告素材、落地页、商品页、购物车和结账页的价格、优惠、配送和退货是否一致。
4. 排列实验：一次只改一个核心假设，例如首屏价值主张、主图、价格锚点、配送承诺或评价模块。
5. 复盘副作用：转化提高但退款、投诉、低毛利订单增加时，不算成功。

## 关键指标与判断标准
核心指标包括 CVR、ATC rate、checkout start rate、payment success、AOV、CAC、ROAS、退款率、毛利和页面速度。移动端 CVR 低于桌面端很多时，优先检查首屏加载、按钮可见性、支付方式和表单复杂度。

测试需要足够样本和固定观察窗口。若流量太小，应先做启发式诊断和用户录屏，不假装 A/B 结果有统计意义。

## 可执行输出
输出漏斗诊断、问题优先级、实验假设、页面改稿、测试配置、样本要求、成功标准、停止条件和复盘结论。

## 风险与合规
不得制造虚假稀缺、隐藏订阅、默认勾选不合理服务或误导价格。跨境场景必须清楚展示税费、配送时效、退货成本和客服渠道。

## 示例
广告点击质量稳定但移动端加购率低。合格方案应检查首屏是否展示核心卖点、价格、配送和 CTA；如果主图占满屏导致按钮不可见，应先测试压缩首屏和增加 sticky CTA，而不是直接提高广告预算。

## 验证方式
7 天看事件埋点是否准确，14 天看目标漏斗是否改善，30 天看订单、毛利、退款和客服投诉。实验成功后再推广到同类页面。
