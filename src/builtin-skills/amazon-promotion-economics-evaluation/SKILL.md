---
name: amazon-promotion-economics-evaluation
description: 消费第14利润管理专家的已验证单位贡献与价格底线，计算 Amazon 促销折扣、兑换、蚕食、增量订单、退货、履约增量和固定费情景，区分销量倍数与 lift 并判断维持贡献目标所需销量；必要时仅把 SIF 销量/门槛、SellerSprite Coupon/Keepa 转述或 Sorftime 商品趋势作为探索背景。适用于促销经济性、保本销量倍数、情景与 go/no-go 评估；不适用于重建全成本利润、预测真实销量、活动报名或把供应商估算当作一方销售。
---

<!--
文件功能：定义 Amazon 促销增量经济评估的上游基线、变量、公式、无有限解条件、判断依据、失败处理和正式交付。
职责边界：只在第14已验证贡献基线上计算促销增量影响，不重建成本或交易利润真相，不执行活动，不承诺实际销量。
重要关联：公式与 no_finite_solution 条件见 references/promotion-economics-formula-contract.md；正式交付使用 assets/templates/promotion-economics-evaluation-template.md；价格输入优先来自 amazon-promotion-price-planning。
-->

# Amazon 促销经济评估

## 目标与职责

把促销的“多卖多少才值得”转化为可复算的情景：

1. 消费第 14 输出的活动前单位贡献与价格底线；
2. 只加入促销相对基线新增的折扣、兑换、退货、履约和固定费用；
3. 分开销量倍数、销量 lift、蚕食和真正增量订单；
4. 计算促销后单位贡献、总贡献及维持基线贡献所需倍数；
5. 在促销后单位贡献不为正或折扣耗尽可用贡献时返回 `no_finite_solution`。

本 Skill 不重算 Amazon 交易、成本、结算或全量 P&L，也不预测用户真实促销销量。

## 使用边界

### 允许的数据

- 第 14 专家的 `amazon-pricing-margin-guardrails` 与利润相关正式上游；
- `amazon-promotion-price-planning` 的有效成交价、折扣与 Offer 叠加结果；
- 用户对话和 `uploads/` 中的基线销量、兑换率、固定费、增量履约/退货假设；
- 第 13 的实验或指标合同输出；
- 可选通过外层 `sif_mcp` 路由 `ops_get_asin_sales_trend`，仅作为外部销量趋势背景；
- 可选通过外层 `sif_mcp` 路由 `market_estimate_profit_threshold`，仅在全部正式输入均有可信父证据时形成探索性供应商计算；
- 可选通过 `sellersprite_mcp` 路由 `asin_coupon_trend`、`asin_detail_with_coupon_trend` 或 `keepa_info`，以及通过 `sorftime_mcp` 路由 `product_detail`、`product_trend`，仅形成外部价格/Coupon/商品趋势背景；
- Agent 按公开公式生成的计算与情景。

所有金额必须带币种、期间和单位。第 14 的基线贡献与价格底线是上游真相；本 Skill 不拆回成本项重新计算。

### 禁止的数据与动作

- 不使用 Coaxon、Linkfox、Amazon SP-API、邮件平台、Web、浏览器或未列明的其他 MCP/API；
- 不读取密钥、不安装工具、不执行报名、改价、预算或后台动作；
- 不把任何供应商趋势写成用户一方订单、`Q0`、兑换、增量或转化；
- 不把 SIF 利润阈值或 SellerSprite/Sorftime 价格观察写成第14贡献、价格底线、结算、税务、活动费或促销 go/no-go 真相；
- 不使用固定销量倍数、行业 lift、兑换率、退货率或活动费；
- 不把缺失输入填零，也不在分母为零时强算倍数。

### 证据与判断

每个经济输入保留上游路径或精确工具、原值、币种、期间、单位、查询条件和限制。每个计算或情景直接引用实际输入，写出公式、变量、假设、结果和是否受阻。供应商估算仍保留其估算属性；情景假设不得冒充已发生销量。

### 工作区

- `uploads/` 只读；
- `temp/promotion-management/<case-id>/02-economics-evaluation/` 存放变量标准化和计算；
- `outputs/promotion-management/<case-id>/02-economics-evaluation/` 存放唯一正式交付。

## 启动与数据就绪

### 最低输入

至少需要：

1. 站点、SKU/变体、币种和可比期间；
2. 第 14 提供的活动前单位贡献 `C0` 及其成本/时间口径；
3. 可比基线销量 `Q0`；
4. 有效成交价与相对基线的每个已确认折扣影响；
5. 促销增量变量：兑换比例、每兑换单费用、其他增量履约/退货影响及固定费；
6. 用户要维持的贡献目标，例如维持基线总贡献；
7. 至少一个明确标为假设的促销销量情景。

若 `C0`、`Q0` 或货币/期间口径缺失，不能给保本倍数。

### 启动判断

