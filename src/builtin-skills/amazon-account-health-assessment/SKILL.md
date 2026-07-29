---
name: amazon-account-health-assessment
description: 对用户上传或可信上游提供的 Amazon 账号健康快照、指标、通知和时间序列执行口径、状态、缺口、可比趋势与行动评估。适用于账号健康复盘、异常准备和整改优先级；不适用于 SP-API 拉取、登录 Seller Central、持续监控或自动告警，也不调用当前不具账号健康能力的 SIF MCP 补事实。
---

<!--
文件功能：定义账号健康快照、指标合同、阈值依据、可比趋势、问题和人工行动评估。
职责边界：只分析用户、只读 uploads 或可信上游提供的账号材料；当前 SIF 没有账号健康工具，因而不调用 SIF，不拉取后台数据、不监控或提交整改；政策阈值必须来自用户或第09专家带日期输出。
重要关联：指标、快照和状态见 references/account-health-evidence-contract.md；正式交付使用 assets/templates/account-health-assessment-template.md；执法事件根因转交 amazon-account-enforcement-root-cause-analysis。
-->

# Amazon 账号健康评估

## 目标与完成定义

把“账号健康怎么样”转成可复核结论：

1. 快照属于哪个账号、站点、期间和提供时间；
2. 每个指标的定义、分子、分母和来源是什么；
3. 哪些值是真实报告，哪些缺失、不可计算或口径冲突；
4. 阈值来自哪份带日期政策/用户资料；
5. 哪些快照可比较，变化是否真实；
6. 哪些问题需要补证、专业判断或账号执法 RCA；
7. 哪些行动已执行，哪些只是计划。

完成不等于持续监控已启动，也不等于账号“安全”或“不会被停用”。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的 Seller Central 导出、截图、账号健康页、绩效通知、指标定义和历史快照；
- 可信 `outputs/` 中带账号/站点范围、版本、日期和证据 ID 的账号材料；
- 第09专家提供的带政策原文、站点、发布/生效日期和适用范围的阈值/政策输出；
- 用户提供的整改记录和责任人。

人工导出的 Seller Central 资料标为 `user_uploaded_platform_export`，不得写成 Agent 通过 API 拉取。

### 外部数据边界

- 不调用 `sif_mcp`；其当前关键词、ASIN、流量、销量、广告和供应商诊断能力不是账号健康、通知或整改事实；
- 不调用 Amazon SP-API、Seller Central、coaxon、mansour、LinkFox、CrossPulse、Web、浏览器或其他 MCP/API；
- 不读取 LWA/OAuth、Cookie、session 或账号密钥；
- 不创建 webhook、Cron、轮询、后台监控或告警；
- 材料不足时失败关闭。

### 工作区与敏感信息

- `uploads/` 只读；
- `temp/account-risk/<case-id>/01-health-assessment/` 存放快照抽取、指标重算和比较草稿；
- `outputs/account-risk/<case-id>/01-health-assessment/` 存放唯一正式评估；
- 账号 ID、买家 PII、证件、银行、税务识别号和凭据只保留掩码/证据引用。

### 双层谱系

输入 `input_evidence` 记录：

- `evidence_id`
- `source_path`
- `source_type`
- `evidence_class=account_metric|policy_reference`
- 账号/站点/期间/快照时间
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 字段、版本和限制

Agent 的指标重算、趋势编码、问题、优先级和行动建议是 `agent_output`，必须记录 `parent_evidence_ids`、公式、比较口径和结论上限。

## 启动检查

### 最低输入

至少需要：

1. 账号范围（掩码）和 Amazon 站点；
2. 快照时间、指标期间和来源路径；
3. 至少一个可读指标或通知；
4. 指标定义、分子/分母，或明确缺失；
5. 用户希望做出的决策；
6. 政策阈值依据，若要求判断是否越线。

### 状态

- `ready`
- `ready_without_threshold_judgment`
- `metric_not_computable`
- `snapshot_not_comparable`
- `policy_reference_missing`
- `scope_conflict`
- `partial`
- `blocked`
- `out_of_scope`

### 来源缺失语义（与业务状态分列）

业务 `result_status/calculation_status` 继续使用上述账号健康状态；每个快照、指标、分子、分母或阈值字段另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。只有完整、可验证且口径匹配的来源明确为零时才可使用 `true_zero`。

前五项不得写成 0、无指标、无违规或无风险，也不得替代 `metric_not_computable/snapshot_not_comparable/...` 等业务门禁。正例：完整账号快照明确某指标分子为 0，可记 `true_zero`，但仍需合法分母和定义才能判断指标。反例：分母字段未返回时记 `not_returned`，计算仍是 `metric_not_computable`，不得把分母补成 0。

