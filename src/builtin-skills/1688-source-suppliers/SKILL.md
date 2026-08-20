---
name: "1688-source-suppliers"
description: "用于 Amazon 供应链开发和备选工厂评估场景，核对资质、报价、MOQ、打样、交期、认证和验货风险，输出供应商评分表与谈判清单。"
version: 0.1.0
collection: ecosystem
displayName: "1688供应商筛选"
platforms: ["amazon"]
sceneTags: ["inventory-supply-chain", "brand-compliance"]
searchTags: ["amazon", "inventory-supply-chain", "brand-compliance"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-1688-source-suppliers"
originKind: "external-listing"
---

# 1688-source-suppliers

## 适用场景与边界
用于为 Amazon 产品开发筛选、比较和管理 1688 供应商。重点是验证供应商能否稳定交付亚马逊标准，而不是只找最低价。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集供应商链接、公司年限、主营品类、工厂/贸易商、报价、MOQ、交期、认证、样品、客服响应、历史评价和验厂/验货选项。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 建立供应商长名单并按品类匹配度筛选。`n2. 发标准 RFQ，要求材质、包装、认证、样品和交期。`n3. 比较报价结构和沟通质量。`n4. 安排样品、验货和小单测试。`n5. 建立备选供应商和质量问题处理机制。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
报价完整率、响应速度、样品合格率、准交率、缺陷率、MOQ、认证真实性和沟通成本。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
供应商评分表、RFQ 模板、样品/验货清单、谈判要点、风险分级和推荐名单。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得接受伪造认证或不透明代工来源；涉及品牌/IP 产品必须确认授权。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
一个供应商报价最低但拒绝提供材质和认证。合格建议应降级该供应商，优先选择资料完整且样品稳定者。

## 验证方式
样品、小单、大货三阶段验证；每批记录缺陷和准交。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
