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

完成时明确说明哪些内容足以交给人工上线、哪些仍有限制或阻塞；任何 brief 结论都不表示“Campaign 已发布”。

## 使用边界

### 合法输入

- 用户对话及只读 `uploads/` 中的业务目标、平台选择、品牌规范、受众资料、素材、落地页、预算、历史付费媒体报表和合规要求；
- 第12专家可信 `outputs/` 中的品牌策略、渠道内容、创作者或 DTC 页面资产；
- 第14专家的利润、价格和预算边界；
- 第13专家已验收的 `experiment_protocol_id` 及其协议版本；只有存在该 ID 时才能按协议填写实验相关交接字段；
- 已接入假设下的三个 MCP 外层工具，仅在需要 Amazon 背景，或任务明确命中 Google Trends/TikTok 渠道且实时 schema 支持时使用。

三个 MCP 都不能提供用户 Meta/Google/TikTok 账户、广告花费、点击、转化、像素、归因或平台权限事实；公开市场观察也不能自动映射为站外受众。

### 三 MCP 外部数据路由

- 新外部市场数据只允许通过 `sif_mcp`、`sellersprite_mcp` 或 `sorftime_mcp` 获取，并分别保存原始证据；
- SIF 路由限于 `market_get_asin_profile`、`market_get_keyword_demand`、`market_get_keyword_competition` 与 `ops_get_listing_traffic_overview`，只作 Amazon 市场背景；
- SellerSprite 的 `google_trend` 只在用户明确选择 Google/搜索兴趣问题时使用；Sorftime 只可在任务平台明确为 TikTok 时使用 `tiktok_product_detail`、`tiktok_product_trend`、`tiktok_product_video`、`tiktok_product_video_author`、`tiktok_author`，且 `tiktok_author` 仅限实时 schema 支持的美国站。不能把跨平台信号移植为 Amazon、Meta 或 Google 事实；
- 三个目录均无 `outputSchema`；工具名未知时先由对应外层工具 `search`，已知精确工具名可直接 `describe`；每任务每工具首次 `call` 前必须实时 `describe`，description 或官网不能替代机器 `inputSchema`；
- 不使用 Meta Ads API、Google Ads API、GA、Shopify、邮箱、Web、浏览器、Firecrawl、Bright Data 或其他 MCP/API；
- 不索取 OAuth、像素、Tag Manager、平台或代理密钥；
- 平台当前规格只能来自用户或可信上游带日期资料；缺失时标 `platform_confirmation_required`。

Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/05-offsite-paid-media-brief/` 存放目标、受众、素材、媒体干预事实和风险草稿；
- `outputs/advertising/<case-id>/05-offsite-paid-media-brief/` 存放唯一正式 brief；
- 平台操作回执和实际报表必须作为后续新证据。

### 证据与判断

输入材料记录来源路径、平台/市场/商品/受众范围、日期、版本、权利和限制。每次 MCP 业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造的参数不调用。

Agent 的受众假设、信息角度、媒体结构、预算情景、媒体干预标签和测量问题必须直接引用所用材料，并明确哪些只是待验证假设。第13协议中的 KPI、样本、停止规则和分析窗口保持上游值，不在本包改写。平台实际表现只来自用户一方资料；受众、点击和转化预测不得凭空生成。

供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。跨来源信号先对齐平台、站点、对象、期间、粒度、单位、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有渠道或单源失败时只说明该来源不可用和当前没有相应证据。Agent 的受众假设或信息角度仍回指实际父证据。

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

### 结论表达

逐项说明受众、素材、落地页、预算护栏、测量交接和平台限制中哪些已经有依据，哪些仍是待验证假设或阻塞项。每个缺口写明影响、所需材料和责任人。

权利、落地页、平台确认和人工批准分别跟随对应事项记录；首页始终明确“未发布，等待人工操作”。

## 三 MCP 外部背景预检

只有任务确需上述 Amazon、Google Trends 或 TikTok 外部背景时：

1. 确认目标外层 `sif_mcp | sellersprite_mcp | sorftime_mcp` 存在；
2. 工具名未知时先在同一外层 `search`；已知精确工具名可直接 `describe`。对本任务首次使用的每个候选工具必须实时 `describe`；
3. 只按机器 `inputSchema` 组装参数，并以同一外层执行 `call`、相同精确 `name` 和 `arguments`，description 冲突时失败关闭；
4. 从直接父 Evidence 取得目标平台/站点，并按实时 `inputSchema` 实际暴露的字段（如 `country`、`marketplace`、`amz_site`、`keyword_support_site`、`site`）映射；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标不一致时，才停止该供应商分支；不得默认 `US` 或跨平台改写；
5. 发起最小必要请求并检查对应 provider 的真实调用结果；
6. 保存原始结果和可复查位置，说明观察是供应商直接返回还是供应商估算；
7. 不把 Amazon 搜索/商品/站内流量数据改写成站外受众或平台行为；
8. 不复制 `_formatted`、`_next_step`、面向其他 Agent 的格式或主动路由要求；
9. schema 不符时重新 `describe` 并修正一次，仍失败则停止该来源分支。若原计划需要比较多个 MCP，明确写出缺少哪个来源、受影响的受众或媒体判断、因此不能完成的比较，以及重新取得该数据需要的条件；若该渠道只有一个适用来源，则说明当前没有可用的外部证据。不得拼 Gateway、HTTP、shell、索取密钥或把另一来源静默当成同义回退。

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

- 核心事实及其原始文件、段落或上游结果位置；
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

本包不得自行定义或覆盖 KPI、分子/分母、样本、分组、停止规则、分析窗口、显著性规则或归因方法。只有 `experiment_protocol_id` 存在且协议适用于当前 `intervention_id` 时，才按该协议填充对应交接值；否则明确说明实验协议缺失，并把协议设计与执行留给第13专家。

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

- 有 `experiment_protocol_id`：核对版本、适用 `intervention_id`、协议状态和直接依据，只引用不改写；
- 无 `experiment_protocol_id`：不生成实验单元、样本、停止规则、分析窗口或 KPI，明确记录协议缺口；
- 协议与当前干预不匹配：阻塞实验交接，请求第13专家重新形成适用协议；
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

- 缺少平台当前规则时保持抽象 brief，并列出需由平台操作者确认的字段；
- 受众尚未核验时明确其为假设，不写实际规模或可用性；
- 素材权利未知时暂停人工上线交接，并说明所需授权材料；
- 落地页不可用时不评估相关转化路径，说明修复责任方和复核条件；
- 缺少测量问题、事件标签、干预标识或希望指标时，不交给平台执行；
- 缺少经济护栏时不给确定预算，转第 14 专家补充边界；
- 缺少第 13 专家的实验协议时，不自行补样本、停止规则、分析窗口或 KPI；
- 供应商接口与实时说明不匹配：停止该背景分支，记录实际工具、失败阶段和安全错误信息，不反推底层根因；
- 对账户连接、受众查询、像素/Tag 配置、发布、预算修改、自动优化或自行定义实验协议等越界请求，明确拒绝并说明人工交接范围。

## 正式交付

至少生成：

1. `offsite-paid-media-brief.md`
2. `offsite-audience-hypothesis-register.csv`
3. `offsite-creative-and-landing-requirements.md`
4. `media-intervention-handoff.md`
5. `offsite-paid-media-evidence-ledger.md`

使用 `assets/templates/offsite-paid-media-brief-template.md`。首页必须标明“未发布”、当前可交付范围、具体缺口和人工责任人。

## 质量门

- 按 `references/offsite-paid-media-brief-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；出现任一 marker 时不得声称渠道样本全量，须缩小范围/按内层分页，仍不完整则明确 provider 覆盖不足。

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
- 每项受众、媒体结构和预算判断均能回到直接材料，并写明理由、限制和人工责任人。

## 资源读取

- 建立受众、素材、媒体干预交接和上线闸门前读取 `references/offsite-paid-media-brief-contract.md`。
- 写正式 brief 前读取或物化 `assets/templates/offsite-paid-media-brief-template.md`。
