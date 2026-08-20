---
name: "zach-product-research"
description: "用于 Amazon 新品调研场景，分析市场容量、竞品结构、评价门槛、差异化空间和利润可行性，输出产品机会评估。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon产品研究"
platforms: ["amazon"]
sceneTags: ["pricing-profit", "customer-voice", "analytics-automation"]
searchTags: ["amazon", "pricing-profit", "customer-voice", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-zach-product-research"
originKind: "external-listing"
---

# zach-product-research

## 适用场景与边界
用于系统判断 Amazon 新品机会是否值得开发。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集关键词、竞品 ASIN、价格、评价、BSR、成本、供应商、认证、尺寸重量、广告密度、差评和趋势。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 验证需求和搜索意图。`n2. 评估竞争门槛：评价、品牌、广告和价格。`n3. 计算 FBA 和广告后的利润。`n4. 从 VOC 找差异化。`n5. 设计样品和小批量验证。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
demand、competition、review threshold、margin、FBA fee、ad cost、risk score。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
选品评分、竞品矩阵、利润模型、差异化假设、风险和验证计划。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
避开侵权、认证不明、危险品和受限类目。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
高需求低价电子配件若认证复杂且退货高，应降低评分。

## 验证方式
小批量上线后 30/60 天看转化、评价和利润。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
