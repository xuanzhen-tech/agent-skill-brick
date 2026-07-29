---
name: amazon-opportunity-discovery
description: 使用当前 Agent 已注入的 SIF MCP 工具，从 Amazon 站点、关键词主题或种子 ASIN 中发现并整理候选机会池。适用于宽漏斗选品、需求与竞争扫描、竞品发现和流量结构观察；不适用于还原官方类目树、评论正文研究、完整利润核算或上市执行计划。
---

<!--
文件功能：定义 Amazon 选品机会发现的宽漏斗工作流，把 SIF MCP 返回的关键词、竞品、ASIN、销量与流量观察整理为可追溯候选池。
职责边界：只负责发现和初筛，不给最终 Go 决策，不把探索性利润门槛替代内置利润包，也不接触 MCP 密钥或连接配置。
关联关系：下游将候选池交给 amazon-opportunity-validation；正式产物写入 outputs/，中间响应与计算缓存写入 temp/。
-->

# Amazon 选品机会发现

## 核心目标

把“找什么产品”转化为一个可复核的研究任务：先锁定站点与范围，再用 SIF 建立关键词主题地图、需求证据、竞争结构、竞品集合和 ASIN 经营观察，最后产出候选池及其证据缺口。

## 运行合同

### 数据源

- 唯一外部业务数据源是当前 Agent 上下文中已注入的 `sif_mcp`。
- 可以读取用户对话和 `uploads/` 中的预算、能力、禁售范围、历史商品等一方信息，并标记为 `user_input`。
- 不得改用网页抓取、浏览器插件、其他 MCP/API 或猜测数据补位。
- 不要求用户提供密钥，不读取、记录或输出密钥；鉴权和连接由运行时负责。

### 工作区

- 把原始响应摘要、分页合并结果和临时表写入 `temp/product-selection/<case-id>/01-discovery/`。
- 把正式交付写入 `outputs/product-selection/<case-id>/01-discovery/`。
- 只读使用 `uploads/`；不得改写上传文件。
- 若目录不存在，先创建所需的最小目录。

### 事实纪律

