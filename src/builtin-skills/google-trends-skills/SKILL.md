---
name: "google-trends-skills"
description: "用于 Amazon 站外需求趋势判断场景，分析关键词热度、季节性、区域变化和品类关联，输出趋势解读与选品提示。"
version: 0.1.0
collection: ecosystem
displayName: "Google Trends趋势分析"
platforms: ["amazon"]
sceneTags: ["product-research", "listing-content", "analytics-automation"]
searchTags: ["amazon", "product-research", "listing-content", "analytics-automation"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-google-trends-skills"
originKind: "external-listing"
---

# google-trends-skills

## 适用场景与边界
用于用 Google Trends 辅助判断需求季节性、市场区域和内容选题。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集关键词组、国家、时间范围、类目、竞品、Amazon 搜索/销量证据和目标决策。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 比较多个同义词和类目词。`n2. 看地区、季节和相关查询。`n3. 与 Amazon ABA、广告、评论或销量证据交叉验证。`n4. 区分资讯热度和购买需求。`n5. 输出趋势判断。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
trend index、seasonality、regional interest、related queries、Amazon validation、decision confidence。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
趋势图解读、关键词建议、市场优先级、季节日历和验证清单。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
Trends 是相对指数，不代表销量。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
“portable fan” 夏季上升。合格方案还要验证 Amazon 竞争和 FBA 成本。

## 验证方式
按季节复盘预测准确性。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
