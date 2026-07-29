<!--
文件功能：提供趋势序列对齐、完整期间判断、同比环比、季节指数、证据分级和异常处理的可复核方法。
职责边界：这是分析方法与字段合同，不提供实时数据、固定商业阈值或自动预测模型。
关联关系：由 amazon-demand-seasonality-research 在取数、计算、结论分级与质量复核阶段读取。
-->

# 趋势与季节性研究方法

## 一、证据账本

每一条原始序列至少保留：

| 字段 | 含义 |
|---|---|
| `series_id` | 稳定序列标识，不含隐私 |
| `collection_id` | 集合研究标识；单对象时可为空 |
| `member_id` / `member_role` | 集合成员及其角色 |
| `member_coverage_status` | 该成员的完整、部分、缺失或失败状态 |
| `source_type` | `sif_mcp`、`user_input`、`upstream_output` 或 `agent` |
| `source_path` / `evidence_id` | 当前来源文件或本层证据定位 |
| `upstream_source_file` / `upstream_evidence_id` | 上游文件与原 Evidence ID；非上游证据写 `not_applicable` |
| `upstream_source_type` | 上游原来源轴；缺失时保留空值并把证据降为 `partial` |
| `upstream_temporal_scope` | 上游原时间轴；缺失时使用 `unknown` |
| `upstream_estimation_status` | 上游原估算轴；缺失时使用 `unknown` |
| `upstream_transformation_type` | 上游原处理轴；缺失时保留空值并把证据降为 `partial` |
| `source_tool` | 实际调用的 SIF 工具名；非 SIF 证据写 `not_applicable` |
| `agent_request_id` / `tool_call_id` | 只取当前 AgentTool 调用上下文暴露的对应真实值；仅当面向本 Agent 的上下文确实未暴露对应字段时写 `not_returned`，非 SIF 证据写 `not_applicable` |
| `provider_request_id` | 只取 SIF 响应明确返回的服务端请求 ID；否则写 `not_returned`，不得复制 AgentTool 本地 ID |
| `parent_input_evidence_ids` | 本次调用参数的直接父证据；若传 `arguments.country`，必须包含该站点值的直接 Evidence ID |
| `raw_result_locator` | 原始 SIF 结果在 `temp/` 的位置 |
| `marketplace` | Amazon 站点 |
| `object_type` | `keyword`、`keyword_set` 或 `asin_set` |
| `object_id` | 关键词、关键词集合或 ASIN 集合 ID |
| `metric` | 原始字段名 |
| `metric_meaning` | 运行时 schema 对字段的说明 |
| `period_start` / `period_end` | 该值覆盖的期间 |
| `granularity` | `day`、`week` 或 `month` |
| `value` / `unit` | 原始值和单位 |
| `temporal_scope` | `current`、`historical`、`future`、`mixed`、`not_applicable` 或 `unknown` |
| `estimation_status` | `reported`、`estimated`、`forecast`、`mixed`、`not_applicable` 或 `unknown` |
| `transformation_type` | `reported`、`normalized`、`calculation`、`coding`、`inference` 或 `hypothesis` |
| `query_id` | 指向查询日志 |
| `coverage_status` | `complete`、`partial`、`not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted` 或 `true_zero` |
| `notes` | 口径、异常或缺失说明 |

