---
name: amazon-promotion-price-planning
description: 基于用户资料、可信上游输出及可选的 SIF ASIN 画像、SellerSprite Coupon/Keepa 转述和 Sorftime 商品价格趋势，分开 Amazon 当前价、历史价、竞品价与计划活动价，核验已确认的优惠叠加并形成受利润底线约束的促销价格方案。适用于折扣价格规划、优惠叠加核算、价格包络与活动前价格就绪检查；不适用于重建利润、动态调价、Deal/Coupon 正式历史或资格判断、活动费、后台改价或报名提交。
---

<!--
文件功能：定义 Amazon 促销价格规划的四类价格、币种与时间口径、优惠叠加规则、利润底线消费方式、失败语义和正式交付。
职责边界：只形成价格方案和待确认项；消费第14专家给出的贡献与价格底线，不重建成本利润，不执行改价、报名或动态调价。
重要关联：价格记录和叠加算法见 references/promotion-price-and-stack-contract.md；正式交付使用 assets/templates/promotion-price-plan-template.md；经济结果转交 amazon-promotion-economics-evaluation。
-->

# Amazon 促销价格规划

## 目标与职责

把“活动价定多少”拆成可追溯、可比较且不会混淆口径的价格方案：

1. 分别登记当前价、历史价、竞品价和计划活动价；
2. 为每个金额保留币种、时间、站点、商品与价格含义；
3. 只按已确认可叠加的优惠和顺序计算有效成交价；
4. 消费第 14 利润管理专家提供的价格底线与贡献边界；
5. 输出价格方案、阻塞项和下游经济评估输入。

本 Skill 不判断 Amazon 当前活动资格、历史价规则或费用，不把竞品价当作必须跟随的目标，也不执行 Seller Central 改价。

## 使用边界

### 允许的数据

- 用户对话与 `uploads/` 中的当前价格、历史记录、活动规则、优惠详情和目标；
- 可信上游 `outputs/`，尤其是第 14 专家的 `amazon-pricing-margin-guardrails` 价格底线和贡献边界；
- 第 02 专家的竞品集合或快照、第 13 专家的可比变化分析；
- 可选通过外层 `sif_mcp` 路由 `market_get_asin_profile`，仅用于目标或可比 ASIN 的当前供应商画像，包括实际返回的当前价格背景；
- 可选通过 `sellersprite_mcp` 路由 `asin_coupon_trend`、`asin_detail_with_coupon_trend`、`keepa_info`，或通过 `sorftime_mcp` 路由 `product_detail`、`product_trend`，仅用于外部 Coupon/当前价/商品趋势背景；`keepa_info` 只是 SellerSprite 对 Keepa 画像的转述，不代表本 Agent 调用独立 Keepa 服务，也不是 Amazon 一方价格、销量或库存真相；
- Agent 按本 Skill 公开公式完成的规范化、叠加计算和方案判断。

上游产物必须保留路径、版本、生成时间、实际使用字段和限制。无法追溯的数值只能标为待确认。

### 禁止的数据与动作

- 不使用 Coaxon、Linkfox、Amazon SP-API、邮件平台、Web、浏览器、网页抓取或未列明的其他 MCP/API；
- 不安装工具、不拼接协议请求、不读取或索要密钥；
- 不硬编码活动资格、历史参考价窗口、折扣门槛、费用、字符或站点政策；
- 不执行改价、优惠创建、活动报名、提交、自动监控或动态调价；
- 三个 MCP 都不能证明正式 Deal/Offer 资格、活动费、官方历史参考价窗口或批准状态；这些事实只能来自用户、只读 `uploads/` 或可信 `outputs/`；
- 原计划需要比较多个 MCP 而其中一个无法取数时，明确写出缺少的来源、受影响的价格或 Coupon 判断、因此不能完成的比较，以及下一步所需材料；某项背景只有一个适用来源且调用失败时，直接说明当前没有该项外部证据。合法资料不足则停止结论，不把另一来源静默当成等价回退。

### 证据与判断

每个来源价格保留来源路径或精确工具、查询条件、商品/卖家范围、原值、币种、时间和限制。每个归一化价格、叠加计算、方案比较或价格判断直接引用实际输入，并写明叠加顺序或公式、假设、结果和阻塞原因。Agent 计算不能覆盖来源原值；三个供应商的价格、Coupon 或趋势保留各自快照语义，不写成 Amazon 一方卖家后台价格、官方历史参考价、Offer 批准或活动资格真值。

