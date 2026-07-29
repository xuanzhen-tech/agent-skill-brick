<!--
文件功能：定义用户货运报价的转录、原规则复核、费用桥接和可比性判定合同。
使用方式：由 SKILL.md 在逐报价计算和比较门控时引用。
维护边界：不提供行业默认运价、除数、W/M、税费、清关或经济决策模型。
-->

# 货运报价比较合同

## 1. 统一证据与派生合同

### 原始证据 envelope

| 字段 | 要求 |
|---|---|
| `evidence_id` | 当前任务内唯一 |
| `source_type` | `user_input` / `user_upload` / `trusted_upstream_output`；SIF 或其他外部市场信号不得进入运价/时效计算 |
| `source_locator` | 文件、页/表/单元格或图片区域 |
| `source_version` | 报价来源版本 |
| `observed_at` | 本任务读取时间及时区 |
| `business_time` | 报价签发/适用业务时间及时区 |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `unknown` |
| `transformation_type` | `raw` / `provider_derived` |
| `raw_value` | 原始文本或数字 |
| `raw_unit_or_currency` | 原单位/币种 |
| `provider_or_owner` | 报价方和用户确认责任人 |
| `limitations` | 覆盖、可读性、有效期和适用限制 |

### 派生 record

正式派生对象本体：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 必要载荷 |
|---|---|---|---|---|---|---|---|
| `calculation` | `calculation_id` | 支撑原规则、输入值与舍入的报价 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | 固定 `calculation` | Quote ID、原规则、带单位代入、舍入、结果/单位和状态 |
| `comparison` | `comparison_id` | 支撑可比性与结论的 Evidence/Calculation IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | `comparison` / `decision` | 对象范围、可比性门、差异、允许比较、禁止排名和结论 |

两类对象还必须直接关联 `output_id`、`rule_version`、`generated_at`、`uncertainty`、`result_status` 与 `reason_codes[]`。`result_status` 只允许 `ready` / `ready_with_limitations` / `blocked` / `out_of_scope`；`reason_codes[]` 只允许 `QUOTE_SOURCE_UNVERIFIED` / `CARGO_BASELINE_CONFLICT` / `ROUTE_OR_SERVICE_CONFLICT` / `QUOTE_EXPIRED_OR_UNDATED` / `QUOTE_RULE_MISSING` / `CURRENCY_BASIS_MISSING` / `TRANSIT_DEFINITION_CONFLICT` / `OUT_OF_SCOPE_REQUEST`。

对象、时间、单位/币种和口径仅为额外比较维度，不能替代两类对象本体的五项血缘字段。

## 2. 报价证据最小字段

| 分组 | 字段 | 缺失处理 |
|---|---|---|
| 身份 | 报价 ID、版本、报价方 | 无法唯一识别则阻塞 |
| 时间 | 签发时间、有效期、计划出运期 | 有效性不可确认则条件可比或阻塞 |
| 货物 | 箱/托范围、尺寸、实际重、单位 | 基准不一致则不可比 |
| 区间 | 起点、终点、门/港服务段 | 不一致则不可比 |
| 规则 | 体积重、计费重、W/M、最低收费、舍入 | 会改变金额且缺失则不可计算 |
| 费用 | 基础费、附加费、包含、排除、条件费用 | 未报价不等于零 |
| 时效 | 数值、起止事件、工作/自然日、排除项 | 定义不一致则不可排名 |
| 币种 | 原币、含税状态 | 不同币种默认不排名 |

## 3. 计算记录格式

每一步必须记录：

| 字段 | 说明 |
|---|---|
| `calculation_id` | 唯一标识 |
| `quote_id` | 所属报价版本 |
| `parent_evidence_ids` | 支撑原规则、输入值与舍入的报价 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `not_applicable` / `estimated` / `unknown` |
| `transformation_type` | 固定为 `calculation` |
| `rule_evidence_id` | 原报价规则证据 |
| `input_evidence_ids` | 重量、尺寸、件数等证据 |
| `verbatim_rule_summary` | 不扩展含义的规则摘要 |
| `substitution` | 带单位的代入 |
| `rounding` | 原报价舍入/进位规则 |
| `result` | 复核结果 |
| `result_unit_or_currency` | 单位或币种 |
| `status` | `verified` / `not_computable` / `conflict` |

