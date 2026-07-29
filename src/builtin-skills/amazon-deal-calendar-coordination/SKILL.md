---
name: amazon-deal-calendar-coordination
description: 把用户确认的 Amazon Deal 或促销窗口、资格材料、价格、经济性、库存、素材、预算、审批和负责人组织成带时区的日历与 go/no-go 就绪账本。适用于活动排期、截止日协调、依赖与责任追踪、上线前就绪检查；不适用于判断未证资格、活动报名或提交、创建提醒/Cron、后台操作或把未知日期补成默认值。
---

<!--
文件功能：定义 Amazon Deal 日历协调的事件字段、TBD纪律、依赖、go/no-go闸门、失败语义和正式交付。
职责边界：只整理用户或可信来源确认的窗口和就绪状态，不报名、不提交、不创建提醒或后台任务，不把日历记录写成平台已接受。
重要关联：事件、依赖和就绪状态见 references/deal-calendar-readiness-contract.md；正式交付使用 assets/templates/deal-calendar-template.md；价格与经济输入来自同专家前两个 Skill。
-->

# Amazon Deal 日历协调

## 目标与职责

建立可由团队执行的活动日历，而不是假装已经完成平台操作：

1. 归档用户或可信上游确认的活动类型、窗口和规则；
2. 将价格、经济性、库存、素材、预算、审批和负责人映射为依赖；
3. 对每个活动给出 `go | conditional | no_go | tbd`；
4. 保留未知截止日、资格和平台状态为 `TBD`；
5. 输出日历、就绪账本和需要责任方确认的清单。

本 Skill 不替用户报名、提交、修改或取消活动，不创建提醒、Cron、计划任务或后台监控。

## 运行合同

### 允许的数据

- 用户对话与 `uploads/` 中的平台通知、活动规则、窗口、审批和负责人资料；
- `amazon-promotion-price-planning` 的价格状态；
- `amazon-promotion-economics-evaluation` 的经济状态；
- 第 08 库存/物流、第 04 视觉、第 12 渠道/品牌、第 14 利润及其他可信 `outputs/`；
- Agent 对事件、依赖、冲突和就绪状态的可追溯整理。

活动截止日、资格和费用必须来自用户或可信来源。没有证据时写 `TBD`。
当前 SIF 只有 ASIN 画像、销量/流量和探索性经济背景，不提供 Deal/Coupon 历史、资格、活动窗口、活动费、库存、报名或平台审批状态；本 Skill 不调用 SIF。

### 禁止的数据与动作

- 不使用 Coaxon、Linkfox、Sorftime、Amazon SP-API、邮件平台、Web、浏览器或其他 MCP/API；
- 不假定任何候选工具具有 Deal 注册、报名、提交或状态回写能力；
- 不硬编码活动窗口、资格、费用、提前期或平台审批状态；
- 不创建日历提醒、Cron、后台进程、自动告警或消息发送；
- 不把 `go` 写成 Amazon 已接受或已上线；
- 不读取或索要密钥。

### 双层谱系与四轴

来源证据层保存活动通知、规则、上游状态的路径、Evidence ID、字段、时间、原值和四轴。派生决策层保存 Event ID、依赖输入、状态规则、假设、go/no-go 结果和四轴。

四轴使用：

