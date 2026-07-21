# 问题到模块路由表

## 路由原则

按真实业务问题路由，不按第一个关键词路由。先选择一个主责模块，再按需要加载支撑模块。

| 用户问题 | 主责模块 | 支撑模块 | 说明 |
|---|---|---|---|
| 新品能不能做 | scenarios/launch-bp.md | 资料假设、单件模型、成本结构、敏感性 | 新项目决策，不是历史利润。 |
| 未来 3 个月钱够不够 | scenarios/cashflow-forecast.md | 未来预测、库存风险、成本结构 | 现金进出时点是主问题。 |
| 库存压了多少钱 | scenarios/inventory-risk.md | 成本结构，必要时现金流 | 先算库存事实，再谈资金时间压力。 |
| 卖多少保本 | methods/sensitivity-breakeven.md | 单件模型或立项 BP | 这是方法问题，需要基础模型。 |
| ACoS 到多少会亏 | methods/sensitivity-breakeven.md | 单件模型 | 可承受 ACoS 属于敏感性。 |
| 政策变动影响、政策风控、新规对利润影响 | methods/sensitivity-breakeven.md | models/policy-impact-operating-map.md、变量映射、成本结构、现金流、库存风险 | 先接收 `policy_impact_handoff`，再把政策影响转成变量、指标、资料缺口和场景测算。 |
| 未来能卖多少 | scenarios/operating-forecast.md | 历史复盘、库存风险 | 这是经营预测，不是现金流。 |
| 这个月为什么亏 | scenarios/historical-review.md | 成本结构、必要时 SKU 利润核算 | 用已发生事实解释亏损。 |
| 售价多少合适 | models/unit-economics.md | 敏感性、立项 BP | 先看单件模型。 |
| 哪些 SKU 滞销 | scenarios/inventory-risk.md | 历史复盘 | 库龄和动销是主问题。 |
| 账面盈利为什么现金紧 | scenarios/cashflow-forecast.md | 历史复盘、库存风险 | 回款、付款和库存占用是主问题。 |

## 混合问题

同一句话包含多个业务问题时，应拆分：

1. 已发生事实：历史复盘或确定性计算器。
2. 未来经营假设：未来预测或立项 BP。
3. 现金时点：现金流预测。
4. 库存压力：库存风险。
5. 决策压力测试：敏感性与盈亏平衡。
6. 政策风控：从 `policy_impact_handoff` 拆出政策事实、影响变量、影响指标、适用经营场景、资料缺口和可执行测算路径。