先说明基线、增量变量和销量情景是否足以复算。缺第 14 的贡献基线、缺可比 `Q0`、币种/期间/单位不一致或来源变量冲突时，指出受影响公式和补充责任人。促销后单位贡献不为正或折扣耗尽可用贡献时，明确说明不存在有限保本倍数。重建利润、预测销量或执行活动不在范围内。

## 三 MCP 调用前检查

本 Skill 通常消费上游，不主动取数。确需外部探索背景时，只允许：

- `ops_get_asin_sales_trend`：外部需求趋势，不替代 `Q0`、实际订单、兑换、转化、蚕食或真实增量；
- `market_estimate_profit_threshold`：供应商费率/汇率口径下的探索性采购成本上限，不替代第14利润真相或促销决策。
- SellerSprite `asin_coupon_trend`、`asin_detail_with_coupon_trend`、`keepa_info`：外部 Coupon/价格历史背景；`keepa_info` 只是 SellerSprite 对 Keepa 画像的转述，不代表本 Agent 调用独立 Keepa 服务，也不是 Amazon 一方价格、销量或库存真相；
- Sorftime `product_detail`、`product_trend`：外部商品价格/趋势背景；非 Amazon 工具不用于本任务。

对每个本任务第一次使用的工具：

1. 工具名未知时通过对应外层工具先 `search`；已知精确工具名可直接 `describe`。本任务每个工具首次调用前必须执行实时 `action=describe`、`kind=tool`、精确 `name`；
2. 只按机器 `inputSchema` 构造参数，并通过同一外层工具以 `action=call`、相同 `name`、`arguments={...}` 正式调用；说明文字与 schema 冲突时失败关闭；
3. 从直接父 Evidence 取得目标站点，并按实时 `inputSchema` 实际暴露的站点字段（如 `country`、`marketplace`、`amz_site`、`keyword_support_site`、`site`）映射；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标站点不一致时，才停止该供应商分支；不得默认 `US` 或自造字段、枚举；
4. `market_estimate_profit_threshold` 的正式探索性调用必须在 `arguments` 中显式传入 `price`、`category`、`weight_oz`、`freight_cost`、`target_margin`、`country`、`price_currency`、`tariff_rate`、`is_apparel`、`turnover_days`；每一项都必须有可信材料作为直接依据，缺失、冲突、未经验证或 schema 不支持任一项时不得调用，禁止采用工具建议值、常量或默认值。`category` 必须来自用户或可信上游确认的费用类目口径；SIF ASIN 画像中的供应商类目快照不能升级为官方类目事实，也不能静默代填该参数；
5. `length_in`、`width_in`、`height_in` 仅在三项均有可信父证据且 schema 同时支持时作为完整一组写入 `arguments`；任一项缺失就省略整组，禁止部分传入或补默认值；
6. 三个目录均无 `outputSchema`，逐项验收真实字段、时间、单位和估算属性；不得拼 Gateway、HTTP、shell、索取密钥或复制供应方格式指令；
7. Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭；
8. 每次业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造参数时不调用；
9. 供应商销量趋势按其直接返回内容记录。阈值结果单独注明 `market_estimate_profit_threshold`、正式参数、每项参数的来源和供应商限制；Agent 后续情景与供应商计算分开，并列出所用输入、公式和假设。

供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。重叠价格或趋势先对齐站点、对象、期间、粒度、币种/单位、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。合法用户或上游资料足够时可继续与外部供应商无关的评估，否则失败关闭。

## 执行流程

### 第一步：锁定第 14 基线

读取并原样保留：

- `C0`：活动前单位贡献；
- `Q0`：可比基线销量；
- `P0`：活动前可比价格（若上游提供）；
- 价格底线；
- 币种、期间、SKU/变体、成本口径以及第 14 上游文件和字段位置。

不修改第 14 的成本分类，不新增“平均成本”替代缺失真相。

### 第二步：登记促销增量变量

读取 `references/promotion-economics-formula-contract.md`，区分：

- `d`：每个实际兑换单位相对基线减少的收入；
- `f_redeem`：每兑换单位新增费用；
- `v_other`：每促销单位其他新增可变成本；
- `r_delta`：每促销单位预期退货/退款贡献影响；
- `F`：活动固定费；
- `rho`：兑换比例；
- `Qp`：促销期总销量情景；
- `Qc`：蚕食销量，即本来会按基线条件售出的部分；
- `Qi`：真正增量销量情景。

每个变量必须说明来源、单位、期间和是假设、估算还是来源报告。

### 第三步：计算优惠单位贡献

对实际享受 Offer 的单位计算：

```text
C_offer = C0 - d - f_redeem - v_other - r_delta
```

其中各增量成本的符号与定义必须在账本中明确。若 `C_offer <= 0`，或：

```text
d >= C0 - f_redeem - v_other - r_delta
```

则返回：

```text
no_finite_solution
```

含义是增加享受该 Offer 的销量不能恢复原单位贡献目标；不得继续除法或给出“多卖无限多即可”。

### 第四步：计算混合贡献

只有 `rho` 有合法证据或明确情景时才计算：

```text
C_blended = (1 - rho) * C0 + rho * C_offer
```