### 工作区

- `uploads/`：用户原始资料，只读；
- `temp/promotion-management/<case-id>/01-price-planning/`：价格规范化、叠加计算和方案草稿；
- `outputs/promotion-management/<case-id>/01-price-planning/`：唯一正式交付目录。

不得覆盖第 14、02 或 13 的上游文件。

## 启动与数据就绪

### 最低输入

至少确认：

1. Amazon 站点、SKU/ASIN、变体和卖家口径；
2. 目标币种、税费/配送是否包含及站点时区；
3. 当前价与观测时间；
4. 计划活动价或待评估的优惠结构及有效期；
5. 第 14 输出的可比价格底线和活动前单位贡献边界；
6. 所有拟叠加优惠的可叠加证据与应用顺序。

历史价与竞品价是重要上下文但不是每次都必需。未查询、未返回或字段缺失时按实际原因说明，不得用当前价或零替代。

### 启动判断

先说明任务所需的价格、底线和叠加规则是否足够。缺历史或竞品上下文但仍可在底线内规划时明确限制；优惠是否叠加或顺序未确认时保留待定。缺第 14 的价格/贡献护栏、币种/税费/时间口径不可比，或价格、有效期、规则冲突时，说明受影响方案和补充责任人。后台改价、报名、资格判断和动态调价不在范围内。

## 三 MCP 调用前检查

只有上游资料不足且任务确需新增外部当前价/历史趋势背景时，才可使用上述候选工具：

1. 工具名未知时通过对应外层工具先 `search`；已知精确工具名可直接 `describe`。本任务每个工具第一次调用前必须执行实时 `action=describe`、`kind=tool`、精确 `name`；
2. 只按实时机器 `inputSchema` 构造参数，并通过同一外层工具执行 `action=call`、相同 `name`、`arguments={...}`；说明文字与 schema 冲突时失败关闭；
3. 从直接父 Evidence 取得目标站点，并按实时 `inputSchema` 实际暴露的站点字段（如 `country`、`marketplace`、`amz_site`、`keyword_support_site`、`site`）映射；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标站点不一致时，才停止该供应商分支；不得默认 `US` 或自造字段、枚举；
4. 使用最小 ASIN 集合，并逐项验收实际返回的金额、币种、观测时间、商品和字段语义；
5. 三个目录均无 `outputSchema`，不得预设返回字段；不得拼 Gateway、HTTP、shell、索取密钥或复制供应方格式指令；
6. Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭；
7. 每次业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造参数时不调用；
8. 结果只进入“外部当前画像”，不能补齐官方历史价、Offer、Deal/Coupon 正式事实、资格、活动费或价格规则。

供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。重叠价格先对齐站点、对象、期间、粒度、币种/单位、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。每个 Agent 归一化价格、计算或判断对象仍直接回指实际父证据。

## 执行流程

### 第一步：建立四类价格账本

读取 `references/promotion-price-and-stack-contract.md`，分别登记：

- `current_price`：目标商品当前可见或用户确认价格；
- `historical_price`：带明确历史时间点/窗口的价格；
- `competitor_price`：可比竞品在特定快照时间的价格；
- `planned_promotion_price`：计划在未来有效期使用的基础活动价。

每条记录必须包含金额、币种、观测或有效时间、时区、站点、SKU/ASIN、变体、卖家、税费/配送口径、来源和解析状态。

四类价格不得互相覆盖：

- 当前价不是历史参考价；
- 历史价不是资格判定结果；
- 竞品价不是建议价或价格底线；
- 计划活动价不是已生效成交价。

### 第二步：统一可比口径

1. 仅比较相同币种、税费/配送口径、商品单位和可比时间；
2. 不同币种只在用户或可信上游提供带日期汇率时换算；
3. 换算同时保留原币金额、汇率来源、报价时间和派生金额；
4. 变体、套装数量或卖家不同则建立可比性说明，不强行横比；
5. 解析失败、未返回、未查询和真实零值分别保存。

### 第三步：核验优惠叠加

为每个 Offer 记录：

- 类型与金额/比例；
- 适用商品与用户资格；
- 生效与结束时间；
- 是否可与其他 Offer 叠加的明确证据；
- 已确认的应用顺序；
- 排除与上限；
- 支撑叠加结论的原始文件、段落或工具结果位置。

只有双方组合与顺序均被用户确认或可信规则明确支持时，才进入基准有效价计算。未知叠加项进入独立 `what_if` 情景，状态为 `tbd_stackability`，不得进入正式基准。

