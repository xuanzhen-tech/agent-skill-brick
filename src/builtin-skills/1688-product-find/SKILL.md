---
name: "1688-product-find"
description: "用于 Amazon 新品开发和1688货源初筛场景，评估供需匹配、成本结构、认证要求、FBA尺寸重量和竞品价格，输出候选货源评分与开发建议。"
version: 0.1.0
collection: ecosystem
displayName: "1688选品评估"
platforms: ["amazon"]
sceneTags: ["product-research", "pricing-profit"]
searchTags: ["amazon", "product-research", "pricing-profit"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-1688-product-find"
originKind: "external-listing"
---

# 1688-product-find

## 适用场景与边界
用于从 1688 寻找可在 Amazon 销售的候选产品，并排除低质、侵权、认证不明或利润不可持续的货源。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 Amazon 竞品 ASIN、目标售价、1688 链接、MOQ、阶梯价、材质、尺寸重量、认证、包装、供应商年限和样品成本。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 先用 Amazon 需求和竞品价格定义目标成本。`n2. 在 1688 搜索同款、相似款和可差异化款。`n3. 核对尺寸重量、材质、包装和认证，不只看出厂价。`n4. 计算到 FBA 的总成本和毛利。`n5. 订样并做质量、包装和差异化评估。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
到岸成本、FBA fee、毛利率、MOQ、供应商响应、样品合格率、竞品评分和退货风险。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
候选货源表、成本模型、供应商评分、样品检查项、风险清单和是否进入开发的建议。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得采购侵权、假冒、认证不明或安全风险产品。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
看到 Amazon 热卖收纳袋，1688 单价低。合格输出应加上头程、FBA、包装、退货和竞品价格，判断是否仍有利润。

## 验证方式
样品通过后再做小批量；上线 30/60 天复盘退货和利润。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
