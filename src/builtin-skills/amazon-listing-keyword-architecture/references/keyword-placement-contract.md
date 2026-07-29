<!--
文件功能：提供 Listing 关键词字段分配、证据优先级、冲突状态和下游交接的详细合同。
职责边界：只定义可复核的布局记录方式，不提供固定关键词阈值、站点字符限制或市场研究方法。
重要关联：由 ../SKILL.md 在字段布局前读取；正式字段与状态应落入 ../assets/templates/keyword-architecture-plan-template.md 对应产物。
-->

# 关键词布局合同

## 一、证据优先级

同一个词存在多份资料时，不能只取数值最大的来源。按以下问题逐层判断：

1. 是否属于同一站点、语言和产品；
2. 是否属于同一父体或子体口径；
3. 期间和时间粒度是否可比；
4. 字段含义及估算属性是否清楚；
5. 产品事实是否允许该词表达；
6. 上游产物是否能追溯到证据 ID 和原始字段。

不能满足可比性时保留多条记录，并把综合状态标为 `conflicted` 或 `blocked`。

## 二、关键词记录

每个原始关键词至少记录：

| 字段 | 含义 |
|---|---|
| `keyword_id` | 本任务内稳定 ID |
| `raw_keyword` | 来源原词，不覆盖 |
| `normalized_keyword` | 仅用于匹配的规范化形式 |
| `marketplace` | Amazon 站点 |
| `language` | 原词语言 |
| `intent_tags` | 核心类目、属性、场景、问题或品牌等标签 |
| `product_fact_ids` | 允许该词进入 Listing 的事实证据 |
| `evidence_ids` | 搜索、流量、购买或用户优先级证据 |
| `evidence_tier` | `required`、`supporting`、`candidate`、`excluded` 或 `blocked` |
| `review_status` | `ready`、`needs_review` 或 `blocked`；与证据等级分开 |
| `target_field` | `title`、`bullet`、`description`、`backend_term` 或 `unplaced` |
| `placement_purpose` | 该字段使用此词的具体目的 |
| `repeat_status` | `unique`、`justified_repeat` 或 `redundant_repeat` |
| `risk_flags` | 品牌、宣称、变体、含义或堆砌风险 |

数值证据的来源、期间、单位、估算属性和转换不塞进同一个状态字段，必须通过四轴与证据账本保留。

## 三、字段选择

### 标题

仅放入能清楚识别产品、主要用途或高确定性差异的词。一个词即使有较强搜索证据，如果会误导产品身份、变体或适用范围，也不得进入标题。

### 要点

只有当产品事实能支撑对应属性或利益时才放置。不要为了覆盖词而创建不存在的功能、认证、材质、兼容性或结果保证。

### 描述

用于需要上下文说明的场景、长尾和条件。描述不能充当风险宣称的藏身位置。

### 后台词

这里只输出候选规划。不得声称已写入 Seller Central、已索引或已生效。格式、长度或重复规则未经当前政策证实时，标记 `policy_check_required`。

## 四、冲突处理

| 冲突 | 处理 |
|---|---|
| 市场证据强，但产品不匹配 | `excluded`，产品事实优先 |
| 上游结果期间陈旧 | 保留历史证据，整体状态 `stale` |
| 同一词在不同通道方向冲突 | 并列通道和期间，不平均 |
| 竞品品牌词 | 默认 `excluded`，除非用户提供合法且明确的使用依据 |
| 词义多义 | `evidence_tier=blocked` 且 `review_status=needs_review`，要求上下文或目标含义 |
| 只有用户偏好、无市场证据 | 可标 `candidate`，不得称高需求词 |
| 只有供应商估算、估算属性不明 | `estimation_status=unknown`，降低结论等级 |

## 五、下游交接

交给文案开发 Skill 的每个字段组必须包含：

- 推荐词和可接受变体；
- 对应产品事实 ID；
- 使用目的；
- 证据等级；
- 必须避免的误导含义；
- 是否允许跨字段重复；
- 未解决风险和需要用户确认的事项。

文案开发可以为了自然语言调整词序或语法，但不能无记录地改变词义、事实或风险状态。

## 六、SIF 原始证据状态

直接 SIF 对象固定 `source_type=sif_mcp`、`transformation_type=reported`，并保存三类 request ID、工具、站点、查询/时间范围、覆盖/分页、估算状态和原始定位。`agent_request_id` 与 `tool_call_id` 仅取当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。

`result_state` 只允许 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`。前五项不能解释为零搜索量、零流量、零竞争或无关键词；只有本次目标字段有明确零证据时才可用 `true_zero`。