### 第四步：计算有效成交价

按已确认顺序逐步应用 Offer，并在每一步保留：

```text
step_input_price
offer_id
confirmed_operation
step_output_price
```

百分比、定额、固定活动价或其他操作只能按已确认规则解释。结果小于零、币种不一致或顺序未知时标为无效，不自动截断为零。

有效成交价是价格计算，不包括未知税费、配送、返利或平台结算项。未确认项单列。

### 第五步：应用第 14 价格底线

1. 读取第 14 输出的 `price_floor`、币种、适用 SKU/变体、时间基准和成本/贡献口径；
2. 只在口径一致时比较有效成交价与底线；
3. 输出底线余量：

```text
floor_headroom = effective_customer_price - price_floor
```

4. `floor_headroom < 0` 时方案为 `no_go`;
5. `floor_headroom = 0` 时标记没有价格缓冲，不推断仍有其他成本空间；
6. 底线缺失或不可比时失败关闭，不自行重建利润模型。

### 第六步：形成价格包络

每个候选方案包含：

- 计划活动价；
- 已确认叠加 Offer；
- 有效成交价；
- 第 14 价格底线与余量；
- 当前/历史/竞品上下文；
- 有效期；
- `go | conditional | no_go | tbd`；
- 风险、待确认项和下游经济评估输入。

不以“低于竞品”作为唯一 go 条件，也不承诺转化或排名。

## 失败与沟通

- 当供应商外层工具不可见、无权限、限流、超时或 schema 不匹配时，外部价格画像无法继续，促销价判断会缺少该侧证据；停止该外部画像分支，合法资料足够则据其继续，否则输出 `data-readiness.md`。
- 当查询返回空数组或未返回目标字段时，外部价格证据实际缺失，不能据此认定价格为零；保持该项缺失，既不猜测字段映射，也不补零。
- 当合法用户或上游资料已经足够，或问题涉及 Deal/Coupon 正式历史、资格、活动费、规则和后台状态时，三个 MCP 不能增加有效决策证据；不发起请求，改用现有合法资料并明确其来源边界。
- 当返回字段无法解析时，该价格或 Offer 证据不可用于计算与判断；保留原字段位置和错误，排除该项而不写成零价或无 Offer。
- `missing`、`conflicted`、`true_zero`：分别保存缺失、冲突和有明确零证据的结果，不互相替代。
- `tbd_stackability`：只交付未确认情景，不给最终有效价。
- `blocked_missing_guardrail`：列出第 14 必须提供的字段，停止 go/no-go。

任何失败都不触发禁止数据源或后台动作。

## 正式交付

数据就绪时至少生成：

1. `promotion-price-plan.md`：价格口径、候选方案、底线比较和 go/no-go；
2. `promotion-price-ledger.csv`：四类价格与叠加步骤；
3. `promotion-evidence-ledger.md`：来源价格、直接依据、查询、计算过程和限制。

使用 `assets/templates/promotion-price-plan-template.md`。阻塞时只生成 `data-readiness.md`，列出缺失字段、责任方和未执行事项。最终回复只链接 `outputs/` 文件。

## 质量门

- 按 `references/promotion-price-and-stack-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；出现任一 marker 时不得声称完整价格历史，须缩小范围/按内层分页，仍不完整则标记 provider 覆盖不足。

- 当前、历史、竞品和计划活动价分列，金额都有币种与时间；
- 只计算已确认可叠加 Offer，并保留应用顺序；
- 不同币种、商品单位、税费/配送和变体口径没有强行比较；
- 第 14 价格底线按原口径消费，没有重建成本或利润；
- 缺失、未查询、未返回、解析失败和真实零值没有混写；
- 来源价格、直接依据、计算过程和限制完整；
- 没有资格、历史窗口、费用或政策硬编码；
- 三个 MCP 只提供彼此分列的外部 ASIN、Coupon/Keepa 转述或商品趋势画像，未被写成 Deal/Coupon 正式事实、资格、活动费、官方历史价或后台真值；
- 没有改价、报名、动态调价或禁止来源；
- 正式产物位于 `outputs/`，中间产物位于 `temp/`。

## 资源读取

- 建立四类价格、叠加链和底线比较前读取 `references/promotion-price-and-stack-contract.md`。
- 写正式方案前读取或物化 `assets/templates/promotion-price-plan-template.md`。
