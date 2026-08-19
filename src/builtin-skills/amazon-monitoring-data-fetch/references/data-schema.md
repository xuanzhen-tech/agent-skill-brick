# 数据输出契约

所有 CSV 使用 UTF-8；日期为 `YYYY-MM-DD`。通用列：`asin,parent_asin,asin_role,source,marketplace`。

- `price.csv` 必需：`asin,parent_asin,asin_role,date,amazon_price,is_deal,source,marketplace`；可选 `listing_price,discount_price,buybox_price,coupon_value,deal_type`。
- `orders.csv` 必需：`asin,parent_asin,asin_role,date,order_volume,is_estimated,source,marketplace`；可选 `sales_revenue`。必须 `is_estimated=true`。
- `bsr.csv` 必需：`asin,parent_asin,asin_role,date,main_category,main_category_rank,source,marketplace`；可选小类和排名字段。
- `rating.csv` 必需：`asin,parent_asin,asin_role,date,star_rating,total_review_count,source,marketplace`；可选 `new_reviews_today`。
- `reviews.csv` 至少：`asin,parent_asin,asin_role,date,review_id,star_rating,review_title,review_text,review_date,helpful_votes,verified_purchase,source,marketplace`；样本有限时标记范围。
- `review_keywords.csv` 至少：`asin,asin_role,keyword,ngram,frequency,source,marketplace`。
- `listing_changes.csv` 至少：`asin,parent_asin,asin_role,date,change_type,change_subtype,change_detail,source,marketplace`。
- `data_quality_log.csv`：`asin,date,metric,sellersprite_value,sorftime_value,diff_percent,conflict_level,resolution,notes`。

`manifest.json` 需记录时间、原始站点输入、规范化站点、默认站点假设（如适用）、每个 ASIN—站点对的核验状态/身份、日期范围、角色、父子映射、来源、每类型状态、配额、错误、冲突、评论采样限制和运行时能力发现结果。