---
name: brand-content-strategy-and-calendar
description: 基于品牌事实、已批准声明与资产、受众目标及当前趋势证据，并按需综合 SIF、SellerSprite、Sorftime 的 Amazon 需求词、公开 VOC、A+ 分布和 Amazon/TikTok 趋势观察，形成品牌内容支柱、信息架构、内容 brief 与静态人工审批日历。适用于品牌内容策略和季节/事件规划；不适用于生成未证促销事实、制作视觉资产、自动排程或发布。
---

<!--
文件功能：指导 Agent 把品牌事实、受众需求和三 MCP 公开观察提炼为内容策略与静态日历。
职责边界：三 MCP 只提供市场观察，不是 Amazon/账号一方真相；TikTok 仅在任务明确指定时使用；不生成未批准声明，不制作视觉或发布内容。
重要关联：策略方法见 references/brand-content-evidence-contract.md；正式交付使用 assets/templates/brand-content-calendar-template.md。
-->

# 品牌内容策略与静态日历

## 目标

产出不是“每天发什么”的随机清单，而是一套可解释的内容系统：

- 品牌希望被谁记住、因为什么被记住；
- 哪些受众问题值得长期占领；
- 哪些声明可以说，哪些只能作为待验证假设；
- 每个内容支柱如何服务认知、考虑、转化或留存；
- 不同主题怎样在一个周期内形成节奏；
- 每条内容需要什么素材、审核和后续复盘。

## 开始前确认

至少需要：

- 品牌定位、目标受众、核心商品和目标站点；
- 已批准的产品事实、差异点、声明和禁用表述；
- 可用资产及其权利、语言和时效；
- 内容目标、周期、渠道、频次与重要商业节点；
- 当前促销 brief（若涉及价格、优惠或活动）；
- 人工审核人。

缺少声明依据时，可以设计主题和补证计划，但不能把假设写成对外事实。

`uploads/` 保持只读；过程材料放入 `temp/brand-marketing/<run-id>/01-content-strategy/`，正式交付写入 `outputs/brand-marketing/<run-id>/01-content-strategy/`。

## 执行流程

### 1. 冻结品牌事实与表达边界

把输入分为：

- 可直接使用的品牌/产品事实；
- 需要限定范围或措辞的声明；
- 仍待验证的假设；
- 明确禁止的表述；
- 只有在当前促销 brief 下才可使用的价格、折扣和时限。

事实和资产都要说明适用商品、站点、时间和直接材料。历史文案只能证明过去写过，不能自动成为当前批准说法。

### 2. 建立受众与任务

不要只写人口属性。对每个重点受众说明：

- 他们在什么场景下出现问题；
- 正在完成什么任务；
- 最担心的风险或摩擦；
- 决策时需要什么证明；
- 已有哪些常见误解；
- 品牌最适合提供什么价值。

若受众来自公开评论、关键词或趋势，只能描述观察到的主题，不能推断完整人群画像或买家身份。

### 3. 按需调用三 MCP

只为当前策略问题选择最少相关工具。同类关键数据在多个供应商都有时，应综合比较，不主观择一。

- SIF：`market_get_keyword_demand`、`market_get_keyword_history`、`market_get_keyword_root_trend`、`market_get_asin_profile`、`ops_get_listing_traffic_overview`。
- SellerSprite：`review`、`google_trend`、`keyword_research`、`keyword_research_trends`、`market_ebc_distribution`。
- Sorftime Amazon：`keyword_trend`、`product_trend`、`product_reviews`、`product_customers_say`、`product_traffic_terms`。
- 明确 TikTok 任务才可用：`tiktok_product_trend`、`tiktok_product_video`、`tiktok_product_video_author`。

调用规则：

1. 不知道精确名称时先对对应外层 MCP `search`；已知时可直接 `describe`。
2. 每个业务工具首次 `call` 前必须对同一精确名称实时 `describe`。
3. `arguments` 只按本次机器 `inputSchema` 构造；站点、对象、时间、粒度和分页必须显式匹配。
4. 禁止点式调用、Gateway、HTTP、SDK、CLI、shell、浏览器或自行注册/启停 MCP。
5. 只使用本次 `details.result` 实际出现且语义可确认的内容；物化文件只信外层 `artifacts`。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

