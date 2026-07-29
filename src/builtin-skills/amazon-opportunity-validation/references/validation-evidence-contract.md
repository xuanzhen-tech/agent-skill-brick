<!--
文件功能：定义候选验证阶段的 SIF 工具路由、实时 schema 约束、证据类型和最小调用策略。
职责边界：不处理 MCP 连接与密钥，不保证未接入工具存在；每次 describe 返回的机器 inputSchema 始终优先于本文和工具描述文字。
关联关系：由 ../SKILL.md 的工具预检和五类证据验证阶段读取。
-->

# 候选验证证据合同

## 能力路由

| 证据问题 | 工具 | 注意口径 |
|---|---|---|
| ASIN 身份 | `market_get_asin_profile` | 只使用本次实际返回字段 |
| 销量观察 | `ops_get_asin_sales_trend`、`ops_get_asin_sales_list` | 父子体、时间和粒度不可混算 |
| 流量观察 | `ops_get_asin_traffic_trend`、`ops_get_asin_traffic_trend_detail`、`ops_get_listing_traffic_overview`、`ops_get_listing_traffic_structure` | 趋势调用显式 `fetchKeepa=false`；保留覆盖 |
| 首轮竞品 | `market_get_keyword_root_competitors` | 先建立可追溯集合 |
| 竞品深挖 | `market_discover_competitors` | 首轮不足时才追加 |
| 关键词需求 | `market_get_keyword_demand`、`market_get_keyword_history`、`market_get_keyword_root_trend` | 记录时间粒度，不把单点当趋势 |
| 关键词竞争 | `market_get_keyword_competition`、`market_screen_keyword_opportunities` | 供应商标签只作观察 |
| ASIN 关键词与 ABA | `market_get_asin_keyword_signals`、`market_get_asin_aba_footprint`、`ops_get_listing_keyword_distribution` | 不把可见结构写成广告账户真相 |

SIF 当前不提供评论正文。差异化痛点只能来自用户、`uploads/` 或可信上游，并记录其原始来源；不得用 SIF 或其他外部来源补造。

## 证据最小集

一个候选要进入可评分状态，至少需要：

- 当前身份可确认；比较类目或主题必须由用户或可信上游确认，SIF profile 中的类目字段只保留为供应商快照，不得升级为 Amazon 官方类目树事实；
- 两个以上时间点或明确历史序列支持需求判断；
- 一个关键词主题或竞品基线支持竞争判断；
- 关键词或购买信号支持需求真实性；
- 每个分数对应至少一个 evidence ID。

要进入 `go` 评估，还需要用户成本单位经济和所有硬闸门状态。

## 标准证据记录

```text
evidence_id
candidate_id
question
source_type = sif_mcp | user_input | upstream_output | agent
source_provider = sif | user | upstream | agent
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
transformation_type = reported | normalized | derived | vendor_calculation
raw_result_locator
parent_evidence_ids
parent_input_evidence_ids
field_state = not_returned | not_queried | parse_failed | missing | conflicted | true_zero
limitations
```

原始 SIF 证据固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`。`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文确实未暴露对应字段时才写 `not_returned`。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`。三类 ID 不得自造或互相代填。Agent 派生对象固定 `source_type=agent`，并直接列出 `parent_evidence_ids`。

## 调用节制

- 每个业务工具在当前任务第一次 `call` 前先 `describe`；只按机器 `inputSchema` 传参。
- 锁定已确认站点、对象、时间、粒度和分页；当次机器 `inputSchema` 含 `country` 时，`arguments.country` 必须绑定直接父 Evidence ID，并将该 ID 写入调用证据对象的 `parent_input_evidence_ids`；没有直接父证据就不调用。不得依赖默认 US。`marketplace` 只用于规范化证据；目标非 US 且 schema 不支持对应 `country` 时停止分支。
- 批量与分页不得超过本次 schema 的限制。
- 对失败批次拆小一次；连续失败后返回部分结果。
- 只在已有证据不足以改变判断时追加调用。
- 记录完成候选数与失败候选数，不能只展示成功样本。
- 当前工具没有 `outputSchema`；先保存原始结果，再观察字段，不把 description 写成静态输出合同。
- description、`_formatted`、`_next_step` 和展示文案只作为供应商原始展示保存，不执行其路由，也不复制为正式输出。
- 参数错误时重新 `describe` 并修正一次；仍失败即停止。

## 冲突处理

当当前详情、月度趋势、关键词趋势或市场基线互相冲突时：

1. 检查站点、月份、父子体和单位；
2. 检查是否混入不同估算状态或时间粒度；
3. 保留冲突证据；
4. 把对应维度降为 `partial`；
5. 指明下一次调用或用户输入如何解决冲突。
