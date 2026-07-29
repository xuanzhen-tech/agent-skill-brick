---
name: cross-border-intellectual-property-risk-triage
description: 对商品名称、品牌、Logo、文案、图片、包装、设计、技术特征和权利资料执行商标、版权、外观/设计与专利风险初筛，形成证据缺口和专业升级路径。适用于上市前权利盘点、投诉前预防和素材使用检查；不适用于法律侵权结论、专利/版权无风险保证、注册、诉讼或主动调用外部商标/IP 数据源。
---

<!--
文件功能：定义知识产权对象、权利链、使用情境、用户/可信上游商标证据审查、风险信号和专业核验交接。
职责边界：只做证据化初筛，不判断侵权、有效性、可注册性或胜诉概率；不主动调用外部商标、专利、版权或设计检索能力。
重要关联：对象、证据和升级状态见 references/ip-risk-triage-contract.md；正式交付使用 assets/templates/ip-risk-triage-template.md；账号执法事件由第10专家处理。
-->

# 跨境知识产权风险初筛

## 目标与完成定义

把“有没有侵权风险”转成可供律师或权利责任方处理的事实包：

1. 使用了哪些名称、Logo、文案、图片、包装、设计或技术特征；
2. 谁声称拥有、授权或制作这些对象；
3. 在哪个市场、商品类别、页面、广告或包装中如何使用；
4. 哪些冲突线索来自用户材料或可信上游提供的商标检索/专业证据；
5. 专利、版权、设计和商标分别还缺什么检索或权利证据；
6. 何时必须停止使用并升级专业复核。

最高结论是 `ready_for_qualified_ip_review`、`risk_signal_present` 或 `not_assessable`，不是“未侵权”。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的品牌名称、Logo、包装、图片、视频、文案、设计稿、产品结构、供应商协议、授权、许可、委托创作和注册证据；
- 用户或可信上游提供的带日期官方检索、律师意见、投诉通知和权利文件；
- 可信 `outputs/` 中的商品事实、Listing、视觉、政策影响和账号执法证据；
- 用户或可信上游提供的带日期、辖区、商品/服务范围、检索范围和责任方的商标检索/专业证据。

### 外部数据与能力边界

- 本 Skill 不主动获取新外部业务数据；
- 运行时输入只允许用户对话、只读 `uploads/` 和带来源/日期/版本/谱系的可信 `outputs/`；
- 当前 SIF 目录没有商标、专利、版权、外观设计或其他 IP 检索能力，`sif_mcp` 不用于合规取数；
- 不使用 Web、浏览器、Google Patents、WIPO/USPTO/EUIPO 网站抓取、版权数据库、其他 MCP/API；
- 不调用 DeepL，不读取密钥，不提交商标/专利/版权申请；
- 合法材料不足时失败关闭，形成证据缺口与专业检索问题，不换源、不猜测。

用户或可信上游提供的检索结果也不能自动证明检索完备、权利有效、商品/服务相同、可注册或无冲突；只有带范围的合格责任方意见可支持其明确声明的结论上限。

### 工作区

- `uploads/` 只读；
- `temp/compliance/<case-id>/04-ip-triage/` 存放对象清单、权利链、商标检索/专业证据、风险信号和咨询草稿；
- `outputs/compliance/<case-id>/04-ip-triage/` 存放唯一正式初筛包；
- 敏感合同、身份和未公开设计在输出中最小披露。

### 双层谱系

输入证据记录 `evidence_id`、`source_path`、对象、权利主体、市场、日期、版本、四轴、权利状态和限制。

Agent 的对象编码、使用情境、冲突线索、风险信号和升级问题为 `agent_output`，记录 `parent_evidence_ids`、转换类型、不确定性和结论上限。

四轴：

- `source_type`: `user_input`、`user_upload`、`trusted_upstream_output`、`agent`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

## 启动检查

### 最低输入

至少需要：

