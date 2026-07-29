<!--
文件功能：定义广告报告生命周期、签名、完整性、稳定 ID 联接、缺失语义、指标和诊断假设合同。
职责边界：不执行报告请求、轮询、下载或广告账户操作，不提供虚构 Ads API 字段。
重要关联：由 ../SKILL.md 在数据验收和诊断时读取；正式字段映射到 ../assets/templates/ad-performance-diagnosis-template.md。
-->

# 广告报告与诊断合同

## 1. 顶层诊断结果合同

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `REPORT_PROCESSING | REPORT_FAILED | REPORT_CANCELLED | REPORT_TIMEOUT | DOWNLOAD_FAILED | TRUNCATED_OR_PARTIAL | SCOPE_OR_ATTRIBUTION_CONFLICT | NOT_COMPARABLE | UNSTABLE_JOIN | ZERO_DENOMINATOR | OUT_OF_SCOPE_REQUEST`

每次运行只允许这一组顶层诊断结果字段。每份异步报表的生命周期必须另存为 `report_status`；不得使用 `diagnostic_status`，也不得把 `processing/failed` 等报告状态写进 `result_status`。

## 2. 报告生命周期 `report_status`

| 状态 | 含义 | 是否可分析 |
|---|---|---:|
| `request` | 已有请求证据 | 否 |
| `processing` | 上游生成中 | 否 |
| `completed` | 上游完成，尚需下载验收 | 否 |
| `failed` | 上游失败 | 否 |
| `cancelled` | 上游取消 | 否 |
| `timeout` | 用户定义等待边界到期 | 否 |
| `download_failed` | 完成但文件未取得 | 否 |
| `ingested` | 文件结构验收通过 | 是 |
| `rejected` | 文件不可用于本分析 | 否 |

## 3. 报告 manifest

必须包含：

- `report_artifact_id`
- `report_id`
- `report_type_reported`
- `account_scope_id`
- `profile_id`
- `marketplace_id`
- `requested_at`
- `completed_at`
- `downloaded_at`
- `report_status`
- `source_path`
- `recovery_reference`
- `report_signature`
- `file_hash_or_version`
- `error_or_limit`

## 4. 报告签名

签名字段：

- 账户/profile/站点；
- 报告类型；
- 实体范围；
- 开始与结束日期；
- 时区；
- 归因窗口和日期语义；
- 粒度；
- 列集；
- 筛选与排除；
- 币种。

同名文件不等于同签名报告。

## 5. 完整性

| 字段 | 说明 |
|---|---|
| `page_count_expected/received` | 未知时明确 unknown |
| `row_count_reported/parsed` | 原始与解析分开 |
| `pagination_state` | complete/partial/unknown |
| `truncation_state` | no/yes/unknown |
| `coverage_scope` | 实体、日期和状态范围 |
| `duplicate_count` | 重复行 |
| `parse_error_count` | 解析失败 |
| `empty_semantics` | zero_rows/headers_only/not_requested/failed |

## 6. 稳定 ID 联接

每条联接记录：

- `join_id`
- `left_dataset/right_dataset`
- `stable_key_fields`
- `join_scope`
- `matched/unmatched/ambiguous counts`
- `manual_mapping_evidence_ids`
- `join_status`

名称联接只能作为待人工确认候选，不能成为正式事实。

## 7. 缺失语义

| 值 | 含义 |
|---|---|
| `0` | 来源真实报告零 |
| `missing` | 字段或值缺失 |
| `empty_result` | 完成请求真实无行 |
| `not_requested` | 未请求 |
| `not_applicable` | 不适用 |
| `not_computable` | 分母缺失或零 |
| `failed_state` | 生命周期失败 |

## 8. 指标

每个计算记录：

- 指标名；
- 公式；
- numerator/denominator 字段；
- 币种和单位；
- 期间、时区、归因窗口；
- 输入 evidence IDs；
- 零分母规则；
- 舍入规则；
- 输出 ID。

## 9. 诊断假设

| 字段 | 说明 |
|---|---|
| `hypothesis_id` | 稳定编号 |
| `observation` | 可复核变化 |
| `parent_evidence_ids` | 必填 |
| `supported_links` | 已支持链路 |
| `unknown_links` | 未知链路 |
| `alternative_explanations` | 至少一个 |
| `next_evidence_or_test` | 补充证据 |
| `support_status` | supported/partially_supported/unsupported/not_tested |

不允许用任意综合分代替证据链。
