<!--
文件功能：提供信息图制作规格、callout 与数据 CSV、证据账本的正式交付模板。
职责边界：只承载可生产规格和状态，不提供固定平台规格，也不把底图需求或版面草图冒充最终信息图。
重要关联：../../SKILL.md；字段语义见 ../../references/infographic-fact-and-production-contract.md。
-->

# 信息图规格交付模板

> 使用说明：将下列三个区段分别物化为 `infographic-production-spec.md`、`callout-and-data-ledger.csv` 和 `infographic-evidence-ledger.md`。没有确定性排版能力时必须保留 `production_tool_required`。

## 文件 A：infographic-production-spec.md

# Amazon 商品信息图制作规格

## 1. 案例与范围

- Case ID：
- Amazon 站点与语言：
- 产品与变体：
- Asset ID / Module ID：
- 信息图类型：
- 单一信息任务：
- 目标槽位：
- 上游输出路径与版本：
- 就绪状态：
- 生产状态：

## 2. 责任与结论上限

- 本文件状态：制作规格，不是已完成信息图。
- A+ 模块与文案责任方：
- 底图生产责任方：`amazon-product-image-generation`
- 确定性排版责任方：
- 当前 `production_tool_required`：
- 当前 `policy_check_required`：

## 3. 产品身份与源资产

| Item ID | 类型 | 已核实内容 | Evidence IDs | Rights status | 必须保持 | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 4. 信息原子

| Info Atom ID | Type | Display text/value/unit | Raw value/unit | Condition/object | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Approval | Prohibited inference |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `normalized/calculation/inference` |  |  |

## 5. 比较合同

| Comparison ID | Object | Metric definition | Value/unit | Condition | Period | Evidence IDs | Comparable status | Allowed statement |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 6. 版面区域与阅读顺序

| Layout Decision ID | Region ID | Order | Information task | Atom IDs | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Visual base | Overlay elements | Layout constraints | Mobile check | Acceptance |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| LAY-001 | REG-01 | 1 |  |  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `inference/hypothesis` |  |  |  |  |  |

## 7. 底图 Handoff

- Asset ID：
- 身份锚点：
- 可用源资产与权利：
- 主体、角度、动作和环境：
- 文字留白：
- 必须保持：
- 允许改变：
- 禁止新增：
- 验收：

## 8. 确定性排版 Handoff

- 画布与当前约束：
- Region IDs：
- 精确文字：
- 精确数字、单位和符号：
- 字体、Logo 与图标权利：
- 对齐、层级、留白和语言方向：
- 逐字符/逐数值验收：
- 生产责任方与状态：

## 9. 阻塞与待核验

| Item ID | 类型 | 问题 | 影响区域/原子 | 所需证据或动作 | Owner | 状态 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 文件 B：callout-and-data-ledger.csv

按以下列顺序创建 UTF-8 CSV；含逗号、引号或换行的值必须按 CSV 规则转义：

`info_atom_id,atom_type,display_text,raw_value,raw_unit,display_value,display_unit,conversion_formula,condition,object_scope,parent_evidence_ids,source_type,temporal_scope,estimation_status,transformation_type,approval_status,rights_status,prohibited_inference,layout_decision_id,region_id,reading_order,status`

## 文件 C：infographic-evidence-ledger.md

# 信息图证据账本

## 输入证据

| Evidence ID | Parent Evidence ID | Source type | Source path | Locator | Version | Temporal scope | Estimation status | Transformation type | Rights status | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

## Agent 输出

| Output ID | Output type | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Asset/Region | Decision | Approval status | Production status | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  | info_atom/layout_decision |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` |  |  |  |  |  |  |

## 权利、政策与生产缺口

| Item ID | Current status | Missing evidence/tool/approval | Allowed action now | Blocked action | Owner |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
