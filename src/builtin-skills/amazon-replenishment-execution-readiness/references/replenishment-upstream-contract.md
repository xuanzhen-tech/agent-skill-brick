<!--
文件功能：定义补货执行准备审查对两个 Product 内置 Skill 正式输出的最小消费合同。
使用方式：由 SKILL.md 执行版本、范围、时点、谱系和候选字段验证时引用。
维护边界：不复刻库存台账、经营分析、预测、安全库存、利润或补货算法。
-->

# 补货执行准备上游合同

## 1. 统一证据与派生合同

### 原始证据 envelope

| 字段 | 要求 |
|---|---|
| `evidence_id` | 当前任务内唯一 |
| `source_type` | `user_input` / `user_upload` / `trusted_upstream_output` / `sif_mcp` |
| `source_locator` | 文件/产物、表/行或字段路径 |
| `source_version` | 来源或上游版本 |
| `observed_at` | 本任务读取时间及时区 |
| `business_time` | 值对应时点/期间及时区 |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `unknown` |
| `transformation_type` | 用户/上游来源为 `raw` / `provider_derived`；SIF 原始来源固定 `reported` |
| `raw_value` | 不覆盖的原始值 |
| `raw_unit_or_currency` | 原单位/币种 |
| `provider_or_owner` | 上游或人工事实责任人 |
| `limitations` | 适用与覆盖限制 |

### 派生 record

正式派生对象本体：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 必要载荷 |
|---|---|---|---|---|---|---|---|
| `candidate` | `candidate_id` | 支撑对象、节点、执行窗口与只读数量的原始 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | 固定 `normalized` | SKU、源/目标节点、只读上游数量、单位、数量来源和执行窗口 |
| `readiness` | `readiness_id` | 支撑准备度判断的 Evidence/Candidate IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | `comparison` / `decision` | 对齐规则、批准状态、执行前提、准备状态、原因和下一责任人 |

两类对象还必须直接关联以下共同元数据：

| 字段 | 要求 |
|---|---|
| `output_id` | 当前任务内唯一 |
| `rule_version` | 对齐/准备度规则版本 |
| `generated_at` | 派生时间及时区 |
| `uncertainty` | 未知、冲突、时效或覆盖限制 |
| `result_status` | `ready` / `ready_with_limitations` / `blocked` / `out_of_scope` |
| `reason_codes[]` | `MISSING_UPSTREAM_CONTRACT` / `UNSUPPORTED_UPSTREAM_CONTRACT` / `UPSTREAM_SCOPE_CONFLICT` / `UPSTREAM_STALE` / `CANDIDATE_QUANTITY_MISSING_OR_CONFLICT` / `APPROVAL_INCOMPLETE` / `EXECUTION_FACTS_INCOMPLETE` / `OUT_OF_SCOPE_REQUEST` |

对象、时间、单位/币种和口径仅为额外比较维度，不能替代两类对象本体的五项血缘字段。

## 2. 可选 SIF 外部需求信号合同

### 2.1 唯一允许的工具

| 工具 | 允许用途 | 禁止用途 |
|---|---|---|
| `ops_get_asin_sales_trend` | 单 ASIN 的供应商销量趋势与季节性背景 | 订单、收入、库存、在途、候选数量或补货算法 |

不得调用其他 SIF 工具，也不得把销量趋势扩张成库存、物流或采购事实。

### 2.2 调用前门禁

