---
name: "brand-protection-shopify"
description: "用于 Shopify 独立站被仿冒、素材被盗用或渠道侵权排查场景，整理商标、页面、商品和交易证据，输出投诉路径、下架动作与渠道治理清单。"
version: 0.1.0
collection: ecosystem
displayName: "Shopify 品牌保护"
platforms: ["shopify"]
sceneTags: ["brand-compliance", "cross-platform"]
searchTags: ["shopify", "brand-compliance", "cross-platform"]
legacyEcosystemId: "nexscope-ai-ecommerce-skills-brand-protection-shopify"
originKind: "template"
---

# brand-protection-shopify

## 适用场景与边界
用于 Shopify 品牌发现仿站、盗图盗文案、假冒商品、未经授权经销、恶意广告投放或社媒/搜索结果中冒用品牌。虽然此文件的 platformId 当前归类为 tiktok-shop，正文按 Shopify 独立站品牌保护场景处理。

该 skill 不是法律意见。商标、版权、专利、肖像、经销授权和 DMCA 都需要证据链；不能只凭主观判断发起投诉。

## 输入信息清单
需要品牌官网、商标/版权/专利材料、原始图片和设计文件、授权卖家名单、疑似侵权 URL、广告截图、支付/社媒/域名信息、发现时间、业务影响和 test buy 可行性。

## 处置流程
1. 先分类：仿站、盗图、盗文案、假货、品牌词广告、未授权经销、钓鱼站分别处理。
2. 建证据包：原始发布时间、源文件、注册证明、侵权页面截图、URL、WHOIS/平台信息和时间戳。
3. 选择渠道：Shopify abuse、DMCA、搜索引擎下架、广告平台、支付服务商、域名注册商或社媒平台。
4. 对高价值 SKU 做 test buy，确认假货或渠道泄漏。
5. 建立监控：品牌词、图片反搜、竞价广告、社媒账号和客服反馈。

## 关键指标与判断标准
关注侵权页面数量、下架成功率、处理周期、重复侵权域名、品牌词广告 CPC、客服投诉、退款和仿站造成的流量损失。使用品牌名、原图、原文案和 checkout 仿冒的站点优先级最高。

## 可执行输出
输出侵权清单、证据包目录、投诉渠道建议、DMCA/abuse 文案、test buy 计划、监控关键词、渠道治理建议和 7/14/30 天复盘表。

## 风险与合规
不得伪造权利证明、恶意投诉竞品、公开买家隐私或把 MAP/经销争议包装成明确侵权。涉及法律威胁和跨境维权应由法务确认。

## 示例
品牌发现一个 Shopify 仿站复制全站图片并用品牌词投放 Google Ads。合格方案应保存广告和页面截图，整理原始素材证明，分别向广告平台、Shopify abuse 和搜索引擎提交投诉，同时评估是否暂停品牌词广告预算浪费。

## 验证方式
7 天追踪平台回执，14 天检查下架和搜索结果，30 天复盘是否出现新域名。若投诉失败，应补充权利证明或调整渠道，不重复提交低质量材料。
