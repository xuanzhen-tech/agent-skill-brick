<!--
文件功能：定义寻源准备中的规格、RFQ、候选池、证据和就绪状态字段。
职责边界：只规定数据合同，不提供真实供应商、不代替质量或法律责任方确认，也不执行外部查询。
重要关联：由 ../SKILL.md 在建立采购对象、RFQ 和证据账本时读取；输出字段映射到 ../assets/templates/supplier-sourcing-readiness-template.md。
-->

# 寻源准备合同

## 1. 证据四轴

| 轴 | 允许值 | 说明 |
|---|---|---|
| `source_type` | `user_input`、`upstream_output`、`sif_mcp`、`agent` | SIF 只能支撑 ASIN 当前画像或探索性采购上限 |
| `temporal_scope` | `current`、`historical`、`future`、`mixed`、`not_applicable`、`unknown` | 采购目标通常是 `future` |
| `estimation_status` | `reported`、`estimated`、`forecast`、`mixed`、`not_applicable`、`unknown` | 供应商宣传仍是 `reported`，不是核验事实 |
| `transformation_type` | `raw`、`normalized`、`calculation`、`coding`、`inference`、`hypothesis` | Agent 提出的规格建议通常是 `inference` 或 `hypothesis` |

## 2. 输入证据

| 字段 | 必填 | 规则 |
|---|---:|---|
| `evidence_id` | 是 | 本案件唯一且稳定 |
| `source_path` | 是 | 对话定位、只读 uploads 路径或可信 outputs 路径 |
| `source_type` | 是 | 使用四轴枚举 |
| `source_date` | 是 | 不清楚时写 `unknown` |
| `source_version` | 是 | 文件、图纸、BOM 或上游产物版本 |
| `scope` | 是 | 产品、部件、变体、市场和期间 |
| `limitations` | 是 | 缺页、未签字、估算、过期或适用范围 |
| 四轴 | 是 | 四个字段不得合并成一句备注 |

## 3. Agent 输出

每种派生对象的正式本体必须使用自己的稳定 ID 和以下对象级合同；不得只用统一 `output_id` 代替领域 ID：

| `output_type` | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 必要载荷 |
|---|---|---|---|---|---|---|---|
| `normalized_requirement` | `requirement_id` | 支撑要求的输入 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` | `normalized` / `inference` | 要求、单位/公差、验收、批准和状态 |
| `gap` | `gap_id` | 支撑缺失或冲突判断的输入 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` | `coding` / `inference` | 缺口、影响、补证、责任人、截止和状态 |
| `rfq_clause` | `clause_id` | 支撑条款内容的 Evidence/Requirement IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` | `normalized` / `inference` | 条款类别、精确问题、响应格式、授权和限制 |
| `assumption` | `assumption_id` | 支撑假设的 Evidence/Instruction IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` | 固定 `hypothesis` | 假设、情景、影响、批准状态和失效触发 |
| `candidate_field` | `candidate_field_id` | 支撑字段值或状态的输入 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` | `normalized` / `coding` | Candidate ID、字段名、值/状态、提供者和核验要求 |

每个对象还记录 `assumption_status`（`not_assumption` / `proposed` / `user_approved` / `rejected`）和 `confidence_note`；五项血缘字段不能被合并成备注。

## 4. 需求记录

| 字段 | 说明 |
|---|---|
| `requirement_id` | 稳定编号 |
| `object_id` | 产品、部件或包装对象 |
| `category` | 功能、材料、尺寸、性能、外观、包装、标签、合规、交付 |
| `requirement_text` | 可执行且避免空泛词 |
| `priority` | `must`、`should`、`option`、`supplier_to_propose`、`tbd` |
| `value` / `unit` / `tolerance` | 可测量要求 |
| `acceptance_method` | 如何验证 |
| `evidence_ids` | 事实来源 |
| `parent_evidence_ids` | 支撑要求值、优先级和验收方式的输入 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `normalized` / `inference` |
| `approval_owner` | 谁可确认或批准偏差 |
| `status` | `confirmed`、`proposed`、`conflicted`、`missing` |

只有目标但无证据时，`status=proposed`；来源冲突时保留各自版本并标 `conflicted`。

## 5. 数量与交付情景

每个情景记录：

- `scenario_id`
- `stage`: `sample`、`pilot`、`first_order`、`replenishment`
- `quantity` 和 `unit`
- `target_ship_date`、`target_arrival_date`、`timezone`
- `delivery_location`
- `incoterm_rule`、`incoterm_version`、`named_place`
- `split_delivery_allowed`
- `assumption_ids`

Incoterms 只有缩写而没有版本和地点时不完整。

每个采购假设必须另建正式 `assumption` 对象：

| 字段 | 规则 |
|---|---|
| `assumption_id` | 本层稳定唯一 |
| `scenario_id` / `assumption` / `impact` | 适用情景、假设内容和若错误的影响 |
| `parent_evidence_ids` | 支撑假设的 Evidence/Instruction IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | 固定为 `hypothesis` |
| `assumption_status` / `invalidated_by` | `proposed` / `user_approved` / `rejected` 及失效触发 |

## 6. RFQ 报价字段

每个外发问题必须形成正式 `rfq_clause` 对象：

| 字段 | 规则 |
|---|---|
| `clause_id` | 本层条款稳定唯一 |
| `clause_category` / `question` / `response_format` | 条款类别、精确问题及供应商响应格式 |
| `parent_evidence_ids` | 支撑条款的 Evidence/Requirement IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `normalized` / `inference` |
| `external_share_status` / `limitations` | `approved` / `pending` / `rejected` 与外发限制 |

必须要求供应商逐项提供：

- 报价币种、计价单位、税务口径；
- MOQ、样品数量、数量阶梯与单价；
- 报价日期、有效期；
- 样品费、模具费、包装、标签、测试、认证、运输；
- 包含项、排除项和可选项；
- Incoterms 规则、版本、指定地点；
- 付款节点、交期定义和起算条件；
- 产能口径、变更重报价条件；
- 偏差、替代材料和分包披露。

## 7. 候选池字段

候选池可以为空。已有候选时记录：

- `supplier_candidate_id`
- `legal_name_reported`
- `trading_name_reported`
- `candidate_source_evidence_id`
- `manufacturer_or_trader_claim`
- `product_process_claim`
- `location_claim`
- `certification_claim`
- `identity_conflict_status`
- `verification_status`
- `owner`
- `next_action`

所有 `claim` 都是待核验陈述，不得改名为 `verified_*`。

候选池中的每个字段必须形成正式 `candidate_field` 对象，而不是把整行候选当成已核验事实：

| 字段 | 规则 |
|---|---|
| `candidate_field_id` | 本层候选字段稳定唯一 |
| `supplier_candidate_id` / `field_name` / `field_value_or_status` | 候选、字段名及原值或缺失/冲突状态 |
| `parent_evidence_ids` | 支撑字段值或状态的输入 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `normalized` / `coding` |
| `provided_by` / `verification_status` / `verification_required` | 提供者、当前核验状态及所需动作 |

每个缺失或冲突还必须形成正式 `gap` 对象：

| 字段 | 规则 |
|---|---|
| `gap_id` | 本层缺口稳定唯一 |
| `gap_description` / `affected_scope` / `required_evidence_or_decision` | 缺口、影响及最小补充项 |
| `parent_evidence_ids` | 支撑缺失或冲突判断的输入 Evidence IDs |
| `source_type` | 固定为 `agent` |
| `temporal_scope` | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown` |
| `transformation_type` | `coding` / `inference` |
| `owner` / `due_date` / `status` | 责任人、截止和 `open` / `resolved` / `blocked` |

## 8. 就绪判定

`ready_for_rfq` 需要同时满足：

- 采购对象和版本明确；
- 所有 `must` 有可执行验收方式；
- 数量情景、地点和时间明确；
- 报价字段及包含/排除项齐全；
- 外发权限和保密范围明确；
- 未决事项不会改变供应商范围或报价基础。

否则使用 `ready_with_assumptions`、`clarification_required`、`conflicted` 或 `blocked`，并列出阻塞字段。

## 9. SIF 供应商计算对象

`market_estimate_profit_threshold` 的正式 `arguments` 必须显式包含 `price`、`category`、`weight_oz`、`freight_cost`、`target_margin`、`country`、`price_currency`、`tariff_rate`、`is_apparel`、`turnover_days`。每个键都必须映射到已验证输入 Evidence ID；缺失、冲突或未经验证即不得调用，不设默认值。`category` 必须来自用户或可信上游确认的费用类目口径，SIF ASIN 画像类目只能保留供应商快照语义，不能升级为官方类目事实或静默代填。`length_in`、`width_in`、`height_in` 只有三项均有父证据且机器 schema 同时支持时才成组传入，否则整组省略。

每次调用另建 `vendor_calculation` 对象，并在对象本体保存 `vendor_calculation_id`、`source_tool=market_estimate_profit_threshold`、正式 `arguments` 快照、逐参数映射的 `parent_input_evidence_ids[]`、三类 request ID、`raw_result_locator`、`transformation_type=vendor_calculation` 与限制。该对象不是供应商报价、landed cost 或第 14 利润真相。