不得只保留画图后的汇总值。派生结果必须能回到这些原始列，并直接列出 `parent_evidence_ids`。普通 SIF 调用若传 `arguments.country`，该值必须绑定直接父 Evidence ID 并写入 `parent_input_evidence_ids`；没有直接父证据就不调用，目标非 US 且实时 schema 不支持时停止分支。上游证据在本层使用 `source_type=upstream_output`，同时保留上游谱系字段；不得伪装成本次 MCP 调用。原始 SIF 固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`。`reported` 不等于 Amazon 一方观测；业务数值的 schema 未说明估算性质时使用 `estimation_status=unknown`。

### 集合扇出

当工具参数只接受单个关键词或 ASIN：

1. 为每个成员创建独立 `query_id`；
2. 每个成员保留一条原始序列，不先求和或平均；
3. 记录成员实际覆盖起止、缺失期间与失败状态；
4. 只有指标、单位、粒度、期间和成员角色可比时，才生成 `source_type=agent`、`transformation_type=calculation` 的集合级结果；
5. 集合构成变化时建立结构断点，不能把成员加入/退出解释为自然需求变化。

## 二、完整期间

### 判定顺序

1. 根据运行时字段确认期间是自然日、自然周、自然月还是滚动窗口。SIF 自然周以周日为起点，且当周数据存在 T+1 延迟；只有当次机器 schema 明确支持相应近 7 天参数时，才使用该 `recent7` 口径研究当前阶段，并与完整历史周分列。
2. 检查开始与结束日期是否覆盖整个期间。
3. 检查工具是否明确返回“近 30 天”等滚动口径。
4. 检查当期是否仍未结束。
5. 检查序列内部是否存在缺日、缺周或缺月。

`近 30 天` 不能直接标成某个自然月。未结束的自然月不能与完整自然月直接环比。

### 缺失与零

- `0` 只有 schema 明确表示真实零值时才保留为零；
- `null`、字段缺失、未覆盖和调用失败统一不得改成零；
- 如果聚合所需的子期间不完整，聚合结果标记 `partial`；
- 不使用线性插值填补商业结论所依赖的缺口。

## 三、序列可比性

比较前逐项核对：

| 维度 | 必须一致或显式归一化 |
|---|---|
| 站点 | 同一 Amazon marketplace |
| 对象 | 同一节点、同义明确的关键词或固定 ASIN 篮子 |
| 指标 | 同一字段定义与单位 |
| 粒度 | 同为日、周或月 |
| 期间 | 同为自然期间或同为滚动窗口 |
| 四轴标签 | 来源、时间范围、估算状态和处理方式必须可比；历史估算不得与未来预测混合 |
| 集合 | ASIN 加入、退出或父子体变化必须记录 |

出现 schema 版本变化、节点重映射或集合变化时，建立 `break_id`。断点两侧可以并列描述，不得无说明计算增长率。

## 四、基础计算

所有公式先处理分母为零或缺失的情况；无法计算时留空并说明。

### 环比或周比

$$
\mathrm{PeriodChange}_t = \frac{x_t - x_{t-1}}{x_{t-1}}
$$

只有相邻两个完整且同口径期间可以计算。

### 同比

月度序列：

$$
\mathrm{YoY}_{y,m} = \frac{x_{y,m} - x_{y-1,m}}{x_{y-1,m}}
$$

周度序列应按工具定义的周编号和年份对齐，并记录跨年第 53 周等特殊情况。

### 滚动基线

根据业务节奏选择 3、4、12 或其他窗口，窗口必须在报告中公开。优先使用滚动中位数抵抗单点异常：

$$
\mathrm{RollingMedian}_t = \operatorname{median}(x_{t-k+1},\ldots,x_t)
$$

不得为了得到期望方向而反复更换窗口。

### 周期内季节指数

先在研究协议中固定周期长度、锚点和位置标签。年度季节性默认采用自然年和自然月；其他周期必须在取数前定义，不能看完曲线再移动锚点。

对每个完整可比周期先按周期中位数归一化：

$$
\mathrm{Index}_{c,p} = \frac{x_{c,p}}{\operatorname{median}(x_{c,1},\ldots,x_{c,P})}
$$

其中 $c$ 是周期，$p$ 是周期内位置，$P$ 是预先固定的周期长度。再对同一周期位置跨周期取中位数：

$$
\mathrm{SeasonalIndex}_{p} = \operatorname{median}_c(\mathrm{Index}_{c,p})
$$

这样得到的是历史相对位置，不是未来销量预测。若数据强烈偏斜，可同时给出均值版本作敏感性检查，但必须说明采用哪个作为主结果。任何部分周期都不能参与周期内归一化。

## 五、季节性证据

### 完整周期等级

| 完整可比周期 | 可支持的最高表述 |
|---|---|
| 少于 1 个 | 短期变化，不评价该周期季节性 |
| 1 个 | 单周期候选高低点 |
| 至少 2 个 | 可以检查重复性，但不自动确认 |

年度月度季节性默认要求两个完整自然年。周季节性或业务周期采用同样逻辑，并且必须先固定周期锚点。原始记录达到 24 个月但只包含一个完整自然年，或包含部分月时，不满足两个完整年度周期。

### 重复性检查

`recurrent_pattern` 至少同时满足：

1. 两个以上完整周期；
2. 候选高点或低点满足研究协议预先规定的位置偏移；
3. 幅度达到研究协议预先规定的业务材料性；
4. 同期变化方向满足预先规定的一致性规则；
5. 移除单一异常点后结论仍成立；
6. 至少一个不同语义的站内指标提供方向支持。

峰位偏移、幅度、一致性、异常敏感性和反证标准由用户业务或取数前的研究协议定义。用户未定义且无法从业务约束确定时，只展示原始差异，最高标记 `recurrent_candidate`。只有单一指标重复、佐证指标不可得时同样停在 `recurrent_candidate`，不能升级为 `recurrent_pattern`。

### 状态机

```text
无研究
  -> not_assessed
