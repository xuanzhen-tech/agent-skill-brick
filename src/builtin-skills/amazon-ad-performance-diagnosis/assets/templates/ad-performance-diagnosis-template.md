<!--
文件功能：提供广告报告生命周期、数据质量、指标、变化分解、假设和判断依据的正式交付模板。
职责边界：模板不拉取报表或操作广告；占位值不得被解释为零或完成状态。
重要关联：由 ../../SKILL.md 物化；状态和字段遵循 ../../references/ad-report-and-diagnostic-contract.md。
-->

# Amazon 广告绩效诊断

## A. 诊断元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/profile/marketplace` | `<values>` |
| `currency/timezone` | `<values>` |
| `analysis_window` | `<start/end>` |
| `attribution_contract` | `<window/date semantics>` |
| 当前可诊断范围 | `<完整/局部/阻塞，并说明原因>` |
| 关键缺口与责任人 | `<缺口、影响、下一责任人>` |

## B. 报告清单

| 报告及类型 | 账户/站点/实体范围 | 日期/时区/归因 | 生命周期 | 文件位置与版本 | 恢复方式 | 错误或限制 |
|---|---|---|---|---|---|---|
| `<report id/type>` | `<scope>` | `<window>` | `<processing/completed/ingested/...>` | `<path/version>` | `<recovery>` | `<value>` |

## C. 数据质量与覆盖

| 报表 | 粒度 | 页数/行数 | 分页与截断 | 实际覆盖 | 重复/解析问题 | 空结果含义 |
|---|---|---|---|---|---|---|
| `<report>` | `<grain>` | `<expected/received>` | `<complete/partial/unknown>` | `<scope>` | `<duplicates/errors>` | `<meaning>` |

## D. 联接验收

| 待连接报表 | 稳定连接键 | 对象范围 | 已匹配 | 未匹配 | 歧义 | 人工依据 | 是否可用于跨表分析及原因 |
|---|---|---|---:|---:|---:|---|---|
| `<datasets>` | `<keys>` | `<scope>` | `<count>` | `<count>` | `<count>` | `<basis>` | `<yes/limited/no + reason>` |

## E. 指标重算

| 指标 | 公式 | 分子 | 分母 | 期间/归因 | 结果 | 单位/币种 | 直接来源 | 限制 |
|---|---|---|---|---|---:|---|---|---|
| `<CTR/CPC/CVR/ACoS/ROAS/custom>` | `<formula>` | `<field/value>` | `<field/value>` | `<basis>` | `<value/不可计算>` | `<unit>` | `<report row>` | `<zero/maturity limits>` |

## F. 变化分解

| 变化维度 | 基线 | 对比期 | 变化 | 对结果的方向影响 | 覆盖/延迟说明 | 直接来源 |
|---|---:|---:|---:|---|---|---|
| `<impression/CTR/CPC/CVR/order_value/scope>` | `<value>` | `<value>` | `<value>` | `<up/down/mixed/unknown>` | `<note>` | `<report row>` |

## G. 诊断假设

| 观察与假设 | 已支持链路 | 未知环节 | 替代解释 | 下一证据/测试 | 当前判断及理由 | 直接来源 |
|---|---|---|---|---|---|---|
| `<observation/hypothesis>` | `<links>` | `<links>` | `<alternatives>` | `<next>` | `<supported/partial/not tested + why>` | `<report/tool locator>` |

## H. 阻塞与行动

| 问题 | 影响 | 所需数据/行动 | 负责人 | 截止或复核条件 |
|---|---|---|---|---|
| `<lifecycle/scope/join/coverage/metric>` | `<impact>` | `<request>` | `<owner>` | `<condition>` |

## I. 判断依据

| 指标或假设 | 来源/实际工具 | 账户、对象与期间 | 原值或直接依据 | 计算/推理 | 限制、替代解释或冲突 | 原文定位 |
|---|---|---|---|---|---|---|
| `<metric/hypothesis>` | `<report/SIF/SellerSprite/Sorftime + tool>` | `<scope>` | `<raw value/basis>` | `<formula/reason>` | `<limits>` | `<path/row/result locator>` |

SIF 广告可见信号、SellerSprite PPC/广告排名与 Sorftime 自然信号分列；可比才比较且不平均。外部观察只能支持假设或替代解释，不能冒充一方广告报表。

## J. 质量门

- [ ] 生命周期终态与文件验收分开
- [ ] Report ID、签名和恢复信息完整
- [ ] 时区、币种、归因、粒度、延迟、分页和截断完整
- [ ] 使用稳定 ID 联接
- [ ] 零、缺失、空结果和失败分开
- [ ] 零分母为 not_computable
- [ ] SIF、SellerSprite、Sorftime 外部观察彼此分列并与一方广告报表分层，未被当成曝光、点击、花费、订单或归因销售
- [ ] 假设含替代解释
- [ ] 无取数、轮询、下载或账户操作
- [ ] 正式文件位于 `outputs/`
