<!--
文件功能：提供跨境货运报价事实、复核过程和可比性结论的正式报告模板。
使用方式：按 ../../SKILL.md 填写，并以 ../../references/freight-quote-comparison-contract.md 为计算和门控依据。
维护边界：模板不询价、不订舱、不追踪，不计算税务清关或完整运输经济。
-->

# 跨境货运方案比较报告

> 所有报价必须来自用户材料。未写明、未返回、条件未知和不可计算都不得填为零。

## 1. 比较任务

| 字段 | 内容 |
|---|---|
| 任务 ID |  |
| 货物批次/版本 |  |
| 计划出运窗口 |  |
| 起运地 |  |
| 目的地 |  |
| 目标服务范围 |  |
| 报告生成时间及时区 |  |

## 2. 原始证据 envelope

| evidence_id | source_type | source_locator | source_version | observed_at | business_time | temporal_scope | estimation_status | transformation_type | raw_value | raw_unit_or_currency | provider_or_owner | limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |

| quote_id | 版本 | 报价方 | 证据 IDs | 签发时间 | 有效期 | 原币 | 报价状态 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 3. 货物基准

| quote_id | 件/箱/托范围 | 尺寸及单位 | 实际重及单位 | 实测/估算 | 起点 | 终点 | 服务段 | 是否同基准 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 4. 原规则转录

| quote_id | 体积重规则/除数 | 计费重规则 | W/M 定义 | 最低收费规则 | 舍入规则 | 证据 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 5. 逐报价复核

| Calculation ID | Quote ID | 项目 | 原规则证据 | 带单位代入 | 舍入 | 结果 | 单位/币种 | 状态 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  | 实际重/体积重/计费重/W-M/最低收费/附加费 |  |  |  |  |  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `calculation` |

## 6. 费用包含与排除

| 费用类别 | 报价原始名称 | 报价 A | 报价 B | 计费基数 | 触发条件 | 是否含税 | 证据/备注 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 7. 时效定义

| quote_id | 原始时效 | 起算事件 | 截止事件 | 自然/工作日 | 班期条件 | 承诺/估算 | 排除项 | 可比性 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 8. 可比性门

| 门 | 报价 A/B 结果 | 关键差异 | 状态 | 最小补充问题 |
|---|---|---|---|---|
| 货物基准 |  |  |  |  |
| 区间与服务 |  |  |  |  |
| 有效期 |  |  |  |  |
| 计费可复核 |  |  |  |  |
| 费用范围 |  |  |  |  |
| 币种 |  |  |  |  |
| 时效定义 |  |  |  |  |

## 9. 比较结论

| 字段 | 内容 |
|---|---|
| 状态 | `COMPARABLE` / `CONDITIONALLY_COMPARABLE` / `INCOMPARABLE` / `BLOCKED_MISSING_QUOTE_RULE` |
| 可直接比较的内容 |  |
| 只能并列展示的内容 |  |
| 不得排名的内容 |  |
| 原因 |  |

> 仅当所有关键可比性门通过时，才填写金额或时效排序。最低报价不自动等于最佳商业方案。

### 正式比较记录

| Comparison ID | 比较范围 | Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | 门结果/差异 | 可比较内容 | 禁止排名 | 结论 |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  |  |

## 10. 派生 record 与双层谱系

| output_id | output_type | object_id | parent_evidence_ids | source_type | temporal_scope | estimation_status | transformation_type | rule_version | generated_at | uncertainty | result_status | reason_codes[] | 规则/结果 | 对象轴 | 时间轴 | 单位/币种轴 | 口径轴 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | `calculation` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `calculation` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |
|  | `comparison` |  |  | `agent` | `current/historical/future/mixed/unknown` | `not_applicable/estimated/unknown` | `comparison/decision` |  |  |  | `ready/ready_with_limitations/blocked/out_of_scope` |  |  |  |  |  |  |

对象、时间、单位/币种和口径列仅为额外比较维度，不能替代两类对象本体的五项血缘字段。

`reason_codes[]` 只允许：`QUOTE_SOURCE_UNVERIFIED | CARGO_BASELINE_CONFLICT | ROUTE_OR_SERVICE_CONFLICT | QUOTE_EXPIRED_OR_UNDATED | QUOTE_RULE_MISSING | CURRENCY_BASIS_MISSING | TRANSIT_DEFINITION_CONFLICT | OUT_OF_SCOPE_REQUEST`。

## 11. 人工下一步与边界

- [ ] 向报价方确认会改变结论的缺失规则。
- [ ] 人工确认计划出运期仍在有效期内。
- [ ] 税率、HS、清关和反倾销交专家 09。
- [ ] 运输经济、利润和最终商业选择交专家 14。
- [ ] 订舱、付款、提货和轨迹跟踪由人工或专用执行系统完成。

本报告不使用 17TRACK 或其他外部来源生成运价，不执行任何运输动作。
