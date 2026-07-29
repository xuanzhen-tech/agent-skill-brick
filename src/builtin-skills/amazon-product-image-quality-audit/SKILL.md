---
name: amazon-product-image-quality-audit
description: 对 Amazon 主图、副图、场景图、生活方式图和 A+ 视觉资产执行版本冻结、可观察证据、产品事实、信息层级、跨图一致性与权利来源审计。适用于现有图片诊断、改图前问题定位、生成结果验收和局部返工交接；不适用于图片生成或编辑、任意评分与权重、CTR/CVR 预测、网页抓取、平台合规保证或看不到图片时臆测视觉问题。
---

<!--
文件功能：定义 Amazon 商品图片独立质量审计的对象冻结、观察能力门、逐问题证据、优先级、返工交接和正式输出。
职责边界：只诊断和验收既有资产，不生成或编辑图片，不接管内置图像能力的任务状态与版本链，也不提供法律或平台合规结论。
重要关联：观察状态与问题字段见 references/image-audit-observation-and-evidence-contract.md；正式交付使用 assets/templates/image-quality-audit-delivery-template.md；实际返工交给 Product 内置 amazon-product-image-generation。
-->

# Amazon 商品图片质量审计

## 目标与单一责任

把“这张图不好”拆成可定位、可解释、可修复、可复核的问题。每个问题必须回答：

1. 审计的是哪个资产、版本和路径；
2. Agent 是否真的观察到了相关像素内容；
3. 哪个可见区域或元数据构成问题证据；
4. 它可能影响准确性、识别、理解、信任或生产就绪中的哪一项；
5. 应修改什么、保留什么、怎样验收。

责任边界固定如下：

- 本 Skill 拥有独立图片审计、问题账本、返工规格和修订验收；
- Product 内置 `amazon-product-image-generation` 单一拥有实际生成、编辑、批量、轮询、资产版本和版本链；
- 内置 Skill 的生成时质量门不替代本 Skill 对任意现有资产的独立审计；
- 专家 03 拥有 A+ 模块、顺序和文案；本 Skill 只核对其视觉资产是否忠实服务上游 Module/Asset/Fact IDs。

本 Skill 不直接调用图像生成或编辑工具。用户要求修改时，先交付精准问题账本，再把受影响资产交给内置 Skill。

## 运行合同

### 合法输入

- 用户提供或只读 `uploads/` 中可实际访问的 PNG、JPEG、WebP、PDF 页面或图片集合；
- 可信上游 `outputs/` 中的图像 artifact、资产清单、版本信息、产品事实、视觉 brief 和 A+ 需求；
- 用户提供的当前品牌规则、运营规则与审计目标。

图片来源、权利和版本必须独立记录。文件名相同不代表版本相同，能够读取元数据不代表已经观察像素。

### 外部数据与 SIF 边界

- 本包不调用 `sif_mcp`；当前 SIF 没有图片资产、像素观察、图片质量、素材权利或平台合规工具；
- SIF 的 ASIN、关键词、流量、销量和广告供应商观察不能证明实体产品外观、当前图片内容、品牌授权或发布资格；
- 产品事实只能来自用户材料或带来源定位的可信上游，不用供应商 Listing 观察填补产品真相缺口；
- 不使用网页、浏览器、Amazon 抓取、Bright Data、其他 MCP/API 或外部图片诊断服务，也不读取凭据、安装连接器或静默换源。

合法输入足够时继续；事实或观察能力不足则把相应维度标为 `not_assessed`，必要时整体失败关闭。

### 双层谱系与四轴证据

审计同时保留 `input_evidence` 与正式派生对象。输入证据记录资产、元数据、产品事实、品牌规则与上游要求的 `evidence_id`、`parent_evidence_id`、来源路径、版本和原始四轴；输入层枚举不得挪作 Agent 派生对象的默认值。

每个正式派生对象在对象本体中直接记录以下字段，不能只在报告末尾账本中补写：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `observation` | `observation_id` | 支撑当前可见观察的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | 固定 `inference` | 资产/版本、区域、可见事实、观察状态和限制 |
| `issue` | `issue_id` | 支撑问题判断的 Observation/Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | 固定 `inference` | 问题类型、影响机制、修复规格、验收、优先级和状态 |

输入证据的 `source_type` 允许 `user_input | upstream_output`，派生对象则只能是 `agent`。派生对象的四轴必须逐条赋值，不能从父证据继承，也不能用对象轴、时间轴、单位轴或口径轴替代。

