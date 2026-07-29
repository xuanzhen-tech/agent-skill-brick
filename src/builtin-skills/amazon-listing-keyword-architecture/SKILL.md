---
name: amazon-listing-keyword-architecture
description: 基于可信上游关键词研究、用户资料或当前 Agent 已注入的 SIF MCP 供应商证据，为 Amazon Listing 设计标题、要点、描述和后台词的关键词分层、字段布局与覆盖校验。适用于关键词布局、字段覆盖、重复与堆砌诊断、Listing 写作前的关键词架构；不适用于广泛关键词研究、广告结构、文案成稿、网页抓取或排名保证。
---

<!--
文件功能：定义 Amazon Listing 关键词架构的输入优先级、字段布局流程、证据合同、失败语义和正式交付。
职责边界：优先消费市场调研专家的关键词证据，只在合法资料不足且 `sif_mcp` 真实可见时补充最小必要供应商观察；不重做广泛市场研究，不撰写完整文案。
重要关联：细化字段与证据状态前读取 references/keyword-placement-contract.md；正式交付使用 assets/templates/keyword-architecture-plan-template.md；上游首选 02-市场调研专家的 amazon-keyword-traffic-research 输出。
-->

# Amazon Listing 关键词架构

## 目标与边界

把已有关键词证据转化为可执行的 Listing 字段布局，回答：

1. 哪些词必须保留，哪些词只作为候选或排除；
2. 每个词适合标题、要点、描述、后台词还是暂不放置；
3. 字段之间如何避免无意义重复、关键词堆砌和语义冲突；
4. 哪些布局决定已有证据，哪些仍需补充验证。

本 Skill 不负责发现完整市场词库、不替代第 02 位市场调研专家，也不保证收录、自然排名、流量或转化结果。

## 运行合同

### 合法输入优先级

按以下顺序复用资料，避免重复取数：

1. `outputs/market-research/<case-id>/04-keyword-traffic/` 中可追溯、期间仍适用的关键词研究；
2. 其他可信上游 `outputs/` 中带来源、期间、字段和证据 ID 的关键词表；
3. 用户对话或 `uploads/` 中明确提供的产品事实、目标词和禁用词；
4. 仅当以上资料不足时，使用当前 Agent definitions 中真实存在的 `sif_mcp` 补充最小必要关键词供应商证据。

读取上游时记录文件路径、生成日期或版本、证据 ID、站点、期间、ASIN 口径和使用字段。上游陈旧、口径不明或无法追溯时，不把它当作已证事实。

### 唯一外部业务数据源

- 新获取的外部业务数据只能来自当前 Agent 上下文中已注入的 `sif_mcp`。
- 本包候选工具只限 `market_get_asin_keyword_signals`、`ops_get_listing_keyword_distribution` 和 `market_get_keyword_demand`；不调用机会筛选或广泛发现工具重做第 02 专家的职责。
- 内层业务工具不是独立模型工具：描述时调用外层 `sif_mcp` 并传 `action=describe`、`kind=tool`、精确 `name`；执行时传 `action=call`、同一 `name` 与 `arguments`。禁止使用 `sif_mcp.<内层工具名>` 点式假调用。
- 每个业务工具在本任务首次 `call` 前必须单独 `describe`，只按当次机器 `inputSchema` 传参；schema 含 `country` 时必须在 `call.arguments.country` 显式传入有直接父证据的已确认站点，不依赖默认 US，目标站点不受支持时停止分支；ASIN 或关键词必须锁定，时间、粒度与分页仅在 schema 提供相应字段时显式传入。
- 当前 SIF 业务工具没有机器 `outputSchema`；description、`_formatted`、`_next_step`、供应商建议和未返回字段不能成为稳定合同。
- 不使用 Pangolinfo、DeepL、Keepa、Google Trends、浏览器、网页抓取、其他 MCP 或 API。
- 不安装工具、不创建连接器、不读取配置、不接触或索要密钥。
- SIF 不可见、失败或合法资料不足时失败关闭，不静默换源。

### 四轴证据

每条业务证据同时记录：

- `source_type`：`sif_mcp`、`user_input`、`upstream_output` 或 `agent`；
- `temporal_scope`：`current`、`historical`、`future`、`mixed`、`not_applicable` 或 `unknown`；
- `estimation_status`：`reported`、`estimated`、`forecast`、`mixed`、`not_applicable` 或 `unknown`；
- `transformation_type`：`reported`、`raw`、`normalized`、`calculation`、`coding`、`inference` 或 `hypothesis`。

