---
name: "amazon-reviews"
description: "用于 Amazon 商品评价洞察场景，提取买家痛点、满意点、质量问题、功能需求和情绪趋势，输出VOC摘要与产品优化建议。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon评论分析"
platforms: ["amazon"]
sceneTags: ["customer-voice", "analytics-automation"]
searchTags: ["amazon", "customer-voice", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-amazon-reviews"
originKind: "external-listing"
---

# amazon-reviews

## 适用场景与边界
用于分析自身或竞品 review，发现产品改进、页面误解和差异化机会。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 ASIN、review 文本、星级、时间、变体、图片/视频、Q&A、退货原因、客服和竞品评论。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 按星级、变体和时间分组。`n2. 归类质量、尺寸、说明、包装、物流、使用场景和期望错配。`n3. 区分产品根因、页面根因和履约根因。`n4. 提炼可用于图片、A+、FAQ 和产品迭代的证据。`n5. 监控新差评主题。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
rating、review velocity、1-2 star ratio、theme frequency、refund、CVR、Q&A repeats。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
VOC 主题表、根因判断、竞品机会、Listing 修复、产品迭代建议和复盘。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得刷评、诱导改评或泄露买家信息。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
差评集中“安装困难”。合格方案应增加安装视频、说明书图和配件检查，而不是只回复客服话术。

## 验证方式
30 天看新 review 主题、退款和 CVR。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
