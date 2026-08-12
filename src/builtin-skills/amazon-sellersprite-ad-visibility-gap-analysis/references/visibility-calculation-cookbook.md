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

## 粒度、参数行为与时间可比性

日级是优先目标，不是强制输出形态。对每个可见性证据，记录 MCP 实际返回的最细合格粒度：`record | day | week | month | rolling_window | snapshot | interval`。只有带明确期间、时间语义、对象范围和可比查询规则的点才能组成时间线；不得将 `nearly`、当前快照、未声明起止日的月标签或本地抓取时间改写成日级历史。

对时间、`month/nearly`、关键词、badge、ASIN/父子体、页码、排序和字段投影参数，Schema 说明不构成行为证据。以明显不同的小请求对照返回的对象、期间、字段或排序；参数不生效时可通过分页/分段取原始记录、本地确定性筛选和聚合、已验证的替代端点或后续重复快照补救。应保留调用、输入、规则和输出证据，不得将补救处理外推为原始时间趋势。

## 时间线数据

`ad_visibility_timeline.data` 最小字段：

`period_or_time, marketplace, object_id, keyword_raw, keyword_normalized, channel, provider_entity_type, provider_entity_label, observed_value, value_unit, event_count, bubble_value, bubble_value_definition, source_tool, source_field, field_status, evidence_id, comparability`

- 无实际时间字段、时间语义未验证或仅返回 `nearly`/当前滚动窗口时不生成历史时间线；改为当前/滚动窗口覆盖矩阵，并明确不是时间趋势。
- 无供应商实体字段时只使用 ASIN、关键词或通道，不发明 Campaign/Ad Group。
- `bubble_value` 必须来自实际数值或明确的唯一记录计数；不合格时为空，渲染等大点。
- 同一 evidence 或确定性业务键的重复记录去重，规则和删除数可复核。

## 显示、事件因素搜索和联动

时间线横轴显示实际期间和 `grain`；纵轴显示对象、原词、通道或实际实体。Tooltip 显示原始语义、参数行为、状态与 evidence。价格、Coupon、BSR、Listing、评论主题、竞争对象和需求信号可以作为上下文轨道或关联证据，但需分别标明来源、时间粒度和数据性质。

对材料性可见性差异，按“观察信号 → 同期可定位事件/动作 → 直接因素 → 间接候选机制 → 替代解释/反证 → 验证路径”组织。外部 badge 或可见词只可作为直接观察；广告账户投放、出价、预算、花费、订单和转化始终是待第一方验证的未知链路，不能从标签、排名或与其他指标的时间邻近性推断为事实或赋予伪精确权重。

缺口优先级不用黑箱总分。按需求证据、竞品覆盖、目标相关性和验证可行性写 high/medium/low 与原值；它只用于研究排序，必须附替代解释和第一方验证字段。