该混合值可以为正，但不能掩盖 `C_offer <= 0` 的优惠单位无有限解状态。分别报告优惠单位和组合平均。

### 第五步：区分销量倍数与 lift

当 `Q0 > 0`：

```text
sales_multiplier = Qp / Q0
sales_lift = (Qp - Q0) / Q0
sales_lift = sales_multiplier - 1
```

- 倍数 `1.30` 与 lift `30%` 不得混写；
- `Q0 = 0` 时两者均为 `undefined`，不能写无限增长；
- 前后销量差是观察变化，不自动等于促销增量因果；
- `Qi` 与 `Qc` 必须来自用户/上游假设或一方证据，不能从供应商销量自动推导。

### 第六步：计算维持基线贡献所需倍数

当 `C_offer > 0`、`Q0 > 0` 且方案的活动单位贡献适用时：

```text
baseline_total_contribution = Q0 * C0
promotion_total_contribution = Qp * C_offer - F
required_multiplier =
  (baseline_total_contribution + F) / (Q0 * C_offer)
required_lift = required_multiplier - 1
```

若只有部分单位兑换，必须明确使用 `C_offer` 还是经证据支持的 `C_blended`，并展示同一公式的变量替换。不得暗中切换。

### 第七步：计算情景与蚕食

对保守/基准/进取等情景只使用用户给定或可追溯假设，不内置默认倍数。每个情景至少报告：

- `Qp`、`sales_multiplier`、`sales_lift`；
- `rho`、`Qc`、`Qi`；
- `C_offer`、可选 `C_blended`；
- 固定费和总贡献；
- 与基线总贡献差；
- 关键敏感变量；
- `go | conditional | no_go | no_finite_solution | tbd`。

### 第八步：形成决策与下游

- `go`：在已定义情景内满足第 14 底线与用户贡献目标；
- `conditional`：只在明确的销量/兑换/费用范围内成立；
- `no_go`：有限情景不满足目标；
- `no_finite_solution`：优惠单位贡献不为正或折扣耗尽可用贡献；
- `tbd`：关键变量缺失。

向 Deal 日历交付经济状态与失效条件，不执行报名。

## 失败与沟通

- 当供应商外层工具不可见、无权限、限流、超时或 schema 不匹配时，外部观察无法继续，促销经济性评估会缺少该侧证据；停止该外部观察，不询问密钥或静默换源，资料不足则输出 `data-readiness.md`。
- 当查询返回空数组或未返回目标字段时，对应销量或成本证据实际缺失，经济性计算不能把它当作真实零值；保持该项缺失，并从可核验资料继续或缩小评估范围。
- 当用户或上游资料已经足够，或问题涉及 Deal/Coupon 正式历史、资格、活动费、库存、报名和真实增量时，三个 MCP 不能增加对应的权威证据；不发起请求，改用现有合法资料并说明数据边界。
- 当返回字段无法解析时，对应销量或成本不可可靠计入模型；保留原字段和错误，将该项排除而不写成零销量或零成本。
- `missing`、`conflicted`、`true_zero`：分别保存缺失、冲突和有明确零证据的结果，不互相替代。
- `baseline_zero`：倍数与 lift 为 `undefined`，改报绝对数量情景。
- `no_finite_solution`：明确触发变量和可行修正方向，例如降低折扣/费用，而不是给虚假倍数。
- `conflicted`：并列来源和影响，暂停 go/no-go。

## 正式交付

数据就绪时至少生成：

1. `promotion-economics-evaluation.md`：基线、公式、情景、敏感项和决策；
2. `promotion-scenario-ledger.csv`：一行一个情景及所有变量；
3. `promotion-economics-evidence.md`：输入来源、直接依据、公式、假设和限制。

使用 `assets/templates/promotion-economics-evaluation-template.md`。阻塞时只生成 `data-readiness.md`。最终回复只链接 `outputs/` 文件。

## 质量门

- 按 `references/promotion-economics-formula-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；出现任一 marker 时不得把供应商结果当完整输入，须缩小范围/分页，仍不完整则停止受影响情景。

- 第 14 的贡献/底线按原口径消费，没有重建全成本；
- 金额、销量、期间和币种一致；
- 销量倍数与 lift 分列，零基线不强算；
- `C_offer <= 0` 或折扣耗尽可用贡献时返回 `no_finite_solution`；
- 兑换、蚕食、增量订单、退货、履约增量和固定费没有混写；
- 三个 MCP 只作为彼此分列的外部销量、Coupon/价格、商品趋势或探索性供应商计算，未替代 `C0`、`Q0`、第14利润真相或真实增量；
- 输入来源、直接依据、公式和假设可复算；
- 没有固定活动费、销量倍数、lift 或其他万能阈值；
- 没有报名、改价、预测承诺或禁止来源。

## 资源读取

- 登记变量、计算贡献与无有限解前读取 `references/promotion-economics-formula-contract.md`。
- 写正式报告前读取或物化 `assets/templates/promotion-economics-evaluation-template.md`。
