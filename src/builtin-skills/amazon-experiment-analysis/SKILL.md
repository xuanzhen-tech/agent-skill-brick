---
name: amazon-experiment-analysis
description: 为 Amazon Listing、视觉、广告、促销等干预定义版本化测量协议，并用用户一方分组、曝光和结果检查随机化、数据质量、效应与不确定性；可按需把 SIF、SellerSprite、Sorftime 信号作为独立外部背景。适用于实验设计审查和结果分析；不适用于执行分流、用供应商观察证明实验结果、把非随机观察称为因果或保证收益。
---

<!--
文件功能：指导 Agent 设计、审查和分析 Amazon 经营实验，并限定因果结论。
职责边界：三 MCP 只形成外部市场背景，不进入 assignment、exposure、outcome 或效应；不执行分流或干预，不把前后观察写成随机因果。
重要关联：实验方法见 references/experiment-analysis-contract.md；正式交付使用 assets/templates/experiment-analysis-template.md。
-->

# Amazon 实验测量与结果分析

## 目标

本 Skill 覆盖两个阶段：

- **设计前**：把业务问题转成可检验协议；
- **结束后**：检查实验是否按协议发生，并估计效果与不确定性。

合格结果应回答：

- 谁被分配、谁真正曝光；
- 对照和处理有什么差异；
- 主要指标、护栏和分析窗口是什么；
- 样本是否足够，停止是否遵守协议；
- 缺失、串组、失衡和并发干预如何影响结论；
- 效应有多大、区间多宽、是否有实际意义；
- 因果、相关或不可判定的结论边界。

## 设计阶段最低输入

- 业务问题和决策；
- 可操作干预与对照；
- 分配单位和随机化/分流方式；
- 曝光定义；
- 主要指标、次要指标和护栏；
- 分子、分母、窗口、去重和排除；
- 最小有意义效应、基线波动和样本量依据；
- 实验时长、停止规则和分析责任人；
- 并发促销、广告、库存和季节背景。

## 分析阶段最低输入

- 冻结的协议与版本；
- 一方 assignment、exposure 和 outcome 数据；
- 实验开始/结束与观察截止时间；
- 处理版本和发布记录；
- 缺失、排除、异常和质量说明；
- 预先定义的分群和多重检验计划；
- 人工审核人。

没有 assignment/exposure/outcome 一方材料时，不能分析实验效果。

`uploads/` 保持只读；过程材料写入 `temp/data-analysis/<run-id>/03-experiment/`，正式结果写入 `outputs/data-analysis/<run-id>/03-experiment/`。

## 执行流程

### 1. 冻结问题和协议

协议至少说明：

- 假设及预期机制；
- 随机化/分流单位；
- 处理与对照的唯一差异；
- 资格、纳入与排除；
- assignment 和 exposure 的定义；
- 主要指标、护栏和窗口；
- 最小有意义效应；
- 样本量、时长和停止规则；
- 预设分群；
- 并发干预和风险；
- 负责批准、上线和分析的人。

结果出来后修改主要指标、排除规则或窗口，必须作为偏离披露，不能悄悄改协议。

### 2. 选择设计

优先随机对照。若不能随机化，明确是：

- 时间切换；
- 地域/商品分组；
- 前后比较；
- 差分中的差分；
- 回归或匹配；
- 其他观察性设计。

对非随机设计写清选择偏差、时间趋势、并发变化和不可观测混杂。不要把它称 A/B 因果实验。

### 3. 设计样本量与停止规则

样本量应基于：

- 基线均值/转化率与方差；
- 最小有意义效应；
- 显著性水平与检验力；
- 分配比例；
- 聚类/重复测量；
- 预期缺失与多重比较。

停止规则应事先确定。不得因为早期结果有利而提前停止，也不得只在显著时停止。

### 4. 检查实验执行

分析前检查：

- assignment 是否符合计划；
- exposure 是否真实发生；
- 是否串组、跨组或版本污染；
- 样本比例是否与分配预期一致（SRM）；
- 处理前特征是否大幅失衡；
- 缺失与流失是否按组不同；
- 数据延迟和窗口是否成熟；
- 是否有并发价格、促销、广告、库存、Listing 或外部事件；
- 是否按停止规则结束。

