---
name: "shopify-wholesale-channel"
description: "用于 Shopify 批发、经销商、企业采购或 B2B 渠道搭建场景，设计客户准入、价格表、MOQ、账期、税免和库存规则，输出批发政策、订单流程与渠道复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 批发/B2B 渠道"
platforms: ["shopify"]
sceneTags: ["pricing-profit", "customer-voice", "inventory-supply-chain", "brand-compliance", "store-operations"]
searchTags: ["shopify", "pricing-profit", "customer-voice", "inventory-supply-chain", "brand-compliance", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-shopify-wholesale-channel"
originKind: "template"
---

# shopify-wholesale-channel

## 适用场景与边界
用于品牌开展批发、经销商、企业采购或 Shopify B2B。重点是保护零售利润和渠道秩序，同时提高大单效率。

该 skill 面向 Shopify 独立站经营，判断时必须同时考虑流量来源、商品经济模型、主题与 app 复杂度、支付/履约能力、隐私合规和跨境买家的信任门槛。它不替代法律、税务或平台政策意见；涉及税务、隐私、医疗功效、金融承诺和知识产权时，应列出待人工确认项。

## 输入信息清单
收集客户类型、批发价、MOQ、付款账期、税免文件、产品目录、库存、发货、退换货、渠道冲突和 B2B 功能。

基础数据还应包括目标国家、主推 SKU、售价、成本、毛利、库存、履约方式、主要流量渠道、GA4/Shopify Analytics、广告成本、退款原因和客服问题。

## 操作流程
1. 定义批发客户准入和审批。`n2. 设置价格表、MOQ、箱规和付款条款。`n3. 建立专属目录、库存预留和订单审核。`n4. 配置税免、发票和客服流程。`n5. 监控渠道冲突和利润。

每个动作都要记录基线、上线时间、影响页面或人群、观察窗口和停止条件，避免一次性大改导致无法归因。

## 关键指标与判断标准
B2B revenue、order value、gross margin、repeat wholesale、payment overdue、inventory allocation 和 channel conflict。

独立站必须同时看 CVR、AOV、CAC、ROAS、LTV、退款率、履约时效、页面速度和贡献毛利。转化提升但退款、投诉或广告成本恶化，不算高质量增长。

## 可执行输出
批发政策、客户分级、价格表、MOQ、目录配置、订单流程和复盘表。

输出应包含 P0/P1/P2 优先级、负责人、依赖项、预计影响、风险、回滚方式和复盘日期。

## 风险与合规
不得对零售买家隐藏必要条款；税免和经销授权要留档。

不得使用误导性折扣、隐藏订阅、虚假库存、未经授权素材、违规追踪、暗黑模式或无法履约的配送承诺。涉及客户数据、支付、邮件和跨境税费时必须遵守目标市场规则。

## 示例
一个零售品牌收到精品店采购询盘。合格方案应建立申请表、MOQ、批发价和发货周期，而不是直接发折扣码。

## 验证方式
每月看批发利润、回款、库存和零售渠道影响。

复盘时同时记录副作用：站点速度、客服量、退款、毛利、库存和广告学习是否被影响。若连续两个周期未达标，应停止动作并回到输入数据重新诊断。
