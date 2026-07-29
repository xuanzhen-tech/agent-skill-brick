<!--
文件功能：提供 Amazon 需求趋势与季节性正式报告、序列表和期间登记表的可复用交付骨架。
职责边界：模板只定义结构和必填证据位，不预填结论、阈值、日期或业务数字。
关联关系：由 amazon-demand-seasonality-research 复制到 outputs/market-research/<case-id>/03-demand-seasonality/ 后按任务裁剪。
-->

# Amazon 需求趋势与季节性报告

## 0. 任务信息

| 项目 | 内容 |
|---|---|
| `case_id` | |
| 研究日期 | |
| Amazon 站点 | |
| 研究对象 | |
| 关键词主题/ASIN 集合 | |
| 历史期间 | |
| 粒度 | |
| 研究目的 | |
| 用户材料性标准 | |
| 业务提前量 | |

## 1. 执行摘要

### 历史方向

- 结论：
- 适用期间：
- 主证据：
- 反证或冲突：
- 置信限制：

### 季节性

- 证据等级：`not_assessed / insufficient_history / single_cycle_candidate / recurrent_candidate / recurrent_pattern / unstable_or_broken`
- 历史高需求窗口：
- 历史低需求窗口：
- 周期数量：
- 重复性证据：
- 不确定性：

### 计划含义

- 可支持的准备窗口：
- 仍缺失的提前量或事实：
- 不得据此推断的事项：

## 2. 研究协议

| 项目 | 预先约定 |
|---|---|
| 主指标 | |
| 佐证指标 | |
| 完整期间规则 | |
| 滚动窗口 | |
| 周期长度与锚点 | |
| 峰谷允许偏移 | |
| 幅度材料性 | |
| 方向一致性 | |
| 异常敏感性 | |
| 佐证指标要求 | |
| 季节性判断规则 | |
| 异常材料性规则 | |
| 允许的数据源 | SIF MCP、用户对话、`uploads/`、上游 `outputs/` |
| 禁止的数据源 | Web、抓取、其他 MCP/API |

## 3. 数据覆盖

| 序列/成员 | 来源 | 工具/上游路径 | 对象 | 指标 | 期间 | 粒度 | 完整周期数 | 缺失 | 时间范围 | 估算状态 | 变换类型 |
|---|---|---|---|---|---|---|---:|---|---|---|---|
| | | | | | | | | | | | |

## 4. 历史方向

| 指标 | 起点 | 终点 | 中位水平 | 最近窗口 | 更长窗口 | 方向 | 证据行 |
|---|---:|---:|---:|---|---|---|---|
| | | | | | | | |

说明长短窗口是否一致；若不一致，写明为何采用“方向不稳定”。

## 5. 季节性证据

| 月/周窗口 | 跨周期指数 | 出现周期数 | 方向一致性 | 异常敏感性 | 判定 |
|---|---:|---:|---|---|---|
| | | | | | |

### 重复性复核

- [ ] 至少两个完整可比周期
- [ ] 峰谷位置在相近窗口重复
- [ ] 同期方向没有频繁反转
- [ ] 单一异常点不决定结论
- [ ] 佐证指标支持，或已说明不可得/冲突

## 6. 多指标交叉

| 发现 | 关键词需求证据 | ASIN 关键词/ABA 证据 | ASIN 销量/流量证据 | 一致/冲突 | 解释边界 |
|---|---|---|---|---|---|
| | | | | | |

## 7. 异常与结构断点

| 期间 | 异常/断点 | 影响指标 | 数据检查 | 原因等级 | 当前解释 | 下一证据 |
|---|---|---|---|---|---|---|
| | | | | `confirmed_by_user_evidence / supported_hypothesis / unverified_hypothesis / unknown` | | |

## 8. 计划窗口

### 提前量证据

| 变量 | 数值 | 单位 | 来源 | Evidence ID | As of | 用户确认状态 |
|---|---:|---|---|---|---|---|
| 生产提前量 | | | | | | `confirmed / unconfirmed / missing` |
| 运输提前量 | | | | | | |
| 入仓提前量 | | | | | | |
| 缓冲 | | | | | | |

### 倒推结果

| 历史窗口 | 使用的提前量证据 | 倒推公式 | 倒推结果 | 状态 |
|---|---|---|---|---|
| | | | | `ready / blocked` |

若任一关键提前量不完整或未经确认，只保留公式和缺失变量，不填具体日期。

## 9. 情景而非保证

| 情景 | 来源 | 时间范围 | 估算状态 | 变换类型 | Horizon | 假设 | 历史依据 | parent_evidence_ids | 触发信号 | 失效条件 | 用户确认 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 上行 | `agent` | `future` | `not_applicable / unknown` | `hypothesis` | | | | | | | |
| 基准 | | | | | | | | | | | |
| 下行 | | | | | | | | | | | |

当前 SIF 路由不提供正式预测真相。未来情景固定为 `source_type=agent`、`transformation_type=hypothesis`，必须链接历史父证据；当前或历史供应商信号不得直接填入未来情景。

## 10. 限制与下一证据

| 限制 | 对结论的影响 | 可改变结论的下一证据 | 负责人/来源 |
|---|---|---|---|
| | | | |

## 附表 A：`trend-series.csv`

建议字段：

```text
series_id,collection_id,member_id,member_role,member_coverage_status,source_type,source_provider,source_path,evidence_id,parent_evidence_ids,parent_input_evidence_ids,upstream_source_file,upstream_evidence_id,upstream_source_type,upstream_temporal_scope,upstream_estimation_status,upstream_transformation_type,source_tool,agent_request_id,tool_call_id,provider_request_id,raw_result_locator,query_id,marketplace,object_type,object_id,metric,metric_meaning,period_start,period_end,granularity,value,unit,temporal_scope,estimation_status,transformation_type,coverage_status,period_change,yoy,rolling_baseline,seasonal_index,break_id,notes
```

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`。

上游序列在本层使用 `source_type=upstream_output`，并填写全部 `upstream_*` 谱系列；原时间或估算轴缺失时使用 `unknown`，原来源或处理轴缺失时保留空值并把 `coverage_status` 降为 `partial`。

## 附表 B：`period-register.md`

| 期间 | 序列 | 集合成员 | 状态 | 缺失/部分原因 | 是否纳入比较 | 说明 |
|---|---|---|---|---|---|---|
| | | | `complete / partial / not_returned / not_queried / parse_failed / missing / conflicted / true_zero / break` | | | |

## 附表 C：`coverage-and-query-log.md`

| `query_id` | 时间 | 工具 | 参数摘要 | 请求字段 | 返回覆盖 | 状态 | 重试/修正 |
|---|---|---|---|---|---|---|---|
| | | | | | | `ok / partial / empty / tool_error / schema_drift` | |

## 交付前签核

- [ ] 所有正式文件位于 `outputs/`
- [ ] 原始与派生字段可追溯
- [ ] 未结束期间未参与完整期间比较
- [ ] 不足两个完整可比周期时没有声称重复季节性
- [ ] 无预设材料性或不同语义佐证时最高为 `recurrent_candidate`
- [ ] 预测与历史已分开
- [ ] 没有使用 SIF 之外的外部业务数据
- [ ] 没有给无输入支撑的备货数量、日期或最终 Go
