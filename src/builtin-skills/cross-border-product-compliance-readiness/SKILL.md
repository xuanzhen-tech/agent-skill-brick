---
name: cross-border-product-compliance-readiness
description: 根据产品、目标市场、站点和用户提供的带日期现行依据，整理认证、测试、标签、包装、技术文件、责任主体与专业核验缺口，形成跨境商品合规就绪包。适用于上市前资料盘点、市场变更影响和专业咨询准备；不适用于把静态知识当现行法律、出具认证/法律结论、代办注册或从 Web 抓取法规。
---

<!--
文件功能：定义跨境商品合规的产品事实冻结、司法辖区、现行依据、要求映射、证据就绪和专业核验流程。
职责边界：只组织用户或可信上游提供的带日期依据与资料，不宣布产品合规、不自定认证要求或法律效力，也不执行注册、测试或报关。
重要关联：要求、依据和状态见 references/product-compliance-evidence-contract.md；正式交付使用 assets/templates/product-compliance-readiness-template.md；关税分类转交 customs-classification-and-duty-readiness。
-->

# 跨境商品合规就绪

## 目标与完成定义

把“这个产品能不能卖”拆成可由责任方验证的问题：

1. 产品、变体、材料、功能、宣称和销售市场是什么；
2. 哪份带日期、适用辖区和版本的依据提出了什么要求；
3. 现有测试、证书、标签、包装和技术文件覆盖哪个对象与版本；
4. 哪些要求已由合格责任方确认，哪些只是待核验候选；
5. 哪些缺口会阻塞测试、注册、生产、运输或上市；
6. 应由实验室、认证机构、法务、税务、报关或其他责任方确认什么。

本 Skill 的最高结论是 `ready_for_qualified_review` 或资料缺口，不是“产品已合规”。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的规格、BOM、材料、成分、功能、说明书、标签、包装、测试报告、证书、注册记录和市场计划；
- 用户或可信上游提供的法规、标准、平台规则、官方通知、专业意见和带日期版本；
- 可信 `outputs/` 中的产品事实、市场范围、政策影响、知识产权、海关和责任方确认；
- 合格实验室、认证机构、律师或监管责任方的可追溯结论。

当前法律、法规、标准和平台要求只能来自用户或可信上游提供的带日期原文/正式输出。Agent 的记忆和通用知识不能成为现行依据。

### 外部数据边界

- 本 Skill 不调用 `sif_mcp`；当前 SIF 目录没有认证、标签、法规、标准或商品合规能力，市场/商品信号也不能证明法律要求；
- 运行时输入仅限用户对话、只读 `uploads/` 与带来源/日期/版本的可信 `outputs/`；
- 不使用 Web、浏览器、Firecrawl、Bright Data、法规数据库、标准网站、DeepL、其他 MCP/API；
- 不读取密钥、不购买标准、不提交注册或认证申请；
- 缺现行依据时只形成事实包和专业咨询问题，失败关闭。

### 工作区

- `uploads/` 只读；
- `temp/compliance/<case-id>/01-product-readiness/` 存放产品事实、依据索引、要求映射和缺口草稿；
- `outputs/compliance/<case-id>/01-product-readiness/` 存放唯一正式就绪包；
- 新法规、产品版本或责任方意见作为新版本，不覆盖历史证据。

### 双层证据谱系

`input_evidence` 记录：

- `evidence_id`
- `source_path`
- `source_type`
- `source_date`
- `source_version`
- `jurisdiction`
- `product_scope`
- `temporal_scope`
- `estimation_status`
- `transformation_type`
- 权威性、有效状态与限制

Agent 的产品分类候选、要求映射、缺口、影响和问题属于 `agent_output`，必须记录 `parent_evidence_ids`、转换类型、假设状态和结论上限。

## 启动检查

### 最低输入

至少需要：

1. 产品和变体稳定身份；
2. 材料、功能、用途、用户群体和关键宣称；
3. 目标国家/地区、Amazon 站点和计划日期；
4. 现有标签、包装、测试、证书和责任主体；
5. 用户提供的现行依据或明确“尚未取得”；
6. 希望做出的决策和专业责任人。

### 状态

- `ready_for_qualified_review`
- `evidence_ready_partial`
- `current_authority_missing`
- `product_scope_conflicted`
- `document_scope_mismatch`
- `expired_or_stale`
- `translation_review_required`
- `blocked`
- `out_of_scope`

没有当前依据时，不得基于静态常识列“必须认证清单”。

### 来源缺失语义（与业务状态分列）

业务 `result_status` 继续使用上述商品合规就绪状态；每个依据、产品事实或文档字段另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。`true_zero` 仅用于完整、可验证范围明确返回的真实零，其他五项都不是零。

前五项不得写成 0、无要求、无证书缺口或无风险，也不得覆盖 `current_authority_missing/document_scope_mismatch/...` 等业务门禁。正例：完整 BOM 经责任方确认无线模块数量为 0，可记 `true_zero`，但是否适用认证仍由当前依据决定。反例：当前法规原文未查询时记 `not_queried`，不能据此写“无需认证”。

## 执行流程

