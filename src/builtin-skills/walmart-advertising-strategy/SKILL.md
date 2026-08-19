---
name: "walmart-advertising-strategy"
description: "用于 Walmart Connect 广告冷启动、放量或 ROAS 复盘场景，结合 Buy Box、内容质量、关键词、预算和出价信号，输出投放结构、调价动作与验证指标。"
version: 0.1.0
collection: ecosystem
displayName: "Walmart 广告策略"
platforms: ["walmart"]
sceneTags: ["listing-content", "advertising-growth"]
searchTags: ["walmart", "listing-content", "advertising-growth"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-walmart-advertising-strategy"
originKind: "template"
---

# Walmart Advertising Strategy

## 适用场景与边界
用于 Walmart Marketplace 商品具备可售库存、内容质量达标并希望通过 Walmart Connect 获取增量曝光和订单的场景。该 skill 的核心是判断“哪些 SKU 可以投、投什么结构、投到什么程度停止”，不是单纯提高广告花费。

如果商品没有 Buy Box、库存不足、价格明显高于同类竞品、内容质量低或 review 风险高，应先修运营基础，再考虑放量。

## 输入信息清单
- SKU 清单：item id、类目、售价、成本、毛利、库存、Buy Box、Content Quality、评分与评价数。
- 广告数据：Campaign、ad group、keyword、match type、bid、spend、impressions、clicks、orders、sales、ROAS、CPC。
- 自然表现：自然排名、页面转化、促销状态、竞品价格、配送方式。
- 目标约束：目标 ROAS、可接受 TACOS、预算上限、清库存/拉新/利润目标。

## 操作流程
1. 先做投放资格筛选：剔除无 Buy Box、缺货、内容质量低、毛利不足和评分过低的 SKU。
2. 建立三层结构：自动投放发现词，手动精准承接高转化词，类目/竞品词用于防守或测试。
3. 预算按目标分层：利润 SKU 控 ROAS，潜力 SKU 控学习预算，清库存 SKU 控库存天数和亏损上限。
4. 每 7 天处理搜索词：高点击无转化降价或否词，高转化词加精准，高花费低 ROAS 的词降 bid 或暂停。
5. 把广告与运营联动：广告表现差时先看 Buy Box、价格、配送、评价和内容质量，而不是只调 bid。

## 关键指标与判断标准
核心指标包括 ROAS、CPC、CTR、CVR、广告销售额、TACOS、Buy Box win rate、贡献毛利和库存覆盖天数。CTR 低通常是关键词、主图、价格或曝光位置问题；CVR 低通常是页面承接、评价、配送或竞品 offer 问题。

一个广告组连续两个观察周期花费超过目标 CPA 但无订单，应暂停或重建；高 ROAS 但库存不足的 SKU 不应继续加预算；广告订单增长但自然订单被挤压时，需要看 TACOS 而非只看 ROAS。

## 可执行输出
输出广告账户诊断、SKU 投放资格表、Campaign 结构、关键词迁移建议、否词清单、bid 调整表、预算分配、7/14/30 天复盘模板和停止条件。

## 风险与合规
不得使用误导性 claim、侵权竞品词或与商品无关的关键词。预算增加前必须确认库存、价格和履约能力，避免广告把账号绩效风险放大。

## 示例
某厨房用品 SKU ROAS 低。诊断发现 Buy Box 只有 45%，价格高于主要竞品 12%，自动投放中“stainless mixing bowl set”有转化。合格方案应先处理价格和 Buy Box，再把该词迁移到精准匹配，同时暂停高花费无转化的宽泛词。

## 验证方式
7 天看搜索词和 spend waste，14 天看 ROAS、CVR 和 Buy Box，30 天看 TACOS、贡献毛利和自然排名。未达到目标 ROAS 且没有运营改善空间的 SKU 应停止投放。
