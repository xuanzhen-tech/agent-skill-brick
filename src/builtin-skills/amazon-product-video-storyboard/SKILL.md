---
name: amazon-product-video-storyboard
description: 基于已核实产品事实、品牌目标、素材权利和投放约束，为 Amazon 主图视频、品牌视频、功能演示或使用教程编制创意 brief、脚本、镜头清单与分镜。适用于事实到叙事、逐镜证据、口播字幕、连续性、安全和制作交接；不适用于视频生成、拍摄、剪辑、上传、后台监控、平台资格裁定、视觉趋势抓取或无证据的效果承诺。
---

<!--
文件功能：定义 Amazon 商品视频策划的事实输入、叙事结构、逐镜证据、素材权利、连续性、安全边界和制作交接。
职责边界：只交付创意 brief、脚本与 storyboard，不生成、拍摄、剪辑或上传视频，不接管 A+ 模块/文案，也不声称策划稿已经生产。
重要关联：逐镜、宣称、连续性与权利字段见 references/video-shot-evidence-and-handoff-contract.md；正式交付使用 assets/templates/video-storyboard-delivery-template.md；需要静态视觉资产时交给内置 amazon-product-image-generation。
-->

# Amazon 商品视频分镜

## 目标与单一责任

把“做一个产品视频”转成事实约束、逐镜可生产、责任清楚的脚本与 storyboard。正式策划必须回答：

1. 视频服务哪个受众问题和投放目标；
2. 每句口播、字幕、动作和视觉证明引用什么事实；
3. 每个镜头需要什么素材、人物、场景和权利；
4. 产品身份、动作连续性、使用安全和品牌语气怎样保持；
5. 拍摄、静态资产、剪辑、审核和上传分别由谁负责。

责任边界固定如下：

- 本 Skill 拥有创意 brief、叙事节拍、脚本、逐镜 storyboard、证据与制作 handoff；
- Product 内置 `amazon-product-image-generation` 只在下游负责所需静态图片的生成、编辑、批量和版本链；
- 专家 03 的 `amazon-aplus-content-planning` 单一拥有 A+ 模块、顺序和短文案；
- 本 Skill 不生成视频，不调用不存在的视频工具，不拍摄、剪辑、配音、渲染、上传或持续监控。

用户只要求视频成品时，先说明当前可交付范围；不能用策划文档冒充成品。

## 运行合同

### 合法输入

- 用户对话与只读 `uploads/` 中的产品事实、说明书、品牌规范、已有图片/视频/音频、人物授权和制作约束；
- 可信上游 `outputs/` 中的产品事实、VOC、关键词、Listing/A+ 文案、视觉 brief 和资产清单；
- 用户批准的目标、受众、时长、投放位置、语言、口播语气和禁用宣称。

已有视频、音乐、字体、人物和场景必须分别记录来源与权利。能够访问素材不等于拥有剪辑、配音、肖像或商业发布许可。

### 外部数据与 SIF 边界

- 本包不调用 `sif_mcp`；当前 SIF 没有视频素材、评论正文、脚本效果、人物/音乐权利、拍摄、配音、剪辑或上传工具；
- SIF 的 ASIN、关键词、流量、销量和广告供应商观察不能证明产品动作、使用步骤、安全条件、客户原话或镜头效果；
- 脚本事实、受众问题和制作素材只接受用户材料或带来源定位的可信上游；
- 不使用网页、浏览器、Amazon 抓取、Bright Data、其他 MCP/API、外部视频生成或趋势服务，也不读取凭据、安装连接器或静默换源。

合法资料足够时继续；不足则只交付准备清单，不换源。

### 双层谱系与四轴证据

正式交付同时记录 `input_evidence` 与正式派生对象。输入证据记录产品事实、VOC、批准文案、素材和权利的 `evidence_id`、`parent_evidence_id`、来源路径、版本和原始四轴；输入层枚举不得挪作 Agent 派生对象的默认值。

每个正式派生对象在对象本体中直接记录以下字段，不能只在报告末尾账本中补写：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `narrative_decision` | `narrative_decision_id` | 支撑受众问题、信息任务和节拍顺序的 Evidence/Claim IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `inference \| hypothesis` | Beat、顺序、信息任务、时长、进入/退出条件和必须保留限制 |
| `claim` | `claim_id` | 支撑目标表达、条件与限制的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `normalized \| inference \| hypothesis` | 原事实、脚本表达、条件、批准和复核责任 |
| `shot` | `shot_id` | 支撑画面、动作、语言与限制的 Evidence/Claim/Narrative IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `inference \| hypothesis` | Beat、顺序、时长、画面、动作、连续性、权利、制作责任和验收 |

