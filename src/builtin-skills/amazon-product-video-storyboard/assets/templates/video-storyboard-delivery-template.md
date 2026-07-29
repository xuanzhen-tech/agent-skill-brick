<!--
文件功能：提供商品视频创意 brief、逐镜 CSV 和证据权利账本的正式交付模板。
职责边界：只承载策划与制作交接，不把脚本、分镜或责任方反馈冒充已生成、剪辑或上传的视频成品。
重要关联：../../SKILL.md；字段语义见 ../../references/video-shot-evidence-and-handoff-contract.md。
-->

# 视频分镜交付模板

> 使用说明：将下列三个区段分别物化为 `video-creative-brief.md`、`video-storyboard.csv` 和 `video-evidence-and-rights-ledger.md`。交付标题与状态必须清楚说明这是策划，不是成品。

## 文件 A：video-creative-brief.md

# Amazon 商品视频创意 Brief

## 1. 案例与范围

- Case ID：
- Amazon 站点与语言：
- 产品与变体：
- 视频类型与投放位置：
- 主要目标：
- 受众问题：
- 目标时长及来源：
- 上游输出路径与版本：
- 就绪状态：

## 2. 责任与结论上限

- 本文件状态：创意 brief 与 storyboard，不是视频成品。
- A+ 模块与文案责任方：
- 静态图片责任方：`amazon-product-image-generation`
- 拍摄责任方：
- 配音/音频责任方：
- 剪辑责任方：
- 运营核验与上传责任方：
- 当前 `policy_check_required`：

## 3. 产品事实与宣称

| Claim ID | Source claim | Script expression | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Conditions/limits | Approval | Review owner |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `normalized/inference/hypothesis` |  |  |  |

## 4. 素材与权利

| Asset ID | 类型 | Source path/version | Rights status | Usable scope | 适用镜头 | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 5. 叙事节拍

| Narrative Decision ID | Beat ID | Order | Information task | Audience question | Claim/Fact/Evidence IDs | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Duration | Required limit/warning |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|
| NAR-001 | BEAT-01 | 1 |  |  |  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `inference/hypothesis` |  |  |

## 6. 口播与字幕

| Segment ID | Beat/Shot IDs | Speaker/tone | Voice over | On-screen text | Claim IDs | Duration | Approval |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 7. 连续性与安全

| Check ID | 类型 | 适用镜头 | 必须保持 | 禁止暗示/操作 | Evidence IDs | Review owner | 状态 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 8. 制作 Handoff

### Static asset

- Shot/Asset IDs：
- 身份锚点与源资产：
- 必须保持/允许改变/禁止新增：
- 验收：

### Capture

- Shot IDs：
- 主体、动作、场景、道具和镜头：
- 权利与安全：
- 验收：

### Voice and audio

- Segment/Shot IDs：
- 逐字口播、语言和发音：
- 音乐/声音与权利：
- 验收：

### Edit

- Shot 顺序与时长：
- 转场、字幕、Logo 和音频：
- 连续性：
- 验收：

### Operations

- 待核验资格与规格：
- 上传、审核与发布责任：

## 9. 阻塞与待决定

| Item ID | 类型 | 问题 | 影响镜头/宣称 | 所需证据或动作 | Owner | 状态 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 文件 B：video-storyboard.csv

按以下列顺序创建 UTF-8 CSV；含逗号、引号或换行的值必须按 CSV 规则转义：

`shot_id,beat_id,sequence,duration,shot_purpose,visual,action,camera_transition,identity_ids,voice_over,on_screen_text,audio,claim_fact_evidence_ids,parent_evidence_ids,source_type,temporal_scope,estimation_status,transformation_type,source_asset_ids,rights_status,continuity,safety_constraints,prohibited_content,production_owner,acceptance_check,status`

## 文件 C：video-evidence-and-rights-ledger.md

# 视频证据与权利账本

## 输入证据

| Evidence ID | Parent Evidence ID | Source type | Source path | Locator | Version | Temporal scope | Estimation status | Transformation type | Rights status | Usable scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

## Agent 输出

| Output ID | Output type | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Beat/Shot IDs | Decision | Approval | Production owner | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  | narrative_decision/claim/shot |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` |  |  |  |  |  |  |

## 权利、安全、政策与生产缺口

| Item ID | Current status | Missing evidence/approval | Allowed action now | Blocked action | Owner |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
