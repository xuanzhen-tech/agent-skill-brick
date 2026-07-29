<!--
文件功能：提供站外付费媒体目标、受众、素材、落地页、预算、媒体干预交接和人工上线闸门模板。
职责边界：模板不连接或发布平台广告；所有平台字段和上线状态必须由有权限人员确认。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/offsite-paid-media-brief-contract.md。
-->

# 站外付费媒体 Brief

## A. 元数据

| 字段 | 内容 |
|---|---|
| 任务标识 | `<case-id>` |
| `brand/product/market` | `<scope>` |
| `platform_candidate` | `<Meta/Google/other>` |
| `business_objective` | `<objective>` |
| `decision_window` | `<window/timezone>` |
| `budget_currency/range` | `<values>` |
| 当前可上线准备范围 | `<哪些内容可交人工、哪些受限或阻塞>` |
| 关键缺口与责任人 | `<缺口、影响、下一责任人>` |
| 发布状态 | `未发布，等待人工操作` |

## B. 受众假设

| 受众假设 | 需求/情境 | 纳入/排除 | 商品适配 | 直接依据 | 敏感风险 | 平台可行性 | 验证方法 |
|---|---|---|---|---|---|---|---|
| `<description>` | `<context>` | `<rules>` | `<fit>` | `<source>` | `<risk>` | `<confirmed/required>` | `<method>` |

## C. 素材需求

| 面向受众 | 素材事实与宣称限制 | 格式 | 品牌资产 | 权利情况 | 本地化/无障碍 | 平台规格确认 | 负责人 |
|---|---|---|---|---|---|---|---|
| `<audience>` | `<facts/rules>` | `<abstract>` | `<assets>` | `<approved/pending/blocked>` | `<requirements>` | `<confirmed/required>` | `<owner>` |

## D. 落地页

| 落地页/版本 | 产品与 Offer 依据 | CTA | 地区/设备 | 隐私与同意 | 追踪准备 | 宣称一致性 | 负责人/缺口 |
|---|---|---|---|---|---|---|---|
| `<destination/version>` | `<source>` | `<cta>` | `<scope>` | `<confirmed/pending>` | `<reported/not assessed>` | `<supported/conflicted>` | `<owner/gap>` |

## E. 媒体干预与测量问题交接

| 媒体干预 | 已知事实 | 测量问题 | 事件标签 | 希望观察的指标 | 第 13 协议及版本 | 是否适用/缺口 | 直接依据 |
|---|---|---|---|---|---|---|---|
| `<intervention>` | `<platform/audience/creative/destination/budget/timing>` | `<decision question>` | `<label>` | `<metric>` | `<protocol/missing>` | `<applicable/mismatch/missing>` | `<source>` |

本节不得填写本包自创的 KPI 公式、样本、分组、停止规则、分析窗口、显著性规则或归因方法。

## F. 预算护栏

| 预算范围 | 经济护栏与来源 | 价格/Offer 版本 | 假设 | 停止/复核条件 | 人工批准人 |
|---|---|---|---|---|---|
| `<range currency>` | `<guardrail/source>` | `<version>` | `<assumptions>` | `<trigger>` | `<owner>` |

## G. 人工上线闸门

| 上线检查项 | 当前判断 | 直接依据/负责人 | 阻塞 | 下一行动 |
|---|---|---|---|---|
| `<account/platform/audience/creative/rights/landing/tracking/privacy/budget/measurement>` | `<ready/pending/blocked + why>` | `<source/owner>` | `<blocker>` | `<human action>` |

## H. 判断依据

| 受众、素材或媒体判断 | 来源/实际工具 | 平台、市场与期间 | 直接依据 | 判断理由 | 权利、覆盖或其他限制 | 原文定位 |
|---|---|---|---|---|---|---|
| `<audience/creative/media>` | `<user/upstream/SellerSprite/Sorftime + tool>` | `<scope>` | `<raw basis>` | `<reason>` | `<limits>` | `<path/row/result locator>` |

SellerSprite Google Trends 与 Sorftime TikTok 信号只在任务渠道明确匹配时使用，不能跨平台改写。三方重叠信号只有对象和定义一致时才比较，绝不平均。

## I. 质量门

- [ ] 品牌策略与付费媒体职责分开
- [ ] 受众事实与假设分开
- [ ] 无平台规模或枚举猜测
- [ ] 素材和落地页权利完整
- [ ] 交接只含测量问题、事件标签、干预 ID、希望指标和可选第13协议 ID
- [ ] 无第13协议 ID 时未自建 KPI、样本、停止规则或分析窗口
- [ ] SIF 仅作带调用谱系的 Amazon 外部背景，未冒充站外平台数据
- [ ] 无固定价格、预算比例或效果承诺
- [ ] 无账户连接、像素配置或发布
- [ ] 人工批准人与停止条件明确
- [ ] 正式文件位于 `outputs/`