- `source_type`：`user_input | upstream_output | agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`raw | normalized | calculation | coding | inference | hypothesis`。

日历事件编码为 `coding`，就绪结论为 `inference`。来源未确认的未来日期不是 `forecast`，而是 `unknown/TBD`。

### 工作区

- `uploads/` 只读；
- `temp/promotion-management/<case-id>/03-deal-calendar/` 存放事件规范化和依赖检查；
- `outputs/promotion-management/<case-id>/03-deal-calendar/` 存放唯一正式日历与账本。

## 启动与数据就绪

### 最低输入

至少明确：

1. Amazon 站点、活动对象和团队时区；
2. 活动名称/类型及信息来源；
3. 已确认的活动窗口或明确 `TBD`；
4. 当前负责人和审批责任；
5. 价格、经济、库存、素材、预算等所需依赖范围；
6. 用户期望的决策日期或评审节奏。

只有活动名称没有任何来源、窗口或责任人时，可以建立 `TBD` 待办，但不能给 `go`。

### 就绪状态

- `go`：所有必需依赖有证据通过，且没有已知阻塞；
- `conditional`：有明确条件、责任人和截止时间，条件满足后可转 go；
- `no_go`：价格/经济/库存/审批等硬闸门失败；
- `tbd`：关键日期、资格、规则或责任人未知；
- `cancelled_by_user`：仅用户明确取消时使用；
- `out_of_scope`：要求报名、提交、提醒、自动化或后台状态查询。

`TBD` 不是失败，也不能自动变成某个默认日期。

## 工具边界与失败关闭

日历任务只消费用户、只读 `uploads/` 和可信 `outputs/`。当前 `sif_mcp` 的 ASIN、销量、流量和供应商经济工具都不能证明活动规则、窗口、资格、活动费、批准、报名、库存或平台状态，因此本 Skill 不调用 SIF，也不执行 `describe`。

缺少上述事实时保持 `TBD` 或阻塞状态，不切换 Coaxon、Linkfox、SP-API、Web、浏览器或其他 MCP/API。即使其他 Skill 已生成 SIF 外部观察，也只能作为对象背景，不能提升任何日历事件的资格、时间或平台状态。

## 执行流程

### 第一步：建立活动事件

读取 `references/deal-calendar-readiness-contract.md`，为每个事件记录：

- `event_id`；
- 站点、SKU/ASIN/变体；
- 活动类型与来源原名；
- 计划/确认窗口、时区和时间状态；
- 用户确认的规则、资格、费用或限制；
- 责任人、审批人和依赖；
- 平台状态与证据；
- 当前决策状态。

平台状态只能使用来源明确的值；无平台回执时写 `not_verified`。

### 第二步：映射依赖

至少检查：

- 价格方案与可叠加 Offer；
- 经济性与 `no_finite_solution`；
- 库存、补货和履约风险；
- A+/图片/消息等素材准备；
- 预算与固定费批准；
- 合规、品牌和渠道审批；
- 操作责任人与平台提交责任方。

依赖只能引用其责任方正式输出，不在本 Skill 重算。

### 第三步：处理时间

1. 所有日期带时区；
2. 来源只有日期没有时刻时保留日级粒度，不补 `23:59`；
3. 来源写“预计”时保留估算状态；
4. 未知截止日写 `TBD`；
5. 多来源日期冲突时并列证据并标 `conflicted`；
6. 截止日早于必要依赖完成日时标 `schedule_conflict`。

### 第四步：运行 go/no-go 闸门

硬闸门至少包括：

- 有可比价格底线且方案不是 `no_go`；
- 经济评估不是 `no_finite_solution`；
- 库存/履约责任方没有硬阻塞；
- 必需素材和审批有责任人；
- 活动窗口与规则由用户或可信来源确认；
- 平台报名/提交由明确的人或系统承担。

任一硬闸门失败为 `no_go`；未知关键项为 `tbd`，不能用乐观假设提升为 go。

### 第五步：识别重叠与冲突

- 只有确认可叠加时才允许同一商品的重叠 Offer；
- 价格、库存、预算或素材争用写明冲突；
- 活动窗口重叠不自动意味着互斥；
- 资格规则冲突时保持 `tbd/conflicted`；
- 不自动移动日期或取消活动。

### 第六步：形成责任交接

每个未完成依赖写：

- 责任人；
- 需要的证据或动作；
- 用户确认的截止日或 `TBD`；
- 未完成对 go/no-go 的影响；
- 完成后由谁复核。

提醒和通知由用户现有系统或后续渠道责任方执行，本 Skill 只交付静态计划。

## 失败与沟通

- `missing_window`：日期保持 `TBD`，不补默认窗口。
- `eligibility_unverified`：不能给最终 go。
- `missing_owner`：保留未分配责任，不假装会自动执行。
- `conflicted_sources`：并列日期/规则和影响，等待责任方裁定。
- `parse_failed`：不写成无活动或活动取消。
- `automation_requested`：返回 `out_of_scope`，只提供可导入的静态计划字段。
- `submission_requested`：明确本 Skill 未获授权且无工具，不声称已提交。

## 正式交付

数据就绪时至少生成：

1. `deal-calendar.md`：按时间排序的活动、状态、依赖与冲突；
2. `deal-readiness-ledger.csv`：一行一个 Event/依赖状态；
3. `deal-calendar-evidence.md`：双层谱系、四轴和来源限制。

使用 `assets/templates/deal-calendar-template.md`。资料不足时仍可交付 `TBD` 日历与 `data-readiness.md`，但不得生成虚假日期。最终回复只链接 `outputs/` 文件。

## 质量门

- 所有日期有时区或明确粒度，未知值为 `TBD`；
- `go/conditional/no_go/tbd` 有可追溯闸门；
- 价格、经济、库存、素材、预算和审批由责任方输出支撑；
- 只对已确认可叠加 Offer 允许重叠；
- 平台报名、提交、资格和上线状态没有被推断；
- 没有提醒、Cron、后台进程或自动告警；
- 双层谱系与四轴完整；
- 解析失败、未返回、取消和无活动没有混写；
- 未使用 SIF 推断 Deal/Coupon、资格、活动窗口、活动费、库存、报名或审批状态；
- 没有使用禁止数据源或接触密钥。

## 资源读取

- 建立 Event、依赖和 go/no-go 闸门前读取 `references/deal-calendar-readiness-contract.md`。
- 写正式日历前读取或物化 `assets/templates/deal-calendar-template.md`。
