---
name: "amazon-abakeyword"
description: "用于 Amazon Brand Analytics关键词机会挖掘场景，分析SFR、点击份额、转化份额、竞品ASIN和词根聚类，输出Listing与广告用词建议。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon ABA关键词分析"
platforms: ["amazon"]
sceneTags: ["listing-content", "advertising-growth", "brand-compliance", "analytics-automation"]
searchTags: ["amazon", "listing-content", "advertising-growth", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-amazon-abakeyword"
originKind: "external-listing"
---

# Amazon-ABAkeyword

## 适用场景与边界
用于利用 Brand Analytics/ABA 数据寻找关键词机会、判断竞品份额和规划 Listing 与广告。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集站点、关键词、SFR、Top clicked ASIN、click share、conversion share、时间窗口、目标 ASIN、广告搜索词和自然排名。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 按词根和买家意图聚类。`n2. 比较 SFR 与自身排名/广告表现。`n3. 找高频低竞争、竞品强占和转化不匹配词。`n4. 将关键词映射到标题、五点、A+、广告和后台词。`n5. 每周/每月跟踪变化。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
SFR、click share、conversion share、organic rank、CTR、CVR、CPC、ACOS、TACOS。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
关键词机会表、竞品份额分析、Listing 词位建议、广告结构和复盘表。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得堆砌无关词或侵权品牌词。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
某词 SFR 高但竞品转化份额集中。合格方案应判断是否有价格/评价/功能壁垒，而不是直接抢投。

## 验证方式
30 天看排名、点击、广告和转化。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
