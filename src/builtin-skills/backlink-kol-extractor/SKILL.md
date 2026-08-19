---
name: "backlink-kol-extractor"
description: "用于外链建设、KOL 合作或竞品 PR 线索挖掘场景，从反链、测评文章、联盟站和媒体页面筛选相关主体，输出线索评分、联系字段与外联角度。"
version: 0.1.0
collection: ecosystem
displayName: "反链与 KOL 线索提取"
platforms: ["cross-platform"]
sceneTags: ["store-operations"]
searchTags: ["cross-platform", "store-operations"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-backlink-kol-extractor"
originKind: "template"
---

# backlink-kol-extractor

## 适用场景与边界
用于从竞品 backlink、测评文章、礼品指南、联盟内容和社媒页面中提取可外联的 KOL、媒体和合作伙伴线索。目标是找到与品类和购买场景匹配的合作对象，而不是堆积低质量外链。

## 输入信息清单
需要竞品域名或商品 URL、目标国家、品类关键词、排除域名、合作目标、已有媒体/KOL 名单，以及可选的 backlink export、SERP 结果、Ahrefs/Semrush/Moz 导出或人工采集表。

## 提取流程
1. 清洗 URL，去除电商平台、优惠券垃圾站、镜像站和低相关目录页。
2. 按来源分类：测评文章、best list、gift guide、论坛、播客、YouTube、联盟站、新闻媒体和资源页。
3. 提取主体：站点、作者、栏目、文章标题、发布时间、提到的竞品、链接类型和联系入口。
4. 评分：相关性、近期活跃、内容质量、受众匹配、外联可能性、商业合作迹象和潜在 SEO/Referral 价值。
5. 输出可交给 contact-extractor 或外联团队的 CSV，并保留证据 URL。

## 关键指标与判断标准
关注 relevant lead rate、author/contact found rate、domain quality、内容近期性、reply rate、coverage rate、referral traffic 和合作转化。高权重但不相关的网站不应优先；只收录竞品链接但无作者和栏目语境的线索价值有限。

## 可执行输出
字段建议：source_url、domain、page_type、author、mentioned_competitor、niche、country、fit_score、contact_url、email_candidate、pitch_angle、risk_note。另输出不建议外联名单和原因。

## 风险与合规
不得购买垃圾外链、批量评论 spam、伪造身份或绕过网站条款采集私人数据。外联必须遵守反垃圾邮件和隐私规则，赞助、联盟和样品合作需要披露。

## 示例
分析竞品宠物饮水机反链时，发现多个 “best cat water fountain” 测评页。合格输出应提取作者、栏目、最近更新时间、竞品提及角度和自己的可替代 pitch，而不是只给域名列表。

## 验证方式
抽样复核前 30 条线索，确认页面真实相关且仍活跃；外联后记录回复率、报道、链接质量和 referral 订单。如果回复率低，重新调整评分和 pitch angle。
