---
name: amazon-review-request-readiness
description: 基于用户提供的订单、送达、既有请求记录和当前 Amazon 政策证据，对单笔订单形成可追溯的 Review 请求人工执行就绪判断。适用于核对证据完整性、政策窗口、重复请求和敏感案件阻塞；不适用于发送请求、编写诱导性话术、按好评概率筛选买家或使用固定天数代替当前政策。
---

<!--
文件功能：定义 Amazon Review 请求的单笔订单证据核对、政策门禁、反选择性控制和人工执行就绪判断。
职责边界：只基于用户、只读 uploads 或可信上游证据输出 human_execution_ready 或 blocked；当前 SIF 没有订单、Review 请求或评论正文工具，因而不调用 SIF；不发送请求、不生成激励或评价引导、不推断买家倾向。
重要关联：就绪字段和 reason_code 见 references/review-request-readiness-contract.md；正式交付使用 assets/templates/review-request-readiness-template.md。
-->

# Amazon Review 请求就绪核对

## 目标与完成定义

本 Skill 只回答一个问题：基于当前合法证据，这笔订单是否已具备交给授权人员进一步人工执行的条件。

完整工作包必须：

1. 冻结单笔订单、站点、观察时间与审核责任人；
2. 核对订单、送达、既有请求、活跃案件和当前政策证据；
3. 禁止用公共 Review、买家画像或好评概率判断资格；
4. 不使用候选材料中写死的历史时间窗口；
5. 输出唯一顶层状态 `human_execution_ready` 或 `blocked`；
6. 使用有限 `reason_code` 解释结论；
7. 把执行状态保持为 `not_executed`。

`human_execution_ready` 只表示证据包可以交给人，不表示请求已发送、平台已接受或买家会留下评价。

## 运行合同

### 合法输入

- 用户对话和只读 `uploads/` 中的订单记录、配送/送达证据、既有 Review 请求历史、退款/退货/索赔状态和平台通知；
- 可信 `outputs/` 中带 Evidence ID、生成时间、覆盖范围和限制的订单、物流、客服案件与政策产物；
- 第 09 专家提供的当前 Amazon Review 请求政策证据，包含站点、原文定位、发布日期/核验日、适用对象和窗口解释；
- 用户明确指定的单笔订单、人工执行责任人和观察截止时间；
- Agent 对合法输入做的规范化、窗口计算、冲突检查与就绪判断。

用户上传的平台导出记录为：

```text
source_type=user_input
evidence_origin=user_uploaded_platform_export
```

上传导出不是 Agent 实时平台查询；必须保留导出时间、筛选范围、时区和完整性限制。

### 最低输入

形成 `human_execution_ready` 至少需要：

1. 掩码 order ID 与 marketplace；
2. 可定位订单记录；
3. 当前政策要求的关键履约/送达时间证据及其时区；
4. 当前、适站点且可定位的 Review 请求政策证据；
5. 既有请求历史的覆盖范围与状态；
6. 当前退货、退款、索赔、安全或其他敏感案件状态；
7. 人工审核人与观察截止时间。

任一政策关键字段或订单关键事实缺失时必须 `blocked`，不得用常识补齐。

### 外部工具和 SIF 边界

- 本包不调用 `sif_mcp`；当前 SIF 没有订单、买家、送达、Review 请求历史或评论正文工具；
- SIF 的关键词、ASIN、流量、销量、广告和供应商诊断数据不能证明订单身份、买家身份、送达状态、Review 请求资格、既有请求或政策窗口；
- 不调用 Amazon SP-API、Request a Review、Seller Central、邮件、消息、Web、浏览器、飞书或其他 MCP/API；
- 不读取或索要 LWA、OAuth、Cookie、session 或买家联系方式；
- 不发送、排程、批量触发或模拟 Review 请求；
- 未来即使注入新工具，也必须先读取真实 tool definitions 和 schema；未经本 Skill 重新授权仍不得执行请求。

### 工作区与隐私

