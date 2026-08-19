---
name: "bsc-amazon-opc-agent-os"
description: "用于 Amazon 运营流程统筹场景，梳理选品、内容、广告、库存、利润和复盘节奏，输出可执行的经营作战计划。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon OPC运营系统"
platforms: ["amazon"]
sceneTags: ["product-research", "pricing-profit", "advertising-growth", "inventory-supply-chain", "store-operations"]
searchTags: ["amazon", "product-research", "pricing-profit", "advertising-growth", "inventory-supply-chain", "store-operations"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-amazon-opc-agent-os"
originKind: "external-listing"
---

# BSC-Amazon-OPC-Agent-OS

## 适用场景与边界
用于把 Amazon 运营动作组织成可执行的 agent/workflow 系统。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集业务目标、ASIN、数据源、任务类型、权限、负责人、触发条件、SLA、输出模板和复盘周期。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 将目标拆为选品、Listing、广告、库存、评论和合规任务。`n2. 为每类任务定义输入、输出和验收标准。`n3. 设置触发：周报、异常、上新、大促。`n4. 建人工审批点。`n5. 复盘任务完成和业务影响。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
task completion、SLA、data freshness、action impact、error rate、manual override。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
流程图、任务模板、触发规则、审批点、看板和复盘表。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不能让自动化越权执行高风险操作，如调价、删广告、投诉等。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
库存低于 14 天触发降广告任务，但需人工确认采购计划后执行。

## 验证方式
每周看任务完成和误报，月度看业务影响。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
