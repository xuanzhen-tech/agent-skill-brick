---
name: "tiktok-shop-compliance"
description: "用于 TikTok Shop 上架、内容投放、达人话术或违规申诉场景，核查类目资质、禁限售、商品声明和履约要求，输出合规风险清单与整改动作。"
version: 0.1.0
collection: ecosystem
displayName: "TikTok Shop 合规"
platforms: ["tiktok-shop"]
sceneTags: ["advertising-growth", "brand-compliance"]
searchTags: ["tiktok-shop", "advertising-growth", "brand-compliance"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-tiktok-shop-compliance"
originKind: "template"
---

# tiktok-shop-compliance

## 适用场景与边界
用于上架被拒、内容违规、达人话术风险、商品被限流或店铺健康下降。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集类目、资质、商品页、视频/直播脚本、达人内容、违规通知、申诉材料、认证、商标和售后记录。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 按商品、内容、达人、履约、售后分类违规。`n2. 对 claim 做证据检查，删除不可证明表述。`n3. 建立禁用词和素材规则。`n4. 准备申诉证据：资质、截图、批次、检测报告。`n5. 复盘违规根因。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
violation count、appeal success、listing approval、content rejection、refund、late dispatch、account health。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
合规风险表、禁用词、资质缺口、内容审核清单、申诉材料和整改计划。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得指导规避审核或伪造证明。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
减肥产品视频说 7 天瘦 10 斤。合格方案应标记高风险，改为合规使用场景和真实成分说明。

## 验证方式
每周看违规和申诉，新增素材上线前抽检。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