结果被压缩、截断或分页不完整时，缩小范围或按真实 schema 继续；无法补齐就说明覆盖不足，不能称“全量”。

### 4. 综合需求、VOC 与趋势

不同来源分别回答不同问题：

- 关键词需求与趋势：受众正在主动寻找什么；
- 公开 Review/VOC：用户用什么语言描述问题、价值和摩擦；
- A+ 分布与 Listing 观察：市场常用什么内容模块；
- Google/Amazon/TikTok 趋势：哪些主题正在升温或具有季节性；
- 品牌一方材料：品牌真正能承诺什么。

比较多个供应商前对齐站点、关键词/ASIN、时间、粒度、单位、自然/广告范围和样本覆盖。完全可比才比较数值；部分可比只比较方向；不可比就并列解释。

公开 Review 是样本，页面摘要是供应商摘要。不能据此证明完整 VOC、买家身份或内容效果。

### 5. 找内容机会

把机会放进以下矩阵：

- 受众任务是否重要；
- 品牌是否有可信的差异与证明；
- 市场内容是否已经过度同质化；
- 主题是否有当前需求或季节性；
- 适合教育、证明、故事、比较还是转化；
- 需要什么素材和审核。

不要因为一个关键词量高就做内容，也不要因为一条评论强烈就把它当主流需求。

### 6. 设计内容支柱

每个支柱写清：

- 要解决的受众任务；
- 品牌主张与证明；
- 可以覆盖的子主题；
- 在漏斗中的角色；
- 推荐内容形式；
- 可复用资产；
- 禁止和待核表达；
- 衡量假设。

支柱之间应互补。一个支柱不能只是“产品介绍”，另一个又是“产品卖点”，却没有不同受众任务。

### 7. 建立信息架构与 brief

每个内容单元至少说明：

- 单一受众与单一核心问题；
- 开场钩子；
- 一句核心信息；
- 支撑点与直接材料；
- 行动引导；
- 所需视觉/素材；
- 渠道适配要求；
- 审核人和截止时间；
- 复盘问题。

需要视觉时交视觉专家；本 Skill 只写 brief，不生成或假装已有资产。

### 8. 编排静态日历

日历应体现节奏而非填满日期：

- 教育、证明、故事、互动和转化内容合理混合；
- 主题与季节/事件提前准备，不在活动当天才启动；
- 促销内容有合法 brief 和到期时间；
- 高强度转化内容之间有足够的价值内容；
- 同一支柱在不同周有递进，而不是重复改标题；
- 每项内容留有审核、素材制作和修改时间。

### 9. 审核与沟通

交付时向用户说明：

- 哪些结论来自品牌一方事实；
- 哪些来自 SIF、SellerSprite 或 Sorftime 的公开观察；
- 多源一致、冲突或不可比之处；
- 哪些主题只是需要验证的假设；
- 日历中哪些项因素材、声明、政策或促销依据不足而阻塞。

## 失败与降级

- 品牌事实不足：先交定位/声明补证清单和低风险主题框架；
- 多源只有一家成功：可做较弱方向判断，不能称三源验证；
- 数据不可比：分来源展示，不平均；
- 公开评论样本不足：只保留主题线索；
- 促销 brief 缺失：删除价格、折扣和时限；
- 资产权利或批准不明：只写素材需求，不安排发布；
- MCP 不可用或 schema 不匹配：保留缺口，不换外部来源。

## 正式交付

使用 `assets/templates/brand-content-calendar-template.md` 生成：

1. `brand-content-strategy.md`
2. `content-pillar-register.csv`
3. `content-calendar.csv`
4. `content-briefs.md`
5. `market-observation-notes.md`

所有文件写入 `outputs/brand-marketing/<run-id>/01-content-strategy/`。

## 质量门

- 品牌事实、市场观察和 Agent 推断已分开；
- 每个支柱有明确受众任务、品牌证明和内容角色；
- 多源比较已对齐对象、站点、时间与定义；
- 冲突未被平均，部分覆盖未称全量；
- 未用公开数据证明账号或真实内容效果；
- 未生成未批准声明、价格或促销事实；
- 日历有节奏、素材依赖、审核和复盘；
- 未排程、发布或制作视觉资产。

## 资源读取

- 开始分析前读取 `references/brand-content-evidence-contract.md`。
- 写正式交付前读取 `assets/templates/brand-content-calendar-template.md`。
