---
name: supplier-evaluation-and-due-diligence
description: 对用户已有的供应商候选、主体资料、证照、样品、报价、工厂信息和人工核验记录执行证据化评估，识别身份冲突、能力缺口、待核验声明与升级动作。适用于候选初筛、资料尽调、样品前后复核和采购决策准备；不适用于外部 OSINT 搜索、企业背调、供应商推荐或“绝对可信”保证。
---

<!--
文件功能：定义已有供应商候选的身份分离、证据分级、能力适配、风险信号和人工核验流程。
职责边界：只评价合法输入中的候选和证据，不搜索新供应商，不调用企业查询或 1688，不把陈述升级为已核验事实，也不输出无条件信任结论。
重要关联：证据等级、身份冲突和判定状态见 references/supplier-evidence-and-verification-contract.md；正式交付使用 assets/templates/supplier-evaluation-template.md；规格来源可消费 supplier-sourcing-readiness。
-->

# 供应商评估与尽调

## 目标与完成定义

把“这个供应商靠谱吗”改写成可审查的问题：

1. 当前候选具体对应哪个法定主体、工厂、贸易商或联系人；
2. 哪些信息是供应商自述，哪些有文件、样品或人工核验支撑；
3. 候选是否能够满足本次采购对象的硬约束；
4. 存在哪些冲突、缺口、过期材料或需专业确认事项；
5. 下一步应索取什么、由谁核验、何时才能进入报价、样品或审批。

本 Skill 不给“绝对可信”“一定是工厂”“零风险”等结论。完成意味着证据和决策条件清楚，不意味着供应商已经获批。

## 运行合同

### 合法输入

- 用户在对话中提供或放入只读 `uploads/` 的候选供应商资料；
- 主体证照、联系人信息、官网或平台截图、认证文件、审计报告、银行信息、合同草稿、报价和样品记录；
- 可信上游 `outputs/` 中的采购规格、RFQ、报价比较、质量记录和已批准核验结果；
- 用户或合格责任方提供的现场审核、视频验厂、第三方测试、引用核验和交易记录。

只分析输入中已经存在的候选。一个名称、网址、名片或聊天账号不足以自动确立法定身份。

### 外部数据边界

- 不使用 Web、浏览器、OSINT、企业搜索、1688、供应商平台、supplyflow 或其他 MCP/API；
- SIF 只有 ASIN 市场画像与探索性采购上限，不具备供应商主体、联系人、资质、询价、报价、MOQ、产能、交期、验厂或采购执行事实，不用于本 Skill；
- 不索要或保存平台密钥；
- 若关键主体或能力只能通过外部核验确认，生成核验任务并交给用户或合格责任方，不静默换源。

### 工作区

- `uploads/` 只读；
- `temp/procurement/<case-id>/02-supplier-evaluation/` 存放候选身份拆分、证据索引、冲突表和评估草稿；
- `outputs/procurement/<case-id>/02-supplier-evaluation/` 存放正式评估；
- 身份证件、银行信息等敏感资料只在任务所需范围引用，正式报告尽量记录证据 ID 和掩码定位。

### 双层证据谱系

输入 `input_evidence` 与 Agent 正式派生对象分开。每条输入证据记录来源路径、提供者、日期、版本、适用主体、有效期、原始四轴和限制；输入证据的轴值不能代替派生对象自己的轴值。

每个正式派生对象必须在对象本体直接保存五项血缘字段，不能只在报告末尾 Agent 输出账本中补写：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `identity_link` | `identity_link_id` | 支撑主体关系的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `coding \| inference` | 两端身份、关系状态、核验状态和限制 |
| `match` | `match_id` | 支撑要求匹配的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `coding \| inference` | Requirement/Candidate IDs、匹配状态和核验动作 |
| `gap` | `gap_id` | 支撑缺失或冲突判断的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `coding \| inference` | 缺口、影响范围、所需证据、责任人和状态 |
| `risk_signal` | `signal_id` | 支撑风险观察的输入 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | `inference \| hypothesis` | 观察、潜在影响、替代解释、核验和决策闸门 |
| `decision` | `decision_id` | 支撑阶段决策的 Evidence/Match/Gap/Risk IDs | 固定 `agent` | `current \| historical \| future \| mixed \| not_applicable \| unknown` | `reported \| estimated \| forecast \| mixed \| not_applicable \| unknown` | 固定 `inference` | 决策范围、阶段状态、条件、未决风险、批准和复核触发 |

所有派生对象还必须保留不确定性，且不得覆盖原始文件或供应商陈述。对象轴、时间轴、单位轴或口径轴不能替代上述五项字段。

证据合同见 `references/supplier-evidence-and-verification-contract.md`。

## 启动检查

### 最低输入

至少需要：

1. 一个用户明确提供的候选供应商；
2. 候选来源和至少一种可定位资料；
3. 本次采购对象及关键 `must` 要求；
4. 用户希望做出的决策，例如是否进入询价、样品或进一步核验。

没有候选时转交 `supplier-sourcing-readiness`，不得自行搜索或补造。

### 评估状态

