---
name: supplier-evaluation-and-due-diligence
description: 对用户已有的供应商候选、主体资料、证照、样品、报价、工厂信息和人工核验记录执行证据化评估，识别身份冲突、能力缺口、待核验声明与升级动作。适用于候选初筛、资料尽调、样品前后复核和采购决策准备；不适用于外部 OSINT 搜索、企业背调、供应商推荐或“绝对可信”保证。
---

<!--
文件功能：定义已有供应商候选的身份分离、证据分级、能力适配、风险信号和人工核验流程。
职责边界：评价合法输入中的候选和证据；仅在用户明确要求候选线索时允许用 Sorftime 1688 工具形成待核验候选，不调用企业查询，不把平台陈述升级为已核验身份、资质或能力，也不输出无条件信任结论。
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

## 使用边界

### 合法输入

- 用户在对话中提供或放入只读 `uploads/` 的候选供应商资料；
- 主体证照、联系人信息、官网或平台截图、认证文件、审计报告、银行信息、合同草稿、报价和样品记录；
- 可信上游 `outputs/` 中的采购规格、RFQ、报价比较、质量记录和已批准核验结果；
- 用户或合格责任方提供的现场审核、视频验厂、第三方测试、引用核验和交易记录。

默认只分析输入中已经存在的候选。用户明确要求从 1688 补充候选线索时，可以新增 `candidate_lead`，但线索本身不自动进入“已尽调供应商”集合。

### 外部数据边界

- 只允许两类外部背景：`sorftime_mcp` 的 `ali1688_product_search`、`ali1688_product_request`、`ali1688_similar_product`、`ali1688_product_search_from_image`、`ali1688_product_variations` 候选线索，以及 SIF/SellerSprite 的 Amazon 市场需求/售价反向验证；不使用 Web、浏览器、OSINT、企业搜索、其它供应商平台、supplyflow 或其它 MCP/API；
- SIF 只可通过 `sif_mcp` 使用 `market_get_asin_profile`，SellerSprite 只可通过 `sellersprite_mcp` 使用 `product_research`、`competitor_lookup` 或 `asin_detail` 反向验证 Amazon 市场需求/售价背景；Sorftime 1688 只通过 `sorftime_mcp` 提供平台挂牌商品、店铺/供应商名称陈述、SKU 或相似货源线索。三者都不证明法定主体、联系人、资质、MOQ、正式报价、产能、交期、验厂、质量或合同履约；
- 不索要或保存平台密钥；
- 若关键主体或能力只能通过外部核验确认，生成核验任务并交给用户或合格责任方，不静默换源。

### 三 MCP 候选线索合同

- 用户没有明确要求新增候选时，不调用三个 MCP；
- 工具名未知时先通过对应外层工具执行 `action=search`；已知上述精确工具名可直接 `describe`。本任务每个内层工具首次 `call` 前必须执行实时 `describe`，再由同一外层工具用相同精确 `name` 和符合实时 `inputSchema` 的 `arguments` 调用；
- 以图搜货必须使用用户提供或可信上游可追溯的 `image_url`，不得自行上传、外传或伪造图片地址；
- 平台/站点、商品 ID、查询词、图片、分页或筛选条件都必须来自父 Evidence，并映射到实时 schema 实际字段（如 `country|marketplace|amz_site|keyword_support_site|site`）；只有 schema 无法控制站点且默认/覆盖与目标不一致时才关闭该分支，不得依赖 `US`、`Unknow` 或 `UnKonw` 默认值；
- Sorftime 非 Amazon 能力只有任务平台明确为 1688 寻源时才使用；
- 三个目录均无 `outputSchema`；字段只按真实响应验收，不拼 Gateway、HTTP、shell，不索取密钥。

Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配；其他候选仍须实时 `describe`，副作用无法确认时失败关闭。

每次 MCP 业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造参数时不调用。未查询、未返回、解析失败、字段缺失或冲突都不能补成零。跨挂牌或跨商品对照先核对主体、规格、单位、币种、时间和定义；真正可比才比较且不平均，部分可比只作方向参考，冲突分列。Sorftime 1688 是独有单源线索分支，失败时只说明该来源不可用和当前没有相应证据，不写成多源覆盖不足，也不得宣称完成寻源或尽调。Agent 形成的未验证候选、身份拆分、匹配和风险信号必须直接引用所用证据。

### 工作区

- `uploads/` 只读；
- `temp/procurement/<case-id>/02-supplier-evaluation/` 存放候选身份拆分、证据索引、冲突表和评估草稿；
- `outputs/procurement/<case-id>/02-supplier-evaluation/` 存放正式评估；
- 身份证件、银行信息等敏感资料只在任务所需范围引用，正式报告尽量只记录脱敏后的文件、页码或字段位置。

