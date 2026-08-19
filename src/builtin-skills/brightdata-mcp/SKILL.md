---
name: "brightdata-mcp"
description: "用于 Amazon 公开页面和跨站市场资料采集场景，设计采集范围、字段、频率、失败重试和合规边界，输出结构化数据表。"
version: 0.1.0
collection: ecosystem
displayName: "公开电商数据采集"
platforms: ["amazon"]
sceneTags: ["brand-compliance", "analytics-automation"]
searchTags: ["amazon", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-brightdata-mcp"
originKind: "external-listing"
---

# brightdata-mcp

## 适用场景与边界
用于采集公开电商页面、SERP、竞品价格或内容样本，并将结果用于研究。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集目标 URL、字段、国家、频率、样本量、代理/浏览器需求、预算、合规限制和输出格式。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 确认数据公开且允许采集。`n2. 定义字段和样本范围。`n3. 控制频率、成本和失败重试。`n4. 抽样校验字段准确。`n5. 输出结构化数据和日志。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
success rate、field accuracy、cost per record、block rate、freshness。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
采集计划、字段字典、运行参数、质量报告和风险说明。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得绕过登录、验证码或采集个人敏感数据。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
采集竞品价格应记录币种、促销和时间，否则无法比较。

## 验证方式
抽样复核 10%，监控失败率。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
