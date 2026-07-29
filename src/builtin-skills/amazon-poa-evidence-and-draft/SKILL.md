---
name: amazon-poa-evidence-and-draft
description: 基于已有账号执法根因、Amazon 通知原文、整改状态和可核验附件，建立陈述—证据映射并起草供人工审核的 Amazon Plan of Action。适用于 POA 证据准备、行动状态核验、附件索引和草案质检；不适用于重新猜测根因、自动提交申诉、伪造完成状态或承诺账号恢复。
---

<!--
文件功能：定义 POA 的输入门禁、证据映射、行动状态、草案结构、附件索引和人工审核流程。
职责边界：只把用户、只读 uploads 或可信上游已有的根因与已核验整改组织成草案；当前 SIF 没有账号案件、整改或 POA 能力，因而不调用 SIF；不重新做 RCA、不判断政策/IP实体问题、不提交申诉或保证恢复。
重要关联：字段与证据门见 references/poa-evidence-and-draft-contract.md；正式交付使用 assets/templates/poa-evidence-and-draft-template.md；根因输入来自 amazon-account-enforcement-root-cause-analysis。
-->

# Amazon POA 证据与草案

## 目标与完成定义

将“帮我写一封 POA”转成可审查、可追溯、不过度陈述的证据包：

1. 锁定 Amazon 通知、账号/站点、事件和截止时间；
2. 消费已有 `root_cause_id`，不在写作阶段重做根因分析；
3. 区分临时遏制、立即纠正、纠正措施、预防控制和有效性验证；
4. 对每个行动记录真实执行状态；
5. 让每项事实陈述都能回到证据；
6. 建立附件索引，暴露缺失、冲突和敏感信息；
7. 输出 `draft_for_human_review`，而非“可直接提交”或“保证通过”。

完成的 POA 草案只能说明材料准备状态，不能说明 Amazon 已接受、账号已恢复或整改已被平台验证。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的 Amazon 通知原文、截止日期、申诉问题、账号/站点/ASIN 范围和附件；
- `amazon-account-enforcement-root-cause-analysis` 产生的带版本 `root_cause_id`、执法事件 IDs、因果链、未知和人工批准状态；
- 第09专家输出的带来源、日期、站点、适用范围和结论上限的政策/IP判断；
- 用户提供或可信 `outputs/` 中的整改记录、责任人、执行日期、系统/流程变更和有效性证据；
- 合格责任方提供的法律、知识产权、产品合规或税务意见。

### 最低输入

开始完整草案前至少需要：

1. 一份可读的 Amazon 通知或可追溯原文摘录；
2. 账号、站点、事件对象和通知日期；
3. Amazon 所述问题与要求；
4. 已有且人工批准状态明确的 `root_cause_id`；
5. 每项行动的负责人、状态和证据；
6. 附件清单或明确缺口；
7. 用户指定的审核责任人。

缺少通知、已支持根因或行动证据时，输出证据缺口备忘录，不伪造完整 POA。

### 外部数据与工具边界

- 本包不需要新外部业务数据，不调用 `sif_mcp`；
- 当前 SIF 的关键词、ASIN、流量、销量、广告或供应商诊断数据不能证明账号案件、整改执行或 Amazon 接受状态；
- 不调用 SP-API、Seller Central、Web、浏览器、邮件、飞书或其他 MCP/API；
- 不读取 LWA/OAuth、Cookie、session 或账号凭据；
- 不上传附件、不提交申诉、不查询审核结果、不启动监控或提醒；
- 若未来 SIF 出现账号相关工具，必须先重新设计读取权限、证据合同和本包授权；不得在当前 Skill 中临时猜测接口或字段。

### 工作区与敏感信息

- `uploads/` 只读；
- `temp/account-risk/<case-id>/03-poa-draft/` 存放摘录、映射、去标识副本和草案；
- `outputs/account-risk/<case-id>/03-poa-draft/` 存放唯一正式交付；
- 账号 ID、买家 PII、证件、银行、税号、签名、凭据和受限附件只记录掩码值、哈希或证据引用；
- 不把附件正文无差别复制到草案。

