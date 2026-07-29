---
name: warehouse-return-disposition-planning
description: 基于用户提供的退货身份、检验与价值证据形成仓内处置候选，并通过所有权、可逆性和人工审批门控输出可追溯计划。适用于用户已提供仓内退货、拒收、残损或待检库存材料，希望比较处置候选并准备人工审批；不适用于实际移库/翻新/退供/销毁、买家退款或索赔、替代第 09 合规证据、重建第 14 价值模型或修改库存。
---
<!--
文件功能：定义仓库退货处置候选的证据整理、门控、比较和人工审批交接流程。
适用边界：只形成候选和经批准的人工计划；不移库、不翻新、不退供、不捐赠、不销毁、不调整库存。
维护约定：证据与审批门见 references/return-disposition-decision-contract.md，正式输出结构见 assets/templates/return-disposition-plan.md。
-->

# 仓库退货处置规划

## 何时使用

当用户已经提供仓库退货、拒收、残损或待检库存的身份和状态材料，希望形成可审查的处置候选、识别阻塞项并准备人工审批包时使用。

典型请求：

- “根据仓库检验表整理这批退货的候选处置方案。”
- “哪些可以候选返库，哪些必须隔离等待审批？”
- “把数量、地点、所有权、可逆性和回收价值整理成审批表。”
- “不要执行销毁，只告诉我缺哪些证据。”

## 不得使用的场景

本 Skill 不得：

- 实际收货、质检、移库、上架、下架、返工、翻新、拆解、退供、清算、捐赠或销毁。
- 创建 WMS/ERP/领星任务、库存调整、退货单、移库单、销毁单或财务凭证。
- 退款、赔付、索赔、联系客户/仓库/供应商或发送任何消息。
- 生成或打印运输标签、危险品标签或监管文件。
- 代表责任人批准处置。
- 将“候选”描述为已执行或已批准。
- 使用 Web、浏览器、SP-API、ERP、WMS、领星、17TRACK 或其他 API/MCP 补齐事实。
- 运行后台任务、定时提醒或持续监控。

## 责任边界

### 本 Skill 单一负责

- 锁定退货单位/批次的身份和数量。
- 登记状态证据、所有权、物理地点和保管责任。
- 形成与证据相符的处置候选。
- 标明每个候选的可逆性、前置条件和预期回收价值来源。
- 执行人工审批门控并生成不含执行动作的交接包。

### 交给其他角色

- 买家侧退货/退款案件、A-to-z/chargeback、消息回复和客户沟通：专家 11；本 Skill 只处理仓内实物证据与处置候选。
- HS 编码、税率、清关、反倾销和跨境退运监管：专家 09。
- 运输经济、处理费用、贡献、利润和价值模型：专家 14。
- FBA 建件资料：`amazon-fba-shipment-readiness`。
- 货运报价比较：`cross-border-freight-option-comparison`。
- 仓内动作、库存变更、财务记账和对外沟通：人工或明确授权的执行系统。

## 可接受的数据源

按优先级：

1. 用户在当前任务中提供的退货清单、收货记录、检验表、照片、视频、仓库声明和批准。
2. `uploads/` 中明确关联本批次的只读材料。
3. 可信 `outputs/` 中带版本、业务时点和谱系的正式产物。

本 Skill 不调用 `sif_mcp` 或其他外部业务工具。SIF 销量信号不能证明退货实物状态、数量、所有权、位置、可逆性、价值、合规约束或批准；不得使用其他外部数据源回退。

仓库实物状态必须来自用户/仓库提供的带日期证据，不能由商品页面或历史销售状态推断。

## 工作区约定

- `uploads/` 只读，不改动原始检验照片和单据。
- `temp/` 仅用于证据索引、候选草稿和数量对齐。
- `outputs/` 只写正式候选处置计划与审批交接包。
- 不写入密钥、令牌、Cookie、仓库账号或个人密码。

## 任务契约

开始前明确：

