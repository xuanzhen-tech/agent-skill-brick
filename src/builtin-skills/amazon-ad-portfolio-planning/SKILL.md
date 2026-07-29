---
name: amazon-ad-portfolio-planning
description: 基于商品目标、站点、账户范围、预算边界、上游关键词和已验证利润约束，设计可供人工实施的 Amazon 广告 Portfolio、Campaign、Ad Group、Target 与 Ad 结构规格，并可用 SIF 广告可见结构与关键词信号作外部观察。适用于新建广告架构、重组计划、命名治理和上线前就绪检查；不适用于调用 Ads API、创建或修改广告、自动调价、预算执行或用 SIF 冒充广告账户数据。
---

<!--
文件功能：定义 Amazon 广告组合规划中的账户锚点、实体层级、目标映射、预算护栏、命名和人工实施交接。
职责边界：只形成可审核规格，不创建、暂停、归档或修改广告；SIF 只可补充广告可见结构、关键词与流量观察，不能提供用户广告账户元数据或绩效事实。
重要关联：实体、状态和规划字段见 references/ad-portfolio-entity-contract.md；正式交付使用 assets/templates/ad-portfolio-plan-template.md；关键词研究由第02专家拥有，利润边界由第14专家提供。
-->

# Amazon 广告组合规划

## 目标与完成定义

把“帮我搭广告”转成可审核、可实施、可回滚的结构规格：

1. 本次计划属于哪个站点、账户、profile、品牌和商品范围；
2. Portfolio、Campaign、Ad Group、Target 与 Ad 如何分层；
3. 每个实体服务什么目标、商品、词簇、受众假设或防守任务；
4. 预算、竞价和状态建议受哪些证据与利润边界约束；
5. 哪些字段已确认，哪些必须由广告操作者在平台中核对；
6. 人工执行后怎样回填稳定 ID 和版本。

完成时顶层 `result_status=ready`；存在不阻塞人工规划的缺口时为 `ready_with_limitations`。这两种结果都不是“广告已创建”。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的广告目标、商品清单、账户/站点信息、现有结构导出、品牌限制、预算和历史经验；
- 可信上游 `outputs/` 中的第02专家关键词架构、产品/市场证据、Listing 约束、活动计划和第14专家利润/价格护栏；
- 用户提供的一方广告账户元数据和现有实体 ID；
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在需要补充 ASIN 广告可见结构、关键词或流量观察且当次机器 schema 支持时使用。

SIF 返回的 Campaign/Ad Group 标识、结构或贡献分数只属于供应商可见观察，不证明用户账户的 profile、Portfolio、实体配置、预算、竞价、状态、花费、点击或归因订单事实。

### 唯一外部业务数据源

- 新外部业务数据只允许通过当前 Agent 已注入的 `sif_mcp` 获取；
- 运行时 tool definitions、通过外层 `sif_mcp` 执行 `action=describe`、`kind=tool`、`name=<候选工具>` 所返回的机器 `inputSchema`，以及实际调用结果为接口真相；正式调用使用 `action=call`、`name=<候选工具>`、`arguments={...}`，description 只作说明，不能放宽机器合同；
- 候选路由限于 `ads_get_asin_ad_structure`、`ads_get_asin_ad_historical_feature_profile`、`market_get_asin_keyword_signals` 和 `market_assess_keyword_promotion`，不得调用猜测名称；
- 不使用 Amazon Ads API、SP-API、Sorftime、Keepa、Web、浏览器、Meta、Google 或其他 MCP/API；
- 不索取 LWA、OAuth、广告平台或代理密钥，不安装连接器；
- SIF 不可见或不支持所需字段时，依赖合法输入；仍不足则失败关闭。

