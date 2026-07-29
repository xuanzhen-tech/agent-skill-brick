---
name: amazon-account-enforcement-root-cause-analysis
description: 对账号或 ASIN 级绩效通知、政策/IP/安全投诉、停用、限制，以及第11多个版本化单案 handoff 或第13可追溯聚合建立事件账本、证据链、根因假设与账号级整改候选。适用于跨事件共因和执法整改分析；不适用于单个买家消息、退货退款、A-to-z/拒付回复、知识产权实体判断、通用 KPI 聚合、POA 撰写，或调用当前不具账号、案件和评论正文能力的 SIF MCP 补事实。
---

<!--
文件功能：定义账号执法事件、证据类别、跨事件编码、因果链、根因状态和账号级整改候选。
职责边界：只分析用户、只读 uploads 或可信上游提供的账号/ASIN级执法与跨事件共因；不调用当前没有账号、案件或评论正文能力的 SIF，不处理第11专家拥有的单案沟通，不判断第09专家拥有的政策/IP实体问题，也不撰写POA。
重要关联：事件、因果链和root_cause_id合同见 references/account-enforcement-rca-contract.md；正式交付使用 assets/templates/account-enforcement-rca-template.md；已验证根因交 amazon-poa-evidence-and-draft。
-->

# Amazon 账号执法事件根因分析

## 目标与完成定义

把“为什么账号/ASIN 被限制”转成可验证根因链：

1. 发生了哪些账号/ASIN级通知、停用、限制或安全/IP/政策事件；
2. 每个事件来自什么一方材料、站点、对象和时间；
3. 第09专家提供了哪些政策或 IP 实体判断；
4. 第11专家提供了哪些版本化单案 handoff，或第13专家提供了哪些可追溯聚合；
5. 公共 Product Review 是否仅作为 VOC 线索；
6. 每条因果链接是 `supported`、`partially_supported` 还是 `unsupported`；
7. 哪个 `root_cause_id` 足以支撑账号级纠正与预防；
8. 哪些未知会阻塞 POA。

完成不等于根因已被 Amazon 接受，也不等于账号会恢复。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的账号/ASIN绩效通知、政策/IP/安全投诉、停用/限制通知、调查记录和整改证据；
- 第09专家带政策/IP证据 ID、站点、日期、范围和结论上限的可信 `outputs/`；
- 第11专家形成的多个版本化单案 handoff；每项必须含 `case_handoff_id/case_handoff_version/case_id_masked/case_type/reason_code/evidence_ids/as_of/limitations`，第11不提供聚合统计；
- 第13专家按本包规定 schema 形成的可追溯聚合 handoff；
- 用户提供的流程、供应商、质量、Listing、权限和变更记录；
- 用户、只读 `uploads/` 或可信上游 `outputs/` 提供且带稳定定位、观察时间和限制的公共产品 VOC；它只能作为外围线索。

### SIF 与外部业务数据边界

- 当前 `sif_mcp` 目录没有账号健康、绩效通知、投诉案件、POA、买家消息或评论正文工具，本包不得调用 SIF；
- 公共产品 VOC 只接受用户输入、只读 `uploads/` 或可信上游 `outputs/`，并标 `public_product_voc`；不得生成 case ID、投诉率、A-to-z、退货、买家消息或执法事实；
- 当前 SIF 的关键词、ASIN、流量、销量、广告与供应商诊断信号均不具账号案件语义，不得绕道查询后拼接为账号事实；
- 不调用 SP-API、Seller Central、coaxon、mansour、Web、浏览器或其他 MCP/API；
- 不读取 LWA/OAuth/Cookie/session/账号凭据，不监控或提交。

### 工作区与敏感信息

- `uploads/` 只读；
- `temp/account-risk/<case-id>/02-enforcement-rca/` 存放事件编码、时间线、证据联接和假设草稿；
- `outputs/account-risk/<case-id>/02-enforcement-rca/` 存放唯一正式 RCA；
- 买家 PII、账号、证件、银行、税务和凭据字段掩码。

### 双层谱系

输入 `input_evidence` 记录：

- `evidence_id`
- `source_path/query_ref`
- `source_type`
- `evidence_class`
- 账号/站点/ASIN/事件范围
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 版本和限制

