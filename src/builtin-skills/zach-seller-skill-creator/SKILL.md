---
name: "zach-seller-skill-creator"
description: "用于 Amazon 卖家运营流程沉淀场景，整理目标、输入数据、分析步骤、关键指标和交付物，输出可复用操作模板。"
version: 0.1.0
collection: ecosystem
displayName: "卖家流程模板生成"
platforms: ["amazon"]
sceneTags: ["store-operations", "analytics-automation"]
searchTags: ["amazon", "store-operations", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-zach-seller-skill-creator"
originKind: "external-listing"
---

# zach-seller-skill-creator

## 适用场景与边界
用于为 Amazon 卖家创建或改写专项 skill。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集运营问题、站点、ASIN、数据源、目标指标、执行资源、平台规则和示例。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 选择单一明确主题，如广告搜索词、Listing 健康或 VOC。`n2. 写清输入字段和数据口径。`n3. 提供分步诊断和行动表。`n4. 加入 Amazon 政策风险。`n5. 定义 7/14/30 天验证。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
ASIN specificity、metric clarity、actionability、policy risk、verification quality。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
Amazon skill 模板、字段清单、案例、风险和复盘方式。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得鼓励刷评、排名操纵或侵权词使用。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
广告 skill 必须区分 ACOS 和 TACOS，不能只说提高 ROI。

## 验证方式
人工审查并用真实 ASIN 案例测试。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
