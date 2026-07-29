---
name: amazon-ad-performance-diagnosis
description: 对用户或可信上游提供的真实 Amazon 广告报表执行报告生命周期、范围、完整性、粒度、稳定 ID 联接、指标重算和驱动诊断，并可用 SIF 广告可见流量或异常诊断作外部对照。适用于广告表现复盘、异常定位、预算与搜索词决策前的数据验收；不适用于调用 Ads API、拉取或下载报表、用 SIF 替代曝光点击花费归因数据、自动调账或把供应商观察写成因果。
---

<!--
文件功能：定义广告报表的异步生命周期、报告签名、完整性、口径、稳定 ID 联接、指标计算和证据化诊断。
职责边界：只分析合法输入中的一方广告报表，不创建报告请求、不轮询下载、不修改广告；SIF 只可形成独立的供应商观察对象，不得并入一方绩效字段。
重要关联：报告状态、完整性和指标合同见 references/ad-report-and-diagnostic-contract.md；正式交付使用 assets/templates/ad-performance-diagnosis-template.md；预算情景转交 amazon-ad-budget-and-acos-planning。
-->

# Amazon 广告绩效诊断

## 目标与完成定义

在解释“广告为什么变差”之前，先证明报表可用于比较：

1. 报表来自哪个账户、站点、实体、报告类型和时间范围；
2. 报告请求、处理、下载或导出是否真正完成；
3. 时区、币种、归因窗口、粒度和延迟是否一致；
4. 分页、截断、缺列、缺行和覆盖率是否可接受；
5. 实体是否通过稳定 ID 而非名称联接；
6. 变化由曝光、点击、成本、转化、客单或范围差异中的哪些可观察驱动解释；
7. 哪些只是待验证假设。

没有可验收的一方广告数据时，结果是数据就绪清单，不是绩效诊断。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的 Amazon Ads 控制台导出、报表文件、账户元数据、报告请求/状态/下载记录；
- 可信上游 `outputs/` 中带来源、版本、稳定 ID 和期间的广告数据；
- 用户提供的指标定义、归因窗口、币种、时区、报告延迟和业务目标；
- 规划包、关键词架构、Listing、库存、促销和第14利润产物，只作为解释上下文。
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在一方报告已验收后按需补充广告可见流量或供应商异常诊断作为替代解释。

SIF 数据不属于一方广告报表，不能提供用户账户真实曝光、点击、花费、归因订单、归因销售额、预算、竞价或 Search Term Report。

### 外部数据边界

- 新外部业务数据只允许通过当前 Agent 已注入的 `sif_mcp` 获取，且只能作为独立外部观察；
- 候选路由限于当前目录中的 `ads_get_asin_ad_traffic_trend`、`ads_get_asin_ad_historical_feature_profile` 与 `analyze_traffic_anomaly`；每个工具在本任务首次调用前都必须单独 `describe`，并只信当次机器 `inputSchema`；
- 不调用 Amazon Ads API、SP-API、报告 API、Sorftime、Keepa、Web、浏览器或其他 MCP/API；
- 不读取 LWA/OAuth/广告账户密钥，不启动下载器、轮询器或后台任务；
- 报表缺失时要求用户或可信上游提供，不用市场数据推算广告账户事实。