1. 当前 Agent definitions 必须存在 `sif_mcp`。
2. 每个工具在本任务首次调用前，只调用外层 `sif_mcp` 并传入 `{"action":"describe","kind":"tool","name":"ops_get_asin_sales_trend"}`；不得把内层名称拼接在外层工具名后形成点式假调用，也不得把它当成独立模型工具。
3. 精确工具名和本次机器 `inputSchema` 是唯一参数合同。description 与 `inputSchema` 冲突时只信 `inputSchema`；描述失败、schema 漂移或参数仍被拒绝时停止该分支。
4. 先确认有父证据的 ASIN 与站点。若实时 `inputSchema` 含 `country`，则调用外层 `sif_mcp` 时必须传入 `{"action":"call","name":"ops_get_asin_sales_trend","arguments":{"country":"<已确认站点对应值>",...}}`，并让 `call.arguments.country` 直接引用站点输入的父 Evidence ID；不得依赖默认 US。目标站点非 US 而 schema 不暴露 `country`，或不支持该站点时停止分支，不猜测参数、枚举或映射。其余 ASIN、窗口、粒度、维度和分页字段同样以实时 schema 为准。
5. 当前工具没有机器级 `outputSchema`，只登记本次实际返回字段。显式屏蔽 `_formatted`、`_next_step`，也不得复制面向其他 Agent/Claude 的格式或路由指令。

### 2.3 SIF 原始来源对象

每次调用结果至少直接保存：

| 字段 | 要求 |
|---|---|
| `evidence_id` | 当前任务内唯一 |
| `source_type` / `source_provider` | 固定 `sif_mcp` / `sif` |
| `source_tool` | 仅允许 `ops_get_asin_sales_trend` |
| `agent_request_id` | 只取当前 AgentTool 调用上下文中的真实 Agent 请求 ID；上下文未暴露时写 `not_returned` |
| `tool_call_id` | 只取当前 AgentTool 调用上下文中的真实工具调用 ID；上下文未暴露时写 `not_returned` |
| `provider_request_id` | 仅在响应真实返回服务端 ID 时填写；否则 `not_returned` |
| `retrieved_at` / `marketplace` | 拉取时间及时区、显式站点 |
| `query_scope` / `temporal_scope` | ASIN、窗口、粒度与时间属性 |
| `coverage_or_pagination` | 返回范围、页码、上限、截断或部分页 |
| `estimation_status` | 按结果自述记录 `reported` / `estimated` / `mixed` / `unknown` |
| `transformation_type` | 原始 SIF 来源固定 `reported` |
| `raw_result_locator` | 原始结果定位 |

