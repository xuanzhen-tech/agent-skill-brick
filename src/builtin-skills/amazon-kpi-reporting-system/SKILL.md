---
name: amazon-kpi-reporting-system
description: 基于用户一方输入与可信上游结果定义版本化 KPI 口径，并可将 SIF、SellerSprite、Sorftime 的关键词、ASIN、流量、销量、广告和市场趋势作为独立外部观察。适用于指标定义、按需报表、周期对比和数据就绪度；不适用于重建利润/库存、后台任务、自动推送，或用供应商观察替代第一方 KPI。
---

<!--
文件功能：指导 Agent 定义 KPI、核对可比性、计算读数并形成按需管理报表。
职责边界：第一方 KPI 只消费合法一方事实或可信上游；三 MCP 仅作独立外部观察，不进入 KPI 分子、分母或归因。
重要关联：指标方法见 references/kpi-reporting-contract.md；正式交付使用 assets/templates/kpi-report-template.md。
-->

# Amazon KPI 合同与按需报表

## 目标

让每个指标回答清楚：

- 它支持什么业务决策；
- 分子、分母、单位和粒度是什么；
- 哪个时间点/窗口、时区和成熟度；
- 纳入与排除哪些对象；
- 数据由谁负责、何时更新、会不会回填；
- 哪些周期真正可比；
- 目标、护栏和解释责任是谁。

## 开始条件

至少需要业务问题、第一方数据、指标定义责任人、站点/对象/期间、分子/分母、排除项、数据延迟与报表受众。

没有第一方 KPI 材料时，可交数据准备清单和外部市场附录，不能生成看似正式的经营 KPI。

`uploads/` 只读；过程材料写入 `temp/data-analysis/<run-id>/04-kpi/`，正式结果写入 `outputs/data-analysis/<run-id>/04-kpi/`。

## 执行流程

### 1. 从决策反推指标

先问用户要做什么决定，再选：

- 结果指标；
- 驱动指标；
- 护栏指标；
- 诊断维度。

避免堆砌容易获取但无法支持决策的指标。

### 2. 定义 KPI

每个 KPI 写：

- 名称与业务问题；
- 公式、分子、分母；
- 单位、币种和粒度；
- 站点、商品、渠道、客户或订单范围；
- 时间窗口、时区和成熟期；
- 去重、退款/取消、税费、广告与其他排除；
- 数据来源与责任人；
- 目标/阈值及批准人；
- 版本和变更触发。

比率没有合法分母时不可计算；缺失不是零。

### 3. 做数据质量和覆盖检查

核对完整性、重复、延迟、回填、定义变更、映射、币种、单位和时区。报告覆盖范围与缺口对读数的影响，不用一个泛化“数据质量分数”替代说明。

### 4. 检查周期可比性

比较前确认：

- KPI 版本和公式一致；
- 对象范围与映射一致；
- 时间窗口、时区和成熟度一致；
- 币种、税费、退款与广告口径一致；
- 数据覆盖和延迟可接受。

完全可比才算差值/变化率；部分可比只描述方向；不可比就分开报告。

### 5. 计算与解释

展示当前值、基线/目标、绝对差、相对差、分子、分母、样本量和覆盖。基线为零或缺失时不强算百分比。

解释按“发生了什么—在哪些分群—可能原因—还需验证”展开，异常诊断交 `amazon-business-anomaly-diagnostics`，不要在 KPI 报表里直接宣布根因。

### 6. 外部市场观察

候选工具：

- SIF：`market_get_keyword_history`、`market_get_asin_profile`、`ops_get_asin_traffic_trend`、`ops_get_asin_sales_trend`、`ads_get_asin_ad_traffic_trend`。
- SellerSprite：`aba_research_trend`、`keyword_research_trends`、`asin_sales_trend`、`keepa_info`、`asin_coupon_trend`。
- Sorftime：`product_trend`、`product_ranking_trend_by_keyword`、`category_trend`、`keyword_trend`。

每个工具首次调用前按外层 `search → describe → call`，只服从本次 `inputSchema`。仅 SIF `ops_get_asin_traffic_trend` 在 schema 支持时使用 `fetchKeepa=false`。禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

外部观察单独展示，不进入第一方 KPI 分子、分母、利润、库存或归因。多源先对齐站点、对象、时间、粒度、单位和覆盖；冲突不平均。

### 7. 形成报表

报表优先回答：

- 现在怎样；
- 相对什么变化；
- 哪些分群贡献；
- 数据是否足以支持结论；
- 哪些外部背景相关；
- 下一步检查/决策；
- 谁负责。

## 失败与降级

- KPI 定义不完整：先完成口径，不出读数；
- 分母缺失：不可计算；
- 周期不可比：不算变化；
- 数据未成熟：标明截至时点并等待；
- 只有供应商观察：只交外部附录；
- 多源冲突：并列，不平均；
- 用户要求自动推送：交开发者。

## 正式交付

使用 `assets/templates/kpi-report-template.md` 生成：

1. `kpi-definition-and-version.md`
2. `kpi-report.md`
3. `kpi-readings.csv`
4. `data-quality-and-coverage.md`
5. `external-market-observations.md`

## 质量门

- 每个 KPI 服务明确决策；
- 公式、分子、分母、范围、窗口和排除完整；
- 数据延迟与成熟度已说明；
- 周期比较先过可比性门；
- 读数展示样本与覆盖；
- 供应商观察与第一方 KPI 分栏；
- 未在报表中把相关性写成根因；
- 未创建后台任务或自动推送。

## 资源读取

- 开始定义指标前读取 `references/kpi-reporting-contract.md`。
- 写正式交付前读取 `assets/templates/kpi-report-template.md`。
