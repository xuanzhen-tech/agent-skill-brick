---
name: amazon-ad-search-term-optimization
description: 将真实 Search Term、Target 与实体报表同第02专家关键词证据联接，并可用 SIF ASIN 关键词/流量贡献作独立外部对照，形成收割、迁移、否定候选、观察和人工复核行动账本。适用于搜索词治理、目标迁移和否定准备；不适用于重新做市场关键词研究、用 SIF 推断广告查询或替代真实报表、自动添加或否定关键词、修改匹配类型或提交广告账户变更。
---

<!--
文件功能：定义广告搜索词与目标的稳定 ID 联接、产品锚点、include/exclude、迁移、否定候选和人工行动闭环。
职责边界：只基于真实广告报表提出候选动作，不重新拥有关键词研究，不调用 Ads API 或执行目标/否定变更。
重要关联：搜索词、目标和行动字段见 references/ad-search-term-action-contract.md；正式交付使用 assets/templates/ad-search-term-action-template.md；数据验收依赖 amazon-ad-performance-diagnosis。
-->

# Amazon 广告搜索词优化

## 目标与完成定义

把“哪些词该加、该否、该迁移”变成有证据、有作用范围且可人工执行的账本：

1. Search Term 来自哪份真实报告、账户、站点、期间和实体；
2. 它与哪个 Target、Campaign、Ad Group 和商品稳定 ID 关联；
3. 商品相关性、排除属性和上游关键词意图如何约束动作；
4. 收割、迁移、否定、观察或不处理的理由是什么；
5. include/exclude 的作用范围、冲突与防误伤检查是什么；
6. 哪些动作必须等待更多点击、订单、归因成熟或人工判断。

没有真实 Search Term/Target 报表时，不输出否词或迁移清单。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的一方 Search Term、Target、Campaign、Ad Group、Ad 或 Product 报表；
- 可信上游 `outputs/` 中通过 `amazon-ad-performance-diagnosis` 验收的数据与稳定 ID 联接；
- 第02专家的 Keyword/Cluster ID、意图、产品相关性、排除属性和日期；
- 用户确认的商品范围、品牌保护、预算、利润、库存和合规限制。
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在真实 Search Term/Target 报表已验收后按需提供 ASIN 关键词或广告可见流量对照。

SIF 关键词、流量或广告贡献观察不能替代广告搜索词、点击、花费、订单或归因销售额，也不能单独生成收割、迁移或否定动作。

### 外部数据边界

- 新外部业务数据只允许通过当前 Agent 已注入的 `sif_mcp` 获取；
- 候选路由限于 `market_get_asin_keyword_signals`、`ops_get_listing_keyword_distribution` 与 `ads_get_ad_group_keyword_breakdown`；每个工具在本任务首次调用前必须 `describe`，只按当次机器 `inputSchema` 调用；
- `ads_get_ad_group_keyword_breakdown` 的 Campaign/Ad Group ID 必须沿同一 SIF 结果链传递，且其流量贡献不是 Search Term Report；
- 不调用 Amazon Ads API、SP-API、Sorftime、Keepa、Web、浏览器或其他 MCP/API；
- 不登录广告账户、不下载报告、不提交 Target 或 Negative；
- 不读取广告凭据，不安装自动化或后台任务；
- 缺真实报表时输出数据就绪清单。

当前 SIF 工具没有机器级 `outputSchema`。不得按 description 固化结果字段，不复制 `_formatted`、`_next_step` 或供应商格式要求；外层参数通过后仍须检查内层调用是否被 Gateway/SIF 接受。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/03-search-term-optimization/` 存放联接、分类、冲突和行动草稿；
- `outputs/advertising/<case-id>/03-search-term-optimization/` 存放唯一正式行动账本；
- 人工执行回执作为新版本证据，不覆盖建议。

### 双层谱系

输入证据记录 `evidence_id`、`source_path`、报告 ID/签名、站点、账户、实体、期间、归因、四轴和限制。原始 SIF 对照另记录 `source_type=sif_mcp`、`source_provider=sif`、`source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`query_scope`、覆盖/分页和 `raw_result_locator`；其 `transformation_type=reported`，`estimation_status` 按结果自述保留 `reported` 或 `estimated`。`agent_request_id` 与 `tool_call_id` 取当前 AgentTool 调用上下文中的真实值；上下文未暴露时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`，不得用本地 ID 冒充。

Agent 的归一、相关性编码、动作建议、迁移关系、否定范围和冲突判断为 `agent_output`，必须记录 `output_id`、`parent_evidence_ids`、转换类型、假设状态和人工批准状态。

四轴字段：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

广告报表是用户/上游 `reported` 输入；相关性和行动建议是 Agent `coding|inference`。

SIF 对照使用 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero` 六态，且只可作为 Agent 判断的 `parent_evidence_ids`；空数组不能写成“没有搜索词”或零广告流量。

