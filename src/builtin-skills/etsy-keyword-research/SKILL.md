---
name: "etsy-keyword-research"
description: "用于 Etsy 新品上架、低曝光 listing 或季节词布局场景，分析买家意图、长尾词、标题前置词、标签和属性词，输出关键词组合与验证方案。"
version: 0.1.0
collection: ecosystem
displayName: "Etsy 关键词研究"
platforms: ["etsy"]
sceneTags: ["listing-content", "customer-voice", "analytics-automation"]
searchTags: ["etsy", "listing-content", "customer-voice", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-etsy-keyword-research"
originKind: "template"
---

# etsy-keyword-research

## 适用场景与边界
用于新品上架、旧 listing 流量下降、标签混乱或季节关键词布局。Etsy 关键词应围绕买家会怎么描述礼品、用途、对象、材质、风格和场景，而不是机械堆热门词。

该 skill 面向 Etsy 的手工、复古、POD、数字下载和小众礼品卖家。判断时必须尊重 Etsy 买家的搜索习惯、礼品属性、个性化需求、制作周期、Star Seller 指标和平台对真实手作/复古/数字产品的规则要求。

## 输入信息清单
收集 listing、目标买家、用途场景、材质尺寸、风格、节日、竞品标题标签、Etsy search analytics、访问和转化数据。

还需要补充店铺阶段、目标国家、核心 SKU、客单价、毛利、制作或交付周期、评价状态、库存/产能和近 30/90 天访问、收藏、加购、订单、退款数据。

## 操作流程
1. 划分词组：核心产品词、用途词、收礼对象、风格材质、节日事件、个性化和长尾问题。`n2. 标题前半段放最接近购买意图的词，不塞满重复词。`n3. 13 个标签覆盖不同意图，不把同一短词反复拆分浪费位置。`n4. 属性字段能表达的内容优先填属性，标签补充属性覆盖不到的搜索角度。`n5. 每 30 天按搜索词表现调整，不因短期波动频繁重写。

执行顺序必须可复盘：先定位当前最大瓶颈，再选择 3 个以内动作上线，记录基线、上线时间、观察窗口和停止条件。不要同时改标题、图片、价格、广告和配送，否则无法判断哪一个动作有效。

## 关键指标与判断标准
看 impressions、visits、CTR、favorites、orders、conversion、search terms 和排名迹象。曝光高但点击低说明词或首图不匹配；点击高无单说明人群、价格或页面承接有问题。

Etsy 场景下要同时看访问、收藏、加购、转化、订单、AOV、广告花费、退款、消息响应、发货追踪和五星评价。流量上升但收藏/加购不动，多半是关键词或人群不准；加购多但下单少，优先检查价格、配送、个性化说明、交付时间和信任资产。

## 可执行输出
关键词分组表、标题草案、13 个标签、属性补齐清单、季节词日历、竞品词风险说明和 30 天复盘表。

输出必须包含优先级、执行人、上线日期、样本范围、预期影响、风险和复盘方式，避免只给抽象建议。

## 风险与合规
不得使用与商品无关、侵权品牌、名人、影视角色或误导材质/用途的关键词。

不得刷收藏、刷评、误导 handmade/vintage 属性、盗用他人图片或设计、虚假限时折扣、夸大定制交付能力，或在数字产品中使用无授权字体、素材、商标和角色形象。

## 示例
一个手工陶瓷杯只写 “mug gift handmade”。合格方案应补充 “ceramic coffee mug”、“rustic pottery mug”、“gift for coffee lover”、“housewarming gift”等不同意图，并检查页面是否真能承接这些词。

## 验证方式
30 天复盘搜索词曝光、访问和订单；只保留带来合格点击或订单的方向，低相关高曝光词应降权。

复盘时同时记录副作用：退款是否增加、消息量是否超出承接能力、生产周期是否被压缩、差评主题是否变化。若两个观察周期没有改善，应保留记录并回到输入数据重新诊断。