当前 SIF 工具没有机器级 `outputSchema`。不得把 description、`_formatted`、`_next_step`、供应商建议或本次未返回的字段写成稳定合同；外层 `call.arguments` 通过后，内层参数仍可能被 Gateway/SIF 拒绝，必须检查真实状态。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/01-portfolio-planning/` 存放实体草图、目标映射、冲突和实施清单；
- `outputs/advertising/<case-id>/01-portfolio-planning/` 存放唯一正式规划；
- 人工执行后的 ID 回填作为新版本输入，不覆盖原计划。

### 双层证据谱系

输入 `input_evidence` 至少记录：

- `evidence_id`
- `source_path`
- `source_type`
- `source_date`
- `source_version`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 站点、账户、商品和期间范围
- 限制

原始 SIF 观察还直接记录 `source_type=sif_mcp`、`source_provider=sif`、`source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`query_scope`、覆盖/分页和 `raw_result_locator`；其 `transformation_type=reported`，`estimation_status` 按结果自述保留 `reported` 或 `estimated`。`agent_request_id` 与 `tool_call_id` 取当前 AgentTool 调用上下文中的真实值；上下文未暴露时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`，不得用本地 ID 冒充。

Agent 产生的结构、命名、预算情景、目标映射和状态建议属于 `agent_output`，记录 `output_id`、`parent_evidence_ids`、转换类型、假设状态和结论上限；对象本体不得继承 SIF 的来源类型。

## 启动检查

### 最低输入

至少需要：

1. Amazon 站点；
2. 广告账户或 profile 范围；未知时必须阻塞实施；
3. 商品稳定标识、变体范围和可投放状态的用户确认；
4. 广告目标和评估时间窗；
5. 预算总边界或明确 `tbd_by_owner`；
6. 第02专家或用户提供的关键词/目标证据；
7. 第14专家或用户提供的利润与价格边界，若需要预算或竞价判断。

### 唯一顶层结果合同

每次运行只使用一组顶层结果字段：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `ACCOUNT_SCOPE_MISSING | PRODUCT_SCOPE_CONFLICT | KEYWORD_EVIDENCE_MISSING | ECONOMIC_GUARDRAIL_MISSING | PLATFORM_ENUM_CONFIRMATION_REQUIRED | PARTIAL_RESULT | OUT_OF_SCOPE_REQUEST`

`reason_codes[]` 为零个或多个稳定原因码；`ready` 时通常为空。不得再用 `planning_status`、`readiness_status` 或其他顶层状态字段表达同一结果。实体的 `status`、人工批准状态和平台回填状态是局部生命周期字段，不替代 `result_status`。

账户、站点或商品身份不明时，不得输出可直接执行的实体规格。

## SIF 外部观察预检

只有市场/关键词观察不足时：

1. 确认 `sif_mcp` 在当前 Agent definitions 中存在；
2. 对本任务首次使用的每个候选工具，通过外层 `sif_mcp` 单独执行 `action=describe`、`kind=tool`、`name=<候选工具>`；
3. 只按当次机器 `inputSchema` 组装站点、ASIN、关键词、时间、粒度和分页，并以外层 `sif_mcp` 的 `action=call`、`name=<候选工具>`、`arguments={...}` 发起正式调用；参数说明冲突时失败关闭；
4. 只要运行时 `inputSchema` 含 `country`，就把有直接父证据的已验证站点映射显式写入 `arguments.country`，不得默认 `US`；目标为非美国且 schema 缺少或不支持该国家时，停止该外部观察分支；
5. 发起最小请求并记录工具、参数、调用 IDs、覆盖和实际返回字段；
6. 把供应商观察标为 `source_type=sif_mcp` 与 `reported|estimated`；
7. 调用 `market_assess_keyword_promotion` 时，`arguments` 必须显式包含已由父证据验证的 `own_price`、`own_margin` 与 `country`，并保存三项各自的输入 `evidence_id`；任一项缺失、冲突或未经验证都不得调用，结果只作外部经济性假设；
8. 不把自然搜索、供应商广告结构或贡献分数命名为用户广告账户字段；
9. 用 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero` 区分结果；schema 漂移时停止该分支，不猜映射或换源。

## 执行流程

### 第一步：冻结账户与商品锚点

记录：

- `marketplace_id`
- `account_scope_id`
- `profile_id` 或 `missing`
- `brand_scope`
- `product_id`、ASIN/SKU/变体范围
- 计划版本和决策日期

相同名称但不同稳定 ID 的实体不得合并。profile 未确认时必须输出 `result_status=blocked` 且 `reason_codes[]` 包含 `ACCOUNT_SCOPE_MISSING`。

### 第二步：定义目标与成功合同

每个目标记录：

- 业务目标；
- 主指标、护栏指标和观察指标；
- 指标来源与期间；
- 是否需要一方广告报告；
- 与利润、库存、Listing、促销的前置关系；
- 什么结果只代表相关，不代表因果。

不得用“提升排名”“增加销量”作为没有分母和时间窗的成功定义。

### 第三步：消费上游关键词与产品证据

第02专家单一拥有关键词发现、需求和竞争研究。本 Skill 只消费：

- Keyword/Cluster ID；
- 产品相关性与排除属性；
- 意图、阶段和站点；
- 证据日期和供应商口径；
- 推荐放置或待验证假设。

不重新做关键词研究，也不把 SIF 关键词或流量信号写成广告点击量。

### 第四步：设计实体层级

按用户目标和可操作边界设计：

- Portfolio：业务目标、品牌/产品线、预算治理；
- Campaign：广告类型、目标阶段、预算和状态；
- Ad Group：商品与目标的内聚集合；
- Target：关键词、商品或受众假设；
- Ad：稳定商品身份和资格确认。

