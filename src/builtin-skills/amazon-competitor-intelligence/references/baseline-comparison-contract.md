<!--
文件功能：定义竞品快照的基线身份、逐字段四轴可比条件、差值语义和首次运行规则。
职责边界：只处理用户明确接受后显式执行的一次基线比较，不负责定时调度，不把两个时间点推广为长期趋势。
关联关系：由 ../SKILL.md 的 baseline_compare 路由读取，并约束 ../assets/templates/competitor-baseline-comparison-template.md 的填写。
-->

# 竞品基线比较合同

## 基线最小身份

每个基线快照至少包含：

```text
baseline_id
case_id
created_at
marketplace
currency
entity_id
parent_child_scope
tool
tool_schema_note
as_of
period
query_filters
fields
evidence_ids
field_evidence_axes
```

`field_evidence_axes` 必须让每个字段定位到其 `source_type`、`temporal_scope`、`estimation_status` 和 `transformation_type`。缺少站点、实体、字段语义或任一侧逐字段四轴时，基线不能用于数值比较，只能作为不可比的历史材料引用。

## 字段可比闸门

只有同时满足以下条件，字段才可比较：

1. Amazon 站点一致；
2. ASIN 身份和父子体口径一致；
3. 字段业务语义一致；
4. 单位、币种和百分比尺度一致；
5. 都是同一来源工具，或已证明跨工具口径等价；
6. 两侧均保存完整四轴，并证明时间范围、估算性质和变换规则支持本次陈述；
7. 数据期间和时间粒度足以支持本次陈述；
8. 上游证据在本层使用 `source_type=upstream_output`，并通过独立谱系字段保留原四轴、evidence ID 与来源文件；没有伪装成本次 MCP 数据。

任一条件不满足，状态为 `not_comparable`，保留两侧原值但不计算差值。

四轴不要求机械相等，但差异必须可解释且不改变指标语义。例如，不同时点的两个 `current + reported + reported` 原始快照可进入可比检查；两个同口径 `historical + estimated + reported` 序列也可以比较。`historical + estimated` 是合法组合，不能压成单一类型。`reported` 不等于 Amazon 一方观测。

## 比较输出

每个字段输出：

```text
entity_id
field
baseline_evidence_id
current_evidence_id
baseline_source_type
current_source_type
baseline_temporal_scope
current_temporal_scope
baseline_estimation_status
current_estimation_status
baseline_transformation_type
current_transformation_type
baseline_value
current_value
unit
absolute_delta
relative_delta
comparison_status
interpretation
counter_explanation
```

`comparison_status` 只使用 `increased`、`decreased`、`unchanged`、`new`、`missing`、`not_comparable`。

## 四轴比较规则

- `source_type`：同一来源类型不自动证明同口径；不同来源类型只有在工具、文件、字段定义和采集方法已证明等价时才可比较。
- `temporal_scope`：`current` 快照按各自 as-of 比较；`historical` 序列按相同期间和粒度比较；`future` 不得冒充当前或历史结果；`mixed` 与 `unknown` 默认阻断数值差值。
- `estimation_status`：`reported` 与 `estimated`、`forecast` 不得无说明互换；两个估算值只有在估算定义和版本可比时才可比较；`mixed` 与 `unknown` 默认阻断依赖估算语义的结论。
- `transformation_type`：`reported` 可与同语义原始字段比较；`normalized` 必须使用相同公式和输入尺度；`calculation` 必须使用相同公式；`coding`、`inference` 和 `hypothesis` 默认不做数值差值。
- 任一 Agent 变换都必须链接输入 evidence ID；比较表不得只保留结果而丢失输入四轴。

## 计算规则

- 数值可比时：`absolute_delta = current - baseline`。
- 基线非零且单位一致时：`relative_delta = absolute_delta / baseline`。
- 基线为零时不输出相对变化率，写 `not_applicable`。
- 比率先确认原始尺度是 `0–1` 还是 `0–100`，标准化后保留原值。
- BSR 是名次型指标；只在同类目同口径下解释数值变小为排名更靠前、数值变大为更靠后。
- 文本字段只输出新增、删除或改变的显式片段；不计算伪精确的“质量提升率”。
- 布尔标志只输出 `false → true`、`true → false` 或不变，不推测业务效果。

## 时间表述

| 证据数量 | 允许表述 | 禁止表述 |
|---:|---|---|
| 1 | 当前快照、首次基线 | 上升、下降、趋势、改善、恶化 |
| 2 | 相对基线增加/减少、本次变化 | 长期趋势、持续增长、稳定下滑 |
| 3 个以上同口径时点 | 描述序列方向与异常点 | 未经统计支持的季节性或因果 |

即使有三个以上时点，也必须披露缺口和不等间隔；本 Skill 不自动执行趋势模型。

## 首次运行

没有合格基线时：

1. 生成当前快照；
2. 分配 `baseline_id`；
3. 报告状态写 `baseline_created`；
4. 比较表保留为空并说明原因；
5. 列出未来手动复核所需的同站点、同 ASIN、同字段条件；
6. 不创建定时任务或提醒。

## 冲突与缺失

- 基线比当前字段丰富：当前缺失字段标 `missing`，不推断已删除。
- 当前比基线字段丰富：标 `new`，但可能只是 schema 扩展，不能直接称商品新增。
- 工具 schema 变化：优先标 `not_comparable`，并记录前后字段定义。
- 数据期间不同：只有业务语义允许时比较，并在解释中显式写期间差异。
- 任一侧四轴缺失或为会改变结论的 `unknown`：标 `not_comparable`，不从字段名猜测。
- 多份基线冲突：不自动选最有利的一份；按来源、口径和时间排序，要求用户选择或将分支标为 `blocked`。
