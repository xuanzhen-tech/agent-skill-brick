---
name: "voc-amazon-reviews"
description: "用于 Amazon 买家声音分析场景，抽取评论主题、痛点频率、满意驱动、差评风险和功能机会，输出产品与内容优化清单。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon VOC评论研究"
platforms: ["amazon"]
sceneTags: ["listing-content", "customer-voice", "brand-compliance", "analytics-automation"]
searchTags: ["amazon", "listing-content", "customer-voice", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-voc-amazon-reviews"
originKind: "external-listing"
---

# voc-amazon-reviews

## 适用场景与边界
用于把大量 Amazon review 转化为产品定义、卖点和质量改进。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 review 导出、ASIN、竞品分组、星级、变体、时间、verified、Q&A、退货和客服记录。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 清洗重复和无效评论。`n2. 按使用场景、痛点、功能、材质、包装和售后聚类。`n3. 识别高频高强度需求和低频高风险缺陷。`n4. 与竞品对比，找可差异化卖点。`n5. 输出 PRD 或 Listing brief。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
theme frequency、sentiment、severity、review velocity、rating impact、refund correlation。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
VOC 报告、需求优先级、缺陷风险、竞品对比、产品迭代和文案素材。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得把少量极端评论当普遍需求；不得使用买家个人信息。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
1000 条评论中 18% 提到 “lid leaks”。合格输出应把密封结构列为 P0 产品验证项。

## 验证方式
产品迭代后跟踪新评论和退货原因。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