## 启动检查

### 最低输入

至少需要：

1. 已验收的真实 Search Term 报表；
2. Target 与实体稳定 ID；
3. 账户/profile、站点、币种、期间和归因窗口；
4. 商品稳定 ID 与不可匹配属性；
5. 第02专家或用户提供的关键词/意图证据；
6. 用户希望优化的目标和人工执行责任人。

### 唯一顶层结果合同

每次运行只使用一组顶层结果字段：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `NO_SEARCH_TERM_REPORT | REPORT_NOT_INGESTED | REPORT_IMMATURE | UNSTABLE_JOIN | PRODUCT_ANCHOR_MISSING | KEYWORD_CONTEXT_MISSING | LIMITED_HISTORY | PLATFORM_ENUM_CONFIRMATION_REQUIRED | OUT_OF_SCOPE_REQUEST`

不得再用 `readiness_status` 或其他顶层状态表达同一结果。行动 `human_review_status`、`execution_status`、迁移状态和否定复核状态是局部生命周期字段，不替代 `result_status`。

## 执行流程

### 第一步：继承报告验收结果

读取上游 manifest 和数据质量：

- report ID、签名和 source path；
- 生命周期 `ingested`；
- 分页、截断和覆盖；
- 稳定 ID 联接；
- 归因成熟度；
- 真实零、缺失和失败语义。

报告未完成或截断影响判断时，暂停动作清单。

### 第二步：固定 Search Term 与 Target 身份

为每行建立：

- `search_term_observation_id`
- 原始 search term；
- target ID 与显示值；
- Campaign/Ad Group/Ad/Product ID；
- 站点、账户、期间、匹配/目标类型的来源值；
- 报告证据 ID。

不根据名称或文本相似度自动把多个 target 合并。

### 第三步：建立产品锚点与排除属性

在看绩效前先锁定：

- 商品是什么；
- 适用/不适用场景；
- 规格、材料、尺寸、受众或兼容性限制；
- 品牌词、竞品词和泛类目词规则；
- 不能被广告暗示的宣称。

没有产品锚点时，不得仅因有订单就宣布词相关，也不得仅因无订单就否定。

### 第四步：联接第02关键词证据

通过稳定 Keyword/Cluster ID 或人工确认映射，记录：

- 市场意图；
- 产品相关性；
- include/exclude 属性；
- 上游供应商观察日期和口径；
- 是否为新词、已知词或无法映射。

第02专家拥有发现和市场优先级；本 Skill 只决定广告动作候选。

如需 SIF 外部对照，先通过外层 `sif_mcp` 对本任务首次使用的候选工具执行 `action=describe`、`kind=tool`、`name=<候选工具>`，再按机器 `inputSchema` 以 `action=call`、`name=<候选工具>`、`arguments={...}` 发起最小调用并保存原始证据。只要运行时 schema 含 `country`，就必须把有直接父证据的已验证站点映射显式写入 `arguments.country`，不得默认 `US`；目标为非美国且 schema 缺少或不支持该国家时，停止该外部对照。SIF 结果只能补充相关性、渠道依赖或待验证假设；任何动作仍必须由真实 Search Term/Target 报表、产品锚点和人工复核共同支撑。

### 第五步：计算可用广告证据

只在已验收字段上使用：

- impressions、clicks、spend；
- attributed orders、units、sales；
- CTR、CPC、CVR、ACoS/ROAS；
- 期间、归因窗口和成熟度；
- 是否受预算、状态或覆盖变化影响。

分母为零时 `not_computable`。没有固定“点击 X 次无订单就否”的行业阈值。

### 第六步：编码行动类型

允许：

