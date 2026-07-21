# 确定性计算器交接规则

## 原则

经营分析是顾问层。需要可审计事实时，把事实生成交给确定性计算或核算技能。

## 已有确定性资产

| 资产 | 使用场景 | 不用于 |
|---|---|---|
| `amazon-sku-profit-summary` | Amazon 交易风格的 SKU/MSKU/FNSKU 利润归因和工作簿生成。 | 新品假设和未来场景。 |
| `amazon-inventory-ledger-summary` | Amazon 库存分类账数量事实、库存动作和闭环。 | 没有成本口径的库存金额估值。 |
| `amazon-sku-profit-reconciliation` | SKU 利润后的证据校验和工作簿读回。 | 事实不存在时的经营建议。 |
| `amazon-sku-profit-health-monitor` | 已有可信 SKU 利润和库存事实后的历史 SKU 诊断。 | 立项 BP、未来预测或通用经营 BP。 |

## 经营分析财务 BP calculator

运行时位置：`packages/tools/src/anxin_tools/operating_analysis`。

Agent 不得手算关键财务指标；只负责资料反推、调用 calculator、解释结果和控制结论等级。calculator 必须先输出明细项，再输出汇总项，保证费用、现金流和图表数据可追溯。

| 模块 | 使用场景 |
|---|---|
| `unit_economics` | 单件收入、佣金、FBA、采购、物流、广告、退货、支付手续费、其他杂费。 |
| `startup_cost` | 注册资质、品牌设计、首批采购、首批物流、工具软件。 |
| `monthly_opex` | 平台固定、佣金扣费、采购补货、广告营销、人员办公、售后合规。 |
| `cashflow` | 12 个月销售、回款、采购、物流、平台、FBA、广告、人员、其他费用、期末现金。 |
| `sensitivity_breakeven` | 售价×销量、ACoS、退货率、盈亏平衡销量/销售额/安全边际。 |
| `calculate_inventory_capital_risk` | 库存快照、库存 ledger、FBA/海外仓/在途/工厂未提货的库存资金占用、库龄、动销、仓储费侵蚀和清货优先级。 |
| `calculate_operating_forecast` | 基于历史基线或经营计划生成保守/基准/乐观销量、销售额、贡献利润、广告预算、采购需求和库存约束。 |
| `calculate_real_cashflow_forecast` | 经营期真实现金流，区分订单收入、平台结算、reserve/冻结款、银行到账、采购付款、物流付款、广告、固定费用和税费。 |
| `calculate_historical_operating_review` | 复用可信 SKU 利润事实，输出历史利润复盘、成本结构、SKU 拖累排行、异常费用、无法归因项目和利润桥。 |
| `calculate_cost_structure_analysis` | 解释钱主要花在哪、费用性质、固定/变动/一次性/现金支出口径、异常费用、ROI 和降本空间。 |
| `calculate_slow_moving_inventory_decision` | 比较继续持有、低价清仓、Outlet/站外 Deal、移除、销毁的现金回收和损失。 |
| `calculate_multi_factor_sensitivity` | 计算汇率、运费、ACoS、退货率、采购价、平台费、税费单因素和多因素同时波动的利润影响。 |
| `calculate_weighted_breakeven` | 计算单 SKU、多 SKU 加权、冷启动期和成熟期固定成本口径下的 BEP。 |

公开结果字段固定为：`conclusion_level`、`inputs`、`assumptions`、`missing_materials`、`metrics`、`tables`、`chart_data`、`formula_notes`、`warnings`、`consultant_draft`。

calculator 输出是顾问底稿素材，不是未经复核的正式报告。

## 交接前必须说明

1. 当前业务问题。
2. 需要生成的事实。
3. 已有源文件或缺失文件。
4. 粒度、期间、币种和平台店铺。
5. 该事实将如何被经营分析使用。

## 交接后规则

计算器输出是证据，不是最终管理建议。最终建议仍由经营分析技能结合假设、风险和结论等级输出。
