# 双源冲突裁决

仅对同一站点、同一 ASIN、同一日期、同一指标的双源数据进行冲突判定。默认保留 SellerSprite；SellerSprite 缺少字段时才由 Sorftime 补充，并在 `source` 中标注。绝不静默平均，也不得跨站比较或平均。

相对差异：`abs(sellersprite - sorftime) / max(sellersprite, sorftime) * 100`。

| 差异 | 处理 |
|---|---|
| <5% | 正常波动，使用 SellerSprite，无需记录 |
| 5%–15% | 轻度冲突，使用 SellerSprite，记录 data_quality_log.csv |
| >15% | 重大冲突，使用 SellerSprite，写日志和 manifest 摘要 |

特殊阈值：价格绝对差大于 $0.50；订单绝对差大于 50 且相对差大于 5%；BSR 绝对差大于 50 且相对差大于 10%；评分绝对差大于 0.05；评论数绝对差大于 10；变更日期相差大于 1 天。

明确要求交叉验证时才双源抓取，告知额外配额消耗，并输出比较数、轻微差异、重大冲突和一致率。