---
name: "zach-search-term-report-analyzer"
description: "用于 Amazon 广告搜索词复盘场景，识别高效词、浪费词、否词机会、预算迁移和Listing补词点，输出投放调整清单。"
version: 0.1.0
collection: ecosystem
displayName: "搜索词报告分析"
platforms: ["amazon"]
sceneTags: ["listing-content", "advertising-growth", "analytics-automation"]
searchTags: ["amazon", "listing-content", "advertising-growth", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-zach-search-term-report-analyzer"
originKind: "external-listing"
---

# zach-search-term-report-analyzer

## 适用场景与边界
用于解析 Amazon Ads 搜索词报告，找出赚钱词、浪费词和需要独立建组的词。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 search term report、campaign/ad group、match type、impressions、clicks、spend、orders、sales、ACOS、SKU 毛利和时间窗口。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 清洗 ASIN、品牌词、无关词和低样本词。`n2. 标记高转化、高点击无单、高花费低 ROAS 和潜力词。`n3. 高转化词迁移到精准，保留原发现结构。`n4. 对无关词否定，对弱词降 bid。`n5. 输出下周预算调整。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
spend waste、orders、CVR、ACOS、CPC、CTR、query profitability、TACOS。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
搜索词动作表、迁移清单、否词清单、bid 建议和复盘模板。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不能只按一两次点击否定潜力词；品牌词和类目词要分开评价。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
某词花费 80 美元无单且与产品用途不符。合格方案应否定；若相关但页面弱，则先修 Listing。

## 验证方式
每周复盘，观察 14 天后确认动作效果。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
