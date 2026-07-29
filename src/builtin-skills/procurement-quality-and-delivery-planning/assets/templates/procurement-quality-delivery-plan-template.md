<!--
文件功能：提供 CTQ、样品、检查、变更、偏差、CAPA、里程碑和 go/no-go 的正式交付模板。
职责边界：占位符不表示执行完成；所有数值阈值和完成状态都必须来自合格证据。
重要关联：由 ../../SKILL.md 物化；状态与字段遵循 ../../references/quality-delivery-control-contract.md。
-->

# 采购质量与交付计划

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `baseline_id` | `<baseline-id>` |
| `product/spec/BOM/packaging versions` | `<versions>` |
| `stage` | `<sample/pilot/mass_production/shipment>` |
| `plan_status` | `<ready_for_approval/conditional/missing_quality_basis/schedule_conflict/change_unresolved/blocked>` |
| `prepared_at` | `<timestamp + timezone>` |

## B. 基线与批准

| 对象 | 版本 | 证据 ID | 批准状态 | 批准人 | 批准日期 | 适用范围 | 未决变更 |
|---|---|---|---|---|---|---|---|
| `<spec/bom/packaging/sample>` | `<version>` | `<id>` | `<approved/pending>` | `<owner>` | `<date>` | `<scope>` | `<ids>` |

## C. CTQ 矩阵

| CTQ ID | 类别 | Requirement ID | 值/单位/公差 | 方法 | 设备/夹具 | 阶段 | 标准证据 ID | Qualified Owner | 状态 |
|---|---|---|---|---|---|---|---|---|---|
| `<ctq-id>` | `<category>` | `<req-id>` | `<value or tbd_by_qualified_owner>` | `<method>` | `<value>` | `<stage>` | `<id>` | `<owner>` | `<confirmed/tbd/conflicted>` |

## D. 样品与金样

| Sample ID | 版本 | 目的 | 偏差 | 测试证据 | 状态 | 批准人 | Golden Sample | 适用范围 | 失效条件 |
|---|---|---|---|---|---|---|---|---|---|
| `<sample-id>` | `<version>` | `<purpose>` | `<deviations>` | `<ids>` | `<submitted/under_review/approved/approved_with_deviation/rejected/superseded/expired>` | `<owner>` | `<yes/no/pending>` | `<scope>` | `<trigger>` |

## E. 检查节点

| Gate ID | 类型 | 对象/批次 | 时间/时区 | 地点 | CTQ IDs | Sampling Evidence | 执行者 | 批准者 | Pass Rule | 状态 | Result Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `<gate-id>` | `<gate-type>` | `<scope>` | `<value>` | `<location>` | `<ids>` | `<id/tbd>` | `<owner>` | `<owner>` | `<rule/tbd_by_qualified_owner>` | `<planned/in_progress/completed/failed/cancelled/unknown>` | `<ids/none>` |

## F. 变更控制

| Change ID | 原基线 | 拟变更 | 原因 | 受影响项 | 再验证 | 批准人 | 状态 | Evidence IDs |
|---|---|---|---|---|---|---|---|---|
| `<change-id>` | `<baseline>` | `<proposal>` | `<reason>` | `<ctq/sample/cost/milestone>` | `<requirements>` | `<owner>` | `<proposed/under_review/approved/rejected/implemented/verified>` | `<ids>` |

## G. 偏差与不合格

| NC ID | 批次/对象 | 观察 | CTQ ID | 数量范围 | 遏制 | 处置候选 | 批准处置 | 责任人 | 验证证据 | 状态 |
|---|---|---|---|---|---|---|---|---|---|---|
| `<nc-id>` | `<scope>` | `<observation>` | `<ctq-id>` | `<value>` | `<reported/planned/evidenced>` | `<options>` | `<human-approved/tbd>` | `<owner>` | `<ids>` | `<open/contained/disposition_approved/verified/closed>` |

## H. CAPA

| CAPA ID | 遏制 | 根因状态/证据 | 纠正措施 | 预防措施 | 负责人 | 截止 | 有效性检查 | 关闭批准 | 状态 |
|---|---|---|---|---|---|---|---|---|---|
| `<capa-id>` | `<action>` | `<hypothesis/validated/unknown + ids>` | `<action>` | `<action>` | `<owner>` | `<date>` | `<method>` | `<owner/pending>` | `<open/in_progress/verification/closed>` |

## I. 里程碑与依赖

| Milestone ID | 事件 | Planned | Supplier Reported | Actual | Timezone | Dependencies | Required Evidence | Owner | Escalation Trigger | Status Source |
|---|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<event>` | `<date>` | `<date/unknown>` | `<date/none>` | `<tz>` | `<ids>` | `<evidence>` | `<owner>` | `<trigger>` | `<reported/evidenced>` |

## J. Go/No-Go

| Gate | Decision | Conditions | Blockers | Evidence IDs | Human Approver | Decision Date |
|---|---|---|---|---|---|---|
| `<sample/mass_production/shipment>` | `<go/conditional_go/hold/not_assessable>` | `<conditions>` | `<ids>` | `<ids>` | `<owner/pending>` | `<date>` |

## K. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Limitations |
|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<limits>` |

## L. 质量门

- [ ] 产品、规格、样品和批次版本一致
- [ ] CTQ 有合格来源或明确 tbd 责任方
- [ ] 未硬编码 AQL、抽样量或验收阈值
- [ ] 金样、变更、偏差和 CAPA 状态有证据
- [ ] 计划没有冒充已执行
- [ ] go/no-go 有人工责任人
- [ ] 无验货、催单、系统写入或后台监控
- [ ] `uploads/` 未改变，正式文件在 `outputs/`