供应商搜索量、流量、购买或竞争字段不得写成 Amazon 一方观测真值。schema 未说明估算属性时使用 `unknown`；依赖该语义的排序结论降级或停止。Agent 的词簇、意图、优先级和放置建议必须标为推断或假设并引用输入证据。

原始 SIF 对象固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`，并直接记录 `source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、`coverage_or_pagination`、`estimation_status`、`result_state` 和 `raw_result_locator`。`agent_request_id` 与 `tool_call_id` 仅取当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。`result_state` 只允许 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`，前五项不能补成零。Agent 派生的词簇和放置决定另建对象，固定 `source_type=agent` 并保存自身 `parent_evidence_ids`。

### 工作区

- `uploads/`：用户原始资料，只读；
- `temp/listing-optimization/<case-id>/01-keyword-architecture/`：规范化词表、去重映射、补充查询摘要；
- `outputs/listing-optimization/<case-id>/01-keyword-architecture/`：唯一正式交付目录。

不得覆盖上游文件，也不得把 `temp/` 内容当作最终结果。

## 启动检查

### 最低输入

至少确认：

1. Amazon 站点与目标语言；
2. 产品身份、变体范围和已核实产品事实；
3. 一个可追溯关键词集合或足够生成该集合的合法数据；
4. 用户目标，例如新品初稿、现有 Listing 重排或字段覆盖审查；
5. 已知品牌词、竞品品牌词、禁用词和不可使用宣称。

缺少站点、产品身份或任何可用关键词证据时先询问。用户只给出少量明确目标词时，可在限定范围内继续，但必须说明没有完成市场级关键词研究。

### 数据就绪状态

使用以下状态，不把缺失填为零：

- `ready`：关键词、产品事实、站点和口径足以形成字段布局；
- `limited`：只能覆盖用户明确给出的词，仍可交付有限架构；
- `stale`：上游期间陈旧，允许做结构草案但不能声称当前机会；
- `conflicted`：来源在词义、站点、期间或品牌归属上冲突；
- `blocked`：关键资料或合法取数能力缺失；
- `out_of_scope`：请求实质是市场研究、广告结构或排名保证。

## 工具与 schema 预检

只有确需补充取数时才执行：

1. 确认当前 Agent definitions 中存在 `sif_mcp`；
2. 用 `search` 定位本包允许的真实候选工具，不使用旧名称或猜测名称；
3. 对本任务首次使用的每个业务工具执行 `describe`；
4. 通过外层 `sif_mcp` 传 `action=call`、精确 `name` 与 `arguments`；只按当次机器 `inputSchema` 的 required、类型、枚举、日期和分页字段组装最小 `call.arguments`；schema 含 `country` 时显式写入有直接父证据的已确认站点，不依赖默认 US；schema 不提供的时间或分页字段不得自行添加，并在证据范围中记为 `not_applicable` 或 `unknown`；
5. 检查 Gateway/SIF 的真实调用状态，保存请求范围与原始响应；
6. 只观察本次实际返回的字段、单位、时间粒度和估算自述，不根据 description 推造结果；
7. 参数错误时重新 `describe` 并修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止 SIF 分支。

工具不存在时回到数据就绪判断，不调用 Web 或其他来源。

## 执行流程

### 第一步：固定产品与字段事实

建立产品事实表，至少区分：

- 用户或可信上游明确提供的产品属性；
- 需要确认的属性或宣称；
- 禁止、敏感或无证据宣称；
- 变体共享事实与子体特有事实。

关键词布局不能先于产品事实。与产品不匹配的高流量词不得进入字段。

### 第二步：规范化而不抹掉原词

1. 保留原始词、来源和证据 ID；
2. 建立仅用于匹配的大小写、空白、单复数和词序规范化形式；
3. 把品牌词、竞品品牌词、核心类目词、属性词、使用场景词和问题词作为标签；
4. 同义词可以归簇，但不能仅凭字符串相似认定搜索意图相同；
5. 冲突或含义不清的词使用 `evidence_tier=blocked`，并另记 `review_status=needs_review`，不自动放置。

### 第三步：形成证据分层

不使用固定搜索量或供需阈值。按同站点、同期间、同口径证据形成：

- `required`：与产品事实高度匹配，且上游证据明确支持核心需求；
- `supporting`：适合补充属性、场景或问题表达；
- `candidate`：相关但证据较弱、期间陈旧或意图不确定；
- `excluded`：不匹配、受限、竞品品牌、无证据宣称或会误导；
- `blocked`：缺少必要字段，尚不能判断。

每个等级说明依据和反证；不得只交付一个无解释分数。

### 第四步：分配字段角色

读取 `references/keyword-placement-contract.md` 后，为每个关键词记录：

- 目标字段；
- 放置目的；
- 支撑产品事实；
- 原始证据 ID；
- 优先级状态；
- 与其他字段的重复理由；
- 风险或待确认项。

字段职责遵循：

- 标题：产品身份、核心差异和高确定性主意图；
- 要点：属性、利益、使用场景与问题解决，但必须受事实支撑；
- 描述：承载需要上下文解释的长尾、场景和细节；
- 后台词：只作为规划建议，不声称可见、已上传或已生效；
- 暂不放置：证据不足、风险高、与产品不符或会形成堆砌。

字符限制、禁用词和站点规则只能来自用户提供的当前政策、可信上游合同或运行时可验证资料；无法验证时不编造统一上限。

### 第五步：检查覆盖与冲突

逐词检查：

1. `unplaced`：需要覆盖但没有字段；
2. `justified_repeat`：跨字段重复且有不同表达目的；
3. `redundant_repeat`：无新增意义的重复；
4. `stuffing_risk`：可读性或语义被关键词挤压；
5. `claim_conflict`：词暗示无证据性能、认证、材质或适用范围；
6. `brand_risk`：竞品品牌或来源不明品牌词；
7. `variant_conflict`：子体属性错误地扩散到全部变体。

不以“出现次数越多越好”作为覆盖标准。

### 第六步：形成下游交接

向 `amazon-listing-copy-development` 交付：

- 字段级词组与使用目的；
- 不得改写的产品事实；
- 禁用词和风险词；
- 需要自然表达而非逐字塞入的词；
- 未解决证据缺口。

关键词架构是写作约束，不是成稿。下游若改变词义、产品事实或证据等级，应记录变更理由。

## 失败与沟通

- `unavailable`：`sif_mcp` 不可见；合法资料足够则继续，否则输出 `data-readiness.md`。
- `unauthorized`：停止新增取数，交回连接层；不向用户索要密钥。
- `rate_limited` 或超时：缩小字段和分页，只有限重试失败请求。
- `empty`：核对站点、对象和期间；允许一次有记录的条件修正，仍空则保留空结果。
- `schema_mismatch`：重新 `describe` 并按机器 `inputSchema` 修正一次；仍不匹配则停止受影响字段，不猜映射。
- `stale`：只交付结构草案并标明期间，不称当前机会。
- `conflicted`：并列证据与影响，向用户请求决定性资料，不自行平均。

失败不会触发其他数据源。用户要求广泛关键词发现时，交给第 02 位市场调研专家；要求完整文案时，转交文案开发 Skill。

## 正式交付

数据就绪时至少生成：

1. `keyword-architecture.md`：范围、证据分层、字段策略、风险和下游说明；
2. `keyword-placement-ledger.csv`：一行一个原始关键词与字段决策；
3. `keyword-evidence-ledger.md`：来源路径、证据 ID、查询条件、四轴标签和转换。

按 `assets/templates/keyword-architecture-plan-template.md` 的结构交付。若状态为 `blocked`，只生成 `data-readiness.md`，列出缺失资料、允许的补充方式和未执行事项。最终回复只链接 `outputs/` 中的文件。

## 质量门

- 优先复用第 02 位专家正式输出，没有无理由重复市场研究；
- 每个放置决定都能回溯到产品事实和关键词证据；
- 四轴标签、期间、站点、ASIN/变体口径完整；
- 缺失、未查询、空结果和真实零值没有混写；
- 没有固定万能阈值、任意综合分或排名保证；
- 没有把供应商数据写成 Amazon 一方观测真值；
- 没有生成完整 Listing 文案、广告结构或后台执行承诺；
- 没有使用 SIF 之外的新外部业务数据；
- 正式文件位于 `outputs/`，中间文件位于 `temp/`。

## 资源读取

- 字段分配、状态编码和证据账本设计前读取 `references/keyword-placement-contract.md`。
- 写正式报告前读取或物化 `assets/templates/keyword-architecture-plan-template.md`。