## 执行流程

### 第一步：冻结账号与快照

记录：

- `account_scope_id_masked`
- `marketplace_id`
- profile/主体关系（若用户提供）；
- `snapshot_id`
- snapshot captured/reported time；
- 指标覆盖期间和时区；
- source path/version；
- 是否完整导出、截图或人工摘录。

不同账号、站点或期间不得合并。

### 第二步：建立证据类别

允许：

- `account_metric`
- `account_notification`
- `policy_reference`
- `corrective_action_evidence`
- `agent_inference`

SIF 供应商观察不进入本包。缺少可证明联接的材料不得跨账号或跨事件合并。

### 第三步：建立指标合同

每个指标记录：

- 指标名和来源原文；
- 分子、分母；
- 单位；
- 期间、时区和快照时间；
- 站点/账号范围；
- 包含/排除；
- 报告值；
- 重算值；
- 来源证据。

分母为零或缺失时 `not_computable`，不是 0。

### 第四步：登记阈值依据

阈值只能来自：

- 用户提供的带日期政策/后台文本；
- 第09专家 `amazon-policy-change-impact-assessment` 的可信输出；
- 合格责任方确认。

记录站点、发布日期、生效日、指标定义和适用范围。无依据时只报告观测值，不判“达标/超标”。

### 第五步：核对报告值

若分子分母齐全：

- 按来源定义重算；
- 记录公式和舍入；
- 比较来源报告值；
- 差异标 `reconciliation_required`；
- 不擅自修正原值。

### 第六步：判断可比趋势

只有以下一致时比较：

- 账号和站点；
- 指标定义；
- 分子/分母范围；
- 期间长度和时区；
- 数据成熟度；
- 政策版本或明确调整。

首次快照为 `baseline_only`。两个不可比快照不得计算趋势。

### 第七步：解释问题但不越界

问题记录：

- 可观察指标/通知；
- 证据 IDs；
- 影响范围；
- 阈值状态；
- 数据缺口；
- 是否需要执法 RCA；
- 立即的数据准备/控制动作；
- 责任人。

不从单个健康指标猜根因或侵权事实。

### 第八步：形成行动状态

允许：

- `proposed`
- `planned`
- `user_claimed_in_progress`
- `user_claimed_completed`
- `verified_completed`
- `blocked`

只有执行证据可以标 `verified_completed`。

### 第九步：路由

- 账号/ASIN级绩效通知、政策/IP/安全投诉、停用/限制根因 → `amazon-account-enforcement-root-cause-analysis`；
- 政策适用性/IP实体判断 → 第09专家；
- 单个买家消息、A-to-z、拒付、退货退款案件回复 → 第11专家；
- POA 草稿 → `amazon-poa-evidence-and-draft`，需已有 RCA。

### 第十步：一次性结论

报告明确：

- `assessment_mode=one_time`
- `monitoring_status=not_running`
- `as_of`
- 下一次由人工提供什么快照。

## 失败与降级

- `missing_denominator`：指标 `not_computable`；
- `missing_policy_reference`：不判断阈值；
- `incomparable_snapshots`：分别描述，不算趋势；
- `screenshot_partial`：标覆盖限制；
- `scope_conflict`：暂停聚合；
- `monitoring_requested`：只给人工数据准备，不声称后台运行；
- `out_of_scope`：拉取、登录、自动告警、申诉提交或账号恢复保证。

## 正式交付

至少生成：

1. `account-health-assessment.md`
2. `account-health-snapshot-and-metric-register.csv`
3. `account-health-issue-and-action-register.csv`
4. `account-health-evidence-ledger.md`

使用 `assets/templates/account-health-assessment-template.md`。无阈值依据时首页显示 `ready_without_threshold_judgment`。

## 质量门

- 账号、站点、期间和快照时间明确；
- 指标定义、分子、分母和单位完整；
- 零/缺失分母为 `not_computable`；
- 阈值只来自带日期用户/09依据；
- 趋势只比较同口径快照；
- 首次快照为 baseline；
- SIF 未被调用且供应商观察未进入账号事实；
- 没有 SP-API、登录、监控或告警；
- 行动建议未冒充执行；
- 双层谱系、敏感信息和工作区合同完整。

## 资源读取

- 建立快照、指标、阈值和趋势前读取 `references/account-health-evidence-contract.md`。
- 写正式评估前读取或物化 `assets/templates/account-health-assessment-template.md`。
