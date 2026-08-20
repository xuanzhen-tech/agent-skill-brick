---
name: "amazon-sp-mcp"
description: "用于 Amazon 经营数据读取和权限控制场景，规划订单、商品、库存与报表数据请求，输出字段清单、调用计划和审计记录。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon SP数据调用"
platforms: ["amazon"]
sceneTags: ["inventory-supply-chain", "store-operations", "analytics-automation"]
searchTags: ["amazon", "inventory-supply-chain", "store-operations", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-amazon-sp-mcp"
originKind: "external-listing"
---

# amazon-sp-mcp

## 适用场景与边界
用于通过 MCP/工具安全调用 Amazon Selling Partner API 获取运营数据。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 SP-API 授权、角色权限、目标 endpoint、seller/marketplace、请求参数、速率限制、输出字段和存储位置。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 明确业务问题和所需 API。`n2. 使用最小权限和安全凭据。`n3. 处理分页、限流、重试和错误。`n4. 标准化输出字段。`n5. 记录调用日志和数据保留。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
API success、latency、rate limit、data completeness、error rate、permission scope。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
调用计划、字段字典、错误处理、输出文件和审计记录。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得暴露 token、读取无关买家数据或违反 SP-API 条款。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
只需要库存，不应申请订单买家信息权限。

## 验证方式
每次调用后校验字段完整和错误日志。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
