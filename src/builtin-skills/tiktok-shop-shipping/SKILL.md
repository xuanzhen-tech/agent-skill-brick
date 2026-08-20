---
name: "tiktok-shop-shipping"
description: "用于 TikTok Shop 配送时效、包邮门槛、跨境物流或买家预期管理场景，评估物流方式、tracking、成本和履约指标，输出配送策略与异常处理清单。"
version: 0.1.0
collection: ecosystem
displayName: "TikTok Shop 配送策略"
platforms: ["tiktok-shop"]
sceneTags: ["pricing-profit", "customer-voice", "inventory-supply-chain", "cross-platform"]
searchTags: ["tiktok-shop", "pricing-profit", "customer-voice", "inventory-supply-chain", "cross-platform"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-tiktok-shop-shipping"
originKind: "template"
---

# tiktok-shop-shipping

## 适用场景与边界
用于配送慢、物流投诉、包邮亏损、跨境时效不稳定或大促履约风险。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集仓库、承运商、运费、配送国家、处理时间、tracking、延迟、丢件、退货和商品毛利。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 按国家和商品设置配送模板。`n2. 计算包邮门槛和运费补贴。`n3. 明确处理时间和预计送达。`n4. 对跨境订单设置客服预期管理。`n5. 监控承运商表现。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
on-time dispatch、delivery time、tracking valid、shipping cost、refund、complaint、margin。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
配送方案、运费模型、承运商对比、买家通知、异常处理和复盘。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得虚假本地发货或承诺不可控时效。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
跨境小包平均 12 天，页面写 3-5 天。合格方案应修改承诺或改本地仓。

## 验证方式
每周看物流投诉和时效，活动期每日监控。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
