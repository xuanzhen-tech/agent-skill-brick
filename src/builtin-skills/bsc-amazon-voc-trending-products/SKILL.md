---
name: "bsc-amazon-voc-trending-products"
description: "用于 Amazon 趋势选品和需求验证场景，分析评论、搜索词、社媒反馈和竞品缺口，输出趋势机会与风险判断。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon VOC趋势选品"
platforms: ["amazon"]
sceneTags: ["product-research", "customer-voice", "brand-compliance", "analytics-automation"]
searchTags: ["amazon", "product-research", "customer-voice", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-amazon-voc-trending-products"
originKind: "external-listing"
---

# BSC-amazon-VOC-trending-products

## 适用场景与边界
用于通过 VOC 和趋势信号寻找下一批 Amazon 产品机会。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集评论时间序列、竞品新品、关键词、Google Trends、社媒讨论、价格、BSR 和供应链信息。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 找评论中新出现或增长的需求。`n2. 对比搜索和社媒趋势。`n3. 判断现有产品是否满足需求。`n4. 评估成本、认证和上市窗口。`n5. 形成试样计划。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
theme growth、search trend、review velocity、competition gap、margin、time to market。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
趋势机会表、需求证据、竞品缺口、供应链风险和验证计划。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不要追短期噪音或侵权热点。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
户外灯评论中对 USB-C 需求快速增长。合格方案应验证成本和防水认证。

## 验证方式
按月跟踪趋势是否持续，样品后验证。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
