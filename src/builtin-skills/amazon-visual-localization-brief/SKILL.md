---
name: amazon-visual-localization-brief
description: 基于已核实产品事实、品牌资产、权利状态和目标市场证据，为 Amazon 主图、场景图、生活方式图及 A+ 视觉需求编制市场本地化制作 brief。适用于视觉方向、场景设定、构图语言、资产处理约束和生图前交接；不适用于实际图片生成、编辑、批量任务、版本管理、网页趋势抓取、地域刻板印象或无证据的审美与合规结论。
---

<!--
文件功能：定义 Amazon 商品视觉本地化 brief 的输入证据、创意决策、权利门禁、跨资产一致性和生产交接流程。
职责边界：只把已批准的资产需求转成可追溯视觉方向，不生成或编辑图片，不接管 A+ 模块规划、文案、图像任务与版本链。
重要关联：字段与决策合同见 references/visual-localization-evidence-and-rights-contract.md；正式交付使用 assets/templates/visual-localization-delivery-template.md；实际图像生产交给 Product 内置 amazon-product-image-generation。
-->

# Amazon 视觉本地化 Brief

## 目标与单一责任

把“做得更符合目标市场”改写为一组可解释、可批准、可制作、可验收的视觉决策。正式 brief 必须回答：

1. 资产要帮助购物者理解什么；
2. 哪些元素来自产品、品牌与市场证据；
3. 哪些只是创意提案，谁批准了它；
4. 产品身份、事实、权利和跨图一致性如何保持；
5. 实际生产责任方收到什么明确约束。

责任边界固定如下：

- 本 Skill 拥有视觉方向、场景语义、构图语言、本地化决策、权利盘点和生产 handoff；
- Product 内置 `amazon-product-image-generation` 单一拥有图片生成、编辑、批量任务、轮询、资产版本与版本链；
- 专家 03 的 `amazon-aplus-content-planning` 单一拥有 A+ 目标、模块角色、叙事顺序、短文案和资产需求；
- 本 Skill 可以消费上游 `Module ID`、`Asset ID` 和 `Fact ID`，但不得重新规划 A+ 或直接调用图像工具。

用户只要求“生成或修改图片”且不需要视觉方向时，直接转交内置 Skill，不为触发本 Skill而增加无必要步骤。

## 运行合同

### 合法输入

- 用户对话与只读 `uploads/` 中的产品照片、包装、品牌规范、目标市场说明、参考资产和权利声明；
- 可信上游 `outputs/` 中的产品事实、受众问题、VOC、关键词、Listing 或 A+ 资产需求；
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在需要补充关键词需求、历史需求或 ASIN 供应商画像背景时按需使用；
- Agent 基于证据形成并由用户批准的创意决策。

不得把参考图“可访问”解释为“可复制或可商用”。对话声明、文件元数据和来源说明都要进入权利状态，不得自行推定版权、肖像权、商标权或地域使用权。

### 唯一外部业务数据源

- 新外部业务数据只允许当前 Agent 已注入的 `sif_mcp`；内层业务工具不是独立模型工具：描述时调用外层 `sif_mcp` 并传 `action=describe`、`kind=tool`、精确 `name`，执行时传 `action=call`、同一 `name` 与 `arguments`，禁止 `sif_mcp.<内层工具名>` 点式假调用；
- 本包候选工具只限 `market_get_keyword_demand`、`market_get_keyword_history` 和 `market_get_asin_profile`；每个业务工具在本任务首次 `call` 前必须单独 `describe`，只按当次机器 `inputSchema` 传参；schema 含 `country` 时必须在 `call.arguments.country` 显式传入有直接父证据的已确认站点，不依赖默认 US，目标站点不受支持时停止分支；
- 当前 SIF 业务工具没有机器 `outputSchema`。只使用本次真实返回且语义明确的字段，不把 description、`_formatted`、`_next_step`、供应商建议或未返回字段当稳定合同；
- SIF 没有图片像素、视觉趋势、审美、人口属性、评论正文、素材权利或创意正确性工具；关键词、销量、流量或 ASIN 标志不能反推出人物、场景、颜色、文化符号、图片内容或效果；
- 不使用网页、浏览器、Amazon 抓取、Bright Data、其他 MCP/API 或外部视觉趋势服务，也不读取、索要或保存凭据，不安装连接器，不静默换源。

SIF 不可见、失败、空结果、限流或 schema 漂移时，合法输入足够则继续；不足则保留 `limited_evidence` 或 `blocked`，不换源。

### 双层谱系与四轴证据

正式交付同时保留 `input_evidence` 与正式派生对象。输入证据记录 `evidence_id`、上游 `parent_evidence_id`、来源路径或定位、版本/期间、权利状态和原始四轴；输入层枚举不得挪作 Agent 派生对象的默认值。