1. 待评估对象和版本；
2. 目标市场、站点和使用渠道；
3. 商品/服务范围；
4. 权利来源、授权或创作材料；
5. 用户担心的权利类型；
6. 计划日期和专业责任方。

### 状态

- `ready_for_qualified_ip_review`
- `risk_signal_present`
- `rights_chain_incomplete`
- `trademark_preliminary_only`
- `trademark_evidence_missing`
- `patent_search_missing`
- `copyright_evidence_missing`
- `scope_conflicted`
- `blocked`
- `out_of_scope`

### 来源缺失语义（与业务状态分列）

业务 `result_status/gate_status` 继续使用上述 IP 初筛状态；证据字段另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。`not_returned` 表示合法查询未返字段，`not_queried` 表示未查询，`parse_failed` 表示材料不可可靠解析，`missing` 表示已知必需材料缺失，`conflicted` 表示证据冲突，`true_zero` 只表示完整可验证覆盖下的真实零。

前五项不得写成 0、无权利、无冲突或无风险，也不得替代 `rights_chain_incomplete/patent_search_missing/...` 等业务门禁。正例：用户提供的完整官方检索材料由合格责任方确认检索范围内记录数为 0，可将该记录数记 `true_zero`，但风险结论仍受检索范围、日期和专业意见限制。反例：未提供商标检索材料时记 `not_queried` 或 `missing`，不能写“零近似商标”或“无商标风险”。

## 合规取数与商标证据门禁

本 Skill 不调用 `sif_mcp`、Web、浏览器、官方数据库站点或其他 MCP/API 获取商标/IP 数据。商标初筛只能接收合法输入中的既有证据，并逐份检查：

1. 来源是用户输入、只读 `uploads/` 或可信 `outputs/`；
2. 明确检索机构/责任方、数据库或材料类型；
3. 明确搜索词/图形描述、辖区、类别、商品/服务和检索日期；
4. 保存原始材料定位、版本、查询范围、分页/覆盖声明和实际返回字段；
5. 区分官方检索材料、专业意见、普通上游整理和 Agent 结构化；
6. 记录 `source_type`、`evidence_class`、`valid_as_of`、`limitations` 与责任方确认状态；
7. 覆盖不明、分页不完整、字段含义不清、材料过期或互相冲突时停止升级结论；
8. 不把“无结果”写成无商标风险。

缺少商标材料时保持 `trademark_evidence_missing` 或 `trademark_preliminary_only`，并给出合格代理人/律师需要执行的检索范围。本 Skill 不尝试补查。

## 执行流程

### 第一步：建立 IP 对象清单

分别记录：

- word mark/name；
- logo/device mark；
- slogan/copy；
- photograph/illustration/video/music；
- packaging/trade dress/design；
- product appearance；
- technical feature/process；
- software/documentation；
- domain/social handle。

不同对象和版本不得只用“品牌素材”一个字段。

### 第二步：建立使用情境

每个对象记录：

- 使用市场、站点和语言；
- 商品/服务；
- 页面、广告、包装、产品或合同位置；
- 是否作为品牌、描述、比较、兼容、引用或装饰使用；
- 计划/当前/历史期间；
- 可停止或替换性。

相同词在不同情境中的法律问题可能不同，Agent 不做终局判断。

### 第三步：建立权利链

记录：

- 创作者/设计者/供应商；
- 委托、雇佣、转让、许可或第三方素材；
- 权利主体和签署主体；
- 地区、媒介、期限、可转授权和修改权限；
- 付款/交付不等于权利转让；
- 版本、附件和缺失签字。

没有明确权利链时标 `rights_chain_incomplete`。

### 第四步：审查既有商标检索与专业证据

若用户或可信上游提供了合法材料：

