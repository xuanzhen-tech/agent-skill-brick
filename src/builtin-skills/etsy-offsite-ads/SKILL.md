---
name: "etsy-offsite-ads"
description: "用于 Etsy Offsite Ads 费用占比高、归因订单不清或利润受压场景，评估费用门槛、价格调整、退出条件和站内广告分工，输出站外广告决策建议。"
version: 0.1.0
collection: ecosystem
displayName: "Etsy 站外广告决策"
platforms: ["etsy"]
sceneTags: ["pricing-profit", "advertising-growth", "store-operations"]
searchTags: ["etsy", "pricing-profit", "advertising-growth", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-etsy-offsite-ads"
originKind: "template"
---

# etsy-offsite-ads

## 适用场景与边界
用于判断 Etsy Offsite Ads 是否吞噬利润、哪些订单受影响、是否应退出或通过定价与 SKU 筛选承接站外流量。

该 skill 面向 Etsy 的手工、复古、POD、数字下载和小众礼品卖家。判断时必须尊重 Etsy 买家的搜索习惯、礼品属性、个性化需求、制作周期、Star Seller 指标和平台对真实手作/复古/数字产品的规则要求。

## 输入信息清单
收集 Offsite Ads 订单、费用率、商品售价、成本、配送、退款、毛利、客单价、复购、是否达到强制参与门槛和站内广告表现。

还需要补充店铺阶段、目标国家、核心 SKU、客单价、毛利、制作或交付周期、评价状态、库存/产能和近 30/90 天访问、收藏、加购、订单、退款数据。

## 操作流程
1. 按 SKU 计算扣除 Offsite Ads fee 后的贡献毛利。`n2. 区分高毛利、低毛利、定制高工时和易退货商品。`n3. 对无法退出的店铺，用价格、套装和商品组合吸收费用。`n4. 对可退出的店铺，比较退出前后的站外订单、利润和新客价值。`n5. 不把 Offsite Ads 订单简单归功于 SEO 或站内广告。

执行顺序必须可复盘：先定位当前最大瓶颈，再选择 3 个以内动作上线，记录基线、上线时间、观察窗口和停止条件。不要同时改标题、图片、价格、广告和配送，否则无法判断哪一个动作有效。

## 关键指标与判断标准
看 Offsite Ads sales、fee、订单占比、贡献毛利、退款率、AOV 和新客复购。销售额增长但扣费后亏损，应调整价格或限制低毛利 listing。

Etsy 场景下要同时看访问、收藏、加购、转化、订单、AOV、广告花费、退款、消息响应、发货追踪和五星评价。流量上升但收藏/加购不动，多半是关键词或人群不准；加购多但下单少，优先检查价格、配送、个性化说明、交付时间和信任资产。

## 可执行输出
SKU 利润表、退出/保留建议、价格调整清单、低毛利风险名单、站内外广告预算分工和复盘模板。

输出必须包含优先级、执行人、上线日期、样本范围、预期影响、风险和复盘方式，避免只给抽象建议。

## 风险与合规
不得通过误导价格或隐藏配送费抵消广告费用。必须遵守 Etsy 对 Offsite Ads 参与条件的实际规则。

不得刷收藏、刷评、误导 handmade/vintage 属性、盗用他人图片或设计、虚假限时折扣、夸大定制交付能力，或在数字产品中使用无授权字体、素材、商标和角色形象。

## 示例
一个 18 美元贴纸包被 Offsite Ads 带单后几乎无利润。合格方案应测算费用后毛利，考虑捆绑提高 AOV，或对该 listing 调价/停推。

## 验证方式
30 天比较 Offsite Ads 净利润和退款；价格调整后再看 CVR 是否可接受。

复盘时同时记录副作用：退款是否增加、消息量是否超出承接能力、生产周期是否被压缩、差评主题是否变化。若两个观察周期没有改善，应保留记录并回到输入数据重新诊断。
