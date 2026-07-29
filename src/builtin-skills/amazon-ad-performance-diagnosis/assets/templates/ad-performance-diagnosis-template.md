<!--
文件功能：提供广告报告生命周期、数据质量、指标、变化分解、假设和证据谱系的正式交付模板。
职责边界：模板不拉取报表或操作广告；占位值不得被解释为零或完成状态。
重要关联：由 ../../SKILL.md 物化；状态和字段遵循 ../../references/ad-report-and-diagnostic-contract.md。
-->

# Amazon 广告绩效诊断

## A. 诊断元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/profile/marketplace` | `<values>` |
| `currency/timezone` | `<values>` |
| `analysis_window` | `<start/end>` |
| `attribution_contract` | `<window/date semantics>` |
| `result_status` | `<从下方允许值中选择一个>` |
| `reason_codes[]` | `<从下方允许值中选择零个或多个>` |

模板允许的字面合同：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `REPORT_PROCESSING | REPORT_FAILED | REPORT_CANCELLED | REPORT_TIMEOUT | DOWNLOAD_FAILED | TRUNCATED_OR_PARTIAL | SCOPE_OR_ATTRIBUTION_CONFLICT | NOT_COMPARABLE | UNSTABLE_JOIN | ZERO_DENOMINATOR | OUT_OF_SCOPE_REQUEST`

## B. 报告 manifest

| Artifact ID | Report ID | Type | Signature | Report Status | Requested | Completed | Downloaded | Source Path | Recovery | File Version | Error/Limit |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<reported>` | `<signature>` | `<state>` | `<time>` | `<time>` | `<time>` | `<path>` | `<ref>` | `<hash/version>` | `<value>` |

## C. 数据质量与覆盖

| Dataset | Grain | Pages Expected/Received | Rows Reported/Parsed | Pagination | Truncation | Coverage | Duplicates | Parse Errors | Empty Semantics |
|---|---|---|---|---|---|---|---:|---:|---|
| `<id>` | `<grain>` | `<values>` | `<values>` | `<complete/partial/unknown>` | `<no/yes/unknown>` | `<scope>` | `<count>` | `<count>` | `<state>` |

## D. 联接验收

| Join ID | Left/Right | Stable Keys | Scope | Matched | Unmatched | Ambiguous | Manual Evidence | Status |
|---|---|---|---|---:|---:|---:|---|---|
| `<id>` | `<datasets>` | `<ids>` | `<scope>` | `<count>` | `<count>` | `<count>` | `<ids>` | `<accepted/partial/rejected>` |

## E. 指标重算

| Metric ID | Metric | Formula | Numerator | Denominator | Period/Attribution | Value | Unit/Currency | Zero Rule | Evidence IDs |
|---|---|---|---|---|---|---:|---|---|---|
| `<id>` | `<CTR/CPC/CVR/ACoS/ROAS/custom>` | `<formula>` | `<field/value>` | `<field/value>` | `<contract>` | `<value/not_computable>` | `<unit>` | `<rule>` | `<ids>` |

## F. 变化分解

| Driver ID | Dimension | Baseline | Comparison | Change | Contribution Direction | Coverage/Delay Note | Evidence IDs |
|---|---|---:|---:|---:|---|---|---|
| `<id>` | `<impression/CTR/CPC/CVR/order_value/scope>` | `<value>` | `<value>` | `<value>` | `<up/down/mixed/unknown>` | `<note>` | `<ids>` |

## G. 诊断假设

| Hypothesis ID | Observation | Supported Links | Unknown Links | Alternatives | Next Evidence/Test | Support Status | Evidence IDs |
|---|---|---|---|---|---|---|---|
| `<id>` | `<observation>` | `<links>` | `<links>` | `<alternatives>` | `<next>` | `<supported/partially_supported/unsupported/not_tested>` | `<ids>` |

## H. 阻塞与行动

| Issue ID | Type | Impact | Required Data/Action | Owner | Status |
|---|---|---|---|---|---|
| `<id>` | `<lifecycle/scope/join/coverage/metric>` | `<impact>` | `<request>` | `<owner>` | `<open/resolved>` |

## I. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页、`raw_result_locator` 和 `transformation_type=reported`；Agent 输出另建对象并回指 `parent_evidence_ids`。

## J. 质量门

- [ ] 生命周期终态与文件验收分开
- [ ] Report ID、签名和恢复信息完整
- [ ] 时区、币种、归因、粒度、延迟、分页和截断完整
- [ ] 使用稳定 ID 联接
- [ ] 零、缺失、空结果和失败分开
- [ ] 零分母为 not_computable
- [ ] SIF 外部观察与一方广告报表分层，未被当成曝光、点击、花费、订单或归因销售
- [ ] 假设含替代解释
- [ ] 无取数、轮询、下载或账户操作
- [ ] 正式文件位于 `outputs/`
