---
name: "firecrawl-mcp-server"
description: "用于 Amazon 市场研究中的网页资料抓取和清洗场景，设定来源、字段、频率和质量校验，输出可复核资料表。"
version: 0.1.0
collection: ecosystem
displayName: "网页资料采集整理"
platforms: ["amazon"]
sceneTags: ["product-research", "analytics-automation"]
searchTags: ["amazon", "product-research", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-firecrawl-mcp-server"
originKind: "external-listing"
---

# firecrawl-mcp-server

## 适用场景与边界
用于采集公开网页内容并转成可分析文本，支持竞品页面、博客、政策和媒体研究。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 URL、抓取深度、字段、排除路径、目标格式、频率和合规要求。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 明确抓取范围和 robots/条款风险。`n2. 抓取并保留来源 URL。`n3. 清洗导航、页脚和重复内容。`n4. 输出 Markdown/JSON。`n5. 抽样核对正文完整。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
crawl success、content completeness、duplicate rate、source traceability、cost。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
抓取配置、清洗结果、结构化输出、来源表和质量报告。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得抓取非公开或受限内容。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
拆解竞品博客时，应保留文章标题、URL、发布时间和正文摘要。

## 验证方式
抽样打开源页面对照。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
