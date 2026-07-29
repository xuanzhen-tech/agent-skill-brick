---
name: amazon-promotion-message-briefing
description: 把已批准 Amazon Offer 的优惠事实、期限、资格、排除、触发、退出和抑制规则整理成渠道中立的促销消息 brief，供第12品牌营销专家继续设计渠道与执行。适用于活动消息事实包、受众资格与停止条件、稀缺性核验和跨渠道交接；不适用于完整营销文案、ESP/邮件自动化、发送、渠道选择、虚构库存或销量紧迫感。
---

<!--
文件功能：定义促销消息 brief 的已批准Offer事实、期限、资格、触发/退出/抑制逻辑、失败语义和渠道交接。
职责边界：只输出渠道中立事实合同，不写完整邮件或通用营销活动、不发送、不配置ESP；渠道策略、文案和执行转交第12品牌营销专家。
重要关联：Offer事实和状态逻辑见 references/promotion-offer-message-contract.md；正式交付使用 assets/templates/promotion-message-brief-template.md；价格与日历状态来自本专家相邻 Skill。
-->

# Amazon 促销消息 brief

## 目标与职责

把活动信息整理为不会夸大、不会发错人且能被渠道团队消费的事实 brief：

1. 固定已批准 Offer 的准确优惠、币种与有效期；
2. 记录谁有资格、谁被排除；
3. 定义进入触发、延迟、分支、退出和抑制条件；
4. 区分已批准事实、待确认信息和禁止表述；
5. 把渠道选择、完整文案、发送与合规执行交给第 12 专家。

本 Skill 不发送消息，不配置邮件/ESP，不选择渠道，也不把未批准方案写成“现已生效”。

## 使用边界

### 允许的数据

- 用户对话和 `uploads/` 中已批准的 Offer 说明、资格、期限、排除和审批；
- `amazon-promotion-price-planning` 的已确认价格/叠加方案；
- `amazon-deal-calendar-coordination` 的活动窗口和内部就绪状态；
- 第 12 品牌/渠道规范、第 11 客服抑制信息及其他可信 `outputs/`；
- Agent 对事实、状态和交接字段的规范化。

消息 brief 通常不需要外部取数。若确需补充目标 ASIN 的外部当前价格背景，可分别通过 `sif_mcp` 使用 `market_get_asin_profile`、通过 `sellersprite_mcp` 使用 `asin_detail_with_coupon_trend`/`asin_coupon_trend`、通过 `sorftime_mcp` 使用 `product_detail`；这些快照不能证明 Offer 已批准、客户有资格、优惠生效或消息可发送。

### 禁止的数据与动作

- 不使用邮件平台、ESP、Amazon SP-API、Linkfox、Coaxon、Web、浏览器或未列明的其他 MCP/API；
- 不发送、排期、订阅、退订、分群或写回客户状态；
- 不生成完整邮件、短信、社媒或广告文案；
- 不选择发送渠道、频率或预算；
- 不虚构库存紧张、销量、倒计时、客户资格、节省金额或“最后机会”；
- 不读取或索要密钥。
- 不向三个 MCP 查询或推断正式 Offer 批准、资格、期限、活动费、库存或消息状态。

### 证据与判断

批准记录、价格方案、日历窗口和用户规则保留来源、原值、适用对象、时间和限制。Brief 中的 Offer 事实、触发/退出/抑制逻辑和待确认项必须直接引用这些依据。批准状态、资格和期限不能由 Agent 推断，规则整理也不能写成平台原始状态。

### 工作区

- `uploads/` 只读；
- `temp/promotion-management/<case-id>/04-message-brief/` 存放事实核对和规则草稿；
- `outputs/promotion-management/<case-id>/04-message-brief/` 存放唯一正式 brief。

## 启动与数据就绪

### 最低输入

至少需要：

