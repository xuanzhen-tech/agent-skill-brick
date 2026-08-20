---
name: "contact-extractor"
description: "用于媒体、KOL 或合作伙伴外联准备场景，从公开页面提取并校验商务联系邮箱，输出去重后的邮箱候选、置信度、来源 URL 与不建议触达原因。"
version: 0.1.0
collection: ecosystem
displayName: "联系邮箱提取"
platforms: ["cross-platform"]
sceneTags: ["store-operations"]
searchTags: ["cross-platform", "store-operations"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-contact-extractor"
originKind: "template"
---

# contact-extractor

## 适用场景与边界
用于从 KOL、媒体、播客、博客或联盟伙伴线索中提取可用于商务合作的公开联系邮箱。输入通常来自 linktree-expander、media-press-discovery、SERP 或人工整理的 CSV。

只处理公开页面上的商务联系方式，不应抓取私人账号、泄露数据、绕过登录限制或生成骚扰式群发名单。

## 输入信息清单
CSV 至少应包含 name、domain 或 profile_url；可选 personal_site、youtube、instagram、tiktok、podcast_apple、press_url、country、niche、source。还需要说明目标合作类型，例如测评、联盟、PR、批发或内容共创。

## 提取流程
1. 标准化 URL 和主体名称，合并同一创作者的多个来源。
2. 优先检查官网 contact、about、work with me、media kit、advertise、privacy、imprint 页面。
3. 再检查 YouTube about、播客主页、Linktree 跳转、媒体作者页和社交 bio 中的公开邮箱。
4. 对邮箱分类：商务合作、PR、广告、编辑部、客服、个人邮箱分别标注用途。
5. 置信度排序：域名邮箱且页面上下文匹配为 high；免费邮箱但与创作者名称匹配为 medium；来源弱或角色不明为 low。
6. 输出去重后的最多 3 个候选邮箱，并保留来源 URL 和证据片段，方便人工复核。

## 关键指标与判断标准
关注 email found rate、high confidence rate、bounce rate、reply rate、wrong contact rate 和 complaint rate。命中率高但退信/投诉高，说明提取质量或触达边界有问题。

不要把 support@、privacy@、legal@ 当成商务合作优先邮箱，除非页面明确说明用于合作。编辑部邮箱和个人作者邮箱要分开标注。

## 可执行输出
输出字段建议：name、normalized_domain、email_1、email_1_source、email_1_confidence、email_1_role、email_2、email_3、notes、do_not_contact_reason。对没有找到的线索标记 none，并说明下一步人工检查位置。

## 风险与合规
遵守 CAN-SPAM、GDPR、CCPA 及目标市场反垃圾邮件规则。不得提供绕过验证码、批量爬取私密数据、购买非法名单或伪装身份的做法。

## 示例
一行线索有 YouTube 和个人网站。官网 contact 页显示 partnerships@brandblog.com，YouTube about 显示同一邮箱，判定 high；页脚 support@ 仅用于客服，标记为低优先级或不作为 outreach 主邮箱。

## 验证方式
抽样 10%-20% 人工打开来源 URL 复核；首次触达后记录退信、回复和投诉。若 bounce rate 高于预期，应回到来源优先级和置信度规则重新校准。