### 证据与判断

原始材料与 Agent 判断分开保存。每份材料说明由谁提供、对应哪个主体、何时有效、能证明什么以及不能证明什么；不得用后来形成的判断覆盖原文件或供应商陈述。

正式评估围绕五类有业务意义的记录展开：

| 记录 | 必须回答 | 直接依据 | 限制与下一步 |
|---|---|---|---|
| 身份关系 | 两个名称、地址、收款人或联系人是否指向同一主体 | 支撑或冲突该关系的材料 | 不能确认时保持拆分，并指定核验责任人 |
| 要求匹配 | 候选对具体采购要求支持到什么程度 | Requirement 与候选材料 | 区分已证实、供应商陈述、部分支持和未评估 |
| 证据缺口 | 缺什么、影响哪个决策 | 已有材料与缺失项 | 写清所需证据、责任人和完成标准 |
| 风险信号 | 观察到什么、可能影响什么 | 可定位的原始材料 | 保留替代解释，不把信号写成已发生事实 |
| 阶段决策 | 当前可进入询价、打样还是继续核验 | 上述关系、匹配、缺口和风险 | 写明适用范围、条件、未决风险和复核触发 |

每条判断都直接引用实际依据，并说明推理理由、不确定性和结论上限；不能只在报告末尾放一张通用血缘表。

证据合同见 `references/supplier-evidence-and-verification-contract.md`。

## 启动检查

### 最低输入

至少需要：

1. 一个用户明确提供的候选供应商，或一个由本包/可信上游保留 Sorftime 实际工具、查询范围、原始结果定位和限制的未验证 1688 候选线索；
2. 候选来源和至少一种可定位资料；
3. 本次采购对象及关键 `must` 要求；
4. 用户希望做出的决策，例如是否进入询价、样品或进一步核验。

没有候选且用户未明确要求 1688 线索时转交 `supplier-sourcing-readiness`，不得自行搜索或补造。

### 启动判断

先判断候选身份、采购规格和关键证据能支持哪些评估维度。名称、主体、地址、账户或角色不能对应，证照/审计/样品记录过期，或需要合格责任方外部确认时，逐项说明受影响判断和下一步。无法确认候选或采购对象时阻塞；搜索、监控、秘密调查、直接联系和保证可信不在范围内。

## 执行流程

### 第一步：拆分候选身份

分别记录：

- `supplier_candidate_id`
- 法定主体名称和注册地陈述；
- 工厂、贸易公司、收款主体和合同主体；
- 品牌、网站、店铺、邮箱域名和联系人；
- 每个身份字段对应的原始文件、页码或字段位置；
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
- 当任务要求外部 OSINT、供应商联系、验厂、法律结论或可信保证时，当前 Agent 无法完成现场或权威核验，因而不能把材料审阅写成真实性或合规性保证；降级为证据缺口、核验问题清单和需转交人工或专业机构的事项。

## 正式交付

至少生成：

1. `supplier-evaluation.md`：候选身份、证据矩阵、要求匹配、冲突和阶段结论；
2. `supplier-verification-plan.md`：待核验项、责任人、完成标准和决策规则；
3. `supplier-evidence-ledger.md`：输入证据与 Agent 输出谱系；
4. `supplier-decision-register.csv`：阶段结论、条件、批准人和版本。

使用 `assets/templates/supplier-evaluation-template.md`。资料不足时仍可交付缺口报告，但不得填补假证据或给出可信结论。

## 质量门

- 按 `references/supplier-evidence-and-verification-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；压缩或截断的候选线索不得声称候选全量，须缩小范围或按内层分页。仍不完整时，说明 Sorftime 实际覆盖的页码与候选、缺失的范围、因此不能判断的事项，以及继续分页所需条件。

- 只评估用户已有候选，或用户明确要求后形成且保留实际工具、查询范围、原始结果定位和限制的未验证候选线索；
- 法定主体、工厂、贸易商、联系人、合同和收款身份分开；
- 每项供应商陈述都保留 `reported` 状态；
- 身份冲突未被自动合并；
- 文件内部一致性检查没有冒充官方真伪核验；
- 没有固定万能权重或综合可信分；
- 风险信号含证据、影响、替代解释和核验动作；
- 阶段结论带条件、范围和批准责任；
- 无 OSINT、企业搜索或其他外部回退；1688 只限上述 Sorftime 未核验候选线索分支；
- 证据与推断双层记录，`uploads/` 未改变。

## 资源读取

- 建立身份、证据矩阵和阶段结论前读取 `references/supplier-evidence-and-verification-contract.md`。
- 写正式交付前读取或物化 `assets/templates/supplier-evaluation-template.md`。
