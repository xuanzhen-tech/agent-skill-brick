---
name: amazon-ad-portfolio-planning
description: 基于商品目标、站点、账户范围、预算边界、上游关键词和已验证利润约束，设计可供人工实施的 Amazon 广告 Portfolio、Campaign、Ad Group、Target 与 Ad 结构规格，并可按职责组合 SIF 广告可见结构、SellerSprite PPC/广告排名与 Sorftime 自然排名趋势作外部观察。适用于新建广告架构、重组计划、命名治理和上线前就绪检查；不适用于调用 Ads API、创建或修改广告、自动调价、预算执行或用供应商观察冒充广告账户数据。
requiredTools: [spreadsheet_inspect, spreadsheet_compute, spreadsheet_validate]
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

完成时明确说明哪些实体规划可交给人工实施、哪些仍受限制或阻塞；任何规划结论都不表示“广告已创建”。

## 使用边界

### 合法输入

- 用户对话及只读 `uploads/` 中的广告目标、商品清单、账户/站点信息、现有结构导出、品牌限制、预算和历史经验；
- 可信上游 `outputs/` 中的第02专家关键词架构、产品/市场证据、Listing 约束、活动计划和第14专家利润/价格护栏；
- 用户提供的一方广告账户元数据和现有实体 ID；
- 已接入假设下的三个 MCP 外层工具，仅在需要补充外部广告结构、关键词/PPC 或自然排名观察且实时 schema 支持时使用。

SIF 返回的 Campaign/Ad Group 标识、结构或贡献分数只属于供应商可见观察，不证明用户账户的 profile、Portfolio、实体配置、预算、竞价、状态、花费、点击或归因订单事实。

### 三 MCP 外部数据路由

- 新外部市场数据只允许通过 `sif_mcp`、`sellersprite_mcp` 或 `sorftime_mcp` 获取，并分别保留原始证据；
- 工具名未知时先由对应外层工具 `search`；已知精确工具名可直接 `describe`。每个任务对每个内层工具首次 `call` 前必须实时 `describe`；正式调用使用同一外层工具的 `action=call`、相同精确 `name` 与 `arguments`，实时机器 `inputSchema` 是接口真相；
- SIF 候选路由限于 `ads_get_asin_ad_structure`、`ads_get_asin_ad_historical_feature_profile`、`market_get_asin_keyword_signals` 和 `market_assess_keyword_promotion`，不得调用猜测名称；
- SellerSprite 候选限于 `traffic_keyword`、`traffic_source`、`traffic_keyword_stat` 的关键词/PPC/广告排名外部对照；Sorftime 候选限于 `product_traffic_terms`、`product_ranking_trend_by_keyword`、`competitor_product_keywords`、`keyword_trend` 的自然排名、自然竞品词和关键词趋势，不得用于推断用户广告实体或付费绩效；
- 不使用 Amazon Ads API、SP-API、Web、浏览器、Meta、Google 或未列明的其他 MCP/API；
- 不索取 LWA、OAuth、广告平台或代理密钥，不安装连接器；
- 任一对应外层工具不可见、实时 schema 不支持所需字段或副作用无法确认时，关闭该供应商观察分支；合法输入仍不足则失败关闭。

