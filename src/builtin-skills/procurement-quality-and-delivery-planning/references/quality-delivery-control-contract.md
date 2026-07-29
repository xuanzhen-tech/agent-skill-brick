<!--
文件功能：定义采购质量基线、CTQ、样品、检查、变更、偏差、CAPA 和交付闸门的数据合同。
职责边界：不提供通用 AQL 或阈值，不执行验货、处置、催单和系统写入。
重要关联：由 ../SKILL.md 在建立质量和交付计划时读取；正式字段映射到 ../assets/templates/procurement-quality-delivery-plan-template.md。
-->

# 质量与交付控制合同

## 1. 基线

| 字段 | 规则 |
|---|---|
| `baseline_id` | 产品和版本唯一 |
| `product_id` / `spec_version` / `bom_version` | 不得跨版本复用结论 |
| `packaging_version` | 单独记录 |
| `approved_by` / `approved_at` | 未批准写 pending |
| `golden_sample_id` | 只有责任方批准后填写 |
| `scope` | 市场、变体、批次或日期 |
| `open_change_request_ids` | 未决变更 |

## 2. CTQ

每条 CTQ 包含：

- `ctq_id`
- `category`
- `requirement_id`
- `value`、`unit`、`tolerance`
- `method`
- `equipment_or_fixture`
- `sample_stage`
- `acceptance_source_evidence_id`
- `qualified_owner`
- `status`

没有授权阈值时使用 `tbd_by_qualified_owner`，不能设默认。

## 3. 样品与金样

允许状态：

- `submitted`
- `under_review`
- `approved`
- `approved_with_deviation`
- `rejected`
- `superseded`
- `expired`

金样记录必须含保管责任人、证据路径、批准范围和失效触发器。

## 4. 检查节点

| 字段 | 说明 |
|---|---|
| `inspection_gate_id` | 稳定编号 |
| `gate_type` | 物料、首件、生产中、完工、装箱、出货前、到货 |
| `object_scope` | 产品/部件/批次 |
| `planned_at` / `location` | 时间和地点 |
| `ctq_ids` | 检查对象 |
| `sampling_plan_evidence_id` | 缺失则 tbd |
| `executor` / `approver` | 角色分离 |
| `pass_rule` | 来自合格证据 |
| `status` | `planned`、`in_progress`、`completed`、`failed`、`cancelled`、`unknown` |
| `result_evidence_ids` | 只有执行后填写 |

计划存在不等于 `completed`。

## 5. 变更

变更状态按顺序：

`proposed → under_review → approved|rejected → implemented → verified`

只有存在执行和验证证据时才可进入 `implemented` 与 `verified`。记录受影响的 CTQ、样品、测试、成本、里程碑和再批准。

## 6. 偏差与不合格

| 字段 | 说明 |
|---|---|
| `nonconformance_id` | 稳定编号 |
| `batch_or_object_id` | 影响范围 |
| `observation` | 事实观察 |
| `ctq_id` | 违反的标准 |
| `quantity_scope` | 数量和单位 |
| `containment_status` | 陈述与证据分开 |
| `disposition_proposal` | 候选处置 |
| `approved_disposition` | 人工批准后填写 |
| `verification_evidence_ids` | 关闭证据 |

## 7. CAPA

CAPA 记录：

- `capa_id`
- `containment_action`
- `root_cause_status`: `hypothesis`、`validated`、`unknown`
- `root_cause_evidence_ids`
- `corrective_action`
- `preventive_action`
- `owner`
- `due_date`
- `effectiveness_check`
- `closure_approved_by`
- `status`

供应商承诺本身不足以关闭 CAPA。

## 8. 里程碑与闸门

每个里程碑记录计划日期、供应商承诺日期、实际日期、时区、前置依赖、状态来源、证据、负责人和升级触发器。

闸门结论：

- `go`
- `conditional_go`
- `hold`
- `not_assessable`

必须记录条件、阻塞项和人工批准人。

## 9. 四轴与谱系

所有输入和输出分别保存：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- `source_path` 或 `parent_evidence_ids`

供应商生产计划通常是 `reported` + `future`；Agent 的延误风险通常是 `inference` 或 `hypothesis`。
