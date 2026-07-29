---
name: amazon-product-infographic-specification
description: 把已核实的产品尺寸、功能、组成、差异和使用步骤转成 Amazon 信息图、对比图、尺寸图、功能标注图或操作图的可执行制作规格。适用于事实到版面信息结构、callout 数据账本、底图需求和制作验收；不适用于图片生成或编辑、A+ 模块规划、无证据比较、固定平台规格、网页抓取，或没有确定性排版能力时冒充已完成成品。
---

<!--
文件功能：定义 Amazon 商品信息图制作规格的事实原子、比较口径、版面结构、确定性生产门、证据谱系和正式交付。
职责边界：只输出可执行规格和生产 handoff，不生成底图、不排版长文本、不接管 A+ 模块或文案，也不宣称规格书是最终图片。
重要关联：信息原子、比较与生产状态见 references/infographic-fact-and-production-contract.md；正式交付使用 assets/templates/infographic-specification-delivery-template.md；图片底图交给内置 amazon-product-image-generation，精确排版交给实际可用的确定性工具或人工。
-->

# Amazon 商品信息图制作规格

## 目标与单一责任

把尺寸、卖点、对比和步骤从散落资料转成生产者可以逐项实现与验收的规格。交付必须回答：

1. 信息图要完成哪个购物者信息任务；
2. 每个可见数字、标签、比较和步骤来自哪条证据；
3. 版面按什么阅读顺序组织；
4. 哪些内容可交给图片底图生产，哪些必须确定性排字；
5. 当前环境能交付规格、底图还是最终成品。

责任边界固定如下：

- 本 Skill 拥有信息任务、事实原子、比较口径、版面结构、callout 与制作规格；
- Product 内置 `amazon-product-image-generation` 单一拥有底图生成、编辑、批量和版本链；
- 专家 03 的 `amazon-aplus-content-planning` 单一拥有 A+ 模块、顺序、短文案和资产需求；
- 本 Skill 可以消费 Module/Asset/Fact IDs，但不得替换模块结构、重写上游文案或直接调用图像工具；
- 长文本、表格、精确数字、单位、对齐和品牌字体需要确定性排版能力；能力不可用时必须输出 `production_tool_required`。

## 运行合同

### 合法输入

- 用户对话与只读 `uploads/` 中的规格书、尺寸、包装清单、使用说明、产品照片、品牌规则和权利声明；
- 可信上游 `outputs/` 中的产品事实、Listing 文案、A+ 资产需求、VOC、比较对象和证据；
- 用户提供并批准的标签、单位、翻译和当前运营约束。

竞品可见声明不等于可比较事实。比较对象、字段、单位、条件、期间和来源必须同时明确。

### 外部数据与 SIF 边界

- 本包不调用 `sif_mcp`；当前 SIF 没有权威产品尺寸、材质、包装清单、操作步骤、比较真实性、图片生产或确定性排版工具；
- SIF 的 ASIN、关键词、流量、销量和广告供应商观察不能成为信息图中的产品事实、尺寸、功效、比较值或使用说明；
- 所有可见信息原子只接受用户材料或带来源定位的可信上游证据；
- 不使用网页、浏览器、Amazon 抓取、Bright Data、其他 MCP/API、外部制图或设计服务，也不读取凭据、安装连接器或静默换源。

合法输入足够则继续；不足时保留缺失并失败关闭，不换源补齐。

### 双层谱系与四轴证据

正式交付同时记录 `input_evidence` 与正式派生对象。输入证据记录事实、尺寸、说明、图片、文案与比较证据的 `evidence_id`、`parent_evidence_id`、来源路径、定位、版本和原始四轴；输入层枚举不得挪作 Agent 派生对象的默认值。

每个正式派生对象在对象本体中直接记录以下字段，不能只在报告末尾账本中补写：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `info_atom` | `info_atom_id` | 支撑显示文字、数值、条件与限制的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `normalized \| calculation \| inference` | 显示内容、原值/单位、换算、对象范围、批准和禁止外推 |
| `layout_decision` | `layout_decision_id` | 支撑信息任务、原子选择和版面约束的 Evidence/Info Atom IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `inference \| hypothesis` | 区域、阅读顺序、信息任务、布局约束、移动端检查和验收 |