- `harvest_candidate`：真实搜索词表现与产品/意图证据支持建立独立目标候选；
- `migration_candidate`：需从原探索结构迁到明确用途结构；
- `negative_candidate`：证据显示不相关、误导或经济风险，待人工复核；
- `observe`：历史或归因尚不足；
- `retain`：当前结构与用途匹配；
- `no_action_due_to_conflict`：证据冲突；
- `not_assessable`：输入不足。

动作类型不是平台写操作。

### 第七步：设计迁移链

每个迁移记录：

- source Campaign/Ad Group/Target ID；
- destination plan entity ID 或 `tbd`;
- 搜索词来源 observation ID；
- 新 target 的抽象类型；
- 旧结构保留/否定候选；
- 生效顺序；
- 双重覆盖或流量中断风险；
- 回滚条件；
- 人工执行与验证。

没有目标结构 ID 时不标 `ready_to_execute`。

### 第八步：设计否定候选

否定必须说明：

- 精确对象；
- 作用层级与范围；
- 原始 Search Term 和目标关系；
- 不相关或经济风险证据；
- 可能误伤的相关词/商品；
- include/exclude 冲突；
- 建议的抽象否定类型；
- 人工批准人。

平台枚举未知时使用 `tbd_platform_enum`，不得猜 exact/phrase 等当前接口枚举。

### 第九步：处理来源与目的冲突

检查：

- 同一 Search Term 同时在多个结构中承担不同作用；
- 迁移后是否产生重复；
- 上游相关性与广告表现是否冲突；
- 品牌/竞品/泛词是否被错误混合；
- 否定候选是否会阻断目的结构；
- 商品、站点或变体是否错配。

冲突未解时状态为 `human_review_required`。

### 第十步：形成执行与回填清单

按顺序列出人工动作：

1. 核对账户和实体 ID；
2. 核对目标结构和平台枚举；
3. 创建/修改候选动作；
4. 记录执行者、时间和平台 ID；
5. 验证原结构、目的结构和否定范围；
6. 保留回滚信息；
7. 等待新的成熟报告再评估。

本 Skill 不执行或声称这些动作完成。

## 失败与降级

- `NO_SEARCH_TERM_REPORT`：`blocked`，只输出数据准备；
- `REPORT_NOT_INGESTED`：`blocked`，等待上游验收；
- `REPORT_IMMATURE`：`ready_with_limitations`，标记复核日期；
- `UNSTABLE_JOIN`：`blocked`，不生成迁移/否定；
- `PRODUCT_ANCHOR_MISSING`：`blocked`，只做描述性表；
- `KEYWORD_CONTEXT_MISSING`：`ready_with_limitations`，路由第02专家或只保留已证广告观察；
- `LIMITED_HISTORY`：`ready_with_limitations`，默认 `observe`，不套固定阈值；
- `PLATFORM_ENUM_CONFIRMATION_REQUIRED`：`ready_with_limitations`，保留抽象动作；
- SIF 参数错误时重新 `describe` 并修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止外部对照，不换源，不改变真实报表驱动的结果状态；
- `OUT_OF_SCOPE_REQUEST`：`out_of_scope`，拒绝关键词研究、Ads API 写入、自动否定、自动迁移或预算调整。

## 正式交付

至少生成：

1. `ad-search-term-optimization.md`
2. `ad-search-term-action-ledger.csv`
3. `ad-target-migration-register.csv`
4. `ad-negative-review-register.csv`
5. `ad-search-term-evidence-ledger.md`

使用 `assets/templates/ad-search-term-action-template.md`。所有动作默认 `proposed` 或 `human_review_required`，没有执行回执时不得写 `applied`。

## 质量门

- 只有真实广告报表才产生搜索词动作；
- Search Term、Target、实体和商品用稳定 ID；
- 产品锚点与排除属性先于绩效动作；
- 第02专家关键词研究未被重复；
- SIF 对照未被写成 Search Term、点击、花费、订单或归因销售额；
- 零分母和不成熟归因被正确处理；
- 没有固定点击/订单/ACoS 阈值；
- include/exclude、来源、目的和误伤检查完整；
- 平台枚举未知时没有猜测；
- 没有自动添加、否定、迁移或提交；
- 双层谱系与工作区合同完整。

## 资源读取

- 建立 Search Term、迁移、否定和行动记录前读取 `references/ad-search-term-action-contract.md`。
- 写正式行动账本前读取或物化 `assets/templates/ad-search-term-action-template.md`。
