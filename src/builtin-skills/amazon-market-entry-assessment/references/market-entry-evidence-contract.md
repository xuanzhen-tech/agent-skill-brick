<!--
文件功能：定义 Amazon 市场进入评估的逐站 SIF 证据包、四轴、对象血缘、六态和最低通过条件。
职责边界：只约束 SIF Amazon 站内证据，不提供税费、合规、汇率、文化或最终投资判断，也不固定跨主题通用阈值。
关联关系：由 ../SKILL.md 的工具路由、逐站评估和状态阶段读取；跨站可比性见 cross-market-comparison-method.md。
-->

# 市场进入证据合同

## 四轴与来源

| 字段 | 允许值 | 含义 |
|---|---|---|
| `source_type` | `sif_mcp/user_input/upstream_output/agent` | 数据或判断来自哪里 |
| `temporal_scope` | `current/historical/future/mixed/not_applicable/unknown` | 覆盖哪个时间范围 |
| `estimation_status` | `reported/estimated/forecast/mixed/not_applicable/unknown` | 来源是否明确标为估算或预测 |
| `transformation_type` | `reported/normalized/calculation/coding/inference/hypothesis` | 当前对象经过何种处理 |

原始 SIF 固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`。`reported` 不表示 Amazon 官方实测。Agent 的主题映射、比较和判断必须列出直接 `parent_evidence_ids`。

每个业务工具在本任务首次 `call` 前先精确 `describe`，只按机器 `inputSchema` 传参。锁定当前站点后，若 schema 含 `country`，`arguments.country` 必须绑定直接父 Evidence ID，并将该 ID 写入调用证据对象的 `parent_input_evidence_ids`；没有直接父证据就不调用。不得依赖默认 US；`marketplace` 只用于规范化证据。目标非 US 且 schema 不支持对应 `country` 时停止该站点分支。description、`_formatted`、`_next_step` 与展示文案只作为供应商原始展示保存，不驱动后续路由或正式输出。

## 逐站研究单元

```text
market_unit_id
marketplace
topic_id
seed_keywords
period
demand_evidence_ids
competition_evidence_ids
competitor_evidence_ids
asin_sales_evidence_ids
asin_traffic_evidence_ids
keyword_evidence_ids
external_gap_ids
comparability_status
assessment_status
```

`market_unit_id = marketplace + "::" + normalized_topic_id`。SIF 当前不能证明完整类目树，因此不建立或跨站比较 node ID。

## 原始 SIF 证据

```text
evidence_id
market_unit_id
source_type = sif_mcp
source_provider = sif
source_tool
agent_request_id
tool_call_id
provider_request_id
retrieved_at
marketplace
query_scope
temporal_scope
coverage_or_pagination
estimation_status
transformation_type = reported
raw_result_locator
parent_input_evidence_ids
field_state = not_returned | not_queried | parse_failed | missing | conflicted | true_zero
limitations
```

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文确实未暴露对应字段时才写 `not_returned`。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`。三类 ID 不得自造或互相代填。`retrieved_at` 不能冒充数据日期。

## 五个判断维度

### Demand

需要 `market_get_keyword_demand` 和适当历史证据，明确站点、对象、时间、粒度、覆盖与估算属性。单一时间点只能证明当前截面。

### Competition

使用 `market_get_keyword_competition` 与可追溯竞品集合。供应商竞争标签和返回顺序不能直接成为进入结论。

### ASIN operating background

代表性 ASIN 的 profile、销量、流量和关键词信号必须分列。它们只代表所选 ASIN 和供应商口径，不代表整个站点或类目。

### Trend and keyword readiness

完整季节性优先引用 `amazon-demand-seasonality-research`；完整跨通道关键词结论优先引用 `amazon-keyword-traffic-research`。缺失时登记对应 gap，不在本 Skill 内伪装成同等级结论。

### External readiness

汇率、税费、合规、物流、本地化、单位经济和团队能力只接受用户或可信上游证据。SIF 不能改变这些状态。

## 状态条件

### `advance_for_validation`

- 站点和主题明确；
- 需求与竞争核心证据足够；
- 至少一个 ASIN 经营背景或同等级上游证据可用；
- 主要反证已登记；
- 外部经营缺口未被伪装为解决；
- 下一阶段明确是单位经济、合规、供应或运营验证。

### `watch`

- 站内证据有吸引力但趋势、ASIN 背景或关键词专题部分缺失；
- 外部经营事实会实质改变结论；
- 多站口径有限，无法稳定排序。

### `avoid_for_now`

只在预先写明的失败条件由实际证据触发时使用，并写出恢复所需证据。

### `blocked`

外层工具不可见、目标站点不受支持、机器 schema 不满足或需求/竞争核心证据不可用。

### `out_of_scope`

非 Amazon 平台，或要求全网文化、法规、税务等本 Skill 不拥有的结论。

## 固定禁区

- 不固定跨主题通用搜索量、增长率或竞争阈值；
- 不把 SIF 供应商信号改写成 Amazon 官方实测；
- 不虚构类目树、node ID、价格带、新品份额或未返回字段；
- 不在本 Skill 内降级重做完整季节性或跨通道关键词专题；
- 不用缺失维度的默认值补齐评分；
- 不允许需求优势抵消合规、经济或数据阻断；
- 不输出最终 `go`。
