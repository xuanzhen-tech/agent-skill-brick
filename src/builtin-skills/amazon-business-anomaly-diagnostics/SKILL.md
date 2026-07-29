---
name: amazon-business-anomaly-diagnostics
description: 对用户一方 Amazon 经营时间序列执行数据质量检查、基线建立、偏离识别、分解和可证伪候选驱动诊断，并可综合 SIF、SellerSprite、Sorftime 的流量/广告、ABA/Keepa/Coupon 与商品/类目/排名趋势观察。适用于异常候选和下一步检查；不适用于后台告警、固定阈值、把供应商诊断写成已证根因或替代第一方事实。
---

<!--
文件功能：指导 Agent 从第一方经营序列识别异常、提出候选驱动并设计验证。
职责边界：三 MCP 只提供外部供应商观察，不能拥有一方基线、KPI 或因果；不运行持续告警、不输出无证根因或执行业务动作。
重要关联：诊断方法见 references/business-anomaly-contract.md；正式交付使用 assets/templates/business-anomaly-template.md。
-->

# Amazon 经营异常候选诊断

## 目标

本 Skill 回答：

- 观察到的变化是真异常、数据问题还是正常波动；
- 与什么历史、季节或业务条件相比；
- 异常由哪些商品、站点、渠道、关键词或漏斗环节贡献；
- 哪些外部市场变化与它同步；
- 哪些解释有证据，哪些只是候选；
- 下一步最小验证动作是什么。

“异常”不等于“根因”。本 Skill形成可证伪候选和检查计划。

## 开始条件

至少需要：

- 明确的 KPI、业务对象、站点和时间粒度；
- 用户一方时间序列及分子/分母；
- 当前观察窗口和可用历史；
- 数据生成、延迟、回填和修订说明；
- 已知促销、价格、库存、Listing、广告或运营事件；
- 用户认可的异常判断目的和责任人。

只有单点或只有供应商估算时，不能建立第一方异常结论。

`uploads/` 保持只读；过程材料写入 `temp/data-analysis/<run-id>/01-anomaly/`，正式结果写入 `outputs/data-analysis/<run-id>/01-anomaly/`。

## 执行流程

### 1. 冻结分析问题

明确：

- 哪个指标发生了什么疑似变化；
- 关心绝对值、比率、结构还是趋势；
- 影响哪个站点、ASIN、SKU、关键词或渠道；
- 需要判断的时间点和决策；
- 哪些变化幅度具有业务意义。

不要先跑检测再寻找问题。

### 2. 先排除数据质量异常

检查：

- 数据是否完整、重复或断档；
- 时区、日期边界和粒度是否一致；
- 分子/分母定义是否改变；
- 来源是否延迟、回填或重算；
- 商品/站点/渠道映射是否变化；
- 货币、单位和税费口径是否一致；
- 当前窗口是否尚未成熟；
- 最近是否更换采集或报表逻辑。

数据质量问题要单独交付。不要把缺失、延迟或定义变化解释成业务下跌。

### 3. 建立可解释基线

基线应匹配业务节奏。可考虑：

- 最近若干同粒度、且无重大干预的时期；
- 同星期几、同周或同季节；
- 去年同周期；
- 与已知促销、库存和事件相似的对照时期；
- 稳健中位数、分位数或季节性模型。

说明为什么选它、排除了什么、是否受趋势或结构变化影响。样本太短或业务制度变化后，不沿用旧基线。

### 4. 定义透明阈值

阈值应同时考虑：

- 统计偏离；
- 绝对业务影响；
- 样本量与分母；
- 数据成熟度；
- 误报和漏报成本；
- 用户的业务容忍度。

不要使用无来源的固定百分比。若用户未定义阈值，可展示多个候选阈值及其误报/漏报影响，由用户选择。

### 5. 识别偏离

至少展示：

- 实际值；
- 基线期望或区间；
- 绝对差和相对差；
- 分子、分母及样本量；
- 偏离是否连续、单点、季节性或结构性；
- 置信或不确定性。

比率变化时同时检查分子与分母，避免把小分母波动解释成严重异常。

### 6. 分解贡献