不要为“最佳实践”机械拆分。只有目标、预算、商品、匹配逻辑或评估方式不同才拆。

### 第五步：建立稳定 ID 与命名

计划阶段使用内部 `plan_*_id`。人工创建后回填平台稳定 ID：

- 名称用于阅读；
- 稳定 ID 用于联接、版本和绩效归属；
- 改名不产生新实体；
- 缺 ID 的旧导出不能仅凭名称自动合并；
- 命名规则应编码站点、目标、商品范围和版本，但不泄露敏感信息。

### 第六步：分离元数据与绩效

元数据包括实体层级、状态、预算、竞价策略和目标设置；绩效包括曝光、点击、花费、归因销量等。

- 规划时可以没有绩效；
- 绩效报告不得覆盖实体元数据；
- 两者只有稳定 ID、站点和期间一致时才联接；
- 规划实体未创建时不得伪造绩效字段。

### 第七步：设计预算与竞价护栏

仅形成情景和限制：

- 总预算上限和各实体可接受范围；
- 第14专家提供的保本/贡献边界；
- 库存、促销和 Listing 就绪条件；
- 试验阶段的停止或复核触发；
- 需要人工批准的预算和竞价字段。

不得使用固定 70/20/10、生命周期比例、行业 ACoS 或通用竞价系数。

### 第八步：目标与排除逻辑

为每个 Target 记录：

- 来源 Keyword/Target ID；
- include/exclude 属性；
- 匹配或目标类型是否由用户/平台资料确认；
- 产品锚点；
- 与其他实体的重叠和用途；
- 迁移或否定前所需真实报告证据。

没有平台当前枚举时使用抽象类型和 `tbd_platform_enum`，不得猜枚举。

### 第九步：形成实施批次

按依赖拆成可回滚批次：

1. 人工确认账户、商品和权限；
2. 创建/核对 Portfolio；
3. 创建 Campaign；
4. 创建 Ad Group；
5. 添加 Target 与 Ad；
6. 复核预算、竞价、状态和命名；
7. 回填平台稳定 ID；
8. 由人工批准是否启用。

本 Skill 不执行这些动作。

### 第十步：上线前质量门

逐项检查：

- 站点、profile、商品和品牌范围；
- 每个实体的目标和唯一父级；
- 预算合计与总护栏；
- 关键词来源和排除属性；
- 利润、库存、Listing 和活动依赖；
- 稳定 ID 回填要求；
- 人工批准人与回滚条件。

## 失败与降级

- `ACCOUNT_SCOPE_MISSING`：`blocked`，只交付数据准备清单；
- `PRODUCT_SCOPE_CONFLICT`：`blocked`，暂停实体规划；
- `KEYWORD_EVIDENCE_MISSING`：`ready_with_limitations`，只规划非关键词结构或路由02；
- `ECONOMIC_GUARDRAIL_MISSING`：`ready_with_limitations`，可给结构，不给确定预算/竞价；
- `PLATFORM_ENUM_CONFIRMATION_REQUIRED`：`ready_with_limitations`，使用抽象字段并标 `tbd_platform_enum`；
- `schema_mismatch`：重新 `describe` 并修正一次；仍不匹配则停止 SIF 背景分支；
- `PARTIAL_RESULT`：`ready_with_limitations`，交付已证结构与显式 TBD；
- `OUT_OF_SCOPE_REQUEST`：`out_of_scope`，拒绝创建、暂停、归档、预算修改、竞价执行或账户登录。

## 正式交付

至少生成：

1. `ad-portfolio-plan.md`
2. `ad-entity-specification.csv`
3. `ad-target-mapping.csv`
4. `ad-human-implementation-checklist.md`
5. `ad-planning-evidence-ledger.md`

使用 `assets/templates/ad-portfolio-plan-template.md`。所有执行字段默认 `draft_for_human_implementation`，没有平台回填证据时不得写 `created` 或 `enabled`。

## 质量门

- 站点、账户、profile 和商品范围固定；
- 实体层级和父子关系唯一；
- 稳定 ID 与名称分开；
- 元数据与绩效分开；
- 关键词研究没有被重复；
- SIF 观察没有冒充广告账户数据，供应商返回的实体 ID 也未被当作用户账户已存在实体；
- 没有固定预算比例、行业阈值或效果承诺；
- 平台枚举未知时没有猜测；
- 没有执行广告账户写操作；
- 双层谱系与工作区合同完整。

## 资源读取

- 建立实体、状态、稳定 ID 和预算护栏前读取 `references/ad-portfolio-entity-contract.md`。
- 写正式规划前读取或物化 `assets/templates/ad-portfolio-plan-template.md`。
