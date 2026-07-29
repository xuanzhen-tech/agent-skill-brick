---
name: amazon-fba-shipment-readiness
description: 基于用户材料与可信上游正式产物，审查 Amazon FBA 人工建件所需资料是否就绪，并生成可追溯的缺口清单与人工交接包。适用于用户希望在人工建件前盘点 SKU、数量、包装、标签、目的信息和账户状态材料；不适用于创建或提交货件、查询或修复账户/商品状态、生成标签、计算补货或运输经济性。
---
<!--
文件功能：定义 FBA 货件“人工建件资料就绪”审查流程，约束证据、判断、降级和正式交付。
适用边界：只准备和审核人工建件资料；不创建、修改、提交货件，不查询或修复账户与商品状态。
维护约定：字段细则见 references/fba-readiness-evidence-contract.md，正式输出结构见 assets/templates/fba-shipment-readiness-report.md。
-->

# Amazon FBA 货件资料就绪审查

## 何时使用

当用户希望在人工创建 FBA 货件前完成资料盘点、字段核对、证据缺口识别、交接清单编制或就绪性判断时使用。

典型请求包括：

- “帮我检查这批 SKU 是否具备人工建 FBA 货件的资料。”
- “把箱规、标签、数量和目的站信息整理成建件交接包。”
- “指出还缺哪些材料，不要替我提交。”
- “根据我上传的账户状态截图判断是否需要人工复核。”

## 不得使用的场景

本 Skill 不得：

- 创建、修改、复制、确认、提交或取消 FBA 货件。
- 登录 Seller Central、调用 SP-API、浏览器自动化或任何未注入平台能力。
- 查询、刷新、修复 IPI、stranded inventory、suppressed listing 或其他账户状态。
- 生成运输标签、箱唛、承运商预约、装箱单或平台确认号。
- 代替用户决定受限品、危险品、税务、清关或监管合规结论。
- 计算补货量、库存预测、安全库存、利润或运输经济性。

若请求包含上述动作，只完成合法的资料审查部分，并把其余动作明确交回人工或对应专家。

## 责任边界

### 本 Skill 单一负责

- 确认本次人工建件范围与货件身份。
- 盘点用户提供的 SKU、数量、标签、包装、箱规和目的信息。
- 判断每一项资料为 `ready`、`missing`、`conflict`、`expired`、`not_applicable` 或 `needs_human_confirmation`。
- 建立证据到判断的双层谱系。
- 输出人工建件前的缺口清单、阻塞项、待确认项和交接包。

### 由其他能力负责

- 补货执行准备：`amazon-replenishment-execution-readiness`。
- 货运报价比较：`cross-border-freight-option-comparison`。
- 仓内退货处置方案：`warehouse-return-disposition-planning`。
- HS 编码、税率、清关与反倾销：专家 09。
- 运输经济、贡献利润和价格边界：专家 14。
- 实际创建、提交、预约、发运和平台状态修复：人工或经明确授权的专用执行系统。

## 可接受的数据源

按以下优先级使用证据：

1. 用户在当前任务中明确提供的文件、表格、截图或文字确认。
2. `uploads/` 中由用户上传且与本次货件明确关联的只读材料。
3. 已由可信上游生成、带版本和谱系的 `outputs/` 正式产物。

本 Skill 不调用 `sif_mcp` 或其他外部业务工具。SIF 销量信号不能证明库存、货件、标签、包装、箱规、目的节点、账户状态或平台接受结果。不得使用 Web、浏览器、SP-API、ERP、WMS、领星、17TRACK 或其他 API/MCP 作为回退；合法输入不足时封闭失败。

## 工作区约定

- `uploads/`：用户上传区，只读，不改名、不覆盖、不回写。
- `temp/`：中间解析、字段对齐和草稿区，不作为正式结论来源。
- `outputs/`：正式交付区，只写最终报告与经确认的交接材料。
- 不把密钥、Cookie、令牌、个人密码或平台会话写入任何目录。

## 开始前必须建立的任务契约

先向用户确认或从材料中明确以下内容：

- 本次任务 ID 或可复现的货件批次标识。
- 站点、目的国家/地区和计划发运窗口。
- 纳入审查的 SKU 集合及版本。
- 目标是“资料审查”而不是“平台建件或提交”。
- 谁拥有数量、标签、包装和合规事实的最终确认权。
- 正式产物的文件名、输出位置和预期读者。

任何关键范围无法确定时，不得把不同站点、批次或版本合并。

