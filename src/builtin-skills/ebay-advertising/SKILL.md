---
name: "ebay-advertising"
description: "用于 eBay 广告冷启动、扩量或 ROAS 复盘场景，联动刊登质量、关键词、预算和 seller metrics，输出投放结构、出价调整与验证指标。"
version: 0.1.0
collection: ecosystem
displayName: "eBay 广告投放"
platforms: ["ebay"]
sceneTags: ["listing-content", "advertising-growth", "store-operations"]
searchTags: ["ebay", "listing-content", "advertising-growth", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-ebay-advertising"
originKind: "template"
---

# eBay Advertising

## 适用场景与边界
适用于 eBay 卖家需要用 Promoted Listings 放大高潜力刊登、清库存、保护核心 SKU 或测试新关键词。它不适合拿广告掩盖低质量刊登：如果 item specifics 缺失、价格无竞争力、物流慢或 seller level 受损，应先修复基础。

## 输入信息清单
需要刊登清单、SKU 毛利、库存、广告类型、预算、ad rate、关键词、历史 impressions/clicks/sales、organic vs promoted sales、竞品价格、退货率、late shipment rate 和目标 ROAS。

## 分析流程
1. 按 SKU 分层：利润款、引流款、清仓款和低库存款分开预算。
2. 检查刊登质量，低 CTR/低 CVR 的刊登不直接加预算。
3. Standard 用于已有转化的刊登扩量，Advanced 用于关键词控制和新品测试。
4. 按关键词意图分组：品牌/型号词、兼容性词、属性词、场景词和泛词。
5. 每周迁移预算：从高点击无销售、低毛利、退货高的组合转向高转化和库存充足组合。

## 关键指标与判断标准
看 promoted impressions、CTR、CPC、sales conversion、ad fees、ROAS、organic lift、watchers、sell-through rate 和 contribution margin。ROAS 高但自然曝光无提升，说明广告只是收割；CTR 高 CVR 低，优先修刊登而不是继续加价；库存不足 14 天时不应继续放量。

## 可执行输出
输出活动结构、SKU 分层预算、ad rate 建议、关键词分组、暂停/放量清单、刊登质量修复项和 7/14/30 天复盘节奏。

## 风险与合规边界
不得用误导关键词、错误兼容性或虚假折扣引流。广告放量必须受库存、毛利、物流和退货率约束；seller metrics 恶化时要先降预算并修复履约。

## 示例
输入：20 个配件 SKU，目标 ROAS 4，库存 60 天，Promoted Listings Standard 平均 ROAS 2.3。输出：暂停 5 个 CVR < 0.8% 且退货高 SKU，保留 8 个 ROAS > 4.5 的 SKU，Advanced 测试 30 个型号词，预算 70% 收割、20% 测试、10% 清仓。

## 验证方式
第 7 天看点击质量和花费异常；第 14 天看 ROAS、订单、organic lift；第 30 天看总利润、退货和 seller metrics。若广告订单增长但贡献毛利下降，应收缩预算。
