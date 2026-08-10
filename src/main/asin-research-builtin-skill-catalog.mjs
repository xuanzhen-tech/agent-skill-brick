/**
 * SellerSprite ASIN 深度研究 Skill 集群的静态目录。
 *
 * 六个 Skill 均可独立选择和安装；总控 Skill 只负责研究编排，不会让 SDK
 * 固定专家身份或自动启用其它模块。
 */

export const ASIN_RESEARCH_BUILTIN_SKILLS = Object.freeze([
  Object.freeze({
    id: "amazon-sellersprite-ad-visibility-gap-analysis",
    name: "amazon-sellersprite-ad-visibility-gap-analysis",
    version: "0.1.0",
    description: "基于 SellerSprite-only 的 Amazon ASIN、关键词、自然/广告/推荐可见性、价格、BSR 与 Coupon 观察，构建可审计的外部流量与广告研究、词簇缺口、竞争覆盖代理和一方验证队列；不替代 Amazon Ads 第一方报表，不执行账户操作。"
  }),
  Object.freeze({
    id: "amazon-sellersprite-asin-research-orchestrator",
    name: "amazon-sellersprite-asin-research-orchestrator",
    version: "0.1.0",
    description: "编排基于 SellerSprite MCP 的 Amazon 自有 ASIN 与指定竞品 ASIN 深度研究：先冻结对象与问题、建立共享证据底座，再调度市场、事件、Listing、广告可见性、评论 VOC 五个核心模块，实施材料性补数、反证、返工和主张级合并，最终形成可追溯的竞品机制判断与自有 ASIN 验证方案。适用于一次性深研或合格基线比较；不适用于常驻监控、自动告警、平台执行、竞品私有后台还原或 SellerSprite-only 因果认定。"
  }),
  Object.freeze({
    id: "amazon-sellersprite-competitive-landscape",
    name: "amazon-sellersprite-competitive-landscape",
    version: "0.1.0",
    description: "使用 SellerSprite-only 只读证据，对用户已指定的 Amazon 自有/目标 ASIN 与竞品 ASIN 建立可比对象集，分类竞品角色，分析市场结构、价格带、评价壁垒、生命周期与关键词结构，并输出可追溯竞争格局及下游 handoff。适用于竞品识别、竞争地图、市场背景和进入研究；不适用于后台监控、最终投资 Go、利润/备货、广告账户真相、Listing 全审、VOC 编码或竞品内部策略归因。"
  }),
  Object.freeze({
    id: "amazon-sellersprite-event-anomaly-analysis",
    name: "amazon-sellersprite-event-anomaly-analysis",
    version: "0.1.0",
    description: "对 SellerSprite-only 的 Amazon ASIN、父子变体、价格/Coupon、供应商估算销量、BSR、评分与评论、关键词自然/广告可见性和类目背景序列，执行可复算的数据规范化、趋势/异常/拐点筛查、7/14/28 日事件研究、多信号候选机制推理和可证伪检查。适用于指定对象的历史变化、异常窗口与事件假设研究；不适用于持续监控、第一方经营归因、竞品内部操作确认、评论操纵认定或因果确认。"
  }),
  Object.freeze({
    id: "amazon-sellersprite-listing-competitor-audit",
    name: "amazon-sellersprite-listing-competitor-audit",
    version: "0.1.0",
    description: "以 SellerSprite-only 只读 Amazon 数据，对冻结的竞品与自有 ASIN 执行字段级 Listing 竞品审计：核验标题、五点、变体和媒体元数据的可见证据，编码关键词/卖点，比较历史文本，关联合格 VOC，区分可迁移机制与不可迁移内容，并产出可验证的自有 ASIN 改进假设。适用于指定 ASIN 的当前快照和合格基线差异；不抓取页面、不补造未返回字段、不替代 Listing 质量/关键词/文案/图片/VOC 专属 Skill、不证明排名或转化因果。"
  }),
  Object.freeze({
    id: "amazon-sellersprite-review-voc-anomaly-screening",
    name: "amazon-sellersprite-review-voc-anomaly-screening",
    version: "0.1.0",
    description: "仅使用 SellerSprite 中可定位的 Amazon 单条评论结果，构建可审计 VOC 语料并进行有边界的异常模式筛查。覆盖语料验收、分页覆盖、确定性去重、多语言编码、codebook 校准、样本提及率、评论增量与销量估算滞后检查、集中度与近重复筛查、变体范围替代解释及风险交接。不判定评论操纵、买家身份、购买真实性、平台违规或因果归因。"
  })
]);
