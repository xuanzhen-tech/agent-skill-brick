<!--
文件功能：提供账号健康评估范围、指标、阈值、趋势、问题、行动和用户沟通模板。
职责边界：模板不拉取账号数据或运行监控；占位阈值不得作为 Amazon 当前规则。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/account-health-evidence-contract.md。
-->

# Amazon 账号健康评估

## A. 评估范围

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account_scope_id_masked/marketplace` | `<values>` |
| `snapshot/metric period/timezone` | `<values>` |
| 评估截至时间 | `<as-of>` |
| 本次限制 | `<missing data / scope limits>` |

## B. 快照

| Snapshot ID | 文件/截图定位 | 材料类型 | 快照时间 | 指标期间 | 时区 | 覆盖说明 |
|---|---|---|---|---|---|---|
| `<id>` | `<path>` | `<完整导出/截图/人工摘录>` | `<time>` | `<period>` | `<tz>` | `<coverage>` |

## C. 指标

| 指标 | 定义 | 分子 | 分母 | 单位 | 平台值 | 重算值 | 直接依据 | 结论/缺口 |
|---|---|---:|---:|---|---:|---:|---|---|
| `<name>` | `<definition>` | `<value/missing>` | `<value/missing>` | `<unit>` | `<value>` | `<value/无法计算>` | `<path/row>` | `<bounded conclusion>` |

## D. 阈值依据

| 阈值依据原文位置 | Policy ID | Marketplace | Publication/Effective | Metric Definition | Value/Condition | Scope | Confirmed By | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<file/path/paragraph>` | `<id>` | `<site>` | `<dates>` | `<definition>` | `<value>` | `<scope>` | `<owner>` | `<limits>` |

## E. 趋势

| 指标 | 基线/对比快照 | 是否可比及原因 | 变化 | 有限解释 | 下一次需要的证据 |
|---|---|---|---|---|---|
| `<name>` | `<snapshots>` | `<reason>` | `<value/不计算>` | `<bounded note>` | `<next evidence>` |

## F. 问题与行动

| 问题 | 直接观察与依据 | 阈值判断 | 影响范围 | 数据缺口 | 路由 | 建议行动 | Owner | 执行证据 |
|---|---|---|---|---|---|---|---|---|
| `<issue>` | `<observation + source>` | `<with basis/unknown>` | `<impact>` | `<gap>` | `<RCA/09/11/POA>` | `<action>` | `<owner>` | `<none/user stated/verified>` |

## G. 用户沟通

- 本次能回答：
- 本次不能回答：
- 需要用户补充：
- 建议下一次复核时间与材料：

## H. 质量门

- [ ] 账号、站点、期间和快照明确
- [ ] 指标定义、分子、分母和单位完整
- [ ] 零/缺失分母为 not_computable
- [ ] 阈值来自带日期依据
- [ ] 趋势只比较同口径快照
- [ ] 未调用 SIF，且任何供应商观察均未作为账号事实
- [ ] 无 SP-API、登录、监控或告警
- [ ] 行动未冒充执行
- [ ] 敏感信息已掩码
- [ ] 未返回、解析失败和真实零值没有混写
- [ ] 正式文件位于 `outputs/`
- [ ] 未调用 `sif_mcp`、`sellersprite_mcp`、`sorftime_mcp`
- [ ] 未用公共商品/市场观察证明账号健康、通知、阈值或整改状态
- [ ] 所有重算、趋势判断和建议均说明直接依据，未伪装成平台原始事实
