<!--
文件功能：提供 Amazon 多站点市场进入评估正式报告的可复制结构。
职责边界：模板不包含真实市场数值、汇率、税费、合规或最终 Go；只填入 SIF、用户和可信上游的可追溯证据。
关联关系：由 ../../SKILL.md 正式交付阶段使用；证据和跨站口径见 ../../references/。
-->

# Amazon 市场进入评估

## 1. 决策问题

- Case ID：
- 产品/关键词主题：
- 候选 Amazon 站点：
- 决策用途：
- 目标期间：
- 用户硬约束：
- 结论边界：仅用于下一轮验证，不是投资或备货 Go

## 2. 逐站研究单元

| 站点 | topic_id | 原始/本地化种子词 | 期间与粒度 | 证据状态 |
|---|---|---|---|---|
|  |  |  |  |  |

## 3. 逐站评估

### 站点：

| 维度 | Evidence IDs | 正证据 | 反证 | 六态缺口 | 判断 |
|---|---|---|---|---|---|
| 关键词需求 |  |  |  |  |  |
| 趋势（相邻专业输出优先） |  |  |  |  |  |
| 关键词竞争与竞品 |  |  |  |  |  |
| ASIN 销量/流量背景 |  |  |  |  |  |
| 关键词入口（相邻专业输出优先） |  |  |  |  |  |
| 外部经营就绪 |  |  |  |  |  |

- 站内状态：advance_for_validation / watch / avoid_for_now / blocked
- 会改变结论的下一条证据：

## 4. 跨站可比性

| 比较项 | 站点范围 | 可比性 | 差异来源 | 允许的解读 |
|---|---|---|---|---|
|  |  | comparable / limited / not_comparable |  |  |

## 5. 原币与汇率边界

| 站点 | 实际返回原币字段 | 本地币种 | 汇率状态 | 可否跨站数值比较 |
|---|---|---|---|---|
|  |  |  | missing / user_confirmed / upstream_ready |  |

## 6. 非 SIF 缺口

| 站点 | 汇率 | 税费 | 合规 | 物流 | 文化/本地化 | 单位经济 | 团队能力 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 7. SIF 请求谱系

| Evidence ID | source_tool | agent_request_id | tool_call_id | provider_request_id | marketplace | temporal_scope | coverage_or_pagination | parent_input_evidence_ids | raw_result_locator |
|---|---|---|---|---|---|---|---|---|---|
|  |  | `not_returned` | `not_returned` | `not_returned` |  |  |  |  |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`。

## 8. 验证优先级

| 优先级 | 站点 | 当前状态 | 下一验证 | 负责人 | 预计证据成本 | 停止条件 |
|---:|---|---|---|---|---:|---|
|  |  |  |  |  |  |  |

## 9. 结论与边界

- 可进入下一轮验证的站点：
- 继续观察的站点：
- 当前避免的站点：
- 阻断或超范围站点：
- 四轴、对象血缘和六态：
- SIF `reported` 不等于 Amazon 官方观测：
- 未虚构类目树、node ID、价格带或新品份额：
- 未经可追溯汇率没有换算金额：
- 税费、合规、文化、物流和单位经济缺口未被市场数据替代：
- 本报告不批准投资、备货或上市：