### 双层谱系

每条 `input_evidence` 记录：

- `evidence_id`
- `source_path`
- `source_type`
- `evidence_class`
- 账号/站点/事件/对象范围
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 版本、提供方和限制

Agent 的摘录、陈述、证据映射、风险标记和草案段落属于 `agent_output`，必须记录 `parent_evidence_ids`、转换说明和结论上限。

## 状态模型

### 工作流状态

- `poa_ready_for_drafting`
- `notice_missing`
- `root_cause_missing`
- `root_cause_not_approved`
- `action_evidence_incomplete`
- `attachment_gap`
- `material_conflict`
- `draft_for_human_review`
- `blocked`
- `out_of_scope`

### 行动执行状态

只允许：

- `verified_completed`：存在可追溯执行证据，且范围和日期匹配；
- `user_claimed_unverified`：用户声称完成，但尚无充分证据；
- `planned`：仅有计划、责任人或日期；
- `blocked`：存在明确依赖或障碍。

只有 `verified_completed` 可以在 POA 中写成已完成。其余状态必须使用未来式、条件式或缺口说明。

### 来源缺失语义（与业务状态分列）

业务 `workflow_status/action_status/support_status` 继续使用上述 POA 状态；每个通知、根因、行动或附件字段另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。只有完整、可验证覆盖明确为零时才可使用 `true_zero`。

前五项不得写成 0、无问题、无附件需求或无风险，也不得替代 `notice_missing/root_cause_missing/...` 等业务门禁。正例：完整陈述—证据矩阵确认未支持陈述数为 0，可记 `true_zero`，正式草案仍需人工审核。反例：附件无法解析时记 `parse_failed` 并保持 `attachment_gap`，不能写“无需附件”。

## 执行流程

### 第一步：冻结申诉范围

记录：

- `poa_case_id`
- 掩码账号、站点、ASIN/SKU/事件范围；
- Amazon notice ID 或证据 ID；
- 通知日期、截止日期、时区；
- 原文语言；
- Amazon 所述问题、要求和允许的附件；
- 当前申诉轮次（若用户提供）。

不同通知、站点或对象不得未经说明合并成一封草案。

### 第二步：验证通知原文

对通知：

1. 保留原文或可追溯摘录；
2. 区分 Amazon 陈述、用户陈述和 Agent 解释；
3. 标出问题类型、被要求的信息和格式限制；
4. 记录缺页、截图截断、OCR 或翻译风险；
5. 不根据常见模板补写 Amazon 未提出的要求。

### 第三步：接收而非重做 RCA

核对 RCA handoff：

- `root_cause_id`
- 适用 `enforcement_event_ids`
- 根因陈述；
- causal link IDs 与支持状态；
- 未知和限制；
- 人工批准状态；
- 第09政策/IP证据 IDs。

若不存在可用 `root_cause_id`，返回 `root_cause_missing` 并路由根因分析。不得为了完成文案而临时猜测根因。

### 第四步：建立行动登记

将行动分为：

- containment；
- immediate correction；
- corrective action；
- preventive control；
- effectiveness verification。

每项记录：

- `action_id`
- 关联 `root_cause_id`
- 对象与范围；
- owner；
- planned/completion date；
- 执行状态；
- 证明完成所需证据；
- 当前 evidence IDs；
- 尚未覆盖的风险。

### 第五步：核验执行状态

判为 `verified_completed` 至少需要：

1. 证据显示具体动作已发生；
2. 日期晚于或合理关联问题事件；
3. 账号/站点/ASIN/流程范围匹配；
4. 执行者或责任人可追溯；
5. 不仅是计划、截图标题或口头承诺；
6. 若声称有效，存在独立有效性验证证据。

完成动作与“动作有效”是两个结论，不得合并。

### 第六步：建立陈述—证据映射

草案中的每项事实陈述登记：

- `statement_id`
- section；
- statement text；
- claim type；
- parent evidence IDs；
- support status；
- contradiction/limitation；
- 可用措辞；
- human review status。

支持状态：

- `supported`
- `partially_supported`
- `unsupported`
- `conflicted`

