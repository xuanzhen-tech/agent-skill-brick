# Amazon ASIN 深度研究 Skill 集群 v0.1（待审核）

## 定位

本包是供 Agent 自身执行任务的 Skill 草案，不是面向用户的操作手册，也未安装到正式 Skill 目录。目标流程是：输入 Amazon 站点、自有 ASIN、已指定竞品 ASIN和研究问题，使用 SellerSprite MCP 进行按需、多轮、可追溯研究，由五个核心专家完成领域分析，最终由客户助理整合为深度 Report。

本集群不是后台常驻监控器，不承诺实时告警、自动操作、竞品后台还原或严格因果归因。

## 集群组成

| Skill | 默认责任专家 | 作用 |
|---|---|---|
| `amazon-sellersprite-asin-research-orchestrator` | 客户助理 | 冻结研究合同、调度、共享数据、补数/返工、冲突处理和最终报告 |
| `amazon-sellersprite-competitive-landscape` | 市场调研专家 | 竞品身份、角色分层、市场结构、需求与竞争背景 |
| `amazon-sellersprite-event-anomaly-analysis` | 数据分析专家 | 可比性、趋势、拐点、事件窗口、多信号推断和反证 |
| `amazon-sellersprite-listing-competitor-audit` | Listing 优化专家 | 当前 Listing 字段证据、历史差异门、关键词/VOC 交接 |
| `amazon-sellersprite-ad-visibility-gap-analysis` | 广告投放专家 | 外部可见广告/自然词/流量结构与关键词缺口 |
| `amazon-sellersprite-review-voc-anomaly-screening` | 客服体验专家 | 合格评论语料、VOC、样本内提及率和异常模式筛查 |

## 共用合同

- `references/research-contract.md`：研究输入、对象、时间和共享数据版本。
- `references/sellersprite-mcp-contract.md`：SellerSprite-only 调用和证据留存。
- `references/evidence-claims-contract.md`：L0–L4、事实/计算/推断/假设分层。
- `references/collaboration-handoff-contract.md`：专家任务、补数、返工、冲突与 handoff。
- `assets/`：任务卡、补数申请、最终报告目录及 CSV 表头模板。

## 关键设计决定

1. **一个统一数据底座**：默认由总控协调采集；专家不得各自无约束重拉全套数据。
2. **模块按条件启用**：五个专家是核心目录，不等于每次都必须执行所有分支。没有评论正文时，VOC 模块降级；没有基线时，变化分析仅建基线。
3. **同源多维不等于独立多源**：多个 SellerSprite 端点可以增强模式解释，但不能升级为独立来源验证。
4. **推理有上限**：价格/Coupon等可见机制可形成较强候选；“刷评”、竞品真实广告账户和内部动机在 SellerSprite-only 路径不能被认定。
5. **复用现有领域 Skill**：本集群是任务适配层，不复制已有竞品、季节性、Listing、广告、VOC等方法论；进入相应深层任务时遵守原 Skill 的数据门和输出上限。
6. **先跑真实案例再安装**：建议用 3–5 个真实案例验证工具覆盖、专家返工率、报告价值与上下文成本，再修订至 v1.0。

## 审核重点

- 五个模块的职责是否仍有重叠；
- 哪些模块应固定调度，哪些应数据触发；
- L0–L4 证据上限是否符合你的业务语言；
- 2%–3% 是否保留为“用户指定筛查线”而非行业/合规阈值；
- 最终 Report 的行动建议是否需要强制利润、促销、风控等条件专家复核；
- 输出文件是否过多，是否需要合并为更精简的正式交付。
