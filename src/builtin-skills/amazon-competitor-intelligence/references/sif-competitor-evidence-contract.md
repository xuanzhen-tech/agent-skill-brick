<!--
文件功能：定义竞品研究中 SIF MCP 的能力路由、实时 schema 合同、四轴证据封装与失败关闭规则。
职责边界：只描述 sif_mcp 应如何被核验和使用，不保证工具存在，不配置连接，也不允许用其他数据源补位；纯自动化 out_of_scope 请求不进入本合同。
关联关系：由 ../SKILL.md 的工具预检、竞品集合建立、当前详情逆向和失败处理阶段读取。
-->

# SIF 竞品证据合同

## 运行时事实优先

唯一外层入口是 `sif_mcp`。当前任务中每个业务工具第一次 `call` 前必须先精确 `describe`。机器 `inputSchema` 是唯一参数合同；所有当前工具均无 `outputSchema`，返回字段只能从本次实际结果观察。description、`_formatted`、`_next_step` 与展示文案只作为供应商原始展示保存，不执行其路由，也不复制为正式输出。

描述文字与机器 schema 冲突时服从 schema。参数校验失败时重新 `describe` 并修正一次；仍失败即停止。不得直连 Gateway、构造鉴权请求或处理密钥。

## 能力路由

| 研究动作 | SIF 工具 | 最小目的 | 不得推断 |
|---|---|---|---|
| 主 ASIN 上下文 | `market_get_asin_profile`、`market_get_asin_keyword_signals` | 核对身份和可见关键词关系 | 不补齐未返回 Listing 或商品属性 |
| 首轮竞品发现 | `market_get_keyword_root_competitors` | 建立可追溯竞品集合 | 返回顺序不自动等于竞争强弱 |
| 竞品深挖 | `market_discover_competitors` | 首轮不足时扩大 | 不用样本代表整个市场 |
| 销量与流量比较 | `ops_get_asin_sales_trend`、`ops_get_asin_sales_list`、`ops_get_asin_traffic_trend`、`ops_get_asin_traffic_trend_detail`、`ops_get_listing_traffic_overview`、`ops_get_listing_traffic_structure` | 比较供应商可见经营信号 | 不写成 Amazon 官方或因果事实 |
| 关键词结构 | `market_get_asin_aba_footprint`、`ops_get_listing_keyword_distribution` | 比较关键词足迹 | 不推断后台搜索词 |
| 广告可见结构 | 必要的 `ads_*` 工具 | 提供供应商可见广告背景 | 不写成账户真相、预算真相或因果 |

## 相邻能力路由

| 研究证据 | 责任 Skill | 本 Skill 的允许动作 | 明确禁止 |
|---|---|---|---|
| 评论与 VOC | `amazon-review-voc-research` | 只读其正式上游输出，保留原 evidence ID、来源文件和四轴 | SIF 无评论正文能力；不自行生成评论痛点 |
| 关键词与流量结构 | `amazon-keyword-traffic-research` | 只读其正式上游输出，保留原 evidence ID、来源文件和四轴 | 不重复调用相同证据 |

相邻能力的输出是可选上游证据，不是本 Skill 的工具调用步骤。缺少这些上游输出时，只登记证据缺口，不越界获取数据，也不以模型常识补齐。

## 可见结构护栏

只有实际结果同时满足“字段存在”和“语义明确”时才可分析。ASIN profile、关键词、流量或广告工具返回的结构均是 SIF 供应商信号，不是 Listing 原文、图片语义、视频内容、评论正文、广告账户或转化因果。字段未返回时使用六态，不把缺失写成业务上不存在。

## 统一四轴证据模型

每条证据必须同时填写以下四轴，不得把时间、估算和变换性质压成一个类型：

### `source_type`

- `sif_mcp`：当前 Agent 实际调用的 SIF 工具返回的原始证据；
- `user_input`：用户对话或 `uploads/` 中提供的证据；
- `upstream_output`：当前记录从已交付的上游 `outputs/` 进入本研究；
- `agent`：本 Skill 新生成的规范化、计算、编码、推断或假设记录。

读取上游 `outputs/` 时，本层 `source_type` 统一使用 `upstream_output`，并另记上游来源文件、上游 evidence ID 和上游原四轴。这样既不把本次读取伪装成本次 MCP 调用，也不丢失底层来源语义。上游原时间或估算轴缺失时使用 `unknown`；原来源或转换轴缺失时保留空值并把证据状态降为 `partial`，不得猜测。

### `temporal_scope`

