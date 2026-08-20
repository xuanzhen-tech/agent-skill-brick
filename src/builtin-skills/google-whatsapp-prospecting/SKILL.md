---
name: "google-whatsapp-prospecting"
description: "用于 Amazon B2B采购、分销或合作线索拓展场景，检索公开联系人并整理沟通入口，输出潜在线索清单。"
version: 0.1.0
collection: ecosystem
displayName: "Google与WhatsApp获客"
platforms: ["amazon"]
sceneTags: ["inventory-supply-chain"]
searchTags: ["amazon", "inventory-supply-chain"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-google-whatsapp-prospecting"
originKind: "template"
---

# google-whatsapp-prospecting

## 适用场景与边界
用于跨境电商寻找批发商、分销商、门店或本地合作伙伴的公开联系方式。

该 skill 面向 Amazon 或亚马逊卖家生态工具。判断时必须把 ASIN、关键词、类目、价格、库存、FBA/FBM、广告、评论、合规和贡献毛利放在同一口径下复盘；若是工具类 skill，则必须明确输入、输出、权限、数据来源和失败处理。

## 输入信息清单
收集目标国家、品类、客户类型、关键词、排除词、语言、官网、WhatsApp 链接、联系人和外联目标。

常规业务输入包括目标站点、类目、ASIN/SKU、品牌、成本、售价、库存、广告、Search Query Performance、Business Reports、评论、竞品和时间窗口。工具类输入还应记录数据来源、字段定义、授权范围、调用频率和输出文件格式。

## 操作流程
1. 用本地语言搜索客户类型和品类。`n2. 识别官网、地图、目录和社媒中的公开 WhatsApp。`n3. 去重并评分：相关性、活跃度、地区、规模和联系方式可信度。`n4. 准备个性化首触达。`n5. 记录回复和拒绝。

所有建议都要能落到执行表：负责人、依赖数据、上线时间、观察窗口、成功标准和停止条件。

## 关键指标与判断标准
lead relevance、contact found、reply rate、bounce/invalid、conversion to meeting。

亚马逊场景必须同时看 sessions、CTR、CVR、Buy Box、BSR、organic rank、CPC、ACOS/TACOS、review、IPI、OOS、refund、contribution margin。工具类场景还要看数据完整率、字段准确率、失败率、重试成本和审计日志。

## 可执行输出
线索 CSV、来源 URL、WhatsApp 字段、评分、触达话术和风险备注。

输出应包含证据、优先级、具体动作、风险、数据缺口和复盘方式，避免只给方向性结论。

## 风险与合规
遵守反垃圾信息和隐私规则；不得批量骚扰。

不得刷单刷评、操纵排名、滥用买家数据、规避 Amazon 政策、抓取受限数据或使用侵权素材/关键词。涉及品牌备案、专利、认证、税务和产品安全时必须人工确认。

## 示例
搜索墨西哥宠物用品批发商，应使用西语词并核对官网 WhatsApp 是否公开用于销售。

## 验证方式
抽样复核线索，外联后用回复率校准。

复盘必须看主指标和副作用：利润、库存、退款、差评、广告学习和账号健康。没有达到标准时，应停止动作并保留数据记录。
