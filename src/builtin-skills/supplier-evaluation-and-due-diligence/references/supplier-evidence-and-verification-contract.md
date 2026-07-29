<!--
文件功能：定义供应商候选身份、证据强度、陈述状态、冲突和阶段决策合同。
职责边界：不提供外部核验结果，不把文件外观当真实性结论，不定义万能评分。
重要关联：由 ../SKILL.md 在证据矩阵和身份核对时读取；输出字段映射到 ../assets/templates/supplier-evaluation-template.md。
-->

# 供应商证据与核验合同

## 1. 证据记录

| 字段 | 规则 |
|---|---|
| `evidence_id` | 案件内唯一 |
| `source_path` | 对话定位、只读 uploads 或可信 outputs |
| `provided_by` | 用户、供应商、第三方或责任方 |
| `subject_id` | 证据声称适用的法定主体、工厂、产品或样品 |
| `document_type` | 证照、认证、报告、报价、合同、样品记录、核验记录等 |
| `document_date` / `expiry_date` | 不清楚写 `unknown` |
| `source_version` | 文件或记录版本 |
| `completeness` | `complete`、`partial`、`illegible`、`unknown` |
| `limitations` | 缺页、过期、仅陈述、适用范围或未独立核验 |
| 四轴 | `source_type`、`temporal_scope`、`estimation_status`、`transformation_type` |

供应商提供的证照仍是 `reported`；合格责任方完成核验后，另增核验记录，不覆盖原证据。

## 2. 身份节点

每个身份单独建节点：

- `identity_id`
- `identity_type`: `legal_entity`、`factory`、`trader`、`contract_party`、`payee`、`contact`、`brand`、`platform_account`
- `name_reported`
- `jurisdiction_or_location`
- `identifier_reported`
- `parent_evidence_ids`
- `verification_status`

关系只能标为：

- `reported_same`
- `evidence_linked`
- `verified_by_qualified_owner`
- `conflicted`
- `unknown`

相似名称、相同联系人或相同 Logo 不足以自动使用 `evidence_linked`。

每条身份关系必须形成正式 `identity_link` 对象：

| 字段 | 规则 |
|---|---|
| `identity_link_id` | 本层稳定唯一 |
| `from_identity_id` / `to_identity_id` | 关系两端身份节点 |
| `relation_status` | `reported_same` / `evidence_linked` / `verified_by_qualified_owner` / `conflicted` / `unknown` |
| `parent_evidence_ids` | 支撑或冲突该关系的输入 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `coding` / `inference` |
| `verification_status` / `limitations` | 当前核验状态与结论上限 |

## 3. 陈述与核验状态

| 状态 | 含义 |
|---|---|
| `supplier_reported` | 供应商或其材料陈述 |
| `document_supported` | 多份内部一致材料支撑，但未做外部确认 |
| `sample_observed` | 样品或测试记录实际观察 |
| `verified_by_qualified_owner` | 指定责任方完成可追溯核验 |
| `conflicted` | 证据互相冲突 |
| `stale` | 已过期或不再代表当前 |
| `not_assessed` | 本次证据不支持评估 |

禁止把 `document_supported` 改写成“官方已认证”。

## 4. 要求匹配

| 字段 | 说明 |
|---|---|
| `match_id` | 本层匹配记录稳定唯一 |
| `requirement_id` | 上游硬约束或偏好 |
| `candidate_id` | 候选供应商 |
| `match_status` | `supported_by_evidence`、`supplier_reported`、`partially_supported`、`not_supported`、`conflicted`、`not_assessed` |
| `parent_evidence_ids` | 支撑或冲突证据 |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `coding` / `inference` |
| `verification_action_id` | 对应核验任务 |

不允许用总分抵消 `must` 项的 `not_supported` 或 `conflicted`。

每个尚缺项或冲突另建正式 `gap` 对象，不得只写在 match 的备注单元格：

| 字段 | 规则 |
|---|---|
| `gap_id` | 本层缺口稳定唯一 |
| `match_id` / `requirement_id` / `candidate_id` | 缺口适用对象 |
| `gap_description` / `affected_scope` | 缺失或冲突及其影响范围 |
| `required_evidence` / `owner` / `status` | 最小补证、责任人及 `open` / `resolved` / `blocked` |
| `parent_evidence_ids` | 支撑缺口判断的输入 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `coding` / `inference` |

## 5. 风险信号记录

每项包含：

| 字段 | 规则 |
|---|---|
| `signal_id` | 本层风险信号稳定唯一 |
| `observation` | 只描述证据支持的观察 |
| `parent_evidence_ids` | 支撑观察的输入 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `inference` / `hypothesis` |
| `potential_impact` | 可能影响，不写成既成损失 |
| `alternative_explanations` | 至少保留一种合理替代解释 |
| `verification_needed` / `decision_gate` / `status` | 核验、闸门与当前状态 |

风险信号不是欺诈定性，也不是法律结论。

## 6. 核验任务

| 字段 | 说明 |
|---|---|
| `verification_action_id` | 稳定编号 |
| `question` | 要确认的具体事实 |
| `required_evidence` | 合格材料或观察 |
| `qualified_owner` | 用户指定的采购、法务、质量、审计或第三方 |
| `completion_rule` | 可判定的完成标准 |
| `due_date` | 日期或 `tbd` |
| `failure_rule` | 缺失、拒绝或冲突时如何决策 |
| `status` | `open`、`in_progress`、`completed`、`failed`、`waived_by_owner` |

`waived_by_owner` 必须记录批准人与被接受风险，不能等同于核验完成。

## 7. 阶段决策

每项阶段结论先形成正式 `decision` 对象：

| 字段 | 规则 |
|---|---|
| `decision_id` | 本层阶段决策稳定唯一 |
| `decision_scope` | 本次进入询价、打样或进一步核验的范围 |
| `decision_status` | 使用下表允许状态 |
| `parent_evidence_ids` | 支撑结论的 Evidence/Match/Gap/Risk IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 固定为 `inference` |
| `conditions` / `unresolved_risks` | 条件及未决风险 |
| `approved_by` / `decision_date` / `next_review_trigger` | 人工批准与复核触发 |

| 状态 | 适用条件 |
|---|---|
| `proceed_to_rfq` | 身份足以沟通，未决项不会导致不当披露 |
| `proceed_to_sample_with_conditions` | 允许打样，但条件和付款闸门明确 |
| `hold_for_verification` | 关键身份、能力或风险信号待核验 |
| `do_not_proceed_on_current_evidence` | 当前证据出现不可接受冲突或硬约束不满足 |
| `not_assessable` | 候选或采购要求不足 |

所有结论必须记录 `decision_scope`、`conditions`、`approved_by`、`decision_date` 和 `next_review_trigger`。
