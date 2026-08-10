---
contract: module-status-dictionary
version: 1.0.0
cluster: amazon-asin-research-skill-cluster
applies_to: all modules
---
# 模块状态字典

本字典是集群唯一、不可漂移的状态枚举来源。所有子 Skill 的输出状态和总控调度判断必须引用本字典，禁止模块私自新增或改写枚举值。

## 三层状态模型

### 第一层：module_status（模块生命周期状态，总控使用）

| 状态 | 含义 | 总控可消费？ | 触发条件 |
|---|---|---|---|
| not_started | 任务卡已下发但未开始 | 否 | 初始状态 |
| running | 模块执行中 | 否 | 已确认接收任务卡 |
| ready | 所有质量门通过，产物可被下游消费 | 是 | 全部必交产物通过质量门 |
| ready_with_limits | 质量门通过但存在已记录的覆盖/字段限制 | 是（需携带限制） | 部分字段未返回、截断、样本不足但可交付 |
| blocked_data_missing | 关键数据缺失，无法完成核心分析 | 否 | 站点/ASIN/必要字段不可得 |
| blocked_not_comparable | 对象身份或时间口径不可比 | 否 | 跨站点、父子体冲突、期间不齐 |
| blocked_tool_failure | SellerSprite 工具不可用/权限/限流/错误 | 否 | 外层 MCP 或内层 tool 失败 |
| failed_quality_gate | 产生了产物但未通过自有质量门 | 否 | 质量门检查失败 |
| superseded | 被新版本数据集或任务卡取代 | 否 | 总控发出新任务卡覆盖旧任务 |
| not_applicable | 本轮研究不需要此模块 | 不适用 | 研究合同未启用此模块 |

### 第二层：field_status（字段级状态，模块输出使用，仅七个合法值）

| 状态 | 含义 |
|---|---|
| returned_complete | 返回且完整性可确认 |
| returned_partial | 返回但截断/分页不完整 |
| returned_unverified | 返回但字段含义未通过 schema 验收 |
| not_returned | 工具响应中不存在此字段 |
| empty_result | 工具成功但结果明确为空 |
| query_failed | 工具调用失败或超时 |
| not_queried | 本轮未查询此字段 |

注意：empty_result ≠ 业务值为 0；not_returned ≠ 竞品没有此属性。两者混淆属于质量门 FAIL。

### 第三层：claim_status（主张状态，最终报告使用）

| 状态 | 含义 | 措辞要求 |
|---|---|---|
| observed_change | 两个可比快照间确认字段变化 | "SellerSprite 观察到……发生变化" |
| observed_snapshot | 单快照或当前状态记录 | "截至 X 日，SellerSprite 返回……" |
| candidate_mechanism | 多信号一致、时间合理、已检查混杂 | "与……机制一致，为候选解释" |
| anomaly_signal | 多信号异常但原因未证 | "存在需人工复核的异常模式" |
| unverified | 证据不足以形成判断 | "当前证据不能确认/排除……" |
| not_supported | 主动排除某个解释 | "现有证据不支持……" |
| requires_first_party | 需要一方数据才能继续 | "需……报表/记录方可验证" |

## 禁止行为

- 模块不得自创 module_status 枚举值
- field_status 不得缩减为 ok/failed/missing 三元组
- claim_status 不得使用 confirmed/proven/caused_by 等因果词（L4 仅在有第一方/实验证据时可用，且仍需引用本字典中的 claim_status）r
