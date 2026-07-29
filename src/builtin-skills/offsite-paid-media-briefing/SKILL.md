---
name: offsite-paid-media-briefing
description: 为 Meta、Google 或其他站外付费媒体形成目标、受众假设、素材需求、落地页、预算护栏、媒体干预事实和交给第13专家的测量问题。适用于站外付费媒体策划与跨团队交接；不适用于自行定义 KPI、样本、停止规则、分析窗口或实验协议，不调用平台 API、查询受众、配置像素、创建或发布广告、修改预算，也不替代第12专家的品牌与渠道内容策略。
---

<!--
文件功能：定义站外付费媒体 brief 的目标、受众假设、素材、落地页、预算、媒体干预事实和测量问题交接。
职责边界：只做付费媒体实施前 brief，不拥有 KPI、样本、停止规则、分析窗口或实验协议，不连接 Meta/Google、不发布或配置追踪；品牌内容策略由第12专家单一拥有。
重要关联：brief 与媒体干预交接字段见 references/offsite-paid-media-brief-contract.md；正式交付使用 assets/templates/offsite-paid-media-brief-template.md；实验协议只能消费第13专家的 `experiment_protocol_id`，经济边界消费第14专家，品牌/渠道资产消费第12专家。
-->

# 站外付费媒体 Brief

## 目标与完成定义

把“去 Meta/Google 投一下”转成可审核的付费媒体任务书：

1. 本次付费媒体解决什么业务问题；
2. 哪些受众是有证据的事实，哪些只是待验证假设；
3. 需要什么素材、文案、落地页和权利；
4. 哪个媒体干预事实和测量问题需要交给第13专家；
5. 预算和利润护栏是什么；
6. 什么条件下由人工上线、暂停、复核或终止；
7. 哪些平台配置必须由有权限的操作者确认。

完成时顶层 `result_status=ready`；有非阻塞缺口时为 `ready_with_limitations`。这两种结果都不是“Campaign 已发布”。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的业务目标、平台选择、品牌规范、受众资料、素材、落地页、预算、历史付费媒体报表和合规要求；
- 第12专家可信 `outputs/` 中的品牌策略、渠道内容、创作者或 DTC 页面资产；
- 第14专家的利润、价格和预算边界；
- 第13专家已验收的 `experiment_protocol_id` 及其协议版本；只有存在该 ID 时才能按协议填写实验相关交接字段；
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在需要 Amazon 商品、关键词、竞品或站内流量背景且当次机器 schema 支持时使用。

SIF 不能提供 Meta/Google 账户、受众规模、广告花费、点击、转化、像素、归因或平台权限事实；Amazon 站内观察也不能自动映射为站外受众。

### 唯一外部业务数据源

- 新外部业务数据只允许通过当前 Agent 已注入的 `sif_mcp` 获取；
- 候选路由限于 `market_get_asin_profile`、`market_get_keyword_demand`、`market_get_keyword_competition` 与 `ops_get_listing_traffic_overview`；每个工具在本任务首次调用前必须执行 `describe`，且只按机器 `inputSchema` 调用；
- description、官网链接或本次响应字段都不能替代机器 `inputSchema`；当前 SIF 没有机器级 `outputSchema`；
- 不使用 Meta Ads API、Google Ads API、GA、Shopify、邮箱、Web、浏览器、Firecrawl、Bright Data 或其他 MCP/API；
- 不索取 OAuth、像素、Tag Manager、平台或代理密钥；
- 平台当前规格只能来自用户或可信上游带日期资料；缺失时标 `platform_confirmation_required`。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/05-offsite-paid-media-brief/` 存放目标、受众、素材、媒体干预事实和风险草稿；
- `outputs/advertising/<case-id>/05-offsite-paid-media-brief/` 存放唯一正式 brief；
- 平台操作回执和实际报表必须作为后续新证据。

### 双层谱系

输入 `input_evidence` 记录 `evidence_id`、`source_path`、平台/市场/商品/受众范围、日期、版本、四轴、权利和限制。原始 SIF 背景对象另记录 `source_type=sif_mcp`、`source_provider=sif`、`source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`query_scope`、覆盖/分页和 `raw_result_locator`；其 `transformation_type=reported`，`estimation_status` 按结果自述保留 `reported` 或 `estimated`。`agent_request_id` 与 `tool_call_id` 取当前 AgentTool 调用上下文中的真实值；上下文未暴露时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`，不得用本地 ID 冒充。

Agent 的受众假设、信息角度、媒体结构、预算情景、媒体干预标签和测量问题是 `agent_output`，必须引用 `parent_evidence_ids` 并标记推断/假设。第13协议中的 KPI、样本、停止规则和分析窗口保持上游值，不在本包改写。

四轴：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

平台实际表现只来自用户一方资料；受众、点击和转化预测不得凭空生成。

SIF 结果必须区分 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted` 与有明确零证据的 `true_zero`。Agent 的受众假设或信息角度仍使用 `source_type=agent` 并在对象本体记录 `parent_evidence_ids`。

