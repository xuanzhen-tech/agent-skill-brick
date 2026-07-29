---
name: amazon-ranking-trend-analysis
description: 基于用户材料或 SIF、SellerSprite、Sorftime 的同类带日期 Amazon 排名/ABA/商品趋势观察，分别建立 BSR、关键词自然位置、广告位置和可见性序列，经口径对齐后生成按需趋势分析。适用于排名可比性与上下文对齐；不适用于关键词发现、后台监控、混合排名体系、保证自然排名或把未返回解释为掉榜。
---

<!--
文件功能：指导 Agent 建立四类 Amazon 排名同类序列并分析趋势与上下文。
职责边界：三 MCP 只提供供应商观察；不能用综合分、搜索量或流量制造位次；关键词发现归第02，广告执行归第05，不创建监控。
重要关联：排名方法见 references/ranking-trend-contract.md；正式交付使用 assets/templates/ranking-trend-template.md。
-->

# Amazon 排名趋势分析

## 四类排名必须分开

只允许：

- BSR 类目排名；
- 关键词自然位置；
- 广告位置；
- 可见性观察（例如是否出现在给定采样范围）。

ABA、搜索量、流量、销量、预测分数或自然曝光不能变成第五种“排名”，也不能互相混成同一序列。

## 开始条件

至少需要：

- 稳定 ASIN/变体与 marketplace；
- 明确排名类型；
- 关键词原文、语言和匹配范围，或完整类目路径；
- 每个观测的时间、来源和采样覆盖；
- 至少两个可比时点（单点只作基线）；
- 需要对齐的价格、促销、流量或事件；
- 人工审核人。

`uploads/` 只读；过程材料写入 `temp/data-analysis/<run-id>/05-ranking/`，正式结果写入 `outputs/data-analysis/<run-id>/05-ranking/`。

## 执行流程

### 1. 冻结对象和排名体系

确认：

- marketplace、ASIN、父子体/变体；
- BSR 的类目路径；
- 关键词的原文、规范形式、语言、match/采样范围；
- 自然与广告是否分开；
- 位次数值方向；
- Top N、分页和未出现语义。

对象或体系改变时建立断点，不续接旧序列。

### 2. 建立原始观测

每个观测保留：

- 排名类型和原始值；
- 观测时间与时区；
- 关键词/类目/ASIN；
- 供应商/工具或文件；
- 采样位置、Top N、分页和方法；
- 实际排名还是预测/估算；
- 结果未返回、截断或无法解析时的限制。

未返回不等于掉榜；只能说在本次可见采样内未观察到。

### 3. 按需调用三 MCP

- SIF：`market_get_asin_profile`、`market_get_asin_keyword_signals`、`ops_get_asin_traffic_trend_detail`、`market_get_keyword_history`。
- SellerSprite：`asin_detail`、`aba_research_weekly`、`aba_research_monthly`、`aba_research_trend`、`keyword_research_trends`、`bsr_prediction`。
- Sorftime：`product_ranking_trend_by_keyword`、`product_trend`、`category_trend`、`keyword_trend`、`product_traffic_terms`、`competitor_product_keywords`。

每项返回仍要通过四类排名门。`bsr_prediction` 只作预测，`competitor_product_keywords` 只作自然可见性观察。

每个工具首次调用前按外层 `search → describe → call`，只按本次 `inputSchema` 传参并匹配站点、对象、时间和分页。禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

### 4. 构建同类序列

只有以下条件匹配才进入数值序列：

- 相同排名体系；
- 相同 marketplace；
- 稳定 ASIN/变体；
- 相同关键词/语言或类目；
- 相同自然/广告范围；
- 时间粒度和采样方法可比；
- Top N、分页和字段定义可比。

完全可比才算位次变化；部分可比只描述方向；不可比则并列。

### 5. 描述趋势

关注：

- 首次基线；
- 改善/恶化的幅度与持续时间；
- 波动、跳变和断点；
- 是否触及采样边界；
- 多个关键词/类目是否同步；
- 预测与实际是否分开。

排名通常数值越小越好，但必须按具体体系说明。不要把未观察到写成无穷大或任意末位。

### 6. 对齐上下文

把价格、Coupon、广告、Listing、库存、销量或类目事件作为上下文，要求对象和时间可对齐。

用“同期出现”“可能相关”“待验证”，不要用相关性宣布原因。需要异常原因时交 `amazon-business-anomaly-diagnostics`，需要因果时设计实验。

### 7. 处理多源冲突

先检查对象、关键词词形、类目、时间、排名体系、自然/广告、Top N、分页和采样。无法解释时逐家保留，不平均或覆盖。

一源失败时可形成部分覆盖，但不能称多源确认。截断结果不能解释为完整排名序列。

## 失败与降级

- 只有一个时点：只建立基线；
- 排名类型不明：不入序列；
- 未返回/分页不足：只说明采样可见性；
- 自然、广告、BSR 或预测混用：拆分；
- 对象或方法变化：建立断点；
- 多源不可比：分开报告；
- 用户要求持续监控或保证排名：明确越界。

## 正式交付

使用 `assets/templates/ranking-trend-template.md` 生成：

1. `ranking-trend-analysis.md`
2. `ranking-observations.csv`
3. `series-comparability.md`
4. `context-events.csv`
5. `multi-source-differences.md`

## 质量门

- 所有观测属于四类之一；
- BSR、自然、广告和可见性未混合；
- 对象、关键词/类目、时间和采样已对齐；
- 单点未写成趋势；
- 未返回未写成掉榜；
- 预测未写成实际排名；
- 多源冲突未平均；
- 上下文相关性未写成因果；
- 未创建监控或保证排名。

## 资源读取

- 建立序列前读取 `references/ranking-trend-contract.md`。
- 写正式交付前读取 `assets/templates/ranking-trend-template.md`。