- `uploads/`：用户原始材料，只读；
- `temp/customer-experience/<case-id>/03-review-request/`：去标识副本、时间计算和核对表；
- `outputs/customer-experience/<case-id>/03-review-request/`：唯一正式交付目录；
- 不保存完整买家姓名、地址、邮箱、电话或支付信息；
- 不建立跨订单“高分倾向”名单，不把 PII 复制进模板或分析库；
- `temp/` 中未复核计算不得冒充正式结论。

## 状态、原因与证据

### 唯一顶层状态

只允许：

```text
human_execution_ready
blocked
```

同时必须写：

```text
execution_status=not_executed
request_status=not_executed
```

不得使用 `ready_to_send`、`scheduled`、`sent`、`requested` 或 `completed`。

### 有限 reason_code

至少选择一个；多个原因按阻塞优先级记录：

- `evidence_complete`
- `needs_policy_evidence`
- `needs_order_evidence`
- `needs_delivery_evidence`
- `already_requested`
- `outside_confirmed_policy_window`
- `policy_exclusion`
- `active_sensitive_case`
- `policy_conflict`
- `record_conflict`
- `out_of_scope`

只有 `evidence_complete` 可以对应 `human_execution_ready`。其余 reason code 对应 `blocked`。没有当前政策证据时不能使用 `outside_confirmed_policy_window`。

### 双层谱系与四轴

来源证据层记录：

- `evidence_id`、文件/记录定位与 `evidence_origin`；
- 原始时间、时区、站点、订单掩码范围；
- 导出/生成时间、覆盖范围、解析和延迟限制；
- `source_type / temporal_scope / estimation_status / transformation_type`。

Agent 输出层记录：

- `agent_output_id` 和 `parent_evidence_ids`；
- 时间标准化、窗口计算、状态核对或决策规则；
- 结果、reason code、假设、限制和人工复核状态；
- 同一四轴。

### 缺失语义

严格分开：

```text
not_returned
not_queried
parse_failed
missing
conflicted
true_zero
```

前五项不得解释为“未请求”“无敏感案件”“零次请求”或“符合资格”。`true_zero` 只有在范围明确且来源显式返回零时成立。

## 执行流程

### 第一步：冻结订单范围

记录：

- `case_id`、掩码 order ID；
- marketplace；
- 观察截止时间与时区；
- 订单商品与数量，仅按输入；
- 人工审核人与预期人工执行渠道；
- 当前任务是首次核对还是历史结论复核。

不同订单不得合并成一个就绪判断。批量任务必须逐笔运行相同门禁，并保留单笔状态。

### 第二步：登记订单和履约证据

逐项登记：

- 订单创建/付款/发货记录；
- 当前政策所要求的配送或送达时间证据；
- 取消、退货、退款、A-to-z、拒付、安全或客服案件；
- 既有 Review 请求记录；
- 数据导出时间、筛选条件和覆盖范围。

“未看到既有请求”只有在请求历史覆盖完整且状态为 `true_zero` 时才能支持未请求；否则是 `not_returned`、`not_queried` 或 `missing`。

### 第三步：核对当前政策

政策证据至少记录：

- policy Evidence ID；
- marketplace 和适用对象；
- 原文定位；
- 发布/更新日期与本次核验日期；
- 资格、窗口、排除项和重复请求要求；
- 结论上限与未决问题。

不得依赖训练记忆、候选 Skill 中的固定窗口、博客、历史模板或“行业惯例”。政策过期、站点不明或来源冲突时使用 `needs_policy_evidence` 或 `policy_conflict`。

### 第四步：计算政策窗口

只根据当前政策规定的锚点和边界计算：

1. 识别政策要求的时间锚点；
2. 读取对应订单/送达 Evidence；
3. 保留原时区并记录转换；
4. 明确区间端点是否包含；
5. 输出计算式、输入 Evidence IDs 与观察时间；
6. 对临界边界要求人工复核。

