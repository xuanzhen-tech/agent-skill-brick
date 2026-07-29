<!--
文件功能：提供 SIF 外层工具、目标 Amazon 站点或关键机器 schema 未就绪时的数据准备结构。
职责边界：只说明缺失能力、拟执行的 describe/call 和恢复条件，不索要密钥、不提供连接配置，也不调用其他外部来源。
关联关系：由 ../../SKILL.md 的失败关闭分支生成；最低证据要求见 ../../references/market-entry-evidence-contract.md。
-->

# Amazon 市场进入数据准备清单

## 当前状态

- Case ID：
- 状态：blocked / out_of_scope
- 阻断站点：
- 阻断阶段：外层工具 / 站点支持 / 机器 schema / 需求 / 竞争 / ASIN 背景 / 相邻专业输出

## 已确认输入

- 产品/关键词主题：
- 候选 Amazon 站点：
- 决策用途：
- 目标期间：
- 用户硬约束：

## 缺失能力

| 站点 | 缺失工具/字段/证据 | 当前观察 | 为什么阻断 | 责任边界 |
|---|---|---|---|---|
|  |  |  |  | 连接层 / SIF / 用户资料 / 上游 |

## 拟执行 SIF 查询

| 站点 | 业务目的 | 精确工具名 | 首次 describe 状态 | 机器 inputSchema 所需参数 | 所需实际结果 |
|---|---|---|---|---|---|
|  | 关键词需求 | `market_get_keyword_demand` |  |  |  |
|  | 关键词竞争 | `market_get_keyword_competition` |  |  |  |
|  | 竞品发现 | `market_get_keyword_root_competitors` |  |  |  |
|  | ASIN 背景 | profile / sales / traffic 的最小工具 |  |  |  |
|  | 周期趋势 | `amazon-demand-seasonality-research` 正式输出 | not_applicable | 来源文件、版本、期间与 Evidence IDs |  |
|  | 关键词专题 | `amazon-keyword-traffic-research` 正式输出 | not_applicable | 来源文件、版本、期间与 Evidence IDs |  |

## 非工具缺口

- 汇率：
- 税费：
- 合规：
- 物流：
- 文化/本地化：
- 单位经济：
- 团队能力：

## 恢复条件

- `sif_mcp` 可见；
- 每个拟用业务工具首次调用前已 `describe`；
- 每个站点由机器 schema 支持；
- 需求与竞争核心证据可由真实调用结果获得；
- 不需要用户向 Agent 提供密钥。
