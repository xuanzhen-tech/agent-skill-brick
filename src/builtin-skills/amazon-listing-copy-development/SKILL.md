---
name: amazon-listing-copy-development
description: 基于已核实产品事实、可追溯关键词架构和用户品牌要求，开发或改写 Amazon Listing 标题、要点、描述与后台词候选，并执行跨语言含义、宣称和可读性质量检查。适用于新 Listing 文案、现有文案重写、多语言本地化和字段级交付；不适用于关键词市场研究、A+完整规划、图片生成、后台发布或无证据卖点创作。
---

<!--
文件功能：定义 Amazon Listing 文案开发与本地化的事实闸门、写作流程、失败语义和正式交付。
职责边界：只在已证产品事实与关键词约束内生成文案，不调用 DeepL、SIF、Pangolinfo 或其他外部写作服务，不发布到 Seller Central。
重要关联：宣称与跨语言检查见 references/listing-copy-evidence-and-localization-contract.md；正式交付使用 assets/templates/listing-copy-package-template.md；关键词输入优先来自相邻 amazon-listing-keyword-architecture。
-->

# Amazon Listing 文案开发

## 目标与边界

生成可以被业务人员审阅和继续发布准备的 Listing 字段草案，同时保证：

- 每个产品事实和核心卖点都有来源；
- 关键词自然表达，不牺牲准确性和可读性；
- 多语言版本保持含义、条件、单位和风险边界；
- 未证宣称、未知政策和不可见后台状态不会被包装成事实。

本 Skill 交付文案包，不承诺收录、排名、转化或 Amazon 审核通过，也不执行上传、发布和账户操作。

## 运行合同

### 合法输入

- 用户对话或 `uploads/` 中的规格、说明书、包装信息、品牌语气和明确限制；
- 可信上游 `outputs/` 中的产品事实、关键词架构、VOC 证据和竞品研究；
- Agent 基于上述证据进行的写作、重组和语言质量判断。

上游文件必须记录路径、版本或日期、使用字段和证据 ID。竞品文案只能用于识别结构或未满足需求，不得拼接、近似改写或冒充原创。

### 禁止

- 本 Skill 不直接调用 `sif_mcp`；如果关键词架构或市场研究曾使用 SIF，只消费其已经交付、可追溯的上游对象；
- 不调用 DeepL MCP、Pangolinfo、网页、浏览器、Amazon 抓取、其他 MCP 或 API；
- 不安装翻译或写作服务，不读取或索要密钥；
- 不把用户未提供的认证、质保、材质、性能、测试结果、兼容性、原产地或环保属性写入文案；
- 不使用“业内最佳”等无法证明的绝对表述；
- 不把后台词候选说成已写入、已索引或已生效；
- 不复制候选 Skill、竞品 Listing、评论或来源模板的表达。

### 四轴证据

对支撑文案的证据记录：

- `source_type`：`user_input`、`upstream_output` 或 `agent`；
- `temporal_scope`：`current`、`historical`、`future`、`mixed`、`not_applicable` 或 `unknown`；
- `estimation_status`：`reported`、`estimated`、`forecast`、`mixed`、`not_applicable` 或 `unknown`；
- `transformation_type`：`raw`、`normalized`、`calculation`、`coding`、`inference` 或 `hypothesis`。

文案句子是 Agent 转换，不是来源原文，应使用 `source_type=agent`、`transformation_type=coding`，并通过 `parent_evidence_ids` 引用所依赖的事实与关键词证据。证据账本必须区分：

- `input_evidence`：保留用户或上游输入的来源路径、Evidence ID 和原四轴；
- `agent_output`：记录 Copy ID、本层四轴以及支撑它的 `parent_evidence_ids`。

上游对象在本包固定使用 `source_type=upstream_output`，同时在独立的 `upstream_original_axes` 中保留其原始四轴与父证据 ID；不得把上游原始来源重标为本包直接取数，也不得用 Agent 产物的一组四轴覆盖输入证据的原四轴。

### 工作区

- `uploads/` 只读；
- `temp/listing-optimization/<case-id>/02-copy-development/` 存放事实矩阵、字段草稿和语言比对；
- `outputs/listing-optimization/<case-id>/02-copy-development/` 存放唯一正式文案包。

不得修改关键词上游、用户原文件或其他专家输出。

## 启动检查

### 最低输入

至少明确：

1. Amazon 站点、目标语言和产品/变体；
2. 目标字段：标题、要点、描述、后台词候选中的哪些；
3. 足以识别产品并支撑卖点的事实；
4. 关键词架构或用户明确提供的有限关键词要求；
5. 品牌语气、目标受众和禁用表述；
6. 是新建、局部改写还是多语言本地化。

没有广泛关键词研究并不总是阻塞：用户给出的有限词足以满足有限写作时可以继续，但要明确覆盖范围。缺少产品身份或核心事实时必须停止。

### 事实状态

逐项标记：

- `verified`：有明确来源和适用范围；
- `user_asserted`：用户明确提供但无独立核验，允许按用户事实使用并标注来源；
- `derived`：可由已证事实直接重述，不增加新含义；
- `needs_confirmation`：含义、变体、单位或适用条件不清；
- `prohibited`：无证、敏感、误导或用户明确禁用。

`needs_confirmation` 和 `prohibited` 不能进入正式文案。

## 上游合同预检

文案任务不主动取数。使用用户资料或可信上游前必须：

