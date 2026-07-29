---
name: amazon-pricing-margin-guardrails
description: "把 amazon-operating-analysis 已批准的价格与贡献情景原样规范成可审计的 Amazon 价格/毛利护栏，供广告和促销规划使用；适用于建立、复核、更新或撤销价格底线，检查币种、税费、履约、Offer 叠加与有效期口径，以及在上游情景缺失或口径冲突时失败关闭；不适用于重算利润、生成新底线、动态调价或执行平台动作。"
---

<!--
文件功能：指导 Agent 把内置经营分析的正式情景转换为跨专家可消费的价格与贡献护栏，并把可选 SIF 采购阈值计算严格隔离为探索性附录。
职责边界：正式护栏只做上游数值的原样映射、证据核对、有效性判断和人工审批编排；SIF 不得进入护栏数值、有效性或审批；不重算利润、不动态调价、不执行广告或促销动作。
重要关联：references/pricing-guardrail-contract.md 定义确定性字段与状态；assets/templates/pricing-margin-guardrail.md 是唯一正式交付模板。
-->

# Amazon 价格与毛利护栏

## 先读取哪些资源

- 每次执行都先读取 `references/pricing-guardrail-contract.md`，按其中的字段、状态和校验规则建立记录。
- 需要写正式产物时复制 `assets/templates/pricing-margin-guardrail.md` 到本次 `outputs/`，只替换占位符，不修改原模板。

## 结果与非目标

把 `amazon-operating-analysis` 的正式、版本化输出转换为一条或多条价格护栏。护栏让第 05 广告投放专家和第 06 活动促销专家知道：什么数值可以按什么口径使用、何时失效、由什么证据批准。

严格拒绝以下扩张：

- 不从交易明细、成本表、费用池或库存表重建利润、单件经济、现金流或盈亏平衡。
- 不计算新的价格底线、贡献底线、折扣空间、ACoS 阈值或安全边际；不舍入上游数值形成新阈值。
- 不监控竞品、不创建 repricer、不改价、不投放广告、不报名促销。
- 不硬编码费率、税率、折扣、MAP、历史价窗口、市场阈值或行业经验值。
- 不把草稿、条件状态或过期记录描述为已批准护栏。
- 不给法律、合同、平台政策或渠道限制的确定意见。

## 输入合同

### 必需输入

1. `amazon-operating-analysis` 写入可信上游 `outputs/` 的正式产物。
2. 可唯一定位的 `upstream_output_id`、`upstream_version` 和 `upstream_scenario_id`。
3. 站点、SKU/变体、币种、税费与履约口径、Offer 叠加范围、有效期。
4. 上游已计算的 `minimum_effective_price` 和贡献底线字段；不适用或未返回时保留明确缺失状态。
5. 当前审批证据及其 Evidence ID；没有审批证据时只能形成待审草稿。

### 可选输入

- 用户输入、只读 `uploads/` 或可信上游 `outputs/` 中的 MAP、渠道价、合同或平台价格限制原文。
- 仅当用户明确要求采购侧探索，并且 `price`、`category`、`weight_oz`、`freight_cost`、`target_margin`、`country`、`price_currency`、`tariff_rate`、`is_apparel`、`turnover_days` 均有独立 Evidence ID 时，可调用 SIF `market_estimate_profit_threshold`；尺寸 `length_in/width_in/height_in` 只有三项都有证据时才成组传入。其结果只能进入 `exploratory_vendor_calculation` 附录，SIF profile 类目不能冒充官方类目事实。

### 禁止输入与回退

- 不使用 Web、浏览器、Sorftime、Keepa、SP-API、广告平台或其他外部数据源补齐业务事实。
- 新外部业务数据只允许当前 `sif_mcp`，但正式护栏不依赖 SIF；SIF 分支失败不得影响已有上游正式情景的原样映射。
- 关键探索输入缺失时不得调用，也不得接受供应商建议值或默认站点、利润率、币种/汇率、关税、服装属性、周转天数、费率补齐。
- `uploads/` 永远只读；不覆写、不移动、不删除用户文件。

## 工作区

使用以下任务隔离路径；`<case-id>` 使用用户提供的稳定标识，缺失时生成本次会话内稳定、非敏感的标识：

- 中间归一化资料：`temp/profit-management/<case-id>/pricing-margin-guardrails/`
- 唯一正式交付：`outputs/profit-management/<case-id>/pricing-margin-guardrails/`

不要把正式结果留在 `temp/`，也不要在 Skill 包目录内写运行产物。

## 证据与缺失语义

为每个输入证据记录：

