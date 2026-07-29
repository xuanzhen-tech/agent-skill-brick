<!--
文件功能：提供新品验证计划的可复制输出结构。
职责边界：模板不包含真实阈值、日期或负责人；使用时复制到 outputs/ 并用上游证据和用户约束填充。
关联关系：由 ../../SKILL.md 的正式交付阶段使用，方法见 ../../references/product-validation-playbook.md。
-->

# Amazon 新品验证计划

## 1. 决策基线

- Case ID：
- 候选/SKU：
- Amazon 站点：
- 目标上市窗口：
- “上架完成”口径：Listing 建立 / 货件发出 / FBA 入仓 / 前台可售 / 待用户定义
- 上游机会验证版本：
- 上游单位经济版本：
- 当前决策：go / watch / kill / blocked
- 本次批准的最大投入：

## 2. 证据状态

| 结论 | 证据 ID | 数据类型 | 截止日期 | 置信度 | 缺口 |
|---|---|---|---|---|---|
| 需求 |  |  |  |  |  |
| 竞争 |  |  |  |  |  |
| 差异化 |  |  |  |  |  |
| 单位经济 |  |  |  |  |  |
| 供应与交期 |  |  |  |  |  |

### 上游 `outputs/` 证据谱系

| source_type | upstream_source_file | upstream_evidence_id | upstream_source_type | upstream_temporal_scope | upstream_estimation_status | upstream_transformation_type | upstream_limitations |
|---|---|---|---|---|---|---|---|
| upstream_output |  |  |  |  |  |  |  |

消费上游 `outputs/` 时必须逐条填写本表；不得把 `source_type=upstream_output` 改写成当前 Agent 或本次 SIF。缺少上游 Evidence ID、原四轴或限制时，对应闸门保持 `blocked`。

### SIF 刷新证据（仅实际刷新时填写）

| evidence_id | source_type | source_provider | source_tool | agent_request_id | tool_call_id | provider_request_id | retrieved_at | marketplace | query_scope | temporal_scope | coverage_or_pagination | estimation_status | transformation_type | result_state | field_state | raw_result_locator | parent_input_evidence_ids | parent_evidence_ids |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | sif_mcp | sif |  | not_returned | not_returned | not_returned |  |  |  |  |  |  | reported |  |  |  |  |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`。

`result_state` 与 `field_state` 只允许 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。前五态不得补成 0；只有响应明确返回且语义可确认的零才使用 `true_zero`。

## 3. 假设树

| 假设 ID | 单一可证伪命题 | 错误代价 | 当前证据 | 优先级 |
|---|---|---:|---|---:|
| H-001 |  |  |  |  |

## 4. 实验与验证清单

| 测试 ID | 假设 ID | 动作 | 负责人 | 时长/截止 | 预算 | Success | Watch | Failure | 状态 |
|---|---|---|---|---|---:|---|---|---|---|
| T-001 | H-001 |  |  |  |  |  |  |  | pending |

## 5. 阶段闸门

| 闸门 | 进入条件 | 通过条件 | 失败条件 | 决策人 | 证据位置 | 状态 |
|---|---|---|---|---|---|---|
| G0 数据就绪 |  |  |  |  |  |  |
| G1 市场成立 |  |  |  |  |  |  |
| G2 产品与供应可行 |  |  |  |  |  |  |
| G3 经济成立 |  |  |  |  |  |  |
| G4 上市就绪 |  |  |  |  |  |  |

## 6. 关键路径

| 任务 ID | 前置任务 | 负责人 | 时长或 TBD | 开始条件 | 日期 / T+N / T+TBD | 缓冲或 TBD | 完成证据 |
|---|---|---|---:|---|---|---:|---|
|  |  |  |  |  |  |  |  |

## 7. 阻断项与风险

| 风险 | 触发条件 | 影响 | 责任人 | 缓解动作 | 截止 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 8. 决策记录

| 日期 | 闸门 | 决策 | 证据 | 批准投入 | 下次复查 | 决策人 |
|---|---|---|---|---:|---|---|
|  |  |  |  |  |  |  |
