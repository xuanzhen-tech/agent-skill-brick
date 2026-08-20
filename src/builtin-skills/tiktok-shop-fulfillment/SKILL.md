---
name: "tiktok-shop-fulfillment"
description: "用于 TikTok Shop 发货 SLA、仓配容量或延迟风险管理场景，检查仓配作业、物流追踪、取消率和包材质检，输出履约改进清单与旺季保障计划。"
version: 0.1.0
collection: ecosystem
displayName: "TikTok Shop 履约"
platforms: ["tiktok-shop"]
sceneTags: ["inventory-supply-chain", "brand-compliance"]
searchTags: ["tiktok-shop", "inventory-supply-chain", "brand-compliance"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-tiktok-shop-fulfillment"
originKind: "template"
---

# tiktok-shop-fulfillment

## 适用场景与边界
用于发货延迟、取消率高、物流投诉、仓库/3PL 配合差或直播爆单后履约失控。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集订单量、仓库、3PL、处理时间、库存、拣货、打包、承运商、tracking、延迟、取消和退货。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 按平台 SLA 设置截单和发货节奏。`n2. 核对库存和订单同步。`n3. 建立拣货、打包、质检和追踪上传流程。`n4. 对爆单商品预留人力和包材。`n5. 延迟风险及时降流或下架。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
on-time dispatch、valid tracking、cancellation、delivery time、lost package、refund 和 account health。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
履约流程、仓库 checklist、延迟预警、3PL SLA、爆单预案和复盘。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得虚假上传 tracking 或售卖无库存商品。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
直播爆单后 300 单迟发。合格方案应暂停该 SKU 放量，优先履约并调整库存阈值。

## 验证方式
每日看发货和取消，旺季按小时看风险订单。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