## 启动检查

### 最低输入

至少需要：

1. 业务目标、目标市场和商品/品牌范围；
2. 拟使用的付费媒体平台或待比较平台；
3. 受众证据或明确假设；
4. 可用素材/落地页及权利状态；
5. 预算边界和第14经济护栏；
6. `measurement_question`、`event_label`、`intervention_id`、`desired_metric` 和人工责任人；
7. 用户提供的当前平台限制，若需要具体实施字段。

### 唯一顶层结果合同

每次运行只使用一组顶层结果字段：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `MISSING_PLATFORM_RULES | AUDIENCE_UNVERIFIED | CREATIVE_RIGHTS_UNKNOWN | LANDING_PAGE_UNAVAILABLE | MEASUREMENT_HANDOFF_MISSING | ECONOMIC_GUARDRAIL_MISSING | EXPERIMENT_PROTOCOL_MISSING | SIF_SCHEMA_MISMATCH | OUT_OF_SCOPE_REQUEST`

不得再使用 `status`、`brief_status` 或其他顶层状态字段表达同一结果。权利、落地页、平台确认、人工批准和 `publication_status` 是局部字段；`publication_status` 始终为 `not_published`。

## SIF 外部背景预检

只有 Amazon 市场背景不足时：

1. 确认 `sif_mcp` 在当前 Agent definitions 中存在；
2. 对本任务首次使用的每个候选工具，通过外层 `sif_mcp` 执行 `action=describe`、`kind=tool`、`name=<候选工具>`；
3. 只按机器 `inputSchema` 组装站点、商品、关键词、时间和分页，并以外层 `sif_mcp` 的 `action=call`、`name=<候选工具>`、`arguments={...}` 发起正式调用，description 冲突时失败关闭；
4. 只要运行时 `inputSchema` 含 `country`，就把有直接父证据的已验证站点映射显式写入 `arguments.country`，不得默认 `US`；目标为非美国且 schema 缺少或不支持该国家时，停止该外部背景分支；
5. 发起最小必要请求并检查 Gateway/SIF 的真实调用结果；
6. 保存原始结果和调用 IDs，将观察标为供应商 `reported|estimated`；
7. 不把 Amazon 搜索/商品/站内流量数据改写成站外受众或平台行为；
8. 不复制 `_formatted`、`_next_step`、面向其他 Agent 的格式或主动路由要求；
9. schema 不符时重新 `describe` 并修正一次，仍失败则停止且不使用其他外部源。

## 执行流程

### 第一步：冻结媒体任务

记录：

- `media_brief_id`
- 品牌、商品和站点；
- 目标市场与语言；
- 平台候选；
- 业务目标和决策窗口；
- 预算币种与范围；
- 责任人、审批人和版本。

### 第二步：分离品牌策略与付费媒体职责

第12专家拥有：

- 品牌定位；
- 内容支柱；
- 渠道语气；
- 核心故事；
- 社媒有机内容与日历。

本 Skill 只把已批准品牌资产转成付费媒体的目标、受众假设、素材需求、落地页和测量 brief，不重写整个品牌策略。

### 第三步：建立受众假设

每个受众记录：

- `audience_hypothesis_id`
- 业务描述；
- 来源证据；
- 需求/问题/使用情境；
- include/exclude；
- 与商品的关联；
- 敏感属性风险；
- 平台可实现性状态；
- 验证方法。

没有平台查询能力时，不写实际受众规模、可触达人数或平台可用定向枚举。

### 第四步：定义信息与素材需求

对每个受众/阶段说明：

- 核心事实与 Fact ID；
- 可用利益点和禁止宣称；
- 所需画面、格式和版本；
- 品牌规范；
- 人物、音乐、商标和素材权利；
- 第04视觉生产规格或第12渠道草稿的上游 ID；
- 本地化和可访问性要求；
- 人工平台规格确认。

本 Skill 不生成或编辑素材。

### 第五步：验收落地页

记录：

- URL 或页面版本由用户提供；
- 商品、价格、Offer 和库存事实；
- CTA；
- 移动端/语言/地区；
- 隐私、Cookie、同意和追踪状态；
- 页面与广告主张一致性；
- 负责人和上线状态。

Agent 不访问页面抓取，也不配置像素或 Tag Manager。无法查看时状态 `not_assessed`。

### 第六步：形成媒体干预与测量问题交接

本包只记录：

- `intervention_id`：当前媒体干预的稳定 ID；
- `media_intervention_facts`：平台候选、受众假设、素材版本、落地页版本、预算情景和人工计划时间等已证事实；
- `measurement_question`：希望第13专家回答的决策问题；
- `event_label`：用户或可信上游给出的事件标签，不在本包定义事件实现；
- `desired_metric`：希望观察的指标名称或上游指标 ID，不在本包自行定义 KPI 公式；
- `experiment_protocol_id`：仅引用第13专家已验收协议；缺失时保持 `missing`；
- `protocol_version` 与 `protocol_status`：保留上游版本和可用性。