像素观察是 Agent 从图像形成的 `inference`，必须绑定冻结资产。影响机制也是推断，不得写成 CTR、CVR、排名或下架因果事实。

### 工作区

- `uploads/` 只读；
- `temp/visual-content/<case-id>/02-image-quality-audit/` 存放冻结清单、观察记录、缩略图或局部核对中间产物；
- `outputs/visual-content/<case-id>/02-image-quality-audit/` 存放唯一正式审计。

不得覆盖源图片，不得把临时预览冒充正式资产。

## 启动检查

### 最低输入

至少明确：

1. `case_id`、Amazon 站点、目标语言和审计目标；
2. 每个资产的 `asset_id`、`version_id` 和 `source_path`；
3. 资产角色、目标槽位和变体范围；
4. 足以核对外观与宣称的产品事实；
5. 已知品牌、权利和当前运营约束；
6. 若来自 A+，上游 Module/Asset/Fact IDs。

缺少 `version_id` 时创建本次审计快照 ID，并说明它不是生产系统版本号。审计进行中发生变化时，新建版本记录，不覆盖原对象。

### 观察状态

每个资产必须使用以下状态之一：

- `observed`：当前 Agent 已通过实际可用能力观察完整图像；
- `partially_observed`：只观察了部分页面、区域、帧或降采样预览；
- `metadata_only`：只能读取路径、尺寸、格式、版本或文本元数据；
- `unavailable`：当前无法访问或解码资产。

只有 `observed` 或明确范围的 `partially_observed` 可以产生对应视觉问题。`metadata_only` 与 `unavailable` 的视觉维度一律 `not_assessed`，不得打零分或凭文件名推断。

### 审计就绪状态

- `ready`：资产已冻结，目标维度可观察且产品事实足够；
- `partial`：只能审计部分资产或维度；
- `rights_unverified`：可以审计可见质量，但不能认定可生产或可发布；
- `stale`：资产或事实版本过旧；
- `conflicted`：产品、资产、品牌或规则互相冲突；
- `observation_unavailable`：无法实际观察请求中的视觉维度；
- `blocked`：无法取得审计对象或关键事实；
- `out_of_scope`：请求是生成、编辑、法律裁定、发布或效果保证。

## 观察能力与输入预检

本包只预检当前 Agent 对本地资产的真实观察能力和输入证据：

1. 冻结资产路径、版本、格式、尺寸和可解码状态；
2. 确认当前能力实际观察到完整图片、局部区域还是仅元数据；
3. 核对产品事实、品牌规则和上游要求是否具有可定位证据；
4. 将观察范围外的维度标为 `not_assessed`；
5. 输入冲突、文件不可读或事实不足时停止受影响判断。

不得调用 SIF 补图片内容，也不得猜媒体内容、产品外观、权利或政策结论。

## 执行流程

### 第一步：冻结审计对象

读取 `references/image-audit-observation-and-evidence-contract.md`，为每个资产记录：

- `asset_id`、`version_id`、`source_path`、文件指纹或本次快照标识；
- 资产角色、槽位、市场、语言和变体；
- 观察状态、观察范围、观察时间和使用能力；
- 上游 Module/Asset/Fact IDs；
- 来源与权利状态。

审计报告标题、问题账本和返工交接必须引用同一冻结标识。

### 第二步：建立保留清单

先记录不应被返工破坏的有效部分：

- 正确的产品形态、颜色、材质、部件和比例；
- 清楚的资产角色与主体识别；
- 已证且准确的文字、单位和标识；
- 权利清楚的品牌元素；
- 与资产套图一致的光照、背景和构图语言。

审计不是无差别重做。

### 第三步：逐维度观察

仅在观察与证据支持时检查：

- `product_identity`：外观、变体、包装和部件是否符合事实；
- `factual_claims`：可见文字、图标和场景是否超出 Fact IDs；
- `asset_role`：主图、卖点图、场景图或 A+ 资产是否完成指定任务；
- `thumbnail_recognition`：缩略尺度下主体与关键信息是否仍可识别；
- `hierarchy_readability`：信息顺序、文字负担、对比和移动端可读性；
- `scene_plausibility`：动作、比例、环境和使用方式是否真实；
- `cross_asset_consistency`：产品、变体、Logo、包装与视觉系统是否一致；
- `source_and_rights`：资产来源与使用范围是否可追溯；
- `provided_policy_check`：仅核对用户提供且适用于当前站点/期间的规则。