每项可比性判断与最终比较还必须形成正式 `comparison` 对象：

| 字段 | 说明 |
|---|---|
| `comparison_id` | 本层比较稳定唯一 |
| `comparison_scope` | 报价版本、货物基准、区间、服务范围和比较维度 |
| `parent_evidence_ids` | 支撑判断的 Evidence/Calculation IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | `not_applicable` / `estimated` / `unknown` |
| `transformation_type` | `comparison` / `decision` |
| `gate_results` / `differences` | 逐门结果和关键差异 |
| `allowed_comparisons` / `prohibited_rankings` / `conclusion` | 可比较、禁止排名和结论 |

## 4. 规则决策表

| 项目 | 可以做 | 不可以做 |
|---|---|---|
| 实际重 | 汇总同一范围、同一单位的用户实测值 | 用净重估毛重 |
| 体积重 | 按报价给出的公式、除数和舍入 | 默认 5000/6000 等常数 |
| 计费重 | 按报价明确选择规则 | 默认总取实际重与体积重较大者 |
| W/M | 按报价定义比较单位和范围 | 默认吨/立方米关系 |
| 最低收费 | 按报价给出的适用对象与顺序 | 自定先后或包含范围 |
| 附加费 | 按报价基数、触发条件和币种 | 把条件未知记为零 |

## 5. 费用桥接矩阵

对每一费用类别记录：

- 报价原始名称。
- 规范化展示类别；只用于对齐。
- 是否包含。
- 金额/费率、计费基数和币种。
- 触发条件。
- 最低/最高值。
- 是否含税。
- 是否进入最低收费。
- 证据定位。

规范化类别不能覆盖原始名称。无法确认两个名称等价时保持分列。

费用状态：

- `included`
- `quoted_separately`
- `excluded`
- `conditional_known`
- `conditional_unknown`
- `not_stated`

后四种都不能静默填零。

## 6. 时效桥接

每份报价至少拆解：

| 字段 | 示例性质 |
|---|---|
| 起算事件 | 提货、开航、航班起飞、仓库收货等原文 |
| 截止事件 | 到港、清关完成、签收等原文 |
| 数值/区间 | 保留原值 |
| 日历 | 自然日/工作日/未声明 |
| 班期条件 | 截单、开航频次等 |
| 性质 | 承诺/估算/参考/未知 |
| 排除项 | 清关、查验、天气、旺季等原文 |

只有起止事件、日历和排除范围可对齐时，才能排名时效。

## 7. 可比性评分不是加权分

本合同不使用模糊总分。逐门判断：

1. 货物基准门。
2. 区间与服务门。
3. 有效期门。
4. 计费可复核门。
5. 费用范围门。
6. 币种门。
7. 时效定义门。

任何关键门失败，整体为 `INCOMPARABLE` 或 `BLOCKED_MISSING_QUOTE_RULE`。不能用其他门的“高分”抵消。

## 8. 正向样例

报价 A 明确声明：

- 实际重 80 kg；
- 体积重按指定公式得 96 kg；
- 原规则明确取两者较大；
- 每 kg 单价、逐公斤进位、最低收费和附加费顺序均明确。

可以按 A 的规则复核 96 kg 的计费基础。该结论只属于报价 A，不能套给报价 B。

## 9. 反向样例

- 报价 B 没写体积重除数，于是使用 6000。
- 报价 C 写 W/M，但未定义单位，于是按“1 吨 = 1 方”。
- 报价 D 的燃油附加费待确认，于是记为 0。
- 报价 E 为港到港，报价 F 为门到门，却直接比较总价。
- 报价 G 以开航至到港计时，报价 H 以提货至签收计时，却排名更快。
- 使用 17TRACK 历史轨迹生成运价或时效报价。

以上均必须判为不合格。

## 10. 最小补充问题

不可比时只询问会改变结论的问题，例如：

- “该报价的体积重除数和尺寸单位是什么？”
- “最低收费是否包含燃油附加费？”
- “时效从哪个事件起算，到哪个事件结束？”
- “报价是否覆盖目的仓派送？”
- “条件性费用触发时如何计费？”
- “报价有效期是否覆盖计划出运日期？”
