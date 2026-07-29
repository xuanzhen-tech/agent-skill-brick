<!--
文件功能：提供视觉本地化正式交付的可复用结构，并定义 brief、资产处理账本和证据权利账本三个产物的字段顺序。
职责边界：只承载可交付内容，不提供新的业务规则；使用时分别物化到 outputs，不覆盖只读输入资产。
重要关联：../../SKILL.md；字段语义见 ../../references/visual-localization-evidence-and-rights-contract.md。
-->

# 视觉本地化交付模板

> 使用说明：将下列三个区段分别物化为 `visual-direction-brief.md`、`asset-treatment-ledger.csv` 和 `visual-evidence-and-rights-ledger.md`。删除说明文字，但保留未知、限制和批准状态。

## 文件 A：visual-direction-brief.md

# Amazon 视觉方向 Brief

## 1. 案例与范围

- Case ID：
- Amazon 站点：
- 目标市场：
- 目标语言：
- 产品与变体：
- 资产范围：
- 上游输出路径与版本：
- 就绪状态：
- 生成时间：

## 2. 责任声明

- 本文件状态：视觉 brief，不是已生成图片。
- A+ 模块与文案责任方：
- 图片生成、编辑、批量和版本链责任方：`amazon-product-image-generation`
- 当前待用户、运营或权利方决定：

## 3. 产品身份锁

| Identity ID | 属性 | 已核实值 | Evidence IDs | 必须保持 | 变体范围 | 限制 |
|---|---|---|---|---|---|---|
| ID-001 |  |  |  |  |  |  |

## 4. 品牌与权利摘要

| Asset ID | 来源 | Rights status | Usable scope | 品牌约束 | 限制或待确认 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 5. 视觉方向

| Decision ID | 适用资产 | 决策类型 | 可执行决定 | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Approval status | 限制 |
|---|---|---|---|---|---|---|---|---|---|---|
| DEC-001 |  |  |  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `normalized/inference/hypothesis` |  |  |

## 6. 资产级处理

### Asset：`<asset_id>`

- 目标槽位与用途：
- Shopper question：
- Communication task：
- Module ID / Fact IDs：
- Consistency anchor：
- 主体、角度与动作：
- 环境、道具与空间关系：
- 构图与镜头：
- 光线、色彩与背景语言：
- 文字、语言与单位：
- 必须出现：
- 允许出现：
- 禁止出现：
- 可使用源资产：
- Decision IDs：
- 单资产验收：

## 7. 跨资产一致性

| 检查项 | 锚点 | 适用资产 | 验收条件 | 状态 | 备注 |
|---|---|---|---|---|---|
| 产品身份 |  |  |  |  |  |
| 变体身份 |  |  |  |  |  |
| 视觉系统 |  |  |  |  |  |
| 场景逻辑 |  |  |  |  |  |
| 资产分工 |  |  |  |  |  |

## 8. 生产 Handoff

- 已批准资产：
- 必须保持：
- 允许改变：
- 禁止新增：
- 可使用源资产与权利范围：
- 确定性文字或排版责任：
- 单资产验收：
- 跨资产验收：
- `policy_check_required`：

## 9. 阻塞与待决定

| Item ID | 类型 | 问题 | 影响资产 | 所需决定或证据 | Owner | 状态 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 文件 B：asset-treatment-ledger.csv

按以下列顺序创建 UTF-8 CSV；含逗号、引号或换行的值必须按 CSV 规则转义：

`asset_id,target_slot,market,language,variant_scope,shopper_question,communication_task,module_id,fact_ids,consistency_anchor_asset_id,required_subject,required_action,required_context,composition,camera_distance,lighting,palette,background_language,required_elements,optional_elements,prohibited_elements,text_and_unit_requirements,source_asset_ids,decision_ids,approval_status,acceptance_checks,status`

## 文件 C：visual-evidence-and-rights-ledger.md

# 视觉证据与权利账本

## 输入证据

| Evidence ID | Parent Evidence ID | Source type | Source path | Locator | Version | Temporal scope | Estimation status | Transformation type | Rights status | Usable scope | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |

### SIF 原始证据（仅实际调用时）

| Evidence ID | Source type | Source provider | Source tool | Agent request ID | Tool call ID | Provider request ID | Retrieved at | Marketplace | Query scope | Temporal scope | Coverage or pagination | Estimation status | Transformation type | Result state | Raw result locator | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |  |  |  |  | `reported` | `not_returned/not_queried/parse_failed/missing/conflicted/true_zero` |  |  |

`agent_request_id` 与 `tool_call_id` 仅填当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅填 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。不得在本表复制 `_formatted`、`_next_step` 或供应商给其他 Agent 的格式指令。

## Agent 决策

| Decision ID | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Asset ID | Decision type | Decision | Approval status | Approved by/at | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `normalized/inference/hypothesis` |  |  |  |  |  |  |

## 权利与批准缺口

| Item ID | Asset or Decision ID | Current status | Missing proof or approval | Allowed action now | Blocked action | Owner |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |
