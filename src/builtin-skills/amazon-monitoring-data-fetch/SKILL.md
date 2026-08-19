---
name: amazon-monitoring-data-fetch
description: 通过 SellerSprite 与 Sorftime MCP 按用户指定的 Amazon 站点获取并核验 ASIN 的价格、销量估算、BSR、评分、评论和 Listing 变动监控数据，输出标准化 CSV；用户要求竞品监控、ASIN 监控、竞品分析、拉取 ASIN 数据、还原竞品操作或复刻操作时使用。
version: 0.1.1
capabilities: [amazon-asin-monitoring, competitor-monitoring, data-fetch, sellersprite, sorftime]
requiredTools: [sellersprite_mcp, sorftime_mcp]
---

---
name: "amazon-monitoring-data-fetch"
description: "通过 SellerSprite 与 Sorftime MCP 按指定 Amazon 站点获取并核验 ASIN 监控数据（价格、订单估算、BSR、评分、评论、Listing 变动），输出标准化 CSV。"
requiredTools: [sellersprite_mcp, sorftime_mcp]
---

# Amazon ASIN 监控数据获取

通过 SellerSprite 与 Sorftime MCP 获取 ASIN 监控数据，输出标准化 CSV，供竞品监控或后续运营复盘使用。

## 触发条件

适用于：竞品监控、ASIN 监控、竞品分析、获取/拉取 ASIN 数据、操作分析、还原竞品操作、复刻操作、还原动作。

不适用于没有具体 ASIN 的选品或市场调研，以及用户已提供完整数据、仅需归因分析的场景。

## 核心规则

1. 每个数据类型优先 SellerSprite；仅在其配额、限流或不可恢复错误时，对该数据类型使用 Sorftime 降级。
2. 不臆造数据。两源均不可得的数据在 `manifest.json` 中标为 `missing`，继续处理其余数据。
3. 双源冲突时遵循 `references/conflict-resolution.md`；SellerSprite 优先，绝不静默平均。
4. 我方与竞品 ASIN 必须保留 `asin_role`（`own` / `competitor`），不得混合。
5. 日期统一 `YYYY-MM-DD`、UTC+8；日内时间截断到天。
6. 父 ASIN 先展开子 ASIN，每父体最多 30 个子体，记录 `parent_asin`。
7. 每源每次调用最多重试 1 次，避免浪费配额。
8. 不泄露 MCP 凭证。
9. 订单/销量均为估算，必须 `is_estimated=true`；BSR 数值下降代表表现变好。
10. 用户明确提供的 Amazon 站点或站点缩写是本次查询的强约束。必须规范化站点，并仅在该站点查询和输出该 ASIN 的数据；不得悄悄回退到 US 或其他站点。
11. ASIN 的可用性和商品身份必须按站点核验。某 ASIN 在一个站点存在，不代表其在另一个站点存在、商品相同或可直接迁移；不得凭名称、父体、品牌或相似商品臆造跨站“对应 ASIN”。

## 流程

### 1. 解析输入与站点

按 `references/input-parsing.md` 提取 ASIN、角色、意图、站点和时间范围。

- “我方/自己/我的 ASIN”等为 `own`；“竞品/竞争对手/对标”等为 `competitor`。
- 无法判断角色时必须询问用户。
- 识别用户明确写出的站点名称、Amazon 域名或常见英文缩写（如 `US`、`UK`、`DE`、`JP`），按 reference 规范化为 MCP 实际支持的站点代码。
- 若用户提供多个 ASIN 且未逐个指定站点，则把全局站点应用于全部 ASIN；若某 ASIN 带局部站点标注，则局部标注优先。不同站点的 ASIN 必须分组抓取，不能混在同一指标序列中。
- 若站点缩写有歧义、站点不被运行时 MCP 支持，或用户给出相互冲突的站点信息，先澄清；不得猜测或改用默认站点。
- 未指定站点时默认 US，未指定时间范围默认最近 90 天，且须在回复和 `manifest.json` 中说明此假设。

### 2. 发现 MCP 能力与站点核验

每次任务开始，先使用 `sellersprite_mcp` 与 `sorftime_mcp` 的 `help`、`search`、`describe` 发现当前实际工具、支持站点和参数；不得按文档猜测名称或 schema。

参考 `references/mcp-tool-map.md`。把本次工具发现结果写入任务的 `manifest.json`，不要修改 Skill 自身参考文件。两个 MCP 均不可用时停止并说明连接器要求。

对每个 `(ASIN, 规范化站点)`，先用实际可用的商品详情、商品检索或身份查询能力验证该 ASIN 在该站点可定位，并至少记录：查询站点、原始 ASIN、规范化 ASIN、返回商品标识/标题（如可得）、父子关系（如可得）、验证来源与时间。

- 核验成功：仅以该站点返回的 ASIN/商品身份继续抓取。
- 明确未找到：在 `manifest.json` 标记 `asin_site_status=not_found`，记录错误和查询源；不使用其他站点同 ASIN 代替，不臆造跨站对应 ASIN。
- 返回的商品身份明显与用户目标不一致：标记 `identity_mismatch` 并暂停该 ASIN，向用户说明待确认项。
- 因工具限制无法核验：标记 `verification_unavailable`，只在调用端明确接受该站点参数且返回该站点字段时继续；交付摘要中披露限制。

### 3. 展开变体

通过实际可用的变体查询能力在**已核验的同一站点**展开父 ASIN；子体继承角色和 `marketplace` 并写入 `parent_asin`。每父体最多 30 个子体。无法确认变体时保留原 ASIN，不能从其他站点补充变体。

### 4. 获取与标准化

依 `references/data-schema.md` 获取并生成：

- `price.csv`：价格、Coupon、Deal；
- `orders.csv`：订单/销量估算趋势；
- `bsr.csv`：大类与小类 BSR；
- `rating.csv`：评分、评论总量、每日新增评论；
- `reviews.csv`：评论统计和文本样本；
- `review_keywords.csv`：本地提取中英文 unigram/bigram 高频词，最低频次 3；
- `listing_changes.csv`：标题、五点、图片、价格、A+ 等变更及日期。

对每个 `(ASIN, 站点, 数据类型)` 先用主源调用一次。所有 MCP 请求必须携带已验证的对应站点参数（可能是 `site`、`marketplace` 或 `amz_site`，以运行时 schema 为准）。配额失败时记录并切换源重试一次；超时/5xx 时同源等待 3 秒后重试一次，再尝试降级源。评论样本、月度粒度、站点核验限制或无法获取历史变更等限制必须写入 `manifest.json` 和交付摘要。

每条标准化记录均写入该记录实际查询的 `marketplace`。不得将不同站点的价格、货币、BSR、评分、评论、销量估算或排名并入同一可比序列；如用户要求跨站对比，须分别展示站点、币种、ASIN 身份和口径差异。

### 5. 冲突检查

仅在用户明确要求交叉验证/双源对比，或已获得双源数据时，按 `references/conflict-resolution.md` 做同一站点、同一 ASIN、同一日期、同一指标的逐日比较。必须说明双源验证会增加配额消耗。不得跨站点计算数据冲突或平均值。

### 6. 输出与交付

在 `outputs/asin_monitor_<YYYYMMDD_HHMM>/` 输出数据 CSV、必要时的 `data_quality_log.csv`，以及 `manifest.json`。

manifest 至少记录：输入 ASIN 和角色、原始站点输入、规范化站点、默认站点假设（如适用）、每个 `(ASIN, 站点)` 的核验状态和商品身份、父子关系、日期范围、每数据类型状态/来源、配额状态、错误、数据限制、冲突和运行时工具发现结果。

按用户意图返回：监控任务给出当前快照与显著变动；分析任务补充评论关键词对比；纯数据任务交付 CSV 和清单。需要后续复盘时，只有实际存在兼容下游 Skill 才能继续；否则交付数据并明确限制。

## 参考资源

- `references/input-parsing.md`：ASIN、角色、站点解析、站点缩写与核验要求。
- `references/mcp-tool-map.md`：MCP 发现、站点参数、核验与数据粒度限制。
- `references/data-schema.md`：CSV/manifest 输出契约。
- `references/conflict-resolution.md`：双源冲突裁决。
- `references/skill-linkage.md`：后续复盘的数据接口。
