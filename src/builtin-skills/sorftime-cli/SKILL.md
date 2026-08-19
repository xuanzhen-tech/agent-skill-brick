---
name: "sorftime-cli"
description: "用于 Amazon 选品机会评分场景，分析市场容量、竞争强度、价格、评价、利润和供应风险，输出选品评分与进入建议。"
version: 0.1.0
collection: ecosystem
displayName: "SORFTIME选品评估"
platforms: ["amazon"]
sceneTags: ["product-research", "pricing-profit", "customer-voice", "brand-compliance", "analytics-automation"]
searchTags: ["amazon", "product-research", "pricing-profit", "customer-voice", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-sorftime-cli"
originKind: "external-listing"
---

# sorftime-cli

## 适用场景与边界
用于通过 Sorftime CLI 类工具处理 Amazon 选品或市场数据。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 CLI 输入文件、站点、类目、ASIN、字段定义、评分维度、输出路径和运行参数。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 校验文件格式和字段。`n2. 运行评分或分析命令。`n3. 检查异常值和缺失字段。`n4. 导出候选产品。`n5. 人工复核高分项。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
run success、field completeness、score explainability、false positive、candidate quality。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
运行步骤、字段说明、评分结果、候选清单和复核记录。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
工具高分不代表可销售；合规和供应链仍需验证。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
某 ASIN 高分但属于受限类目，应人工剔除。

## 验证方式
抽样复核候选并跟踪开发结果。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
