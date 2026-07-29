---
name: amazon-kpi-reporting-system
description: 基于用户输入、只读 uploads、可信上游 outputs 和可选的 SIF Amazon 关键词、ASIN、流量、销量或广告供应商观察，定义版本化 KPI 合同并按用户指定期间生成带覆盖率、不可计算项和双层谱系的日报、周报或月报读数。适用于跨销售、广告、库存、利润、流量等领域的指标口径、报表体系、周期对比和数据就绪度检查；不适用于重建交易利润或库存台账、调用 SP-API/ERP、创建后台报表任务、自动推送，或用 SIF 观察替代第一方 KPI。
---

<!--
文件功能：定义 Amazon KPI 合同、按需报表读数、覆盖率、比较口径和失败关闭流程。
职责边界：只消费合法的一方事实或可信上游正式输出并形成指标合同与读数；SIF 只进入单独的供应商观察附录，不进入一方 KPI 分子、分母或领域真相；不创建后台任务，不给领域执行动作。
重要关联：详细字段和状态见 references/kpi-reporting-contract.md；正式交付使用 assets/templates/kpi-report-template.md。
-->

# Amazon KPI 合同与按需报表

## 目标与完成定义

把“看销量、转化率、ACoS、利润率、库存周转”等模糊要求转成版本化、可计算、可追溯的指标合同，并只在用户发起请求时生成一个明确期间的报表。

完成表示：

1. 每个 KPI 的定义、分子、分母、单位、粒度、期间、时区、站点、实体范围、归因和聚合规则已经冻结；
2. 读数能够回到来源 Evidence，Agent 计算能够回到 `parent_evidence_ids`；
3. 覆盖率、延迟、缺失、冲突和不可计算项被显式展示；
4. 日报、周报、月报只是本次所选 `reporting_period`，不是 scheduler、Cron、订阅或后台推送。

完成不表示 Agent 已连接 Amazon SP-API、广告平台、ERP、银行或库存系统，也不表示报表会自动刷新。

## 运行合同

### 合法输入

- 用户在对话中给出的指标目标、时间范围、站点、时区、实体范围和业务解释；
- 只读 `uploads/` 中的用户一方销售、会话、转化、广告、订单、费用、利润、库存或实验导出；
- 可信上游 `outputs/` 中带稳定输出 ID、版本、生成时间、Evidence ID、覆盖范围、粒度和限制的正式结果；
- 通过当前 `sif_mcp` 按需取得的 Amazon 关键词、ASIN、流量、销量或广告供应商观察；
- Agent 对上述合法输入执行的规范化、受控聚合、比率计算、期间比较和覆盖率计算。

第一方经营事实优先由其责任方产出。每条 SIF 原始供应商观察必须直接保存：

```text
evidence_id
source_type=sif_mcp
source_provider=sif
source_tool
agent_request_id
tool_call_id
provider_request_id
retrieved_at
marketplace
query_scope
temporal_scope
coverage_or_pagination
estimation_status=reported|estimated
transformation_type=reported
raw_result_locator
```

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的对应真实值；若该上下文未暴露相应字段，则对应字段各写 `not_returned`，不得自造。`provider_request_id` 只取 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三者不得互代。SIF 观察不能替代用户一方销量、订单、广告消耗、利润、库存或实验结果，也不能进入第一方 KPI 的分子或分母。

### 最低输入

生成完整读数前至少需要：

1. 报表目的、`reporting_period`、时区和 marketplace；
2. KPI 清单及其 owner、版本和定义；
3. 分子与分母各自的来源、单位、粒度和覆盖范围；
4. 目标实体范围，例如账号、店铺、ASIN、SKU、广告活动或组合；
5. 上游正式输出 ID、版本和生成时间，或用户上传文件的稳定定位；
6. 比较期间、同比/环比规则及可比性要求；
7. 允许的缺失处理；不得默认补零。

缺任一关键口径时先输出 `data-readiness.md`，不要生成看似完整的 KPI 数字。

### 工具与外部数据边界

允许的新外部业务数据源只有当前 `sif_mcp`，且只作为供应商观察。

