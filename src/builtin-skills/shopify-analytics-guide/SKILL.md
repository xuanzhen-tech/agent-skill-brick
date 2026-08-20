---
name: "shopify-analytics-guide"
description: "用于 Shopify 经营数据复盘、渠道归因或漏斗异常诊断场景，整合 Shopify Analytics、GA4、订单和退款数据，输出指标看板、问题定位与行动优先级。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 数据分析"
platforms: ["shopify"]
sceneTags: ["store-operations", "analytics-automation"]
searchTags: ["shopify", "store-operations", "analytics-automation"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-analytics-guide"
originKind: "template"
---

# Shopify Analytics Guide

## 适用场景与边界
用于店铺报表混乱、广告归因冲突、看不清利润来源或需要月度经营复盘。目标是把数据口径统一到可行动决策。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集 Shopify Analytics、GA4、广告平台、订单、退款、成本、客户标签、渠道 UTM、邮件/SMS、库存和时间窗口。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 统一时区、货币、订单状态、退款和归因口径。`n2. 建立经营层指标：流量、转化、AOV、CAC、LTV、毛利和现金流。`n3. 按渠道、国家、SKU、客户新老拆分。`n4. 找出增长、亏损、复购和退款的真实来源。`n5. 输出每周/月复盘动作。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
Sessions、CVR、AOV、gross/net sales、refund rate、CAC、ROAS、MER、LTV、repeat purchase、contribution margin。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
指标字典、看板结构、渠道复盘、SKU/客户分层、异常解释和下月行动计划。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不能把不同平台归因直接相加；涉及客户数据导出要注意隐私和权限。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
广告平台显示 ROAS 高但 Shopify 利润下降。合格分析应加入折扣、退款、运费和新老客，检查是否只是低毛利复购被重复归因。

## 验证方式
每周查异常，每月做经营复盘；报表变更需记录口径。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