- 任务 ID 和退货批次 ID。
- 所涉仓库/地点和 Marketplace；若适用。
- 退货单位粒度：单件、序列号、箱、托或批次。
- 数量口径与计量单位。
- 状态证据截止时间。
- 谁拥有货权、谁承担保管责任、谁能批准处置。
- 允许考虑的候选类型。
- 正式交付读者和审批截止时间。

身份、数量或所有权无法确定时，只能形成证据缺口清单。

## 九项强制记录

每个退货单位或同质批次必须记录：

### 1. 身份

- `return_item_id` 或 `return_lot_id`
- Merchant SKU
- ASIN/FNSKU；仅在材料明确提供时
- RMA/退货单号；若有
- 序列号/批次号；若适用
- 原订单/入库关联；仅作为证据，不主动查询

商品名称不能作为唯一身份键。无法唯一连接时不得合批。

### 2. 数量

- 收到数量
- 已检数量
- 未检数量
- 各状态数量
- 单位：件、箱、托等
- 数量证据和盘点时点

必须满足可解释的数量闭环：

`收到数量 = 已检数量 + 未检数量 + 已确认的其他去向数量`

若不成立，标记 `quantity_conflict`，不得用差额自动创建“丢失”或“损毁”类别。

### 3. 状态证据

- 检验结果原文
- 缺陷类型和严重度；仅按材料
- 包装、附件、功能、外观状态
- 照片/视频/报告定位
- 检验人、检验时间和方法
- 证据覆盖的单位/样本范围

抽检结论不能自动外推到整个批次，除非用户提供并确认抽样规则。

### 4. 所有权

- 货权主体
- 是否存在供应商、承运商、平台、客户或保险争议
- 决策权主体
- 处置收益/费用承担主体；若材料提供
- 所有权证据及有效时间

所有权未知或争议中时，候选必须为 `HOLD_PENDING_OWNERSHIP`，不得进入不可逆处置。

### 5. 物理地点

- 仓库/站点
- 区域、库位、笼车、箱或托盘；按材料粒度
- 隔离/可用/待检区域状态
- 保管责任人
- 最后确认时间

地点未知时不得生成任何需要移动或交接实物的计划。

### 6. 可逆性

每个候选标记：

- `reversible`
- `conditionally_reversible`
- `irreversible`

并记录：

- 可撤回截止点。
- 撤回需要的条件。
- 是否改变商品、包装、所有权、库存或法律状态。
- 错误执行的影响。

销毁、捐赠、清算成交、退供发出、拆解等通常可能不可逆，但不得仅凭常识定性；要基于具体候选和用户材料确认。

### 7. 合规约束

每个候选必须单独记录：

- `compliance_constraint_status`: `not_applicable | verified_clear | constraints_present | unknown | conflicted | expired`
- `compliance_expert09_output_id`：涉及跨境退运、HS、税费、清关或反倾销时引用专家09正式产物 ID
- `professional_evidence_ids[]`：其他适用监管/专业证据 ID
- `compliance_evidence_business_time` 与 `valid_as_of`
- `jurisdiction_scope`
- `limitations`

专家09或专业证据必须带日期、范围、版本和责任方。`human_approval_status` 与合规证据分开记录；人工批准不能替代或覆盖合规约束。不可逆候选在适用约束为 `unknown | conflicted | expired` 时必须阻塞。

### 8. 预期回收价值

记录而不是凭空估算：

- 原始预期回收价值。
- 币种。
- 是单件、整批、毛额还是净额。
- 估值时点与有效期。
- 计算/估值责任人。
- 输入和排除项。
- 置信度或区间；若来源提供。
- 证据 ID。

价值只能来自用户明确提供或专家 14 的带版本正式输出。本 Skill 不重建利润、费用或运输经济模型。缺失时写 `unknown`，不得填零。

### 9. 审批

- 候选 ID。
- 审批人及其权限范围。
- 审批状态。
- 批准/拒绝时间及时区。
- 适用单位和数量。
- 附带条件。
- 批准证据。

审批状态：

- `not_requested`
- `pending`
- `approved`
- `rejected`
- `expired`
- `scope_mismatch`

只有 `approved` 且范围完全匹配时，才能标记为“已批准的人工计划”。即便批准，本 Skill 也不执行。

