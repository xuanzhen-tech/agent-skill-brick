---
name: "ebay-review-checker"
description: "用于 eBay 账号声誉、竞品可信度或售后问题复盘场景，解析 feedback、DSR、退货原因和 defect 信号，输出风险主题、修复动作与监控指标。"
version: 0.1.0
collection: ecosystem
displayName: "eBay 评论与声誉检查"
platforms: ["ebay"]
sceneTags: ["customer-voice", "brand-compliance", "store-operations", "analytics-automation"]
searchTags: ["ebay", "customer-voice", "brand-compliance", "store-operations", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-ebay-review-checker"
originKind: "template"
---

# ebay-review-checker

## 适用场景与边界
适用于评估自己或竞品 eBay 店铺的 feedback 质量、买家投诉风险、物流/描述不符问题和 seller trust。它不是刷好评工具，也不用于骚扰买家改评；只能用于诊断服务和刊登承诺是否需要修复。

## 输入信息清单
需要 seller profile、近 12 个月 feedback、negative/neutral 文本、DSR 维度、退货原因、late shipment、case/claim、top selling listings、物流方式和客服回复样本。

## 分析流程
1. 按时间段拆分 feedback，识别最近 30/90 天是否恶化。
2. 将差评归类为描述不符、物流慢、损坏、缺件、假货质疑、客服差、退货争议。
3. 映射到具体 listing、SKU、供应商批次或物流线路。
4. 对竞品 feedback 做同样分类，找出可差异化承诺。
5. 输出刊登修正、包装/物流修正和客服 SOP。

## 关键指标与判断标准
关注 positive feedback rate、negative count、neutral count、late shipment、item not as described、return reason、case rate、seller level。短期差评集中在同一 SKU 或物流线路，优先停投和修复；描述不符高于物流问题时，优先改标题、图片和 condition 说明。

## 可执行输出
输出 feedback 标签表、风险 SKU、刊登承诺修复项、客服回复模板、物流/包装改进项和 30 天声誉恢复计划。

## 风险与合规边界
不得诱导、威胁或补偿买家修改 feedback；不得删除真实缺陷信息；不得伪造交易或评论。客服回复必须基于事实和平台政策。

## 示例
输入：近 90 天 12 条 negative，其中 7 条提到 “arrived late”。输出：定位到跨境经济物流线路，建议对高价值 SKU 切换 tracked service，handling time 从 1 天改为 2 天，并在 listing 中更新预计送达。

## 验证方式
观察 30/60 天 negative rate、late shipment、case rate 和退货原因是否下降，同时检查转化是否因配送承诺变化受影响。
