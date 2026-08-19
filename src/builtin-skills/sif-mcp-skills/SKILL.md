---
name: "sif-mcp-skills"
description: "用于 Amazon 关键词和搜索意图数据处理场景，规范采集、清洗、聚类、评分和输出格式，输出可复用SIF分析结果。"
version: 0.1.0
collection: ecosystem
displayName: "SIF数据流程"
platforms: ["amazon"]
sceneTags: ["listing-content", "analytics-automation"]
searchTags: ["amazon", "listing-content", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-sif-mcp-skills"
originKind: "external-listing"
---

# sif-mcp-skills

## 适用场景与边界
用于把 SIF 相关 Amazon 关键词、广告、评论和选品工具通过 MCP 串联。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 MCP 工具列表、输入输出 schema、数据源、权限、任务顺序、错误处理和目标报告。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 定义每个工具的边界。`n2. 统一 ASIN、关键词和时间字段。`n3. 编排采集、清洗、分析和导出。`n4. 设置人工复核点。`n5. 记录运行日志。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
pipeline success、schema compatibility、data completeness、manual review rate。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
工具链设计、字段标准、运行步骤、错误处理和输出模板。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得让工具越权调用敏感数据或自动执行高风险动作。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
关键词库构建应先清洗再评分，不能直接把抓取词写入 Listing。

## 验证方式
每次运行后校验字段和样本。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