## 双层谱系与四轴

### 第一层：原始证据 envelope

记录：

- `evidence_id`
- `source_type`: `user_input | user_upload | trusted_upstream_output`
- `source_locator`
- `source_version`
- `observed_at`
- `business_time`
- `temporal_scope`: `current | historical | future | mixed | unknown`
- `estimation_status`: `reported | estimated | forecast | mixed | unknown`
- `transformation_type`: `raw | provider_derived`
- `raw_value` 与 `raw_unit_or_currency`
- `provider_or_owner`
- 退货身份/批次范围和 `limitations`

### 第二层：派生 record

候选与门控是两类独立的正式派生对象。每个对象本体直接保存五项血缘字段，不能只在报告末尾总账中补写：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `candidate` | `candidate_id` | 支撑候选资格、范围、可逆性和限制的原始 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| unknown` | `not_applicable \| estimated \| unknown` | `normalized \| planning` | 候选类型、覆盖身份/数量、资格规则、可逆性、合规/价值/审批状态和撤回点 |
| `gate` | `gate_id` | 支撑门结果的 Evidence/Candidate IDs | 固定 `agent` | `current \| historical \| future \| mixed \| unknown` | `not_applicable \| estimated \| unknown` | `comparison \| decision` | 门类型、适用候选、规则、结果、阻塞原因、最小补充材料和下一责任人 |

两类对象还分别记录 `output_id`、`rule_version`、`generated_at`、`uncertainty`、`result_status=ready | ready_with_limitations | blocked | out_of_scope` 与 `reason_codes[]`。`candidate_id` 和 `gate_id` 是领域对象 ID，不替代 `output_id`。派生对象的轴值必须逐条赋值，不能从父证据继承；原对象、时间、单位/币种和口径只作为附加比较维度，不能替代五项血缘字段。

四轴：

- **对象轴**：退货单位/批次、SKU、订单/RMA、仓库和库位。
- **时间轴**：收货、检验、盘点、估值、审批和候选有效时间。
- **单位/币种轴**：件/箱/托及价值原币。
- **口径轴**：状态分类、数量范围、所有权、地点粒度、可逆性和价值毛净口径。

## 候选类型

候选名称只表示规划方向，不表示批准或执行：

- `HOLD_FOR_INSPECTION`：等待进一步检验。
- `HOLD_PENDING_OWNERSHIP`：等待货权/决策权确认。
- `RESTOCK_CANDIDATE`：候选返库。
- `REWORK_OR_REPACKAGE_CANDIDATE`：候选返工/重新包装。
- `RETURN_TO_VENDOR_CANDIDATE`：候选退供。
- `LIQUIDATION_CANDIDATE`：候选清算。
- `DONATION_CANDIDATE`：候选捐赠。
- `DESTRUCTION_CANDIDATE`：候选销毁。

只有用户允许考虑且证据支持的候选才能进入清单。不得凭一般经验认定资格。

## 决策门

按顺序检查，前一门失败时不进入后一门：

### 门 1：身份唯一

必须能把状态、数量和位置证据连接到唯一单位或同质批次。

### 门 2：数量闭环

收到、已检、未检及其他去向数量必须可解释。冲突数量独立隔离。

### 门 3：状态证据充分

证据必须带日期、覆盖范围和检验责任人。仅有商品描述或历史问题不能代表实物状态。

### 门 4：所有权与决策权

货权和批准权限必须明确。争议中只可保持等待。

### 门 5：位置与保管

实物位置和保管责任必须可验证。

### 门 6：候选资格

逐候选列出必要条件、现有证据、缺失证据和排除原因。

### 门 7：可逆性

不可逆或条件可逆候选必须有更严格的审批和截止说明。

### 门 8：合规约束

核对 `compliance_constraint_status`、专家09/专业证据 ID、证据日期、辖区范围和限制。不可逆候选在适用约束为 `unknown | conflicted | expired` 时必须停止；人工批准不能使其越过此门。

### 门 9：价值与经济边界

只登记用户/专家 14 的正式价值结论。不同币种、时点或毛净口径不能直接排序。

### 门 10：人工审批

未批准时全部候选状态为 `CANDIDATE_ONLY`。批准不等于执行。

## 标准工作流

### 第一步：登记证据

为清单、盘点、检验、图片、所有权、地点、估值和批准分别建立 `evidence_id`。

### 第二步：建立身份与数量台账

使用稳定键连接，保留未匹配和重复记录。只做证据内数量闭环，不修改库存系统。

### 第三步：分层整理状态

区分已检、未检、抽检和争议单位。不得把样本结论外推。

### 第四步：确认所有权与地点

未知或争议时设置等待候选并停止不可逆规划。

### 第五步：生成候选

对用户允许的每类候选，列出支持证据、缺口、可逆性和影响范围。

### 第六步：核对合规约束

对每个候选记录 `compliance_constraint_status`，挂接带日期的专家09输出或其他专业证据。不可逆候选无法证明约束已核对时停止，不进入批准交接。

### 第七步：挂接预期回收价值

只消费用户或专家 14 的正式估值，保留币种、时点、毛净口径和排除项。不可比则并列展示。

### 第八步：执行审批门

先独立核对合规约束，再核对审批人权限、批准范围、时间和条件。未批准或范围不匹配时保持 `CANDIDATE_ONLY`；合规未知时即使人工已批准也保持阻塞。

### 第九步：生成正式计划

使用 [处置计划模板](assets/templates/return-disposition-plan.md)，输出证据台账、候选矩阵、门控、批准和人工交接。

## 状态

单位/批次状态：

- `EVIDENCE_INCOMPLETE`
- `QUANTITY_CONFLICT`
- `OWNERSHIP_BLOCKED`
- `LOCATION_UNCONFIRMED`
- `COMPLIANCE_BLOCKED`
- `CANDIDATE_ONLY`
- `APPROVED_FOR_MANUAL_HANDOFF`
- `REJECTED`

`APPROVED_FOR_MANUAL_HANDOFF` 只表示可以交给人工执行方再次复核，不表示任何动作已发生。

## 封闭失败

以下情况不得形成可执行倾向：

- 身份无法唯一确定。
- 数量不闭环。
- 实物状态没有带日期和覆盖范围的证据。
- 所有权或决策权未知/争议。
- 物理地点无法确认。
- 预期回收价值被要求从缺失数据中估算。
- 不可逆候选没有匹配范围的人工批准。
- 不可逆候选的适用合规约束为 `unknown`、`conflicted` 或 `expired`，或缺少带日期的专家09/专业证据。
- 需要未注入工具、ERP/WMS、Web 或其他数据源补齐关键事实。

降级输出：

- 已确认单位/数量。
- 证据缺口。
- 只能保持的等待状态。
- 最小补充材料。
- 下一责任人。

## 沟通规则

- 始终使用“候选”“待批准”“人工交接”，不要说“已处置”。
- 对不可逆候选明确提示影响和审批要求。
- 不把预期回收价值当作保证回收金额。
- 不把批准当作执行授权给本 Skill。
- 用户要求立即销毁/移库时，只能输出人工执行前复核清单。

## 输出质量门

写入 `outputs/` 前确认：

- 每个候选有身份、数量、状态证据、所有权、地点、可逆性、价值和审批记录。
- 状态证据带日期、覆盖范围和责任人。
- 数量闭环或冲突显式可见。
- 价值保留币种、时点、毛净口径和来源；未知不为零。
- 未批准候选全部为 `CANDIDATE_ONLY`。
- HS/税率/清关/反倾销交专家 09；运输经济交专家 14。
- 买家侧退货/退款案件、索赔和客户沟通交专家11。
- 不可逆候选具有带日期的专家09/专业合规证据，且合规门与人工审批门分列。
- 所有来源具有完整 raw evidence envelope，所有候选与门控具有完整 derived record。
- 未创建 WMS/ERP 任务、库存调整、消息、提醒或后台执行。

更细门控见 [处置决策合同](references/return-disposition-decision-contract.md)。
