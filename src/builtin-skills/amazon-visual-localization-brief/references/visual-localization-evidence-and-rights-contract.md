<!--
文件功能：定义视觉本地化 brief 的双层证据谱系、权利状态、创意批准、本地化反刻板印象和生产交接字段。
职责边界：只提供字段语义与判断合同，不替代 SKILL.md 的执行流程，不提供平台规则、视觉趋势或图像生成提示词。
重要关联：../SKILL.md；正式呈现结构见 ../assets/templates/visual-localization-delivery-template.md。
-->

# 视觉本地化证据与权利合同

## 1. 双层谱系

### 1.1 输入证据记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `evidence_id` | 是 | 本案例内稳定唯一，供所有后续决定引用 |
| `parent_evidence_id` | 上游存在时 | 保留上游原 Evidence ID；没有父级时写 `none` |
| `source_type` | 是 | `sif_mcp`、`user_input` 或 `upstream_output` |
| `source_path` | 是 | 对话定位、只读 uploads 路径或可信 outputs 路径 |
| `source_locator` | 是 | 页码、字段、行、资产 ID 或响应字段 |
| `source_version` | 是 | 文件版本、资产版本、查询时间或 `unknown` |
| `temporal_scope` | 是 | 当前、历史、未来、混合、不适用或未知 |
| `estimation_status` | 是 | reported、estimated、forecast、mixed、not_applicable 或 unknown |
| `transformation_type` | 是 | `reported`、raw、normalized、calculation、coding、inference 或 hypothesis；SIF 原始对象固定 `reported` |
| `rights_status` | 是 | 采用第 2 节枚举 |
| `usable_scope` | 是 | 说明能否用于分析、参考、生产或发布 |
| `limitations` | 是 | 口径、缺失、冲突、时间或权利限制 |

`source_path` 用于定位证据，不等于权利证明。SIF 返回字段按供应商口径登记，不改写成用户一方真值。原始 SIF 对象固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`，还需直接保存 `source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、覆盖/分页、估算状态、`result_state` 与 `raw_result_locator`。`agent_request_id` 与 `tool_call_id` 仅取当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。

`result_state` 只允许 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`。前五项不能补成零；`true_zero` 必须有本次目标字段的明确零证据。

### 1.2 Agent 决策记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `decision_id` | 是 | 本层稳定唯一 |
| `parent_evidence_ids` | 是 | 一个或多个输入 Evidence ID；纯用户选择仍引用选择记录 |
| `asset_id` | 是 | 决策适用的资产；跨资产规则可用 `asset-set` |
| `decision_type` | 是 | identity、scene、composition、camera、lighting、color、people、props、locale、text 或 restriction |
| `decision` | 是 | 可执行表达，不使用空泛风格词 |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 是 | `normalized` / `inference` / `hypothesis` |
| `approval_status` | 是 | `evidence_supported`、`user_approved`、`proposed` 或 `rejected` |
| `approved_by` | 批准时 | 用户角色或权利方，不编造姓名 |
| `approved_at` | 批准时 | 对话时间或已提供时间 |
| `limitations` | 是 | 适用变体、语言、市场与禁止外推范围 |

只有 `evidence_supported` 和 `user_approved` 能进入生产 handoff。`proposed` 只能放在待决定区。

## 2. 权利状态

| 状态 | 含义 | 允许动作 |
|---|---|---|
| `confirmed_for_scope` | 权利方已确认当前用途、市场和期间 | 可按确认范围进入生产 |
| `user_asserted_unverified` | 用户声明可用，但未提供可核验证明 | 可做 brief；生产前保留风险提示 |
| `permission_required` | 已知需要进一步许可 | 只能盘点和询问 |
| `restricted` | 明确禁止当前用途或存在范围冲突 | 不得进入生产 |
| `unknown` | 无法判断来源或许可 | 不得进入生产 |

对人物素材还要单独记录肖像授权和适用范围。商标、包装、认证标识、第三方产品与场景地点不能由“图片里已经有”自动视为可用。

## 3. 本地化决策门

### 3.1 可以使用的依据

- 用户提供的品牌规范、目标受众研究和当地运营要求；
- 权利清楚的既有品牌资产；
- 可信上游中有来源、时间和区域的 VOC 或市场证据；
- SIF 本次实际返回且语义明确的关键词需求、关键词历史或 ASIN 供应商画像；它们只作市场背景，不能证明视觉内容、评论正文、人口属性、产品物理事实或创意效果；
- 用户对创意候选的明确批准。

### 3.2 不能自动推断

- 肤色、面部特征、身体特征或人物身份；
- 家庭结构、职业、收入、居住条件或社会阶层；
- 国家或语言对应的固定颜色、数字、审美风格或消费能力；
- 宗教、节庆、政治、民族或敏感文化符号；
- “欧美简约”“日系精致”“东南亚鲜艳”等地域标签的具体视觉结论；
- 某视觉方向会提升点击、转化、排名或平台通过率。

### 3.3 决策检查

对每项人物、颜色、数字、地点、节庆或文化符号决定，依次回答：

1. 它服务哪个资产目的？
2. 引用了哪些 Evidence IDs？
3. 证据是否真的覆盖当前市场、语言、期间和人群？
4. 它是市场事实、品牌要求还是创意假设？
5. 是否需要用户或权利方批准？
6. 不采用它是否会影响产品事实表达？

无法回答时，把决定标为 `proposed` 或删除，不用常识补齐。

## 4. 资产处理字段

每个 `asset_id` 至少包含：

- `target_slot`、`market`、`language`、`variant_scope`；
- `shopper_question` 与 `communication_task`；
- `fact_ids`、`module_id` 和 `upstream_asset_request_id`；
- `consistency_anchor_asset_id`；
- `required_subject`、`required_action`、`required_context`；
- `composition`、`camera_distance`、`lighting`、`palette` 和 `background_language`；
- `required_elements`、`optional_elements`、`prohibited_elements`；
- `text_and_unit_requirements`；
- `source_asset_ids` 与各自 `rights_status`；
- `decision_ids`、`approval_status` 和 `acceptance_checks`。

字段未知时保留 `unknown`，不要静默填写默认人物、地点、道具、颜色或角度。

## 5. 跨资产一致性合同

一致性锚点必须是权利可用且由用户确认能代表当前变体的资产。全套资产分别检查：

- `identity_lock`：形态、颜色、材质、部件、比例、Logo 和包装；
- `variant_lock`：子体特有属性没有扩散；
- `visual_system`：光照、背景、色彩和文字语言协调；
- `scene_logic`：人物、环境、动作与真实使用方式相容；
- `role_separation`：每个资产回答不同问题；
- `fact_alignment`：可见内容没有超出 Fact IDs。

局部返工只解冻受影响 `asset_id`。返工后的资产仍要重新通过身份锚点检查。

## 6. 向内置图像生产能力交接

交接只包含：

- `case_id`、`asset_id`、目标槽位、市场、语言和变体；
- 上游 Module/Asset/Fact IDs；
- 一致性锚点和可使用源资产；
- 必须保持、允许改变、禁止新增；
- 已批准视觉决定及父 Evidence IDs；
- 单资产和跨资产验收；
- 权利、政策和确定性排版待核验项。

交接不包含外部服务、模型、凭据、轮询、重试、输出路径实现或版本管理指令。内置 Skill 负责这些运行细节。
