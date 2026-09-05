---
name: amazon-ad-budget-and-acos-planning
description: 区分实际、目标和保本 ACoS 以及 TACoS，消费真实广告报表与第14专家已验证经济边界，并可按职责组合 SIF、SellerSprite 与 Sorftime 的关键词推广、PPC 或自然趋势作为外部供应商观察，形成透明预算情景和人工决策护栏。适用于预算规划、花费节奏复核和盈亏边界评估；不适用于固定预算比例、行业阈值、自动改预算/竞价、预测必然销量或用供应商观察代替一方销售与广告报表。
requiredTools: [spreadsheet_inspect, spreadsheet_compute, spreadsheet_validate]
---

<!--
文件功能：定义实际/目标/保本 ACoS、TACoS、预算情景、花费节奏、经济护栏和人工建议沟通。
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

## 使用边界

### 合法输入

- 用户对话及只读 `uploads/` 中的预算、目标、真实广告报表、总销售资料、账户和实体元数据；
- `amazon-ad-performance-diagnosis` 已验收的 spend、attributed sales/orders、期间和稳定 ID；
- 第14专家 `amazon-pricing-margin-guardrails` 或用户提供的单位贡献、可广告贡献率、价格和成本边界；
- 库存、促销、Listing 和现金限制的可信上游 `outputs/`；
- 已接入假设下的 `sif_mcp`、`sellersprite_mcp`、`sorftime_mcp`，仅在已有一方广告报表、自有售价和第14贡献边界后，按需取得关键词推广、PPC 或自然排名的外部供应商观察；
- 用户明确批准的情景假设。

三个 MCP 的销量、流量、广告贡献、PPC 或推广估计都不能作为广告归因销售、总销售、预算消耗或实际 ACoS/TACoS 的一方分子或分母。

### 外部数据边界

- 新外部市场数据只允许通过 `sif_mcp`、`sellersprite_mcp` 或 `sorftime_mcp` 获取；三者结果分别保存，只作供应商观察，不是预算或广告账户事实；
- 若需要关键词出价/盈亏平衡背景，可把 `market_assess_keyword_promotion` 作为候选路由；先通过外层 `sif_mcp` 执行 `action=describe`、`kind=tool`、`name=market_assess_keyword_promotion`，再按当次机器 `inputSchema` 以 `action=call`、`name=market_assess_keyword_promotion`、`arguments={...}` 发起调用；
- SellerSprite 候选仅限 `keyword_research`、`keyword_miner`、`traffic_extend` 或 `traffic_keyword` 的关键词需求、PPC、广告排名外部对照；Sorftime 候选仅限 `keyword_detail`、`keyword_trend`、`product_ranking_trend_by_keyword` 的自然排名或趋势，不能改写为广告账户表现；
- 正式调用的 `arguments` 必须显式包含已由可信材料验证的 `own_price`、`own_margin` 与 `country`，并记录三项参数的直接依据；任一项缺失、冲突或未经验证都不得调用。不得把 `country` 默认成 `US`；
- 对任何 MCP 正式调用，都先从直接父 Evidence 取得目标站点，并映射到实时 `inputSchema` 实际暴露的 `country | marketplace | amz_site | keyword_support_site | site` 字段；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标站点不一致时，才停止对应供应商分支；不得默认 `US`、自造字段或因为字段名不是 `country` 就提前停止；
- 不调用 Amazon Ads API、SP-API、Seller Central、Web、浏览器或未列明的其他 MCP/API；
- 不读取账户凭据，不改预算、不改竞价、不创建自动规则；
- 一方广告或总销售资料不足时失败关闭，不用供应商估算补缺。

