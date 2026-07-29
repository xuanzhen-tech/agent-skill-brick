<!--
文件功能：作为 Agent 生成 Deal 日历、就绪账本和责任交接时使用的稳定模板。
职责边界：只约束静态计划字段，不预填活动窗口、资格、费用、报名或提醒状态。
重要关联：由 ../../SKILL.md 写入 outputs/promotion-management/<case-id>/03-deal-calendar/ 前读取或物化；字段语义见 ../../references/deal-calendar-readiness-contract.md。
-->

# Amazon Deal 日历与就绪账本

## 任务摘要

- Case ID：
- Amazon 站点：
- 团队时区：
- 覆盖期间：
- 总体状态：`go | conditional | no_go | tbd | out_of_scope`

## 活动日历

| Event ID | 活动类型 | SKU/变体 | 开始 | 结束 | 时区 | 日期状态 | 平台状态 | Owner | 决策 |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  | `TBD` | `TBD` |  | `tbd` | `not_verified` |  | `tbd` |

## Event 详情

### EVENT-001

- 活动来源：
- 规则/资格 Evidence IDs：
- 价格方案：
- 经济评估：
- 库存/履约：
- 素材：
- 预算：
- 合规/审批：
- 提交责任方：
- 决策状态：
- 未完成条件：

## 依赖就绪账本

| Dependency ID | Event ID | 类型 | 上游路径/Evidence ID | 状态 | Owner | 截止日 | 影响 | 复核 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  | `ready / conditional / blocked / tbd` |  | `TBD` |  |  |

## 重叠与冲突

| Conflict ID | Events | 冲突类型 | 输入 Evidence IDs | 影响 | 责任人 | 解除条件 | 状态 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## go/no-go 记录

| Event ID | 价格 | 经济 | 库存 | 素材 | 预算 | 审批 | 窗口/资格 | 最终状态 | 理由 |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |

## 双层证据账本

### 来源证据层

| Source Evidence ID | 来源/路径 | 原字段/值 | 时间 | 上游 Evidence ID | 四轴 | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### 派生日历层

| Decision Evidence ID | Event/Dependency ID | 输入 Evidence IDs | 编码/规则 | 状态 | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 责任交接

| 未完成事项 | Owner | 截止日 | 所需证据/动作 | 复核人 | 对决策影响 |
|---|---|---|---|---|---|
|  |  | `TBD` |  |  |  |

## 能力声明

- 本日历未报名、提交、修改或取消 Amazon 活动。
- 本 Skill 未创建提醒、Cron、后台监控或自动告警。
- `go` 只表示内部证据闸门通过，不表示平台已接受。
