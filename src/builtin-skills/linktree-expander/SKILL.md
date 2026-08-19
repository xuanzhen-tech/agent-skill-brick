---
name: "linktree-expander"
description: "用于 KOL 或品牌多链接页线索扩展场景，解析官网、社媒、邮箱和合作入口并去重标注，输出可触达联系人清单与外联合规检查结果。"
version: 0.1.0
collection: ecosystem
displayName: "Linktree 线索扩展"
platforms: ["tiktok-shop"]
sceneTags: ["brand-compliance"]
searchTags: ["tiktok-shop", "brand-compliance"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-linktree-expander"
originKind: "template"
---

# linktree-expander

## 适用场景与边界
用于把达人 bio 中的 Linktree、Beacons、Carrd、Stan Store 等多链接页扩展成可分析的联系和渠道资料。

该 skill 面向 TikTok Shop、短视频内容电商、达人联盟和直播销售。判断时必须把内容素材、达人匹配、商品价格带、库存履约、平台合规、佣金成本和售后指标一起看。它不支持刷单、刷评、虚假达人数据、诱导违规购买或夸大功效承诺。

## 输入信息清单
收集 creator name、profile_url、linktree_url、niche、country、source、目标合作类型和已有联系人。

基础信息还应包括目标市场、SKU、售价、成本、库存、履约方式、佣金、广告预算、内容素材、达人名单、近 7/30 天曝光、点击、加购、订单、退款、差评和违规记录。

## 操作流程
1. 打开多链接页并提取官网、商店、邮箱、媒体包、YouTube、Podcast、TikTok、Instagram。`n2. 标注每个链接角色：商务、内容、商店、联盟、个人。`n3. 去重归并同一达人。`n4. 把联系入口交给 contact-extractor。`n5. 标记不适合外联原因。

每个动作都必须绑定负责人、上线时间、样本范围、观察窗口和停止条件。TikTok Shop 变化快，不能只凭单条爆款视频做长期决策。

## 关键指标与判断标准
expanded link rate、contact path found、duplicate rate、fit score、reply rate。

必须同时看 GMV、订单、CTR、商品点击率、CVR、AOV、退款率、取消率、差评率、履约时效、佣金/广告成本和贡献毛利。GMV 上升但履约、退款或违规恶化，不算有效增长。

## 可执行输出
扩展 CSV、链接角色、联系入口、置信度、风险备注和下一步提取建议。

输出应包含 P0/P1/P2 优先级、执行步骤、素材或话术要求、数据口径、风险和复盘表。

## 风险与合规
不得绕过登录或采集私人数据。

不得使用虚假功效、前后对比误导、未授权音乐/素材/IP、刷单刷评、虚假库存、诱导站外交易或规避 TikTok Shop 规则。跨境卖家还要关注当地税费、产品认证、标签和消费者保护要求。

## 示例
达人 Instagram bio 只有 Linktree。合格输出应提取 media kit 和 work with me 页面，而不是只保存 Linktree URL。

## 验证方式
抽样复核链接准确性，外联后用回复率校准评分。

复盘时要把内容表现与履约售后分开看：热视频带来流量，只有订单利润、退款、评价和违规都稳定，才可以放大。