三个目录都没有机器级 `outputSchema`。工具名未知时先用对应外层工具 `search`；已知精确工具名可直接 `describe`。每个任务对每个内层工具首次 `call` 前必须实时执行 `action=describe`、`kind=tool`、精确 `name`；正式调用只用同一外层工具的 `action=call + name + arguments`。不得拼 Gateway、HTTP、shell 或索取密钥，也不得把 description、`_formatted`、`_next_step`、供应商格式要求或未返回字段写成稳定合同。

Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/04-budget-acos-planning/` 存放口径对齐、公式、情景和决策草稿；
- `outputs/advertising/<case-id>/04-budget-acos-planning/` 存放唯一正式规划；
- 上游利润版本或归因数据变化时创建新版本。

### 表格计算与数据闭环

若输入为 ZIP，先使用 `run_shell` 解压到本次任务的 `temp/` 目录并列出实际 XLSX、XLSM、CSV、TSV；不要把 ZIP 传给表格工具。存在多个表格文件时，必须通过一次 `spreadsheet_inspect({ sources })` 纳入同一个 `analysisId`，先处理 `failedSources`、重复来源和日期重叠，再显式记录 `sourceDecisions`。同类报表通过 `from.type=union` 与明确 `columnMap` 纵向合并，不同粒度数据仍使用声明了基数的 `joins`；不得逐文件心算或用临时脚本拼接最终金额。正式交付需包含必需的 `source_coverage` 校验，证明每个来源已被使用或有证据地排除。

合法输入中存在 XLSX、XLSM、CSV 或 TSV 时，必须先 `spreadsheet_inspect` 并明确 `tableId`。实际 ACoS/TACoS、预算合计、差额、比例和情景运算全部通过 `spreadsheet_compute` 的 Decimal 结果形成，不得心算、复制旧报告数值或信任公式缓存。

正式规划前必须调用 `spreadsheet_validate`：货币对账默认使用 `0.01` 绝对容差，同时检查期间、实体集合、预算恒等式和字段覆盖。正文、表格、图表与看板引用同一分析下的 `analysisId/resultId`，可视化使用对应 `dataRef`。任一必需检查失败时，只交付差异说明、可用范围和补数清单，不输出正式预算策略。MCP 供应商观察不得混入第一方花费、销售额或预算结果。

### 证据与判断

输入材料记录来源路径、账户/商品/实体范围、期间、币种、归因、利润版本和限制。每次 MCP 业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造的参数不调用。

Agent 的指标重算、差距、情景、预算范围和决策建议必须说明使用了哪些直接输入、公式、假设和舍入方式，并给出结论限制。实际报表、用户目标和未来预算情景分开呈现；情景不能写成保证。

供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。比较前先对齐站点、对象、期间、粒度、币种/单位、流量口径、分页、定义和采集时间；口径一致才比较且绝不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。

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

### 结论表达

先说明当前材料能支持实际表现复核、目标差距比较，还是预算情景建议。缺广告报表、总销售额、经济护栏，分母为零，期间/币种冲突，归因尚未成熟或目标未获批准时，分别写明受影响的公式、无法回答的问题和下一责任人。

没有保本经济输入时可以描述实际表现，但不得给保本 ACoS 或确定预算建议。结论始终是人工计划依据，不表示预算已修改。

## 执行流程

### 第一步：冻结指标合同

对每个指标记录：

- 分子、分母；
- 账户、商品和实体范围；
- 日期、时区和粒度；
- 归因窗口和成熟度；
- 币种；
- 报表名称及原始文件、工作表或行位置；
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

### 第八步：形成建议与沟通

针对每个广告实体，直接说明建议保持、考虑增加、考虑减少、重新分配、等待数据、等待经济边界、考虑停止，或当前无法评估。每项建议都写明直接依据、适用条件、主要风险、仍需补充的材料和人工批准人，不另设通用状态字段。

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

- 缺少广告报表时，只描述目标和所需报表，不计算实际 ACoS；
- 缺少总销售额时，明确无法计算 TACoS，并列出所需销售期间与口径；
- 缺少经济护栏时，不计算保本 ACoS 或给出确定预算，转请第 14 专家补充适用边界；
- 分母为零时，说明相关指标无法计算，不把结果写成零；
- 币种或期间冲突时停止比较，列出冲突值和统一口径所需材料；
- 归因尚未成熟时延后结论，并给出可复核日期；
- 目标尚未批准时，只作为待确认情景，不作为预算控制线；
- SIF 参数错误时重新 `describe` 并按机器 `inputSchema` 修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止外部观察分支，不换源，也不影响已有充分一方证据的计算；
- 用户要求固定通用比例时，说明需其定义业务目标，不提供通用比例；
- 对预算或竞价写入、自动规则、真实销量预测或利润重建等越界请求，明确拒绝并说明可提供的规划范围。

## 正式交付

至少生成：

1. `ad-budget-acos-plan.md`
2. `ad-acos-tacos-metric-ledger.csv`
3. `ad-budget-scenario-register.csv`
4. `ad-budget-decision-register.csv`
5. `ad-budget-evidence-ledger.md`

使用 `assets/templates/ad-budget-acos-plan-template.md`。没有第14经济边界时，首页明确 `economic_guardrail_missing`。

## 质量门

- 按 `references/ad-budget-and-acos-contract.md` 检查每个 MCP 结果是否含 `[agent-tool-result-compressed]` 或 `[agent-cli-tool-result-truncated]`；任一 marker 出现都不得声称全量覆盖，必须缩小查询范围或使用内层分页，仍不完整则标记该 provider 覆盖不足。

- 实际、目标和保本 ACoS 分开；
- ACoS 保存 raw ratio，差距同时给 `gap_ratio` 与 `gap_percentage_points`，并记录舍入；
- TACoS 只用一方总销售；
- 期间、时区、币种、归因和实体范围一致；
- 分母为零/缺失时 `not_computable`；
- 第14利润边界保留版本和证据；
- 无固定预算比例、行业阈值或必然效果预测；
- 情景假设与实际分开；
- 三个 MCP 仅提供有直接来源和限制的外部观察，没有进入实际 ACoS/TACoS 或预算事实；
- 所有动作等待人工批准；
- 无 Ads API、自动规则或后台监控；
- 每项计算与预算判断均能回到直接输入，并写明公式、假设、限制和人工责任人。

## 资源读取

- 计算指标、保本边界和预算情景前读取 `references/ad-budget-and-acos-contract.md`。
- 写正式规划前读取或物化 `assets/templates/ad-budget-acos-plan-template.md`。
