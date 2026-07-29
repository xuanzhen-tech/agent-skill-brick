<!--
文件功能：提供 Amazon 评论 VOC 正式报告的可复制结构。
职责边界：模板不包含真实评论、频率、作者身份或结论；只能用用户、uploads 或可信上游提供的可追溯评论证据填充。
关联关系：由 ../../SKILL.md 正式交付阶段使用；证据与编码口径分别见 ../../references/review-evidence-contract.md 和 ../../references/review-coding-method.md。
-->

# Amazon 评论 VOC 研究报告

## 1. 研究范围

- Case ID：
- Amazon 站点：
- ASIN：
- 研究用途：
- 目标期间：
- 实际材料期间：
- 材料提供/导入时间：
- 当前状态：ready / partial / blocked

## 2. 数据源与取样

| source_type | temporal_scope | estimation_status | transformation_type | 来源文件 | ASIN | 分层 | 抽样/导出范围 | 去重后样本 | 状态 |
|---|---|---|---|---|---|---|---|---|---|
| user_input/upstream_output |  |  | reported/normalized |  |  |  |  |  |  |

> 每个四轴单元格只填写一个允许值。来源评论记录使用 `transformation_type=reported`；评论日期可解释时为 `historical`，否则为 `unknown`。文件或导入时间不能冒充评论日期。

### 上游证据链

| 本层 Evidence ID | 上游来源文件 | 上游 Evidence ID | upstream_source_type | upstream_temporal_scope | upstream_estimation_status | upstream_transformation_type |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### 取样限制

- 

## 3. 覆盖与可比性

| 分层 | 来源提供数 | 去重后 | 是否截断 | 字段六态 | 可比性 |
|---|---:|---:|---|---|---|
|  |  |  |  |  |  |

## 4. 主题证据

| 主题代码 | 方向 | 命中评论数 | 合格分母 | 样本频率 | 代表证据 | 证据强度 |
|---|---|---:|---:|---:|---|---|
|  |  |  |  |  |  |  |

### 主题结果四轴账本

主题编码和频率计算必须分成独立结果行，不能把两个转换类型压进同一标签。

| Result ID | Result Type | source_type | temporal_scope | estimation_status | transformation_type | parent_evidence_ids |
|---|---|---|---|---|---|---|
| THEME-001 | theme_code | agent | historical | not_applicable | coding |  |
| FREQ-001 | sample_frequency | agent | historical | not_applicable | calculation |  |

> 样本日期无法判断时，将对应结果的 `temporal_scope` 改为 `unknown`，不要把两个允许值写进同一单元格。

> 频率仅代表本次已取样且去重后的评论，不代表全部消费者或 Amazon 全量评论。

## 5. 痛点与阻碍

### 主题：

- 直接证据：
- 编码观察：
- 反证或冲突：
- Agent 推断：
- 下一步验证：

## 6. 正向体验与价值

### 主题：

- 直接证据：
- 编码观察：
- 反证或冲突：
- Agent 推断：
- 下一步验证：

### 洞察四轴账本

| Inference ID | source_type | temporal_scope | estimation_status | transformation_type | parent_evidence_ids | 反证 | 推断 |
|---|---|---|---|---|---|---|---|
| INF-001 | agent | historical | not_applicable | inference |  |  |  |

> `not_applicable` 只表示本行不是来源估算字段；若关键输入的 `estimation_status=unknown`，推断必须保持条件化，不能升级为确定事实。

## 7. 分层差异

| 比较 | 观察 | 证据范围 | 可比性 | 限制 |
|---|---|---|---|---|
| ASIN / 星级 / Verified / Vine / 媒体 / 期间 |  |  |  |  |

## 8. 产品与服务假设

| 假设 | source_type | temporal_scope | estimation_status | transformation_type | 支撑证据 | 反证 | 当前置信度 | 验证动作 |
|---|---|---|---|---|---|---|---|---|
|  | agent | future | not_applicable | hypothesis |  |  |  |  |

## 9. 未回答问题

- 

## 10. 结论边界

- 本报告不包含作者身份。
- 主题和方向是编码结果，不是评论原始字段。
- 所有频率都以本次已取样评论为分母。
- 评论正文只来自用户、`uploads/` 或可信上游；未调用 SIF 或其他外部来源取评论。
- `reported` 表示来源记录，不等于 Amazon 官方观测。
