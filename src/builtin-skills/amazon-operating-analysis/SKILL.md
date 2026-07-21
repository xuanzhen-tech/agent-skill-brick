---
name: amazon-operating-analysis
displayChineseName: 亚马逊经营分析
description: 用于亚马逊跨境电商经营分析，包括新品立项、经营测算、未来预测、现金流预测、库存资金占用、滞销库存、定价、盈亏平衡、ACoS 风险和经营决策问题。
---

# 亚马逊经营分析入口

## 定位

这是经营分析技能集群的唯一运行时入口。它是软约束顾问入口，不是固定工作流启动器。内部执行手册只作为 references，不作为可独立触发的 active skill。

## 调度方式

1. 先读取 `references/00-router.md`。
2. 由路由资料选择最小必要执行手册集合。
3. 持续维护资料缺口、假设表、结论等级和下一轮追问。
4. 只按当前问题读取必要的下游 references。

## 边界

- 需要可信历史事实时，再交给 `amazon-sku-profit-summary`、`amazon-inventory-ledger-summary` 或 `amazon-sku-profit-reconciliation`。
- 不要直接跳过 `references/01-intake-assumptions.md` 和 `references/methods/output-gate.md`。
- 不要启动 `.pi/workflows`；本技能是软约束经营分析入口。
- 不要在这里计算 SKU 利润；历史利润事实交给既有确定性核算能力。
- 用户给出的文件和数字只是证据或假设，不自动授权输出正式经营结论。
- 用户要求“不要改文件、不要写文件、只读分析”时，禁止使用 `workspace_write_text`，也不要创建临时脚本；需要临时计算时用只读工具或内联 shell，写文件必须先征得用户确认。
- 关键财务数字优先使用 `operating_analysis_calculate` 调用正式 calculator；不要把 reference 文本中的公式名当成已计算证据。
- 每次最终输出必须显式包含“结论等级”“资料缺口”“假设披露”“顾问复核边界”；即使只能输出资料缺口清单，也要写明顾问复核边界。

## 业务化表达四方视角

凡是输出经营分析、财务分析、成本变化、费用异常、利润波动、现金流压力、定价、广告或库存占款等关键结论时，必须用“四方视角”组织表达。不要只输出专业指标，也不要只给口语化总结；四个视角都要保留关键数据、口径和证据边界。

1. 财务语言：用专业财务口径描述结论，必须带具体数据、期间、币种、口径和变化幅度，适合财务人员之间沟通。
2. 业务语言：把同一结论翻译成老板或业务人员容易理解的经营含义，也必须带具体数据。例如把“净利率下降 2 个百分点”表达为“每卖出 100 元商品，比去年少留下 2 元净利润”。
3. 进一步业务解释：说明数据变化背后的关联因子、直接原因和间接根本原因；区分已经有证据支持的原因、基于假设推断的原因和仍需补充资料确认的原因。
4. 行动建议：给出业务或老板可采取的具体措施，用来减小负面变化或放大正面变化。建议必须说明动作对象、预期影响、风险和下一步验证方式，避免“优化成本”“提升效率”这类空泛表达。

## 政策影响 handoff 输入

当输入包含 `policy_impact_handoff`，或用户询问“政策变动影响”“政策风控”“新规对利润有什么影响”时，必须把它当作经营分析材料处理，而不是继续做政策摘要。

输出必须显式包含：政策事实、影响变量、影响指标、适用经营场景、资料缺口、可执行测算路径、风险等级和行动建议。政策事实来自 handoff 的 evidence；影响变量和影响指标来自政策知识库映射，仍属于待测算假设，不能写成已验证经营事实。

缺少税率、HS Code、成本、售价、销量、库存、汇率、合规费用或生效时间等关键输入时，只能输出资料缺口、方向性影响和下一步测算路径，不得自行估算正式影响金额。

## 必读资料

- `references/00-router.md`
- `references/01-intake-assumptions.md`
- `references/models/excel-bp-absorption-map.md`
- `references/shared/variable-contract.md`
- `references/models/expense-item-catalog.md`
- `references/models/formula-family-map.md`
- `references/models/policy-impact-operating-map.md`
- `references/methods/output-gate.md`

## 工作方式

经营分析应保持多轮对话。缺少 M0 资料时先索要资料；使用 M1/M2 假设时必须披露；高影响变量缺失时必须降级结论。

## 停止

如果用户要求从 Amazon 交易文件计算历史 SKU 利润，改用 SKU 利润核算能力。若用户要求经营判断、未来计划或决策建议，留在本技能集群。
