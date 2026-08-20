---
name: "product-differentiation-ebay"
description: "用于 eBay 同质化竞争、低价压力或新品定位场景，基于 sold listings、feedback、condition、兼容性和物流承诺设计卖点，输出差异化方案与测试指标。"
version: 0.1.0
collection: ecosystem
displayName: "eBay 产品差异化"
platforms: ["ebay"]
sceneTags: ["listing-content", "customer-voice", "inventory-supply-chain"]
searchTags: ["ebay", "listing-content", "customer-voice", "inventory-supply-chain"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-product-differentiation-ebay"
originKind: "template"
---

# product-differentiation-ebay

## 适用场景与边界
适用于 eBay 商品同质化、价格战严重、竞品很多但买家仍抱怨兼容性、成色、缺件、物流或售后的场景。它不适合通过虚假稀缺、夸大 condition 或侵权品牌词制造差异。

## 输入信息清单
需要目标商品、竞品 active/sold listings、feedback、condition 分布、价格、运费、退货政策、配件清单、图片、供应成本、包装和物流能力。

## 分析流程
1. 从 sold listings 找出真实成交的价格和卖点。
2. 从竞品 negative/neutral feedback 提取买家不满。
3. 将差异化分为商品本体、配件捆绑、测试证明、物流速度、退货承诺和内容清晰度。
4. 计算每个差异化动作的成本和可见性。
5. 生成刊登标题、图片、描述和政策承接。

## 关键指标与判断标准
关注成交价溢价、CTR、watchers、conversion、return rate、feedback 主题和贡献毛利。差异化如果不能被标题、主图、specifics 或政策明确表达，买家通常感知不到；如果提升售价但退货上升，说明承诺不真实。

## 可执行输出
输出竞品弱点表、差异化卖点、捆绑方案、图片脚本、标题/描述改写、成本测算和验证实验。

## 风险与合规边界
不得夸大 compatibility、condition、authenticity 或 warranty；二手和翻新商品必须展示瑕疵和测试结果。品牌、型号和认证要有依据。

## 示例
输入：二手游戏手柄类目，竞品差评集中在 drift 和电池。输出：差异化为“tested no drift + new battery + 30-day returns”，主图展示测试界面和电池仓，售价可高 12%。

## 验证方式
用 30 天 A/B 或前后对比观察 CTR、成交价、退货原因和 feedback 中差异化卖点是否被提及。