按与问题相关的维度逐层分解：

- 站点、产品、变体；
- 自然、广告和其他流量；
- 关键词、类目、排名；
- 价格、Coupon、促销；
- 库存、Buy Box、配送；
- 曝光 → 点击 → 转化 → 订单/收入；
- 新老客户或其他一方分群（材料允许时）。

分解目标是找到“谁贡献了变化”，不等于解释“为什么变化”。

### 7. 按需综合三 MCP

候选工具：

- SIF：`analyze_traffic_anomaly`、`ops_get_asin_traffic_trend`、`ops_get_asin_sales_trend`、`ads_get_asin_ad_traffic_trend`、`market_get_asin_keyword_signals`。
- SellerSprite：`asin_sales_trend`、`asin_coupon_trend`、`keepa_info`、`aba_research_trend`。
- Sorftime：`product_trend`、`product_ranking_trend_by_keyword`、`category_trend`、`keyword_trend`。

同类趋势由多家提供时建立重叠比较。调用协议：

1. 工具名未知时先对对应外层 MCP `search`；已知时可直接 `describe`。
2. 每个业务工具首次 `call` 前实时 `describe` 同一精确名称。
3. 只按本次 `inputSchema` 传参，显式对齐站点、对象、时间、粒度和分页。
4. 仅 SIF `ops_get_asin_traffic_trend` 在其 schema 支持时使用 `fetchKeepa=false`。
5. 禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

供应商结果只用于外部背景或候选解释，不进入第一方 KPI 的分子/分母。截断、压缩或分页不足时说明覆盖。

### 8. 构建候选驱动链

对每个候选写：

1. 观察到什么第一方偏离；
2. 哪个分解维度贡献最大；
3. 有哪些同步事件或外部观察；
4. 这条解释预期还能观察到什么；
5. 当前有哪些反证或替代解释；
6. 用什么最小检查可以证伪；
7. 由谁取得材料或执行验证。

例如“排名下降导致销售下降”需要同一对象、时间和关键词的排名变化，也要检查库存、价格、广告和转化等替代解释。同步不等于因果。

### 9. 评估候选可信度

用自然语言区分：

- **较强候选**：时间、范围、机制和多项材料一致，主要替代解释较少；
- **中等候选**：部分链路支持，但仍有关键缺口；
- **弱候选**：只有同期相关或单一供应商信号；
- **已被反证**：与时间、范围或预期结果矛盾。

不要用一个无解释综合分数掩盖缺口。

### 10. 形成下一步

下一步应优先：

- 能区分多个候选；
- 成本和时间较低；
- 不产生不必要业务风险；
- 有明确责任人和完成标准。

可能包括补取第一方报表、核对库存/价格/Listing 变更、检查广告结构、做小范围实验或转给领域专家 RCA。

## 失败与降级

- 数据缺失、延迟或定义变化：先做质量修复，不下业务结论；
- 历史不足：只描述当前偏离，不能称异常；
- 单点供应商趋势：只作线索；
- 多源不可比：分开展示，不平均；
- 一个供应商失败：可用剩余来源，但明确覆盖较弱；
- 只有相关性：保留候选，不写根因；
- 用户要求持续告警：交开发者，不声称本 Skill 正在监控。

## 正式交付

使用 `assets/templates/business-anomaly-template.md` 生成：

1. `business-anomaly-diagnostic.md`
2. `baseline-and-deviation.csv`
3. `contribution-decomposition.csv`
4. `candidate-driver-register.md`
5. `external-market-observations.md`
6. `verification-plan.md`

## 质量门

- 先排除数据质量问题；
- 基线与阈值透明且适合业务节奏；
- 偏离同时展示分子、分母与样本量；
- 贡献分解与原因解释没有混写；
- 三 MCP 只作外部观察；
- 多源比较已对齐站点、对象、时间、单位和覆盖；
- 每个候选有机制、反证、替代解释和验证；
- 相关性未写成根因；
- 下一步有负责人和完成标准。

## 资源读取

- 预检前读取 `references/business-anomaly-contract.md`。
- 写正式交付前读取 `assets/templates/business-anomaly-template.md`。
