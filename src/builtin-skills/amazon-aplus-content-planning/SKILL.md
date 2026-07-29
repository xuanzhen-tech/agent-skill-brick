---
name: amazon-aplus-content-planning
description: 基于已核实产品事实、品牌叙事、VOC与关键词证据，规划 Amazon A+ 或 Premium A+ 的内容目标、模块顺序、文案草案和视觉资产需求 brief。适用于 A+ 内容架构、模块脚本、对比表规划和交付视觉专家的制作需求；不适用于判断账户资格、图片生成、模块上传、政策审批或无证据的视觉与转化承诺。
---

<!--
文件功能：定义 Amazon A+ 内容规划的事实输入、模块目标、视觉 brief、职责交接、失败语义和正式交付。
职责边界：只规划模块、文案和资产需求，不生成图片、不执行 Seller Central 操作、不断言品牌或 Premium A+ 资格。
重要关联：模块选择与视觉 brief 字段见 references/aplus-module-and-visual-brief-contract.md；正式交付使用 assets/templates/aplus-content-brief-template.md；实际视觉制作转交第04视觉内容专家或 Product 内置生图能力。
-->

# Amazon A+ 内容规划

## 目标与边界

把产品事实、用户问题与品牌叙事组织成可供设计和运营审阅的 A+ 内容 brief，回答：

1. 每个模块解决什么沟通任务；
2. 使用哪些已证事实和短文案；
3. 需要什么图片、图标、对比数据或输入资产；
4. 哪些内容仍待核验，不能进入制作；
5. 文案、视觉和后台操作分别由谁负责。

本 Skill 不选择未经核实的 Amazon 模块名称，不承诺账户有 A+ 或 Premium A+ 权限，也不生成或上传图片。

## 运行合同

### 合法输入

- 用户对话与 `uploads/` 中的产品规格、品牌资料、已有图片、包装、认证文件和视觉限制；
- 可信上游 `outputs/` 中的产品事实、Listing 文案、关键词架构、Review VOC 和竞品结构研究；
- Agent 对模块目标、叙事顺序、文案和资产需求的可追溯规划。

读取上游时保留路径、版本、期间、证据 ID、使用字段和限制。现有图片能否合法使用由用户或权利方确认，Agent 不自行推断版权。

### 禁止

- 本 Skill 不直接调用 `sif_mcp`；如果市场研究、关键词架构或质量审计曾使用 SIF，只消费其已经交付、可追溯的上游对象；
- 不调用 `product-shots` 原工具、Pangolinfo、DeepL、网页、浏览器、Amazon 抓取或其他 MCP；
- 不生成、编辑或渲染图片；
- 不声称具备 A+、Premium A+、品牌注册或具体模块资格；
- 不声称已在 Seller Central 创建、上传、提交或获批；
- 不编造测试结果、认证、对比数据、客户引用或使用场景；
- 不用未经核实的当前政策、像素尺寸、字符限制或模块清单作为硬事实；
- 不读取或索要密钥，不创建连接器。

### 四轴证据

每条业务证据同时记录：

- `source_type`：`user_input`、`upstream_output` 或 `agent`；
- `temporal_scope`：`current`、`historical`、`future`、`mixed`、`not_applicable` 或 `unknown`；
- `estimation_status`：`reported`、`estimated`、`forecast`、`mixed`、`not_applicable` 或 `unknown`；
- `transformation_type`：`raw`、`normalized`、`calculation`、`coding`、`inference` 或 `hypothesis`。

模块目标、叙事和视觉 brief 是 Agent 规划，应标为 `source_type=agent`，并引用所使用的事实、VOC 和关键词证据。上游对象在本包使用 `source_type=upstream_output`，同时保留其 `upstream_original_axes`、父证据 ID 和限制。上游供应商销量或流量只能说明来源口径，不能证明某模块会提高转化。

### 工作区

- `uploads/` 只读；
- `temp/listing-optimization/<case-id>/04-aplus-content-plan/` 存放事实矩阵、模块草图和资产盘点；
- `outputs/listing-optimization/<case-id>/04-aplus-content-plan/` 存放唯一正式 brief。

图片源文件保持原位只读；不得把草图或临时资产放入正式目录冒充成稿。

## 启动检查

### 最低输入

至少明确：