输入证据的 `source_type` 允许 `user_input | upstream_output`，派生对象则只能是 `agent`。派生对象的四轴必须逐条赋值，不能从父证据继承，也不能用对象轴、时间轴、单位轴或口径轴替代。

单位换算必须保留原值、公式、精度和舍入规则。版面顺序属于 Agent 推断，必须引用信息任务与事实原子，不能伪装成平台效果事实。

### 工作区

- `uploads/` 只读；
- `temp/visual-content/<case-id>/03-infographic-specification/` 存放事实归一、比较矩阵和版面草图；
- `outputs/visual-content/<case-id>/03-infographic-specification/` 存放唯一正式规格。

底图、排版草稿和最终图片必须用各自状态区分，不能把中间物放入正式目录冒充成品。

## 启动检查

### 最低输入

至少明确：

1. `case_id`、Amazon 站点、目标语言、产品和变体；
2. 信息图类型与单一信息任务；
3. 要展示的 Fact IDs、原始值、单位、条件和来源；
4. 目标槽位、可用画布约束和用户提供的当前规则；
5. 源图片、图标、Logo、字体及其权利状态；
6. 已批准标签或文案；
7. 若来自 A+，上游 Module/Asset/Fact IDs。

比较图还必须明确比较对象、同口径字段、期间和证据。缺一项时不得形成优势结论。

### 就绪与生产状态

- `ready_for_spec`：事实和信息任务足以交付制作规格；
- `limited_evidence`：只能规划已证部分；
- `rights_unverified`：可写规格，但受影响素材不可进入生产；
- `conflicted`：数值、单位、对象、文案或权利冲突；
- `production_tool_required`：规格完成，但当前没有确定性工具生产精确文字、数字或表格；
- `policy_check_required`：当前平台尺寸、文字或槽位规则需运营方核验；
- `blocked`：核心事实或信息任务不足；
- `out_of_scope`：请求是生图、A+ 规划、上传、合规裁定或无证据比较。

`ready_for_spec` 不等于最终资产完成。只有下游真实生产、取得成品且由可观察审计确认后，才能使用 `final_asset_observed`；本 Skill 本身不授予该状态。

## 输入与生产能力预检

本包只预检用户材料、可信上游和当前确定性生产能力：

1. 核对每个尺寸、标签、比较、步骤和限制的原始定位；
2. 检查单位、条件、对象范围、换算公式、精度与舍入；
3. 确认源图片、字体、Logo 和比较材料的权利；
4. 判断当前环境只能交付规格、可交付底图，还是具备确定性排版能力；
5. 事实冲突或生产能力不足时保留 `unknown` 或 `production_tool_required`。

不得调用 SIF 补产品事实，也不得猜单位、比较真实性、视觉内容或排版完成状态。

## 执行流程

### 第一步：冻结信息任务与资产需求

选择一种主任务：

- `dimension`：解释尺寸、间距、容量或适配关系；
- `feature_callout`：把可见部件与已证功能关联；
- `comparison`：比较同口径对象；
- `how_to`：展示真实步骤、顺序和注意事项；
- `whats_in_box`：展示已核实包装内容；
- `mixed`：只有多个任务无法合理拆分时使用，并说明阅读优先级。

记录 `asset_id`、目标槽位、语言、变体和上游 IDs。不要因为版面方便改变事实或合并不同子体。

### 第二步：建立事实原子

读取 `references/infographic-fact-and-production-contract.md`，每个 `info_atom_id` 记录：

- `parent_evidence_ids`；
- `source_type=agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`normalized | calculation | inference`；
- 可见标签或短文案；
- 原始事实、值、单位、条件和 Fact/Evidence IDs；
- 是否换算、如何舍入；
- 适用对象、变体与市场；
- 禁止外推的含义；
- 权利和批准状态。

缺失、未知、未测与真实零值必须分开。没有 Evidence ID 的数字、认证、评分、比较和性能宣称不得进入版面。

### 第三步：校验比较口径

比较图逐字段检查：

1. 对象是否明确且权利允许；
2. 指标定义、单位、测试条件和期间是否一致；
3. 数据是否覆盖所有对象；
4. 来源可靠性与估算状态是否可比较；
5. 文案是否只陈述证据支持的差异。

口径不一致时拆开展示或标记 `not_comparable`，不得补齐、归零或写“更好”。

### 第四步：设计阅读顺序

为每个版面区域指定：

- `layout_decision_id`、`region_id` 和阅读顺序；
- `parent_evidence_ids`；
- `source_type=agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`inference | hypothesis`；
- 该区域回答的问题；
- 使用的 Info Atom IDs；
- 主体图、图标、引导线、尺寸线或步骤编号；
- 文字层级、最大信息负担与移动端检查；
- 必须保持的产品身份和留白；
- 无障碍与语言方向要求；
- 区域验收条件。

