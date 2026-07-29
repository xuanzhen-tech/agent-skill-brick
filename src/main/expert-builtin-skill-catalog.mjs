/**
 * 14 位专家预制 skill 的静态目录。
 *
 * 本文件由迁入包的 SKILL.md 元数据机械生成，只保存产品选择所需的名称、
 * 版本和摘要；完整指令、reference 与 asset 仍以对应预制目录为准。
 */

export const EXPERT_BUILTIN_SKILLS = Object.freeze([
  Object.freeze({
    id: "amazon-account-enforcement-root-cause-analysis",
    name: "amazon-account-enforcement-root-cause-analysis",
    version: "0.1.0",
    description: "对 Amazon 账号或 ASIN 级绩效通知、政策/IP/安全投诉、停用和限制建立事件时间线，识别跨事件模式，验证因果链并提出账号级纠正与预防措施。适用于解释“为什么反复发生、哪个控制失效”；不适用于单个买家案件回复、政策/IP实体裁决、POA写作或用公开市场数据补造账号事实。"
  }),
  Object.freeze({
    id: "amazon-account-health-assessment",
    name: "amazon-account-health-assessment",
    version: "0.1.0",
    description: "对用户上传或可信上游提供的 Amazon 账号健康快照、指标、通知和时间序列执行口径、状态、缺口、可比趋势与行动评估。适用于账号健康复盘、异常准备和整改优先级；不适用于 SP-API 拉取、登录 Seller Central、持续监控、自动告警，或用 SIF、SellerSprite、Sorftime 的公开市场数据补账号事实。"
  }),
  Object.freeze({
    id: "amazon-account-operational-risk-control",
    name: "amazon-account-operational-risk-control",
    version: "0.1.0",
    description: "为合法 Amazon 经营主体建立真实关系披露、最小权限、材料一致性、人员与服务商访问、设备安全、敏感变更和事件响应控制。适用于账号操作风险盘点、合法多实体治理和整改路线图；不适用于反检测、指纹或设备伪装、Cookie/session 操纵、代理轮换、身份/KYC/封禁规避或账号农场设计。"
  }),
  Object.freeze({
    id: "amazon-ad-budget-and-acos-planning",
    name: "amazon-ad-budget-and-acos-planning",
    version: "0.1.0",
    description: "区分实际、目标和保本 ACoS 以及 TACoS，消费真实广告报表与第14专家已验证经济边界，并可按职责组合 SIF、SellerSprite 与 Sorftime 的关键词推广、PPC 或自然趋势作为外部供应商观察，形成透明预算情景和人工决策护栏。适用于预算规划、花费节奏复核和盈亏边界评估；不适用于固定预算比例、行业阈值、自动改预算/竞价、预测必然销量或用供应商观察代替一方销售与广告报表。"
  }),
  Object.freeze({
    id: "amazon-ad-performance-diagnosis",
    name: "amazon-ad-performance-diagnosis",
    version: "0.1.0",
    description: "对用户或可信上游提供的真实 Amazon 广告报表执行报告生命周期、范围、完整性、粒度、稳定 ID 联接、指标重算和驱动诊断，并可按职责组合 SIF 广告可见流量、SellerSprite PPC/广告排名与 Sorftime 自然排名趋势作外部对照。适用于广告表现复盘、异常定位、预算与搜索词决策前的数据验收；不适用于调用 Ads API、拉取或下载报表、用供应商观察替代曝光点击花费归因数据、自动调账或把外部观察写成因果。"
  }),
  Object.freeze({
    id: "amazon-ad-portfolio-planning",
    name: "amazon-ad-portfolio-planning",
    version: "0.1.0",
    description: "基于商品目标、站点、账户范围、预算边界、上游关键词和已验证利润约束，设计可供人工实施的 Amazon 广告 Portfolio、Campaign、Ad Group、Target 与 Ad 结构规格，并可按职责组合 SIF 广告可见结构、SellerSprite PPC/广告排名与 Sorftime 自然排名趋势作外部观察。适用于新建广告架构、重组计划、命名治理和上线前就绪检查；不适用于调用 Ads API、创建或修改广告、自动调价、预算执行或用供应商观察冒充广告账户数据。"
  }),
  Object.freeze({
    id: "amazon-ad-search-term-optimization",
    name: "amazon-ad-search-term-optimization",
    version: "0.1.0",
    description: "将真实 Search Term、Target 与实体报表同第02专家关键词证据联接，并可按职责组合 SIF 关键词/流量贡献、SellerSprite PPC/广告排名与 Sorftime 自然排名趋势作独立外部对照，形成收割、迁移、否定候选、观察和人工复核行动账本。适用于搜索词治理、目标迁移和否定准备；不适用于重新做市场关键词研究、用供应商观察推断广告查询或替代真实报表、自动添加或否定关键词、修改匹配类型或提交广告账户变更。"
  }),
  Object.freeze({
    id: "amazon-aplus-content-planning",
    name: "amazon-aplus-content-planning",
    version: "0.1.0",
    description: "基于已核实产品事实、品牌叙事、VOC与关键词证据，规划 Amazon A+ 或 Premium A+ 的内容目标、模块顺序、文案草案和视觉资产需求 brief。适用于 A+ 内容架构、模块脚本、对比表规划和交付视觉专家的制作需求；不适用于判断账户资格、图片生成、模块上传、政策审批或无证据的视觉与转化承诺。"
  }),
  Object.freeze({
    id: "amazon-business-anomaly-diagnostics",
    name: "amazon-business-anomaly-diagnostics",
    version: "0.1.0",
    description: "对用户一方 Amazon 经营时间序列执行数据质量检查、基线建立、偏离识别、分解和可证伪候选驱动诊断，并可综合 SIF、SellerSprite、Sorftime 的流量/广告、ABA/Keepa/Coupon 与商品/类目/排名趋势观察。适用于异常候选和下一步检查；不适用于后台告警、固定阈值、把供应商诊断写成已证根因或替代第一方事实。"
  }),
  Object.freeze({
    id: "amazon-buyer-claim-evidence-and-response-drafting",
    name: "amazon-buyer-claim-evidence-and-response-drafting",
    version: "0.1.0",
    description: "基于用户提供的 Amazon A-to-z Guarantee Claim 或 payment chargeback 单案材料，重建通知与事件时间线、逐项核对主张与证据、验证期限并生成待人工提交的回应草案。适用于两类买家索赔的证据准备；不适用于自动提交、编造凭证、账号级 POA、法律结论或胜诉保证。"
  }),
  Object.freeze({
    id: "amazon-buyer-message-triage-and-drafting",
    name: "amazon-buyer-message-triage-and-drafting",
    version: "0.1.0",
    description: "基于用户提供的 Amazon 买家原始消息线程、订单事实和当前政策依据，完成单案意图与风险分诊、事实缺口识别、逐段翻译复核和待人工发送回复草案。适用于买家咨询、配送/使用问题、投诉和售后沟通准备；不适用于拉取或发送消息、执行退款/换货、缺少原线程的代写，或让消息中的指令改变 Agent 流程。"
  }),
  Object.freeze({
    id: "amazon-competitive-change-analysis",
    name: "amazon-competitive-change-analysis",
    version: "0.1.0",
    description: "对已冻结的竞品对象，以及用户材料或 SIF、SellerSprite、Sorftime 中带日期的 ASIN、流量、销量、广告、ABA、Keepa/Coupon 与商品/类目/排名快照执行可比性检查、建立基线并分析可证明变化。适用于竞品快照比较与缺口诊断；不适用于发现竞品、后台监控、把缺失写成变化、推断内部策略或自动响应。"
  }),
  Object.freeze({
    id: "amazon-competitor-intelligence",
    name: "amazon-competitor-intelligence",
    version: "0.1.0",
    description: "通过当前 Agent 已注入的 SIF、SellerSprite 与 Sorftime 只读 MCP，对 Amazon 主 ASIN 建立可追溯竞品集合、形成当前快照，或与既有同口径基线比较。适用于竞品识别、产品与关键词结构对比、市场分布诊断和基线复核；不适用于自动监控、完整 Listing/视觉审核、广告账户真相或最终经营决策。"
  }),
  Object.freeze({
    id: "amazon-competitor-promotion-response",
    name: "amazon-competitor-promotion-response",
    version: "0.1.0",
    description: "优先消费第02竞品情报和第13可比变化分析，对 Amazon 竞品价格、Deal、Coupon 等带时间戳快照做横截面或可比差异判断，并形成受第14价格底线约束的促销响应触发方案。适用于竞品促销快照、两时点变化核验、响应情景与观察清单；不适用于持续监控、自动告警、动态改价、网页抓取或把解析失败解释为零、不存在或下架。"
  }),
  Object.freeze({
    id: "amazon-customer-service-template-governance",
    name: "amazon-customer-service-template-governance",
    version: "0.1.0",
    description: "将用户提供的 Amazon 客服历史回复、当前政策依据和已批准品牌语言整理为可追溯、可版本化、仅供人工使用的模板库。适用于模板抽取、变量化、承诺/PII/翻译审查、审批和退役；不适用于发送消息、把历史话术视为政策、自动批准敏感承诺或连接客服平台。"
  }),
  Object.freeze({
    id: "amazon-deal-calendar-coordination",
    name: "amazon-deal-calendar-coordination",
    version: "0.1.0",
    description: "把用户确认的 Amazon Deal 或促销窗口、资格材料、价格、经济性、库存、素材、预算、审批和负责人组织成带时区的日历与 go/no-go 就绪账本。适用于活动排期、截止日协调、依赖与责任追踪、上线前就绪检查；不适用于判断未证资格、活动报名或提交、创建提醒/Cron、后台操作或把未知日期补成默认值。"
  }),
  Object.freeze({
    id: "amazon-demand-seasonality-research",
    name: "amazon-demand-seasonality-research",
    version: "0.1.0",
    description: "通过当前 Agent 已注入的 SIF、SellerSprite 与 Sorftime 只读 MCP，研究 Amazon 关键词主题或 ASIN 集合的历史需求方向、周期性与季节窗口。适用于站内趋势、旺淡季、准备窗口和异常核查；不适用于无历史证据的预测、单位经济或最终备货决策。"
  }),
  Object.freeze({
    id: "amazon-experiment-analysis",
    name: "amazon-experiment-analysis",
    version: "0.1.0",
    description: "为 Amazon Listing、视觉、广告、促销等干预定义版本化测量协议，并用用户一方分组、曝光和结果检查随机化、数据质量、效应与不确定性；可按需把 SIF、SellerSprite、Sorftime 信号作为独立外部背景。适用于实验设计审查和结果分析；不适用于执行分流、用供应商观察证明实验结果、把非随机观察称为因果或保证收益。"
  }),
  Object.freeze({
    id: "amazon-fba-shipment-readiness",
    name: "amazon-fba-shipment-readiness",
    version: "0.1.0",
    description: "基于用户材料与可信上游正式产物，审查 Amazon FBA 人工建件所需资料是否就绪，并生成可追溯的缺口清单与人工交接包。适用于用户希望在人工建件前盘点 SKU、数量、包装、标签、目的信息和账户状态材料；不适用于创建或提交货件、查询或修复账户/商品状态、生成标签、计算补货或运输经济性。"
  }),
  Object.freeze({
    id: "amazon-fx-payout-exposure-analysis",
    name: "amazon-fx-payout-exposure-analysis",
    version: "0.1.0",
    description: "分析 Amazon 跨币种 payout、渠道结算与银行到账的汇率和金额差异；适用于把参考中间价、渠道报价率、结算有效率、银行到账有效率分开，核对同一交易链、金额分子分母、显式费用和未解释差额，或在报价不可比、证据不足时失败关闭。"
  }),
  Object.freeze({
    id: "amazon-keyword-traffic-research",
    name: "amazon-keyword-traffic-research",
    version: "0.1.0",
    description: "通过当前 Agent 已注入的 SIF、SellerSprite 与 Sorftime 只读 MCP，分通道研究 Amazon 市场词、ASIN 词、Listing 流量与供应商可见广告背景。适用于需求、竞争、趋势、关联词和流量结构；不适用于 Search Term Report、真实归因、广告执行或 Listing 写作。"
  }),
  Object.freeze({
    id: "amazon-kpi-reporting-system",
    name: "amazon-kpi-reporting-system",
    version: "0.1.0",
    description: "基于用户一方输入与可信上游结果定义版本化 KPI 口径，并可将 SIF、SellerSprite、Sorftime 的关键词、ASIN、流量、销量、广告和市场趋势作为独立外部观察。适用于指标定义、按需报表、周期对比和数据就绪度；不适用于重建利润/库存、后台任务、自动推送，或用供应商观察替代第一方 KPI。"
  }),
  Object.freeze({
    id: "amazon-listing-copy-development",
    name: "amazon-listing-copy-development",
    version: "0.1.0",
    description: "基于已核实产品事实、可追溯关键词架构和用户品牌要求，开发或改写 Amazon Listing 标题、要点、描述与后台词候选，并执行跨语言含义、宣称和可读性质量检查。适用于新 Listing 文案、现有文案重写、多语言本地化和字段级交付；不适用于关键词市场研究、A+完整规划、图片生成、后台发布或无证据卖点创作。"
  }),
  Object.freeze({
    id: "amazon-listing-experiment-design",
    name: "amazon-listing-experiment-design",
    version: "0.1.0",
    description: "为 Amazon Listing 改版定义可交接的实验干预：冻结对照/处理版本、验证单一内容变量、记录实施资格与回滚条件，并把测量问题交给数据分析专家。适用于 Listing A/B 方案、版本差异审查和实验干预就绪检查；不负责 KPI 合同、样本量、观察窗口、停止规则、统计计算、因果解释、后台执行或持续监控。"
  }),
  Object.freeze({
    id: "amazon-listing-keyword-architecture",
    name: "amazon-listing-keyword-architecture",
    version: "0.1.0",
    description: "基于可信上游、用户资料或当前 Agent 已注入的 SIF、SellerSprite、Sorftime 只读 MCP 证据，为 Amazon Listing 设计标题、要点、描述和后台词的关键词分层、字段布局与覆盖校验。适用于关键词架构；不适用于广泛市场研究、文案成稿或排名保证。"
  }),
  Object.freeze({
    id: "amazon-listing-quality-audit",
    name: "amazon-listing-quality-audit",
    version: "0.1.0",
    description: "对 Amazon Listing 的标题、要点、描述、关键词使用、事实宣称、可读性和跨字段一致性执行逐问题证据化审计，为每个问题说明证据、影响、修复动作与复核方式。适用于现有 Listing 诊断、改稿前审计、优化优先级和修订验收；不适用于万能评分、广泛关键词研究、图片审计、后台发布或无证据的排名与转化预测。"
  }),
  Object.freeze({
    id: "amazon-market-entry-assessment",
    name: "amazon-market-entry-assessment",
    version: "0.1.0",
    description: "通过当前 Agent 已注入的 SIF、SellerSprite 与 Sorftime 只读 MCP，对一个或多个 Amazon 站点分别研究关键词、竞品、市场分布、销量与流量背景，形成可追溯的进入验证优先级。适用于首站选择和多站点条件比较；不适用于非 Amazon 平台、税务合规或最终投资 Go。"
  }),
  Object.freeze({
    id: "amazon-opportunity-discovery",
    name: "amazon-opportunity-discovery",
    version: "0.1.0",
    description: "使用当前 Agent 已注入的 SIF、SellerSprite 与 Sorftime MCP，从 Amazon 站点、类目、关键词主题或种子 ASIN 中发现并整理候选机会池。适用于宽漏斗选品、需求与竞争扫描、类目结构、竞品发现和流量结构观察；不适用于把供应商估算当 Amazon 一方事实、完整利润核算或上市执行计划。"
  }),
  Object.freeze({
    id: "amazon-opportunity-validation",
    name: "amazon-opportunity-validation",
    version: "0.1.0",
    description: "对 Amazon 候选 ASIN 或产品构想做深度证据核验、可配置透明评分和 Go Watch Kill 分层。适用于比较候选、验证需求趋势、竞争与关键词窗口、解释排名依据；不适用于宽漏斗找类目、单独计算完整单位经济或制定上市实验计划。"
  }),
  Object.freeze({
    id: "amazon-poa-evidence-and-draft",
    name: "amazon-poa-evidence-and-draft",
    version: "0.1.0",
    description: "基于已有账号执法根因、Amazon 通知原文、整改进度和可核验附件，建立陈述与证据对应关系并起草供人工审核的 Amazon Plan of Action。适用于 POA 证据准备、行动核验、附件索引和草案质检；不适用于重新猜测根因、自动提交申诉、伪造完成状态或承诺账号恢复。"
  }),
  Object.freeze({
    id: "amazon-policy-change-impact-assessment",
    name: "amazon-policy-change-impact-assessment",
    version: "0.1.0",
    description: "对用户或可信上游提供的带日期 Amazon 政策原文执行版本冻结、段落级差异、适用范围、影响对象、行动和证据评估，并生成可供内置经营分析消费的 policy impact handoff。适用于单次政策变更评估和业务整改准备；不适用于 Web/RSS 抓取、持续监控、自动推送、把摘要当原文或在缺少当前政策文本时声称“最新政策”。"
  }),
  Object.freeze({
    id: "amazon-pricing-margin-guardrails",
    name: "amazon-pricing-margin-guardrails",
    version: "0.1.0",
    description: "把 amazon-operating-analysis 已批准的价格与贡献情景原样整理成可审计的 Amazon 价格/毛利护栏，供广告和促销规划使用；适用于建立、复核、更新或撤销价格底线，检查币种、税费、履约、Offer 叠加与有效期口径，以及在上游情景缺失或冲突时失败关闭；不适用于重算利润、生成新底线、动态调价或执行平台动作。"
  }),
  Object.freeze({
    id: "amazon-product-image-quality-audit",
    name: "amazon-product-image-quality-audit",
    version: "0.1.0",
    description: "对 Amazon 主图、副图、场景图、生活方式图和 A+ 视觉资产执行版本冻结、可观察证据、产品事实、信息层级、跨图一致性与权利来源审计。适用于现有图片诊断、改图前问题定位、生成结果验收和局部返工交接；不适用于图片生成或编辑、任意评分与权重、CTR/CVR 预测、网页抓取、平台合规保证或看不到图片时臆测视觉问题。"
  }),
  Object.freeze({
    id: "amazon-product-infographic-specification",
    name: "amazon-product-infographic-specification",
    version: "0.1.0",
    description: "把已核实的产品尺寸、功能、组成、差异和使用步骤转成 Amazon 信息图、对比图、尺寸图、功能标注图或操作图的可执行制作规格。适用于事实到版面信息结构、callout 数据账本、底图需求和制作验收；不适用于图片生成或编辑、A+ 模块规划、无证据比较、固定平台规格、网页抓取，或没有确定性排版能力时冒充已完成成品。"
  }),
  Object.freeze({
    id: "amazon-product-validation-plan",
    name: "amazon-product-validation-plan",
    version: "0.1.0",
    description: "把已筛选的 Amazon 产品机会转化为带假设、证据、负责人、成本、截止时间和 Go Watch Kill 门槛的新品验证计划。适用于打样前验证、上市倒排、最小可行测试和阶段闸门；不适用于首次找品或在关键成本和交期缺失时承诺上架日期。"
  }),
  Object.freeze({
    id: "amazon-product-video-storyboard",
    name: "amazon-product-video-storyboard",
    version: "0.1.0",
    description: "基于已核实产品事实、品牌目标、素材权利和投放约束，为 Amazon 主图视频、品牌视频、功能演示或使用教程编制创意 brief、脚本、镜头清单与分镜。适用于事实到叙事、逐镜证据、口播字幕、连续性、安全和制作交接；不适用于视频生成、拍摄、剪辑、上传、后台监控、平台资格裁定、视觉趋势抓取或无证据的效果承诺。"
  }),
  Object.freeze({
    id: "amazon-promotion-economics-evaluation",
    name: "amazon-promotion-economics-evaluation",
    version: "0.1.0",
    description: "消费第14利润管理专家的已验证单位贡献与价格底线，计算 Amazon 促销折扣、兑换、蚕食、增量订单、退货、履约增量和固定费情景，区分销量倍数与 lift 并判断维持贡献目标所需销量；必要时仅把 SIF 销量/门槛、SellerSprite Coupon/Keepa 转述或 Sorftime 商品趋势作为探索背景。适用于促销经济性、保本销量倍数、情景与 go/no-go 评估；不适用于重建全成本利润、预测真实销量、活动报名或把供应商估算当作一方销售。"
  }),
  Object.freeze({
    id: "amazon-promotion-message-briefing",
    name: "amazon-promotion-message-briefing",
    version: "0.1.0",
    description: "把已批准 Amazon Offer 的优惠事实、期限、资格、排除、触发、退出和抑制规则整理成渠道中立的促销消息 brief，供第12品牌营销专家继续设计渠道与执行。适用于活动消息事实包、受众资格与停止条件、稀缺性核验和跨渠道交接；不适用于完整营销文案、ESP/邮件自动化、发送、渠道选择、虚构库存或销量紧迫感。"
  }),
  Object.freeze({
    id: "amazon-promotion-price-planning",
    name: "amazon-promotion-price-planning",
    version: "0.1.0",
    description: "基于用户资料、可信上游输出及可选的 SIF ASIN 画像、SellerSprite Coupon/Keepa 转述和 Sorftime 商品价格趋势，分开 Amazon 当前价、历史价、竞品价与计划活动价，核验已确认的优惠叠加并形成受利润底线约束的促销价格方案。适用于折扣价格规划、优惠叠加核算、价格包络与活动前价格就绪检查；不适用于重建利润、动态调价、Deal/Coupon 正式历史或资格判断、活动费、后台改价或报名提交。"
  }),
  Object.freeze({
    id: "amazon-ranking-trend-analysis",
    name: "amazon-ranking-trend-analysis",
    version: "0.1.0",
    description: "基于用户材料或 SIF、SellerSprite、Sorftime 的同类带日期 Amazon 排名/ABA/商品趋势观察，分别建立 BSR、关键词自然位置、广告位置和可见性序列，经口径对齐后生成按需趋势分析。适用于排名可比性与上下文对齐；不适用于关键词发现、后台监控、混合排名体系、保证自然排名或把未返回解释为掉榜。"
  }),
  Object.freeze({
    id: "amazon-replenishment-execution-readiness",
    name: "amazon-replenishment-execution-readiness",
    version: "0.1.0",
    description: "消费 Product 内置库存台账与经营分析的带版本正式输出，审查补货候选是否具备人工执行条件并生成阻塞清单。适用于用户已取得两项强制上游产物，希望把补货候选交给采购、调拨或建件责任方前核对版本、口径、依赖和批准；不适用于重新预测需求、计算补货量/安全库存、下单、调拨或创建货件。"
  }),
  Object.freeze({
    id: "amazon-return-refund-case-triage-and-analysis",
    name: "amazon-return-refund-case-triage-and-analysis",
    version: "0.1.0",
    description: "基于用户提供的单笔订单、退货、实物退回、退款、换货、补偿与拒付材料，重建事件链、核对金额与状态、判断理由可信度并生成待人工处理方案。适用于 Amazon 单个售后案件的事实分诊；不适用于执行退款/换货、仓内处置、跨案件根因分析或在没有有效分母时计算总体比率。"
  }),
  Object.freeze({
    id: "amazon-review-request-readiness",
    name: "amazon-review-request-readiness",
    version: "0.1.0",
    description: "基于用户提供的订单、送达、既有请求记录和当前 Amazon 政策依据，对单笔订单形成可追溯的 Review 请求人工执行就绪判断。适用于核对政策窗口、重复请求和敏感案件阻塞；不适用于发送请求、编写诱导性话术、按好评概率筛选买家或用固定天数代替当前政策。"
  }),
  Object.freeze({
    id: "amazon-review-voc-research",
    name: "amazon-review-voc-research",
    version: "0.1.0",
    description: "对用户、uploads、可信上游或 SellerSprite/Sorftime 只读 MCP 返回的 Amazon 评论正文做可追溯 VOC 研究，覆盖匿名化、去重、样本覆盖、主题编码、痛点、正向体验与反证。适用于竞品评论拆解、产品改良证据和购买后 VOC；不适用于网页抓取、全网舆情、销量分析、把供应商摘要当逐条评论或把样本频率外推为全市场发生率。"
  }),
  Object.freeze({
    id: "amazon-unit-economics",
    name: "amazon-unit-economics",
    version: "0.1.0",
    description: "为 Amazon 候选 SKU 整理用户口径的成本输入、调用或消费内置利润包的正式结果，并复核 CM1 CM2 CM3、完全负担贡献、保本 ACoS ROAS 与敏感性。适用于选品利润验证和成本冲击评估；不适用于仅凭 SIF、SellerSprite 或 Sorftime 的供应商价格、销量、利润率或门槛给出盈利结论。"
  }),
  Object.freeze({
    id: "amazon-visual-localization-brief",
    name: "amazon-visual-localization-brief",
    version: "0.1.0",
    description: "基于已核实产品事实、品牌资产、权利状态和目标市场证据，为 Amazon 主图、场景图、生活方式图及 A+ 视觉需求编制市场本地化制作 brief。适用于视觉方向、场景设定、构图语言、资产处理约束和生图前交接；不适用于实际图片生成、编辑、批量任务、版本管理、网页趋势抓取、地域刻板印象或无证据的审美与合规结论。"
  }),
  Object.freeze({
    id: "amazon-working-capital-action-control",
    name: "amazon-working-capital-action-control",
    version: "0.1.0",
    description: "治理已有领域责任方提出的 Amazon 资金行动候选；适用于把现金流情景与采购、补货、广告、促销、税费等正式行动关联，登记资金影响和依赖，分开人工批准与外部承诺，并在行动身份、领域 owner、可推迟证据或关键字段缺失时失败关闭；不适用于根据现金流发明行动、自动审批或排序，也不执行下单、调拨、付款或融资。"
  }),
  Object.freeze({
    id: "brand-content-strategy-and-calendar",
    name: "brand-content-strategy-and-calendar",
    version: "0.1.0",
    description: "基于品牌事实、已批准声明与资产、受众目标及当前趋势证据，并按需综合 SIF、SellerSprite、Sorftime 的 Amazon 需求词、公开 VOC、A+ 分布和 Amazon/TikTok 趋势观察，形成品牌内容支柱、信息架构、内容 brief 与静态人工审批日历。适用于品牌内容策略和季节/事件规划；不适用于生成未证促销事实、制作视觉资产、自动排程或发布。"
  }),
  Object.freeze({
    id: "creator-partnership-planning",
    name: "creator-partnership-planning",
    version: "0.1.0",
    description: "基于用户提供的 creator dossier，并在任务明确指定 TikTok 平台、站点和对象时按需补充 Sorftime 的公开视频/作者观察，形成候选筛选、证据缺口、风险门禁和待人工审批合作 brief。适用于 creator 合作前的信息核对与策划；不适用于把公开作者数据当身份、受众去重、商业条件、rights 或效果证明，也不联系、签约、付款或发布。"
  }),
  Object.freeze({
    id: "cross-border-freight-option-comparison",
    name: "cross-border-freight-option-comparison",
    version: "0.1.0",
    description: "仅基于用户提供的跨境货运报价，按各报价原始计费规则复核并比较运输方案，输出可追溯的可比性结论与人工询价缺口。适用于用户已提供两份或更多报价，希望核对计费重、附加费、时效、有效期和服务条件后比较可比方案；不适用于主动询价、订舱、付款、轨迹监控、清关税务判断或运输利润决策。"
  }),
  Object.freeze({
    id: "cross-border-intellectual-property-risk-triage",
    name: "cross-border-intellectual-property-risk-triage",
    version: "0.1.0",
    description: "对商品名称、品牌、Logo、文案、图片、包装、设计、技术特征和权利资料执行商标、版权、外观/设计与专利风险初筛，并在用户明确要求时使用 SellerSprite 形成供应商商标检索线索。适用于上市前权利盘点、投诉前预防和素材使用检查；不适用于把供应商线索当官方检索、法律侵权结论、无冲突保证、注册、诉讼或律师意见。"
  }),
  Object.freeze({
    id: "cross-border-product-compliance-readiness",
    name: "cross-border-product-compliance-readiness",
    version: "0.1.0",
    description: "根据产品、目标市场、站点和用户提供的带日期现行依据，整理认证、测试、标签、包装、技术文件、责任主体与专业核验缺口，形成跨境商品合规就绪包。适用于上市前资料盘点、市场变更影响和专业咨询准备；不适用于把静态知识当现行法律、出具认证/法律结论、代办注册或从 Web 抓取法规。"
  }),
  Object.freeze({
    id: "cross-border-tax-obligation-scoping",
    name: "cross-border-tax-obligation-scoping",
    version: "0.1.0",
    description: "基于业务实体、货物流、库存、销售渠道、客户类型、付款和用户提供的带日期税务依据，识别跨境税务义务问题、注册/申报证据缺口与专业咨询路径。适用于新市场进入、业务模式变化和税务资料盘点；不适用于计算或申报税款、给出确定税务意见、硬编码税率/阈值或从 Web 获取现行税法。"
  }),
  Object.freeze({
    id: "customs-classification-and-duty-readiness",
    name: "customs-classification-and-duty-readiness",
    version: "0.1.0",
    description: "整理商品构成、功能、用途、原产地、估价、候选税则编码、税率与贸易救济依据，形成报关分类和税费专业确认就绪包。适用于新品进口准备、编码复核和物流/利润交接；不适用于自行确定 HS/税则编码、税率、反倾销措施或应缴金额，也不从免费网站、Web 或外部 API 抓取海关数据。"
  }),
  Object.freeze({
    id: "dtc-store-operations-planning",
    name: "dtc-store-operations-planning",
    version: "0.1.0",
    description: "将用户或可信上游提供的 DTC 店铺商品、订单、库存、折扣和配置快照，转换成带对象范围、前置条件、领域责任人、审批、回滚与验证的静态变更工作包。适用于 Shopify 等 DTC 店铺运营变更前的跨专家编排；不适用于读取实时店铺、调用 Shopify CLI/API、创建商品、处理订单或修改价格、折扣、库存和配置。"
  }),
  Object.freeze({
    id: "email-lifecycle-campaign-design",
    name: "email-lifecycle-campaign-design",
    version: "0.1.0",
    description: "基于用户提供的生命周期定义、许可/同意、suppression、受众规则、品牌与商品事实及结果数据，设计带 trigger、branch、exclusion、wait、exit 和测量交接的待人工审核邮件流程与草稿。适用于 DTC 邮件生命周期和 campaign 设计；不适用于默认同意、采集邮箱、写死等待/频次、连接 ESP、上传名单、排程或发送邮件。"
  }),
  Object.freeze({
    id: "offsite-paid-media-briefing",
    name: "offsite-paid-media-briefing",
    version: "0.1.0",
    description: "为 Meta、Google 或其他站外付费媒体形成目标、受众假设、素材需求、落地页、预算护栏、媒体干预事实和交给第13专家的测量问题。适用于站外付费媒体策划与跨团队交接；不适用于自行定义 KPI、样本、停止规则、分析窗口或实验协议，不调用平台 API、查询受众、配置像素、创建或发布广告、修改预算，也不替代第12专家的品牌与渠道内容策略。"
  }),
  Object.freeze({
    id: "procurement-quality-and-delivery-planning",
    name: "procurement-quality-and-delivery-planning",
    version: "0.1.0",
    description: "将已确认规格、CTQ、样品、金样、检查节点、验收规则、变更审批、偏差、CAPA 和采购里程碑组织为可交接的质量与交付计划。适用于打样、小批、量产前的采购执行准备和异常闭环设计；不适用于实际验货、催单、供应商系统操作，也不擅自设定 AQL、抽样量或通用验收阈值。"
  }),
  Object.freeze({
    id: "social-channel-content-adaptation",
    name: "social-channel-content-adaptation",
    version: "0.1.0",
    description: "将带版本、审批状态和声明依据的核心品牌内容，依据用户提供的当前渠道规则改写为逐渠道待人工审核草稿；当任务明确指定 TikTok 平台、站点和对象时，可用 Sorftime 公热视频/作者观察补充内容形态背景。适用于格式、语气、locale 与 CTA 适配；不适用于把供应商观察当渠道规则、生成未证声明、回复互动、排程或发布。"
  }),
  Object.freeze({
    id: "supplier-evaluation-and-due-diligence",
    name: "supplier-evaluation-and-due-diligence",
    version: "0.1.0",
    description: "对用户已有的供应商候选、主体资料、证照、样品、报价、工厂信息和人工核验记录执行证据化评估，识别身份冲突、能力缺口、待核验声明与升级动作。适用于候选初筛、资料尽调、样品前后复核和采购决策准备；不适用于外部 OSINT 搜索、企业背调、供应商推荐或“绝对可信”保证。"
  }),
  Object.freeze({
    id: "supplier-quote-and-cost-comparison",
    name: "supplier-quote-and-cost-comparison",
    version: "0.1.0",
    description: "将用户已有供应商报价按产品版本、数量、币种、单位、MOQ、价格阶梯、Incoterms、地点、付款、模具、包装、测试、交期和有效期归一，判断可比性并形成采购范围内的成本比较。适用于多供应商报价评审、重报价差异和谈判准备；不适用于抓取报价、询价、汇率猜测、到岸利润重建或下采购单。"
  }),
  Object.freeze({
    id: "supplier-sourcing-readiness",
    name: "supplier-sourcing-readiness",
    version: "0.1.0",
    description: "把产品目标、技术规格、质量要求、MOQ、成本范围、交付节奏和商业限制整理成可外发 RFQ、供应商搜索要求与候选池字段，并在用户明确要求时建立可追溯的 1688 待核验候选线索。适用于采购寻源启动、需求澄清、RFQ 准备和候选评估前的数据就绪；不适用于把平台线索当作已寻源、已核验或直接推荐的供应商，也不执行询价、验厂、下单或外部 OSINT。"
  }),
  Object.freeze({
    id: "supply-risk-scenario-planning",
    name: "supply-risk-scenario-planning",
    version: "0.1.0",
    description: "基于用户或可信上游提供的供应来源、交期、价格、质量、产能和中断证据，构建按需供应风险情景、触发条件、缓解选项、决策闸门和责任计划。适用于单一来源、交期波动、质量异常、价格变化和供应中断准备；不适用于实时监控、自动告警、外部风险抓取或无证据宣称风险正在发生。"
  }),
  Object.freeze({
    id: "warehouse-return-disposition-planning",
    name: "warehouse-return-disposition-planning",
    version: "0.1.0",
    description: "基于用户提供的退货身份、检验与价值证据形成仓内处置候选，并通过所有权、可逆性和人工审批门控输出可追溯计划。适用于用户已提供仓内退货、拒收、残损或待检库存材料，希望比较处置候选并准备人工审批；不适用于实际移库/翻新/退供/销毁、买家退款或索赔、替代第 09 合规证据、重建第 14 价值模型或修改库存。"
  })
]);
