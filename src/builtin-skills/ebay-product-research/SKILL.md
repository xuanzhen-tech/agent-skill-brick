---
name: "ebay-product-research"
description: "用于 eBay 新品机会评估或类目扩展场景，分析 sold listings、价格带、sell-through、竞争密度和物流限制，输出选品优先级、风险判断与测试清单。"
version: 0.1.0
collection: ecosystem
displayName: "eBay 选品研究"
platforms: ["ebay"]
sceneTags: ["product-research", "listing-content", "pricing-profit", "inventory-supply-chain", "brand-compliance", "analytics-automation"]
searchTags: ["ebay", "product-research", "listing-content", "pricing-profit", "inventory-supply-chain", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-ebay-product-research"
originKind: "template"
---

# eBay Product Research

## 适用场景与边界
适用于判断一个商品是否适合在 eBay 上以固定价、拍卖或 refurbished/used 形式销售。特别适合配件、收藏品、汽配、电子零件、二手品和长尾型号货。不适用于无法确认真伪、侵权风险高、物流不可控或售后检测成本过高的商品。

## 输入信息清单
需要目标市场、关键词、候选商品、采购成本、预计物流费、尺寸重量、condition、认证/真伪证明、竞品 active listings、sold listings、价格、运费、seller level、退货政策和供应稳定性。

## 分析流程
1. 用 sold listings 判断真实成交价，而不是只看 active listing 标价。
2. 计算 sell-through：成交数量 / 活跃刊登数量，识别有需求但竞争不过载的细分词。
3. 分析 condition 和型号：new、used、open box、parts only 的价格和退货风险不同。
4. 核算 landed cost、平台费、广告费、退货损耗和国际物流不可达地区。
5. 输出进入、观察或放弃，并给出首批 SKU、价格、刊登角度和库存规模。

## 关键指标与判断标准
关注 sold count、active count、sell-through rate、median sold price、price spread、shipping cost、return rate、defect risk、contribution margin。sell-through 高但价格离散大，要检查 condition；毛利高但退货检测复杂，不应轻易进入；低价重货跨境物流会吞噬利润。

## 可执行输出
输出机会评分、关键词/型号清单、竞品矩阵、价格带、首批采购建议、刊登策略、物流风险和验证计划。

## 风险与合规边界
不得销售仿牌、无授权品牌件、危险品或无法证明来源的高风险商品。二手电子、汽配和收藏品要明确 condition、兼容性和退货政策。

## 示例
输入：候选 “vintage Sony Walkman parts”，采购成本 18 美元，国际物流 9 美元。输出：sold listings 显示 working condition 中位价 68 美元，parts only 28 美元；建议只采购可测试工作状态货源，首批 10 件，标题突出型号和 tested working。

## 验证方式
用 10-20 件小批量测试 30 天，看浏览、watchers、成交价、退货和客服问题，再决定是否扩大采购。
