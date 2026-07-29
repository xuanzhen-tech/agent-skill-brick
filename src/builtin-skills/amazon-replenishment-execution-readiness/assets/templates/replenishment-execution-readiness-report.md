<!--
文件功能：提供补货执行准备度正式报告与人工交接模板。
使用方式：按 ../../SKILL.md 填写，并用 ../../references/replenishment-upstream-contract.md 验证两个强制上游。
维护边界：模板不包含库存、预测、安全库存、利润或补货数量重算，也不执行订单、调拨或建件。
-->

# 补货执行准备度报告

> 本报告消费上游结论，不重新计算库存、需求、利润或补货数量。未知字段必须显式标记。

## 1. 任务范围

| 字段 | 内容 |
|---|---|
| 任务 ID |  |
| Marketplace/站点 |  |
| 商品范围版本 |  |
| 源节点 |  |
| 目标节点 |  |
| 计划执行窗口 |  |
| 用户允许的最大陈旧度 |  |
| 报告生成时间及时区 |  |

## 2. 强制上游登记

| 上游 Skill | 版本 | artifact_id | 生成时间 | 业务截止时间 | 范围 | 谱系状态 | 合同验证 |
|---|---|---|---|---|---|---|---|
| `amazon-inventory-ledger-summary` |  |  |  |  |  |  |  |
| `amazon-operating-analysis` |  |  |  |  |  |  |  |

## 3. 可选 SIF 外部需求信号

> 仅在用户需要外部销量趋势背景时填写。工具只允许 `ops_get_asin_sales_trend`，且本任务首次调用前必须完成实时 `describe`。这些记录不得成为库存、候选数量、订单、收入、节点、批准或执行事实。

| Evidence ID | Source Type | Provider | Source Tool | Agent Request ID | Tool Call ID | Provider Request ID | Retrieved At | Marketplace |
|---|---|---|---|---|---|---|---|---|
|  | `sif_mcp` | `sif` |  |  |  |  |  |  |

| Evidence ID | Query Scope | Temporal Scope | Coverage/Pagination | Estimation Status | Transformation Type | Raw Result Locator | Actual Returned Fields | Limitations |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `reported/estimated/mixed/unknown` | `reported` |  |  |  |

| Call Evidence ID | Describe Evidence ID | Tool Name | Arguments Snapshot | ASIN Parent Evidence ID | `call.arguments.country` | Country Parent Evidence ID | Parent Input Evidence IDs | Validation State |
|---|---|---|---|---|---|---|---|---|
|  |  | `ops_get_asin_sales_trend` |  |  |  |  |  | `validated/blocked` |

若实时 `inputSchema` 含 `country`，上表必须显式填写 `call.arguments.country`，并让 Country Parent Evidence ID 直接指向已确认站点输入；不得依赖默认 US。目标站点非 US 而 schema 不暴露或不支持该国家时，`Validation State=blocked`，不得发起调用。

`agent_request_id` 与 `tool_call_id` 只取当前 AgentTool 调用上下文中的真实值；上下文未暴露对应字段时分别写 `not_returned`，不得自造。`provider_request_id` 只有在 SIF 实际返回服务端 request ID 时填写，否则写 `not_returned`；三类 ID 不得互相代填，也不得以本地 ID 冒充服务端 ID。当前无机器级 `outputSchema`；只记录实际返回字段，不采纳供应商 `_formatted`、`_next_step` 或其他 Agent 的格式/路由指令。

## 4. 原始证据 envelope 与实际字段映射

| evidence_id | source_type | source_locator | source_version | observed_at | business_time | temporal_scope | estimation_status | transformation_type | raw_value | raw_unit_or_currency | provider_or_owner | limitations | 上游 Skill/合同概念 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |

## 5. 补货候选准备度

### 正式候选记录

| Candidate ID | SKU | 源节点 | 目标节点 | 候选数量 | 单位 | 数量来源 | 执行窗口 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---:|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `normalized` |

> SIF 销量信号可以作为背景 `parent_evidence_ids`，但“数量来源”不得填写 SIF，也不得据此生成、调整、优化或舍入候选数量。

### 正式准备度记录

| Readiness ID | Candidate ID | 批准状态 | 执行前提 | 准备状态 | 原因/下一责任人 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |

## 6. 对齐与冲突

| ID | 维度 | 上游 A 证据/值 | 上游 B 证据/值 | 是否可比 | 影响 | 责任人 | 处理状态 |
|---|---|---|---|---|---|---|---|
|  | 对象/时间/单位/口径 |  |  |  |  |  |  |

## 7. 批准与执行前提

| 候选 ID | 数量批准人 | 批准时间 | 适用范围 | 专家07采购/MOQ/交期证据 | 供应/调拨责任人 | 后续交接 | 状态 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 8. 阻塞与最小补充材料

| 阻塞 ID | 影响候选 | 失败检查点 | 当前证据 | 最小补充材料 | 下一责任人 | 期望时间 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 9. 总体结论

| 字段 | 内容 |
|---|---|
| 结论 | `READY_FOR_MANUAL_EXECUTION` / `CONDITIONALLY_READY` / `BLOCKED_MISSING_UPSTREAM` / `BLOCKED_UNSUPPORTED_UPSTREAM_CONTRACT` / `BLOCKED_CONFLICT` / `BLOCKED_INCOMPLETE_APPROVAL` |
| 结论依据 |  |
| 明确未执行 | 下单、调拨、建件、提交、审批、提醒或后台任务 |

## 10. 人工下一步

- [ ] 确认两个强制上游的名称、版本、范围、时点和谱系。
- [ ] 人工处理 SKU、节点、时间或口径冲突。
- [ ] 数量责任人确认唯一候选数量；本 Skill 不调整数量。
- [ ] 审批人记录批准时间和适用范围。
- [ ] 人工转交 FBA 资料审查、货运比较或实际执行系统。

## 11. 派生 record 与双层谱系

| output_id | output_type | object_id | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | rule_version | generated_at | uncertainty | result_status | reason_codes[] | 对齐规则/结果 | 对象轴 | 时间轴 | 单位轴 | 口径轴 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `candidate` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `normalized` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |
|  | `readiness` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |

对象、时间、单位和口径列仅为额外比较维度，不能替代两类对象本体的五项血缘字段。

`reason_codes[]` 只允许：`MISSING_UPSTREAM_CONTRACT | UNSUPPORTED_UPSTREAM_CONTRACT | UPSTREAM_SCOPE_CONFLICT | UPSTREAM_STALE | CANDIDATE_QUANTITY_MISSING_OR_CONFLICT | APPROVAL_INCOMPLETE | EXECUTION_FACTS_INCOMPLETE | OUT_OF_SCOPE_REQUEST`。

### 限制

- 本报告只判断人工执行准备度。
- 任何未返回、未声明或解析失败的字段都不等于零。
- SIF 仅作为可选供应商需求背景；失败或空结果不等于销量为零，也不影响两个强制上游的真实状态。
- 准备度通过不代表订单、调拨、货件或运输已经执行。
- 采购、供应商选择、MOQ、包装倍数和交期事实由专家07或用户确认输入提供，本报告不创建或修改。
