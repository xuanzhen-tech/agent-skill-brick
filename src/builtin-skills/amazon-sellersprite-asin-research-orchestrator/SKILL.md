---
name: amazon-sellersprite-asin-research-orchestrator
description: 编排基于 SellerSprite MCP 的 Amazon 自有 ASIN 与指定竞品 ASIN 深度研究：先冻结对象与问题、建立共享证据底座，再调度市场、事件、Listing、广告可见性、评论 VOC 五个核心模块，实施材料性补数、反证、返工和主张级合并，最终形成可追溯的竞品机制判断与自有 ASIN 验证方案。适用于一次性深研或合格基线比较；不适用于常驻监控、自动告警、平台执行、竞品私有后台还原或 SellerSprite-only 因果认定。
---

# SellerSprite ASIN 深度研究总控

## 1. 使命：管理“研究决策”，而不是拼接专家文字

输入为 `站点 + 自有/目标 ASIN + 用户指定竞品 ASIN + 决策问题`。输出不是五份专家报告的摘要，而是一份经过对象冻结、统一取数、主张登记、冲突裁决、反证和业务适配的深度 Report。

总控必须完成五件不可下放的工作：

1. 把模糊需求拆成可验收问题与主张类型；
2. 建立所有专家共用、可版本化的数据底座；
3. 只把有分析资格的字段交给对应专家；
4. 以主张为单位决定接受、补数、返工、降级或剔除；
5. 将竞品观察转换成自有 ASIN 的可逆验证方案，而不是直接复制或执行。

﻿开始前必须读取以下共享合同（集群唯一版本，禁止使用模块本地副本）：

- `references/shared/research-contract.md` — 研究范围冻结、数据版本控制、输出路径契约
- `references/shared/sellersprite-mcp-contract.md` — MCP 三层调用协议、证据留存、能力边界
- `references/shared/evidence-claims-contract.md` — 统一 L0-L4 定义、模块最大等级、升级/降级规则
- `references/shared/collaboration-handoff-contract.md` — Task Card / Module Result / Handoff Schema、消费与冲突协议
- `references/shared/module-status-dictionary.md` — module_status / field_status / claim_status 三层枚举
- `references/shared/task-card-and-manifest-schema.md` — 总控专用 Module Manifest / Task Registry / Claim Ledger / 停止补数合成规则
- `references/orchestration-runbook.md` — 总控运行手册（流程级指导，非共享合同）
- `references/cluster-scope-and-review.md` — 集群范围与审核检查清单

## 2. 启动门与研究路由

### 2.1 最低输入

- Amazon marketplace；
- 至少一个自有/目标 ASIN；
- 至少一个用户指定竞品 ASIN；
- 至少一个业务问题或使用场景。

缺站点、对象或用途时集中追问一次。父/子体、变体、时间窗、关键词、已知事件和历史基线缺失但可由 SellerSprite 探测时，登记为 `unresolved`，不得静默假设。

### 2.2 四种主路由

| 路由 | 条件 | 允许结论 |
|---|---|---|
| `current_deep_snapshot` | 无合格历史基线 | 当前竞争位置、字段覆盖、候选机制；禁止最近涨跌 |
| `baseline_compare` | 有同口径正式基线或工具返回的可比历史 | 相对基线变化、变化组合；两时点不称长期趋势 |
| `event_diagnosis` | 有明确事件/候选拐点及足够时间粒度 | 7/14/28日事件描述、候选驱动、反证；不称因果 |
| `replication_validation` | 前三路由已有可用结论，且用户要求自有适配 | 可逆测试设计、依赖和停止条件；不自动执行 |

同一任务只能有一个主路由，可附加后续 `replication_validation`。无基线却要求变化时，自动降为 `current_deep_snapshot + baseline_created`。

## 3. 把需求拆成“主张优先”的研究问题

不要从“有哪些工具”出发；先定义报告必须回答的主张。每个业务问题登记：

`question_id, decision_use, object_scope, expected_claim_type, required_evidence, maximum_level, owner_module, stop_condition`。

推荐问题树：

1. **对象与市场**：竞品是否真的解决同一购买任务？属于直接竞品、替代品、标杆还是噪声？
2. **位置**：自有 ASIN 在价格、评价壁垒、生命周期、关键词可见性和内容表达上处于何处？
3. **变化**：哪些指标在可比序列中发生了什么变化？何时开始、持续多久、影响哪些变体/词簇？
4. **机制**：价格/Coupon、可见流量、Listing 字段、评论和类目背景中，哪些组合与结果变化时间吻合？
5. **VOC**：消费者赞扬、抱怨和使用场景是什么？样本覆盖能支持到什么程度？
6. **适配**：哪种机制有资格进入自有 ASIN 测试？产品事实、利润、库存、合规和一方数据缺什么？

“深度分析”“看看竞品打法”必须被改写成 3–7 个可验收问题后才能调度专家。

## 4. 共享数据底座：一次取数，多模块消费

### 4.1 第一轮最小身份探测