每个正式 `decision` 对象在对象本体中直接记录：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `decision` | `decision_id` | 支撑当前本地化方向的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `normalized \| inference \| hypothesis` | 适用资产、决定类型、可执行决定、批准状态、批准人/时间和限制 |

输入证据的 `source_type` 允许 `sif_mcp | user_input | upstream_output`，派生决定则只能是 `agent`。每个决定的四轴必须逐条赋值，不能从父证据继承，也不能用对象轴、时间轴、单位轴或口径轴替代。本地化方向通常使用 `transformation_type=inference` 或 `hypothesis`；直接规范化才可使用 `normalized`，且不得伪装成市场事实。

每个原始 SIF 对象固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`，并直接记录 `source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、`coverage_or_pagination`、`estimation_status`、`result_state` 和 `raw_result_locator`。`agent_request_id` 与 `tool_call_id` 仅取当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。SIF 原始对象不能借用 Agent 派生决定的 `source_type=agent`。

`result_state` 严格区分 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`。前五项都不能解释为零需求、零竞争、无图片、无受众或无风险；只有本次返回对目标字段给出明确零证据时才能使用 `true_zero`。

### 工作区

- `uploads/` 只读，不改名、不覆盖、不写派生文件；
- `temp/visual-content/<case-id>/01-visual-localization/` 存放资产盘点、方向草图和冲突记录；
- `outputs/visual-content/<case-id>/01-visual-localization/` 存放唯一正式交付。

正式输出不得混入临时图、未批准方向或来源不明资产。

## 启动检查

### 最低输入

至少明确：

1. `case_id`、Amazon 站点、目标市场和目标语言；
2. 产品、变体和待制作资产的明确范围；
3. 足以锁定外观与宣称的产品事实；
4. 资产目的、目标受众问题和投放位置；
5. 品牌必须保持与禁止出现的元素；
6. 源资产、参考资产及其权利状态；
7. 若来自 A+，上游 `Module ID`、`Asset ID`、`Fact ID` 和已批准文案。

### 就绪状态

- `ready_for_brief`：事实、资产目的和权利足以形成可生产 brief；
- `limited_evidence`：可提出候选方向，但关键决定仍需用户批准；
- `rights_unverified`：可盘点和说明需求，不得把受影响资产列为可生产；
- `conflicted`：产品事实、品牌要求、权利或市场证据互相冲突；
- `blocked`：无法识别产品、资产目的或关键事实；
- `out_of_scope`：请求仅是生成、编辑、批量、上传、A+ 规划或合规裁定。

缺失不是零值。受影响字段使用 `unknown`，并说明它阻止了哪个决定。

## SIF 工具与 schema 预检

通常优先使用用户资料和可信上游。确需 SIF 外部背景时：

1. 确认当前 Agent definitions 中存在 `sif_mcp`；
2. 用 `search` 仅定位当前实际存在的候选工具，不使用文档中的旧名称或猜测名称；
3. 对本任务首次使用的每个候选工具执行 `describe`；
4. 通过外层 `sif_mcp` 传 `action=call`、精确 `name` 与 `arguments`；只按当次机器 `inputSchema` 组装最小 `call.arguments`；schema 含 `country` 时把有直接父证据的已确认站点显式写入 `call.arguments.country`，不依赖默认 US；同时锁定关键词或 ASIN、时间和分页范围；
5. 检查 Gateway/SIF 的真实调用状态，保存原始响应与调用范围；
6. 只把语义明确的返回登记为供应商观察，并与 Agent 推断和用户批准创意分开；
7. 参数错误时重新 `describe` 并修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止 SIF 分支。

不得猜工具名、参数、字段、单位或返回结构，不得把 ASIN 标志扩写为实际图片/视频内容，也不得把供应商观察改写成用户一方真值。

## 执行流程

### 第一步：冻结资产请求

为每个需求记录 `asset_id`、目标槽位、变体、语言、上游路径和版本。来自 A+ 时同时保留 `module_id` 与 `fact_ids`。不要合并外观不同的子体，也不要在方向讨论中悄悄改变资产目的。

### 第二步：建立产品身份、证据与权利账本

读取 `references/visual-localization-evidence-and-rights-contract.md`，分别登记：

- 形态、颜色、材质、部件、比例、包装、Logo 和不可改变的产品身份；
- 可视觉表达的 Fact IDs 与不得使用的宣称；
- 源资产路径、版本、提供方和可用范围；
- `confirmed_for_scope`、`user_asserted_unverified`、`permission_required`、`restricted` 或 `unknown` 权利状态；
- 已确认的品牌视觉规则与待批准项。

权利不清的资产只能用于风险盘点，不能列为可生产引用。

### 第三步：把市场证据与创意提案分开

每项本地化决定先分类：

- `evidence_supported`：有具体用户资料或输入证据支持；
- `user_approved`：没有外部证据，但用户明确选择；
- `proposed`：Agent 候选，尚不能进入生产；
- `rejected`：与事实、品牌、权利或用户决定冲突。

不得根据国家、地区或语言自动推断肤色、人物外貌、家庭结构、颜色、数字、宗教符号、收入水平、居住方式或“高级感”。涉及人物、地点、节庆、敏感符号、颜色含义和数字表达时，必须有适用证据或用户批准。

### 第四步：定义资产处理

对每个 `asset_id` 写清：

- 购物者问题与单一沟通任务；
- 主体、角度、动作、环境和空间关系；
- 构图、镜头距离、光线、色彩与背景语言；
- 必须继承的产品身份与品牌约束；
- 必须出现、可以出现和禁止出现的元素；
- 文字、单位和语言要求；
- 证据支持项、创意提案项和批准状态；
- 单资产验收方式。

方向必须能被生产者执行，避免只写“欧美风”“日系感”“高端”“年轻化”等无操作定义标签。

### 第五步：建立跨资产一致性

指定一个权利清楚、用户确认的 `consistency_anchor_asset_id`。没有合格锚点时标记待提供，不得假装锁定外观。跨资产至少检查：

- 产品形态、颜色、材质、部件和比例；
- Logo、包装与变体身份；
- 光照方向、背景语言、色彩系统和文字风格；
- 场景之间的使用逻辑；
- 每张图独立回答的问题，避免同质重复。

### 第六步：形成生产交接

把已批准方向交给 Product 内置 `amazon-product-image-generation`：

- 传递 `case_id`、`asset_id`、上游 IDs、身份锚点和可用源资产；
- 传递必须保持、允许改变、禁止新增和验收条件；
- 明确哪些文字或排版需要确定性生产工具；
- 只交接 `evidence_supported` 或 `user_approved` 决策；
- 不指定外部模型、服务、密钥、重试次数或宿主路径。

本 Skill 不调用 `ecommerce_image_generate`、`ecommerce_image_edit`、`ecommerce_image_batch` 或 `ecommerce_image_list`；这些工具的调用、状态和版本链由内置 Skill 负责。

### 第七步：写入正式交付

使用 `assets/templates/visual-localization-delivery-template.md`，将模板中的三类交付分别物化为正式文件。只写已核实信息和显式状态，不把候选方向写成批准结果。

## 失败与沟通

- `missing_product_identity`：停止视觉方向，只列需要锁定的外观事实；
- `missing_asset_purpose`：先请求明确购物者问题和槽位，不生成泛化创意；
- `rights_unknown`：隔离受影响资产，保留权利确认问题；
- `approval_required`：保留候选与决定差异，等待用户选择；
- `conflicted_sources`：列出冲突 Evidence IDs，不擅自挑选；
- `schema_mismatch`：重新 `describe` 并按机器 `inputSchema` 修正一次；仍不匹配则停止 SIF 背景分支；
- `policy_check_required`：只有用户或运营方当前规则能确认的事项留待复核；
- `out_of_scope`：生成、编辑、批量、上传、A+ 模块规划或合规审批。

失败不会触发网页、其他 MCP 或外部服务回退；SIF 失败也不影响已有充分合法证据支持的 brief。

## 正式交付

数据就绪时至少生成：

1. `visual-direction-brief.md`：范围、身份锁、本地化方向、资产处理和生产 handoff；
2. `asset-treatment-ledger.csv`：一行一个资产处理决定；
3. `visual-evidence-and-rights-ledger.md`：输入证据、Agent 决策、四轴、权利和批准状态。

核心事实或权利不足时只生成 `data-readiness.md`，不要输出可生产 brief。最终回复只链接 `outputs/` 中的正式文件。

## 质量门

- 每个资产都有明确沟通任务、产品身份、证据与验收；
- `input_evidence` 和 `agent_output` 谱系均完整，父级 Evidence IDs 可追溯；
- 权利状态和可用范围明确，未知资产没有进入生产清单；
- 本地化决定有证据或用户批准，没有地域、肤色、颜色或数字刻板印象；
- A+ 的 Module/Asset/Fact IDs 被保留，没有重排模块或改写上游文案；
- 生产交接没有直接调用图像工具或接管版本链；
- 没有网页趋势、外部视觉服务、固定平台规格或合规保证；
- 正式文件在 `outputs/`，中间文件在 `temp/`，`uploads/` 未改变。

## 资源读取

- 建立证据、权利与本地化决策前读取 `references/visual-localization-evidence-and-rights-contract.md`。
- 写正式交付前读取并物化 `assets/templates/visual-localization-delivery-template.md`。
