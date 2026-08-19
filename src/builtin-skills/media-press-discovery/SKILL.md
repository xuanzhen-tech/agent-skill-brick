---
name: "media-press-discovery"
description: "用于新品发布、测评邀约或 PR 传播前的媒体线索发现，按品类相关性、近期活跃度、栏目匹配和合作价值筛选目标，输出媒体清单、联系人线索与 pitch 角度。"
version: 0.1.0
collection: ecosystem
displayName: "媒体与新闻线索发现"
platforms: ["cross-platform"]
sceneTags: ["store-operations"]
searchTags: ["cross-platform", "store-operations"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-media-press-discovery"
originKind: "template"
---

# media-press-discovery

## 适用场景与边界
用于为跨境电商品牌寻找可投稿、测评、新闻报道、礼品指南或播客采访的媒体线索。目标是得到可评估、可触达、与品类相关的媒体清单，而不是泛泛搜索网站。

不用于刷外链、购买垃圾新闻稿或冒充记者。媒体合作必须尊重编辑独立性和披露要求。

## 输入信息清单
- 品牌与产品：品类、价格带、目标市场、差异点、认证、素材包、上线节点。
- PR 目标：新品发布、节日礼品指南、专家背书、测评、品牌故事或 SEO/Referral。
- 搜索线索：关键词、竞品报道、作者名、媒体类型、国家、语言和时间窗口。

## 发现流程
1. 定义媒体类型：行业媒体、测评博客、礼品指南、地方媒体、播客、YouTube 媒体或垂直社区。
2. 用竞品反查：搜索竞品品牌名 + review、gift guide、best、interview、press，找已报道该类目的作者。
3. 判断相关性：看栏目、最近更新时间、是否接受投稿/样品、受众匹配和过往商业披露。
4. 提取联系人：优先作者页和 media kit，再到 contact 页面，不把广告销售邮箱和编辑邮箱混用。
5. 评分排序：按相关性、权威度、触达可能性、内容形式、时效性和潜在业务价值排序。

## 关键指标与判断标准
关注 relevant lead rate、contact found rate、reply rate、coverage rate、referral traffic、earned link quality 和转化贡献。高 DA 但不相关的媒体不应优先于垂直小媒体。

如果媒体长期只发付费新闻稿或垃圾外链，应该降低优先级；如果作者近期持续覆盖同类产品且有真实测评，应优先。

## 可执行输出
输出 media_name、url、author、beat、recent_article、contact_url、email、lead_type、fit_score、pitch_angle、asset_needed、risk_note。另附 3-5 个可用 pitch angle。

## 风险与合规
不得编造销量、认证、奖项或用户评价。样品、佣金、赞助和联盟链接需要按当地规则披露。

## 示例
一个宠物用品品牌想进节日礼品指南。应优先找过去 12 个月发布 pet gift guide 的编辑，记录栏目和投稿截止时间，并准备高清图、价格、购买链接、折扣码和样品寄送条件。

## 验证方式
人工复核前 30 条线索的相关性和联系人准确性；外联后记录回复、报道、链接和 referral 表现。若回复率低，检查 pitch angle 是否与栏目和作者近期内容匹配。
