---
name: "serp-content-teardown"
description: "用于 Amazon 站外搜索结果和内容竞品拆解场景，分析SERP意图、标题、结构、证据和差异化，输出内容优化提纲。"
version: 0.1.0
collection: ecosystem
displayName: "搜索结果内容拆解"
platforms: ["amazon"]
sceneTags: ["listing-content", "brand-compliance", "analytics-automation"]
searchTags: ["amazon", "listing-content", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-serp-content-teardown"
originKind: "template"
---

# serp-content-teardown

## 适用场景与边界
用于分析 Google 搜索结果，为 Shopify/Amazon 品牌站内容或落地页制定 brief。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集关键词、国家、SERP 前 10、页面类型、标题、内容结构、FAQ、作者、内链、商品链接和搜索意图。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 判断 SERP 意图：指南、评测、类目、交易或本地。`n2. 拆前排页面结构和共同模块。`n3. 找缺口：原创测试、图片、表格、FAQ、商品承接。`n4. 输出内容 brief 和内链。`n5. 复盘排名与转化。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
SERP intent fit、content gap、CTR、ranking、organic sessions、product clicks。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
SERP 拆解、内容大纲、证据需求、FAQ、内链和转化路径。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得抄袭前排内容或编造作者资质。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
关键词 “best travel jewelry case” 前排都是评测清单。合格 brief 应包含对比表和真实使用图。

## 验证方式
发布后 30/60/90 天看索引、点击和商品点击。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
