---
name: amazon-listing-quality-audit
description: 对 Amazon Listing 的标题、要点、描述、关键词使用、事实宣称、可读性和跨字段一致性执行逐问题证据化审计，为每个问题说明证据、影响、修复动作与复核方式。适用于现有 Listing 诊断、改稿前审计、优化优先级和修订验收；不适用于万能评分、广泛关键词研究、图片审计、后台发布或无证据的排名与转化预测。
---

<!--
文件功能：定义 Amazon Listing 质量审计的逐问题证据模型、优先级规则、失败状态和正式交付。
职责边界：审计可见文本与合法输入，不用任意综合分替代问题证据，不生成图片、不执行发布，也不把供应商可见性数据解释为因果效果。
重要关联：问题字段、优先级和复核合同见 references/listing-issue-evidence-contract.md；正式报告使用 assets/templates/listing-quality-audit-template.md；修订可交给 amazon-listing-copy-development。
-->

# Amazon Listing 质量审计

## 目标与边界

把“Listing 不好”拆成可以被定位、修复和复核的问题。每个问题必须回答：

1. 问题出现在哪个字段和具体文本；
2. 哪条证据说明它是问题；
3. 它可能影响准确性、理解、匹配、信任或可执行性中的哪一项；
4. 应修改什么，什么内容必须保留；
5. 修改后怎样验证。

本 Skill 不输出 0–100 等万能综合分。没有真实业务基线时，不声称某项修改会提升固定比例的排名或转化。

## 运行合同

### 合法输入

- 用户粘贴的 Listing 文本或 `uploads/` 中的文本资料；
- 可信上游 `outputs/` 中的关键词架构、产品事实、VOC、竞品结构和既有文案包；
- 当前 Agent definitions 中真实存在的 `sif_mcp`，仅在已取得被审计文本、且审计范围确需补充 ASIN 当前画像或关键词可见性背景时使用；
- 用户提供的当前政策、品牌规则和业务目标。

审计对象必须固定版本或快照。若用户边修改边审计，分别记录版本，不把不同版本的问题混在一起。

### 唯一外部业务数据源

- 新获取的外部业务数据只允许当前 Agent 已注入的 `sif_mcp`；
- 本包候选业务工具只限 `market_get_asin_profile`、`market_get_asin_keyword_signals` 和 `ops_get_listing_keyword_distribution`；
- SIF 只能提供供应商 ASIN 快照、关键词或渠道可见性观察，不能提供 Listing 标题、要点、描述、A+、图片、视频或后台词原文；
- 内层业务工具不是独立模型工具：描述时调用外层 `sif_mcp` 并传 `action=describe`、`kind=tool`、精确 `name`；执行时传 `action=call`、同一 `name` 与 `arguments`。禁止使用 `sif_mcp.<内层工具名>` 点式假调用；
- 每个业务工具在本任务首次 `call` 前必须单独 `describe`，并只按当次机器 `inputSchema` 传参；schema 含 `country` 时必须在 `call.arguments.country` 显式传入有直接父证据的已确认站点，不依赖默认 US，目标站点不受支持时停止分支；
- 当前业务工具没有机器 `outputSchema`；description、`_formatted`、`_next_step`、供应商建议和未返回字段都不能成为审计合同；
- 不使用 Pangolinfo、DeepL、网页、浏览器、Amazon 抓取、其他 MCP 或 API；
- 不读取密钥、不安装工具、不静默换源；
- `sif_mcp` 不可见、失败或合法资料不足时失败关闭。

### 四轴证据

每条证据记录：

- `source_type`：`sif_mcp`、`user_input`、`upstream_output` 或 `agent`；
- `temporal_scope`：`current`、`historical`、`future`、`mixed`、`not_applicable` 或 `unknown`；
- `estimation_status`：`reported`、`estimated`、`forecast`、`mixed`、`not_applicable` 或 `unknown`；
- `transformation_type`：`reported`、`raw`、`normalized`、`calculation`、`coding`、`inference` 或 `hypothesis`。

问题判断属于 Agent 推断，必须引用原始文本、产品事实、关键词证据或用户规则。SIF 的价格、评分、评论数量、关键词贡献、排名稳定性或渠道分布只保留为供应商观察，不作为 Listing 原文、Amazon 一方事实、审计真相分数或因果效果。

