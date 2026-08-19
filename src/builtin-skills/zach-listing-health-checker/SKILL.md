---
name: "zach-listing-health-checker"
description: "用于 Amazon Listing上线和复盘场景，检查标题、五点、图片、A+、关键词、评价和转化障碍，输出页面修复优先级。"
version: 0.1.0
collection: ecosystem
displayName: "Listing健康检查"
platforms: ["amazon"]
sceneTags: ["listing-content", "customer-voice"]
searchTags: ["amazon", "listing-content", "customer-voice"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-zach-listing-health-checker"
originKind: "external-listing"
---

# zach-listing-health-checker

## 适用场景与边界
用于 Amazon Listing 上线前检查、转化下滑诊断或广告放量前质量评估。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 ASIN、标题、五点、描述、A+、主图/副图、属性、类目、变体、关键词、竞品、sessions、CVR 和退货原因。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 检查基础合规和类目属性。`n2. 评估关键词覆盖与标题可读性。`n3. 检查图片是否解释尺寸、使用、差异和包装。`n4. 评估 A+ 和 FAQ 是否解决异议。`n5. 输出 P0/P1/P2 修复。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
listing quality、CTR、CVR、sessions、organic rank、review、refund、suppression risk。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
健康评分、问题清单、图片/文案 brief、属性修复和复盘表。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得堆词、虚假 claim、侵权图片或违规变体。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
广告点击高但 CVR 低，检查发现主图无法判断尺寸。合格方案应补尺寸和场景图。

## 验证方式
14/30 天看 CVR、退款和广告效率。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
