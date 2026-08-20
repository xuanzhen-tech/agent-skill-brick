---
name: "amazon-competitor-monitor"
description: "用于 Amazon 竞品动态跟踪场景，监测价格、排名、评价、库存、促销、内容变更和广告信号，输出异常提醒与应对动作。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon竞品监控"
platforms: ["amazon"]
sceneTags: ["pricing-profit", "advertising-growth", "customer-voice", "inventory-supply-chain", "analytics-automation"]
searchTags: ["amazon", "pricing-profit", "advertising-growth", "customer-voice", "inventory-supply-chain", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-amazon-competitor-monitor"
originKind: "external-listing"
---

# amazon-competitor-monitor

## 适用场景与边界
用于持续跟踪核心竞品动态，解释销量或广告波动，并及时调整价格、内容、库存和广告。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集竞品 ASIN、类目、价格、coupon、rating、review、BSR、库存迹象、A+、主图、广告位和监控频率。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 定义核心竞品、替代竞品和低价扰动竞品。`n2. 每日/每周记录价格、促销、评价、BSR 和内容改动。`n3. 标记大促、断货、差评爆发和新品上架。`n4. 把竞品变化与自身 sessions、CVR、广告联系起来。`n5. 输出应对动作。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
price gap、coupon、BSR movement、review velocity、rating、share of voice、Buy Box 和自身 CVR/ACOS。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
竞品监控表、异常说明、应对建议、价格/广告/内容动作和复盘。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得采集受限或个人数据；不能恶意攻击竞品。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
竞品突然降价 20% 并加 coupon，自己的 CVR 下滑。合格方案应评估毛利和差异化，不盲目跟价。

## 验证方式
每周复盘，Prime Day 等节点提高频率。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