## 双层谱系与四轴

每个关键字段必须同时保留两层：

### 第一层：原始证据 envelope

每条来源证据都必须记录：

- `evidence_id`
- `source_type`: `user_input | user_upload | trusted_upstream_output`
- `source_locator`: 文件/产物、页/表/行、截图区域或返回记录定位
- `source_version`
- `observed_at`: 本任务读取或观察时间及时区
- `business_time`: 材料声明的业务时点/期间及时区
- `temporal_scope`: `current | historical | future | mixed | unknown`
- `estimation_status`: `reported | estimated | forecast | mixed | unknown`
- `transformation_type`: `raw | provider_derived`
- `raw_value` 与 `raw_unit_or_currency`
- `provider_or_owner`
- `confirmation_status`
- `limitations`

### 第二层：派生 record

规范化、检查与结论是三类独立的正式派生对象。每个对象本体直接保存五项血缘字段，不能只在报告末尾总账中补写：

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 对象载荷 |
|---|---|---|---|---|---|---|---|
| `normalized` | `normalized_id` | 支撑原值与规范化值的原始 Evidence IDs | 固定 `agent` | `current \| historical \| future \| mixed \| unknown` | `not_applicable \| estimated \| unknown` | 固定 `normalized` | 原值/单位、规范化值/单位、规则、精度和舍入 |
| `check` | `check_id` | 支撑检查输入、规则和阈值的 Evidence/Normalized IDs | 固定 `agent` | `current \| historical \| future \| mixed \| unknown` | `not_applicable \| estimated \| unknown` | `calculation \| comparison` | 检查项、带单位步骤、结果、差异、状态和原因 |
| `conclusion` | `conclusion_id` | 支撑结论的 Evidence/Normalized/Check IDs | 固定 `agent` | `current \| historical \| future \| mixed \| unknown` | `not_applicable \| estimated \| unknown` | 固定 `decision` | 结论、阻塞、假设、下一责任人和人工交接 |

三类对象还分别记录 `output_id`、`rule_version`、`generated_at`、`uncertainty`、`result_status=ready | ready_with_limitations | blocked | out_of_scope` 与 `reason_codes[]`。`normalized_id`、`check_id`、`conclusion_id` 是领域对象 ID，不能替代 `output_id`；`evidence_id` 也不能替代 `parent_evidence_ids`。派生对象的轴值必须逐条赋值，不能从父证据继承。

原对象、时间、单位/币种和口径只能作为附加比较维度，不能替代上述 envelope/record 必填字段：

- **对象轴**：站点、批次、SKU/ASIN/FNSKU、箱、托盘和目的节点分别是谁。
- **时间轴**：证据时点、有效期、计划发运窗口和判断生成时间。
- **单位/币种轴**：件、箱、托、重量和尺寸单位；本 Skill 通常不处理币种，出现费用时只原样保留。
- **口径轴**：数量含义、包装层级、标签类型、重量类型和状态定义。

## 核心输入合同

### 货件身份

至少需要：

- Marketplace 或站点。
- 目的国家/地区。
- 货件批次标识。
- 计划发运窗口。
- 商品范围版本。

不得根据相似名称把不同批次视为同一批次。

### 商品与标签映射

逐项核对：

- Merchant SKU。
- ASIN；若用户未提供且任务不要求，可标记 `not_applicable`。
- FNSKU 或用户声明的标签策略。
- 商品名称/变体，用于人工辨识，不作为唯一键。
- 每箱件数和计划总件数。
- 标签责任方与标签版本。

SKU、ASIN、FNSKU 任一映射冲突时，相关行必须为 `conflict`，不得择一猜测。

### 包装与箱规

按用户材料原样记录：

- 包装层级和包装责任方。
- 单箱件数、箱数、散箱情况。
- 箱体长宽高及单位。
- 实际重量及单位。
- 超重、超尺寸、混装或特殊处理的用户声明。
- 标签/箱唛样张的版本和批准状态。

不得用商品尺寸替代箱体尺寸，不得用估算重量替代实际称重。

### 目的与运输交接信息

仅记录用户或可信上游已经确认的：

- 目的节点名称或代码。
- 收货地址版本。
- 发货地与计划提货窗口。
- 承运责任方。
- 是否存在预约、托盘或交付要求。

若目的节点尚未由人工建件流程产生，不得虚构；标记为 `needs_human_confirmation`。

### 账户与商品状态快照

