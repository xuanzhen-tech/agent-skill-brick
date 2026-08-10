# 文本差异与 VOC 对齐

## 历史 diff 门
只有站点、ASIN/变体、语言、字段完整度、工具/字段语义、采集范围和版本均一致时为 `fully_comparable`。否则并列，不写新增/删除/优化。

## diff 单位
1. 保存基线/当前完整原文与hash；
2. 先句/要点级，再token/span级；
3. 分类 `added|removed|replaced|reordered|format_only`；
4. 每条diff链接两侧证据；
5. 两时点只称相对基线差异，不确定实际修改日和中间版本。

## VOC 对齐
仅消费VOC正式 codebook/证据。建立：`theme_id, complaint_or_praise, listing_field, text_span, coverage=explicit|partial|absent_from_returned_text, evidence_ids, limitation`。

`absent_from_returned_text` 不等于页面完全未处理；SellerSprite字段不完整时标 `not_verifiable`。