本包不得自行定义或覆盖 KPI、分子/分母、样本、分组、停止规则、分析窗口、显著性规则或归因方法。只有 `experiment_protocol_id` 存在且协议适用于当前 `intervention_id` 时，才按该协议填充对应交接值；否则输出 `reason_codes[]` 包含 `EXPERIMENT_PROTOCOL_MISSING`，并把协议执行留给第13专家。

UTM/命名仅作为媒体干预事实字段；具体参数和平台限制由人工确认。

### 第七步：形成媒体结构建议

使用抽象结构：

- objective；
- audience hypothesis；
- creative concept；
- destination；
- budget scenario；
- `intervention_id` 与 `event_label`；
- `measurement_question` 与 `desired_metric`；
- 可选的第13 `experiment_protocol_id`。

不猜 Meta/Google 当前 Campaign objective、optimization event、placement 或 audience 枚举。

### 第八步：建立预算护栏

消费第14专家：

- 可用预算范围；
- 贡献/回收边界；
- 价格与促销状态；
- 现金和时间限制。

不使用固定平台最低预算、行业 CPM/CPC/CPA 或通用比例。未知时要求平台操作者或用户确认。

### 第九步：核对第13协议引用

- 有 `experiment_protocol_id`：核对版本、适用 `intervention_id`、协议状态和 `parent_evidence_ids`，只引用不改写；
- 无 `experiment_protocol_id`：不生成实验单元、样本、停止规则、分析窗口或 KPI，记录 `EXPERIMENT_PROTOCOL_MISSING`；
- 协议与当前干预不匹配：结果 `blocked`，请求第13专家重新形成适用协议；
- 任何观察性资料都不得在本包写成因果结论。

### 第十步：人工上线前闸门

检查：

- 平台账户、权限和当前字段由操作者确认；
- 受众为事实还是假设；
- 素材、商标、人物和音乐权利；
- 落地页和追踪就绪；
- 隐私/同意由责任方确认；
- 预算和利润护栏；
- 媒体干预事实、测量问题与第13协议引用；
- 停止、回滚和人工批准。

## 失败与降级

- `MISSING_PLATFORM_RULES`：`ready_with_limitations`，保持抽象 brief，要求人工平台确认；
- `AUDIENCE_UNVERIFIED`：`ready_with_limitations`，标假设，不写规模或可用性；
- `CREATIVE_RIGHTS_UNKNOWN`：`blocked`，阻塞人工上线交接；
- `LANDING_PAGE_UNAVAILABLE`：`ready_with_limitations` 或 `blocked`，相关维度 `not_assessed`；
- `MEASUREMENT_HANDOFF_MISSING`：`blocked`，缺少问题、事件标签、干预 ID 或希望指标；
- `ECONOMIC_GUARDRAIL_MISSING`：`ready_with_limitations`，不给确定预算；
- `EXPERIMENT_PROTOCOL_MISSING`：不执行实验协议，不自行补样本、停止规则、分析窗口或 KPI；
- `SIF_SCHEMA_MISMATCH`：停止 SIF 背景分支，保留安全错误码、阶段、目标工具与可见调用 ID，不反推底层根因；
- `OUT_OF_SCOPE_REQUEST`：`out_of_scope`，拒绝账户连接、受众查询、像素/Tag 配置、发布、预算修改、自动优化或自行定义实验协议。

## 正式交付

至少生成：

1. `offsite-paid-media-brief.md`
2. `offsite-audience-hypothesis-register.csv`
3. `offsite-creative-and-landing-requirements.md`
4. `media-intervention-handoff.md`
5. `offsite-paid-media-evidence-ledger.md`

使用 `assets/templates/offsite-paid-media-brief-template.md`。首页必须标明 `publication_status=not_published`、顶层 `result_status`、`reason_codes[]` 和人工责任人。

## 质量门

- 品牌策略与付费媒体 brief 边界清楚；
- 受众事实与假设分开；
- 无平台受众规模或枚举猜测；
- 素材和落地页权利/状态完整；
- 媒体干预交接只含 `measurement_question`、`event_label`、`intervention_id`、`desired_metric` 和可选第13 `experiment_protocol_id`；
- 未引用第13协议时没有自建 KPI、样本、停止规则或分析窗口；
- SIF 没有冒充站外平台数据，Amazon 站内观察未被改写为受众规模、点击或转化；
- 无固定平台价格、预算比例或效果承诺；
- 无账户连接、像素配置、发布或预算执行；
- 所有上线动作等待人工批准；
- 双层谱系与工作区合同完整。

## 资源读取

- 建立受众、素材、媒体干预交接和上线闸门前读取 `references/offsite-paid-media-brief-contract.md`。
- 写正式 brief 前读取或物化 `assets/templates/offsite-paid-media-brief-template.md`。