- `evidence_ready`：候选身份、规格和关键证据足以评估；
- `partial`：可以评估部分维度，其余明确缺口；
- `identity_conflict`：名称、主体、地址、账户或角色不能一致对应；
- `stale_evidence`：关键证照、审计或样品记录过期；
- `verification_required`：需要用户或合格责任方外部确认；
- `blocked`：无法确认候选或采购对象；
- `out_of_scope`：请求搜索、监控、秘密调查、直接联系或保证可信。

## 执行流程

### 第一步：拆分候选身份

分别记录：

- `supplier_candidate_id`
- 法定主体名称和注册地陈述；
- 工厂、贸易公司、收款主体和合同主体；
- 品牌、网站、店铺、邮箱域名和联系人；
- 每个身份字段的证据 ID；
- 哪些字段是自述、文件陈述或人工核验。

不同法定名称、地址、收款人或联系人不得仅凭相似名称自动合并。冲突保留为独立记录。

### 第二步：检查资料真实性边界

Agent 只能检查文件内部和文件之间的：

- 名称、编号、日期、有效期和签发方是否可读；
- 页码、版本和附件是否完整；
- 主体、地址、产品范围是否一致；
- 陈述与样品、报价或沟通记录是否矛盾。

Agent 不能仅凭图片外观宣布文件真伪。需要向签发机构、政府登记或第三方核实时，状态为 `verification_required`。

### 第三步：建立证据矩阵

按采购决策需要整理：

- 主体与角色；
- 产品和工艺适配；
- 质量系统与检查能力；
- 产能和交付陈述；
- 样品表现；
- 商务、付款和合同条件；
- 合规、认证和责任险资料；
- 历史履约或引用；
- 数据安全和保密能力。

每个维度分别给出证据状态，不用一个综合分掩盖关键缺口。

### 第四步：匹配采购硬约束

消费 `supplier-sourcing-readiness` 的 Requirement ID，逐项标记：

- `supported_by_evidence`
- `supplier_reported`
- `partially_supported`
- `not_supported`
- `conflicted`
- `not_assessed`

供应商宣称的“可以做”只能是 `supplier_reported`，除非样品、测试或合格责任方核验支撑。

### 第五步：识别风险信号

风险信号只描述观察，不定性欺诈。示例：

- 合同主体与收款主体不同；
- 地址、名称、统一编号或联系人冲突；
- 证照过期、缺页或产品范围不明；
- 报价异常但口径无法解释；
- 样品与量产能力证据脱节；
- 关键工序分包但未披露；
- 拒绝提供可合理核验的必要资料。

每个信号必须说明来源、可能影响、替代解释和需要的核验。

### 第六步：形成核验计划

对每个未决项记录：

- 所需材料或核验动作；
- 合格执行者；
- 完成标准；
- 截止时间；
- 失败或拒绝时的决策规则；
- 是否涉及敏感资料和最小披露。

本 Skill 只设计核验计划，不代替责任方执行外部查询、验厂或联系。

### 第七步：给出阶段性决策

允许的阶段性结论：

- `proceed_to_rfq`
- `proceed_to_sample_with_conditions`
- `hold_for_verification`
- `do_not_proceed_on_current_evidence`
- `not_assessable`

结论必须与本次决策阶段绑定，并列出条件。不得输出永久的“合格供应商”结论。

### 第八步：记录人工批准

若用户或责任方选择继续：

- 记录批准人、日期、决策范围；
- 列出其接受的未决风险；
- 保留不得绕过的样品、质量、合同或付款闸门；
- 将新证据作为新版本追加，不改写旧评估。

## 失败与沟通

- `no_candidate`：转为寻源准备，不搜索候选；
- `missing_procurement_requirements`：只能整理证据，不能判断能力适配；
- `identity_conflict`：暂停把不同身份合并，要求责任方核验；
- `document_not_verifiable`：说明 Agent 只能读到什么，不能宣布真伪；
- `stale_or_expired`：保留历史价值，但当前状态不得写已有效；
- `insufficient_evidence`：输出缺口与核验计划；
- `out_of_scope`：外部 OSINT、供应商联系、验厂、法律结论或可信保证。

## 正式交付

至少生成：

1. `supplier-evaluation.md`：候选身份、证据矩阵、要求匹配、冲突和阶段结论；
2. `supplier-verification-plan.md`：待核验项、责任人、完成标准和决策规则；
3. `supplier-evidence-ledger.md`：输入证据与 Agent 输出谱系；
4. `supplier-decision-register.csv`：阶段结论、条件、批准人和版本。

使用 `assets/templates/supplier-evaluation-template.md`。资料不足时仍可交付缺口报告，但不得填补假证据或给出可信结论。

## 质量门

- 只评估用户已有候选；
- 法定主体、工厂、贸易商、联系人、合同和收款身份分开；
- 每项供应商陈述都保留 `reported` 状态；
- 身份冲突未被自动合并；
- 文件内部一致性检查没有冒充官方真伪核验；
- 没有固定万能权重或综合可信分；
- 风险信号含证据、影响、替代解释和核验动作；
- 阶段结论带条件、范围和批准责任；
- 无 OSINT、1688、企业搜索或其他外部回退；
- 证据与推断双层记录，`uploads/` 未改变。

## 资源读取

- 建立身份、证据矩阵和阶段结论前读取 `references/supplier-evidence-and-verification-contract.md`。
- 写正式交付前读取或物化 `assets/templates/supplier-evaluation-template.md`。
