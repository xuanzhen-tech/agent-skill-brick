<!--
文件功能：定义 Deal 日历事件、日期可信度、依赖、go/no-go闸门和平台状态的记录合同。
职责边界：只规范静态协调与就绪判断，不提供报名、提交、提醒、Cron或自动状态同步实现。
重要关联：由 ../SKILL.md 在事件与闸门设计前读取；正式字段落入 ../assets/templates/deal-calendar-template.md。
-->

# Deal 日历与就绪合同

## 一、事件字段

| 字段 | 含义 |
|---|---|
| `event_id` | 本任务内稳定 ID |
| `marketplace` | Amazon 站点 |
| `product_scope` | SKU/ASIN/变体 |
| `event_type` | 来源中的活动类型原名 |
| `window_start/end` | 已确认或计划窗口 |
| `timezone` | 时间解释 |
| `date_status` | `confirmed`、`estimated`、`tbd` 或 `conflicted` |
| `rule_evidence_ids` | 资格、费用、限制和窗口来源 |
| `platform_status` | 来源明确状态；否则 `not_verified` |
| `owner` | 业务操作责任方 |
| `approver` | go/no-go 审批责任方 |
| `decision_status` | `go`、`conditional`、`no_go` 或 `tbd` |

## 二、依赖记录

每个依赖包含：

- `dependency_id`；
- 类型：价格、经济、库存、素材、预算、合规、审批或提交责任；
- 上游路径与 Evidence ID；
- `ready | conditional | blocked | tbd`；
- 责任人；
- 截止日或 `TBD`；
- 未满足对活动的影响；
- 复核方式。

日历 Skill 不替依赖责任方做判断。

## 三、时间纪律

- 日期+时刻必须附时区；
- 只有日期时保持日级精度；
- 来源为估计时使用 `estimated`；
- 未知时使用 `TBD`；
- 不以文件修改时间代替业务截止日；
- 冲突日期不得平均；
- 过期信息保留历史标签，不静默更新。

## 四、go/no-go

| 状态 | 语义 |
|---|---|
| `go` | 必需闸门均有证据通过；不表示平台已提交 |
| `conditional` | 有明确条件、责任人与截止日 |
| `no_go` | 一个或多个硬闸门失败 |
| `tbd` | 关键规则、日期、资格、责任或证据未知 |

`platform_status=not_verified` 时，即使内部准备完成也不能写“已报名/已上线”。

## 五、冲突

以下冲突单独记录：

- Offer 叠加未知；
- 活动窗口与供应/素材准备不匹配；
- 同一预算被多个活动占用；
- 价格或经济方案版本不一致；
- 日期来源冲突；
- 无明确提交责任方。

冲突记录包含输入 Evidence IDs、影响、责任人和解除条件。

## 六、双层谱系

来源证据层保留通知/上游的原日期和状态；派生日历层保留规范化时间、依赖关系和决策规则。不得覆盖原证据或把 Agent 编码写成平台原始状态。