输入证据的 `source_type` 允许 `user_input | upstream_output`，派生对象则只能是 `agent`。派生对象的四轴必须逐条赋值，不能从父证据继承，也不能用对象轴、时间轴、单位轴或口径轴替代。

叙事、镜头和自然口播是 Agent 输出，必须引用父证据。戏剧化表达不得改变事实、条件、限制、单位或风险信息。

### 工作区

- `uploads/` 只读；
- `temp/visual-content/<case-id>/04-video-storyboard/` 存放素材盘点、节拍草图、时长预算和脚本迭代；
- `outputs/visual-content/<case-id>/04-video-storyboard/` 存放唯一正式策划交付。

中间音视频、未授权素材和脚本草稿不得放入正式目录冒充成品。

## 启动检查

### 最低输入

至少明确：

1. `case_id`、Amazon 站点、目标语言和产品/变体；
2. 视频类型、投放位置、目标、受众问题和期望时长；
3. 足以支撑脚本的 Product Fact IDs 与禁用宣称；
4. 品牌语气、必须包含与禁止内容；
5. 已有图片、视频、Logo、音乐、字体、人物及权利状态；
6. 真实使用步骤、安全警示和不可演示动作；
7. 若来自 A+，上游 Module/Asset/Fact IDs。

平台资格、时长、尺寸、音频和提交规则若未由用户提供当前证据，标记 `policy_check_required`，不阻止概念策划，但阻止“可直接上传”结论。

### 就绪与生产状态

- `ready_for_storyboard`：事实、目标和关键素材要求足以形成逐镜策划；
- `limited_evidence`：只能策划已证片段；
- `limited_assets`：可形成素材需求，但不能声称可直接生产；
- `rights_unverified`：受影响素材、人物或音乐不能进入生产清单；
- `safety_review_required`：动作、警示或演示需要用户/专业方核验；
- `policy_check_required`：投放资格或当前规格待运营方核验；
- `conflicted`：事实、文案、素材、权利或时长互相冲突；
- `blocked`：无法识别产品、目标或核心事实；
- `out_of_scope`：请求是生成、拍摄、剪辑、上传、监控或资格裁定。

本 Skill 自身最多达到 `ready_for_storyboard`，不得写 `video_completed` 或 `uploaded`。

## 输入与制作能力预检

本包只预检用户材料、可信上游和当前制作责任：

1. 核对产品事实、使用步骤、Approved Claim、受众问题和目标语言；
2. 冻结图片、视频、人物、音乐、字体、Logo、场景及其权利状态；
3. 区分静态底图、实拍、口播、音频、剪辑和运营上传责任；
4. 检查当前环境能否观察源素材，但不把可访问等同于可商用；
5. 缺事实、权利、时长来源或制作能力时保留相应阻塞状态。

不得调用 SIF 补评论正文、视频内容、使用动作、用户一方指标或平台资格。

## 执行流程

### 第一步：冻结创意任务

记录：

- 视频类型：`main_image_video`、`brand_video`、`feature_demo`、`how_to` 或用户定义类型；
- 单一主要目标与受众问题；
- 目标时长及其来源；
- 产品、变体、市场、语言和投放位置；
- 上游 Module/Asset/Fact IDs；
- 当前政策、权利和安全待核验项。

目标时长未知时，可以使用镜头相对顺序，不自行宣称固定平台时长。

### 第二步：建立事实、宣称与素材账本

读取 `references/video-shot-evidence-and-handoff-contract.md`，分别登记：

- Product Fact IDs、适用条件和不得外推含义；
- Approved Claim IDs、原文、目标语言和批准状态；
- VOC 或受众问题及其证据；
- 图片、视频、Logo、音乐、字体、人物、场景和权利；
- 使用步骤、动作顺序、安全条件与专业复核要求。

没有事实支持的功效、比较、认证、销量、评价、时间节省和结果承诺不得进入脚本。

### 第三步：设计叙事节拍

每个 Beat ID 只承担一个叙事任务，例如：

- 识别产品和使用情境；
- 展示问题或使用条件；
- 用动作证明一个已证功能；
- 展示步骤与限制；
- 总结适用对象和下一行动。

节拍顺序是信息架构，不是转化公式。避免固定“痛点—夸张冲突—万能解决—促销”模板。

每个节拍还必须以 `narrative_decision_id` 作为稳定派生 ID，并直接记录 `parent_evidence_ids`、`source_type=agent`、`temporal_scope=current | historical | future | mixed | not_applicable | unknown`、`estimation_status=reported | estimated | forecast | mixed | not_applicable | unknown` 和 `transformation_type=inference | hypothesis`。

### 第四步：写自然但事实不变的脚本

为每段口播和字幕记录：