版面选择应服务信息任务，不照搬固定模块、像素、图数、字号或文本占比。

### 第五步：拆分底图与确定性排版

分别输出：

- `base_visual_request`：无字或轻字的产品/场景底图需求，可交给内置图片生成 Skill；
- `deterministic_overlay_spec`：精确文字、数字、单位、表格、尺寸线、Logo、图标和对齐；
- `production_owner`：当前可用确定性工具、人工设计方或 `production_tool_required`；
- `acceptance_checks`：逐字符、逐数值、逐单位和视觉层级验收。

不要要求生成模型可靠渲染长文本、精确表格或大量数字。当前没有确定性排版能力时，只交付规格，不声称成品完成。

### 第六步：建立生产 Handoff

交给内置图片 Skill 的内容只包含底图需求、身份锚点、源资产、权利、必须保持和验收；不直接调用图像工具。交给确定性生产责任方的内容包含画布、区域、文字、数字、单位、字体/品牌资产、对齐和导出要求。

若资产服务 A+，保留原 Module/Asset/Fact IDs，不重排模块或重写文案。

### 第七步：执行规格验收

在交付前检查：

- 所有可见信息能回溯到 Info Atom 与 Evidence IDs；
- 文字、数字、单位和换算一致；
- 比较口径一致或显式 `not_comparable`；
- 产品身份、源资产和权利清楚；
- 底图与排版职责没有混写；
- 当前生产状态没有夸大。

### 第八步：写入正式交付

使用 `assets/templates/infographic-specification-delivery-template.md`，分别物化主规格、callout/data CSV 和证据账本。

## 失败与沟通

- `missing_fact`：删除受影响信息原子或列为资料请求，不用常识补值；
- `unit_conflict`：保留原值和冲突，停止换算与排版；
- `not_comparable`：取消优势文案，只展示可独立陈述的事实；
- `rights_unknown`：隔离受影响素材、Logo、图标或比较对象；
- `production_tool_required`：交付完整规格和责任方要求，不冒充成品；
- `policy_check_required`：列运营方需核验的当前规则；
- `unsupported_external_fact`：拒绝用 SIF、网页或其他供应商观察填补产品事实、尺寸、比较或步骤；
- `out_of_scope`：生图、A+ 规划、上传、合规审批或无证据优势。

失败不会触发 SIF、网页、其他 MCP、外部制图或设计服务回退。

## 正式交付

数据就绪时至少生成：

1. `infographic-production-spec.md`：信息任务、事实原子、版面、底图、排版和验收；
2. `callout-and-data-ledger.csv`：一行一个可见信息原子；
3. `infographic-evidence-ledger.md`：输入证据、Agent 布局决定、四轴、权利和批准。

核心事实不足时只生成 `data-readiness.md`。确定性工具不足时仍可生成上述规格，但首页必须标记 `production_tool_required`。最终回复只链接 `outputs/` 文件。

## 质量门

- 每个数字、单位、标签、步骤和比较均引用 Fact/Evidence IDs；
- 原值、换算、精度、舍入和适用对象可追溯；
- 比较对象、指标、单位、条件和期间一致；
- `input_evidence` 与 `agent_output` 双层谱系完整；
- 权利状态和批准状态明确；
- 版面区域有信息任务、阅读顺序和可复核验收；
- 底图与确定性排版职责分离；
- 没有固定尺寸、图数、分数、转化承诺或平台合规保证；
- 没有直接生成、编辑、A+ 重规划或把规格冒充成品；
- 正式文件在 `outputs/`，中间文件在 `temp/`，输入未改变。

## 资源读取

- 建立事实原子、比较和生产状态前读取 `references/infographic-fact-and-production-contract.md`。
- 写正式规格前读取并物化 `assets/templates/infographic-specification-delivery-template.md`。
