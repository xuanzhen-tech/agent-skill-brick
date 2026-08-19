---
name: "warehouse-optimization"
description: "用于 Amazon 仓储成本和库存周转优化场景，分析库龄、体积、销量、补货节奏和清仓策略，输出仓储优化建议。"
version: 0.1.0
collection: ecosystem
displayName: "仓储优化"
platforms: ["amazon"]
sceneTags: ["pricing-profit", "inventory-supply-chain", "analytics-automation"]
searchTags: ["amazon", "pricing-profit", "inventory-supply-chain", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-warehouse-optimization"
originKind: "template"
---

# warehouse optimization：Amazon 供应链、库存与仓储

面向 Amazon 跨境卖家的供应链、库存与仓储知识沉淀，围绕 warehouse-optimization 提供可执行分析流程、关键指标、输出模板和合规边界。

## 适用场景与边界

适用于 Amazon 卖家围绕 供应链、库存与仓储 做诊断、规划和复盘。可处理单个 ASIN、父子变体、SKU 组合或类目节点层面的运营问题，并把 Listing、广告、库存、价格、评论和品牌资产放在同一个 Amazon 经营语境下判断。

边界：输出经营分析和执行建议，不替代 Seller Central 后台数据、Amazon 官方费用表、法律意见或平台最终裁定。

## 输入信息清单

- 主题输入：SKU/ASIN、供应商产能、MOQ、生产周期、质检周期、头程方式、FBA 入仓、海外仓/3PL、FBM、销量预测、IPI、库容限制和季节性峰值。
- Amazon 基础上下文：站点、ASIN、SKU、父子变体、FBA/FBM、Buy Box 状态、类目节点、BSR、库存天数、IPI 和补货周期。
- 可选数据：Search Query Performance、ABA、广告搜索词报告、Business Reports、Brand Registry 记录、评论、退货明细和库存报告。

## 分析流程

1. 明确目标：提升 CTR/CVR、降低 ACOS/TACOS、保护 Buy Box、改善库存周转、处理评论风险或建立增长策略。
2. 建立基线：核对 ASIN、变体、类目节点、价格、库存、配送方式、评论星级、关键词排名和广告状态。
3. 执行主题分析：按销量和补货周期计算安全库存；比较海运、空运、海外仓中转和 FBM 应急；把断货损失、仓储费、IPI 和现金占用放进同一决策表。
4. 排序动作：按影响范围、执行成本、合规风险、依赖资源和验证周期给出优先级。
5. 设定复盘：广告和价格看 3-7 天，Listing 和 SEO 看 2-4 周，供应链和评论问题按补货或产品迭代周期复盘。

## 关键指标与判断标准

- 主题指标：Buy Box 赢得率、CTR、CVR、ACOS、TACOS、ROAS、BSR、关键词排名、评论星级、FBA 可售天数、IPI、库存周转和补货周期。
- 判断标准：指标必须同时看趋势和上下文；Prime Day、黑五网一、Coupon、Lightning Deal、断货、变体合并或类目节点变更都会扭曲短期表现。
- 决策标准：只有当动作能明确影响流量、转化、利润、库存或品牌风险，并能在指定窗口验证时才进入执行清单。

## 可执行输出

- 补货计划、履约方案对比、库存健康分层、清仓/移除建议和供应链风险清单。
- 一页式 Amazon 诊断摘要：当前问题、证据、影响 ASIN/SKU、建议动作、负责人、截止时间和复盘指标。
- 可落地清单：Listing 改动、广告调价/否词、价格护栏、补货动作、评论/VOC 跟进、品牌保护证据或监控规则。

## 风险与合规边界

- 必须遵守 Amazon 服务条款、买家沟通政策、评论政策、广告政策、知识产权规则和各站点合规要求。
- 不建议刷单、操纵评论、虚假折扣、滥用竞品商标、规避平台交易或采集违反规则的数据。
- 跨平台主题只提供 Amazon 适配边界，不替代对应平台的原生规则判断。

## 示例

输入：

```text
站点：Amazon US
ASIN：B0TEST1234，父体含 4 个颜色变体，FBA 发货
主题：warehouse optimization：Amazon 供应链、库存与仓储
现状：主词排名第 18，CTR 0.32%，CVR 9.5%，ACOS 34%，TACOS 12%，ROAS 2.9，评分 4.2，库存可售 24 天，IPI 465
目标：在不牺牲净利率的前提下，找出未来 30 天最优先的 3 个动作
```

输出摘要：

```text
1. 优先检查 Buy Box、库存和价格护栏，确认广告放量不会触发断货或亏损。
2. 围绕 供应链、库存与仓储 建立证据表，区分必须立即处理的问题和可实验优化项。
3. 给出 30 天动作：第 1 周修正基础问题，第 2-3 周运行广告/Listing/价格实验，第 4 周按 CTR、CVR、ACOS、关键词排名和库存周转复盘。
```

## 验证方式

- 用 Seller Central、Business Reports、Advertising Console、Brand Analytics、Search Query Performance 或库存报告核对输入数据。
- 对每个建议动作设置前后对照：改动日期、影响 ASIN、指标基线、目标值、观察窗口和回滚条件。
- 至少复盘 CTR、CVR、ACOS/TACOS、ROAS、关键词排名、Buy Box、评论星级、库存天数、IPI 和补货周期中的相关指标。
- 若结果与预期不一致，先排查断货、Buy Box 丢失、价格变化、促销结束、广告预算受限、类目节点变化和评论波动。