原始 SIF 证据对象固定 `source_type=sif_mcp`、`source_provider=sif`、`transformation_type=reported`，并直接保存 `source_tool`、`agent_request_id`、`tool_call_id`、`provider_request_id`、`retrieved_at`、`marketplace`、`query_scope`、`temporal_scope`、`coverage_or_pagination`、`estimation_status`、`result_state` 和 `raw_result_locator`。`agent_request_id` 与 `tool_call_id` 仅取当前 AgentTool 调用上下文中的对应真实值；上下文未暴露相应字段时分别写 `not_returned`，不得自造。`provider_request_id` 仅取 SIF 响应明确返回的服务端 ID，否则写 `not_returned`。三类 ID 不得互相代填，也不得用任一本地 ID 冒充 `provider_request_id`。`result_state` 只允许 `not_returned | not_queried | parse_failed | missing | conflicted | true_zero`，前五项不能补成零。Agent 的问题、优先级和修复建议另建 `source_type=agent` 对象，并通过自身 `parent_evidence_ids` 指向输入证据。

### 工作区

- `uploads/` 只读；
- `temp/listing-optimization/<case-id>/03-quality-audit/` 存放版本化文本、问题草稿和证据匹配；
- `outputs/listing-optimization/<case-id>/03-quality-audit/` 存放唯一正式审计。

## 启动检查

### 最低输入

至少需要：

1. Amazon 站点与目标语言；
2. 被审计 Listing 的明确版本和字段文本；
3. 产品身份及足以核对主要宣称的事实；
4. 用户审计目标，例如准确性、关键词布局、可读性或改稿验收；
5. 适用的上游关键词或品牌规则，若用户要求审计这些维度。

只有 ASIN 但没有可见文本时必须 `blocked` 并输出数据准备清单；当前 SIF 目录不提供 Listing 原文，不得用 ASIN 画像、关键词信号或供应商展示块拼造审计对象。

### 审计范围状态

- `ready`：目标文本与所需事实足够；
- `partial`：只能审计部分字段或维度；
- `stale`：文本或证据不是当前版本；
- `conflicted`：产品事实或政策来源冲突；
- `blocked`：无法取得审计对象或关键事实；
- `out_of_scope`：请求是图片质量、后台发布、法律结论或排名保证。

缺失的维度标为 `not_assessed`，不得打零分。

## 工具与 schema 预检

只有被审计文本已经存在、且需要补充 ASIN 或关键词背景时才执行：

1. 确认当前 Agent definitions 中存在 `sif_mcp`；
2. 用 `search` 定位本包允许的候选工具，不使用旧名称或猜测名称；
3. 对本任务首次使用的每个业务工具执行 `describe`；
4. 通过外层 `sif_mcp` 传 `action=call`、精确 `name` 与 `arguments`；只按当次机器 `inputSchema` 的 required、类型、枚举、日期和分页字段构造最小 `call.arguments`；schema 含 `country` 时显式写入有直接父证据的已确认站点，不依赖默认 US；ASIN 必须锁定，时间、粒度与分页仅在 schema 提供相应字段时显式传入，禁止额外添加未声明参数；
5. 保存真实调用状态、原始响应、三类 request ID、实际参数和覆盖范围；
6. 只观察本次实际返回的字段、单位、时间粒度与估算自述；没有机器 `outputSchema`，不得按 description 推造字段；
7. 参数错误时重新 `describe` 并修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止 SIF 分支，不更换数据源。

SIF 背景只能帮助限定关键词审计范围或标记需关注的字段，不能取代逐字文本证据，也不能证明某一修复会改善排名、流量或转化。

## 执行流程

### 第一步：冻结审计对象

为每个字段记录：

- 文本或上游路径；
- 版本、采集时间和站点；
- 父体/子体范围；
- 是否完整；
- 来源与证据 ID。

不要把竞品文本、草稿和当前线上版本混为一个对象。

### 第二步：建立保留清单

审计不是全盘重写。先标出：

- 准确且清楚的产品身份；
- 有证据的差异点；
- 已自然承载的关键词；
- 用户要求保持的品牌语气；
- 不能因优化而丢失的条件、单位和风险限定。

这些内容进入 `preserve` 清单，后续修复不得无理由删除。

### 第三步：逐字段识别问题

读取 `references/listing-issue-evidence-contract.md`，至少检查：