这些检查失败时，先降级结论，不急于计算最终效应。

### 5. 确定分析集

至少区分：

- 按分配分析（ITT）：保留随机化优势；
- 按真实曝光分析：可描述执行效果，但可能引入选择偏差；
- 符合协议分析：需说明排除如何破坏可比性。

主要结论通常以预先约定的分析集为准，其他分析作为敏感性检查。

### 6. 计算效应

连续指标：

`绝对效应 = mean(treatment) - mean(control)`

比率指标：

`绝对效应 = p_t - p_c`

对照非零时：

`相对效应 = (p_t - p_c) / p_c`

同时报告样本量、分子/分母、点估计、置信区间和实际业务量级。按随机化单位和数据结构选择正确标准误；聚类实验不能按独立用户公式计算。

### 7. 检查多重比较与分群

主要指标优先。大量指标、时间点或分群会增加偶然显著，应：

- 标出预设与事后分析；
- 采用适当校正或明确探索性；
- 报告所有相关结果，不只挑显著项；
- 检查分群样本量与交互，而非仅看各组 p 值。

事后发现的分群差异只能作为下一轮假设。

### 8. 区分统计与业务意义

显著但很小的效应未必值得上线；不显著也不等于“没有效果”。结合：

- 置信区间是否排除重要收益/损失；
- 实施成本和风险；
- 护栏是否受损；
- 效果是否在时间上稳定；
- 是否存在 novelty、学习或疲劳效应；
- 结果对主要业务对象是否有意义。

### 9. 按需获取外部背景

- SIF：`market_get_keyword_history`、`market_get_asin_profile`、`ops_get_asin_traffic_trend`、`ops_get_asin_sales_trend`、`ads_get_asin_ad_traffic_trend`。
- SellerSprite：`aba_research_trend`、`keyword_research_trends`、`asin_sales_trend`、`keepa_info`、`asin_coupon_trend`。
- Sorftime：`product_trend`、`product_ranking_trend_by_keyword`、`category_trend`、`keyword_trend`。

这些结果只解释实验期间的外部环境，不能补 assignment、exposure、outcome、SRM 或效应。

每个工具首次调用前按外层 `search → describe → call`，参数只服从本次 `inputSchema`。仅 SIF `ops_get_asin_traffic_trend` 在 schema 支持时使用 `fetchKeepa=false`。禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

多源背景先对齐站点、对象、时间、粒度、单位和覆盖；冲突并列，不平均。供应商一致也不能证明实验因果。

### 10. 给出结论

结论分为：

- **因果证据较强**：随机化和执行检查通过，分析符合协议；
- **因果证据受限**：存在污染、SRM、流失或协议偏离；
- **观察性关联**：非随机设计；
- **不可判定**：关键材料或样本不足。

同时写上线/不上线/继续试验的决策含义、护栏风险、复现或后续实验。

## 失败与降级

- 无冻结协议：先重建“实际采用的协议”，标记事后；
- 无 assignment/exposure/outcome：停止效果分析；
- SRM、串组或差异性流失：降级因果解释；
- 样本不足：报告区间和仍可排除/不能排除的效应；
- 提前停止或指标后选：明确偏倚风险；
- 非随机前后比较：只写关联；
- 外部背景缺失：不影响一方实验门，不用相邻趋势补值。

## 正式交付

使用 `assets/templates/experiment-analysis-template.md` 生成：

1. `experiment-protocol-and-deviations.md`
2. `experiment-quality-review.md`
3. `experiment-effect-analysis.md`
4. `external-context.md`
5. `decision-and-next-experiment.md`

## 质量门

- 协议、主要指标和停止规则在结果前冻结或明确标记事后；
- assignment、exposure 和 outcome 来自一方材料；
- 检查 SRM、失衡、串组、缺失、流失和并发干预；
- 分析集和排除透明；
- 效应同时报告样本量、区间和业务意义；
- 多重比较与事后分群有控制；
- 三 MCP 只作外部背景；
- 非随机设计未写成随机因果；
- 结论与证据强度匹配。

## 资源读取

- 设计或分析前读取 `references/experiment-analysis-contract.md`。
- 写正式交付前读取 `assets/templates/experiment-analysis-template.md`。
