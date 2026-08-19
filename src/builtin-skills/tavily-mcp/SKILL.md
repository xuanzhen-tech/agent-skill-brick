---
name: "tavily-mcp"
description: "用于 Amazon 市场、竞品和趋势资料检索场景，围绕问题收集可信来源、交叉验证信息并提炼结论，输出资料摘要与证据链接。"
version: 0.1.0
collection: ecosystem
displayName: "网络检索研究"
platforms: ["amazon"]
sceneTags: ["analytics-automation"]
searchTags: ["amazon", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-tavily-mcp"
originKind: "external-listing"
---

# tavily-mcp

## 适用场景与边界
用于跨境电商市场、法规、竞品、媒体和趋势资料搜索。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集研究问题、关键词、国家、时间范围、可信来源偏好、需要字段和输出格式。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 将问题拆成可搜索子问题。`n2. 优先官方、平台、行业和一手来源。`n3. 交叉验证关键事实。`n4. 标记发布日期和适用国家。`n5. 输出摘要和链接。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
source quality、recency、coverage、fact confidence、citation completeness。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
搜索策略、来源清单、证据摘要、风险和待验证项。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得把未经验证的博客当政策事实。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
研究 TikTok Shop 类目限制，应优先找官方规则而非二手文章。

## 验证方式
抽查来源链接和日期。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