- `factual_accuracy`：宣称与产品事实是否一致；
- `field_role`：标题、要点、描述是否承担清楚职责；
- `keyword_use`：缺失、误配、重复或堆砌；
- `clarity`：对象、条件、单位、代词和语义是否清楚；
- `specificity`：是否用空泛形容词替代事实；
- `consistency`：字段、变体和多语言之间是否冲突；
- `claim_risk`：绝对化、比较、认证、医疗、安全或合规风险；
- `readability`：信息顺序和句子负担是否阻碍理解。

没有相应证据的维度不评估。

### 第四步：建立问题记录

每个问题单独记录：

- 精确位置与短文本证据；
- 问题类型；
- 支撑证据 ID；
- 影响机制；
- 影响范围；
- 修复动作；
- 必须保留内容；
- 复核方法；
- 状态与不确定性。

不要把十个问题压成“关键词不足”或“转化差”一句话。

### 第五步：安排优先级

不使用固定权重和万能分数。按以下顺序判断：

1. 是否会造成事实错误、误导、变体冲突或高风险宣称；
2. 是否阻碍用户识别产品或理解核心利益；
3. 是否破坏已证关键词架构；
4. 是否影响多个字段或下游发布；
5. 修复是否依赖缺失证据。

优先级使用：

- `must_fix`：不修复就不应继续发布准备；
- `high_value`：证据充分，预计显著改善理解或信息匹配；
- `refinement`：局部表达改进；
- `needs_evidence`：可能有问题，但缺少决定性资料；
- `not_assessed`：本次范围或数据不支持。

优先级不是效果预测。

### 第六步：提供修复规格

每项修复说明：

- 删除、保留、补充、重排还是澄清；
- 允许使用的 Fact ID 和 Keyword ID；
- 禁止新增的含义；
- 预期改善的具体阅读或匹配问题；
- 修改后如何复核。

用户要求直接改稿时，可把通过审计的问题账本交给 `amazon-listing-copy-development`；审计报告本身不必生成完整替换文案。

### 第七步：验收修订

有修订版本时：

1. 对比旧版与新版的字段差异；
2. 确认 `must_fix` 是否关闭；
3. 确认 `preserve` 内容没有意外丢失；
4. 检查修复是否制造新宣称、关键词堆砌或变体冲突；
5. 将问题标为 `resolved`、`partially_resolved`、`unresolved` 或 `not_verifiable`。

文本改善不等于业务效果已经验证。

## 失败与沟通

- `missing_listing`：无法取得审计文本，只输出数据准备清单。
- `missing_product_facts`：可做结构和可读性审计，但事实与宣称维度为 `not_assessed`。
- `limited_keyword_evidence`：不评估市场覆盖，只审计用户或上游明确词。
- `conflicted_sources`：并列冲突和影响，暂停相应问题结论。
- `schema_mismatch`：重新 `describe` 并按机器 `inputSchema` 修正一次；仍不匹配则停止受影响字段，记录安全错误信息且不猜映射。
- `partial_result`：交付已完成维度与明确缺口，不补零或凑分。
- `out_of_scope`：图片、账户操作、法律裁决、自动监控或效果保证。

任何失败都不触发其他外部数据源。

## 正式交付

数据就绪时至少生成：

1. `listing-quality-audit.md`：范围、保留项、逐问题审计、优先级和修复路线；
2. `listing-issue-ledger.csv`：一行一个问题及状态；
3. `audit-evidence-ledger.md`：来源路径、文本版本、证据 ID、四轴和限制。

使用 `assets/templates/listing-quality-audit-template.md`。数据不足时只生成 `data-readiness.md`；部分审计要明确列出 `not_assessed`。最终回复只链接 `outputs/` 文件。

## 质量门

- 每个问题都有位置、证据、影响、修复动作和复核方式；
- 保留项与待修项分开；
- 没有万能评分、固定权重或无依据效果比例；
- 缺失维度使用 `not_assessed`，未返回不写成零；
- 供应商数据没有被写成 Amazon 一方真值或因果效果；
- 版本、站点、变体、期间和四轴证据完整；
- 没有扩写不可见的 A+、媒体或后台词；
- 没有执行改图、发布、自动监控或其他外部数据源；
- 正式文件位于 `outputs/`，中间文件位于 `temp/`。

## 资源读取

- 建立问题记录、优先级和复核状态前读取 `references/listing-issue-evidence-contract.md`。
- 写正式审计前读取或物化 `assets/templates/listing-quality-audit-template.md`。
