---
name: "bsc-amazon-advertising-strategy"
description: "用于 Amazon 广告投放复盘和预算优化场景，分析关键词、竞价、ACOS/TACOS、转化和利润约束，输出分层调整建议。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon广告策略"
platforms: ["amazon"]
sceneTags: ["listing-content", "pricing-profit", "advertising-growth", "analytics-automation"]
searchTags: ["amazon", "listing-content", "pricing-profit", "advertising-growth", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-amazon-advertising-strategy"
originKind: "external-listing"
---

# BSC-amazon-advertising-strategy

## 适用场景与边界
用于 Amazon PPC 账户结构混乱、ACOS 高、预算浪费或需要新品/成熟品不同投放策略。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 campaign、keyword、search term、ASIN、bid、spend、sales、ACOS、TACOS、organic rank、库存、价格、评价和毛利。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 按产品阶段分新品、成长、利润、防守和清仓。`n2. 建立自动发现、手动精准、竞品 ASIN 和品牌防守结构。`n3. 每 7 天迁移高转化词，否定浪费词。`n4. bid 与库存、排名和利润联动。`n5. 用 TACOS 判断整体健康。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
ACOS、TACOS、CPC、CTR、CVR、impression share、organic rank、margin。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
账户诊断、campaign 结构、关键词动作、bid 调整、预算分配和复盘表。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得投侵权品牌词或用广告推无法履约商品。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
ACOS 低但 TACOS 升高，可能是广告吃掉自然单。合格方案应拆品牌词和非品牌词。

## 验证方式
7/14/30 天看搜索词、ACOS/TACOS 和排名。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
