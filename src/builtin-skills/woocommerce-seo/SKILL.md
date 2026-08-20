---
name: "woocommerce-seo"
description: "用于 WooCommerce 自然流量增长、商品页收录或技术 SEO 诊断场景，优化分类页、结构化数据、Core Web Vitals、插件风险和 Search Console 信号，输出修复清单、内容动作与验证指标。"
version: 0.1.0
collection: ecosystem
displayName: "WooCommerce 搜索优化"
platforms: ["woocommerce"]
sceneTags: ["listing-content", "advertising-growth", "brand-compliance", "analytics-automation"]
searchTags: ["woocommerce", "listing-content", "advertising-growth", "brand-compliance", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-woocommerce-seo"
originKind: "template"
---

# WooCommerce SEO

WooCommerce SEO 用于审计和提升自建 WordPress + WooCommerce 店铺的自然搜索流量质量。它关注的不只是“写关键词”，而是把技术 SEO、商品信息架构、结构化数据、页面速度、插件风险、内容集群和订单转化放在同一个诊断框架里。

## 适用场景与边界
适用于以下场景：
- WooCommerce 店铺已有商品页和分类页，但 Google 自然流量少、排名不稳定或点击率低。
- Search Console 显示有曝光但 CTR 偏低，需要重写 title、meta description 和 rich result 展示信息。
- 商品页可被索引，但 Product schema、Review schema、Breadcrumb 或 Merchant listing 信息不完整。
- 分类页、标签页、筛选参数页造成重复内容、索引膨胀或 crawl budget 浪费。
- WooCommerce 插件、主题、页面构建器或缓存配置影响 Core Web Vitals 和移动端转化。
- 跨境独立站需要为多语言、多币种、多市场 SEO 建立稳定规则。

不适用于以下场景：
- 希望通过黑帽外链、隐藏文本、关键词堆砌或伪造结构化数据快速排名。
- 没有 Search Console、GA4、站点后台权限，无法验证索引、流量和转化数据。
- 需要法律、税务、医疗功效、商标侵权等专业结论；这里只能给出 SEO 与合规风险提示。

## 输入信息清单
开展审计前，至少需要收集：
- 站点基础：域名、目标国家、语言、币种、WordPress 版本、WooCommerce 版本、主题、主 SEO 插件、缓存/CDN 插件。
- 商品结构：核心品类、主推 SKU、商品 URL、分类页 URL、标签页、筛选参数、变体规则、库存状态。
- Search Console：近 28/90 天 queries、pages、clicks、impressions、CTR、average position、indexing、sitemaps、manual actions。
- GA4 / WooCommerce：organic sessions、product view、add to cart、checkout、purchase、AOV、CVR、refund rate。
- 技术 SEO：robots.txt、XML sitemap、canonical、noindex、hreflang、schema、404/301、分页、站内搜索索引规则。
- 页面性能：Core Web Vitals、LCP、INP、CLS、图片体积、字体加载、第三方脚本、移动端首屏加载。
- 竞品样本：3-5 个排名靠前的竞品商品页或分类页，包括标题、页面结构、schema、FAQ、内容深度和内链方式。

## 分析流程
1. 先确认索引健康：检查 sitemap 是否只提交可索引页面，确认商品页、分类页、博客页是否被 Google 收录，排除 404、soft 404、redirect loop、canonical 指向错误。
2. 再检查页面类型策略：商品页负责购买型关键词，分类页负责集合型关键词，博客/指南负责信息型关键词，不让三类页面抢同一个主词。
3. 审核商品页：检查 H1、title、meta description、短描述、长描述、FAQ、图片 alt、review 展示、价格/库存/配送承诺是否支持搜索意图和购买决策。
4. 审核分类页：检查是否有独立文本、筛选项是否生成可控 URL、分页和排序参数是否避免重复索引，是否有指向高利润商品和相关指南的内链。
5. 校验结构化数据：Product schema 必须包含 name、image、description、sku、brand、offers、availability、priceCurrency；有评论时再检查 aggregateRating/review，不能伪造评分。
6. 检查速度和插件：定位 LCP 图片、未压缩资源、阻塞 JS/CSS、页面构建器冗余 DOM、聊天/追踪脚本、缓存排除规则和支付页误缓存。
7. 形成路线图：把问题分为 P0 技术阻断、P1 页面改写、P2 内容集群、P3 外部权威建设，并给每项设置验证指标。

## 关键指标与判断标准
核心指标：
- Search Console：impressions、clicks、CTR、average position、indexed pages、excluded pages。
- GA4/WooCommerce：organic sessions、organic CVR、AOV、revenue、add-to-cart rate、checkout completion、refund rate。
- 技术指标：LCP、INP、CLS、mobile usability、schema valid items、404 数量、重定向链长度。
- 商品指标：库存可售、价格竞争力、评分、评论数量、退货率、贡献毛利。

判断标准：
- impressions 高但 CTR 低，优先优化 title、meta description、价格/评分 rich result、品牌可信度和搜索意图匹配。
- average position 在 8-20 且页面内容薄，优先补充商品对比、使用场景、FAQ、尺寸/材质/兼容性信息和内链。
- clicks 增长但 organic CVR 下降，说明流量意图偏弱或页面承接不匹配，不能只继续扩词。
- index 数量异常增长，优先排查筛选参数、标签页、站内搜索页、分页和重复商品变体。
- LCP 超过 2.5s 或 INP 偏高，优先处理首图、缓存、第三方脚本和页面构建器冗余，而不是继续写新内容。
- schema 有错误时，先修复真实商品数据和插件输出，不要手写虚假 rating、review 或 availability。

## 可执行输出
一次合格的 WooCommerce SEO 输出应包含：
- 技术 SEO 阻断清单：索引、canonical、sitemap、robots、schema、404/301、hreflang、分页和参数页。
- 商品页改写方案：每个目标页给出 title、meta description、H1、短描述、FAQ、图片 alt 和内链建议。
- 分类页优化方案：分类页说明文案、筛选索引规则、核心商品排序、相关指南和上/下级分类内链。
- Schema 修复表：当前 schema 字段、缺失字段、数据来源、插件配置位置和验证工具链接。
- 性能优化清单：LCP 图片、缓存策略、CDN、图片格式、延迟加载、第三方脚本和移动端首屏问题。
- 内容集群路线图：购买指南、对比页、how-to、FAQ、材质/尺码/兼容性专题，并标明对应商品页或分类页。
- 复盘表：基线日期、目标 URL、目标关键词、预期指标、观察周期、负责人和回滚条件。

## 风险与合规边界
- 不使用关键词堆砌、隐藏文本、门页、批量低质 AI 内容、伪造评论、虚假库存或虚假折扣。
- Product/Review schema 必须来自页面真实可见内容；没有真实评论时不能输出 aggregateRating。
- 医疗、美妆、儿童、食品、电子电器等品类要额外检查功效、认证、年龄、材质、安全声明和当地法规。
- 插件安装前必须检查维护状态、权限、性能影响和兼容性；不要为了 SEO 安装多个功能重叠的插件。
- 支付页、购物车、用户账户页不要被缓存或索引；隐私政策、cookie consent 和邮件订阅必须符合目标市场要求。

## 示例
输入：
```text
站点：美国市场 WooCommerce 独立站
品类：organic cotton baby blanket
问题：商品页排名 12-18，有曝光但 CTR 只有 0.7%，移动端 LCP 4.1s
数据：Search Console 90 天 queries/pages，GA4 organic CVR 0.9%，WooCommerce 退货率 4%，3 个竞品页面
现状：Product schema 缺 aggregateRating，分类页无独立文案，筛选参数被索引
```

输出摘要：
```text
P0 技术修复：
1. 将颜色/尺寸筛选参数设为 noindex 或 canonical 到主分类页，避免重复索引。
2. 修复 Product schema 的 offers、availability、priceCurrency；没有真实评论时不添加 aggregateRating。
3. 压缩首屏 hero 图片到 WebP/AVIF，延迟加载非首屏图片，目标 LCP < 2.5s。

P1 页面改写：
1. title 改为 “Organic Cotton Baby Blanket | Breathable Muslin Blanket for Newborns”。
2. meta description 强调材质、适用年龄、尺寸、配送和退换承诺。
3. 商品页新增 FAQ：材质认证、清洗方式、适用季节、礼盒包装、配送时效。

P2 内容集群：
1. 写 “Organic Cotton vs Bamboo Baby Blanket” 对比页，链接到目标分类和 3 个主推 SKU。
2. 写 “How to Choose a Baby Blanket for Summer” 指南，承接信息型长尾词。

验证：
第 14 天看 LCP、索引覆盖和 schema；第 30 天看 CTR、average position、organic CVR；第 60 天看自然订单和贡献毛利。
```

## 验证方式
- 技术验证：Search Console indexing、Rich Results Test、Schema Markup Validator、PageSpeed Insights、Lighthouse、日志或爬虫检查。
- 流量验证：对比目标 URL 修改前后 28/30 天的 impressions、CTR、average position 和 organic clicks。
- 转化验证：在 GA4 和 WooCommerce 中只看 organic traffic 的 product view、add to cart、checkout、purchase、AOV 和 refund rate。
- 内容验证：检查目标关键词是否由正确页面承接，避免商品页、分类页和博客互相抢词。
- 停止条件：如果曝光增长但 CVR、退款率或客服投诉变差，应暂停扩展内容，回到搜索意图和页面承接诊断。