当前 SIF 工具没有机器级 `outputSchema`。不得按 description 固化输出字段，也不得把 `_formatted`、`_next_step`、面向其他 Agent 的格式要求或供应商结论直接写入正式诊断；外层参数通过后仍须检查 Gateway/SIF 的真实调用结果。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/02-performance-diagnosis/` 存放报告清单、标准化、联接、重算和诊断草稿；
- `outputs/advertising/<case-id>/02-performance-diagnosis/` 存放唯一正式诊断；
- 原始文件和原字段值不覆盖，所有转换创建新记录。

### 双层证据谱系

输入 `input_evidence` 记录 `evidence_id`、`source_path`、来源类型、报告 ID、签名、版本、期间、账户/站点范围、四轴和限制。原始 SIF 观察另记录 `source_type=sif_mcp`、`source_provider=sif`、`source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`query_scope`、覆盖/分页和 `raw_result_locator`；其 `transformation_type=reported`，`estimation_status` 按结果自述保留 `reported` 或 `estimated`。`agent_request_id` 与 `tool_call_id` 取当前 AgentTool 调用上下文中的真实值；上下文未暴露时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`，不得用本地 ID 冒充。

Agent 的标准化、联接、指标、变化分解、编码和根因假设属于 `agent_output`，记录公式、输入字段、单位、`parent_evidence_ids`、转换类型和结论上限。SIF 观察只能成为假设或替代解释的父证据，不能成为一方报表行。

四轴：

- `source_type`: `user_input`、`upstream_output`、`sif_mcp`、`agent`
- `temporal_scope`: `current`、`historical`、`future`、`mixed`、`unknown`
- `estimation_status`: `reported`、`estimated`、`forecast`、`mixed`、`unknown`
- `transformation_type`: `raw`、`normalized`、`calculation`、`coding`、`inference`、`hypothesis`

## 启动检查

### 最低输入

至少需要：

1. 业务问题和比较对象；
2. 账户/profile、站点和币种；
3. 报告类型和实体粒度；
4. 开始/结束日期、时区和归因口径；
5. 报表文件或可信上游路径；
6. 稳定实体 ID 或明确无法联接的限制；
7. 报告生命周期与完整性信息。

### 唯一顶层结果合同

每次运行只使用一组诊断结果字段：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `REPORT_PROCESSING | REPORT_FAILED | REPORT_CANCELLED | REPORT_TIMEOUT | DOWNLOAD_FAILED | TRUNCATED_OR_PARTIAL | SCOPE_OR_ATTRIBUTION_CONFLICT | NOT_COMPARABLE | UNSTABLE_JOIN | ZERO_DENOMINATOR | OUT_OF_SCOPE_REQUEST`

异步报表生命周期单独写入每份报表的 `report_status`，不得塞进诊断 `result_status`。不得再使用 `diagnostic_status` 或其他顶层结果字段。指标的 `calculation_status` 与假设的 `support_status` 也只描述局部对象。

## 报告生命周期

外部系统可能是异步的，但本 Skill 不执行请求或轮询。它只读取已有证据并保留：

- `request`: 已提出报告请求；
- `processing`: 上游仍在生成；
- `completed`: 有完成证据，仍需验证下载文件；
- `failed`: 上游明确失败；
- `cancelled`: 上游明确取消；
- `timeout`: 在用户定义的等待边界内未到终态；
- `download_failed`: 报告已完成但文件未成功取得；
- `ingested`: 文件已读入并完成结构验收；
- `rejected`: 文件无法用于本次分析。

以上枚举只可写入 `report_status`。`processing`、`timeout`、`failed`、`cancelled` 和 `download_failed` 不能写成空报表。

## 执行流程

### SIF 外部观察预检

只有一方广告报表已通过生命周期、范围、完整性和稳定 ID 验收，且外部观察能回答明确的替代解释时才调用 SIF：

1. 确认 `sif_mcp` 在当前 Agent definitions 中可见；
2. 对本任务首次使用的每个候选工具，通过外层 `sif_mcp` 执行 `action=describe`、`kind=tool`、`name=<候选工具>`；
3. 只按机器 `inputSchema` 组装站点、ASIN、粒度和时间参数；正式调用固定使用外层 `sif_mcp` 的 `action=call`、`name=<候选工具>`、`arguments={...}`，description 与 schema 冲突时失败关闭；
4. 只要运行时 `inputSchema` 含 `country`，就把有直接父证据的已验证站点映射显式写入 `arguments.country`，不得默认 `US`；目标为非美国且 schema 缺少或不支持该国家时，停止该外部观察分支；
5. 保存原始结果与调用 IDs，再建立独立 `sif_observation`；
6. 把供应商流量分数、广告结构画像或异常诊断标为 `reported|estimated`，不得映射为 impressions、clicks、spend、orders、sales 或一方归因；
7. 对结果使用 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero` 六态；空数组不证明零流量或无广告。

### 第一步：建立报告 manifest

每个报告记录：

- `report_artifact_id`
- `report_id`
- `report_type_reported`
- `account/profile/marketplace`
- `requested_at`、`completed_at`、`downloaded_at`
- `report_status`
- `source_path`
- `recovery_reference`
- `report_signature`
- `file_hash_or_version`

`report_signature` 由账户、站点、报告类型、实体范围、日期、时区、归因窗口、列集和筛选条件共同描述，不需要脚本才能记录。

### 第二步：确认终态与恢复信息

对非终态报告：

- 保留最后已知状态和时间；
- 记录上游提供的 report ID、错误和恢复入口；
- 不自行轮询；
- 若已有同签名成功报告，必须确认它是同一请求范围，不能仅凭文件名替代；
- 只在用户提供的超时规则下标 `timeout`。

### 第三步：验收文件结构

检查：

- 编码、表头和列；
- 行数、页数、分页 token/页号；
- 是否存在 truncated、partial、sampled 或 row limit 标志；
- 空文件、只有表头、解析失败和真实零行的区别；
- 总计行、重复行和未知行；
- 原始币种、单位和日期格式。

任何缺失都写入覆盖率，而不是静默删除。

### 第四步：冻结口径

每个数据集记录：

- 账户/profile/站点；
- 币种和时区；
- 报告时段和粒度；
- 归因窗口和归因日期语义；
- 报告生成时间及已知延迟；
- 实体状态/类型范围；
- 是否含无活动、无点击或无销售行；
- 筛选和排除。

