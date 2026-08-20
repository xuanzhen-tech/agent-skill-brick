---
name: "ebay-seo"
description: "用于 eBay 自然搜索排名提升或刊登转化诊断场景，优化标题关键词、item specifics、类目匹配和 Best Match 信号，输出页面改稿、验证指标与复盘节奏。"
version: 0.1.0
collection: ecosystem
displayName: "eBay 搜索优化"
platforms: ["ebay"]
sceneTags: ["listing-content"]
searchTags: ["ebay", "listing-content"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-ebay-seo"
originKind: "template"
---

# eBay SEO

## 适用场景与边界
适用于 eBay 固定价或拍卖刊登曝光不足、Best Match 排名弱、item specifics 不完整、标题点击率低、Promoted Listings 有点击但自然排名没有提升的场景。它不适合处理违规上架、仿牌、错误 item condition 或物流承诺无法履约的问题；这些必须先修正平台合规和卖家指标。

## 输入信息清单
需要提供刊登 URL、站点、类目、标题、subtitle、item specifics、condition、价格、运费、退货政策、handling time、库存、近 30 天 impressions/clicks/watchers/sales、Promoted Listings 报表、3-5 个竞品刊登和目标关键词。

## 分析流程
1. 核对类目与 condition，确保买家筛选时能被正确召回。
2. 拆解标题前 60-80 字符：品牌、核心品类、型号、规格、兼容性、数量和状态是否按买家搜索顺序出现。
3. 检查 item specifics 完整度，优先补齐 eBay 推荐属性和买家常用筛选项。
4. 对比竞品图片、价格、运费、退货承诺、seller level 和 estimated delivery。
5. 将 Promoted Listings 的高转化搜索词回填到标题、specifics 和描述，不把低意图词硬塞进标题。

## 关键指标与判断标准
核心指标是 impressions、CTR、sales conversion rate、watchers、Promoted Listings ROAS、Best Match 位置、seller level、defect rate、late shipment rate。曝光高 CTR 低，优先重写标题首段和主图；CTR 高但转化低，优先看价格、运费、预计送达、退货政策和 seller trust；自然曝光下降但广告点击增加，说明自然 SEO 没有被同步修复。

## 可执行输出
输出标题改写方案、item specifics 补全表、类目/condition 修正建议、图片顺序建议、Promoted Listings 与自然 SEO 联动动作、低效关键词排除清单和 14/30 天复盘表。

## 风险与合规边界
不得关键词堆砌、把不兼容型号写进标题、误导 condition、复制竞品图片或使用侵权品牌词。跨境刊登必须保证 handling time、退货地址、关税说明和物流时效真实。

## 示例
输入：eBay US 二手相机镜头刊登，标题为 “Canon Lens Good Condition”，impressions 高但 CTR 0.4%。输出：标题改为 “Canon EF 50mm f/1.8 STM Lens for EOS DSLR - Tested, Clean Glass”，补齐 focal length、mount、maximum aperture、compatible brand，主图改为正面+接口+成色瑕疵，退货承诺调整为 30 days。

## 验证方式
第 7 天看 CTR、watchers、Promoted Listings 点击质量；第 30 天看 sales conversion、自然 impressions、广告 ROAS 和退货原因。若 CTR 提升但退货增加，说明标题或图片承诺过度，需要回滚。