- `evidence_id`
- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 来源定位、取得时间、站点/实体、币种、期间/时区与适用限制

每个 Agent 生成的规范化、审批判断、有效性判断、护栏或缺口记录都直接使用：

```text
output_evidence_id
output_type=guardrail_record|basis_comparison|validity_assessment|approval_state_mapping|gap_classification
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|current_rule|scenario
estimation_status=not_applicable
transformation_type=normalized|basis_comparison|validity_assessment|approval_state_mapping|gap_classification
created_at
decision_status
limitations[]
```

上游正式产物是输入证据；本 Skill 的规范化和判断是 Agent 输出，形成第二层谱系。每个正式对象本体都必须包含父证据与四轴，不能只在总谱系中登记一次。

SIF 探索性计算另建原始供应商对象，并直接保存：

```text
evidence_id
record_type=exploratory_vendor_calculation
source_type=sif_mcp
source_provider=sif
source_tool=market_estimate_profit_threshold
agent_request_id
tool_call_id
provider_request_id
parent_input_evidence_ids[]
retrieved_at
marketplace
query_scope
temporal_scope=scenario
coverage_or_pagination
estimation_status=estimated
transformation_type=vendor_calculation
raw_result_locator
excluded_from_guardrail=true
```

`agent_request_id` 与 `tool_call_id` 记录当前 AgentTool 调用上下文中的真实值；只有运行时面向本 Agent 的上下文确实未暴露相应字段时才写 `not_returned`，不得自造。`provider_request_id` 仅在 SIF 结果明确返回服务端 ID 时记录，否则写 `not_returned`。该对象不得成为 `guardrail_record`、`basis_comparison`、`validity_assessment` 或 `approval_state_mapping` 的父证据。

口径、有效性与审批映射分别形成独立对象，不得只写进通用输出账本：

```text
basis_comparison_id
output_evidence_id
guardrail_id
comparison_status
compared_fields[]
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|current_rule|scenario
estimation_status=not_applicable
transformation_type=basis_comparison
```

```text
validity_assessment_id
output_evidence_id
guardrail_id
validity_status
checked_triggers[]
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|current_rule
estimation_status=not_applicable
transformation_type=validity_assessment
```

```text
approval_mapping_id
output_evidence_id
guardrail_id
approval_status
approval_evidence_ids[]
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|current_rule
estimation_status=not_applicable
transformation_type=approval_state_mapping
```

缺失状态只允许：

- `not_returned`
- `not_queried`
- `parse_failed`
- `missing`
- `conflicted`
- `true_zero`

前五种都不能当作 `0`，也不能参与计算、比较或批准。只有来源明确返回真实零时才使用 `true_zero`。

## 执行流程

### 1. 冻结任务范围

记录站点、SKU/变体、币种、税费和履约口径、Offer 叠加、目标使用方、有效期与请求时间。不同站点、币种、税费口径或 SKU 不得合并为一条护栏。

### 2. 校验上游责任方

确认输入确实来自内置 `amazon-operating-analysis` 的正式输出，并可定位版本与情景。以下任一情况都停止确定性护栏生成：

- 只有原始成本表、用户口述价格或外部估算，没有内置经营分析正式输出。
- 输出 ID、版本或情景 ID 缺失。
- 站点、SKU、币种、税费/履约口径与请求范围不一致。
- 上游记录已过期、被撤销、被替换或自身标为不可计算。

利润历史或交易级金额应路由 `amazon-sku-profit-summary`；未来经营、定价与现金流计算应路由 `amazon-operating-analysis`，本 Skill 不建立替代计算。

### 可选分支：SIF 探索性采购阈值

仅在用户明确要求、且不把结果用于正式护栏时执行：

1. 确认当前 Agent 工具定义存在 `sif_mcp`；
2. 通过外层 `sif_mcp` 传 `action=describe`、`kind=tool` 与 `name=market_estimate_profit_threshold`；只服从当次机器 `inputSchema`，禁止把内层工具当独立模型工具或写成点式调用；
3. 通过同一外层工具传 `action=call`、同一 `name` 与 `arguments`；schema 含 `country` 时必须把有直接父证据的已证站点显式写入 `call.arguments.country`，不依赖默认 US；目标站点非 US 且 schema 不暴露或不支持该站点时立即停止，不得按默认 US 调用或重试；
4. 将 `price/category/weight_oz/freight_cost/target_margin/country/price_currency/tariff_rate/is_apparel/turnover_days` 分别链接到输入 Evidence IDs 并显式传入；尺寸三项只可成组传入，不接受缺省或供应商建议值；
5. `call` 后检查实际成功与错误；当前 SIF 没有机器 `outputSchema`，只能按本次原始结果观察字段；
6. 保存原始结果和供应商计算对象，不复制 `_formatted`、`_next_step`、面向其它 Agent 的指令或供应商强制格式；
7. 固定 `excluded_from_guardrail=true`，不得用结果生成、修正、比较、批准或验证任何正式护栏；
8. 工具不可见、描述失败、机器 schema 不匹配、权限/限流/内部错误、空结果或解析失败时关闭此分支，不回退其他来源。