IPI、stranded inventory、suppressed listing 及类似状态只能消费用户主动提供的带日期快照。

每个快照必须记录：

- 截图/文件标识。
- 明确的站点和账户范围。
- 快照日期与时区；没有时区则注明未知。
- 用户声明的页面或状态名称。
- 与本批次 SKU 的可验证关联。

本 Skill 不查询、不刷新、不解释为实时状态，也不修复这些状态。无日期快照只能作为背景材料，不能支持 `ready` 结论。

## 标准工作流

### 第一步：登记材料清单

为每份材料建立完整原始证据 envelope，标明来源、版本、观察时间、业务时间、四轴和限制。重复文件不得静默覆盖；保留版本关系。

### 第二步：锁定货件范围

建立站点、批次、SKU 集合和计划窗口的范围表。发现跨站点或跨批次材料时拆分审查。

### 第三步：建立逐 SKU 证据矩阵

对商品映射、数量、标签、包装、箱规、目的信息逐项挂接证据。空值必须保持为空，不得从邻行传播。

### 第四步：检查数量闭环

仅检查用户提供数字之间是否一致：

`计划总件数 = 各箱件数之和`

若存在散箱、混装或非整数包装，使用用户声明的口径单独列示，不擅自修正。该检查不是补货量计算。

### 第五步：检查单位与版本

保留原始单位；需要规范化时同时保留原值、换算因子、目标单位和换算结果。标签、包装规范和地址必须可识别版本。

### 第六步：检查快照限制

对账户/商品状态证据验证日期、站点、账户范围和 SKU 关联。证据不完整则标记 `needs_human_confirmation`，不得升级为实时查询。

### 第七步：形成就绪判断

状态定义：

- `ready`：关键证据齐全、范围一致、无未解决冲突。
- `missing`：必需材料不存在。
- `conflict`：两个或更多有效证据互相矛盾。
- `expired`：材料明确超出其自身有效期。
- `not_applicable`：经规则或人工确认，本批次无需该项。
- `needs_human_confirmation`：材料存在但责任人尚未确认，或平台生成字段尚不存在。

整体结论只能是：

- `READY_FOR_MANUAL_CREATION`
- `CONDITIONALLY_READY`
- `BLOCKED`

只要存在关键 `missing`、`conflict` 或未经确认的高风险项，整体不得为 `READY_FOR_MANUAL_CREATION`。

### 第八步：输出人工交接包

使用 [正式模板](assets/templates/fba-shipment-readiness-report.md) 生成：

- 范围与结论。
- 证据登记表。
- 逐 SKU 就绪矩阵。
- 箱规与数量闭环。
- 用户快照登记。
- 阻塞项和待确认项。
- 人工下一步清单。

## 封闭失败与降级

遇到以下任一情况必须停止给出就绪结论：

- 站点、批次或 SKU 范围无法唯一确定。
- 数量证据冲突且无责任人确认。
- 标签策略或 SKU/FNSKU 映射冲突。
- 箱规使用了不明单位或估算值冒充实测值。
- 账户状态材料无日期却被要求当作实时依据。
- 需要调用未注入或 schema 不匹配的外部工具。

降级输出仍应包括：

- 已确认事实。
- 不可确认的字段。
- 不能继续的具体原因。
- 最小补充材料。
- 应由谁确认。

不得用“通常如此”“平台一般会”或模型常识填补关键事实。

## 沟通规则

- 一次只追问会改变结论的关键缺口，优先使用清单。
- 明确区分“证据显示”“本 Skill 推导”“等待人工确认”。
- 不把 `CONDITIONALLY_READY` 简化为“可以发货”。
- 不承诺平台接受、仓库接收、时效或合规通过。
- 用户要求执行时，说明本产物是人工操作输入，不是执行授权。

## 输出质量门

正式写入 `outputs/` 前逐项确认：

- 范围唯一且有版本。
- 所有关键判断可回到证据。
- 所有来源具有完整 raw evidence envelope，所有派生判断具有完整 derived record。
- 四轴无缺失或已明确标为未知。
- 原始值与规范化值没有互相覆盖。
- 缺口、冲突、过期和待确认状态未被美化。
- IPI、stranded、suppressed 仅来自用户带日期快照。
- 未出现创建、提交、修复或后台执行指令。
- 模板中没有遗留占位符被误当成事实。

更细的字段、状态和检查规则见 [证据合同](references/fba-readiness-evidence-contract.md)。