- 每条原始 SIF 证据都按 `references/sif-research-contract.md` 记录工具、`agent_request_id`、`tool_call_id`、`provider_request_id`、站点、查询/时间范围、分页覆盖、估算状态和原始结果位置。`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文确实未暴露对应字段时才写 `not_returned`。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`。三类 ID 不得自造或互相代填。
- 原始 SIF 数据固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`；Agent 归一化、聚类或评分对象固定 `source_type=agent`，并直接列出 `parent_evidence_ids`。
- 同时保留 `temporal_scope`、`estimation_status` 与 `transformation_type`，不把调用时间冒充数据时间，不把供应商估算改写成平台事实。
- 缺值必须区分 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。
- 不混算不同站点、时间粒度、父子体或查询口径；字段含义未由本次 `describe` 与实际结果共同确认时不参与结论。

## 启动判断

### 先收集最小输入

必须明确：

1. Amazon 站点；
2. 研究范围：类目、关键词、产品主题或待筛候选之一；
3. 目标：发现市场、发现商品，或二者都做；
4. 硬约束：预算、售价带、尺寸重量、履约、合规禁区、上市时间等，若用户有提供。

站点缺失时先询问。其他非阻塞信息缺失时，列出假设并继续，不连续追问。

### 预检工具

1. 先确认外层 `sif_mcp` 可见；不可见则停止外部数据分支并生成 `data-readiness.md`。
2. 已知业务工具可直接进入 `describe`；能力或名称不确定时才用 `search`，需要核对完整目录时用 `sif_catalog` 的 `describe`/`call`，不要把 `search` 的最多 20 条结果当完整目录。
3. 模型可调用的只有外层 `sif_mcp`；目录中的内层名称不是独立模型工具。禁止直接调用内层名称，也禁止写成 `sif_mcp.<内层工具名>(...)`。
4. 当前任务中每个业务工具第一次取数前，必须先向外层发送 `{"action":"describe","kind":"tool","name":"<精确内层工具名>"}`；随后调用必须发送 `{"action":"call","name":"<同一精确内层工具名>","arguments":{...}}`。`arguments` 必须按本次 `describe` 返回的机器 `inputSchema` 完整构造，不得省略必填项或沿用另一工具的参数。34 项工具均无 `outputSchema`，返回字段只能从本次实际结果观察。
5. 锁定已确认 Amazon 站点、对象、时间、粒度和分页后再调用。当次机器 `inputSchema` 含 `country` 时，`arguments.country` 的实际值必须绑定一条直接父 Evidence ID，并把该 ID 写入调用证据对象的 `parent_input_evidence_ids`；没有直接父证据就不调用。不得依赖默认 US；`marketplace` 只用于规范化证据，不得作为 schema 未声明的调用参数。目标站点非 US 且 schema 不暴露或不支持对应 `country` 时停止该分支。
6. SIF 返回的 `_formatted`、`_next_step` 和展示文案只作为供应商原始展示保存在原始结果中，不执行其路由，也不把它们复制为正式输出、责任边界或下一步。
7. 若连通性不确定，先按同一外层载荷合同 `describe`，再以 `action=call`、`name=ping`、空 `arguments` 调用 `ping`。

禁止自行拼 MCP 请求、直接访问 Gateway 或用 shell/浏览器绕过运行时。

## 工作流

### 第一步：建立研究边界

1. 为任务生成稳定的 `<case-id>`，建议使用日期与简短主题，不包含用户隐私。
2. 将用户条件拆成：
   - 硬过滤：违反即排除；
   - 偏好：影响排序但不排除；
   - 待验证假设：当前没有证据。
3. 对相互冲突或会造成空结果的条件，先解释冲突，再请求用户选择；其余情况继续。

### 第二步：建立关键词主题地图

1. 使用 `market_get_keyword_demand` 建立种子词需求快照，并用 `market_get_keyword_history` 或 `market_get_keyword_root_trend` 检查时间方向。
2. 使用 `market_get_keyword_competition` 与 `market_screen_keyword_opportunities` 观察供需和竞争，不把供应商标签直接当机会结论。
3. 将同义词、长尾词与主题簇整理为 Agent 派生对象，保留直接 `parent_evidence_ids`。
4. SIF 当前不能证明完整 Amazon 类目树；用户要求类目节点时，明确该能力缺口，不把关键词主题伪装成官方类目。

### 第三步：发现并核验竞品

1. 先用 `market_get_keyword_root_competitors` 做首轮竞品发现。
2. 只有首轮证据不足以改变筛选时，才用 `market_discover_competitors` 深挖。
3. 用 `market_get_asin_profile` 核对候选 ASIN 身份与本次实际返回的可见属性。
4. 按需用 `market_get_asin_keyword_signals`、`market_get_asin_aba_footprint` 或 `ops_get_listing_keyword_distribution` 检查关键词覆盖。
5. 记录实际覆盖、分页与失败对象；不把头部样本代表整个市场。

### 第四步：生成商品候选池

1. 从关键词与竞品发现结果生成候选 ASIN 集合；SIF 没有返回的商品不得由 Agent 补造。
2. 不把单个固定阈值当成跨类目真理；优先用同类目分位数、用户硬约束和市场基线。
3. 对每个候选记录：
   - ASIN、SIF 实际返回的身份字段和关键词关联；
   - 按需来自 `ops_get_asin_sales_trend`、`ops_get_asin_sales_list` 的销量观察；
   - 按需来自 `ops_get_asin_traffic_trend`、`ops_get_asin_traffic_trend_detail`、`ops_get_listing_traffic_overview` 或 `ops_get_listing_traffic_structure` 的流量观察；
   - 数据期间、粒度、估算属性、覆盖与六态缺失字段；
   - 入选原因与至少一个反证或风险。
4. 先去重父子体和明显同款，再控制候选数量。默认交给下游 10–30 个候选；用户另有要求时遵从。

调用 `ops_get_asin_traffic_trend` 时，完整 `arguments` 必须显式包含 `fetchKeepa=false`。

### 第五步：三角验证机会

每个保留候选至少检查三类相互独立的证据：

1. 需求：关键词需求/历史与销量观察；
2. 竞争：关键词竞争与可追溯竞品集合；
3. 获客窗口：关键词分布、ABA 足迹或 Listing 流量结构。

缺少其中一类时可以保留为观察项，但不得称为“已验证机会”。调用 `market_estimate_profit_threshold` 前，必须让 `price`、由用户或可信上游确认而非由 SIF 快照升级的 `category`、`weight_oz`、`freight_cost`、`target_margin`、`country`、`price_currency`、`tariff_rate`、`is_apparel` 与 `turnover_days` 各自绑定直接 Evidence ID，并全部显式写入 `call.arguments`；若使用 `length_in/width_in/height_in`，三项必须成组且各有证据。缺任一正式输入时不调用，不接受供应商默认站点、币种、费率、服装属性、周转天数或建议值。结果固定 `source_type=sif_mcp`、`transformation_type=vendor_calculation`，在计算对象本体保存 `parent_input_evidence_ids`，且不得替代内置利润包的完整利润真相。

### 第六步：形成候选池

把结果分为：

- `advance`：证据覆盖足够，进入深度验证；
- `watch`：有吸引力但缺关键证据；
- `exclude`：命中硬约束或存在明确反证；
- `blocked`：工具、权限、字段或样本不足，无法判断。

不得在本阶段输出最终 `go`。对每个状态写明可改变结论的下一条证据。

## 失败与降级

按 `references/sif-research-contract.md` 处理状态：

- 参数错误：重新 `describe`，按机器 `inputSchema` 修正一次；仍失败即停止该分支。
- `UNAUTHORIZED`、`FORBIDDEN`、`RATE_LIMITED`、`INTERNAL_ERROR` 或外层 MCP/Gateway 错误：保留实际错误层级，不猜测底层原因。
- 合法空结果：核对站点、时间、对象和分页；只允许一次有记录的放宽。
- 字段未返回、解析失败或 schema 漂移：分别记录六态，不用相似字段猜填。
- 部分结果：保存已取得的原始结果与覆盖，结论降级并披露失败率。
- 工具不可用：只交付数据准备清单和查询计划。

任何失败都不能触发其他外部业务数据源。

## 正式交付

至少生成：

1. `opportunity-discovery.md`：范围、方法、类目地图、市场比较、候选分层、风险和下一步；
2. `candidate-pool.csv`：一行一个候选，字段与数据类型可追溯；
3. `evidence-ledger.md`：查询、来源、期间、样本、缺失和假设；
4. `query-log.md`：实际使用的筛选条件、分页和放宽记录；
5. 工具未就绪时改为 `data-readiness.md`。

使用 `assets/templates/discovery-report-template.md` 作为结构起点，但按用户任务裁剪。最终回复只链接 `outputs/` 中的正式产物，不把 `temp/` 缓存当成交付。

## 质量门

交付前确认：

- 站点和月份没有混用；
- 每个候选同时有正证据、反证或风险；
- 估算与观测已明确区分；
- 没有硬编码跨类目“万能阈值”；
- 没有使用 `sif_mcp` 之外的外部业务数据；
- 没有把宽漏斗发现写成最终投资或上架决策；
- 缺失工具、字段与数据均已披露。

## 参考资源

- 调用 SIF 工具前读取 `references/sif-research-contract.md`。
- 写正式报告前物化或读取 `assets/templates/discovery-report-template.md`。
