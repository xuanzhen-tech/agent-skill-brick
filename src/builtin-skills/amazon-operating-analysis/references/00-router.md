# 经营分析总控

## 触发

当 `amazon-operating-analysis` 已触发后，先读取本资料。

## 边界

本资料只负责路由和组合，不计算、不导出、不启动 `.pi/workflows`，也不替代 SKU 利润核算或库存核算。

## 加载下游

- 目标、资料、假设或结论等级不清时，先加载 `references/01-intake-assumptions.md`。
- 按 `references/shared/question-to-skill-route-map.md` 选择一个主责模块。
- 只在主责模块需要时加载支撑模块。
- 输出结论前加载 `references/methods/output-gate.md`。

## 必读资料

- `references/shared/question-to-skill-route-map.md`
- `references/shared/material-levels-and-conclusion-levels.md`
- `references/shared/assumption-register-policy.md`
- `references/shared/financial-model-variable-map.md`
- `references/shared/default-value-policy.md`
- `references/shared/handoff-to-deterministic-calculators.md`
- `references/models/excel-bp-absorption-map.md`
- `references/models/known-formula-differences.md`

## 停止与降级

用户问题同时包含历史事实和未来计划时，不要强行单一路由；应拆成事实、假设、预测、现金和库存几个部分分别处理。
