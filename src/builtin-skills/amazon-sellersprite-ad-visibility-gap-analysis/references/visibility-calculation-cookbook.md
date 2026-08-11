<!--
文件功能：定义可供报告概览或既有趋势事件使用的外部可见性覆盖、集合代理和时间线标记的可复算方法。
职责边界：计算只描述冻结的供应商可见集合，不代表独立报告章节、市场份额、广告表现或账户结构。
重要关联：../SKILL.md、channel-intent-taxonomy.md。
-->

# 外部可见性计算与图表

本文件的计算结果不是固定报告章节。只有结果真实、材料性足够并能帮助解释目标 ASIN 时，才建议总控放入报告概览或既有趋势图事件；否则返回 `not_material_for_report`，不生成占位图。

## 关键词规范化

保留 `keyword_raw`。规范化只用于匹配：Unicode 规范化、转小写、首尾/连续空格和站点语言允许的基础标点清理。业务 token 不删除；词义不确定时保持独立并标低置信度。

## 覆盖与集合

- `coverage_count(asn, channel) = distinct normalized keywords`
- `coverage_rate(asn, channel) = visible eligible keywords / eligible queried keywords`
- `shared_coverage(A,B) = |K_A ∩ K_B| / |K_A ∪ K_B|`，分母为零不计算
- `gap_set = eligible_set - visible_set`，同时列不可观测集合

未观察到只表示冻结范围未返回，不等于未索引、未投放或无流量。

排名只有在定义可验收时分层；自然排名和 Ads 标记排名分列。若供应商值具有共同且完整分母，可计算冻结集合内 `provider_visible_share_proxy` 或 `HHI_proxy`，但不得称市场份额、SOV、曝光份额、点击份额或官方 HHI。

## 时间线数据

`ad_visibility_timeline.data` 最小字段：

`period_or_time, marketplace, object_id, keyword_raw, keyword_normalized, channel, provider_entity_type, provider_entity_label, observed_value, value_unit, event_count, bubble_value, bubble_value_definition, source_tool, source_field, field_status, evidence_id, comparability`

- 无实际时间字段时不生成历史时间线。
- 无供应商实体字段时只使用 ASIN、关键词或通道，不发明 Campaign/Ad Group。
- `bubble_value` 必须来自实际数值或明确的唯一记录计数；不合格时为空，渲染等大点。
- 同一 evidence 或确定性业务键的重复记录去重，规则和删除数可复核。

## 显示和联动

时间线横轴显示实际期间；纵轴显示对象、原词、通道或实际实体。Tooltip 显示原始语义和状态。价格、Coupon、BSR 可以作为上下文轨道，但需分别标明来源和数据性质，不能解释为广告原因。

缺口优先级不用黑箱总分。按需求证据、竞品覆盖、目标相关性和验证可行性写 high/medium/low 与原值；它只用于研究排序，必须附替代解释和第一方验证字段。
