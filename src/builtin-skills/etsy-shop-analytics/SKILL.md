---
name: "etsy-shop-analytics"
description: "用于 Etsy 店铺流量波动、转化下滑或 SKU 去留决策场景，分析 Shop Stats、来源、搜索词、热门 listing、广告影响和复购，输出数据诊断与行动优先级。"
version: 0.1.0
collection: ecosystem
displayName: "Etsy 店铺数据分析"
platforms: ["etsy"]
sceneTags: ["listing-content", "advertising-growth", "store-operations", "analytics-automation"]
searchTags: ["etsy", "listing-content", "advertising-growth", "store-operations", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-etsy-shop-analytics"
originKind: "template"
---

# etsy-shop-analytics

## 适用场景与边界
用于店铺经营复盘、找增长瓶颈、判断广告和 SEO 是否有效，以及决定哪些 SKU 扩、修、停。核心是把数据转成行动，而不是只读报表。

该 skill 面向 Etsy 的手工、复古、POD、数字下载和小众礼品卖家。判断时必须尊重 Etsy 买家的搜索习惯、礼品属性、个性化需求、制作周期、Star Seller 指标和平台对真实手作/复古/数字产品的规则要求。

## 输入信息清单
收集 30/90/365 天 visits、orders、revenue、conversion、traffic source、search terms、listing stats、ads、refunds、messages 和 review。

还需要补充店铺阶段、目标国家、核心 SKU、客单价、毛利、制作或交付周期、评价状态、库存/产能和近 30/90 天访问、收藏、加购、订单、退款数据。

## 操作流程
1. 先按时间窗口和季节性统一口径。`n2. 拆流量来源：Etsy search、Etsy app、ads、social、direct、external。`n3. 找 listing 分层：高流量高转化、低流量高转化、高流量低转化、低流量低转化。`n4. 对不同分层采取不同动作：放大、补 SEO、修页面或下架。`n5. 每月复盘利润和运营压力。

执行顺序必须可复盘：先定位当前最大瓶颈，再选择 3 个以内动作上线，记录基线、上线时间、观察窗口和停止条件。不要同时改标题、图片、价格、广告和配送，否则无法判断哪一个动作有效。

## 关键指标与判断标准
看 visits、CVR、AOV、revenue、favorites、traffic source、search terms、refund rate 和 contribution margin。收入高但退款或工时高的 listing 不一定是好 SKU。

Etsy 场景下要同时看访问、收藏、加购、转化、订单、AOV、广告花费、退款、消息响应、发货追踪和五星评价。流量上升但收藏/加购不动，多半是关键词或人群不准；加购多但下单少，优先检查价格、配送、个性化说明、交付时间和信任资产。

## 可执行输出
月度经营看板、SKU 四象限、搜索词机会、广告影响判断、问题 listing 清单、行动优先级和复盘模板。

输出必须包含优先级、执行人、上线日期、样本范围、预期影响、风险和复盘方式，避免只给抽象建议。

## 风险与合规
不要用不完整时间窗口做结论；节日、大促、断货和广告开关要单独标注。

不得刷收藏、刷评、误导 handmade/vintage 属性、盗用他人图片或设计、虚假限时折扣、夸大定制交付能力，或在数字产品中使用无授权字体、素材、商标和角色形象。

## 示例
店铺总访问增长但订单不变。合格分析应拆来源，发现 Pinterest 流量增加但转化低，于是优化落地 listing 和社交素材，而不是盲目改全店 SEO。

## 验证方式
每周看异常，每月做 SKU 决策；动作上线后记录日期和指标，避免重复试错。

复盘时同时记录副作用：退款是否增加、消息量是否超出承接能力、生产周期是否被压缩、差评主题是否变化。若两个观察周期没有改善，应保留记录并回到输入数据重新诊断。
