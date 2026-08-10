# 一方广告验证队列

| 外部假设 | 必需一方材料 | 验收后可交接 |
|---|---|---|
| 某词是有效转化词 | Search Term + Target报表，同期稳定ID、曝光点击花费订单销售 | 搜索词优化 |
| 某词簇广告依赖高 | Campaign/Ad Group/Target实体及绩效；Business Reports | 广告诊断 |
| 需要结构重组 | 现有Portfolio/Campaign/Ad Group/Target状态、命名、预算与商品目标 | 架构规划 |
| 可以增预算 | 已验证实际/目标/保本ACoS、TACoS、利润边界和预算节奏 | 预算ACoS规划 |
| 自然覆盖不足 | Listing文本/关键词架构、同口径自然排名或索引证据 | Listing关键词/排名趋势 |

每条队列记录：对象、词/词簇、外部观察、未知链路、替代解释、所需字段、owner、可逆下一步。无一方数据时状态只能 `unverified|partially_supported`。