- 按问题选择最少候选工具：`market_get_keyword_history`、`market_get_asin_profile`、`ops_get_asin_traffic_trend`、`ops_get_listing_traffic_overview`、`ops_get_asin_sales_trend` 或 `ads_get_asin_ad_traffic_trend`；
- 内层业务工具不是独立模型工具：描述时通过外层 `sif_mcp` 传 `action=describe`、`kind=tool`、精确 `name`，执行时传 `action=call`、同一 `name` 与 `arguments`；禁止 `sif_mcp.<内层工具名>` 点式假调用；
- 每个业务工具在本任务首次 `call` 前必须 `describe`，只按当次机器 `inputSchema` 组织参数；schema 含 `country` 时必须在 `call.arguments.country` 显式传入有直接父证据的已确认站点，不依赖默认 US，目标站点不受支持时停止分支；同时锁定对象、时间、粒度和分页，流量趋势保持 `fetchKeepa=false`；
- 当前 SIF 没有机器 `outputSchema`；只能观察本次实际返回，不猜字段、枚举、单位、估算方法或覆盖范围，也不把 description 当稳定输出合同；
- 周度数据按实际 schema 保留周日起点和 T+1 限制，不把未完成周与完整周直接比较；
- 不复制 `_formatted`、`_next_step`、面向其它 Agent 的指令或供应商强制格式；
- 工具不可见、描述失败、机器 schema 不匹配、空/部分返回、权限失败、限流或解析失败时保留真实状态；
- 不回退 Web、浏览器、Sorftime、SP-API、Amazon Ads、领星 ERP、Keepa、数据库、RSS 或其他 MCP/API；
- 即使可见 shell，也不得用 `curl`、SDK、CLI、自写 HTTP 或数据库客户端绕行；
- 不索取、读取或保存 API key、OAuth、Cookie、session 或第三方凭据；
- 不创建 scheduler、Cron、守护进程、订阅、后台刷新、自动告警或消息推送。

SIF 供应商序列必须与一方 KPI 分栏展示；没有一方 KPI 证据时只能交付供应商观察附录或数据缺口，不能改名为 KPI。

### 工作区

- `uploads/`：用户原始材料，只读；
- `temp/data-analytics/<analysis-id>/01-kpi-reporting/`：解析、证据索引、口径检查和草稿；
- `outputs/data-analytics/<analysis-id>/01-kpi-reporting/`：唯一正式交付目录；
- 不修改 `uploads/`，不把 `temp/` 当交付，不向 Skill 包目录写运行数据。

每次正式输出都记录稳定 `analysis_id`、`report_id`、生成时间、版本和所有上游版本。

## 证据与状态

### 双层谱系

来源记录至少包含：

```text
evidence_id
record_type
source_type
source_locator
source_owner
observed_at
business_time
retrieved_at
marketplace
entity_scope
grain
unit_or_currency
coverage
version
fields_used[]
limitations[]
temporal_scope
estimation_status
transformation_type
```

每个 KPI 合同、读数、覆盖率、比较值或不可计算判断另建 Agent 派生记录：

```text
agent_output_id
output_type=metric_contract|kpi_reading|comparison|coverage_assessment|metric_gap
metric_id
parent_evidence_ids[]
source_type
temporal_scope
estimation_status
transformation_type
transformation_summary
rule_version
generated_at
uncertainty
result_status
reason_codes[]
```

来源层与派生层不得共用 ID。没有 `parent_evidence_ids` 的 Agent 数字不得进入正式报表。

### 四轴

每条来源与派生记录都保留：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

派生记录的枚举以 `references/kpi-reporting-contract.md` 中“Agent 读数”为唯一合同：`source_type=agent`，其余三轴逐条选择一个允许值，不复用或拼接来源证据的枚举。

“上传的 Amazon 导出”仍是 `source_type=user_input`，可另记 `evidence_origin=user_uploaded_platform_export`，不能冒充 Agent 实时查询。

### 缺失语义

严格分开：

```text
not_returned
not_queried
parse_failed
missing
conflicted
true_zero
```

前五项不得参与补零、分母、汇总或变化率。只有证据覆盖完整且明确为零时才使用 `true_zero`。

### 顶层状态

`report_status` 只允许：

- `ready_for_human_review`
- `partial`
- `blocked`
- `out_of_scope`

指标级 `metric_status` 只允许：

- `computable`
- `not_computable`
- `partial`
- `conflicted`

不变量：

- `ready_for_human_review` 要求所有必需 KPI 均为 `computable`；
- `partial` 必须列出受影响 KPI、覆盖率和原因；
- `blocked` 不输出未经支持的读数；
- `out_of_scope` 只做责任路由；
- `automation_status=not_created` 恒成立。

## KPI 合同

每个指标合同都是正式 Agent 规范化对象，必须固定：

```text
agent_output_id
metric_id
definition
numerator
denominator
unit_or_currency
grain
time_range
timezone
marketplace
entity_scope
attribution_basis
source_latency
coverage
aggregation_rule
owner
version
parent_evidence_ids[]
source_type=agent
temporal_scope=current_rule
estimation_status=not_applicable
transformation_type=contract_normalization
```

详细 schema、比率和期间比较规则见 `references/kpi-reporting-contract.md`。

以下任一项缺失都不得用行业默认值补齐：

- 分母或有效覆盖；
- 币种、汇率证据或金额方向；
- 时间粒度、时区或期间边界；
- marketplace 或实体范围；
- 归因窗口、广告口径或上游版本；
- 聚合规则与去重规则。

