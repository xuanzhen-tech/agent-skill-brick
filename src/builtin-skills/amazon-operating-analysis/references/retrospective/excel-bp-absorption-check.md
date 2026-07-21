# 财务 BP 吸收回头检查

## 检查结论

未吸收项：0。

公式差异均已解释并纳入标准口径。

## 覆盖状态

| 检查对象 | 状态 | 位置 |
|---|---|---|
| 7 个工作表 | 已吸收 | `excel-bp-absorption-map.md` |
| 参数面板默认值 | 已吸收 | `financial-model-variable-map.md`、calculator 默认输入 |
| 一次性启动费用五大类 | 已吸收 | `startup-cost.md`、`startup_cost` |
| 月度运营费用六大类 | 已吸收 | `monthly-opex.md`、`monthly_opex` |
| 单品利润模型 | 已吸收 | `unit-economics.md`、`unit_economics` |
| 12 个月现金流 | 已吸收 | `sales-ramp.md`、`cashflow-forecast.md`、`cashflow` |
| 敏感性与盈亏平衡 | 已吸收 | `sensitivity-breakeven.md`、`sensitivity_breakeven` |
| 9 张图表 | 已吸收 | `excel-bp-absorption-map.md`、calculator `chart_data` |
| 仪表盘 KPI 和业务提示 | 已吸收 | `dashboard-summary.md`、`business-interpretation.md` |
| 公式差异 | 已吸收 | `known-formula-differences.md`、calculator `formula_notes` |

## 交付门槛

- Excel audit 返回 `blocking_unmapped_items = []`。
- Golden tests 使用 Excel 默认参数覆盖单件、启动费用、月度费用、现金流、敏感性和盈亏平衡。
- Agent 输出必须保留结论等级、假设披露、资料缺口和顾问复核边界。
