<!--
文件功能：定义商品视频策划的输入证据、宣称、叙事节拍、逐镜 storyboard、连续性、权利和制作交接字段。
职责边界：只提供策划与验收合同，不提供视频生成、拍摄、剪辑、上传工具或固定平台规格。
重要关联：../SKILL.md；正式呈现结构见 ../assets/templates/video-storyboard-delivery-template.md。
-->

# 视频逐镜证据与交接合同

## 1. 输入证据

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `evidence_id` | 是 | 本案例稳定唯一 |
| `parent_evidence_id` | 上游存在时 | 保留上游 Evidence ID，没有时写 `none` |
| `source_type` | 是 | `user_input` 或 `upstream_output`；本包不直接调用 SIF |
| `source_path` | 是 | 对话、uploads 或可信 outputs 定位 |
| `source_locator` | 是 | 页码、段落、字段、时间码、资产 ID 或响应字段 |
| `source_version` | 是 | 文件、素材、查询或上游版本 |
| `temporal_scope` | 是 | current、historical、future、mixed、not_applicable 或 unknown |
| `estimation_status` | 是 | reported、estimated、forecast、mixed、not_applicable 或 unknown |
| `transformation_type` | 是 | raw、normalized、calculation、coding、inference 或 hypothesis |
| `rights_status` | 是 | confirmed_for_scope、user_asserted_unverified、permission_required、restricted 或 unknown |
| `usable_scope` | 是 | 分析、脚本参考、剪辑、配音或商业发布范围 |
| `limitations` | 是 | 条件、期间、对象、权利或质量限制 |

## 2. 宣称记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `claim_id` | 是 | 每个口播/字幕含义稳定唯一 |
| `parent_evidence_ids` | 是 | 支撑事实、条件和限制 |
| `source_claim` | 是 | 输入事实或已批准文案 |
| `script_expression` | 是 | 目标语言口播或字幕 |
| `conditions_and_limits` | 是 | 单位、对象、使用条件、警示和不得外推内容 |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `approval_status` | 是 | evidence_supported、user_approved、proposed 或 rejected |
| `review_owner` | 高风险时 | 用户、运营、法务、合规或专业方 |
| `transformation_type` | 是 | `normalized` / `inference` / `hypothesis` |

自然化只允许改变句法、节奏和语气，不得改变事实范围。客户第一人称体验、证言、认证、比较优势和结果承诺必须有对应证据与权利。

## 3. 叙事节拍

每个叙事决定直接记录：

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `narrative_decision_id` | 是 | 本层叙事决定稳定唯一 |
| `beat_id` | 是 | 关联的节拍 ID |
| `parent_evidence_ids` | 是 | 支撑受众问题、信息任务和顺序的 Evidence/Claim IDs |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 是 | `inference` / `hypothesis` |
| `sequence_and_task` | 是 | 顺序、信息任务和受众问题 |
| `claim_fact_evidence_ids` | 是 | 本节拍消费的 Claim/Fact/Evidence IDs |
| `duration` | 是 | 预计时长或 `unknown` |
| `entry_exit_conditions` | 是 | 进入和退出条件 |
| `required_limits` | 是 | 必须保留的限制或警示 |
| `logical_relation` | 是 | 与前后节拍的逻辑关系 |

节拍可以被压缩，但不能通过删除必要条件、风险或事实边界来满足时长。

## 4. 逐镜记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `shot_id` | 是 | 一行一个镜头 |
| `beat_id` | 是 | 所属叙事节拍 |
| `sequence` | 是 | 明确顺序 |
| `duration` | 是 | 预计值或 unknown |
| `shot_purpose` | 是 | 该镜头证明或解释什么 |
| `visual` | 是 | 主体、构图、场景和可见内容 |
| `action` | 是 | 产品、人物或镜头动作 |
| `camera_transition` | 是 | 镜头距离、运动和转场 |
| `identity_ids` | 是 | 产品与变体身份 |
| `voice_over` | 是 | 精确口播或 none |
| `on_screen_text` | 是 | 精确字幕/标签或 none |
| `audio` | 是 | 音乐、环境音、提示音或 none |
| `claim_fact_evidence_ids` | 是 | 支撑画面、动作和语言 |
| `parent_evidence_ids` | 是 | 支撑当前镜头决定的 Evidence/Claim/Narrative IDs |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 是 | `inference` / `hypothesis` |
| `source_asset_ids` | 是 | 所需图片、视频、Logo、音乐或字体 |
| `rights_status` | 是 | 当前镜头所需权利汇总 |
| `continuity` | 是 | 与相邻镜头必须保持的状态 |
| `safety_constraints` | 是 | 动作、警示、演示或 not_applicable |
| `prohibited_content` | 是 | 不得出现或暗示的内容 |
| `production_owner` | 是 | static、capture、voice、edit、operations 或具体用户责任方 |
| `acceptance_check` | 是 | 可观察完成条件 |
| `status` | 是 | proposed、approved、blocked、produced_reported 或 observed |

本 Skill 可以设置 proposed、approved 或 blocked。`produced_reported` 只能复述责任方反馈，`observed` 必须实际观察成品。

## 5. 权利拆分

分别登记：

- 产品和包装素材；
- 第三方商标、比较对象和道具；
- 人物肖像、声音和表演；
- 拍摄地点与场景；
- 音乐、音效、字体、图标和模板；
- 既有视频片段和二次剪辑权；
- 目标市场、渠道、期间和变体范围。

任一关键权利为 restricted 或 unknown 时，镜头不能进入 approved 生产清单。

## 6. 连续性与安全

逐镜和全片检查：

- `product_continuity`：外观、变体、部件、包装与状态；
- `action_continuity`：动作前后、手位、道具和环境；
- `claim_continuity`：画面、口播、字幕与事实；
- `time_continuity`：步骤顺序和结果等待时间；
- `audio_continuity`：说话者、发音、音乐和提示音；
- `safety_continuity`：防护、警示、适用人群和禁止操作。

剪辑不得删除决定产品安全或事实范围的中间条件。

## 7. 制作 Handoff

### Static

传递 `asset_id`、身份锚点、源资产、权利、构图、留白、必须保持和验收。实际图片生产由内置 Skill 负责。

### Capture

传递主体、动作、镜头、场景、道具、授权、安全、禁止内容和验收。

### Voice and audio

传递逐字口播、语言、发音、说话者要求、音乐/声音权利和验收。

### Edit

传递 Shot IDs、顺序、时长、转场、字幕、Logo、音频、连续性和导出要求。

### Operations

传递当前需核验的平台资格、规格、上传、审核和发布项。

所有 handoff 只描述责任与输入，不包含外部服务凭据、自动执行、后台等待或完成保证。
