<!--
文件功能：作为 Agent 输出 Listing 干预定义、版本差异和第 13 测量交接时使用的稳定模板。
职责边界：模板不承载 KPI、样本量、观察窗口、停止规则、统计计算、因果结论或后台执行步骤。
重要关联：由 ../../SKILL.md 写入 outputs/listing-optimization/<case-id>/05-experiment-design/ 前读取或物化；字段规则见 ../../references/listing-intervention-handoff-contract.md。
-->

# Amazon Listing 实验干预定义

## 任务与状态

- Case ID：
- Intervention ID：
- Amazon 站点：
- ASIN/SKU/变体范围：
- Result status：`handoff_ready | protocol_linked | blocked | out_of_scope`
- Reason codes：`none | missing_control_version | missing_treatment_version | multi_variable_change | missing_fact_evidence | missing_implementation_owner | stale_or_conflicted | protocol_scope_mismatch | upstream_contract_mismatch | out_of_scope`
- Execution status：`not_executed`
- Publication status：`not_published`
- Analysis status：`not_performed | upstream_result_linked`
- 实施责任方：

## Listing 内容假设

对于 [站点/产品/变体/目标用户]，把 Listing 的 [字段] 从 [对照版本] 改为 [处理版本]，希望验证 [测量问题]，其内容机制假设是 [带 Evidence IDs 的机制]。

- Changed field：
- Primary content variable：
- Single variable check：`pass | fail | not_assessable`
- Eligibility scope：
- 假设 Parent Evidence IDs：
- 明确不承诺的结果：

## 版本冻结

| 角色 | Version ID | 来源路径/快照 | 版本时间 | 哈希/稳定标识 | 生成方 | 审批状态 |
|---|---|---|---|---|---|---|
| Control |  |  |  |  |  |  |
| Treatment |  |  |  |  |  |  |

## 逐字段差异

| Diff ID | Listing 字段 | Control | Treatment | 是否主要变量 | 伴随变化 | 事实/关键词/品牌约束 Evidence IDs | 判断 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 内容与实施资格

- [ ] Control/Treatment 指向同一站点、产品和变体范围。
- [ ] 唯一主要内容变量已识别。
- [ ] Treatment 的事实性宣称均有 Evidence IDs。
- [ ] 未引入未证认证、性能、比较级、质保或合规结论。
- [ ] 上游事实、关键词、品牌和风险约束未 stale/conflicted。
- [ ] 实施责任方和人工审批明确。
- [ ] 发布后可以提供版本激活时间和快照。

### 不满足项

| 缺口 | 缺失状态 | 影响 | 责任方 | 恢复条件 |
|---|---|---|---|---|
|  | `not_returned \| not_queried \| parse_failed \| missing \| conflicted \| true_zero` |  |  |  |

> 前五种缺失状态不等于零、不等于无记录、不等于无变化或无风险。

## 实施证据与回滚定义

- Activation evidence required：
- Version snapshot evidence required：
- Rollback trigger：
- Rollback owner：
- Expected recovery version ID：

| 外部变化 | 当前证据 | 是否应保持不变 | 发生时的处理 | Evidence IDs |
|---|---|---|---|---|
| 价格/优惠 |  |  |  |  |
| 广告/流量来源 |  |  |  |  |
| 库存/配送 |  |  |  |  |
| 图片/其他 Listing 字段 |  |  |  |  |

## 交给第 13 数据分析专家

- Measurement question：
- Desired metric（仅业务名称，不是 KPI 合同）：
- Activation event label：

| 交接字段 | 值 | Parent Evidence IDs |
|---|---|---|
| `intervention_id` |  |  |
| `domain` | `listing` |  |
| `marketplace` |  |  |
| `entity_scope` |  |  |
| `control_version_id` |  |  |
| `treatment_version_id` |  |  |
| `changed_field` |  |  |
| `primary_content_variable` |  |  |
| `single_variable_check` |  |  |
| `eligibility_scope` |  |  |
| `content_hypothesis` |  |  |
| `measurement_question` |  |  |
| `event_label` |  |  |
| `desired_metric` |  |  |
| `implementation_owner` |  |  |
| `activation_evidence_required` |  |  |
| `rollback_trigger` |  |  |
| `known_external_changes` |  |  |

## 可选的第 13 协议/结果链接

- Experiment protocol ID：
- Protocol version：
- Protocol upstream path：
- Protocol scope match：`matched | mismatched | not_provided`
- Protocol 前置条件缺口：
- Experiment analysis output ID：
- Analysis upstream path：
- 上游结论等级与限制（原样保留）：

本节只链接第 13 正式产物，不复制或改写 KPI、样本、窗口、停止规则、统计结果和因果结论。

## 证据谱系账本

| Record ID | Record type | Intervention ID | Parent Evidence IDs | 来源路径/工具 | 使用字段/时间 | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` |
|---|---|---|---|---|---|---|---|---|---|
|  | `input_evidence \| agent_output` |  |  |  |  |  |  |  |  |

## 能力声明

- 本 Skill 未创建、启动、暂停、结束、切换或监控 Amazon 实验。
- 本 Skill 未定义或改写第 13 的测量协议和统计结论。
- 本 Skill 未直接调用 SIF 或其他外部业务数据源。
- 使用的供应商观察如存在，只能来自可信上游，并保留其原始四轴、父证据 ID 与限制。
- 未查询、不可见、冲突或待责任方提供的内容：
