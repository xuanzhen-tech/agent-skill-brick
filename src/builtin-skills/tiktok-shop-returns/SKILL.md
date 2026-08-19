---
name: "tiktok-shop-returns"
description: "用于 TikTok Shop 退货率偏高、退款争议或买家预期偏差场景，分析退货原因、质量问题、物流损坏和评价反馈，输出降退货动作与商品页修复建议。"
version: 0.1.0
collection: ecosystem
displayName: "TikTok Shop 退货退款"
platforms: ["tiktok-shop"]
sceneTags: ["customer-voice", "inventory-supply-chain", "analytics-automation"]
searchTags: ["tiktok-shop", "customer-voice", "inventory-supply-chain", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-tiktok-shop-returns"
originKind: "template"
---

# tiktok-shop-returns

## 适用场景与边界
用于退款率高、退货原因集中、差评上升或利润被售后吞掉。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集退款订单、原因、商品、视频来源、达人、物流、评价、客服记录、图片证据和批次。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 分类退货：质量、描述不符、尺寸、物流、冲动购买、延迟。`n2. 找到对应内容、页面、供应链或履约根因。`n3. 优先处理安全和质量问题。`n4. 更新商品页、视频 brief 和客服。`n5. 对高风险 SKU 降流或停售。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
return rate、refund cost、negative review、case rate、defect theme、margin impact。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
退货主题表、根因分析、页面/内容修复、供应链动作、客服模板和复盘。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得拖延合理退款或诱导买家站外处理。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
某连衣裙退货多因尺码偏小。合格方案应补尺码视频、模特参数和达人话术，必要时调整版型。

## 验证方式
每周看退货主题，30 天验证修复效果。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
