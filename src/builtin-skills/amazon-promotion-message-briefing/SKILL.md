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

## 运行合同

### 允许的数据

- 用户对话和 `uploads/` 中已批准的 Offer 说明、资格、期限、排除和审批；
- `amazon-promotion-price-planning` 的已确认价格/叠加方案；
- `amazon-deal-calendar-coordination` 的活动窗口和内部就绪状态；
- 第 12 品牌/渠道规范、第 11 客服抑制信息及其他可信 `outputs/`；
- Agent 对事实、状态和交接字段的规范化。

消息 brief 通常不需要 SIF。若确需补充目标 ASIN 的外部当前价格背景，只可通过外层 `sif_mcp` 路由 `market_get_asin_profile`；该供应商快照不能证明 Offer 已批准、客户有资格、优惠生效或消息可发送。

### 禁止的数据与动作

- 不使用邮件平台、ESP、Amazon SP-API、Linkfox、Coaxon、Sorftime、Web、浏览器或其他 MCP/API；
- 不发送、排期、订阅、退订、分群或写回客户状态；
- 不生成完整邮件、短信、社媒或广告文案；
- 不选择发送渠道、频率或预算；
- 不虚构库存紧张、销量、倒计时、客户资格、节省金额或“最后机会”；
- 不读取或索要密钥。
- 不向 SIF 查询 Deal/Coupon、批准、资格、期限、活动费、库存或消息状态；当前 SIF 不具备这些能力。

### 双层谱系与四轴

来源证据层保存批准记录、价格方案、日历窗口和用户规则的路径、Evidence ID、字段、原值、时间和四轴。派生 brief 层保存 Offer ID、规范化事实、触发/退出/抑制逻辑、待确认项和四轴。

四轴：

- `source_type`：`sif_mcp | user_input | upstream_output | agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`raw | normalized | calculation | coding | inference | hypothesis`。

批准状态、资格和期限必须保留来源。Agent 的规则整理为 `coding`，不能写成平台原始状态。

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

### 就绪状态

- `approved_for_channel_brief`：Offer 事实与批准证据足够，可交给第 12；
- `draft_facts`：只供内部核对；
- `tbd_eligibility`：资格或排除不完整；
- `tbd_timing`：期限/时区不完整；
- `suppression_incomplete`：缺必要抑制规则；
- `blocked_conflict`：价格、期限或批准状态冲突；
- `do_not_activate`：过期、撤销、no-go 或硬抑制；
- `out_of_scope`：要求完整文案、发送、渠道或自动化。

## SIF 工具与 schema 预检

确需外部当前价格背景时：

1. 本任务第一次使用该工具前，通过外层 `sif_mcp` 执行 `action=describe`、`kind=tool`、`name=market_get_asin_profile`；
2. 只按机器 `inputSchema` 构造参数，并通过外层 `sif_mcp` 以 `action=call`、`name=market_get_asin_profile`、`arguments={...}` 正式调用；说明文字与 schema 冲突时以机器 schema 为准；
3. 只要运行时 `inputSchema` 含 `country`，就把有直接父证据的已验证站点映射显式写入 `arguments.country`，不得默认 `US`；目标为非美国且 schema 缺少或不支持该国家时，停止该 SIF 分支；
4. 使用最小 ASIN 集合，只接收实际返回且带可解释商品、金额、币种和观测时间的当前价格字段；
5. 当前工具没有 `outputSchema`，逐字段验收，不复制供应方的 `_formatted`、`_next_step`、角色设定、格式指令或主动路由要求；
6. 原始 SIF 对象记录 `evidence_id`、`source_type=sif_mcp`、`source_provider=sif`、`source_tool`、参数摘要、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、覆盖/分页、`estimation_status`、`transformation_type=reported` 和 `raw_result_locator`；`agent_request_id` 与 `tool_call_id` 取当前 AgentTool 调用上下文中的真实值，上下文未暴露时分别写 `not_returned`，不得自造；`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`，不得用本地 ID 冒充；
7. SIF 输入证据使用 `source_type=sif_mcp`，Agent 整理另建证据并以 `parent_evidence_ids` 回指。

SIF 字段与结果统一记录 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`。Offer 批准、Deal/Coupon、客户资格、期限、活动费、库存、发送与平台状态一律 `not_queried`；schema 漂移或调用失败时另记调用错误，停止该分支且不换源。

## 执行流程

### 第一步：建立 Offer 事实

读取 `references/promotion-offer-message-contract.md`，记录：

- `offer_id` 与批准 Evidence ID；
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

- Offer 事实与 Evidence IDs；
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
- `failed`：SIF 无权限、限流、超时、schema 漂移或解析失败时停止当前价格观察字段，不换源。
- `not_returned`：空数组或字段未返回时保持外部价格背景缺失，不写成零价或无 Offer。
- `not_queried`：用户/上游资料足够，或目标属于 Offer 批准、资格、活动费、库存和消息状态时，不向 SIF 请求。
- `parse_failed`：保留原字段与错误，不写成无 Offer。
- `missing`、`conflicted`、`true_zero`：分别保存缺失、冲突和有明确零证据的结果，不互相替代。
- `send_requested`：返回 `out_of_scope` 并转交第 12/授权系统。

任何失败都不触发邮件、SP-API、Web 或其他平台。

## 正式交付

数据就绪时至少生成：

1. `promotion-message-brief.md`：Offer 事实、状态逻辑、允许/禁止表述和第 12 交接；
2. `promotion-message-rule-ledger.csv`：一行一个触发/退出/抑制规则；
3. `promotion-message-evidence.md`：双层谱系与四轴。

使用 `assets/templates/promotion-message-brief-template.md`。未批准时文件显式标 `draft_facts/do_not_activate`。最终回复只链接 `outputs/` 文件。

## 质量门

- Offer 优惠、币种、期限、资格和批准状态可追溯；
- 未确认叠加、资格、库存和紧迫性没有被扩写；
- 触发、分支、退出和抑制条件完整；
- 过期、撤销、no-go 与 `do_not_activate` 一致；
- 双层谱系与四轴完整；
- 没有完整邮件/渠道文案、发送、ESP 配置或客户状态写回；
- 渠道策略与执行明确转交第 12；
- SIF 当前价格背景没有被写成 Offer 批准、Deal/Coupon、资格、活动费、库存或发送事实；
- 没有使用 SP-API、邮件、Linkfox、Web 或其他禁止来源。

## 资源读取

- 固定 Offer 事实和状态逻辑前读取 `references/promotion-offer-message-contract.md`。
- 写正式 brief 前读取或物化 `assets/templates/promotion-message-brief-template.md`。