Agent 的事件编码、模式、因果链接、根因假设和整改候选为 `agent_output`，记录 `parent_evidence_ids`、转换类型、支持状态和未知。

证据类别：

- `account_enforcement_event`
- `policy_reference`
- `ip_qualified_output`
- `aggregated_customer_case_handoff`
- `public_product_voc`
- `corrective_action_evidence`
- `agent_inference`

## 启动检查

### 最低输入

至少需要：

1. 一份账号/ASIN级执法或限制材料；
2. 账号/站点/对象和事件日期；
3. 通知原文或可追溯摘录；
4. 相关流程/商品/Listing/供应商事实；
5. 第09输出，若涉及政策/IP实体判断；
6. 用户希望解释的范围；
7. 整改责任人。

### 状态

- `rca_ready`
- `event_evidence_partial`
- `policy_or_ip_output_missing`
- `cross_event_link_unproven`
- `root_cause_unresolved`
- `single_case_route_to_expert11`
- `blocked`
- `out_of_scope`

### 来源缺失语义（与业务状态分列）

业务 `result_status/root_cause status` 继续使用上述 RCA 状态；每个事件、单案 handoff、聚合字段或因果证据另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。只有完整、可验证且集合边界固定的来源明确为零时才可使用 `true_zero`。

前五项不得写成 0、无案件、无投诉、无根因或无风险，也不得替代 `event_evidence_partial/cross_event_link_unproven/...` 等业务门禁。正例：第13按明确集合和期间生成的聚合确认某原因编码计数为 0，可记 `true_zero`，但不能据此验证根因。反例：某单案 handoff 未返回 `reason_code` 时记 `not_returned`，不能当作“无投诉原因”。

### 第11单案与第13聚合输入合同

- 第11只拥有单案事实、事件链、程序草案和 `reason_code`；10可消费多个版本化单案 handoff，自建 `rca_case_set_id` 做跨案共因分析，但不要求第11计算统计。
- 第13拥有跨案聚合与 KPI。第13聚合 handoff 必须含 `aggregation_id`、`aggregation_version`、`source_case_handoff_ids`、`source_case_versions`、`population_definition`、`inclusion_exclusion`、`period_timezone`、`numerator_denominator`、`metric_or_pattern`、`calculation_method`、`missingness_summary`、`parent_evidence_ids`、`generated_at` 和 `limitations`。
- 10拥有跨案因果链、`root_cause_id` 和账号级整改/POA handoff；不得修改第11单案原因编码，也不得重算第13通用 KPI。

## SIF 能力边界与输入核验

当前能力基线已经证明 SIF 不提供账号或评论正文事实，因此本包不对 `sif_mcp` 执行 `search`、`describe` 或 `call`。需要外围 VOC 时：

1. 只接收用户、只读 `uploads/` 或可信上游 `outputs/` 已有的可定位材料；
2. 固定 ASIN、站点、观察时间、采样范围和来源限制；
3. 所有公共体验内容标 `public_product_voc`；
4. 不同分母且无订单/用户联接时，禁止与账号案件计数合并；
5. 未查询、未返回、解析失败、缺失或冲突分别保留六态，不因 SIF 已接入而补值；
6. 将来若 SIF 目录变化，先重新设计本包的数据授权与证据合同，不能在当前 Skill 中临时猜工具或扩大职责。

## 执行流程

### 第一步：判定路由

本包处理：

- 账号/ASIN级绩效通知；
- 政策、知识产权或安全执法事件；
- Listing/商品停用或限制；
- 多事件共因和账号级整改。

第11专家处理：

- 单个买家消息；
- 单个退货退款；
- 单个 A-to-z 或拒付案件；
- 案件程序响应和沟通草稿。

若请求是单案回复，状态 `single_case_route_to_expert11`。

### 第二步：建立执法事件账本

每个事件记录：

- `enforcement_event_id`
- 事件类型；
- 账号/站点/ASIN/SKU范围；
- 通知日期、截止日期和时区；
- 来源原文和附件；
- Amazon 所述问题/要求；
- 当前状态（用户报告）；
- 关联政策/IP证据；
- 已知行动和证据。

公共 Review 不创建 enforcement event。

### 第三步：建立时间线

按证据排序：