- `current`：查询时点或明确 as-of 时点的当前截面；
- `historical`：已结束历史期间或历史序列；
- `future`：未来 horizon；
- `mixed`：一条有明确子证据的记录有意汇总多种时间范围；
- `not_applicable`：该记录不声明时间性质；
- `unknown`：schema 或上游证据无法确认时间性质。

### `estimation_status`

- `reported`：运行时 schema 或可信输入元数据明确表明该字段是来源报告值、且不是估算或预测；不等于 Amazon 一方 `observed`，也不自动证明真实性；
- `estimated`：来源明确说明为估算；
- `forecast`：来源明确说明为未来预测；
- `mixed`：一条有明确子证据的记录有意汇总多种估算性质；
- `not_applicable`：该记录不声明数值估算性质；
- `unknown`：schema 或上游证据无法确认估算性质。

### `transformation_type`

- `reported`：按来源语义保留的原始字段或文本；
- `normalized`：有明确规则、输入证据和保留原值的规范化结果；
- `calculation`：可复核的差值、占比、去重或集合运算；
- `coding`：按显式规则形成的分类编码；
- `inference`：证据支持但不等于来源事实的研究解释；
- `hypothesis`：需要后续证据验证的可能解释。

四轴彼此独立。例如 SIF 返回的历史销量估算写为 `sif_mcp + historical + estimated + reported`；基于它计算的变化写为 `agent + historical + estimated + calculation` 并链接直接父 evidence ID。业务数值的估算性质未明确时使用 `unknown`；不得因描述未写“估算”而自动升级。

每条证据只使用一个 `transformation_type`。同一来源字段既保留原值又生成规范化值时，应建立相互链接的 `reported` 与 `normalized` 记录；不得在一行中混合多个变换阶段。

## 证据封装

```text
evidence_id
source_type: sif_mcp | user_input | upstream_output | agent
source_provider: sif | user | upstream | agent
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
transformation_type
raw_result_locator
parent_evidence_ids
parent_input_evidence_ids
field_state: not_returned | not_queried | parse_failed | missing | conflicted | true_zero
upstream_source_file: 上游文件路径；非上游证据写 not_applicable
upstream_evidence_id: 上游原 evidence ID；非上游证据写 not_applicable
upstream_source_type: 上游原来源轴；非上游证据写 not_applicable
upstream_temporal_scope: 上游原时间轴；非上游证据写 not_applicable
upstream_estimation_status: 上游原估算轴；非上游证据写 not_applicable
upstream_transformation_type: 上游原处理轴；非上游证据写 not_applicable
entity_id: ASIN 或上游候选 ID
parent_child_scope: parent | child | mixed | unknown
limitations: 口径与样本限制
```

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文确实未暴露对应字段时才写 `not_returned`。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`。三类 ID 不得自造或互相代填。`retrieved_at` 不能冒充数据日期；响应没有数据时间时 `temporal_scope=unknown` 并记录缺口。

## 调用节制

1. 锁定已确认站点、对象、时间、粒度和分页；当次机器 `inputSchema` 含 `country` 时，`arguments.country` 必须绑定直接父 Evidence ID，并将该 ID 写入调用证据对象的 `parent_input_evidence_ids`；没有直接父证据就不调用。不得依赖默认 US。`marketplace` 只用于规范化证据；目标非 US 且 schema 不支持对应 `country` 时停止分支。
2. 每个业务工具首次 `call` 前精确 `describe`。
3. 先用 `market_get_keyword_root_competitors` 建立小范围竞品集合。
4. 仅在首轮不足时调用 `market_discover_competitors`。
5. 对会影响结论的 ASIN 最小化追加销量、流量、关键词或广告结构工具。
6. 达到足以回答用户问题的证据覆盖后停止，并记录成功、空结果和失败对象。

## 失败关闭

纯自动定时监控、创建告警或持续订阅已在 `SKILL.md` 路由为 `out_of_scope`，不得以工具不可见为由进入本节或生成 `data-readiness.md`。

- 关键工具不可见：只阻塞新增取数；已有合法资料足够时保留其来源继续分析，不足时输出 `data-readiness.md`。
- 参数错误：重新 `describe` 并修正一次；仍失败即停止。
- 外层 MCP/Gateway 或 SIF 鉴权、权限、限流、内部错误：保留真实层级，不索要密钥、不猜原因。
- 字段缺失、类型变化或解析失败：按六态停止受影响字段。
- 部分 ASIN 失败：保留成功结果并披露失败率。
- 空结果：校验站点、ASIN 和父子体；一次有记录的修正后仍为空则停止该分支。

任何状态都不能触发网页、浏览器或其他 MCP/API。
