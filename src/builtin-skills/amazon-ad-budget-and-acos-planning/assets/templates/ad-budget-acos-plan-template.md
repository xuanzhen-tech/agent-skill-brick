<!--
文件功能：提供 ACoS/TACoS、经济边界、预算情景、决策候选、复核和判断依据的正式交付模板。
职责边界：模板不修改预算或竞价，不提供固定比例；占位情景不是效果承诺。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ad-budget-and-acos-contract.md。
-->

# Amazon 广告预算与 ACoS 规划

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/profile/marketplace` | `<values>` |
| `product/entity scope` | `<values>` |
| `currency/timezone` | `<values>` |
| `period/attribution` | `<values>` |
| 当前可交付范围 | `<实际表现复核/目标差距/预算情景/阻塞>` |
| 关键缺口与责任人 | `<缺口、影响、下一责任人>` |

## B. 指标账本

| 指标 | 分子 | 分母 | 原始结果 | 展示结果 | 对象/期间/归因 | 直接来源 | 限制 |
|---|---:|---:|---:|---:|---|---|---|
| `<实际/目标/保本 ACoS 或 TACoS>` | `<value>` | `<value>` | `<ratio/不可计算>` | `<percent/不可计算>` | `<scope>` | `<report/user/expert14 + locator>` | `<maturity/zero/basis limits>` |

## C. 经济边界

| 产品范围 | 价格/成本版本 | 有效日期 | 币种 | 可用广告贡献 | 促销叠加情况 | 来源 | 限制 |
|---|---|---|---|---|---|---|---|
| `<scope>` | `<version>` | `<date>` | `<currency>` | `<value/range>` | `<confirmed/pending>` | `<expert14/user + locator>` | `<limits>` |

## D. 差距与节奏

| 广告实体 | Actual Raw Ratio | Target Raw Ratio | `gap_ratio=actual-target` | `gap_percentage_points=gap_ratio*100` | Breakeven Raw Ratio | Breakeven Gap Ratio | Breakeven Gap Percentage Points | 展示舍入 | 业务解释 |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `<id>` | `<ratio>` | `<ratio>` | `<ratio/not_comparable>` | `<percentage points/not_comparable>` | `<ratio>` | `<ratio/not_comparable>` | `<percentage points/not_comparable>` | `<display-only rule>` | `<descriptive/forecast assumption>` |

## E. 预算情景

| 情景 | 预算范围 | 适用实体 | 目标 ACoS/TACoS | 保本边界 | 假设 | 观察窗 | 停止/回滚条件 | 人工批准 |
|---|---|---|---|---|---|---|---|---|
| `<name>` | `<range currency>` | `<scope>` | `<values>` | `<value/source>` | `<assumptions>` | `<window>` | `<trigger>` | `<owner/decision>` |

## F. 决策候选

| 广告实体 | 建议 | 直接理由 | 前置条件 | 风险 | 负责人 |
|---|---|---|---|---|---|
| `<entity>` | `<maintain/increase/decrease/reallocate/hold/stop>` | `<basis and calculation>` | `<conditions>` | `<risks>` | `<owner>` |

## G. 复核与回滚

| 人工操作 | 观察窗口 | 所需报表与范围 | 护栏 | 回滚/停止条件 | 负责人 |
|---|---|---|---|---|---|
| `<human action>` | `<window>` | `<report/scope>` | `<metrics>` | `<rule>` | `<owner>` |

## H. 判断依据

| 指标或判断 | 来源/实际工具 | 账户、对象与期间 | 原值或直接依据 | 计算/判断理由 | 限制、冲突或缺口 | 原文定位 |
|---|---|---|---|---|---|---|
| `<metric/decision>` | `<report/user/SIF/SellerSprite/Sorftime + tool>` | `<scope>` | `<raw value/basis>` | `<formula/reason>` | `<limits>` | `<path/row/result locator>` |

三方外部观察分列；只有对象、时间、单位和定义一致时才比较，绝不平均。覆盖缺一方或独有单源失败时直接说明影响，不把外部观察写成一方 ACoS/TACoS 或预算事实。

## I. 质量门

- [ ] 实际、目标、保本 ACoS 分开
- [ ] ACoS 原始值为 ratio；`gap_ratio=actual-target`，`gap_percentage_points=gap_ratio*100`
- [ ] 所有计算使用未舍入 raw ratio，展示舍入规则已记录
- [ ] TACoS 只用一方总销售
- [ ] 期间、币种、归因和范围一致
- [ ] 零分母为 not_computable
- [ ] 第14经济边界有版本和日期
- [ ] 无固定预算比例或行业阈值
- [ ] 情景假设未冒充保证
- [ ] 所有决策等待人工批准
- [ ] 无预算/竞价写入或自动规则
- [ ] 正式文件位于 `outputs/`
