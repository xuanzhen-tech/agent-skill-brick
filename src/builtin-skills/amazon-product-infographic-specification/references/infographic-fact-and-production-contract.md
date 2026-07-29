<!--
文件功能：定义信息图事实原子、单位换算、比较完整性、版面区域、生产状态和双层谱系字段。
职责边界：只提供信息与生产合同，不包含固定平台尺寸、现成设计模板、图像生成提示词或无证据优势话术。
重要关联：../SKILL.md；正式呈现结构见 ../assets/templates/infographic-specification-delivery-template.md。
-->

# 信息图事实与生产合同

## 1. 输入证据记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `evidence_id` | 是 | 本案例稳定唯一 |
| `parent_evidence_id` | 上游存在时 | 保留上游 Evidence ID，没有时写 `none` |
| `source_type` | 是 | `user_input` 或 `upstream_output`；本包不直接调用 SIF |
| `source_path` | 是 | 对话、uploads 或可信 outputs 定位 |
| `source_locator` | 是 | 页码、字段、表格单元、图片区域或返回字段 |
| `source_version` | 是 | 文件、资产、查询或上游版本 |
| `temporal_scope` | 是 | current、historical、future、mixed、not_applicable 或 unknown |
| `estimation_status` | 是 | reported、estimated、forecast、mixed、not_applicable 或 unknown |
| `transformation_type` | 是 | raw、normalized、calculation、coding、inference 或 hypothesis |
| `rights_status` | 是 | confirmed_for_scope、user_asserted_unverified、permission_required、restricted 或 unknown |
| `limitations` | 是 | 口径、精度、期间、对象、缺失或权利限制 |

## 2. 信息原子

一个 `info_atom_id` 只承载一个可见事实、标签或步骤。

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `info_atom_id` | 是 | 一行一个可见信息单元 |
| `atom_type` | 是 | value、label、feature、step、warning、comparison 或 package_item |
| `display_text` | 是 | 已批准目标语言短文案 |
| `raw_value` | 数值时 | 原始数值，不覆盖 |
| `raw_unit` | 数值时 | 原始单位 |
| `display_value` | 数值时 | 最终显示数值 |
| `display_unit` | 数值时 | 最终显示单位 |
| `conversion_formula` | 换算时 | 公式、常量来源、精度和舍入 |
| `condition` | 是 | 测试、使用、安装或测量条件；无则 not_applicable |
| `object_scope` | 是 | 产品、变体、部件、包装项或比较对象 |
| `parent_evidence_ids` | 是 | 支撑当前可见内容 |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 是 | `normalized` / `calculation` / `inference` |
| `approval_status` | 是 | evidence_supported、user_approved、proposed 或 rejected |
| `rights_status` | 是 | 对图标、Logo、图片或第三方对象记录权利 |
| `prohibited_inference` | 是 | 明确不能从该原子推出什么 |

估算值必须显示估算性质。换算后不能删除原值、来源与公式。未知、未提供、未测试和零值是不同状态。

## 3. 比较完整性

比较项使用以下联合键：

`comparison_object + metric_definition + unit + condition + temporal_scope`

只有联合键一致时才能并排比较。每个比较字段还要记录：

- `comparison_id`；
- 比较对象及身份；
- 指标定义与测量方法；
- 原值、单位、条件和期间；
- Evidence IDs 与估算状态；
- 缺失状态；
- 允许的陈述；
- 禁止的优势外推。

任一对象缺少同口径值时使用 `not_comparable`。不得把缺失写成零，不得用不同测试条件制造优势，也不得使用没有证据的“领先”“最佳”或百分比提升。

## 4. 版面区域

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `layout_decision_id` | 是 | 本层版面决定稳定唯一 |
| `region_id` | 是 | 版面区域稳定标识 |
| `reading_order` | 是 | 从 1 开始的明确顺序 |
| `information_task` | 是 | 该区域回答的问题 |
| `info_atom_ids` | 是 | 区域使用的原子 |
| `parent_evidence_ids` | 是 | 支撑信息任务、原子选择与版面约束的 Evidence/Info Atom IDs |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 是 | `inference` / `hypothesis` |
| `visual_base` | 是 | 产品底图、图标、线条、空白或其他可执行描述 |
| `overlay_elements` | 是 | 精确文字、数字、单位、尺寸线、表格或 Logo |
| `identity_constraints` | 是 | 产品与变体必须保持项 |
| `layout_constraints` | 是 | 相对位置、对齐、层级、留白和语言方向 |
| `mobile_check` | 是 | 缩小后仍需识别的内容 |
| `acceptance_check` | 是 | 可观察验收条件 |

不在没有当前证据时写固定像素、字号、安全区或文本占比。用户提供当前规则时引用其 Evidence ID 和适用期间。

## 5. 双层 Agent 输出

Agent 输出至少有两类记录：

- `info_atom`：把输入证据规范化成可见信息；对象本体直接保留 `info_atom_id`、`parent_evidence_ids`、`source_type=agent`、`temporal_scope`、`estimation_status` 与 `transformation_type=normalized | calculation | inference`。
- `layout_decision`：把信息任务映射为版面区域和阅读顺序；对象本体直接保留 `layout_decision_id`、`parent_evidence_ids`、`source_type=agent`、`temporal_scope`、`estimation_status` 与 `transformation_type=inference | hypothesis`。

两类派生对象的 `temporal_scope` 均只允许 `current | historical | future | mixed | not_applicable | unknown`，`estimation_status` 均只允许 `reported | estimated | forecast | mixed | not_applicable | unknown`。四轴还必须与批准状态、适用资产和限制在同一对象中记录。

## 6. 生产状态

| 状态 | 含义 | 可以宣称 |
|---|---|---|
| `spec_ready` | 事实、版面和验收规格完成 | 制作规格已就绪 |
| `base_visual_handoff_ready` | 无字或轻字底图需求可交接 | 可交给内置图片 Skill |
| `production_tool_required` | 精确排字所需确定性能力不可用 | 仍需生产工具或人工 |
| `production_in_progress` | 外部责任方明确反馈正在制作 | 仅报告收到的状态 |
| `final_asset_observed` | 已实际取得并观察成品 | 可进入独立质量审计 |
| `blocked` | 核心事实、权利或对象不足 | 只交付准备清单 |

本 Skill 自身最多产生 `spec_ready` 或 `base_visual_handoff_ready`。没有实际生产与观察证据时，不得使用 `final_asset_observed` 或“已完成成品”。

## 7. 生产 Handoff

### 底图 handoff

- `case_id`、`asset_id`、上游 IDs；
- 产品身份锚点与可用源资产；
- 主体、角度、动作、环境和留白；
- 必须保持、允许改变、禁止新增；
- 权利状态和底图验收。

### 确定性排版 handoff

- 画布和用户提供的当前约束；
- Region IDs、阅读顺序和相对布局；
- 逐字 `display_text`、逐值数字、单位和符号；
- 字体、Logo、图标及权利；
- 对齐、留白、语言方向与导出要求；
- 逐字符、逐数值和缩略验收。

两个 handoff 不包含外部服务、凭据、自动上传或完成承诺。