1. 确认来源路径、版本、站点、产品与变体范围可定位；
2. 确认所用 Fact ID、Keyword ID、Evidence ID 和字段真实存在；
3. 保留上游原始四轴、期间、估算属性、限制和父证据 ID；
4. 仅使用上游明确交付的字段，不从供应商展示块、描述或未返回字段扩写产品事实；
5. 对 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted` 和有明确零证据的 `true_zero` 分别处理；
6. 上游合同、站点或版本不匹配时停止受影响文案，不直接调用 SIF 或其他来源补齐。

现有资料足够时继续写作并披露没有新增外部取数；不足时生成数据准备清单。

## 执行流程

### 第一步：建立事实—宣称矩阵

读取 `references/listing-copy-evidence-and-localization-contract.md`，为每个候选卖点记录：

- 原始事实和 Fact ID；
- 适用变体、站点和条件；
- 允许的中性表述；
- 不允许扩张的含义；
- 证据来源与四轴；
- 是否需要用户确认。

事实矩阵先于写作。不要先写出吸引人的句子再寻找支持。

### 第二步：读取关键词约束

优先读取 `amazon-listing-keyword-architecture` 的正式输出，并保留：

- 字段推荐词与使用目的；
- 产品事实 ID；
- 必须自然表达的词；
- 禁用、品牌和风险词；
- 未解决证据缺口。

没有关键词架构时，只能按用户明确给出的词做有限写作，不自行声称完成关键词优化。

### 第三步：设计信息层级

在写句子前分配：

- 标题：产品身份、关键差异和必要限定；
- 要点：每条一个清晰利益主题，再给事实支撑和适用条件；
- 描述：补充场景、使用方式、边界与需要上下文的长尾；
- 后台词候选：只提供去重后的规划清单和政策待核状态。

字段数量、字符限制和禁用规则以用户当前规则或可验证政策为准；无法验证时不编造统一限制。

### 第四步：生成主稿

1. 先写信息完整且准确的主稿；
2. 在不改变事实的前提下自然融入关键词；
3. 删除空泛形容词、重复卖点和无信息密度句子；
4. 单位、范围、条件和否定词保持精确；
5. 使用目标语言自然语序，不逐字翻译源语言；
6. 对关键选择保留“句子 → Fact ID → Keyword ID”的映射。

除非用户明确要求方案比较，不默认生成固定数量的版本。需要备选时，只改变表达角度，不改变事实。

### 第五步：多语言本地化

多语言任务按两层执行：

1. **含义层**：核对产品身份、数字、单位、条件、否定、适用范围和风险限定；
2. **表达层**：核对自然语序、受众可理解性、关键词变形和品牌语气。

Agent 可以生成目标语言草案，但不得声称使用 DeepL、人工母语审校或认证翻译。涉及法律、医疗、安全、合规或高风险宣称时，明确要求合格人工审核后再发布。

### 第六步：执行反向检查

从成稿逐句反查：

- 是否有对应 Fact ID；
- 是否把用户主张升级为独立事实；
- 是否把供应商估算写成确定结果；
- 是否加入来源没有的认证、保证或比较；
- 是否错误扩展到其他变体；
- 是否因关键词导致含义不自然或误导；
- 多语言版本是否遗漏限定词、否定词或单位。

没有证据的句子删除或降为明确待确认备注，不留在可发布文案中。

### 第七步：交接审计与实验

- 需要独立诊断现有文案时，交给 `amazon-listing-quality-audit`；
- 需要 A+ 模块与视觉 brief 时，交给 `amazon-aplus-content-planning`；
- 需要比较两个文案方案时，交给 `amazon-listing-experiment-design`；
- 不因存在两个草案就声称已经完成 A/B 测试。

## 失败与沟通

- `blocked_missing_facts`：缺少产品身份或核心卖点证据，只输出缺失清单。
- `blocked_claim_risk`：关键宣称无法支持，提供安全替代表述或请求证据。
- `limited_keywords`：只有用户词，允许有限文案但不称全面 SEO 优化。
- `conflicted_sources`：来源事实冲突，列出冲突与受影响句子，等待确认。
- `upstream_contract_mismatch`：停止受影响字段，列出缺失 ID、版本或口径，不直接取数补齐。
- `stale_upstream`：可做语言或结构草案，不声称当前市场匹配。
- `out_of_scope`：发布、广告、图片生成、法律判断或后台自动化。

失败不会触发其他外部数据源。

## 正式交付

数据就绪时至少生成：

1. `listing-copy-package.md`：字段成稿、备选（如用户要求）、理由和发布前检查；
2. `claim-evidence-ledger.md`：分开记录输入证据与 Agent 文案，使用 Evidence ID、Copy ID、`parent_evidence_ids`、来源路径、原四轴和本层四轴；
3. 多语言任务另生成 `localization-qc.md`：关键含义对照、风险与人工审核项。

使用 `assets/templates/listing-copy-package-template.md`。如果核心事实不足，只生成 `data-readiness.md`；不得交付看似完整但包含占位事实的文案。最终回复只链接 `outputs/` 中的正式文件。

## 质量门

- 每个事实性句子可追溯到合法来源；
- `needs_confirmation` 或 `prohibited` 内容未进入正式文案；
- 关键词没有改变事实、制造堆砌或覆盖可读性；
- 字段之间信息职责清楚，没有机械重复；
- 多语言版本保留数字、单位、条件、否定和风险限定；
- 没有固定万能字符上限或无来源平台规则；
- 没有排名、转化、审核通过或已发布承诺；
- 没有直接调用 SIF、DeepL、Pangolinfo 或其他外部服务；
- 正式文件位于 `outputs/`，中间文件位于 `temp/`。

## 资源读取

- 建立事实矩阵和执行多语言检查前读取 `references/listing-copy-evidence-and-localization-contract.md`。
- 写正式文案包前读取或物化 `assets/templates/listing-copy-package-template.md`。
