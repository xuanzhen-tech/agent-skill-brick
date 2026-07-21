# 公式族映射

## 使用原则

Excel 中 770 个公式单元按公式族吸收。每个公式族必须能追溯到 Excel 原型、标准公式、calculator 和 golden test。Agent 不得自由口算关键财务结果。

| 公式族 | Excel 原型 | 标准公式 | calculator | golden test |
|---|---|---|---|---|
| 单件贡献利润 | `售价 - 佣金 - FBA - 采购 - 物流 - 广告 - 退货 - 支付 - 杂费` | 售价 - 亚马逊佣金 - FBA配送费 - FBA仓储费 - 采购成本 - 国内运输 - 头程国际物流 - PPC广告费 - 退货损失 - 收款手续费 - 其他杂费 | `calculate_unit_economics` | `test_default_unit_economics_uses_standard_corrected_excel_bp_formula` |
| 启动费用中间值 | `(最低预估 + 最高预估) / 2` | 明细项先算中间值，再按类别汇总 | `calculate_startup_cost` | `test_calculator_outputs_excel_expense_items_before_rollups` |
| 启动费用美元等值 | `中间值 / 汇率` | 每个明细项和类别均输出 CNY/USD | `calculate_startup_cost` | `test_calculator_outputs_excel_expense_items_before_rollups` |
| 月度费用占比 | `费用 / 月销售额` | 费用 / (稳定月销量 * 售价 * 汇率) | `calculate_monthly_opex` | `test_default_monthly_opex_absorbs_excel_categories_with_corrected_ratio` |
| 月度费用汇总 | `SUM(明细项)` | 明细项先算，再汇总为平台固定、佣金扣费、采购补货、广告营销、人员办公、售后合规 | `calculate_monthly_opex` | `test_calculator_outputs_excel_expense_items_before_rollups` |
| 销量爬坡 | `稳定销量 * 月度爬坡比例` | 0%、25%、50%、65%、80%、100%、115%、125%、130%、140%、150%、165% | `calculate_cashflow` | `test_default_cashflow_recreates_excel_12_month_cash_timing` |
| 实际回款 | 上月销售收入 | 保留 Excel “约 2 周”说明，月度模型按后移 1 个月 | `calculate_cashflow` | `test_default_cashflow_recreates_excel_12_month_cash_timing` |
| 季度采购/物流 | 每 3 个月采购未来三个月销量 | M1、M4、M7、M10 支付未来三个月采购和头程 | `calculate_cashflow` | `test_default_cashflow_recreates_excel_12_month_cash_timing` |
| 广告最低消耗 | `MAX(销售额 * ACoS * 广告出单占比, 3000)` | 保留最低广告投入假设并披露 | `calculate_cashflow` | `test_default_cashflow_recreates_excel_12_month_cash_timing` |
| 期末现金余额 | `上月余额 + 当月回款 - 当月支出` | 逐月滚动计算最低现金余额和资金缺口 | `calculate_cashflow` | `test_default_cashflow_recreates_excel_12_month_cash_timing` |
| 售价×销量敏感性 | 不同售价变化和销量变化下月利润 | 7×7 场景矩阵 | `calculate_sensitivity_breakeven` | `test_sensitivity_and_breakeven_absorb_excel_ranges_and_standard_fixed_cost` |
| ACoS 敏感性 | ACoS 到单件净利润/月净利润 | ACoS 到单件贡献利润、利润率和月贡献利润 | `calculate_sensitivity_breakeven` | `test_sensitivity_and_breakeven_absorb_excel_ranges_and_standard_fixed_cost` |
| 退货率敏感性 | 退货率到月净利润 | 退货率到单件贡献利润和月贡献利润 | `calculate_sensitivity_breakeven` | `test_sensitivity_and_breakeven_absorb_excel_ranges_and_standard_fixed_cost` |
| 盈亏平衡 | 固定成本 / 单件边际贡献 | 完整固定费用 / 单件贡献利润，并输出保本销售额和安全边际 | `calculate_sensitivity_breakeven` | `test_sensitivity_and_breakeven_absorb_excel_ranges_and_standard_fixed_cost` |
| 仪表盘 KPI | 跨表引用关键指标 | calculator 统一输出 metrics、tables、chart_data、consultant_draft | `calculate_launch_bp` | `test_final_evidence_package_is_machine_readable_and_reviewable` |

## 差异处理

公式族与 Excel 原型不一致时，必须进入 `formula-difference-approval.md`。任何未审批公式差异都视为阻塞项，不能声明 `fully_absorbed = true`。