`unsupported` 或 `conflicted` 陈述不得进入正式草案。

### 第七步：建立附件索引

每个附件记录：

- `attachment_id`
- 文件名或安全显示名；
- source path；
- 证明的 statement/action；
- 日期、提供方和范围；
- 版本或哈希；
- 语言与是否需翻译；
- 敏感字段及遮蔽状态；
- 缺页、过期或冲突；
- 人工确认状态。

附件存在不等于它支持所述结论。

### 第八步：组织草案

默认结构：

1. 简短承认收到通知及适用范围；
2. 已证实根因；
3. 已完成的立即纠正；
4. 已完成或明确计划的预防控制；
5. 有效性验证方法；
6. 附件引用；
7. 人工审核标记和未决项。

草案应具体、事实化、避免情绪化，不添加未经证实的责任归属、法律承认、恢复承诺或模板化空话。

### 第九步：语言与翻译控制

- 保留 Amazon 原文、用户原文和译文的关联；
- 翻译标 `agent_generated_translation`；
- 关键政策、法律、IP和产品安全术语需人工或合格专业人员复核；
- 不借翻译消除模糊、冲突或证据缺口；
- 双语草案中使用稳定 statement/attachment ID。

### 第十步：独立质检

逐项检查：

- 通知问题均有响应；
- `root_cause_id` 未被改写成新根因；
- 每项“已完成”都有 `verified_completed` 证据；
- 计划动作没有过去式；
- 每项陈述有证据映射；
- 附件与陈述一一关联；
- 时间、账号、站点和对象范围一致；
- 政策/IP判断来自第09或合格责任方；
- 不含敏感凭据和不必要 PII；
- 明确 `draft_for_human_review`。

### 第十一步：人工审核交接

交付人工审核清单：

- 事实准确性；
- 法律、政策、IP和产品安全专业判断；
- 承认、责任和措辞风险；
- 附件完整性和可读性；
- 行动是否真实完成；
- 是否符合 Seller Central 当前页面要求；
- 最终提交权限和时间。

本包不执行提交。

## 失败与降级

- `notice_missing`：只输出所需材料清单；
- `root_cause_missing`：路由 RCA，输出证据缺口备忘录；
- `root_cause_not_approved`：保留候选，不生成确定性根因段落；
- `user_claimed_unverified`：可写“用户报告已完成，待核验”，不可写已完成；
- `action_evidence_incomplete`：草案保持计划式或阻塞；
- `attachment_gap`：列明缺失，不伪造引用；
- `material_conflict`：并列冲突，暂停相关陈述；
- `policy_or_ip_judgment_needed`：路由第09专家；
- `single_case_response_needed`：路由第11专家；
- `submission_requested`：说明越界并给人工提交检查表；
- `recovery_guarantee_requested`：拒绝保证结果；
- `tool_or_schema_unavailable`：不猜测或改用其他数据源。

## 正式交付

至少生成：

1. `poa-evidence-readiness.md`
2. `poa-draft-for-human-review.md`
3. `poa-statement-evidence-map.csv`
4. `poa-action-status-register.csv`
5. `poa-attachment-index.csv`
6. `poa-evidence-ledger.md`

使用 `assets/templates/poa-evidence-and-draft-template.md`。若不满足完整草案门禁，首页必须显示阻塞状态并交付证据缺口备忘录。

## 质量门

- 有可追溯通知原文和明确范围；
- 完整草案消费已有 `root_cause_id`；
- 未在写作阶段重新猜根因；
- 行动状态只使用四个允许值；
- 只有 `verified_completed` 被写成已完成；
- 所有事实陈述均有证据映射；
- 附件证明对象和限制明确；
- 政策/IP判断未越过第09专家；
- 单案回复未越过第11专家；
- 草案标记 `draft_for_human_review`；
- 无提交、查询结果、监控或恢复保证；
- 双层谱系、四轴、敏感信息与工作区合同完整。

## 资源读取

- 建立行动状态、陈述映射和附件索引前读取 `references/poa-evidence-and-draft-contract.md`。
- 形成正式交付前读取或物化 `assets/templates/poa-evidence-and-draft-template.md`。
