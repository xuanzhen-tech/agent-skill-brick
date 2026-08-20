---
name: "skill-creator"
description: "用于 Amazon 运营知识沉淀和流程模板化场景，梳理适用场景、输入、步骤、指标和输出要求，输出结构化技能草案。"
version: 0.1.0
collection: ecosystem
displayName: "技能模板生成"
platforms: ["amazon"]
sceneTags: ["store-operations"]
searchTags: ["amazon", "store-operations"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-skill-creator"
originKind: "external-listing"
---

# skill-creator

## 适用场景与边界
用于创建新的跨境电商 agent skill，使其从模板变成可复用的专家操作手册。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集 skill 目标、平台、用户场景、原始知识、输入数据、输出格式、指标、合规风险和示例案例。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 定义触发场景和非适用场景。`n2. 写清必须输入和缺失数据处理。`n3. 给出操作流程、判断标准和交付物。`n4. 加入平台规则和风险边界。`n5. 用真实案例和验证方式收尾。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
content specificity、actionability、coverage、risk clarity、example quality、verification。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
skill 正文、frontmatter description、示例、校验清单和改进建议。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得生成空泛模板或把未知事实写成确定规则。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
WooCommerce SEO 不能只写“优化标题”，应写 Search Console、schema、Core Web Vitals 和页面类型。

## 验证方式
逐项审查正文是否能指导实际运营。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
