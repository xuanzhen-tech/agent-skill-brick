---
name: "bsc-amazon-rufus-cosmo"
description: "用于 Amazon 搜索理解和内容相关性优化场景，分析买家意图、属性覆盖、语义缺口和问答线索，输出页面内容改写建议。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon Rufus与COSMO优化"
platforms: ["amazon"]
sceneTags: ["customer-voice", "analytics-automation"]
searchTags: ["amazon", "customer-voice", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-amazon-rufus-cosmo"
originKind: "external-listing"
---

# BSC-Amazon-Rufus-Cosmo

## 适用场景与边界
用于优化 Listing 让 Amazon 语义搜索和购物助手更容易理解商品适用场景、限制和差异。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集商品属性、标题、五点、A+、FAQ、Q&A、review、买家问题、竞品页面和关键词。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 将买家问题转成页面可回答的信息。`n2. 补齐属性、尺寸、兼容、材料和使用限制。`n3. 在五点/A+/FAQ 中用自然语言解释场景。`n4. 删除空泛形容词，增加可验证事实。`n5. 复盘搜索和转化。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
semantic coverage、Q&A repeats、CTR、CVR、organic rank、return reason。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
语义内容缺口、FAQ、属性修复、A+ brief 和复盘。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得写无法证明的功效或兼容性。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
买家常问是否适配某型号。合格方案应在标题/五点/图片中明确兼容列表和限制。

## 验证方式
30 天看相关搜索、问答减少和转化。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
