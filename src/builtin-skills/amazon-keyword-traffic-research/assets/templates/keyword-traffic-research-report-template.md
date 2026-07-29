<!--
文件功能：提供关键词与流量研究的正式报告结构，分列市场关键词、ASIN 关键词、Listing 流量和广告可见结构。
职责边界：模板不提供默认阈值、广告架构、订单归因或 Listing 文案。
关联关系：由 ../../SKILL.md 的正式交付阶段使用，通道语义见 ../../references/keyword-channel-separation-contract.md。
-->

# Amazon 关键词与流量研究报告

## 1. 任务边界

- Case ID：
- Amazon 站点：
- ASIN/产品主题：
- 父子体口径：
- 研究期间与粒度：
- 请求通道：`market_keyword | asin_keyword | listing_traffic | ads_visible`
- 用户目标：
- 本次假设：

## 2. 数据准备状态

| 通道 | 实际 SIF 工具 | 状态 | 时间/覆盖 | 缺口 |
|---|---|---|---|---|
| 市场关键词 |  |  |  |  |
| ASIN 关键词 |  |  |  |  |
| Listing 流量 |  |  |  |  |
| 广告可见结构 |  |  |  |  |

## 3. 市场关键词

| 原始关键词 | 需求/历史字段 | 竞争字段 | 时间范围 | 估算状态 | Evidence IDs | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 4. ASIN 关键词

| ASIN | 原始关键词 | 信号/ABA/分布字段 | 时间范围 | 估算状态 | Evidence IDs | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 5. Listing 流量

| ASIN | 概览/结构/趋势字段 | 时间范围 | 粒度 | 覆盖 | Evidence IDs | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 6. 广告可见结构

| ASIN | 层级 | 供应商可见字段 | 上游 SIF ID | 时间范围 | Evidence IDs | 解释上限 |
|---|---|---|---|---|---|---|
|  | asin/campaign/ad_group/keyword |  |  |  |  |  |

> 本节不是广告账户、Search Term Report、花费、订单、ACoS、ROAS 或归因收入审计。

## 7. 跨通道矩阵

| 原始关键词 | 规范化词 | 市场 | ASIN | Listing 流量 | 广告可见 | 分类 | 可比状态 |
|---|---|---|---|---|---|---|---|
|  |  | present/not_returned/not_queried | present/not_returned/not_queried | present/not_returned/not_queried | present/not_returned/not_queried |  | ready/conflicted/blocked |

## 8. 研究发现

| 优先级 | parent_evidence_ids | Agent 推断 | 反证/限制 | 下一条 SIF/用户/上游证据 |
|---:|---|---|---|---|
| 1 |  |  |  |  |

## 9. SIF 请求谱系

| Evidence ID | source_tool | agent_request_id | tool_call_id | provider_request_id | marketplace | temporal_scope | coverage_or_pagination | parent_input_evidence_ids | raw_result_locator |
|---|---|---|---|---|---|---|---|---|---|
|  |  | `not_returned` | `not_returned` | `not_returned` |  |  |  |  |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`。

## 10. 冲突与六态缺口

| 问题 | field_state | 当前结论上限 | 可解除条件 |
|---|---|---|---|
|  | not_returned/not_queried/parse_failed/missing/conflicted/true_zero |  |  |

## 11. 结论边界

- 本报告能证明：
- 本报告不能证明：
- 四轴与对象血缘：
- 样本、分页和期间限制：
- 不提供广告账户、订单归因、广告执行或 Listing 文案：

## 12. 下一步

| 优先级 | 研究对象 | 需要补充的证据 | 建议后续能力 |
|---:|---|---|---|
| 1 |  |  | 竞品情报 / 候选验证 / 人工运营判断 |
