---
name: "zach-feature-demand-validator"
description: "用于 Amazon 新功能或卖点验证场景，结合评论、搜索词、竞品页面和价格带判断真实需求，输出需求强度与验证方案。"
version: 0.1.0
collection: ecosystem
displayName: "功能需求验证"
platforms: ["amazon"]
sceneTags: ["product-research", "pricing-profit", "customer-voice"]
searchTags: ["amazon", "product-research", "pricing-profit", "customer-voice"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-zach-feature-demand-validator"
originKind: "external-listing"
---

# zach-feature-demand-validator

## 适用场景与边界
用于判断某个产品功能是否值得开发、改款或写入 Listing 卖点。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集目标功能、竞品 ASIN、评论、Q&A、客服、退货、成本、供应商可行性和价格影响。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 从 VOC 统计需求频率和痛点强度。`n2. 判断买家是否愿意为功能付费。`n3. 评估供应链、认证、缺陷和退货风险。`n4. 将功能转化为可展示证据。`n5. 给出开发/不开发建议。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
mention frequency、sentiment severity、price premium、cost impact、defect risk、CVR potential。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
需求验证表、功能优先级、证据素材、成本风险和测试计划。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得用无证据功能 claim 或夸大效果。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
评论常说 “battery dies fast”，但改电池会增加认证风险。合格方案应评估成本和安全再决定。

## 验证方式
样品和小批量看差评主题是否下降。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