缺锚点证据时为 `needs_delivery_evidence`；不得把下单日、发货日和送达日互换。

### 第五步：检查重复请求

记录既有请求历史的：

- 覆盖时间；
- order ID 匹配方式；
- 请求类型；
- 原始状态；
- 成功、失败或未知的证据；
- 数据延迟和缺口。

有可信证据表明已请求时为 `already_requested`。记录不全时为 `record_conflict` 或相应证据缺失，而不是“可以再发一次”。

### 第六步：检查敏感案件与政策排除

只依据当前政策和案件证据核对：

- 活跃退货/退款争议；
- A-to-z、chargeback 或法律/安全案件；
- 政策明确排除的订单状态或对象；
- 与买家沟通中仍未解决的高风险问题。

存在敏感案件时使用 `active_sensitive_case` 并交给授权人员。不得根据买家情绪或预测评分决定是否请求。

### 第七步：执行反操纵门禁

无论用户目标如何，都禁止：

- 以优惠券、退款、赠品、补偿或利益换取 Review；
- 要求、暗示或引导正面/五星 Review；
- 在帮助、保修或退款前要求先评价；
- 只选择预计满意、已留好评或“高价值”的买家；
- 排除预计差评买家来美化评价；
- 把 Review、Feedback、商品问答和客服满意度混为一谈；
- 生成绕开平台标准流程的私人联系方式或营销话术。

命中时 `blocked`，reason code 使用 `policy_exclusion` 或 `out_of_scope`，并记录原始请求 Evidence ID。

### 第八步：形成就绪结论

只有同时满足以下条件，才可输出：

```text
top_level_status=human_execution_ready
reason_code=evidence_complete
execution_status=not_executed
request_status=not_executed
```

条件：

- 单笔订单证据完整且无冲突；
- 当前政策可定位且适用于该站点；
- 窗口计算可复核；
- 既有请求状态明确；
- 无已识别敏感案件或政策排除；
- 没有激励、选择性或评价引导；
- 人工责任人明确。

否则输出 `blocked` 和全部 reason codes。

### 第九步：生成手工执行证据包

只生成：

- 订单与时间证据摘要；
- 政策原文定位与窗口计算；
- 既有请求核对；
- 敏感案件/排除项核对；
- 顶层状态、reason codes 和人工检查清单。

本 Skill 不生成个性化 Review 索取话术，不创建发送文件、计划任务或自动化。

### 第十步：交付前质检

确认：

- 顶层状态只使用两个允许值；
- reason code 与证据一致；
- 当前政策而非固定天数决定窗口；
- 未把公共 Review 当订单资格证据；
- 未用 `missing` 代替零次请求；
- 未按预期评分或满意度筛选；
- 未承诺或执行任何请求；
- 所有 Agent 判断有 `parent_evidence_ids`；
- PII 已最小化；
- `execution_status` 与 `request_status` 均为 `not_executed`。

## 失败与降级

- 政策证据缺失/过期：`blocked + needs_policy_evidence`；
- 订单记录缺失：`blocked + needs_order_evidence`；
- 送达锚点缺失：`blocked + needs_delivery_evidence`；
- 请求历史不完整：`blocked + record_conflict`，不推断未请求；
- 政策或记录冲突：并列证据，不自行裁决；
- 用户要求激励、评价引导、选择性请求或直接发送：`blocked + out_of_scope`；
- 外部工具不可用：保持阻塞，不改用 Web 或其他数据源。

## 正式交付

数据充分或明确阻塞时生成：

1. `review-request-readiness.md`
2. `review-request-evidence-ledger.md`
3. `policy-window-calculation.csv`，存在窗口计算时

使用 `assets/templates/review-request-readiness-template.md`。材料严重不足时可只生成 `data-readiness.md`，但仍需写 `top_level_status=blocked` 与 reason codes。

## 资源读取

- 开始判断前读取 `references/review-request-readiness-contract.md`。
- 写正式交付前读取或物化 `assets/templates/review-request-readiness-template.md`。