没有相应能力、事实或当前规则时，把维度标为 `not_assessed` 或 `policy_check_required`。

### 第四步：建立逐问题记录

每个问题独立记录：

- 精确 `asset_id`、`version_id`、路径和区域；
- Observation ID 与可见事实；
- 问题类型和父 Evidence IDs；
- `source_type=agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type=inference`；
- 影响机制与受影响资产；
- 必须保留内容；
- 精准修复动作；
- 修改后验收；
- 优先级、状态与不确定性。

不要把多个不同根因压成“图片不专业”或“转化差”一句话。

### 第五步：安排优先级

不使用总分、固定权重或字母等级。优先级只使用：

- `must_fix`：事实错误、产品/变体错配、权利阻断或会误导用户；
- `high_value`：证据充分，修复可明显改善识别、理解或资产职责；
- `refinement`：局部表达、对齐或一致性改进；
- `needs_evidence`：疑似问题，但缺少决定性事实或规则；
- `not_assessed`：范围、观察能力或证据不支持。

优先级不代表效果预测。

### 第六步：形成局部返工规格

用户要求修改时，只交接受影响资产：

- 精确 `asset_id`、`version_id`、路径和问题区域；
- 必须保持、允许改变、禁止新增；
- 可使用源资产与权利范围；
- 修复动作、父 Evidence IDs 和验收；
- 未受影响资产继续冻结。

将交接传给内置 `amazon-product-image-generation`。本 Skill 不直接编辑，也不指定外部模型、服务、重试或存储实现。

### 第七步：执行修订验收

返工结果必须创建新 `version_id`，不能覆盖原审计对象。逐项复核：

1. 原 Issue ID 是否解决；
2. 保留清单是否完整；
3. 是否引入新事实、权利或一致性问题；
4. 跨资产身份锚点是否仍成立。

无法观察新版本时，状态为 `observation_unavailable`，不能关闭问题。

### 第八步：写入正式交付

使用 `assets/templates/image-quality-audit-delivery-template.md`，分别物化主报告、问题 CSV 和证据账本。

## 失败与沟通

- `asset_not_frozen`：先固定 asset/version/path，不开展审计；
- `observation_unavailable`：视觉维度 `not_assessed`，只报告元数据或访问问题；
- `missing_product_facts`：停止事实一致性判断；
- `rights_unknown`：可以指出质量问题，但不能写“可直接发布”；
- `policy_check_required`：列出当前运营方需核验的问题，不做合规保证；
- `conflicted_sources`：列冲突 Evidence IDs，暂停受影响判断；
- `unsupported_external_context`：拒绝用 SIF、网页或其他外部观察填补图片、产品事实、权利或政策缺口；
- `out_of_scope`：生成、编辑、上传、法律裁定或效果承诺。

失败不会触发 SIF、网页、其他 MCP 或外部诊断服务回退。

## 正式交付

数据就绪时至少生成：

1. `image-quality-audit.md`：对象、观察范围、保留项、问题、优先级和返工交接；
2. `image-issue-ledger.csv`：一行一个可复核问题；
3. `image-audit-evidence-ledger.md`：输入证据、Observation、Issue 推断、四轴和权利。

无法观察图片时只生成 `data-readiness.md` 或明确的 metadata-only 报告，不得生成视觉问题。最终回复只链接 `outputs/` 正式文件。

## 质量门

- 每个资产冻结了 `asset_id`、`version_id` 和 `source_path`；
- 每个视觉结论绑定 Observation ID 和真实观察范围；
- 不可观察维度明确 `not_assessed`，没有按零分处理；
- 每个问题包含证据、影响机制、修复、保留项和验收；
- `input_evidence` 与 `agent_output` 双层谱系可追溯；
- 权利状态与政策待核验项没有被写成通过；
- 没有评分、权重、字母等级、CTR/CVR、排名或下架保证；
- 返工只解冻受影响资产，编辑与版本链交给内置 Skill；
- 正式文件在 `outputs/`，中间文件在 `temp/`，源资产未改变。

## 资源读取

- 冻结资产和建立问题记录前读取 `references/image-audit-observation-and-evidence-contract.md`。
- 写正式审计前读取并物化 `assets/templates/image-quality-audit-delivery-template.md`。