两个时段只有口径一致或合法调整后才可比较。

### 第五步：通过稳定 ID 联接

优先联接：

- campaign ID；
- ad group ID；
- target/keyword ID；
- ad/product ID；
- report row ID 或其他真实稳定 ID。

名称只用于显示。缺稳定 ID 时：

- 不自动合并同名实体；
- 建立 unresolved join 表；
- 可在单文件内部分析，但跨表结论受限；
- 人工确认映射后新增证据，不改写原行。

### 第六步：区分零、空、缺失和失败

- 数值 `0`：来源明确报告零；
- `null/missing`：字段或值缺失；
- `empty_result`：已完成且查询范围真实无行；
- `not_requested`：没有报告请求；
- `processing/timeout/failed/cancelled/download_failed`：生命周期状态；
- `not_applicable`：指标不适用于该粒度；
- `not_computable`：分母缺失或为零。

这些状态不得互换。

### 第七步：重算指标

只在字段语义和分母明确时计算：

- CTR = clicks / impressions；
- CPC = spend / clicks；
- CVR = attributed orders / clicks；
- ACoS = spend / attributed sales；
- ROAS = attributed sales / spend。

分母为零或缺失时用 `not_computable`。所有金额保留币种；不得把不同归因窗口的分子分母混用。

### 第八步：验证汇总一致性

检查：

- 行级加总与来源总计；
- 重复页/重复 ID；
- 日粒度与期间总计；
- 实体层级重复归集；
- currency/timezone/attribution 不一致；
- 迟到归因导致的未成熟时段。

差异记录容差来源，不自定万能容差。

### 第九步：分解变化

对可比期间按证据分解：

- 曝光机会；
- 点击率；
- 点击成本；
- 转化率；
- 归因客单；
- 预算受限或状态变化；
- 商品、目标、竞价或范围变化；
- 报告成熟度和覆盖差异。

先报告贡献方向和可观察链，不跳到“算法惩罚”“竞争加剧”等无证结论。

### 第十步：形成诊断假设

每个假设记录：

- 观察；
- 证据 IDs；
- 因果链中的已支持与未知环节；
- 替代解释；
- 需要的补充报告或实验；
- 可逆的下一步；
- 结论状态 `support_status`：`supported`、`partially_supported`、`unsupported`、`not_tested`。

观察性报表不能单独证明因果。

## 失败与降级

- `REPORT_PROCESSING | REPORT_FAILED | REPORT_CANCELLED | REPORT_TIMEOUT`：`blocked`，保留 `report_status` 和恢复信息，不诊断；
- `DOWNLOAD_FAILED`：`blocked`，输出恢复清单，不写空结果；
- `SCOPE_OR_ATTRIBUTION_CONFLICT`：`ready_with_limitations` 或 `blocked`，仅做单表描述或阻塞比较；
- `TRUNCATED_OR_PARTIAL`：`ready_with_limitations` 或 `blocked`，明确报告覆盖和可完成范围；
- `UNSTABLE_JOIN`：`ready_with_limitations`，不做跨表归因；
- `ZERO_DENOMINATOR`：相关指标 `not_computable`，不把计算失败写成零；
- `stale_report`：只作历史证据；
- `schema_mismatch`：保留实际列，不猜映射；
- SIF 参数错误时重新 `describe` 并修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止外部观察分支，不换源，不用它改变一方报表的验收状态；
- `OUT_OF_SCOPE_REQUEST`：`out_of_scope`，拒绝取数、轮询、下载、账户调优执行或因果保证。

## 正式交付

至少生成：

1. `ad-performance-diagnosis.md`
2. `ad-report-manifest.csv`
3. `ad-data-quality-and-join-ledger.csv`
4. `ad-diagnostic-hypothesis-ledger.csv`
5. `ad-performance-evidence-ledger.md`

使用 `assets/templates/ad-performance-diagnosis-template.md`。生命周期或完整性不合格时，首页必须显示阻塞，不得仍给绩效结论。

## 质量门

- 报告生命周期与文件验收分开；
- report ID、签名、恢复信息和来源路径完整；
- 时区、币种、归因、粒度、延迟、分页、截断和覆盖率完整；
- 联接使用稳定 ID；
- 零、缺失、空结果和失败分开；
- 指标分母可追溯，零分母为 `not_computable`；
- SIF 外部观察与一方广告绩效分层，未冒充账户曝光、点击、花费、订单或归因；
- 诊断假设有替代解释和结论上限；
- 没有 Ads API、轮询、下载或调账执行；
- 双层谱系与工作区合同完整。

## 资源读取

- 验收报告、联接、重算指标和建立假设前读取 `references/ad-report-and-diagnostic-contract.md`。
- 写正式诊断前读取或物化 `assets/templates/ad-performance-diagnosis-template.md`。
