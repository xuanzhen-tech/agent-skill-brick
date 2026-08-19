---
name: "tiktok-shop-inventory"
description: "用于 TikTok Shop 爆款备货、缺货降流或库存积压处理场景，预测内容和直播需求、校准安全库存和多仓同步，输出补货计划与清库存动作。"
version: 0.1.0
collection: ecosystem
displayName: "TikTok Shop 库存管理"
platforms: ["tiktok-shop"]
sceneTags: ["inventory-supply-chain"]
searchTags: ["tiktok-shop", "inventory-supply-chain"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-tiktok-shop-inventory"
originKind: "template"
---

# tiktok-shop-inventory

## 适用场景与边界
用于 TikTok 爆款导致断货、库存同步错误、达人视频放量前备货不足或滞销清理。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集 SKU 库存、仓库、销量、内容计划、达人排期、直播排期、采购 lead time、退货回库和广告预算。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 按内容计划预测销量，不只看历史均值。`n2. 核心 SKU 设置安全库存和低库存降流。`n3. 达人/直播前锁定库存。`n4. 多仓同步和退货回库要有责任人。`n5. 滞销用内容、套装或促销处理。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
stockout rate、inventory days、sell-through、cancel due to OOS、GMV lost、overstock value。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
库存看板、备货计划、低库存规则、直播库存表、清仓方案和复盘。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得继续推广无库存或无法按时补货商品。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
达人视频排期 10 条但库存只够 3 天。合格方案应延后发布或补货，不应靠客服解释缺货。

## 验证方式
每日看核心 SKU，内容发布前后重点监控。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
