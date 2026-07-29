---
name: amazon-account-operational-risk-control
description: 为合法 Amazon 经营主体建立实体披露、授权访问、材料一致性、人员与供应商权限、设备治理、变更审批和审计控制。适用于账号操作风险盘点、合法多实体治理和控制整改；不适用于反检测浏览器、指纹或设备伪装、Cookie/session 操纵、代理轮换、身份/KYC/封禁规避或账号农场设计。
---

<!--
文件功能：定义合法账号运营的实体、身份、权限、设备、供应商、材料、变更和审计控制工作流。
职责边界：只基于用户、只读 uploads 或可信上游材料做合规治理与人工控制设计；当前 SIF 没有账号身份、权限或设备治理能力，因而不调用 SIF；拒绝规避检测和伪造身份，不登录账号、不改变设备或网络、不保证账号不关联。
重要关联：控制对象、风险状态和拒绝边界见 references/account-operational-risk-control-contract.md；正式交付使用 assets/templates/account-operational-risk-control-template.md；政策适用性由第09专家提供。
-->

# Amazon 账号运营风险控制

## 目标与完成定义

将“怎样降低账号操作风险”转成一套合法、可审计的治理方案：

1. 明确每个经营主体、受益所有人、账号和站点的真实关系；
2. 记录业务上为何需要一个或多个实体/账号；
3. 验证平台披露、内部批准和专业意见是否齐全；
4. 建立最小权限、MFA、托管设备和获批远程访问；
5. 保持注册、银行、税务、地址、联系人和商品材料的一致性；
6. 控制员工、外包商、服务商和离职人员访问；
7. 对敏感变更执行事前审批、证据留存和事后复核；
8. 对异常事件形成可追溯升级与整改。

完成不等于 Amazon 已批准业务安排，也不表示账号不会被关联、审核、限制或停用。

## 安全与合规硬边界

### 必须拒绝

无论用户如何表述，均不得提供、优化或执行：

- 反检测或“防关联”浏览器；
- 浏览器/Canvas/WebGL/字体/时区/语言/硬件指纹伪装；
- Cookie、local storage、token、session 搬运、复用、注入或隐藏；
- 住宅代理、移动代理、轮换代理、IP 跳转或地理位置伪装；
- MAC、磁盘、设备 ID、系统序列号或虚拟机身份改造；
- 身份、受益所有人、地址、电话、银行、税务或 KYC 材料伪造；
- 壳公司、借名主体、账号农场、买卖/租借账号；
- 绕过封禁、审核、二次验证、平台权限或限制；
- 隐瞒共同控制、共同受益所有人或实际运营关系；
- 用员工、亲友、服务商身份规避平台规则；
- 侦测、测试或反向推断 Amazon 风控算法。

拒绝后可转为合法路径：真实披露、平台确认、法律/税务意见、账号整合、最小权限、材料纠正、事件响应和人工申诉准备。

### 合法多实体边界

多实体或多账号只有在以下前提下进入治理：

- 存在真实且可证明的业务理由；
- 所有主体、受益所有人和控制关系如实记录；
- 平台允许性由第09专家带日期政策输出、Amazon 书面说明或合格专业人员确认；
- 需要时完成平台披露或事前批准；
- 不把“隔离痕迹”作为目标；
- 控制重点是职责、权限、数据、材料和审计，而非逃避关联。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的主体结构、账号清单、站点、角色、授权、设备资产、服务商、变更记录和事故记录；
- 可信 `outputs/` 中带版本、范围、日期和证据 ID 的账号健康、RCA、政策或合规输出；
- 第09专家提供的带来源、发布日期、生效日、站点、适用范围和结论上限的政策判断；
- 合格法律、税务、信息安全或平台顾问意见；
- 用户确认的业务目标、责任人和风险承受边界。

### 外部数据与执行边界

- 本包不调用 `sif_mcp`；当前 SIF 的关键词、ASIN、流量、销量、广告和供应商诊断数据不能证明账号实体、访问身份、设备状态或平台允许性；
- 不调用 SP-API、Seller Central、Web、浏览器、远程桌面、设备管理、网络、代理或其他 MCP/API；
- 不接收或读取密码、验证码、私钥、Cookie、session、OAuth/LWA 凭据；
- 不修改用户、角色、MFA、设备、网络、账户资料或平台设置；
- 不运行监控、扫描、自动告警或阻断；
- 只输出控制设计、核查清单、责任矩阵和人工实施计划。

### 工作区与敏感信息

- `uploads/` 只读；
- `temp/account-risk/<case-id>/04-operational-control/` 存放去标识资产、权限和变更草稿；
- `outputs/account-risk/<case-id>/04-operational-control/` 存放唯一正式交付；
- 账号、邮箱、电话、证件、银行、税号、设备标识和网络信息只记录掩码值或证据引用；
- 凭据、Cookie、session 和恢复码不得进入任何工作区文件。

