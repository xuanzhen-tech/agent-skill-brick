---
name: "ecom-details-image"
description: "用于 Amazon 商品图片与详情视觉优化场景，评估卖点表达、场景图、尺寸信息、对比图和合规风险，输出图片改版清单。"
version: 0.1.0
collection: ecosystem
displayName: "电商详情图优化"
platforms: ["amazon"]
sceneTags: ["listing-content", "brand-compliance"]
searchTags: ["amazon", "listing-content", "brand-compliance"]
legacyEcosystemId: "hikari0511-awesome-amazon-ec-skills-ecom-details-image"
originKind: "external-listing"
---

# ecom-details-image

## 适用场景与边界
用于设计或审查商品详情图，解决买家不理解尺寸、材质、功能或使用场景的问题。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集商品卖点、尺寸、材质、使用方法、竞品图、差评、Q&A、退货原因、平台图片规则和品牌素材。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 按购买疑虑设计图片顺序。`n2. 首图合规，副图解释场景、尺寸、功能和包装。`n3. 用对比、步骤、证据图支撑卖点。`n4. 移动端检查文字可读。`n5. 上线后看转化和退货。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
CTR、CVR、refund reason、Q&A repeats、image engagement、ad performance。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
图片 brief、顺序建议、文案、素材缺口、合规风险和复盘。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
不得用虚假对比、无证据认证或侵权素材。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
买家问是否防水。合格方案应增加使用场景和防水等级证据图。

## 验证方式
14/30 天看 CVR、退货和问答。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
