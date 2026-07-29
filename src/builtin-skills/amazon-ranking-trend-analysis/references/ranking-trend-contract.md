<!--
文件功能：定义四种排名类型、SIF 供应商来源观测、同类序列、上下文协变量、缺失与状态不变量。
职责边界：只规定排名分析数据合同；SIF 结果仍须通过类型与实际字段门，不提供关键词发现、Sorftime 接入、后台监控、自然排名保证或领域执行动作。
重要关联：由上级 SKILL.md 在解析排名数据前读取；交付结构见 assets/templates/ranking-trend-template.md。
-->

# 排名趋势合同

## 1. 严格类型枚举

```text
bsr_category_rank
organic_keyword_position
sponsored_position
visibility_observation
```

除此之外一律 `unsupported_ranking_type`。特别禁止把以下内容作为类型：

- provider 名称；
- `estimated` 或算法名称；
- 流量、搜索量、价格、销量、转化率；
- 综合分、趋势分或 Agent 自造排名。

## 2. 来源观测

```yaml
evidence_id: ev-...
record_type: ranking_observation
source_type: user_input | uploaded_file | trusted_upstream_output | sif_mcp
evidence_origin: user_uploaded_platform_export | upstream_formal_output | provider_observation
source_locator: ""
source_owner: ""
provider: ""
method: ""
stable_object_id: obj-...
asin: ""
marketplace: ""
locale: ""
language: ""
ranking_metric_type: bsr_category_rank | organic_keyword_position | sponsored_position | visibility_observation
keyword_raw: null
keyword_normalized: null
keyword_match_scope: null
category_path_or_id: null
observed_at: ""
business_time: ""
retrieved_at: ""
rank_value: null
rank_direction_contract: lower_is_better | higher_is_better | ordinal_only
visible_sampling_scope: ""
coverage: ""
version: ""
limitations: []
temporal_scope: point_in_time
estimation_status: observed | reported | estimated
transformation_type: raw | reported | normalized | transcribed | translated
```

关键词字段对 BSR 不适用；类目字段对关键词位次不适用。用 `null` 表示不适用，不能用空字符串掩盖未知。

当 `source_type=sif_mcp` 时，同一观测对象必须直接增加：

```yaml
source_provider: sif
source_tool: verified-tool-name
agent_request_id: agent-request-id
tool_call_id: tool-call-id
provider_request_id: provider-id-or-not_returned
query_scope: explicit-object-keyword-time-grain-and-filters
coverage_or_pagination: explicit-coverage
raw_result_locator: temp-relative-raw-result-location
```

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的对应真实值；若该上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。

每个 SIF 业务工具首次调用前必须 `describe` 并只服从机器 `inputSchema`。当前没有机器 `outputSchema`；只有本次实际返回能证明位次语义、对象、时间和采样范围时才建立排名观测。description、综合分、`_formatted` 与 `_next_step` 均不能定义排名值或下一步。

## 3. 类型附加要求

### `bsr_category_rank`

- 必须有 category ID 或完整路径；
- 不同类目层级不能同序列；
- 类目迁移必须拆序列；
- BSR 位次不能替代关键词自然位次。

### `organic_keyword_position`

- 必须有关键词原文、规范形式、locale/language 和匹配范围；
- 必须排除 sponsored observation；
- 供应商未返回不等于未收录。

### `sponsored_position`

- 必须有广告位置字段的明确来源语义；
- 不能推断预算、竞价、ACoS 或广告策略；
- 广告执行归第 05。

### `visibility_observation`

- 必须写清可见采样范围和观察规则；
- 它是有限可见性观测，不是自然或广告排名的通用替代；
- 不得被重命名为“综合排名”。

## 4. 序列

```yaml
series_id: series-...
ranking_metric_type: ""
stable_object_id: obj-...
marketplace: ""
locale: ""
language: ""
keyword_normalized: null
keyword_match_scope: null
category_path_or_id: null
provider_and_method_contract: ""
sampling_scope_contract: ""
observation_evidence_ids: []
series_status: baseline_only | comparable_trend | not_comparable | partial | conflicted
comparability_notes: []
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period
estimation_status: not_applicable
transformation_type: series_construction
```

任何类型、关键词、类目、站点、语言、方法或采样范围变化都必须拆序列或标不可比。

## 5. Agent 派生记录

```yaml
agent_output_id: ao-...
output_type: ranking_baseline | ranking_trend | ranking_gap | context_alignment
series_id: series-...
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period
estimation_status: not_applicable | agent_estimated
transformation_type: baseline_construction | trend_calculation | gap_classification | context_alignment
transformation_summary: ""
rule_version: ranking-trend-contract-v1
generated_at: ""
uncertainty: none | bounded | material | unknown
result_status: baseline_only | comparable_trend | not_comparable | partial | conflicted
reason_codes: []
```

趋势必须至少有两个可比 observation Evidence IDs。

## 6. 上下文事件或协变量

```yaml
context_id: ctx-...
context_type: traffic_observation | price_observation | promotion_event | inventory_event | listing_intervention | visual_intervention | advertising_event | policy_event
value_or_description: ""
business_time: ""
parent_evidence_ids: []
source_type: agent
temporal_scope: point_in_time | period
estimation_status: not_applicable
transformation_type: context_alignment
alignment_to_series: before | during | after | overlapping
interpretation_limit: association_only
```

上下文记录不得进入 `rank_value`，时间对齐也不证明因果。

## 7. 缺失与采样边界

```text
not_returned
not_queried
parse_failed
missing
conflicted
true_zero
```

若供应商用特定哨兵值表达“超出前 N”，必须保存该来源合同和采样上限；不得把哨兵值当真实位次，也不得自行发明一个大数。

## 8. 状态不变量

| 状态 | 最低证据 |
|---|---|
| `baseline_only` | 一个合法观测 |
| `comparable_trend` | 两个以上同类可比观测 |
| `not_comparable` | 有观测但合同漂移 |
| `partial` | 部分时点/字段可用 |
| `conflicted` | 同时点或身份未解决冲突 |

所有状态下：

```text
monitoring_status=not_created
alert_status=not_sent
rank_change_action_status=not_executed
causal_status=not_claimed
```

## 9. 交付检查

- 类型只来自四项枚举；
- provider、method、estimated 只在证据属性；
- 流量和价格只在 context；
- BSR、自然、广告和可见性序列分离；
- 单点不称趋势；
- 未返回不称掉榜；
- 不保证自然排名；
- 不调用 SIF/Sorftime/Web；
- 不创建监控或告警。