对每个用户指定 ASIN，优先使用实时 `describe` 后的最小能力核验：

- 当前身份、类目、父子体、变体、价格、评分评论：`asin_detail`；
- 价格、BSR、评分评论、Buy Box、变体历史：`keepa_info`；
- 需要供应商销量估算/父子趋势时：`asin_sales_trend` 或 `asin_prediction`。

第一轮只回答：对象是否有效、父子口径如何、类目是否可比、历史粒度是否足以支持后续模块。身份冲突未解决前，不启动趋势、Listing差异或评论比率。

### 4.2 第二轮按问题补足字段族

| 字段族 | 最小候选能力 | 数据性质 | 主要消费模块 |
|---|---|---|---|
| 价格/Coupon/BSR/评论历史 | `keepa_info`, `asin_coupon_trend`, `asin_detail_with_coupon_trend` | 可见/供应商序列 | 事件、市场 |
| 销量/销售额 | `asin_sales_trend`, `asin_prediction` | 估算/预测 | 市场、事件 |
| 竞品/关联集合 | `asin_competitor`, `traffic_listing`, `competitor_lookup` | 候选集合 | 市场 |
| 自然/广告/推荐词 | `traffic_keyword_stat`, `traffic_keyword`, `traffic_source`, `traffic_listing_stat`, `keyword_order` | 外部可见信号 | 广告、市场、Listing |
| 关键词需求/趋势 | `keyword_miner`, `keyword_research_trends`, `aba_research_trend` | 供应商市场代理 | 市场、广告 |
| 逐条评论 | `review` | 有限语料候选 | VOC |
| 类目结构 | 集中度、价格/评分数/上架期分布工具 | 指定样本代理 | 市场 |

工具名只作路由方向。每个工具本任务首次调用仍须 `search → describe → call`，以实时 schema 为准。

### 4.3 数据版本与资格矩阵

所有响应进入 `temp/market-research/<case-id>/sellersprite-asin-research/`，生成 `dataset-vNN`。总控维护 `module-readiness.csv`：

`module, required_fields, available_fields, object_scope, period, coverage, comparability, blockers, status, dataset_version`。

只有 `ready` 或 `ready_with_limits` 的模块可以产生业务结论；`blocked` 只能交付 data-readiness。

## 5. 五个核心模块的调度与验收

### 5.1 市场竞争格局：默认启用

调用 `amazon-sellersprite-competitive-landscape`，要求回答：

- 对象的购买任务与角色分类；
- 价格带、评价壁垒、生命周期、关键词结构和集中度；
- 自有 ASIN 的相对位置；
- 类目共同变化能否解释单一竞品表现。

验收重点：竞品角色有逐维证据；市场边界明确；不把用户指定竞品静默替换；供应商样本不冒充全市场。

### 5.2 事件与异常：有历史/变化问题时启用

调用 `amazon-sellersprite-event-anomaly-analysis`，要求输出规范化长表、数据质量、基线、趋势/拐点、事件窗口、候选机制评分、混杂和可证伪检查。

验收重点：日/月粒度未混用；BSR方向正确；父子体断点已切分；单点不写变化；无足够时间粒度不做14天研究。

### 5.3 Listing竞品审计：字段通过就绪门时启用

调用 `amazon-sellersprite-listing-competitor-audit`，要求输出字段就绪矩阵、标题/五点/变体编码、事实—利益—证据—条件四元组、竞品差异、历史diff、VOC对齐和自有改进假设。

验收重点：只审计明确返回的完整字段；无旧版本不说改版；媒体只有元数据时不做视觉语义判断；竞品文案不直接迁移。

### 5.4 广告可见性与关键词缺口：研究流量/词时启用

调用 `amazon-sellersprite-ad-visibility-gap-analysis`，要求输出关键词规范化、自然/广告/推荐三通道矩阵、ASIN×词覆盖、位置层级、份额/集中度代理、机制假设、缺口优先级和一方验证队列。

验收重点：外部可见词不冒充Search Term；未返回不等于未投放；代理分母明确；不产生预算、竞价、否词或Campaign执行动作。

### 5.5 评论VOC与异常：语料门通过时启用

调用 `amazon-sellersprite-review-voc-anomaly-screening`，要求输出分页覆盖、确定性去重、codebook、逐评编码、主题提及率、分层、滞后窗口敏感性、近重复/时间集中等异常矩阵和风险handoff。

验收重点：有逐条正文与来源定位；提及率使用eligible去重样本；评论增量/销量估算比不称真实留评率；不得认定刷评、主体或违规。

## 6. 调度消息不是重复 Skill，而是有界任务卡

使用 `assets/expert-task-card.md`。每位专家只接收：研究合同、共享数据版本、3–7个问题、上游文件、禁止主张、强制产物和验收条件。

专家可以提出补数申请，但不得自行扩大市场、替换用户竞品或重复拉取全量数据。追加查询须说明它会支持、推翻或保持哪个 claim；仅为了“更全面”不批准。

## 7. 多轮研究：以证据增益而不是时间为停止条件