- 产品/Listing/流程/权限变更；
- 投诉/通知；
- 用户行动；
- Amazon 后续；
- 供应商/质量/物流事件；
- 第09政策生效；
- 第11版本化单案 handoff 集合，或第13可追溯聚合信号。

未知日期保持 unknown，不用叙事顺序冒充证据时间。

### 第四步：编码问题模式

按事实分类：

- 商品/Listing事实不一致；
- 质量/安全/合规控制；
- 供应商/文件/追溯；
- 流程、权限或变更控制；
- 订单/履约/客服的账号级聚合信号；
- 政策/IP适用性；
- 数据/证据缺口。

编码不是根因结论。

### 第五步：分离公共 VOC 与账号事件

用户或可信上游提供的公共产品 VOC：

- 只能支持产品体验主题假设；
- 不与账号投诉率共用分母；
- 不推导买家身份、订单、A-to-z或执法原因；
- 没有可证明联接时只作外围线索；
- 与一方事件冲突时并列。

### 第六步：构建因果链

每个候选根因写：

- 观察事件；
- 直接原因候选；
- 控制为何未预防/发现；
- 组织/流程根因候选；
- 每个链接的 evidence IDs；
- 替代解释；
- 未知；
- 支持状态。

链接状态：

- `supported`
- `partially_supported`
- `unsupported`
- `not_tested`

不使用任意分数或固定权重。

### 第七步：生成 `root_cause_id`

只有至少一条完整因果链达到可供整改/POA使用的证据门时才生成：

- `root_cause_id`
- 适用事件/对象；
- 根因陈述；
- 支持证据；
- 未知和结论限制；
- 人工批准状态。

证据不足时输出根因候选，不生成已验证 root cause。

### 第八步：形成纠正与预防候选

区分：

- containment；
- immediate correction；
- corrective action；
- preventive control；
- effectiveness verification。

每项记录 owner、due date、status、证据要求和影响对象。建议不能写成已执行。

### 第九步：与09/11边界复核

- 无第09可信输出，不判断政策/IP实质；
- 第11 handoff 只按多个版本化单案输入消费，不要求或假定第11已聚合；
- 第13聚合只在 schema、来源单案 IDs/版本、集合、期间、分母和缺失语义完整时消费；
- 10只形成跨案 RCA，不重写单案回复，也不接管第13的通用 KPI；
- RCA 不撰写 POA；
- POA 包必须消费 `root_cause_id`。

### 第十步：交接 POA

输出：

- enforcement event IDs；
- root cause ID/状态；
- 纠正/预防动作及执行状态；
- 证据附件索引；
- 未知和阻塞；
- 第09政策/IP IDs；
- 人工批准。

## 失败与降级

- `no_enforcement_event`：不做 RCA；
- `single_customer_case`：路由11；
- `policy_or_ip_missing`：停止实质判断并路由09；
- `public_review_only`：只能给 VOC 假设或 blocked；
- `causal_link_unsupported`：保持根因候选；
- `action_evidence_missing`：不写已执行；
- `monitoring_or_submission_requested`：越界；
- `out_of_scope`：单案回复、IP/政策裁决、POA撰写/提交或恢复保证。

## 正式交付

至少生成：

1. `account-enforcement-root-cause-analysis.md`
2. `account-enforcement-event-ledger.csv`
3. `root-cause-and-causal-link-register.csv`
4. `account-corrective-preventive-action-register.csv`
5. `account-enforcement-evidence-ledger.md`

使用 `assets/templates/account-enforcement-rca-template.md`。无充分根因时首页显示 `root_cause_unresolved`。

## 质量门

- 只处理账号/ASIN级执法和跨事件共因；
- 单案买家/A-to-z/拒付明确路由11；
- 政策/IP实体判断明确路由09；
- 公共 Review 仅为 VOC，未与案件共分母；
- 每条因果链接有支持状态和替代解释；
- `root_cause_id` 不在证据不足时生成；
- 行动建议与执行证据分开；
- RCA 未重写 POA；
- 无 SP-API、登录、监控或提交；
- 双层谱系、敏感信息和工作区合同完整。

## 资源读取

- 建立事件、因果链和 root cause 前读取 `references/account-enforcement-rca-contract.md`。
- 写正式 RCA 前读取或物化 `assets/templates/account-enforcement-rca-template.md`。