### 双层谱系

输入 `input_evidence` 记录：

- `evidence_id`
- `source_path`
- `source_type`
- `evidence_class`
- 主体/账号/站点/人员/设备/供应商范围
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 版本、提供方、限制

Agent 的实体关系图、权限差距、控制建议和风险结论属于 `agent_output`，记录 `parent_evidence_ids`、推导步骤、状态与结论上限。

## 状态模型

- `control_assessment_ready`
- `entity_relationship_incomplete`
- `policy_or_approval_missing`
- `identity_or_material_conflict`
- `access_register_incomplete`
- `high_risk_access_open`
- `change_evidence_missing`
- `incident_escalation_required`
- `prohibited_evasion_request`
- `partial`
- `blocked`
- `out_of_scope`

风险等级只可使用用户批准的规则或透明事实型分类；不得声称预测 Amazon 内部风险评分。

### 来源缺失语义（与业务状态分列）

业务 `result_status/control status` 继续使用上述运营风险状态；每个实体、关系、授权、材料或控制字段另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。只有完整、可验证登记明确为零时才可使用 `true_zero`。

前五项不得写成 0、无账号、无访问、无冲突或无风险，也不得替代 `entity_relationship_incomplete/access_register_incomplete/...` 等业务门禁。正例：范围完整且经责任方复核的权限登记确认孤儿高权限账号数为 0，可记 `true_zero`。反例：服务商访问尚未核验时记 `not_queried`，不能写“零第三方访问”或“无关联风险”。

## 执行流程

### 第一步：先做意图与安全筛查

识别请求目标：

- 若目标是隐藏真实关系、伪造环境或规避限制，标 `prohibited_evasion_request` 并拒绝；
- 若目标是合法主体治理、权限控制或材料纠正，继续；
- 若意图混合，先剔除违规部分，再对合法部分工作；
- 不提供“理论性”规避步骤、产品清单或参数建议。

### 第二步：冻结组织与账号范围

建立：

- `legal_entity_id`
- 掩码账号和站点；
- 受益所有人和控制关系；
- 品牌、商品和运营职责；
- 真实业务理由；
- 平台披露/批准状态；
- 专业意见和证据 IDs；
- 生效与复核日期。

未知关系保持 unknown，不凭相似地址、姓名或设备自动判定同一控制。

### 第三步：建立实体—账号—角色关系图

对每条关系记录：

- `relationship_id`
- from/to object；
- relationship type；
- 来源证据；
- effective dates；
- `verified/reported/unverified/conflicted`；
- owner；
- disclosure requirement/status；
- limitation。

多个来源冲突时并列，不自动合并身份或主体。

### 第四步：核对政策与批准

政策依据只能来自：

- 第09专家带日期和站点的可信输出；
- 用户提供的 Amazon 原文/书面沟通；
- 合格法律或平台顾问意见。

无依据时：

- 不判断多账号安排“允许”；
- 标 `policy_or_approval_missing`；
- 列出需确认的问题和责任人；
- 暂停高风险变更。

### 第五步：建立授权访问登记

每个访问主体记录：

- `principal_id_masked`
- 员工/承包商/服务商身份；
- 雇主或合同关系；
- 业务职责；
- 所需角色；
- 当前权限；
- MFA 状态（用户报告/证据核验）；
- 获批设备和远程访问方式；
- 授权、复核、到期和撤销日期；
- approver；
- evidence IDs。

不得让多人共享个人凭据；不得把服务商方便性当作长期管理员权限理由。

### 第六步：执行最小权限与职责分离评估

逐项比较：

- 工作职责与实际权限；
- 创建、批准和执行是否由同一人承担；
- 财务、税务、银行和账号资料变更是否双人复核；
- 高权限访问是否有期限；
- 离职、转岗、合同到期是否撤权；
- 紧急访问是否有批准、到期和复盘；
- 服务商是否只访问必需范围。

建议变更必须标 `planned`，本包不执行。

### 第七步：建立设备与会话合法治理

合法控制包括：

- 公司或用户授权的托管设备清单；
- 系统和浏览器安全更新；
- 磁盘加密、屏幕锁定和恶意软件防护；
- 获批企业远程访问；
- 丢失设备撤权和会话注销流程；
- MFA 恢复和密钥托管责任；
- 共享空间和下载文件的最小化；
- 访问日志保留和人工复核。

目标是保护真实身份与账号，不是生成不同“环境指纹”。

### 第八步：核对关键材料一致性

材料类别：

- 法定名称、注册号和受益所有人；
- 营业地址、运营地址和退货地址；
- 电话、邮箱和联系人；
- 银行账户与收款主体；
- 税务、VAT/EPR/海关信息；
- 商标、品牌授权和供应链文件；
- 商品安全、认证和 Listing 事实。