研究可多轮返工，不设置固定时长，但必须防止无价值循环。每轮只处理三类事项：

1. `material_gap`：补一个字段/期间会改变 P0/P1 主张或可比性；
2. `claim_conflict`：专家/工具结论冲突且影响执行摘要；
3. `overclaim`：结论越过 L 等级或敏感命题上限。

停止条件满足任一：

- 所有 P0/P1 问题均为 `accepted | accepted_with_limits | blocked_with_reason`；
- 新查询不能改变任何核心主张，只增加重复证据；
- SellerSprite 结构性不可观察，继续查询无法升级；
- 关键缺口只能由第一方/官方/人工材料补足；
- 达到工具分页、期间或字段覆盖边界，且已披露影响。

不得因为“研究时间不设限”而机械调用所有工具或无限翻页。

## 8. 主张级冲突、反证与返工

### 8.1 冲突顺序

按 `dataset_version → marketplace → canonical ASIN → mapping_version → period/timezone → field definition/unit → filter/page/Top-N → data nature` 排查。仍冲突时并列原值，不平均、不投票。

### 8.2 强制反方审查

以下主张不得由原领域专家单独定稿：

- 评论人为干预、变体违规、竞品攻击；
- 竞品真实广告后台动作或内部动机；
- 降价/Coupon/Listing/广告导致销量或BSR变化；
- 任何直接执行建议。

账号风控检查敏感定性；数据专家检查时间和因果；利润/促销/合规等条件专家检查执行门。

### 8.3 返工必须有界

返工消息引用 `claim_id` 或具体表行，指出缺失证据、错误计算、越级措辞或未检查的混杂；不得笼统要求“再深入一点”。旧产物保留并标 `superseded`。

## 9. 从竞品机制到自有 ASIN 验证

每个候选机制通过六门：

1. **可观察门**：竞品动作/信号是否至少为L1/L2；
2. **机制门**：时间、范围和链路是否匹配，替代解释是否列明；
3. **产品事实门**：自有商品确有相应功能、规格、认证与内容权利；
4. **经济门**：涉及价格、Coupon、广告时有利润与保本边界；
5. **库存/履约门**：测试不会因缺货或履约差掩盖结果；
6. **可逆门**：有版本、目标指标、观察窗、停止/回滚条件和人工owner。

状态：

- `observe_only`：证据不足或不可观察；
- `validate_with_first_party_data`：先用真实报表核验；
- `ready_for_reversible_test`：依赖齐备，可交实验/领域专家设计；
- `blocked_economics | blocked_product_fact | blocked_compliance | blocked_inventory`。

总控不得把 `ready_for_reversible_test` 写成“建议直接执行”。

## 10. 最终报告合成：按主张合并，不按专家章节复制

执行摘要只保留最多 5–10 个 P0/P1 主张，每项必须含：

`发生了什么 → 为什么重要 → 证据等级 → 最大不确定性 → 下一步最小验证 → 自有 ASIN 影响`。

正文使用 `assets/final-report-outline.md`。每个核心结论都回链 `claim_id + evidence_id + artifact`。专家冲突、不可比和缺失单列，不藏在脚注。

正式目录：`outputs/market-research/<case-id>/sellersprite-asin-research/`，至少包括：

1. `executive-report.md`
2. `research-contract.md`
3. `asin-and-competitor-register.csv`
4. `module-readiness.csv`
5. `query-and-coverage-log.csv`
6. `evidence-ledger.csv`
7. `claim-and-confidence-register.csv`
8. `expert-status-and-conflicts.md`
9. `action-validation-plan.csv`
10. 启用模块的正式产物

## 11. 总控发布质量门

- [ ] 用户指定对象、父子体、变体、站点和时间全程可追溯；
- [ ] 所有专家消费同一或明确继承的数据版本；
- [ ] 每个核心主张有原值、计算、比较门、L等级、替代解释与下一证据；
- [ ] 同源多维未冒充独立多源；估算/预测未写成真实订单或流量；
- [ ] 单点未写变化，两时点未写长期趋势，月度未伪装日度；
- [ ] Listing、广告、VOC均通过各自字段/语料门；
- [ ] 敏感主张已反方审查，越界结论已降级或剔除；
- [ ] 自有动作通过六门，未执行改价、广告、Listing、投诉或举报；
- [ ] 数据不足的模块明确 `blocked_with_reason`，未用泛泛建议填空；
- [ ] 正式产物只在 `outputs/`，原始响应与中间态只在 `temp/`。

## 12. 失败与降级

- SellerSprite 不可用且无合格上游：只交 `data-readiness.md`；
- 身份/父子体不稳定：停止受影响对象的跨期分析；
- 无历史：只建立当前基线；
- 无日粒度/事件日：不做14天事件研究；
- Listing字段不完整：只做字段覆盖与有限结构观察；
- 无逐条评论正文：不做VOC频率与文本异常；
- 无一方广告/经营数据：只做外部可见性和验证队列；
- 用户要求常驻监控、自动告警或平台动作：交 `scope-boundary.md`，不产生副作用。
