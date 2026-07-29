<!--
文件功能：提供 baseline_compare 路由的正式基线比较报告结构，覆盖首次建基线、逐字段四轴可比性和变化。
职责边界：模板只在用户明确接受一次基线比较后使用，不创建定时任务，不提供默认阈值；没有合格基线时只输出 baseline_created。
关联关系：由 ../../SKILL.md 的基线比较模式使用，可比规则遵循 ../../references/baseline-comparison-contract.md。
-->

# Amazon 竞品基线比较报告

## 1. 任务边界

- Case ID：
- 路由：`baseline_compare`
- Amazon 站点：
- 主 ASIN：
- 当前快照时间：
- 基线 ID：
- 基线时间：
- 状态：`baseline_created | compared | partial | blocked`

## 2. 基线身份与可比性

| 检查项 | 基线 | 当前 | 状态 | 说明 |
|---|---|---|---|---|
| 站点 |  |  |  |  |
| ASIN/父子体 |  |  |  |  |
| 来源工具 |  |  |  |  |
| 数据期间 |  |  |  |  |
| 单位/币种 |  |  |  |  |
| 字段语义 |  |  |  |  |
| 四轴完整性 |  |  |  |  |

## 3. 上游证据谱系

| 侧别 | 本层 Evidence ID | 上游来源文件 | 上游 Evidence ID | upstream_source_type | upstream_temporal_scope | upstream_estimation_status | upstream_transformation_type | 状态 |
|---|---|---|---|---|---|---|---|---|
| baseline/current |  |  |  |  |  |  |  | ready/partial |

> 上游证据在本层使用 `source_type=upstream_output`；比较时同时检查本层四轴与上游原四轴。缺失标签不得猜测。

## 4. 逐字段四轴与可比性

| ASIN | 字段 | 基线 source_type | 当前 source_type | 基线 temporal_scope | 当前 temporal_scope | 基线 estimation_status | 当前 estimation_status | 基线 transformation_type | 当前 transformation_type | 四轴可比性 | 说明 |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  | sif_mcp/user_input/upstream_output/agent | sif_mcp/user_input/upstream_output/agent | current/historical/future/mixed/not_applicable/unknown | current/historical/future/mixed/not_applicable/unknown | reported/estimated/forecast/mixed/not_applicable/unknown | reported/estimated/forecast/mixed/not_applicable/unknown | reported/normalized/calculation/coding/inference/hypothesis | reported/normalized/calculation/coding/inference/hypothesis | comparable/not_comparable |  |

`competitor-change-ledger.csv` 必须逐字段物化本表两侧的四轴列，不得只保留差值和状态。

## 5. 首次运行声明

仅当状态为 `baseline_created` 时保留：

- 当前只有一个时间点，本次仅建立基线。
- 本报告不包含上升、下降、改善、恶化或趋势结论。
- 后续比较必须继续使用同站点、同 ASIN、同父子体和同字段口径。
- 本 Skill 未创建任何定时任务或自动化。

## 6. 商品指标变化

| ASIN | 字段 | 基线值 | 当前值 | 绝对差值 | 相对差值 | 状态 | Evidence IDs |
|---|---|---:|---:|---:|---:|---|---|
|  |  |  |  |  |  | increased/decreased/unchanged/not_comparable |  |

## 7. SIF 可见结构变化

| ASIN | 结构字段 | 基线片段/标志 | 当前片段/标志 | 状态 | 可确认解释 | 反向解释 |
|---|---|---|---|---|---|---|
|  | keyword_distribution / traffic_structure / ads_visible |  |  | new/missing/changed/unchanged/not_comparable |  |  |

## 8. 本次变化摘要

| 优先级 | 可证实变化 | 业务含义上限 | 反证或限制 | 下一次复核 |
|---:|---|---|---|---|
| 1 |  |  |  |  |

## 9. 不可比较项

| ASIN | 字段 | 不可比原因 | 保留的原值 | 可恢复条件 |
|---|---|---|---|---|
|  |  |  |  |  |

## 10. 结论边界

- 本报告能证明：
- 本报告不能证明：
- 两时点限制：
- 两侧 source_type 差异：
- 两侧 temporal_scope 差异：
- 两侧 estimation_status 差异：
- 两侧 transformation_type 差异：
- 两侧上游原四轴与谱系完整性：
- `reported` 不等于 Amazon 一方观测：
- 历史估算的 `historical + estimated` 组合：
- 数据缺口与 schema 风险：

## 11. 下一步

| 优先级 | 对象 | 下一条证据 | 人工复核时点 |
|---:|---|---|---|
| 1 |  |  |  |
