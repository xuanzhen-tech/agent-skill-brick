<!--
文件功能：定义海关商品事实、进口情景、候选编码、原产地、估价、税率证据、贸易救济和专业确认合同。
职责边界：不提供编码、税率或金额，不替代报关行、海关、律师或税务责任方。
重要关联：由 ../SKILL.md 在海关就绪分析时读取；正式字段映射到 ../assets/templates/customs-classification-readiness-template.md。
-->

# 海关分类与税费就绪合同

## 1. 商品事实

- `customs_product_fact_set_id`
- `product/model/variant/version`
- `materials/composition`
- `primary/secondary functions`
- `intended_use`
- `assembly/set/component status`
- `packaging/accessories`
- `parent_evidence_ids`
- `unknowns/conflicts`

## 2. 进口情景

| 字段 | 说明 |
|---|---|
| `import_scenario_id` | 稳定编号 |
| `destination_jurisdiction` | 必填 |
| `planned_import_date` | 必填或 unknown |
| `importer/declarant roles` | 主体 |
| `origin_reported` | 陈述 |
| `goods_state/quantity unit` | 状态 |
| `incoterm rule/version/place` | 完整 |
| `invoice currency/value evidence` | 输入事实 |

## 3. 候选编码

每个候选包含：

- `classification_candidate_id`
- `code`
- `code_level`
- `tariff_schedule/jurisdiction`
- `tariff_version/effective_date`
- `provided_by`
- `goods_description`
- `classification_reasoning_reported`
- `alternative/exclusion`
- `authority_or_opinion_evidence_ids`
- `status`

状态：`candidate_for_review`、`conflicted`、`insufficient_basis`、`confirmed_by_qualified_owner`。

Agent 不能生成最后一种。

## 4. 原产地与估价

原产地记录生产步骤、地点、材料、证明、优惠/非优惠范围和专业问题。

估价记录交易价格、关系、协助/模具/特许权/佣金/包装/运保事实、Incoterms、依据和未知项。

## 5. 税率与贸易救济

仅记录用户/可信上游：

- 编码与税则版本；
- 税率/税种/基础；
- 原产地条件；
- 生效日期；
- 生产商/出口商范围；
- 依据路径；
- 确认责任方；
- 限制。

不得计算金额。

## 6. Handoff

向08/14传递时必须是 `confirmed_by_qualified_owner`，并附 evidence ID、商品/辖区/日期范围、原产地/估价状态、费率来源、生效日和未决限制。

## 7. 四轴与谱系

每条记录含 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。

## 8. 来源可用性与业务状态

`source_availability_status` 与海关 `result_status/candidate status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无税费、无限制或无风险；`true_zero` 只在来源完整、可验证、商品和日期范围匹配时使用。

正例：合格责任方以带日期税则确认明确范围的附加税率为 0，可记 `true_zero`。反例：来源未返回税率时记 `not_returned`，不得补成 0%。