- 固定搜索词/图形描述、辖区、类别、商品/服务和检索时间；
- 记录材料提供者、数据库/文件、分页或覆盖声明、结果数、字段和限制；
- 区分原文记录、专业意见、Agent 摘要和未知；
- 保留权利人、状态、类别等材料实际提供字段，但不自行解释官方效力；
- 生成需要官方数据库检索、更新检索或律师判断的问题。

材料无结果只表示所声明查询范围内未返回记录，不表示可注册、权利有效或无冲突。未提供材料时不得生成模拟查询结果。

### 第五步：处理专利与设计

本 Skill 不搜索专利/外观设计。只整理：

- 产品技术特征和设计特征；
- 开发时间线和来源；
- 供应商/设计方声明；
- 用户提供的专利/设计文件；
- 目标市场和产品版本；
- 专业检索范围和封闭问题。

没有专业检索时状态 `patent_search_missing` 或 `design_search_missing`。

### 第六步：处理版权与素材权利

对图片、视频、音乐、文案和设计记录：

- 原始文件和版本；
- 作者/提供者；
- 创作或取得日期；
- 合同/许可；
- 使用地区、媒介、期限和修改权；
- 模型/场地/商标等附属授权；
- 是否存在来源不明素材。

“网上找到”“供应商提供”不是充分授权。

### 第七步：建立风险信号

风险信号可以是：

- 权利链缺失或主体不一致；
- 商标检索/专业证据出现相关记录；
- 使用市场/商品超出许可；
- 素材来源、人物或音乐授权不明；
- 产品技术/设计由第三方提供但无保证；
- 投诉通知与现有证据冲突；
- 重要检索尚未完成。

每项写观察、证据、可能影响、替代解释和专业核验，不写“侵权成立”。

### 第八步：设置使用闸门

状态：

- `proceed_to_qualified_review`
- `hold_use_pending_rights_evidence`
- `hold_launch_pending_search`
- `replace_asset_candidate`
- `not_assessable`

是否实际停止、替换或继续由用户/合格责任方决定。

### 第九步：形成专业咨询包

提供：

- 对象与使用情境；
- 权利链；
- 商标检索/专业证据及其范围限制；
- 专利/版权/设计缺口；
- 投诉或冲突证据；
- 要求律师/代理人回答的问题；
- 业务日期和闸门。

本 Skill 不提交注册、无效、异议、诉讼或平台投诉。

## 失败与降级

- `trademark_evidence_missing`：缺少范围明确的既有商标检索/专业证据；
- `no_trademark_results`：只写本次未返回，不写无风险；
- `rights_chain_missing`：阻塞使用就绪；
- `patent_or_design_search_missing`：不判断自由实施；
- `copyright_source_unknown`：要求替换或权利确认；
- `professional_opinion_missing`：只给初筛；
- `out_of_scope`：侵权结论、可注册性、FTO 意见、申请、诉讼或平台执法。

## 正式交付

至少生成：

1. `ip-risk-triage.md`
2. `ip-object-and-use-register.csv`
3. `rights-chain-and-license-register.csv`
4. `ip-risk-signal-and-review-register.csv`
5. `ip-evidence-ledger.md`

使用 `assets/templates/ip-risk-triage-template.md`。首页明确 `preliminary_only` 和专业复核责任人。

## 质量门

- IP 对象和版本分开；
- 市场、商品/服务和使用情境明确；
- 权利链含主体、地区、媒介、期限和修改权；
- 商标检索/专业证据仅来自用户、只读上传或可信上游，并保留范围、日期、责任方和限制；
- 无结果未写成无风险；
- 专利、设计和版权未检索时明确缺口；
- 风险信号不是侵权结论；
- 无 Web、官方数据库抓取、注册或诉讼执行；
- 与第10账号执法证据边界清楚；
- 双层谱系与工作区合同完整。

## 资源读取

- 建立对象、权利链、商标检索/专业证据和升级闸门前读取 `references/ip-risk-triage-contract.md`。
- 写正式初筛包前读取或物化 `assets/templates/ip-risk-triage-template.md`。