1. Offer ID、站点和产品范围；
2. 用户或可信上游明确的批准状态；
3. 优惠事实、币种、基础价格/有效价格口径；
4. 开始、结束、时区和期限精度；
5. 资格、排除和限制；
6. 触发、退出和至少必要抑制规则；
7. 第 12 专家的接收责任或交接路径。

如果 Offer 尚未批准，可生成 `draft_facts` 供内部确认，但不得生成对外可用状态。

### 启动判断

Offer 事实和批准证据足够时才交给第 12 专家；尚未批准时只形成内部事实草稿。资格/排除、期限/时区或抑制规则不完整，以及价格、期限或批准状态冲突时，逐项说明缺口和责任人。过期、撤销、明确 no-go 或触发硬抑制时标明不得启用。完整文案、发送、渠道执行和自动化不在范围内。

## 三 MCP 调用前检查

确需外部当前价格背景时：

1. 工具名未知时通过对应外层工具先 `search`；已知精确工具名可直接 `describe`。本任务每个工具第一次调用前必须执行实时 `action=describe`、`kind=tool`、精确 `name`；
2. 只按机器 `inputSchema` 构造参数，并通过同一外层工具执行 `action=call`、相同 `name`、`arguments={...}`；说明文字与 schema 冲突时失败关闭；
3. 从直接父 Evidence 取得目标站点，并按实时 `inputSchema` 实际暴露的站点字段（如 `country`、`marketplace`、`amz_site`、`keyword_support_site`、`site`）映射；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标站点不一致时，才停止该供应商分支；不得默认 `US` 或自造字段、枚举；
4. 使用最小 ASIN 集合，只接收实际返回且带可解释商品、金额、币种和观测时间的当前价格字段；
5. 三个目录均无 `outputSchema`，逐字段验收；不得拼 Gateway、HTTP、shell、索取密钥或复制供应方格式指令；
6. Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭；
7. 每次业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造参数时不调用；
8. Agent 整理的 Offer 事实、限制和渠道交接直接引用所用材料，并说明理由和责任人。

供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。重叠价格先对齐站点、对象、期间、粒度、币种/单位、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。Offer 批准、客户资格、期限、活动费、库存、发送与平台状态不向供应商查询。

## 执行流程

### 第一步：建立 Offer 事实

读取 `references/promotion-offer-message-contract.md`，记录：

- Offer 事实、批准来源及原始文件或段落位置；
- 产品、站点和变体；
- 优惠类型与准确值；
- 参考价格/有效成交价及币种；
- 开始、结束、时区；
- 资格、排除、上限和可叠加状态；
- 价格/经济/日历 go-no-go；
- 已知限制和不得宣称内容。

没有批准证据时状态保持 `draft_facts`。

### 第二步：核验期限与紧迫性

- 只有确认结束时间时才能写“截至某时”；
- 只有来源明确且可验证时才能表达数量或库存稀缺；
- 未知结束时间不生成倒计时；
- 时区必须面向目标站点或明确用户设置；
- 过期、撤销或 no-go 时进入 `do_not_activate`。

### 第三步：定义资格与排除

资格至少区分：

- 商品/变体；
- 站点/地区；
- 客户或订单条件；
- 是否首次/重复购买（仅来源明确时）；
- 可叠加 Offer；
- 上限、排除与不适用人群。

未知资格不能用“所有人可用”替代。

### 第四步：定义状态逻辑

形成渠道中立逻辑：

- `trigger`：满足什么事实才进入候选；
- `delay`：只有用户/渠道责任方确认时记录；
- `branch`：不同资格或 Offer 状态如何分支；
- `exit`：购买、过期、撤销、价格变化、库存阻塞或其他结束条件；
- `suppression`：不合格、已退出、明确不应联系、频率/同意待第 12 核验等。

本 Skill 只描述业务条件，不创建工作流或执行抑制。

### 第五步：形成允许与禁止表述

允许表述只来自已批准 Offer 事实：

