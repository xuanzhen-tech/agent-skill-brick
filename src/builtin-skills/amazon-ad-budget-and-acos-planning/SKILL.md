---
name: amazon-ad-budget-and-acos-planning
description: 区分实际、目标和保本 ACoS 以及 TACoS，消费真实广告报表与第14专家已验证经济边界，并可把 SIF 关键词推广经济性作为外部供应商观察，形成透明预算情景和人工决策护栏。适用于预算规划、花费节奏复核和盈亏边界评估；不适用于固定预算比例、行业阈值、自动改预算/竞价、预测必然销量或用 SIF 观察代替一方销售与广告报表。
---

<!--
文件功能：定义实际/目标/保本 ACoS、TACoS、预算情景、花费节奏、经济护栏和人工决策状态。
职责边界：只计算和规划，不重建商品利润、不修改预算或竞价；保本边界必须消费第14专家或用户的已验证经济证据。
重要关联：指标、经济输入和预算状态见 references/ad-budget-and-acos-contract.md；正式交付使用 assets/templates/ad-budget-acos-plan-template.md；报告质量依赖 amazon-ad-performance-diagnosis。
-->

# Amazon 广告预算与 ACoS 规划

## 目标与完成定义

把“预算该加多少、ACoS 是否合理”拆成不同口径：

1. 真实期间的实际 ACoS/TACoS 是什么；
2. 用户的目标 ACoS/TACoS 是决策目标还是历史事实；
3. 第14专家验证的保本 ACoS 上限如何定义；
4. 花费、广告归因销售和总销售的期间、币种、归因是否一致；
5. 不同预算情景需要哪些假设和停止条件；
6. 哪些实体可进入人工复核，哪些因数据或利润边界不足而阻塞。

本 Skill 不输出“行业标准 ACoS”或固定 70/20/10 预算结构。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的预算、目标、真实广告报表、总销售资料、账户和实体元数据；
- `amazon-ad-performance-diagnosis` 已验收的 spend、attributed sales/orders、期间和稳定 ID；
- 第14专家 `amazon-pricing-margin-guardrails` 或用户提供的单位贡献、可广告贡献率、价格和成本边界；
- 库存、促销、Listing 和现金限制的可信上游 `outputs/`；
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在已有一方广告报表、自有售价和第14贡献边界后，按需取得关键词推广经济性的外部供应商观察；
- 用户明确批准的情景假设。

SIF 销量、流量、广告贡献或推广估计不能作为广告归因销售、总销售、预算消耗或实际 ACoS/TACoS 的一方分子或分母。

### 外部数据边界

- 新外部业务数据只允许通过当前 Agent 已注入的 `sif_mcp` 获取；其结果只作供应商观察，不是预算或广告账户事实；
- 若需要关键词出价/盈亏平衡背景，可把 `market_assess_keyword_promotion` 作为候选路由；先通过外层 `sif_mcp` 执行 `action=describe`、`kind=tool`、`name=market_assess_keyword_promotion`，再按当次机器 `inputSchema` 以 `action=call`、`name=market_assess_keyword_promotion`、`arguments={...}` 发起调用；
- 正式调用的 `arguments` 必须显式包含已由父证据验证的 `own_price`、`own_margin` 与 `country`，并保存这三项各自的输入 `evidence_id`；任一项缺失、冲突或未经验证都不得调用。不得把 `country` 默认成 `US`；
- 对任何 SIF 正式调用，只要运行时 `inputSchema` 含 `country`，就必须把有直接父证据的已验证站点映射显式写入 `arguments.country`，不得默认 `US`；目标为非美国且 schema 缺少或不支持该国家时，停止该外部观察分支；
- 不调用 Amazon Ads API、SP-API、Seller Central、Sorftime、Keepa、Web、浏览器或其他 MCP/API；
- 不读取账户凭据，不改预算、不改竞价、不创建自动规则；
- 一方广告或总销售资料不足时失败关闭，不用供应商估算补缺。

当前 SIF 工具没有机器级 `outputSchema`。不得把 description、`_formatted`、`_next_step`、面向其他 Agent 的格式要求或本次未返回的字段写成稳定合同；外层 `arguments` 通过后，内层参数仍可能被 Gateway/SIF 拒绝，必须检查真实调用状态。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/04-budget-acos-planning/` 存放口径对齐、公式、情景和决策草稿；
- `outputs/advertising/<case-id>/04-budget-acos-planning/` 存放唯一正式规划；
- 上游利润版本或归因数据变化时创建新版本。

### 双层谱系

输入 `input_evidence` 记录 `evidence_id`、`source_path`、数据类型、账户/商品/实体范围、期间、币种、归因、利润版本、四轴和限制。原始 SIF 对象还记录 `source_type=sif_mcp`、`source_provider=sif`、`source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`query_scope`、覆盖/分页和 `raw_result_locator`；其 `transformation_type=reported`，`estimation_status` 按结果自述保留 `reported` 或 `estimated`。`agent_request_id` 与 `tool_call_id` 取当前 AgentTool 调用上下文中的真实值；上下文未暴露时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`，不得用本地 ID 冒充。

Agent 的指标重算、差距、情景、预算范围和决策建议是 `agent_output`，记录公式、`parent_evidence_ids`、假设、舍入和结论状态；不得继承 SIF 来源对象的 `source_type`。

四轴：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

目标是 `future`；实际报表是 `reported`；预算情景通常是 `forecast|hypothesis`，不能写成保证。

SIF 空值纪律继续区分 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted` 与有明确零证据的 `true_zero`，任何一种都不能代替一方广告报表中的零。

## 启动检查

### 最低输入

至少需要：

1. 账户/profile、站点、币种和实体范围；
2. 实际花费及对应期间；
3. 广告归因销售额及归因口径，若计算实际 ACoS；
4. 一方总销售额及一致期间，若计算 TACoS；
5. 目标 ACoS/TACoS 的用户来源，若做目标比较；
6. 第14专家或用户验证的经济边界，若做保本/预算建议；
7. 预算周期、人工批准人和库存/现金限制。

### 唯一顶层结果合同

每次运行只使用一组顶层结果字段：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `MISSING_AD_REPORT | MISSING_TOTAL_SALES | MISSING_ECONOMIC_GUARDRAIL | ZERO_DENOMINATOR | CURRENCY_OR_PERIOD_CONFLICT | ATTRIBUTION_IMMATURE | TARGET_NOT_APPROVED | OUT_OF_SCOPE_REQUEST`

不得再使用 `planning_status` 或其他顶层状态表达同一结果。指标 `calculation_status`、情景 `approval_status` 和决策候选状态只描述局部对象。

没有保本经济输入时可以描述实际表现，但不得给保本 ACoS 或确定预算建议。

## 执行流程

### 第一步：冻结指标合同

对每个指标记录：

- 分子、分母；
- 账户、商品和实体范围；
- 日期、时区和粒度；
- 归因窗口和成熟度；
- 币种；
- 来源 report/evidence ID；
- 缺失和零分母规则。

### 第二步：区分三类 ACoS

#### 实际 ACoS

`actual_acos_raw_ratio = actual_spend / actual_attributed_sales`

原始值必须保存为无量纲 ratio，例如 `0.25`；仅在展示时计算 `actual_acos_display_percent = actual_acos_raw_ratio * 100`，显示为 `25%`。仅来自一致口径的一方广告报表。分母为零或缺失时 `not_computable`。

#### 目标 ACoS

`target_acos` 是用户或批准计划的未来控制目标：

- 记录批准人、日期和适用实体；
- 不写成当前实际；
- 不从行业文章或供应商默认值推断。

#### 保本 ACoS

`breakeven_acos` 必须来自第14专家或用户验证的广告前可用贡献率/金额，并满足：

- 价格、成本、费用、退货和币种版本明确；
- 与广告归因销售额口径兼容；
- 叠加促销和价格变化已处理；
- 仅在定义范围内使用。

本 Skill 不重建成本或利润。

### 第三步：计算 TACoS

`tacos = actual_spend / first_party_total_sales`

只有一方总销售额、广告花费、期间、站点、币种和商品范围一致时计算。

- SIF 估算销量/销售额不得作为分母；
- 总销售缺失时状态 `total_sales_missing`；
- TACoS 下降不自动证明自然销量因广告增长；
- 促销、价格、库存和 Listing 变化需作为替代解释。

### 第四步：比较边界

目标和保本 ACoS 也先规范为无量纲 raw ratio。分别计算：

- `gap_ratio = actual_acos_raw_ratio - target_acos_raw_ratio`
- `gap_percentage_points = gap_ratio * 100`
- `breakeven_gap_ratio = actual_acos_raw_ratio - breakeven_acos_raw_ratio`
- `breakeven_gap_percentage_points = breakeven_gap_ratio * 100`
- 保本余量；
- 目标是否低于/高于保本边界；
- 口径不一致造成的不可比较。

`gap_ratio` 的单位是 ratio；`gap_percentage_points` 的单位是 percentage points，不是 percent change。计算和比较必须用未舍入 raw ratio；展示值最后舍入，并记录 `rounding_rule`。例如实际 `0.25`、目标 `0.20`，则 `gap_ratio=0.05`、`gap_percentage_points=5`。

目标 ACoS 高于保本上限时，不自动判业务错误；要说明这可能是经批准的获客/防守投入，并要求责任方明确可接受损失和期限。

### 第五步：分析花费节奏

在真实预算和期间下记录：

- 计划预算；
- 已发生花费；
- 已过期间；
- 预算剩余；
- 数据成熟和报告延迟；
- 实体状态、库存、促销等限制；
- 当前节奏只是描述还是有可靠 forecast。

不得用简单线性外推冒充确定预测。若使用线性情景，必须标公式、假设和适用条件。

### 第六步：建立预算情景

保守、基准、进取只是命名，不对应固定比例。每个情景记录：

- 预算范围和币种；
- 适用实体；
- 目标 ACoS/TACoS；
- 保本边界；
- 对点击、转化、价格、库存和归因的假设；
- 预期不是承诺；
- 停止、复核和升级触发；
- 人工批准。

没有足够证据时，情景可以只给边界而不估算销售。

### 第七步：分配预算候选

按实体逐项考虑：

- 数据质量和归因成熟；
- 与目标的差距；
- 保本余量；
- 商品利润、库存和 Listing 就绪；
- 搜索词/目标行动；
- 促销和品牌防守目的；
- 实验需要。

不使用固定生命周期比例或统一阈值，不因单一 ACoS 自动加减预算。

### 第八步：建立决策状态

- `maintain_for_review`
- `increase_candidate`
- `decrease_candidate`
- `reallocate_candidate`
- `hold_for_data`
- `hold_for_economics`
- `stop_candidate`
- `not_assessable`

所有状态都是人工决策候选。需记录证据、条件、风险和批准人。

### 第九步：定义复核与回滚

为批准情景记录：

- 人工执行字段；
- 观察窗口和归因成熟日期；
- 指标与护栏；
- 何时停止、回滚或重新评估；
- 需要的报告签名；
- 变更前后稳定 ID 和版本。

本 Skill 不创建监控、自动规则或后台调度。

## 失败与降级

- `MISSING_AD_REPORT`：`blocked` 或仅目标描述，不计算实际 ACoS；
- `MISSING_TOTAL_SALES`：`ready_with_limitations`，不计算 TACoS；
- `MISSING_ECONOMIC_GUARDRAIL`：`ready_with_limitations`，不计算保本 ACoS或给确定预算；
- `ZERO_DENOMINATOR`：相关指标 `not_computable`；
- `CURRENCY_OR_PERIOD_CONFLICT`：`ready_with_limitations` 或 `blocked`，不比较；
- `ATTRIBUTION_IMMATURE`：`ready_with_limitations`，延后结论；
- `TARGET_NOT_APPROVED`：`ready_with_limitations`，目标仅作为未批准情景，不能成为控制线；
- SIF 参数错误时重新 `describe` 并按机器 `inputSchema` 修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止外部观察分支，不换源，也不影响已有充分一方证据的计算；
- 用户要求固定通用比例时，说明需其定义业务目标，不提供通用比例；
- `OUT_OF_SCOPE_REQUEST`：`out_of_scope`，拒绝预算/竞价写入、自动规则、真实销量预测或利润重建。

## 正式交付

至少生成：

1. `ad-budget-acos-plan.md`
2. `ad-acos-tacos-metric-ledger.csv`
3. `ad-budget-scenario-register.csv`
4. `ad-budget-decision-register.csv`
5. `ad-budget-evidence-ledger.md`

使用 `assets/templates/ad-budget-acos-plan-template.md`。没有第14经济边界时，首页明确 `economic_guardrail_missing`。

## 质量门

- 实际、目标和保本 ACoS 分开；
- ACoS 保存 raw ratio，差距同时给 `gap_ratio` 与 `gap_percentage_points`，并记录舍入；
- TACoS 只用一方总销售；
- 期间、时区、币种、归因和实体范围一致；
- 分母为零/缺失时 `not_computable`；
- 第14利润边界保留版本和证据；
- 无固定预算比例、行业阈值或必然效果预测；
- 情景假设与实际分开；
- SIF 仅为带完整调用谱系的供应商观察，没有进入实际 ACoS/TACoS 或预算事实；
- 所有动作等待人工批准；
- 无 Ads API、自动规则或后台监控；
- 双层谱系与工作区合同完整。

## 资源读取

- 计算指标、保本边界和预算情景前读取 `references/ad-budget-and-acos-contract.md`。
- 写正式规划前读取或物化 `assets/templates/ad-budget-acos-plan-template.md`。
