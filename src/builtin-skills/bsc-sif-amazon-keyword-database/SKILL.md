---
name: "bsc-sif-amazon-keyword-database"
description: "用于 Amazon 关键词资产沉淀场景，规范词根、搜索意图、类目、竞品、广告指标和历史表现，输出可查询关键词库。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon关键词数据库"
platforms: ["amazon"]
sceneTags: ["listing-content", "advertising-growth", "analytics-automation"]
searchTags: ["amazon", "listing-content", "advertising-growth", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-sif-amazon-keyword-database"
originKind: "external-listing"
---

# BSC-SIF-Amazon-keyword-database

## 适用场景与边界
用于建立可长期复用的 Amazon 关键词资产库。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集关键词来源、词根、类目、ASIN、ABA、广告报告、自然排名、Listing 覆盖、更新时间和负责人。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 定义关键词层级：root、modifier、long-tail、brand、competitor。`n2. 合并 ABA、广告、搜索建议和竞品词。`n3. 标注意图、适用 ASIN、优先级和状态。`n4. 建更新和归档规则。`n5. 用于 Listing、广告和选品。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
coverage、freshness、duplicate、action status、rank movement、ACOS by keyword。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
数据库字段、导入流程、治理规则、视图和月度复盘。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得使用侵权品牌词作为误导流量。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
一个词库只有关键词没有 ASIN 映射。合格方案应增加适用 ASIN 和动作状态。

## 验证方式
每月复核高价值词和过期词。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