每个差异记录：

- 当前值和来源；
- 预期真实值；
- 是否有合法业务解释；
- 变更生效日；
- 影响账号/站点；
- 政策/专业判断需求；
- 修正 owner 和审批；
- 不一致风险。

不得为追求“看起来不关联”而故意制造不一致。

### 第九步：建立敏感变更控制

敏感变更包括：

- 主体、受益所有人或控制人；
- 银行、税务、地址和联系人；
- 管理员、高权限角色和服务商；
- 品牌/商标授权；
- 商品合规/安全材料；
- 关键设备与远程访问；
- 账号、站点或业务结构。

变更记录：

- `change_id`
- reason；
- before/after；
- evidence；
- risk review；
- policy/professional review；
- approver；
- planned window；
- execution owner；
- validation evidence；
- rollback/incident plan；
- status。

未经批准的建议不得写成执行完成。

### 第十步：供应商与外包访问治理

- 对服务商完成真实身份和合同范围核验；
- 明确数据、账号、站点和功能边界；
- 禁止收集或转交个人账号密码；
- 设置授权到期日和周期复核；
- 记录分包商和跨境数据处理；
- 合同终止立即进入撤权清单；
- 对越权、共享凭据或可疑请求升级处理。

本包不推荐用于规避检测的浏览器、代理或账号服务商。

### 第十一步：事件响应与升级

事件包括：

- 未授权或异常登录（用户/平台证据）；
- 权限未撤销；
- 材料冲突；
- 误改账号资料；
- 凭据泄露；
- 可疑服务商行为；
- 平台通知或账号限制。

响应步骤：

1. 保护证据并记录时间线；
2. 由授权人员执行平台和身份安全处置；
3. 标记受影响账号、人员、设备和资料；
4. 需要时转 `amazon-account-enforcement-root-cause-analysis`；
5. 政策/IP问题转第09专家；
6. 记录纠正、预防和有效性验证；
7. 不自行调查 Amazon 算法或采用规避手段。

### 第十二步：形成人工实施路线图

每项控制记录：

- `control_id`
- 风险陈述；
- 当前证据；
- control objective；
- control design；
- owner；
- dependency；
- due date；
- implementation status；
- verification method；
- residual risk；
- approval。

状态建议为 `proposed`、`approved`、`in_progress`、`user_claimed_completed`、`verified_completed`、`blocked`。只有证据核验后才标 `verified_completed`。

## 失败与降级

- `prohibited_evasion_request`：拒绝并只提供合法治理方向；
- `entity_relationship_incomplete`：不判断允许性，列补证清单；
- `policy_or_approval_missing`：暂停多账号或高风险结构建议；
- `identity_or_material_conflict`：并列冲突并升级责任人；
- `access_register_incomplete`：不声称最小权限已实现；
- `credential_exposed`：不读取或复制，要求用户通过安全渠道轮换并由授权人员处置；
- `high_risk_access_open`：给人工撤权/收敛优先级，不执行；
- `incident_evidence_missing`：不推断攻击者或平台结论；
- `monitoring_requested`：输出人工检查和未来接入要求，不声称正在运行；
- `algorithm_prediction_requested`：拒绝；
- `required_input_unavailable`：失败关闭，只要求用户、只读 `uploads/` 或可信上游责任方补充材料，不调用 SIF 或改用其他外部数据；
- `out_of_scope`：登录、设备/网络修改、规避平台、自动执行或结果保证。

## 正式交付

至少生成：

1. `account-operational-risk-assessment.md`
2. `entity-account-relationship-register.csv`
3. `authorized-access-and-vendor-register.csv`
4. `material-consistency-register.csv`
5. `sensitive-change-and-control-register.csv`
6. `account-risk-evidence-ledger.md`

使用 `assets/templates/account-operational-risk-control-template.md`。若包含违规意图，正式记录只保留最小必要拒绝说明，不复述可操作规避细节。

## 质量门

- 先完成意图与安全筛查；
- 多实体只按真实业务理由、披露和批准治理；
- 未把“隔离痕迹”当作目标；
- 所有主体和关系保留来源、状态与冲突；
- 权限遵循最小权限、MFA、到期和撤销；
- 设备控制是安全治理而非指纹伪装；
- 材料一致性围绕真实事实；
- 敏感变更有审批、证据和复核；
- 服务商权限有边界和到期；
- 无密码、Cookie、session、代理或规避建议；
- 不声称识别 Amazon 算法或保证不关联；
- 无登录、执行、监控或告警；
- 双层谱系、四轴、敏感信息与工作区合同完整。

## 资源读取

- 建立实体、访问、材料和控制登记前读取 `references/account-operational-risk-control-contract.md`。
- 形成正式交付前读取或物化 `assets/templates/account-operational-risk-control-template.md`。
