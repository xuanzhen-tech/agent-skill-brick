<!--
文件功能：提供 snapshot_reverse 路由的正式竞品快照报告结构，确保集合、四轴证据、逆向结论和缺口同时交付。
职责边界：模板不提供任何数据、阈值或结论；使用时复制到 outputs/ 并删除不适用占位符，每个字段必须独立填写四轴。
关联关系：由 ../../SKILL.md 的当前快照逆向模式使用，字段与证据口径遵循 ../../references/sif-competitor-evidence-contract.md。
-->

# Amazon 竞品当前快照与逆向报告

## 1. 任务边界

- Case ID：
- 路由：`snapshot_reverse`
- Amazon 站点：
- 主 ASIN：
- 币种：
- 父子体口径：
- 数据期间：
- 用户目标：
- 本次假设：

## 2. 数据准备状态

| 能力 | 实际工具 | 状态 | 样本/期间 | 缺口 |
|---|---|---|---|---|
| 关键词与竞品发现 |  |  |  |  |
| ASIN profile |  |  |  |  |
| 销量/流量/关键词结构 |  |  |  |  |
| 上游 VOC（可选） | `amazon-review-voc-research` 正式输出 |  |  |  |
| 上游关键词流量（可选） | `amazon-keyword-traffic-research` 正式输出 |  |  |  |

> VOC 只作为可选上游证据读取；SIF 当前无评论正文能力。关键词或流量专题若已有相邻 Skill 正式输出，应复用证据，避免重复调用。

### 上游证据谱系

| 本层 Evidence ID | 上游来源文件 | 上游 Evidence ID | upstream_source_type | upstream_temporal_scope | upstream_estimation_status | upstream_transformation_type | 状态 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | ready/partial |

> 上游证据在本层使用 `source_type=upstream_output`。上表保留其原四轴；缺失标签不得猜测。

## 3. 竞品集合

| ASIN | 角色 | 纳入理由 | 关键词主题/对象口径 | 数据状态 | Evidence ID |
|---|---|---|---|---|---|
|  | 主 ASIN / 直接竞品 / 邻近参照 / 探索项 |  |  |  |  |

## 4. 当前 SIF 可见指标比较与四轴

| ASIN | 字段/通道 | 原值 | 规范化值 | 单位 | source_type | temporal_scope | estimation_status | transformation_type | Evidence ID | 限制 |
|---|---|---|---|---|---|---|---|---|---|---|
|  | profile / sales / traffic / keyword / ads_visible |  |  |  | sif_mcp/user_input/upstream_output/agent | current/historical/future/mixed/not_applicable/unknown | reported/estimated/forecast/mixed/not_applicable/unknown | reported/normalized/calculation/coding/inference/hypothesis |  |  |

## 5. SIF 可见结构

| ASIN | 可见结构 | 原值/标志 | source_type | temporal_scope | estimation_status | transformation_type | Evidence ID | 限制 |
|---|---|---|---|---|---|---|---|---|
|  | keyword_distribution / traffic_structure / ads_visible |  | sif_mcp/user_input/upstream_output/agent | current/historical/future/mixed/not_applicable/unknown | reported/estimated/forecast/mixed/not_applicable/unknown | reported/normalized/calculation/coding/inference/hypothesis |  |  |

> SIF 可见结构不是 Listing 原文、图片/视频语义、评论正文、后台词、广告账户或因果真相；未返回字段使用六态。

### SIF 请求谱系

| Evidence ID | source_tool | agent_request_id | tool_call_id | provider_request_id | temporal_scope | coverage_or_pagination | parent_input_evidence_ids | raw_result_locator |
|---|---|---|---|---|---|---|---|---|
|  |  | `not_returned` | `not_returned` | `not_returned` |  |  |  |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`。

## 6. 证据化差异

| 优先级 | 当前证据 | 相对差异 | 风险/机会假设 | 反证或限制 | 下一条验证证据 |
|---:|---|---|---|---|---|
| 1 |  |  |  |  |  |

## 7. 不可判断项

| 问题 | 缺失工具/字段 | 为什么不能推断 | 可解除阻塞的证据 |
|---|---|---|---|
|  |  |  |  |

## 8. 结论边界

- 本报告能证明：
- 本报告不能证明：
- 四轴完整性与 `unknown`：
- 上游谱系完整性与 `partial`：
- `reported` 不等于 Amazon 一方观测：
- 历史估算的 `historical + estimated` 组合：
- 样本与分页限制：
- schema 或时效风险：

## 9. 下一步

| 优先级 | 对象 | 所需证据 | 建议后续能力 |
|---:|---|---|---|
| 1 |  |  | 路由至 `amazon-keyword-traffic-research` / 候选验证 / 人工产品复核 |