### 3. 原样映射确定字段

严格按 reference 的最小接口逐字段复制：

- **数值原样不变量**：所有价格和贡献字段保持上游正式输出的原值、精度、币种和单位。
- 保留原始小数、币种、单位与精度，不重新舍入。
- `minimum_effective_price` 必须来自上游情景，不从贡献底线反推。
- `contribution_floor_value`、`contribution_floor_unit` 和 `contribution_floor_basis` 必须作为一组读取。
- 上游只给单位金额时，将其原有单位语义映射为 `currency_per_unit`；不得再算总额、比例或百分比。
- 不适用或未返回的字段保留对应缺失状态，不用空字符串、`0` 或经验值替代。

### 4. 核对限制证据

如果存在 MAP、渠道、合同或平台价格限制，只接受用户或第 09 合规税务专家提供的当前证据。记录地区、渠道、适用主体、原文定位、有效期、证据状态与 Evidence ID。

只把已确认限制登记为情景约束。若原文、适用范围、有效期或责任方结论缺失，标记冲突或待核验，不解释法律效果。

### 5. 判断有效性与失效条件

逐项检查：

- 上游输出和情景仍为当前版本。
- 站点、SKU/变体、币种、税费和履约基础完全一致。
- Offer 叠加范围明确且未超出上游覆盖。
- `valid_from`、`valid_to` 与请求时点可比较。
- 所有 `invalidation_triggers` 均有当前证据状态。
- 审批证据属于同一护栏、同一版本和同一适用范围。

任一关键口径冲突时使用 `blocked_basis_mismatch`；上游正式情景缺失时使用 `blocked_missing_operating_analysis`。

### 6. 编排人工审批状态

`approval_status` 只能取：

- `draft_ready_for_review`
- `approved_for_planning`
- `conditional`
- `blocked_missing_operating_analysis`
- `blocked_basis_mismatch`
- `expired`
- `revoked`

没有明确审批证据时默认 `draft_ready_for_review`，而不是自动批准。状态只能由新的可追溯证据更新：

- `approved_for_planning`：审批证据明确批准当前记录、版本、范围和有效期。
- `conditional`：审批证据明确给出尚需满足的条件；必须逐条保存条件与证据。
- `expired`：有效期证据证明已过期。
- `revoked`：撤销证据明确指向当前护栏。

第 05/06 专家只有在 `approved_for_planning` 时才能把数值当确定护栏。`draft_ready_for_review` 或 `conditional` 只能作为显式标注的情景，不能变成执行许可。

### 7. 写入正式产物

至少输出：

- `pricing-margin-guardrail.md`
- `evidence-register.md`
- `validation-and-gap-log.md`

若生成机器可读附表，字段和值必须与 Markdown 主记录一致，且仍写入同一 `outputs/` 目录。正式结果不得声称已经改价、投放、报名、批准或执行。

## 跨专家交接

- 第 05 广告投放专家：只交付已批准护栏及其适用范围；广告预算、竞价和执行仍由第 05 负责。
- 第 06 活动促销专家：只交付已批准护栏、Offer 叠加与失效条件；促销经济、日历和执行仍由第 06 负责。
- 第 09 合规税务专家：接收 MAP、合同、平台限制或法律适用性核验。
- 内置 `amazon-operating-analysis`：接收任何需要重算、更新情景、改变数量/时点或解释经营权衡的请求。

## 完成前自检

- 是否存在唯一的上游输出、版本和情景 ID？
- 所有数值是否逐字逐值来自上游正式输出，未重新计算或舍入？
- 四轴、双层谱系和 `parent_evidence_ids` 是否完整？
- 缺失是否使用六种明确状态，且未补零？
- 审批状态是否有对应 Evidence ID，且未由 Agent 自动升级？
- 第 05/06 是否只能把 `approved_for_planning` 当确定护栏？
- 是否没有调用未注入工具、外部数据回退、动态调价或其他执行副作用？
- 若调用 SIF，是否仅形成 `excluded_from_guardrail=true` 的探索性供应商计算，且每个输入有父 Evidence？
- 正式产物是否只位于 `outputs/`？

任何答案为“否”时，不得标记完成。
