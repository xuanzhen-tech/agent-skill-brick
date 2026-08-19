---
name: "bsc-amazon-sif-keyword-lark-builder"
description: "用于 Amazon 关键词管理和协作表建设场景，整理词根、搜索量、意图、竞品和广告表现，输出可维护关键词矩阵。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon SIF关键词表搭建"
platforms: ["amazon"]
sceneTags: ["listing-content", "advertising-growth"]
searchTags: ["amazon", "listing-content", "advertising-growth"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-amazon-sif-keyword-lark-builder"
originKind: "external-listing"
---

# BSC-Amazon-sif-keyword-lark-builder

## 适用场景与边界
用于把 Amazon 关键词研究沉淀到飞书多维表格，支持团队协作和周期更新。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集关键词、词根、ASIN、类目、ABA、广告搜索词、自然排名、负责人、动作状态和更新频率。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 设计字段：keyword、root、intent、ASIN、source、rank、SFR、ACOS、status。`n2. 导入多来源数据并去重。`n3. 建视图：待上词、广告测试、Listing 已覆盖、无效词。`n4. 分配负责人和复盘日期。`n5. 每周更新动作状态。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
field completeness、duplicate rate、update freshness、action completion、rank/ACOS change。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
飞书表结构、字段说明、视图、导入规则、协作流程和复盘模板。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
注意数据权限和广告/品牌数据保密。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
团队关键词散在 Excel。合格方案应统一字段和状态，避免重复投词。

## 验证方式
每周检查字段完整和动作完成率。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
