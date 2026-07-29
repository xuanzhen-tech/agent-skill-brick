<!--
文件功能：提供 FBA 人工建件资料就绪审查的正式报告模板。
使用方式：按 ../../SKILL.md 的流程填写，并以 ../../references/fba-readiness-evidence-contract.md 为字段依据。
维护边界：模板只承载审查结论和人工交接，不承载平台创建、提交或修复动作。
-->

# FBA 人工建件资料就绪报告

> 未填写内容必须写“未知/待确认”，不得把占位符保留在正式报告中。

## 1. 任务与范围

| 字段 | 内容 |
|---|---|
| 任务 ID |  |
| Marketplace/站点 |  |
| 目的国家/地区 |  |
| 货件批次标识 |  |
| 商品范围版本 |  |
| 计划发运窗口 |  |
| 审查生成时间及时区 |  |
| 最终事实确认人 |  |

## 2. 总体结论

| 字段 | 内容 |
|---|---|
| 结论 | `READY_FOR_MANUAL_CREATION` / `CONDITIONALLY_READY` / `BLOCKED` |
| 关键阻塞数 |  |
| 待人工确认数 |  |
| 结论摘要 |  |
| 明确不包含 | 建件、提交、预约、状态查询或修复 |

### 正式结论派生记录

| Conclusion ID | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 结论 | 阻塞/假设 | 下一责任人 |
|---|---|---|---|---|---|---|---|---|
|  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `decision` |  |  |  |

## 3. 原始证据 envelope

| evidence_id | source_type | source_locator | source_version | observed_at | business_time | temporal_scope | estimation_status | transformation_type | raw_value | raw_unit_or_currency | provider_or_owner | confirmation_status | limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### 正式规范化记录

| Normalized ID | 对象/字段 | 原值/单位 | 规范化值/单位 | 规则/精度/舍入 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `normalized` |

## 4. 逐 SKU 就绪矩阵

| SKU | ASIN | FNSKU/标签策略 | 计划件数 | 包装证据 | 箱规证据 | 目的信息 | 状态 | conclusion_id |
|---|---|---|---:|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 5. 数量与箱规闭环

| 箱/托盘 ID | 包装层级 | 件数 | 长 | 宽 | 高 | 尺寸单位 | 实际重 | 重量单位 | 实测/估算 | 证据 |
|---|---|---:|---:|---:|---:|---|---:|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

| Check ID | 检查项 | 结果 | 公式/规则 | 差异 | 状态 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---:|---|---|---|---|---|---|
|  | 总件数与箱内件数之和 |  | 计划总件数 = 各箱件数之和 |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `calculation/comparison` |

## 6. 用户提供的账户/商品状态快照

| 快照 ID | 状态名称 | 站点/账户范围 | 快照日期及时区 | SKU 关联 | 仅代表该时点 | 可支持的判断 |
|---|---|---|---|---|---|---|
|  |  |  |  |  | 是 |  |

## 7. 缺口、冲突与待确认

| ID | 类型 | 阻塞等级 | 影响对象 | 当前证据 | 具体原因 | 最小补充材料 | 责任人 | 期望时间 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 8. 人工建件交接清单

- [ ] 人工确认站点、批次和商品范围。
- [ ] 人工确认 SKU/ASIN/FNSKU 或标签策略映射。
- [ ] 人工确认总件数、箱数和散箱/混装处理。
- [ ] 人工确认箱规为正确层级且实际称量。
- [ ] 人工确认标签和包装版本。
- [ ] 人工处理所有关键阻塞和冲突。
- [ ] 人工在平台中创建并复核；本报告不执行该动作。

## 9. 派生 record、谱系与限制

| output_id | output_type | object_id | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | rule_version | generated_at | uncertainty | result_status | reason_codes[] | 规则/结果 | 对象轴 | 时间轴 | 单位轴 | 口径轴 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `normalized` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `normalized` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |
|  | `check` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `calculation/comparison` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |
|  | `conclusion` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `decision` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |

对象、时间、单位和口径列仅为额外比较维度，不能替代每个正式派生对象本体的五项血缘字段。

`reason_codes[]` 只允许：`SCOPE_UNRESOLVED | QUANTITY_CONFLICT | LABEL_OR_IDENTITY_CONFLICT | MEASUREMENT_UNVERIFIED | SNAPSHOT_STALE_OR_UNDATED | EXTERNAL_TOOL_UNAVAILABLE | OUT_OF_SCOPE_REQUEST`。

### 限制说明

- 本报告仅用于人工建件前资料审查。
- IPI、stranded、suppressed 等信息只来自用户提供的带日期快照，不代表实时状态。
- 本报告不构成平台接受、仓库接收、运输时效或合规保证。
