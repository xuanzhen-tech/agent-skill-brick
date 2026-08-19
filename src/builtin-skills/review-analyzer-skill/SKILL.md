---
name: "review-analyzer-skill"
description: "用于 Amazon 评论复盘和产品改良场景，聚合买家反馈、差评原因、功能诉求和竞品对比，输出VOC报告与优先级建议。"
version: 0.1.0
collection: ecosystem
displayName: "评论洞察分析"
platforms: ["amazon"]
sceneTags: ["customer-voice", "analytics-automation"]
searchTags: ["amazon", "customer-voice", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-review-analyzer-skill"
originKind: "external-listing"
---

# review-analyzer-skill

## 适用场景与边界
用于使用评论分析类工具处理 Amazon 或竞品评论，生成 VOC 报告。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集评论 CSV/JSON、ASIN、字段映射、语言、星级、时间、变体和分析目标。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 校验字段和编码。`n2. 去除重复、空文本和噪声。`n3. 聚类主题并抽样人工复核。`n4. 输出高频痛点、好评卖点和风险。`n5. 将结果转给产品、Listing 或客服。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
parse success、theme precision、coverage、manual correction rate、actionability。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
字段映射、主题报告、样本证据、修复建议和复核记录。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不能把自动聚类当最终事实；不得输出买家隐私。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
工具把 “small” 都归为负面，但饰品小巧可能是好评。合格流程需要人工抽样校正。

## 验证方式
抽样 10%-20% 复核，观察行动后指标。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