1. Amazon 站点、产品和变体范围；
2. 规划类型：普通 A+、Premium A+ 候选，或未确认；
3. 产品事实和不可使用宣称；
4. 品牌语气、目标受众和核心沟通任务；
5. 已有资产及其来源/权利状态；
6. 需要规划的内容范围，例如品牌故事、功能解释、使用场景或对比表。

账户资格未知不阻止内容 brief，但必须标记 `eligibility_unverified`，且所有具体模块与规格需要运营方在当前后台复核。

### 就绪状态

内容就绪与账户资格分别记录，避免把“内容可规划”和“后台可发布”混成一个状态。

内容就绪状态：

- `ready_for_brief`：事实和目标足以规划，资格/模块仍可作为发布前核验；
- `limited_assets`：可规划内容，但资产需求较多；
- `limited_evidence`：只能做结构草案，不能写部分卖点；
- `conflicted`：事实、品牌或资产权利冲突；
- `blocked`：无法识别产品或核心事实；
- `out_of_scope`：请求是生图、上传、资格裁定或政策审批。

资格状态独立使用 `verified_by_user` 或 `eligibility_unverified`；后者不影响内容规划，但不代表可发布。

## 上游合同预检

本 Skill 不主动取数。使用用户资料或可信上游前必须：

1. 确认来源路径、版本、站点、产品和变体范围可定位；
2. 确认 Fact ID、Keyword ID、VOC Evidence ID、Asset ID 与权利状态真实存在；
3. 保留上游原始四轴、父证据 ID、期间、估算属性和使用限制；
4. 仅使用上游明确交付的字段，不从供应商展示块、图片存在标志、未返回字段或描述扩写 A+ 内容；
5. 把 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted` 与有明确零证据的 `true_zero` 分开；
6. 上游合同、站点、变体或版本不匹配时停止受影响模块，不直接调用 SIF 或其他来源补齐。

合法资料足够则继续 brief；不足则失败关闭。A+ 原文、图片、视频、账户资格和可编辑权限必须由用户、上传资料或相应可信上游明确提供。

## 执行流程

### 第一步：建立事实与资产盘点

分别登记：

- 可用于文案的 Fact ID；
- 不可用或待确认宣称；
- 已有图片、视频、图标、品牌资产和权利状态；
- 需要新制作的资产；
- 变体共享内容和子体特有内容。

没有原始资产不等于可以虚构视觉内容。

### 第二步：定义沟通任务

把目标拆成具体任务，例如：

- 让用户理解产品是什么；
- 解释复杂结构或使用步骤；
- 用已证事实回应 VOC 中反复出现的疑虑；
- 说明适用与不适用场景；
- 展示变体或产品家族差异；
- 提供品牌背景，但不替代产品信息。

每个任务引用事实、VOC 或用户目标。不要使用“提升转化”“增强品牌”等空泛目标作为唯一依据。

### 第三步：选择内容模块角色

读取 `references/aplus-module-and-visual-brief-contract.md` 后，使用功能角色规划，而不是假设当前后台模块名称：

- `hero`：建立产品身份和核心价值；
- `feature_explanation`：解释一个复杂功能与事实；
- `use_context`：展示可证实的使用场景和限制；
- `how_to`：说明真实步骤或注意事项；
- `comparison`：仅比较有证据且同口径的产品/变体；
- `brand_story`：传达用户已提供的品牌事实；
- `faq_or_objection`：回应 VOC 中有证据的问题。

运营方后续应根据实际账户、站点和后台模块把功能角色映射为可用模块。

### 第四步：编排叙事顺序

1. 从产品识别与主要需求开始；
2. 将高认知负担的内容拆为独立模块；
3. 把事实支撑放在利益表述附近；
4. 将使用条件和限制放在不会被忽略的位置；
5. 避免相邻模块重复同一卖点；
6. 对比表必须固定比较对象、字段和证据。

顺序是一种信息架构假设，不是转化保证。

### 第五步：写模块文案草案

每个模块记录：

- 目标与受众问题；
- 标题、正文和可选标签草案；
- 使用的 Fact ID、Keyword ID 和 VOC Evidence ID；
- 不得出现的宣称；
- 需要视觉表达的关键信息；
- 运营方需核验的政策或模块限制。

文案遵循 `amazon-listing-copy-development` 的事实与语言质量门。未证信息只放在“待补资料”，不进入模块草案。

### 第六步：形成视觉 brief

先选择一个已确认能够代表本产品身份的资产作为 `consistency_anchor_asset_id`。它可以是用户确认的主图或其他权利清楚的基准图；没有合格锚点时，只能写待制作要求，不能假装已经锁定产品外观。所有模块共享一份视觉约束，至少记录产品外观、色彩、字体体系、光照方向和背景语言；不得从候选素材照搬未经当前运营核验的固定模块、像素、字号或安全区规则。

为每个资产写清：

- `asset_id` 和服务模块；
- `consistency_anchor_asset_id` 与本资产必须继承的共享视觉约束；
- 画面目的，而非只写“高级感”；
- 必须展示的产品、角度、动作、环境和比例关系；
- 必须真实可见的 Fact ID；
- 禁止添加的元素、文字、徽章或效果；
- 源资产路径与权利状态；
- 文案叠加、可读性和本地化要求；
- 单资产验收与跨模块一致性验收。

只输出 brief。把实际生成或编辑任务交给第 04 视觉内容专家或 Product 内置 `amazon-product-image-generation`。

### 第七步：一致性验收与局部返工

在交接前按同一锚点比较全部模块：

1. 产品形态、颜色、材质、部件与比例是否一致；
2. 色彩、字体、光照和背景语言是否属于同一视觉系统；
3. 子体特有属性是否误扩散到其他变体；
4. 每个模块是否仍忠实服务各自 Fact ID 和沟通任务。

若某个模块失败，只把受影响的 Module ID、Asset ID、失败项和返工约束交给视觉责任方；未受影响模块保持冻结。局部返工后仍需复核共享锚点，不能以整套无差别重做掩盖问题。

### 第八步：发布前交接

分别列出：

- 文案负责人要确认的事实和语言；
- 视觉负责人要制作的资产；
- 运营负责人要核实的账户资格、后台模块、尺寸、字符和提交规则；
- 法务/合规负责人要审核的高风险宣称；
- 仍阻塞制作的资料。

不得把“brief 完成”写成“A+ 已上线”。

## 失败与沟通

- `missing_product_facts`：停止卖点文案，只输出资料清单和结构占位。
- `missing_assets`：可以交付资产需求，不生成图片或假装已有素材。
- `rights_unknown`：资产只能列为待确认，不能进入可用清单。
- `eligibility_unverified`：继续内容规划，但明确不代表具备资格。
- `conflicted_sources`：暂停受影响模块，并列冲突。
- `upstream_contract_mismatch`：停止受影响模块，列出缺失 ID、版本或口径，不直接取数补齐。
- `out_of_scope`：生图、上传、资格裁定、后台审批或持续监控。

失败不会触发其他外部数据源。

## 正式交付

数据就绪时至少生成：

1. `aplus-content-brief.md`：目标、模块顺序、文案、证据与交接；
2. `aplus-asset-requirements.csv`：一行一个视觉资产需求；
3. `aplus-evidence-ledger.md`：来源路径、证据 ID、四轴和限制。

使用 `assets/templates/aplus-content-brief-template.md`。核心事实不足时只生成 `data-readiness.md`；资格未知不阻止 brief，但必须在首页和交接中标明。最终回复只链接 `outputs/` 文件。

## 质量门

- 每个模块都有具体沟通任务和证据；
- 每个文案宣称能回溯到 Fact ID；
- 每个视觉需求都有目的、必备元素、禁止元素和验收方式；
- 一致性锚点、共享视觉约束、跨模块验收和局部返工记录完整；
- 资产来源和权利状态明确；
- A+ 标志、账户资格、后台模块和发布状态没有混写；
- 没有未经核实的尺寸、字符限制、政策或模块名称；
- 没有图片生成、编辑、上传或审核通过承诺；
- 没有直接调用 SIF 或其他外部业务数据源；
- 供应商数据没有被解释为模块效果或因果证据；
- 正式文件位于 `outputs/`，中间文件位于 `temp/`。

## 资源读取

- 设计模块角色、对比表和视觉 brief 前读取 `references/aplus-module-and-visual-brief-contract.md`。
- 写正式 brief 前读取或物化 `assets/templates/aplus-content-brief-template.md`。
