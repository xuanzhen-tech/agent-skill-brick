---
name: "amazon-operations-analysis-dashboard"
description: "用于 Amazon 店铺日常经营复盘场景，汇总流量、转化、广告、库存、利润和评价指标，输出经营诊断看板与优先级行动项。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon运营分析看板"
platforms: ["amazon"]
sceneTags: ["pricing-profit", "advertising-growth", "customer-voice", "inventory-supply-chain", "store-operations", "analytics-automation"]
searchTags: ["amazon", "pricing-profit", "advertising-growth", "customer-voice", "inventory-supply-chain", "store-operations", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-amazon-operations-analysis-dashboard"
originKind: "external-listing"
---

# Amazon-Operations-Analysis-Dashboard

## 适用场景与边界
用于搭建 Amazon 周/月度运营看板，统一业务口径和行动。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 Business Reports、Ads、Inventory、FBA fees、returns、reviews、pricing、Buy Box、account health 和成本。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 定义 GMV、净销售、贡献毛利、TACOS、库存覆盖等口径。`n2. 按 ASIN、父体、类目和站点分层。`n3. 建异常检测：断货、CVR 下滑、ACOS 异常、差评。`n4. 输出每周动作。`n5. 保留历史趋势。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
sessions、CVR、sales、TACOS、margin、OOS、refund、review、Buy Box、IPI。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
看板字段、数据源、异常规则、周报模板和行动清单。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不要混用不同时间、币种和归因；财务数据需控权。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
销售下降但 sessions 正常，CVR 下跌。合格分析应查价格、评价、Buy Box 和竞品促销。

## 验证方式
每周复盘动作，月度校验口径。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
