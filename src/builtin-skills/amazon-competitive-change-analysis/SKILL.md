---
name: amazon-competitive-change-analysis
description: 对已冻结的竞品对象，以及用户材料或 SIF、SellerSprite、Sorftime 中带日期的 ASIN、流量、销量、广告、ABA、Keepa/Coupon 与商品/类目/排名快照执行可比性检查、建立基线并分析可证明变化。适用于竞品快照比较与缺口诊断；不适用于发现竞品、后台监控、把缺失写成变化、推断内部策略或自动响应。
---

<!--
文件功能：指导 Agent 对稳定竞品对象建立可比快照并解释可证明变化。
职责边界：三 MCP 只提供已冻结对象的供应商观察；竞品集合归第02，促销响应归第06；不监控、不推断竞品内部策略或执行响应。
重要关联：比较方法见 references/competitive-change-contract.md；正式交付使用 assets/templates/competitive-change-template.md。
-->

# Amazon 竞品可比变化分析

## 目标

本 Skill 只回答“同一竞品在两个或多个可比时点发生了什么变化”：

- 对象是否仍是同一商品/变体；
- 每个字段是否来自相同定义和覆盖；
- 哪些变化可以量化；
- 哪些只能判断方向；
- 哪些因口径不一致不能比较；
- 多个变化是否同步；
- 这些变化对竞争态势提供什么线索；
- 还不能推断什么。

## 开始条件

至少需要：

- 第02专家或用户已冻结的竞品集合；
- marketplace、ASIN/父子体/变体关系；
- 至少两个带观察时间的快照；
- 要比较的字段和决策问题；
- 每个快照的来源、定义、单位与覆盖；
- 人工审核人。

首次只有一个快照时，只能建立基线，不能写“上涨、下降、新增或删除”。

`uploads/` 保持只读；过程材料写入 `temp/data-analysis/<run-id>/02-competitive-change/`，正式结果写入 `outputs/data-analysis/<run-id>/02-competitive-change/`。

## 执行流程

### 1. 冻结竞品集合

本 Skill 不发现竞品。对每个对象确认：

- marketplace；
- ASIN、父子体和变体；
- 商品是否改款、合并、拆分或换链接；
- 当前集合版本和纳入理由；
- 对象变更时是否需要新建序列。

若身份无法稳定映射，停止该对象比较。

### 2. 建立快照

每个快照写清：

- 观察/检索时间；
- 对象与站点；
- 价格、Coupon、内容、变体、排名、流量、销量或广告字段的原值；
- 单位、币种、自然/广告范围；
- 分页、Top N、采样和覆盖；
- 来源工具或文件定位；
- 供应商估算与真实一方事实的区别。

不要用后来的值覆盖旧快照。

### 3. 按需调用三 MCP

- SIF：`market_get_asin_profile`、`ops_get_asin_sales_trend`、`ops_get_asin_traffic_trend`、`ops_get_listing_traffic_overview`、`ads_get_asin_ad_structure`、`ads_get_asin_campaign_changes`。
- SellerSprite：`asin_detail`、`asin_detail_with_coupon_trend`、`asin_coupon_trend`、`keepa_info`、`asin_sales_trend`、`asin_competitor`。
- Sorftime：`product_detail`、`product_trend`、`product_variations`、`product_traffic_terms`、`category_trend`。

只查询已冻结对象和字段。同类字段多家可得时综合查看。

调用前遵循外层 `search → describe → call`：每个业务工具首次调用前实时 `describe`，参数只按本次 `inputSchema`，站点、对象、时间与分页必须匹配。仅 SIF `ops_get_asin_traffic_trend` 在实时 schema 支持时使用 `fetchKeepa=false`。禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

### 4. 逐字段判断可比性

比较前对齐：

- marketplace；
- ASIN、父子体和变体；
- 时间、时区和粒度；
- 币种、单位、税费和优惠口径；
- 字段定义；
- 自然/广告范围；
- Top N、分页和采样；
- 检索时点与供应商。

每组字段归为：

- **完全可比**：可计算差值和变化率；
- **部分可比**：只能比较方向或定性变化；
- **不可比**：不做变化结论，说明缺口。

这个三态门是业务计算门，不是通用数据状态表。

### 5. 计算变化

完全可比时可计算：

- 绝对变化：`当前值 - 基线值`；
- 相对变化：`(当前值 - 基线值) / 基线值`；
- 排名变化：保留“数值越小通常排名越好”的解释；
- 结构变化：新增/删除变体、内容模块或流量词；
- 价格/优惠变化：分别展示标价、Coupon 和可见到手价口径。

基线为零、缺失或不可比时，不强算百分比。

### 6. 形成变化组合

把同步变化组织成竞争线索，例如：

- 价格下降 + Coupon 出现 + 可见销量趋势上升；
- Listing 内容扩展 + 新流量词出现；
- 变体增加 + 类目排名变化；
- 广告可见结构变化 + 关键词信号变化。

组合只说明共同发生。供应商快照不能证明竞品真实支付价、库存、订单、内部广告策略或动作动机。

### 7. 解释多源差异

多源冲突时逐值保留，并检查：

- 检索时间差；
- 父子体/变体映射；
- Coupon、价格或销量估算口径；
- Top N 和分页；
- 字段定义和采样。

不投票、不平均、不用一个来源覆盖另一个。一个来源失败时可报告部分覆盖，但不能称多源确认。

### 8. 给出结论上限与下一步

交付分别写：

- 已证明变化；
- 仅方向性变化；
- 不可比较字段；
- 可能的竞争含义；
- 不能推断的内部策略；
- 需要第02、第06、第12或其他专家进一步处理的动作。

## 失败与降级

- 竞品身份不稳定：停止序列；
- 只有一个快照：建立基线；
- 字段定义或覆盖变化：降为部分可比/不可比；
- 缺失值：不能写成删除或归零；
- 多源冲突：并列，不平均；
- 结果截断或分页不足：说明覆盖，不称全量；
- 用户要求自动监控或响应：交开发者/责任专家。

## 正式交付

使用 `assets/templates/competitive-change-template.md` 生成：

1. `competitive-change-analysis.md`
2. `competitor-snapshot-register.csv`
3. `field-comparability-and-change.csv`
4. `multi-source-comparison.md`
5. `competitive-implications-and-handoffs.md`

## 质量门

- 竞品集合和对象身份已冻结；
- 单点未被写成变化；
- 每个变化先通过完全/部分/不可比门；
- 缺失没有被写成零或删除；
- 数值变化公式和基线清楚；
- 多源冲突未平均或覆盖；
- 供应商估算未被写成第一方事实；
- 同步变化未被写成内部动机或因果；
- 未监控或执行响应。

## 资源读取

- 建立快照前读取 `references/competitive-change-contract.md`。
- 写正式交付前读取 `assets/templates/competitive-change-template.md`。