- Claim ID 与 Parent Evidence IDs；
- `source_type=agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`normalized | inference | hypothesis`；
- 原事实、目标语言表达和条件；
- 语气、说话者和时长预算；
- 屏幕文字与口播是否重复；
- 禁止删减的单位、限制、警示和否定；
- 批准状态。

去除空泛形容词和机械 AI 腔，但不得为了自然表达虚构体验、客户证言或权威证明。高风险健康、安全、法律或认证表述交专业方复核。

### 第五步：建立逐镜 storyboard

每个 Shot ID 至少记录：

- Beat ID、顺序、预计时长和镜头目的；
- `parent_evidence_ids`；
- `source_type=agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`inference | hypothesis`；
- 画面、主体、动作、场景、镜头与转场；
- Product/Variant Identity IDs；
- VO、字幕、声音或音乐需求；
- Claim/Fact/Evidence IDs；
- 所需源资产与权利状态；
- 连续性、安全和禁止内容；
- 制作责任方与验收。

画面不能展示产品实际做不到的动作，也不能用剪辑暗示不存在的结果。

### 第六步：检查连续性与可制作性

跨镜头检查：

- 产品、颜色、材质、部件、包装和变体一致；
- 手部、人物、道具、场景、时间与动作衔接；
- 使用步骤和因果顺序真实；
- 口播、字幕、画面与事实一致；
- 素材、人物、音乐、字体和商标权利完整；
- 每个镜头有明确生产责任和验收；
- 总时长预算与用户目标一致。

缺少镜头素材时输出资产需求，不用无权素材或未定义视频工具补齐。

### 第七步：拆分制作 Handoff

分别交付：

- `static_asset_handoff`：需要的静态底图、身份锚点和验收，可转交内置图片 Skill；
- `capture_handoff`：实拍主体、动作、场景、道具、安全与授权；
- `voice_and_audio_handoff`：口播、发音、音乐/声音权利和混音要求；
- `edit_handoff`：镜头顺序、时长、转场、字幕、Logo、导出和验收；
- `operations_handoff`：由运营方核验资格、规格、上传和发布。

本 Skill 不执行任何 handoff 的生产动作，也不在后台等待完成。

### 第八步：写入正式交付

使用 `assets/templates/video-storyboard-delivery-template.md`，分别物化创意 brief、storyboard CSV 和证据权利账本。

## 失败与沟通

- `missing_product_facts`：停止相关镜头与宣称，只列资料需求；
- `missing_story_objective`：先明确受众问题，不写泛化品牌片；
- `rights_unknown`：隔离受影响人物、视频、音乐、字体、Logo 或地点；
- `safety_review_required`：保留准确动作和风险，不替专业方批准；
- `duration_conflict`：列必须保留内容与取舍，不擅自删事实或警示；
- `policy_check_required`：由运营方核验当前资格和提交规则；
- `unsupported_external_context`：拒绝用 SIF、网页或其他外部观察补评论正文、产品动作、素材权利或制作能力；
- `out_of_scope`：生成、拍摄、剪辑、配音、渲染、上传或持续监控。

失败不会触发 SIF、网页、其他 MCP 或外部视频服务回退。

## 正式交付

数据就绪时至少生成：

1. `video-creative-brief.md`：目标、事实、叙事、脚本、素材需求和制作 handoff；
2. `video-storyboard.csv`：一行一个镜头；
3. `video-evidence-and-rights-ledger.md`：输入证据、Claim/Shot 决策、四轴、素材权利和批准。

核心事实、目标或关键权利不足时只生成 `data-readiness.md`。最终回复只链接 `outputs/` 的策划文件，不声称视频成品已生成、剪辑或上传。

## 质量门

- 每个口播、字幕、动作和可见证明都引用 Fact/Claim/Evidence IDs；
- `input_evidence` 与 `agent_output` 双层谱系完整；
- 人物、音乐、字体、Logo、场景和源视频权利状态明确；
- 每个 Shot 有目的、画面、声音、连续性、安全、责任方和验收；
- A+ 上游 IDs 被保留，没有重排模块或擅改批准文案；
- 静态图片需求只交给内置 Skill，没有直接调用图片工具；
- 没有生成、拍摄、剪辑、配音、上传、后台监控或完成承诺；
- 没有固定平台规格、CTR/CVR、排名、销量或资格保证；
- 正式文件在 `outputs/`，中间文件在 `temp/`，输入素材未改变。

## 资源读取

- 建立事实、宣称、逐镜和制作 handoff 前读取 `references/video-shot-evidence-and-handoff-contract.md`。
- 写正式策划前读取并物化 `assets/templates/video-storyboard-delivery-template.md`。
