---
name: "tiktok-shop-trending-products"
description: "用于 TikTok Shop 热门趋势品发现、跟进或试销节奏规划场景，识别热视频信号、搜索热词、达人动作和供应链可行性，输出趋势品清单与验证优先级。"
version: 0.1.0
collection: ecosystem
displayName: "TikTok Shop 趋势品发现"
platforms: ["tiktok-shop"]
sceneTags: ["inventory-supply-chain"]
searchTags: ["tiktok-shop", "inventory-supply-chain"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-tiktok-shop-trending-products"
originKind: "template"
---

# tiktok-shop-trending-products

## 适用场景与边界
用于捕捉 TikTok Shop 潜在爆品，同时避免追高、侵权和供应链不可控。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集热视频、话题、评论需求、竞品销量迹象、供应商、成本、认证、达人内容、搜索趋势和平台限制。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 识别趋势阶段：萌芽、增长、拥挤、衰退。`n2. 看评论是否有真实购买意图和痛点。`n3. 验证供应链、质量、认证和利润。`n4. 小批量上架和内容测试。`n5. 设退出条件。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
trend velocity、content saturation、product clicks、CVR、supplier lead time、refund risk、margin。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
趋势观察表、机会评分、供应商验证、内容角度、试销计划和退出条件。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得追侵权 IP、假冒产品或认证不明商品。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
某解压玩具热视频多但评论集中问安全材质。合格方案应先确认材料认证和年龄标签，再试销。

## 验证方式
7/14 天看内容点击和订单，30 天判断扩量或退出。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
