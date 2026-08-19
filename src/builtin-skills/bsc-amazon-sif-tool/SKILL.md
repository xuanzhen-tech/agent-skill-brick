---
name: "bsc-amazon-sif-tool"
description: "用于 Amazon 搜索意图与关键词结构分析场景，归类词根、流量层级、转化表现和页面覆盖，输出SIF优化清单。"
version: 0.1.0
collection: ecosystem
displayName: "Amazon SIF分析工具"
platforms: ["amazon"]
sceneTags: ["listing-content", "advertising-growth", "analytics-automation"]
searchTags: ["amazon", "listing-content", "advertising-growth", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-bsc-amazon-sif-tool"
originKind: "external-listing"
---

# BSC-amazon-SIF-Tool

## 适用场景与边界
用于使用 SIF 类工具处理 Amazon 搜索、关键词、ASIN 和广告数据。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集输入文件、字段名、站点、ASIN、关键词、ABA、广告、排名、输出格式和目标。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 校验输入字段。`n2. 标准化关键词、ASIN 和时间窗口。`n3. 计算机会分和动作类型。`n4. 导出 Listing/广告/选品所需视图。`n5. 人工复核高优先级项。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
parse success、dedupe rate、score coverage、manual validation、action adoption。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
清洗结果、机会评分、动作列表、导出文件和复核记录。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
工具结果不能替代人工判断；敏感数据需控权。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
工具给某词高分但与产品不相关。合格流程应人工降级并标注原因。

## 验证方式
抽样复核，观察动作后排名和广告表现。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
