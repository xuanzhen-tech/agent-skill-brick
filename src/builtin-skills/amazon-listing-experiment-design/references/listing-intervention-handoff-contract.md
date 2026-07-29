<!--
文件功能：定义 Listing 实验干预、版本差异、实施资格及向第 13 数据分析专家交接的稳定字段合同。
职责边界：只规范 Listing 内容干预；KPI、分组、样本、观察窗口、停止规则、统计分析和因果解释由第 13 拥有。
重要关联：由 ../SKILL.md 在冻结版本和创建测量交接前读取；正式字段见 ../assets/templates/listing-intervention-handoff-template.md。
-->

# Listing 实验干预与测量交接合同

## 一、字段所有权

| 对象 | 唯一 owner | 第 03 可以做什么 | 第 03 不得做什么 |
|---|---|---|---|
| Listing 内容假设 | 第 03 | 用事实、关键词、VOC 或审计证据解释计划改变的内容机制 | 承诺业务结果 |
| Control/Treatment 内容 | 第 03 | 冻结版本、逐字段差异、单一主要内容变量和约束 | 发布或切换版本 |
| 实施资格与回滚 | 第 03 | 定义内容事实门、版本证据、人工 owner 和回滚触发 | 执行后台动作或持续监控 |
| 测量协议 | 第 13 | 提交测量问题、业务希望观察的结果和版本合同 | 定义 KPI 分子分母、分析单位、分组、样本、窗口或停止规则 |
| 结果分析 | 第 13 | 按 ID 引用正式结果，供下一轮 Listing 工作使用 | 重算效应、改变结论等级或升级因果 |

“A/B 场景属于 Listing”不表示整个实验生命周期归第 03；领域干预与跨域测量是两个可组合对象。

## 二、Listing 干预最小合同

| 字段 | 要求 |
|---|---|
| `intervention_id` | 稳定、唯一，贯穿所有交接 |
| `domain` | 固定为 `listing` |
| `case_id` | 当前任务稳定 ID |
| `marketplace` | Amazon 站点 |
| `entity_scope` | ASIN/SKU/变体及适用范围 |
| `control_version_id` | 当前内容的稳定 ID、路径或快照 |
| `treatment_version_id` | 候选内容的稳定 ID、路径或快照 |
| `changed_field` | 标题、要点、描述、后台词或其他明确字段 |
| `primary_content_variable` | 唯一主要内容变化 |
| `single_variable_check` | `pass \| fail \| not_assessable` |
| `content_hypothesis` | 带 Parent Evidence IDs 的内容机制假设 |
| `eligibility_scope` | 可实施的站点、产品、变体与时间前提 |
| `implementation_owner` | 后台实施与证据提供责任方 |
| `activation_evidence_required` | 版本激活时间、快照和范围 |
| `rollback_trigger` | 错误发布、事实风险、污染或非预期变化 |
| `known_external_changes` | 已知价格、促销、广告、库存、视觉等同期变化 |
| `parent_evidence_ids` | 事实、关键词、VOC、审计和版本证据 |

缺任一核心版本、范围、主要变量、内容证据或责任方时，不得输出 `handoff_ready`。

## 三、版本差异规则

1. Control 与 Treatment 必须指向同一站点、产品和目标变体范围。
2. 每个版本保存稳定 ID、来源路径、版本时间以及哈希或快照标识。
3. 差异按 Listing 字段逐项记录，不用“整体优化”掩盖多个变化。
4. `primary_content_variable` 只能有一个；伴随变化单独列出。
5. 价格、优惠、广告、库存、图片或配送变化不是 Listing 内容变量，必须列为外部变化。
6. Treatment 的事实性宣称必须回链已批准的事实证据。
7. 不能识别差异时使用 `not_assessable` 并阻断，不用 Agent 猜测。

## 四、交给第 13 的请求

第 03 只提供：

```text
intervention_id
domain
marketplace
entity_scope
control_version_id
treatment_version_id
changed_field
primary_content_variable
single_variable_check
eligibility_scope
content_hypothesis
measurement_question
event_label
desired_metric
implementation_owner
activation_evidence_required
rollback_trigger
known_external_changes
parent_evidence_ids
```

其中：

- `measurement_question` 是业务问题；
- `event_label` 是领域侧可取得的版本激活/曝光事件名称，不是第 13 的正式曝光定义；
- `desired_metric` 是希望观察的结果名称，不是正式 KPI；
- `known_external_changes` 是待第 13 纳入设计判断的事实，不是第 03 的混杂校正。

第 13 返回的正式对象至少以 `experiment_protocol_id + protocol_version + intervention_id` 定位。第 03 只检查关联一致性，不复制或改写协议正文。

## 五、实施证据合同

授权责任方后续应提供：

| 字段 | 含义 |
|---|---|
| `intervention_id` | 与计划一致 |
| `protocol_id` | 若有，第 13 正式协议 ID |
| `actual_control_version_id` | 实际对照版本 |
| `actual_treatment_version_id` | 实际处理版本 |
| `activation_timestamp` | 带时区的实际激活时间 |
| `marketplace_and_scope` | 实际站点与变体范围 |
| `version_snapshot_evidence_ids` | 发布前后快照 |
| `unexpected_changes` | 非预期 Listing 或外部变化 |
| `rollback_event` | 触发、责任方、时间和恢复版本 |

本合同只定义证据，不代表第 03 会执行、轮询或监控。

## 六、证据与缺失

所有记录都有 `source_type / temporal_scope / estimation_status / transformation_type`。上游证据保留原四轴；Agent 的假设、归一化和资格判断使用 `parent_evidence_ids` 形成第二层谱系。

缺失状态固定为：

`not_returned | not_queried | parse_failed | missing | conflicted | true_zero`

前五种不等于零、不等于无记录、不等于无变化。版本或事实证据不适合用零值替代；若来源字段确有合法零值，只有在口径明确时才标 `true_zero`。

## 七、状态与允许措辞

| 状态 | 允许措辞 | 禁止推断 |
|---|---|---|
| `handoff_ready` | Listing 干预合同可交第 13 设计测量协议 | 已可执行、样本足够或将提升 |
| `protocol_linked` | 已链接适用的第 13 正式协议 | 已发布、已运行或已有结果 |
| `blocked` | 具体缺口与恢复责任方 | 把缺失解释为无差异 |
| `out_of_scope` | 指明统计、执行或其他 owner | 越权补做 |

固定副状态：

- `execution_status=not_executed`
- `publication_status=not_published`
- `analysis_status=not_performed | upstream_result_linked`

收到上游结果时可以说“第 13 的正式分析已关联”，不得改写为“第 03 证明新版有效”。

## 八、失败决策

- 两版本不可定位：`missing_control_version` 或 `missing_treatment_version`。
- 多个主要内容变量：`multi_variable_change`，拆分或交第 13 判断其他设计。
- 事实证据缺失：`missing_fact_evidence`。
- 无实施责任方：`missing_implementation_owner`。
- 上游冲突或过期：`stale_or_conflicted`。
- 第 13 协议不适用于当前版本：`protocol_scope_mismatch`。
- 上游对象的 ID、版本、范围或字段合同不符：`upstream_contract_mismatch`，停止受影响假设且不直接调用外部数据源补齐。
- 要求发布、监控或统计结论：`out_of_scope`。
