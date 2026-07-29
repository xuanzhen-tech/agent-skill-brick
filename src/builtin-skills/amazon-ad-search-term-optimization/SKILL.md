---
name: amazon-ad-search-term-optimization
description: 将真实 Search Term、Target 与实体报表同第02专家关键词证据联接，并可按职责组合 SIF 关键词/流量贡献、SellerSprite PPC/广告排名与 Sorftime 自然排名趋势作独立外部对照，形成收割、迁移、否定候选、观察和人工复核行动账本。适用于搜索词治理、目标迁移和否定准备；不适用于重新做市场关键词研究、用供应商观察推断广告查询或替代真实报表、自动添加或否定关键词、修改匹配类型或提交广告账户变更。
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

## 使用边界

### 合法输入

- 用户对话及只读 `uploads/` 中的一方 Search Term、Target、Campaign、Ad Group、Ad 或 Product 报表；
- 可信上游 `outputs/` 中通过 `amazon-ad-performance-diagnosis` 验收的数据与稳定 ID 联接；
- 第02专家的 Keyword/Cluster ID、意图、产品相关性、排除属性和日期；
- 用户确认的商品范围、品牌保护、预算、利润、库存和合规限制。
- 已接入假设下的三个 MCP 外层工具，仅在真实 Search Term/Target 报表已验收后按职责提供广告可见、关键词/PPC 或自然排名对照。

三个供应商的关键词、流量或广告观察都不能替代广告搜索词、点击、花费、订单或归因销售额，也不能单独生成收割、迁移或否定动作。

### 外部数据边界

- 新外部市场数据只允许通过 `sif_mcp`、`sellersprite_mcp` 或 `sorftime_mcp` 获取；
- SIF 候选路由限于 `market_get_asin_keyword_signals`、`ops_get_listing_keyword_distribution` 与 `ads_get_ad_group_keyword_breakdown`；每个工具在本任务首次调用前必须 `describe`，只按当次机器 `inputSchema` 调用；
- SellerSprite 仅补充 `traffic_keyword`、`traffic_extend`、`keyword_order` 等关键词/PPC/广告排名对照；Sorftime 仅补充 `product_traffic_terms`、`product_ranking_trend_by_keyword`、`competitor_product_keywords` 或 `keyword_trend` 的自然证据；
- `ads_get_ad_group_keyword_breakdown` 的 Campaign/Ad Group ID 必须沿同一 SIF 结果链传递，且其流量贡献不是 Search Term Report；
- 不调用 Amazon Ads API、SP-API、Web、浏览器或未列明的其他 MCP/API；
- 不登录广告账户、不下载报告、不提交 Target 或 Negative；
- 不读取广告凭据，不安装自动化或后台任务；
- 缺真实报表时输出数据就绪清单。

三个目录均无机器级 `outputSchema`。工具名未知时先由对应外层工具 `search`；已知精确工具名可直接 `describe`。每个任务对每个内层工具首次调用前必须实时 `describe`，再由同一外层工具 `call`；不得拼 Gateway、HTTP、shell、索取密钥或固化未实际返回字段。

Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/03-search-term-optimization/` 存放联接、分类、冲突和行动草稿；
- `outputs/advertising/<case-id>/03-search-term-optimization/` 存放唯一正式行动账本；
- 人工执行回执作为新版本证据，不覆盖建议。

### 证据与判断

输入材料记录来源路径、报告 ID/签名、站点、账户、实体、期间、归因和限制。每次 MCP 业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造的参数不调用。

Agent 的归一、相关性判断、动作建议、迁移关系、否定范围和冲突判断必须直接引用真实报表与关键词证据，说明推理理由和是否需要人工批准。广告报表事实与 Agent 建议分开呈现。

供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。供应商对照只可作为 Agent 判断的父证据；先对齐站点、对象、期间、粒度、币种/单位、流量口径、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。

## 启动检查

### 最低输入

至少需要：

1. 已验收的真实 Search Term 报表；
2. Target 与实体稳定 ID；
3. 账户/profile、站点、币种、期间和归因窗口；
4. 商品稳定 ID 与不可匹配属性；
5. 第02专家或用户提供的关键词/意图证据；
6. 用户希望优化的目标和人工执行责任人。

### 结论表达

先说明哪些搜索词已有足够证据形成人工计划，哪些只能观察，哪些必须阻塞。真实 Search Term 报表缺失/未验收/尚未成熟、联接不稳定、商品锚点或关键词语境缺失、历史过短、平台枚举待确认时，逐项写明受影响搜索词、不能采取的动作和下一责任人。

人工复核、执行回填、迁移和否定词复核分别跟随具体动作记录；不能用一个总状态代替业务理由。

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

如需外部对照，工具名未知时先由对应外层工具 `search`，已知精确工具名可直接 `describe`；对本任务首次使用的每个精确工具都必须实时 `describe`，最后按实时 `inputSchema` 用同一外层 `call` 并保存原始证据。站点必须来自直接父证据并映射到该工具实际字段（如 `country|marketplace|amz_site|keyword_support_site|site`）；只有 schema 无法控制站点且默认/覆盖与目标不一致时才停止该供应商分支。所有外部结果只能补充相关性、渠道依赖或待验证假设；任何动作仍必须由真实 Search Term/Target 报表、产品锚点和人工复核共同支撑。

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

- 缺少 Search Term 报表时，只输出所需报表、期间和粒度的数据准备清单；
- 报表尚未被上游验收时，等待验收完成，不生成行动候选；
- 归因尚未成熟时标明复核日期，暂不形成确定动作；
- 跨表联接不稳定时，不生成迁移或否定候选，并列出需要稳定的连接键；
- 缺少商品锚点时只做描述性观察，请责任方补充商品范围；
- 缺少关键词语境时转第 02 专家，或只保留真实报表能够支持的广告观察；
- 历史期间有限时保持观察，不套用固定阈值；
- 平台枚举未确认时保留抽象动作，等待账户操作者回填；
- SIF 参数错误时重新 `describe` 并修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止外部对照，不换源，不改变真实报表驱动的结果状态；
- 对关键词研究、Ads API 写入、自动否定、自动迁移或预算调整等越界请求，明确拒绝并说明可交付的人工候选范围。

## 正式交付

至少生成：

1. `ad-search-term-optimization.md`
2. `ad-search-term-action-ledger.csv`
3. `ad-target-migration-register.csv`
4. `ad-negative-review-register.csv`
5. `ad-search-term-evidence-ledger.md`

使用 `assets/templates/ad-search-term-action-template.md`。所有动作默认 `proposed` 或 `human_review_required`，没有执行回执时不得写 `applied`。

## 质量门

- 按 `references/ad-search-term-action-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；出现任一 marker 时不得声称完整关键词集合，须缩小范围/按内层分页，仍不完整则阻止依赖全量覆盖的动作。

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
- 每项搜索词判断与动作均能回到真实报表和关键词依据，并写明理由、限制和人工责任人。

## 资源读取

- 建立 Search Term、迁移、否定和行动记录前读取 `references/ad-search-term-action-contract.md`。
- 写正式行动账本前读取或物化 `assets/templates/ad-search-term-action-template.md`。