### 第一步：冻结产品事实

记录：

- `product_fact_set_id`
- SKU/ASIN/型号/变体；
- 材料、成分、功率、电池、无线、食品接触、儿童使用等用户提供事实；
- 预期用途、误用风险和用户群体；
- 包装、标签、说明书和宣称版本；
- 生产/进口/销售责任主体；
- 未知或冲突字段。

Agent 不根据图片外观猜材料、年龄段、医疗用途或技术参数。

### 第二步：固定市场和时间

每个分析单元记录：

- 国家/地区和子辖区；
- Amazon 站点；
- 上市/进口日期；
- 产品和包装版本；
- 责任主体角色；
- 适用语言；
- 用户提供依据的发布日期、生效日、失效/替代状态。

不同市场或日期不得合并成一个“全球合规”结论。

### 第三步：建立现行依据登记

对每份法规、标准、平台规则或专业意见记录：

- 标题、签发/发布主体；
- 来源路径和原文定位；
- 发布、生效、修订和检索/提供日期；
- 适用市场、产品和责任主体；
- 原文语言；
- 是否为原文、摘要、翻译或专业意见；
- 当前有效性由谁确认；
- 限制。

只有摘要没有原文时，要求映射状态为 `reference_incomplete`。

### 第四步：执行证据保真翻译模式

需要跨语言理解时：

- 保留原文段落 ID；
- 逐段对齐，不删限定词、例外、否定、日期、单位和定义；
- 区分直译、术语选择、解释性注释和不确定项；
- 不调用 DeepL 或 Web；
- 不把 Agent 翻译写成官方译文；
- 高风险条款状态为 `translation_review_required`，交合格人员复核。

翻译是本 Skill 的证据保真模式，不单独拆包。

### 第五步：建立要求候选

从用户提供的依据抽取：

- 要求对象；
- 触发条件；
- 必须/禁止/例外；
- 证据或文件；
- 测试/认证/注册/标签/说明/追溯要求；
- 责任主体；
- 时间点；
- 原文段落证据；
- 是否需要专业解释。

Agent 只做结构化和候选映射，不宣布法律适用性。

### 第六步：映射现有资料

逐项匹配：

- 测试报告的样品、型号、标准版本和日期；
- 证书的主体、范围、编号、有效期；
- 标签/包装/说明书的版本、语言和市场；
- 技术文件、风险评估和追溯资料；
- 责任主体声明和授权；
- 变体、材料或供应商变化。

文件名称相同不等于适用。过期、范围不明或版本不一致要保留。

### 第七步：判断就绪而非合规

每项状态：

- `evidence_available`
- `evidence_partial`
- `scope_mismatch`
- `expired_or_stale`
- `authority_confirmation_required`
- `qualified_review_required`
- `missing`
- `not_assessed`

不得使用 `compliant/non_compliant`，除非该状态直接来自合格责任方的可追溯结论，并仍需注明范围和日期。

### 第八步：建立缺口与责任

每个缺口记录：

- 缺少的事实、原文、测试、证书、标签或责任确认；
- 影响的市场、版本和里程碑；
- 合格责任方；
- 所需问题和完成标准；
- 截止日期；
- 未解决时的 `hold` 条件。

### 第九步：形成专业咨询包

向实验室/认证/法务责任方提供：

- 产品事实和变体；
- 目标市场/日期；
- 现有依据与原文定位；
- 要求候选；
- 证据和缺口；
- 需要回答的封闭问题；
- Agent 结论上限。

本 Skill 不发送或提交。

## 失败与降级

- `current_authority_missing`：仅交付事实包与来源请求；
- `product_facts_missing`：不做要求映射；
- `scope_conflict`：分市场/版本并列，暂停合并结论；
- `document_expired`：只作历史证据；
- `translation_uncertain`：保留原文并要求专业复核；
- `qualified_opinion_missing`：不宣布合规；
- `out_of_scope`：认证申请、法律意见、测试执行、注册、标签签署或保证上市。

## 正式交付

至少生成：

1. `product-compliance-readiness.md`
2. `compliance-authority-and-requirement-register.csv`
3. `product-document-coverage-register.csv`
4. `qualified-review-question-pack.md`
5. `compliance-evidence-ledger.md`

使用 `assets/templates/product-compliance-readiness-template.md`。首页必须写明分析日期、市场、产品版本和“非法律/认证结论”。

## 质量门

- 产品、市场、日期和责任主体明确；
- 所有现行要求都有用户/可信上游带日期依据；
- 原文、摘要、翻译和专业意见分开；
- 翻译保留限定词、例外、日期、单位和段落 ID；
- 测试/证书/标签与产品版本逐项匹配；
- 过期或范围不明没有写成有效；
- 使用就绪状态而非 Agent 自定合规结论；
- 无 Web、法规抓取、DeepL 或外部工具；
- 无注册、测试或认证执行；
- 双层谱系与工作区合同完整。

## 资源读取

- 建立依据、要求、文档覆盖和专业问题前读取 `references/product-compliance-evidence-contract.md`。
- 写正式就绪包前读取或物化 `assets/templates/product-compliance-readiness-template.md`。
