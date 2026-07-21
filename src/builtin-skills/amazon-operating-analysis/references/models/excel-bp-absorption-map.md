# Excel 财务 BP 吸收映射

## 覆盖原则

`跨境电商创业财务模型_v2.xlsx` 是本轮立项 BP 的唯一原型版本。吸收目标不是复制 Excel UI，而是把每张表、每类变量、费用项、公式族、图表和业务提示落到 Agent 知识、计算器、输出模板或差异清单。

## 最终验收口径

只有同时满足以下条件，才允许声明 `fully_absorbed = true`：

- 非空业务内容覆盖率 = 100%。
- 公式单元覆盖率 = 100%。
- 公式族归属率 = 100%。
- 费用项明细覆盖率 = 100%。
- 图表输出覆盖率 = 100%。
- 业务说明/参考范围/关键洞察规则化覆盖率 = 100%。
- `blocked = 0`。
- 所有已知公式差异均进入审批清单，并在 calculator `formula_notes` 和 golden tests 中可追溯。
- 核心经营问法 eval 通过。
- 独立复核无 P0/P1 遗漏。

## 工作表映射

| Excel 工作表 | 吸收位置 | Agent 能力 |
|---|---|---|
| 总览仪表盘 | `dashboard-summary.md`、calculator `consultant_draft` | 输出 KPI、关键洞察、风险提示和报告/PPT 初稿素材。 |
| 参数面板 | `financial-model-variable-map.md`、`financial-concepts.md`、calculator 默认输入 | 售价、汇率、采购、FBA、佣金、ACoS、退货、固定费用、销量爬坡。 |
| 一次性启动费用 | `startup-cost.md`、calculator `startup_cost` | 注册资质、品牌设计、首批采购、首批物流、工具软件的最低/最高/中间值。 |
| 月度运营费用 | `monthly-opex.md`、calculator `monthly_opex` | 平台固定、佣金扣费、采购补货、广告营销、人员办公、售后合规。 |
| 单品利润模型 | `unit-economics.md`、calculator `unit_economics` | 单件贡献利润、成本瀑布、月度贡献利润、回本暂估。 |
| 12个月现金流预测 | `cashflow-forecast.md`、`sales-ramp.md`、calculator `cashflow` | 销售、回款、采购、物流、平台、FBA、广告、人员、其他费用、期末现金。 |
| 敏感性分析 | `sensitivity-breakeven.md`、calculator `sensitivity_breakeven` | 售价×销量矩阵、ACoS 敏感性、退货率敏感性、盈亏平衡。 |

## 图表映射

| Excel 图表 | 吸收位置 | 输出形态 |
|---|---|---|
| 一次性启动费用构成 | `startup_cost_by_category` | 饼图/结构表数据。 |
| 月度各类费用对比 | `monthly_opex_by_category` | 柱状图/结构表数据。 |
| 固定费用 vs 变动费用 | `fixed_vs_variable_opex` | 饼图/占比数据。 |
| 单件成本构成 | `unit_cost_breakdown` | 瀑布表/柱状图数据。 |
| 售价构成 | `price_composition` | 成本 vs 单件贡献利润。 |
| 12个月现金流趋势 | `cashflow_trend` | 现金流入、现金流出、净现金流、现金余额折线数据。 |
| 月度支出构成 | `monthly_cash_outflow_breakdown` | 启动、采购、物流、平台、FBA、广告、人员、其他费用。 |
| ACoS vs 单件净利润 | `acos_sensitivity` | ACoS 到单件贡献利润/利润率。 |
| 退货率 vs 月净利润 | `return_rate_sensitivity` | 退货率到月度贡献利润。 |

## 变量与默认值映射

| 变量族 | Excel 默认 | 吸收策略 |
|---|---|---|
| 售价与汇率 | 售价 29.99 USD、汇率 7.2 | 作为模型默认假设，正式测算需用户确认。 |
| 商品成本 | 采购 35 CNY、国内运输 2 CNY、头程 8 CNY、重量 0.5kg | 采购为 M0，物流和重量为 M1/M2。 |
| FBA 与平台 | FBA 配送 5.5 USD、仓储 0.5 USD、佣金 15%、支付 1% | 可暂用模型默认，必须披露。 |
| 广告与退货 | ACoS 25%、广告出单占比 50%、退货率 5%、损失比 50% | 高影响假设，默认即降级。 |
| 运营规模 | 稳定销量 300 件/月、Amazon 月费、Shopify 月费、人员办公社保 | 稳定销量为场景假设，固定费用需确认是否进入项目。 |
| 12个月销量爬坡 | 0%、25%、50%、65%、80%、100%、115%、125%、130%、140%、150%、165% | 作为基准场景模板，不是市场预测事实。 |
| 启动资金 | 300000 CNY | 只作为期初现金/资金池假设，不等同项目投入。 |

## 公式族映射

| 公式族 | Excel 原型 | 标准吸收口径 |
|---|---|---|
| 单件贡献利润 | 售价逐项扣佣金、FBA、采购、物流、广告、退货、支付、杂费 | 采用 `unit_economics` 标准公式，修正参数面板漏项。 |
| 启动费用中间值 | `(最低 + 最高) / 2` | 保留最低、最高、中间值，默认用中间值。 |
| 月度费用占比 | 费用 / 月销售额 | 修正 Excel 缺括号的占比公式。 |
| 现金流入 | 销售收入后移 | 保留“约 2 周”说明，计算器按原型后移 1 个月并披露。 |
| 季度采购/物流 | 每 3 个月采购未来三个月销量 | 作为 BP 简化假设，进入现金流假设表。 |
| 广告最低消耗 | `MAX(销售额 * ACoS * 广告出单占比, 3000)` | 保留最低广告投入假设并披露。 |
| 盈亏平衡 | 固定成本 / 单件边际贡献 | 标准口径纳入完整固定费用，保留 Excel 原型差异。 |
