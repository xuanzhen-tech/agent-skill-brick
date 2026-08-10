# 广告可见性计算手册

## 1. 关键词规范化
保留 `keyword_raw`。`keyword_normalized` 仅做匹配：Unicode规范化、转小写、首尾空格、连续空格合并、站点语言允许的基础标点清理。品牌、型号、容量、接口、电压等有业务意义的 token 不删除。词义不确定时 `normalization_confidence=low`，不得自动合并。

## 2. 覆盖指标
- `coverage_count(asn,channel)=distinct normalized keywords`；
- `coverage_rate(asn,channel)=目标词集中被该通道观察到的词数 / 目标词集可查询词数`；
- `shared_coverage(A,B)=|K_A∩K_B|/|K_A∪K_B|`；分母为0不计算；
- `own_gap_vs_competitors=被至少m个竞品观察到而自有未观察到的词`。m须明示，不默认。

未观察到仅表示本次冻结范围未返回，不等于未索引/未投放。

## 3. 位置层级
仅在排名定义可验收时编码：`1–10, 11–20, 21–50, 51–100, >100, not_returned`。自然排名与广告排名分列；排名越小通常更好，但先验收工具语义。

## 4. 可见份额代理
若同一词的 `trafficPercentage` 有明确、同口径分母，可计算：
`provider_visible_share_proxy = asin_value / sum(values among frozen returned ASIN set)`。
它是冻结集合内代理，不是市场份额。若值可能重叠、总和非共同分母或分页不完整，不计算。

`HHI_proxy=sum(proxy_share_i^2)` 只描述冻结集合集中程度；不得与官方HHI或全市场集中度混称。

## 5. 缺口优先级
不用黑箱总分。按四维分层：需求证据、竞品覆盖、目标相关性、验证可行性；每维写 high/medium/low及原值。任何“高优先级”必须同时有替代解释和一方验证字段。

## 6. 示例
目标词集100词，自有自然可见30、广告可见10；竞品A自然50、竞品B自然45。自有自然覆盖率为30/100。若20词被A/B同时观察而自有未返回，写“20个双竞品可见缺口候选”，不写“自有未索引20词”。
