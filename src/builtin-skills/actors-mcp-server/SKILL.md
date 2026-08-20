---
name: "actors-mcp-server"
description: "用于电商数据采集、清洗和报告任务标准化场景，定义输入参数、运行频率、失败处理、权限边界和输出格式，输出可复用任务规格。"
version: 0.1.0
collection: ecosystem
displayName: "电商任务流程封装"
platforms: ["amazon"]
sceneTags: ["analytics-automation"]
searchTags: ["amazon", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-actors-mcp-server"
originKind: "external-listing"
---

# actors-mcp-server

## 适用场景与边界
用于把采集、清洗、报告生成等电商任务封装为 MCP/actor 工作流。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集任务目标、输入参数、数据来源、输出格式、权限、运行频率、失败场景和下游消费方。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 定义 actor 单一职责。`n2. 设计输入 schema 和校验。`n3. 实现日志、重试、超时和输出。`n4. 设置权限和密钥管理。`n5. 写运行说明和复盘。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
run success、error rate、data completeness、runtime、cost、manual intervention。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
actor 规格、输入输出示例、错误处理、部署/运行说明和监控指标。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得采集受限数据或硬编码密钥。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
竞品价格采集 actor 应输出 URL、价格、时间和失败原因，而不是只给截图。

## 验证方式
定期检查运行成功率和样本准确性。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