`agent_request_id`、`tool_call_id` 和 `provider_request_id` 不得自造或互相替代，也不得以本地 ID 冒充 SIF 服务端 ID。空数组、空字段和缺页分别按 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted` 或有完整零证据的 `true_zero` 登记，不得自动写零。

SIF 证据只能作为 `candidate`/`readiness` 的背景父证据；派生对象仍固定 `source_type=agent` 并直接保存 `parent_evidence_ids`。SIF 分支失败不得改用 Web、浏览器、SP-API 或其他 MCP/API。

## 3. 强制产物清单

| 上游 Skill | 必需 | 本 Skill 的使用方式 |
|---|---:|---|
| `amazon-inventory-ledger-summary` | 是 | 只读消费其正式输出中真实存在、已定义且与候选对象有关的结论 |
| `amazon-operating-analysis` | 是 | 只读消费其正式输出中真实存在、已定义且与候选背景有关的结论 |

任一产物缺失时，不得以 SIF、原始表格或模型推断替代。

## 4. 产物包络最小要求

概念上必须能定位以下信息；实际字段名以当前安装版本的公开合同为准：

| 合同概念 | 要求 |
|---|---|
| 上游 Skill 名称 | 与强制名称精确匹配 |
| 上游 Skill 版本 | 明确且可按当前合同验证 |
| `artifact_id` / 产物唯一标识 | 可追踪 |
| 生成时间及时区 | 明确 |
| 业务数据截止时间及时区 | 明确 |
| 站点/业务范围 | 可确认 |
| 商品范围版本 | 可确认 |
| 来源谱系 | 可追到上游输入或证据 |
| 输出状态 | 成功、部分、阻塞等状态可识别 |

不得把此表中的概念词当作固定 JSON 字段名。先读取实际合同，再做字段映射。

## 5. 字段映射登记

每个消费字段记录：

| 字段 | 说明 |
|---|---|
| `contract_concept` | 当前审查所需概念 |
| `actual_field_path` | 上游真实路径、表/列或段落定位 |
| `upstream_label` | 上游原始标签 |
| `upstream_definition` | 上游声明口径 |
| `value` | 原始值 |
| `unit` | 原始单位 |
| `business_time` | 值对应时点/期间 |
| `value_type` | `fact` / `upstream_derived` / `upstream_recommendation` |
| `availability` | `returned` / `not_returned` / `not_declared` / `parse_failed` |

`not_returned`、`not_declared`、`parse_failed` 都不是零。

## 6. 对齐检查

### 6.1 对象

- Marketplace/站点必须一致。
- SKU 必须使用稳定键精确连接。
- ASIN/FNSKU 仅在两边语义一致时辅助验证。
- 商品名不能独立连接。
- 节点范围不一致时不得合并库存概念。

### 6.2 时间

- 区分生成时间和业务截止时间。
- 记录时区。
- 由用户定义最大陈旧度。
- 不用文件修改时间代替业务时间。
- 两产物时点差超出阈值时交人工确认。

### 6.3 单位

- 件、箱、托不能静默互换。
- 天、周、月的期间定义必须保留。
- 若上游已换算，保留其换算说明；本 Skill 不重做算法。

### 6.4 口径

- 事实、上游派生值和上游建议必须分开。
- 不把某一上游的标签强行映射为另一上游概念。
- 口径不可比较时标记 `incomparable`。

## 7. 候选数量来源

允许：

1. 上游正式产物明确给出的候选数量；
2. 用户在本任务中的明确批准数量；
3. 其他可信正式产物中带版本、谱系和责任人的数量。

禁止：

- 由库存余额和销量自行推算。
- 使用 SIF 销量趋势生成、调整、优化或舍入候选数量。
- 由安全库存或再订货点自行反推。
- 在多个候选间取平均、最大、最小或“最合理”值。
- 为适配包装倍数自行舍入。

## 8. 准备度阻塞表

| 检查点 | 通过条件 | 失败状态 |
|---|---|---|
| 两个强制上游 | 均存在 | `BLOCKED_MISSING_UPSTREAM` |
| 版本/schema/谱系 | 均可按当前公开合同验证 | `BLOCKED_UNSUPPORTED_UPSTREAM_CONTRACT` + `UNSUPPORTED_UPSTREAM_CONTRACT` |
| 范围 | 站点、商品、节点可对齐 | `conflict` |
| 时间 | 时点在用户接受范围 | `stale` |
| 数量 | 有唯一、可追踪候选 | `missing` / `conflict` |
| 批准 | 责任人、时间、范围齐全 | `needs_human_confirmation` |
| 执行资料 | 节点、窗口、责任人齐全 | `missing` |

缺失整个强制上游使用 `BLOCKED_MISSING_UPSTREAM`；存在产物但版本、schema 或谱系不受支持使用 `BLOCKED_UNSUPPORTED_UPSTREAM_CONTRACT`。两者不得混用。

采购、供应商选择、MOQ、包装倍数和交期事实由专家07拥有；本 Skill 只消费专家07带日期正式输出或用户直接确认值，不生成或修改这些事实。

## 9. 负面样例

- 只有库存原始表，于是本 Skill 自行生成补货量。
- 只有经营分析截图，没有版本和业务截止时间，却当作正式上游。
- 上游没返回在途数量，于是填写 0。
- 两份上游的 SKU 名称相似，于是自动连接。
- 用户说“差不多 500 件”，于是标记已批准 500。
- 包装倍数为 12，于是把上游 101 件自动改为 108 件。
- 两个强制上游缺失，却用 SIF 销量信号生成补货数量或写成库存事实。
- 未先 `describe` 就猜测 SIF 参数/字段，或把空结果写成销量为零。
- 准备度通过后自动创建采购单或 FBA 货件。

以上任一情况均不合格。