三个目录均无机器级 `outputSchema`。不得拼 Gateway、HTTP、shell、索取密钥，也不得把 description、格式指令、供应商建议或本次未返回字段写成稳定合同。

Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/01-portfolio-planning/` 存放实体草图、目标映射、冲突和实施清单；
- `outputs/advertising/<case-id>/01-portfolio-planning/` 存放唯一正式规划；
- 人工执行后的 ID 回填作为新版本输入，不覆盖原计划。

### 表格计算与数据闭环

若输入为 ZIP，先使用 `run_shell` 解压到本次任务的 `temp/` 目录并列出实际 XLSX、XLSM、CSV、TSV；不要把 ZIP 传给表格工具。存在多个表格文件时，必须通过一次 `spreadsheet_inspect({ sources })` 纳入同一个 `analysisId`，先处理 `failedSources`、重复来源和日期重叠，再显式记录 `sourceDecisions`。同类报表通过 `from.type=union` 与明确 `columnMap` 纵向合并，不同粒度数据仍使用声明了基数的 `joins`；不得逐文件心算或用临时脚本拼接最终金额。正式交付需包含必需的 `source_coverage` 校验，证明每个来源已被使用或有证据地排除。

合法输入中存在 XLSX、XLSM、CSV 或 TSV 时，先用 `spreadsheet_inspect` 明确候选区域和 `tableId`。预算汇总、实体数量、组合分配、ID 联接及比例由 `spreadsheet_compute` 形成，禁止模型心算、读取图表数值或复用未经验证的旧摘要。

正式规格交付前必须执行 `spreadsheet_validate`，货币对账默认使用 `0.01` 绝对容差，并检查实体集合、字段覆盖、唯一键与联接基数。正文、表格、图表和看板引用同一分析下的 `analysisId/resultId`。必需检查失败时，只提交差异、可用范围和补数清单，不继续给出正式 Portfolio 或预算策略；MCP 观察不得并入第一方金额。

### 证据与判断

输入材料说明来源路径、提供日期和版本、适用的站点/账户/商品/期间，以及它能支持和不能支持的规划判断。

每次 MCP 业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造的参数不调用。

Agent 产生的结构、命名、预算情景、目标映射和状态建议必须直接引用所用材料，说明设计理由、假设和结论上限；不得把任一 MCP 供应商观察伪装成账户事实。

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

### 结论表达

逐层说明 Portfolio、Campaign、Ad Group、Target 和 Ad 中哪些已具备人工计划依据，哪些仍缺账户范围、商品映射、关键词证据、经济护栏或平台枚举确认。每个缺口写明受影响实体、为什么阻塞或限制实施、下一责任人。

账户、站点或商品身份不明时，不得输出可直接执行的实体规格。实体状态、人工批准和平台回填分别记录，不把“规划完成”说成“平台已创建”。

## 三 MCP 外部观察预检

只有市场/关键词观察不足时：

1. 确认目标外层 `sif_mcp | sellersprite_mcp | sorftime_mcp` 存在；
2. 工具名未知时先在同一外层 `search`；已知精确工具名可直接 `describe`。本任务首次使用每个内层工具前必须实时 `describe`；
3. 只按当次机器 `inputSchema` 组装参数，并以同一外层工具执行 `action=call`、相同 `name` 和 `arguments`；参数说明冲突时失败关闭；
4. 从直接父 Evidence 取得目标站点，并按实时 `inputSchema` 实际暴露的站点字段（如 `country`、`marketplace`、`amz_site`、`keyword_support_site`、`site`）映射；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标站点不一致时，才停止该供应商分支；不得默认 `US` 或自造字段、枚举；
5. 发起最小请求并记录供应商、实际工具、查询范围、原始返回和限制；
6. 明确供应商结果是直接返回还是供应商估算，不把它写成用户广告账户事实；
7. 调用 `market_assess_keyword_promotion` 时，`arguments` 必须显式包含已由可信材料验证的 `own_price`、`own_margin` 与 `country`，并记录三项参数的直接依据；任一项缺失、冲突或未经验证都不得调用，结果只作外部经济性假设；
8. 不把自然搜索、供应商广告结构或贡献分数命名为用户广告账户字段；
9. 供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。同类数据先对齐站点、对象、期间、粒度、币种/单位、流量口径、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。

## 执行流程

### 第一步：冻结账户与商品锚点

记录：

- `marketplace_id`
- `account_scope_id`
- `profile_id` 或 `missing`
- `brand_scope`
- `product_id`、ASIN/SKU/变体范围
- 计划版本和决策日期

相同名称但不同稳定 ID 的实体不得合并。profile 未确认时明确阻塞实施，并说明缺少账户范围确认。

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

- 缺少账户范围时，只交付需要人工补齐的账户、站点和权限清单；
- 商品范围冲突时暂停相关实体规划，列出冲突商品与确认责任方；
- 缺少关键词依据时，只规划非关键词结构，或转第 02 专家补充搜索语境；
- 缺少经济护栏时可以说明结构，但不给确定预算或竞价；
- 平台枚举未确认时保留抽象字段，并要求账户操作者回填当前枚举；
- 供应商接口说明与实时 schema 不一致时，由同一外层工具重新 `describe` 并修正一次；仍不匹配则停止该背景分支并说明受影响的规划判断；
- 只有部分结构有充分依据时，仅交付已确认区块，其余逐项写明待确认内容和责任人；
- 对创建、暂停、归档、预算修改、竞价执行或账户登录等越界请求，明确拒绝并交付人工实施清单。

## 正式交付

至少生成：

1. `ad-portfolio-plan.md`
2. `ad-entity-specification.csv`
3. `ad-target-mapping.csv`
4. `ad-human-implementation-checklist.md`
5. `ad-planning-evidence-ledger.md`

使用 `assets/templates/ad-portfolio-plan-template.md`。所有执行字段默认 `draft_for_human_implementation`，没有平台回填证据时不得写 `created` 或 `enabled`。

## 质量门

- 按 `references/ad-portfolio-entity-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；压缩或截断结果不得作为全量结构，须缩小范围/按内层分页，仍不完整则标记 provider 覆盖不足。

- 站点、账户、profile 和商品范围固定；
- 实体层级和父子关系唯一；
- 稳定 ID 与名称分开；
- 元数据与绩效分开；
- 关键词研究没有被重复；
- 三个 MCP 的外部观察没有冒充广告账户数据，供应商返回的实体 ID 也未被当作用户账户已存在实体；
- 没有固定预算比例、行业阈值或效果承诺；
- 平台枚举未知时没有猜测；
- 没有执行广告账户写操作；
- 每项结构和预算判断均能回到直接材料，并写明理由、限制和人工责任人。

## 资源读取

- 建立实体、状态、稳定 ID 和预算护栏前读取 `references/ad-portfolio-entity-contract.md`。
- 写正式规划前读取或物化 `assets/templates/ad-portfolio-plan-template.md`。
