---
name: "etsy-print-on-demand"
description: "用于 Etsy POD 选品、供应商评估或质量问题复盘场景，分析利基、样机真实性、利润率、生产时效和侵权风险，输出 POD 上架与运营检查表。"
version: 0.1.0
collection: ecosystem
displayName: "Etsy 按需印刷运营"
platforms: ["etsy"]
sceneTags: ["product-research", "pricing-profit", "brand-compliance", "store-operations", "analytics-automation"]
searchTags: ["etsy", "product-research", "pricing-profit", "brand-compliance", "store-operations", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-etsy-print-on-demand"
originKind: "template"
---

# etsy-print-on-demand

## 适用场景与边界
用于 Etsy 上经营 T-shirt、mug、poster、phone case 等按需生产商品。重点是选择可持续 niche、控制供应商质量和避免把 Etsy 变成低质量铺货。

该 skill 面向 Etsy 的手工、复古、POD、数字下载和小众礼品卖家。判断时必须尊重 Etsy 买家的搜索习惯、礼品属性、个性化需求、制作周期、Star Seller 指标和平台对真实手作/复古/数字产品的规则要求。

## 输入信息清单
收集 niche、设计来源、供应商、底品成本、生产地、时效、样机、售价、竞品、版权风险、退货政策和评价。

还需要补充店铺阶段、目标国家、核心 SKU、客单价、毛利、制作或交付周期、评价状态、库存/产能和近 30/90 天访问、收藏、加购、订单、退款数据。

## 操作流程
1. 先验证 niche：受众、礼品场景、关键词和竞品质量。`n2. 选择供应商时比较底品质量、产地、时效、颜色稳定性和客服。`n3. 样机要真实反映尺寸和材质，最好订样确认。`n4. 定价要包含 POD 成本、平台费用、广告、退货和重印。`n5. 建立质量问题处理规则：错印、色差、尺码、延迟分别处理。

执行顺序必须可复盘：先定位当前最大瓶颈，再选择 3 个以内动作上线，记录基线、上线时间、观察窗口和停止条件。不要同时改标题、图片、价格、广告和配送，否则无法判断哪一个动作有效。

## 关键指标与判断标准
看生产时效、缺陷率、退款率、CVR、评价、贡献毛利和设计命中率。POD 上新多但无收藏和点击，说明 niche 或首图不成立。

Etsy 场景下要同时看访问、收藏、加购、转化、订单、AOV、广告花费、退款、消息响应、发货追踪和五星评价。流量上升但收藏/加购不动，多半是关键词或人群不准；加购多但下单少，优先检查价格、配送、个性化说明、交付时间和信任资产。

## 可执行输出
niche 评分表、供应商对比、设计合规检查、样机规范、定价模型、质量 SOP 和上新复盘表。

输出必须包含优先级、执行人、上线日期、样本范围、预期影响、风险和复盘方式，避免只给抽象建议。

## 风险与合规
不得使用无授权 IP、商标、歌词、球队、影视角色或从其他店铺复制设计。POD 商品也必须符合 Etsy 对原创和透明生产合作方的要求。

不得刷收藏、刷评、误导 handmade/vintage 属性、盗用他人图片或设计、虚假限时折扣、夸大定制交付能力，或在数字产品中使用无授权字体、素材、商标和角色形象。

## 示例
一个卖家想上 “Taylor Swift gift shirt”。合格输出应标记商标/IP 高风险，建议转向非侵权的受众情绪或场景表达，并要求设计原创。

## 验证方式
每 30 天按设计批次看访问、收藏、订单和退款；质量投诉超过阈值时暂停对应供应商或底品。

复盘时同时记录副作用：退款是否增加、消息量是否超出承接能力、生产周期是否被压缩、差评主题是否变化。若两个观察周期没有改善，应保留记录并回到输入数据重新诊断。