## 执行流程

### 第一步：冻结请求

记录 `analysis_id`、报表目的、KPI 清单、期间、比较期间、时区、站点、实体范围、审核人和版本。把“每日/每周/每月”解释为本次静态期间，不创建未来任务。

### 第二步：确认事实责任方

优先消费：

- 交易级利润、费用池和 SKU 利润：内置 `amazon-sku-profit-summary`；
- 库存数量：内置 `amazon-inventory-ledger-summary`；
- 历史经营复盘、未来情景、现金流、定价和盈亏平衡：内置 `amazon-operating-analysis`；
- 关键词与竞品集合：第 02 专家；
- 广告事实：第 05 专家或用户一方正式输入；
- 其他领域事实：对应专家的版本化正式输出。

本包不得从原始混杂文件复制这些责任方的领域模型。

### 第三步：建立来源账本

逐来源登记四轴、粒度、时区、站点、实体、单位/币种、覆盖、延迟、版本和限制。检查同一业务事件是否重复出现在多个导出中。

### 第四步：建立并审核 KPI 合同

逐指标写清定义和公式对象，不只写名称。分子、分母必须分别链接 Evidence IDs。对利润率、ACoS、转化率、周转等比率先确认单位和分母语义。

### 第五步：检查可比性

只有期间边界、时区、站点、实体范围、粒度、归因和数据覆盖可比时才做同比/环比。不可比时保留两侧读数并输出 `not_comparable`，不强算变化。

### 第六步：计算读数

- 只使用 `computable` 输入；
- 聚合前执行去重与粒度检查；
- 分母为真实零时，按指标合同输出 `undefined` 或业务定义状态，不输出无穷或伪造百分比；
- 每个结果保存公式、精度、舍入规则和 `parent_evidence_ids`；
- 不用 SIF 供应商估算补第一方分母。

### 第七步：计算覆盖与延迟

分别报告记录覆盖、时间覆盖、实体覆盖和字段覆盖。延迟必须从来源时间字段计算或标未知，不能用文件修改时间冒充业务时间。

### 第八步：形成报表

把读数、覆盖率、不可计算项、冲突和解释限制放在同一交付中。观察性变化只称“变化”或“关联”，不得称原因。

### 第九步：人工门禁

确认：

- KPI 合同完整且版本化；
- 来源层与派生层分离；
- 前五类缺失未补零；
- SIF 供应商观察与第一方事实分栏；
- 领域事实没有被重算；
- 报表期间没有被实现为后台任务；
- 无外部写入、推送或执行动作。

## 跨专家责任矩阵

| 输入或问题 | 单一责任方 | 本包允许动作 |
|---|---|---|
| 交易级利润、费用池、SKU 利润闭环 | 内置 `amazon-sku-profit-summary` | 消费正式输出，定义读数与覆盖 |
| 库存数量真相 | 内置 `amazon-inventory-ledger-summary` | 消费正式输出，不重建台账 |
| 经营复盘、未来情景、现金流、定价、盈亏平衡 | 内置 `amazon-operating-analysis` | 消费正式输出，不重算 |
| 关键词发现、竞品集合 | 第 02 | 消费稳定对象和版本 |
| Listing/视觉/广告/促销干预 | 第 03/04/05/06 | 只接收事件和结果数据 |
| 补货与履约动作 | 第 08 | 只报告指标，不给动作 |
| 当前政策事实 | 第 09 | 消费带日期、站点和范围的证据 |
| 账号健康、投诉 RCA 与 POA | 第 10 | 只报告统计读数 |
| 利润、价格和资金行动 | 第 14 与内置包 | 只消费正式输出 |

## 失败与沟通

- 口径只有名称：说明缺哪些合同字段，不猜公式；
- 缺分母、覆盖、币种或粒度：标 `not_computable`；
- 来源冲突：并列版本和影响，不私自选一个；
- SIF 不可见或失败：保留真实缺失状态，不回退；
- 用户要求自动日报、告警或推送：拒绝副作用，只提供静态模板与当前读数；
- 用户要求从 KPI 波动直接给根因：路由 `amazon-business-anomaly-diagnostics`，仍只生成候选；
- 用户要求执行经营动作：路由对应领域责任方。

## 正式交付

数据充分时至少生成：

1. `kpi-contract-register.csv`
2. `kpi-report.md`
3. `kpi-readings.csv`
4. `coverage-and-latency.csv`
5. `evidence-ledger.md`

阻塞时只生成 `data-readiness.md` 和可追溯的指标合同草案。

## 资源读取

- 开始定义指标前读取 `references/kpi-reporting-contract.md`。
- 写正式交付前读取或物化 `assets/templates/kpi-report-template.md`。
