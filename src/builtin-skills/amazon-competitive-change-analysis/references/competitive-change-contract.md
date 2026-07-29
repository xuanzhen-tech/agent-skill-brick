<!--
文件功能：定义竞品对象、SIF 供应商字段快照、可比性门、变化记录和状态不变量。
职责边界：只规定已冻结对象的按需比较合同；SIF 不拥有竞品集合或一方经营真相；不负责发现竞品、持续抓取、后台监控、因果解释或促销执行。
重要关联：由上级 SKILL.md 在建立竞品基线前读取；交付结构见 assets/templates/competitive-change-template.md。
-->

# 竞品变化合同

## 1. 竞品集合

```yaml
competitor_set_id: cs-...
version: ""
owner: expert-02-or-user
marketplace: ""
locale: ""
selection_scope: ""
stable_object_ids: []
created_at: ""
valid_until: null
limitations: []
```

本包只能消费该集合，不能因快照变化自行增删对象。

## 2. 稳定对象

```yaml
stable_object_id: obj-...
asin: ""
seller_id: null
parent_asin: null
child_asin: null
variation_id: null
offer_id: null
marketplace: ""
identity_evidence_ids: []
identity_status: verified | partial | conflicted
```

标题、主图或列表位置不能替代稳定身份。

## 3. 字段快照

```yaml
evidence_id: ev-...
record_type: competitive_field_snapshot
source_type: user_input | uploaded_file | trusted_upstream_output | sif_mcp
evidence_origin: user_uploaded_platform_export | upstream_formal_output | provider_observation
source_locator: ""
source_owner: ""
stable_object_id: obj-...
field_name: ""
field_semantics: ""
raw_value: null
normalized_value: null
unit_or_currency: ""
price_basis: null
observed_at: ""
business_time: ""
retrieved_at: ""
collection_method: ""
visible_sampling_scope: ""
coverage: ""
version: ""
limitations: []
temporal_scope: point_in_time
estimation_status: observed | reported | estimated
transformation_type: raw | reported | normalized | translated
```

当 `source_type=sif_mcp` 时，同一快照对象必须直接增加：

```yaml
source_provider: sif
source_tool: verified-tool-name
agent_request_id: agent-request-id
tool_call_id: tool-call-id
provider_request_id: provider-id-or-not_returned
query_scope: explicit-object-time-grain-and-filters
coverage_or_pagination: explicit-coverage
raw_result_locator: temp-relative-raw-result-location
```

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的对应真实值；若该上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

SIF 原始对象固定 `transformation_type=reported`；首次调用每个业务工具前必须 `describe` 并只服从机器 `inputSchema`。当前没有机器 `outputSchema`，description、`_formatted` 与 `_next_step` 均不能定义结果字段或后续动作。SIF 的销量、流量和广告结构仍是供应商观察，不是订单、会话、广告账户或对手内部策略。

## 4. 可比性检查

```yaml
comparability_id: comp-...
stable_object_id: obj-...
field_name: ""
baseline_evidence_id: ev-...
current_evidence_id: ev-...
checks:
  same_identity: false
  same_marketplace: false
  same_object_level: false
  same_field_semantics: false
  same_unit_or_currency: false
  same_price_basis: false
  comparable_collection_method: false
  comparable_sampling_scope: false
  ordered_business_time: false
  sufficient_coverage: false
unresolved_conflicts: []
comparability_status: comparable | not_comparable | partial | conflicted
parent_evidence_ids: []
source_type: agent
temporal_scope: period
estimation_status: not_applicable
transformation_type: comparability_assessment
```

只有全部必要检查为 true 且无 unresolved conflict 时才可计算变化。

## 5. 基线与变化

```yaml
agent_output_id: ao-...
output_type: competitive_baseline | competitive_change | comparability_gap
stable_object_id: obj-...
field_name: ""
baseline_value: null
current_value: null
absolute_change: null
relative_change: null
change_status: baseline_only | comparable_change | no_observed_change | not_comparable | partial | conflicted
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period
estimation_status: not_applicable | agent_estimated
transformation_type: baseline_construction | comparison | gap_classification
transformation_summary: ""
rule_version: competitive-change-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
reason_codes: []
```

约束：

- 单点：`baseline_only`；
- 基数为 `true_zero`：`relative_change=undefined`；
- 字符串/枚举：保留 old/new，不计算百分比；
- `no_observed_change` 需要两侧完整覆盖；
- `parent_evidence_ids` 至少包含两侧快照，基线除外。

## 6. 缺失语义

```text
not_returned
not_queried
parse_failed
missing
conflicted
true_zero
```

前五项不得解释为：

- 下架或消失；
- 价格归零；
- Review 未增长；
- 广告停止；
- 库存售罄；
- 无竞争动作。

## 7. 价格字段专门检查

比较价格前至少核：

- 币种；
- 含税/不含税；
- list/offer/Buy Box/coupon 后有效价；
- 运费；
- seller 与 fulfillment 身份；
- variation；
- 观察时间和优惠有效期。

不同价格概念不得拼成一条序列。

## 8. Review 字段专门检查

Review count、rating、rating distribution 和可见 Review sample 是不同字段。公开可见增量不能证明销量、真实购买、客服表现或原因。

## 9. 状态不变量

```text
monitoring_status=not_created
alert_status=not_sent
response_action_status=not_executed
```

`ready_for_human_review` 只能包含合法变化或基线；`partial/blocked` 必须展示缺口和受影响字段。

## 10. 责任路由

| 请求 | 路由 |
|---|---|
| 选择或更新竞品集合 | 第 02 |
| Listing/视觉比较与改动 | 第 03/04 |
| 广告策略与执行 | 第 05 |
| 折扣、促销响应 | 第 06 |
| 当前政策 | 第 09 |
| 原因候选 | `amazon-business-anomaly-diagnostics` |
| 价格护栏与利润 | 第 14/内置包 |