有序列但不足一周期
  -> insufficient_history
一个完整周期
  -> single_cycle_candidate
两个以上周期但材料性规则或佐证不完整
  -> recurrent_candidate
两个以上周期且预设规则与不同语义佐证均通过
  -> recurrent_pattern
存在断点、峰值漂移或周期冲突
  -> unstable_or_broken
```

## 六、异常检查

对异常点记录：

- 发生期间；
- 相对滚动基线的偏离；
- 是否为部分期间；
- 相邻值是否回归；
- 其他站内指标是否同步；
- schema、节点或 ASIN 集合是否变化；
- 原因证据等级。

原因等级：

- `confirmed_by_user_evidence`：用户资料直接证明；
- `supported_hypothesis`：多个合法指标一致，但无直接事件证据；
- `unverified_hypothesis`：只有时间巧合或常识推断；
- `unknown`：无法合理判断。

报告不得把节日、促销、缺货、政策或竞争事件写成确定原因，除非合法证据直接支持。

## 七、多指标交叉

推荐把不同指标放在“证据角色”而不是同一分数中：

| 指标角色 | 可说明 | 不可单独说明 |
|---|---|---|
| 类目需求 | 类目层历史需求变化 | 指定产品真实销量 |
| 关键词搜索 | 搜索关注或需求表达 | 购买与利润 |
| 关键词购买 | 工具定义下的购买信号 | 用户真实订单明细 |
| ABA 趋势 | Amazon 搜索排名或量级信号 | 整个市场规模 |
| ASIN 销量趋势 | 指定商品篮子的供应商历史估算 | 整个类目 |

指标一致时只能说“相互支持”；指标冲突时必须展示分歧，不做无依据平均。

## 八、计划窗口倒推

用户提供提前量后，按以下公式倒推：

$$
\mathrm{PreparationStart}
=
\mathrm{HistoricalWindowStart}
-
(\mathrm{ProductionLead}
+\mathrm{TransitLead}
+\mathrm{InboundLead}
+\mathrm{Buffer})
$$

每项提前量都必须来自 `user_input` 或合法上游产物，并逐项记录 `value`、`unit`、`source`、`evidence_id`、`as_of` 和 `approval_status`。只要任一关键提前量缺失或未确认，就输出变量清单和待确认项，不给具体日期。

## 九、最小复核样例

假设三个完整月值为 100、120、90：

- 第二个月环比应为 $(120-100)/100=20\%$；
- 第三个月环比应为 $(90-120)/120=-25\%$；
- 若上一年同月缺失，则这三个月都不能计算同比；
- 只有一个年度片段时，不能称为“每年旺季”。

在正式交付前，从结果中抽取至少一条环比、一条同比和一个季节指数手工代回，确保公式、分母和期间正确。

## 十、质量清单

- 原始字段和派生字段分列；
- 期间完整性可见；
- 当前部分期间被隔离；
- 历史、预测和用户数据未拼接；
- 节点、关键词和 ASIN 集合没有静默改变；
- 异常原因以证据等级表达；
- 至少两个周期才可能标记重复季节性；
- 计划窗口的每项提前量都有来源；
- 所有结论都能指向序列行和查询日志。
