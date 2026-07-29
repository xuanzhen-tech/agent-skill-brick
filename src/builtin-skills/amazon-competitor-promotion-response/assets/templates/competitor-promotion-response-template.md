<!--
文件功能：作为 Agent 生成竞品促销快照、可比差异与受利润约束响应方案时使用的稳定模板。
职责边界：只约束按需分析字段，不预填竞品、促销状态、监控、告警或自动改价动作。
重要关联：由 ../../SKILL.md 写入 outputs/promotion-management/<case-id>/05-competitor-response/ 前读取或物化；字段语义见 ../../references/competitor-promotion-snapshot-contract.md。
-->

# Amazon 竞品促销响应

## 任务摘要

- Case ID：
- Amazon 站点：
- 我方 SKU/ASIN/变体：
- 竞品集合版本：
- 分析类型：`cross_section | change | baseline`
- 总体状态：`cross_section_ready | change_ready | baseline_created | not_comparable | partial | parse_failed | blocked | out_of_scope`

## 上游优先级

| 上游 | 路径/版本 | Evidence IDs | 使用内容 | 陈旧/限制 |
|---|---|---|---|---|
| 第 13 变化分析 |  |  |  |  |
| 第 02 竞品情报 |  |  |  |  |

## 竞品快照

| Snapshot ID | ASIN/变体 | 卖家/履约 | 商品单位 | 观测时间/时区 | 价格/币种 | Deal/Coupon | 字段状态 | 来源 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 可比性

| 快照对 | 商品 | 卖家/履约 | 币种/口径 | 字段语义 | 时间 | 集合版本 | 结果 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `comparable / partially_comparable / not_comparable` |

## 横截面或差异

| Competitor | 指标 | Earlier | Later/Current | 绝对差 | 相对差 | 状态 | 限制 |
|---|---|---:|---:|---:|---:|---|---|
|  |  |  |  |  |  |  |  |

单次快照在本节只填写 Current，不使用变化措辞。

## 我方响应闸门

| Response ID | 竞品 Evidence IDs | 我方价格/底线 | 经济状态 | 触发 | 解除 | 候选响应 | 决策 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `保持 / 观察 / 有限折扣评估 / 消息或日历调整 / 不响应` | `go / conditional / no_go / tbd` |

## 双层证据账本

### 来源快照层

| Source Evidence ID | Snapshot ID | 来源/查询 | 原字段/值 | 时间 | 四轴 | 解析状态 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

若来源为 `sif_mcp`，同一来源对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、覆盖/分页、`estimation_status`、`transformation_type=reported` 和 `raw_result_locator`。

### 派生响应层

| Decision Evidence ID | 输入 Evidence IDs | 可比性/公式 | 结果 | 响应状态 | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 缺口与下一步

| 缺口 | 当前状态 | 所需证据 | 责任方 | 允许的下一步 |
|---|---|---|---|---|
|  |  |  |  |  |

## 能力声明

- 单次快照不支持变化结论。
- 解析失败、未返回和未查询不代表零、不存在或下架。
- 本 Skill 未创建持续监控、告警、动态调价或自动响应。
