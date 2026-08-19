---
name: "amazon-product-search"
description: "用于 Amazon 市场选品和竞品池构建场景，按关键词、类目、价格带和评价质量筛选商品，输出可比较的候选ASIN清单。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon商品搜索研究"
platforms: ["amazon"]
sceneTags: ["product-research", "listing-content", "pricing-profit", "customer-voice"]
searchTags: ["amazon", "product-research", "listing-content", "pricing-profit", "customer-voice"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-amazon-product-search"
originKind: "external-listing"
---

# amazon-product-search

## 适用场景与边界
用于从 Amazon 搜索页和类目页发现产品机会或验证选品假设。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集关键词、类目、前 20-50 个 ASIN、价格、评分、评价数、BSR、尺寸重量、变体、广告密度和差评主题。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 按买家搜索意图建立关键词组。`n2. 抽取前排 ASIN 的价格、评价、卖点和弱点。`n3. 评估广告密度、品牌集中度和进入成本。`n4. 计算 FBA 费用与目标毛利。`n5. 输出进入、差异化或放弃建议。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
search volume proxy、price median、review threshold、rating gap、BSR、FBA fee、ad density、margin。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
机会评分、竞品矩阵、评论痛点、成本模型、差异化方向和下一步验证。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得选择侵权、认证不明或受限类目产品。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
搜索 “desk organizer” 前排评价过万且低价。合格结论可能是进入成本高，除非有明确材质/场景差异。

## 验证方式
样品和小批量测试后用 30/60 天数据验证。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