- 确切优惠；
- 准确期限；
- 资格与排除；
- 如何在已确认条件下获得优惠。

禁止表述包括：

- 无证“最低价”“最畅销”“仅剩少量”；
- 未确认“自动叠加”“人人可用”；
- 预测销量、节省或结果；
- 平台已批准/已上线（若无回执）；
- 任何把内部 `go` 当作外部生效的措辞。

### 第六步：交给第 12 专家

交接包包含：

- Offer 事实及其批准来源、原始文件或段落位置；
- 允许/禁止表述；
- 期限、资格、触发、退出和抑制；
- 目标受众业务条件；
- 待确认项；
- 渠道责任方必须完成的同意、频率、品牌语气和发送检查。

第 12 专家拥有渠道选择、完整文案、生命周期设计与发送协调。本 Skill 不重复。

## 失败与沟通

- `approval_missing`：只交付内部事实核对，不可激活。
- `timing_unknown`：期限为 `TBD`，禁止倒计时和紧迫性措辞。
- `eligibility_unknown`：禁止“人人可用”。
- `offer_conflict`：并列价格/期限/资格来源，停止对外 brief。
- `expired_or_withdrawn`：状态 `do_not_activate`。
- 当供应商外层工具无权限、限流、超时、schema 漂移或整体解析失败时，外部价格观察无法完成，促销消息将缺少该侧背景；停止使用该价格观察字段并说明证据缺口，不静默更换数据源。
- 当查询返回空数组或未返回目标字段时，外部价格背景实际缺失，不能据此认定价格为零或 Offer 不存在；保持该项缺失，仅使用已核验资料继续编制消息。
- 当用户或上游资料已经足够，或问题涉及 Offer 批准、资格、活动费、库存和消息状态时，三个 MCP 不能提供对应的权威事实；不发起请求，改用现有合法资料并明确其责任边界。
- 当返回字段无法解析时，该 Offer 证据不可靠，不能用于对外消息判断；保留原字段和错误，将该项排除而不写成无 Offer。
- `missing`、`conflicted`、`true_zero`：分别保存缺失、冲突和有明确零证据的结果，不互相替代。
- `send_requested`：返回 `out_of_scope` 并转交第 12/授权系统。

任何失败都不触发邮件、SP-API、Web 或其他平台。

## 正式交付

数据就绪时至少生成：

1. `promotion-message-brief.md`：Offer 事实、状态逻辑、允许/禁止表述和第 12 交接；
2. `promotion-message-rule-ledger.csv`：一行一个触发/退出/抑制规则；
3. `promotion-message-evidence.md`：Offer 来源、直接依据、规则整理过程和限制。

使用 `assets/templates/promotion-message-brief-template.md`。未批准时文件显式标 `draft_facts/do_not_activate`。最终回复只链接 `outputs/` 文件。

## 质量门

- 按 `references/promotion-offer-message-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；压缩/截断价格背景不得声称全量，须缩小范围/分页，仍不完整则不进入消息事实。

- Offer 优惠、币种、期限、资格和批准状态可追溯；
- 未确认叠加、资格、库存和紧迫性没有被扩写；
- 触发、分支、退出和抑制条件完整；
- 过期、撤销、no-go 与 `do_not_activate` 一致；
- Offer 来源、直接依据、规则整理过程和限制完整；
- 没有完整邮件/渠道文案、发送、ESP 配置或客户状态写回；
- 渠道策略与执行明确转交第 12；
- 三个 MCP 的当前价格、Coupon 或商品快照没有被写成 Offer 批准、Deal/Coupon 正式事实、资格、活动费、库存或发送事实；
- 没有使用 SP-API、邮件、Linkfox、Web 或其他禁止来源。

## 资源读取

- 固定 Offer 事实和状态逻辑前读取 `references/promotion-offer-message-contract.md`。
- 写正式 brief 前读取或物化 `assets/templates/promotion-message-brief-template.md`。
