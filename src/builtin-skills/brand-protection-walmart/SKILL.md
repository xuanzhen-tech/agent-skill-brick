---
name: "brand-protection-walmart"
description: "用于 Walmart Marketplace 品牌保护、假货排查或 Buy Box 被异常抢占场景，整理商标/版权证据、seller 链接、test buy 和 Brand Portal 路径，输出分级处置清单与复盘指标。"
version: 0.1.0
collection: ecosystem
displayName: "Walmart 品牌保护"
platforms: ["walmart"]
sceneTags: ["brand-compliance", "store-operations"]
searchTags: ["walmart", "brand-compliance", "store-operations"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-brand-protection-walmart"
originKind: "template"
---

# brand-protection-walmart

## 适用场景与边界
用于品牌在 Walmart Marketplace 遇到假货、未授权卖家、图片/文案盗用、错误品牌挂靠、价格破坏或侵权投诉需要整理证据和处置路径的场景。

该 skill 不是法律意见。商标、版权、专利、经销授权和平台投诉都需要证据链，无法只凭“看起来像侵权”采取行动。

## 输入信息清单
- 品牌资产：商标注册、版权素材、专利、授权卖家名单、渠道政策、MAP 或价格政策。
- 问题链接：item id、seller name、价格、库存、图片、文案、评价、Buy Box、截图和发现时间。
- 证据材料：原始产品图、包装、批次号、采购链路、test buy 结果、买家投诉和客服记录。
- 业务影响：被抢 Buy Box、价格下探、差评归因、退货增加、广告浪费。

## 处置流程
1. 先分类：假货、灰色渠道、素材盗用、错误品牌、误导性兼容声明、价格违规分别处理。
2. 建立证据包：截图、URL、时间戳、商标/版权证明、授权名单、test buy 对比照片。
3. 判断路径：可通过 Walmart Brand Portal/IP claim 处理的，走平台投诉；授权渠道问题，先走商业沟通和分销政策。
4. 处理 Buy Box 风险：对核心 SKU 监控价格、卖家、库存和广告浪费，避免侵权链接持续吃流量。
5. 复盘根因：渠道泄漏、包装难辨识、图片无水印、授权条款不清或内部价格管理失控。

## 关键指标与判断标准
看侵权链接数量、下架率、处理周期、Buy Box 恢复、价格恢复、差评/退货变化和重复侵权卖家比例。高价值 SKU、食品/母婴/电子等安全敏感 SKU、正在投广告的 SKU 优先级最高。

## 可执行输出
输出侵权分级表、证据包目录、投诉文本、test buy 计划、授权渠道核查表、价格监控规则、恢复动作和复盘报告。

## 风险与合规
不得伪造证据、恶意投诉竞品、使用不确定权利主张或公开买家隐私。MAP/价格政策在不同地区和渠道存在法律风险，需要人工确认。

## 示例
品牌发现一个未授权 seller 抢走核心 SKU Buy Box。合格输出应先确认该 seller 是否授权，再截图价格和页面，若疑似假货则安排 test buy，对比包装和批次；同时评估广告是否暂停，避免预算导向问题 offer。

## 验证方式
按 7/14/30 天追踪投诉状态、链接下架、Buy Box 恢复、价格变化和重复出现情况。若投诉无效，补充证据或改走渠道治理，不重复提交低质量投诉。
