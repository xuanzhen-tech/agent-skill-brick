<!--
文件功能：定义商品合规中的产品事实、现行依据、证据保真翻译、要求候选、文档覆盖和专业核验状态。
职责边界：不提供具体法规要求或认证结论，不替代实验室、认证机构、律师或监管责任方。
重要关联：由 ../SKILL.md 在合规就绪分析时读取；正式字段映射到 ../assets/templates/product-compliance-readiness-template.md。
-->

# 商品合规证据合同

## 1. 产品事实集

- `product_fact_set_id`
- `product/variant IDs`
- `spec/BOM/label/package versions`
- `materials/components/functions`
- `intended_use/user_group`
- `claims`
- `responsible_entity_roles`
- `fact_evidence_ids`
- `unknowns/conflicts`

## 2. 现行依据

| 字段 | 规则 |
|---|---|
| `authority_evidence_id` | 稳定编号 |
| `title/issuer` | 原值 |
| `source_path` | 用户或可信上游路径 |
| `publication/effective/revision dates` | 不明写 unknown |
| `jurisdiction` | 必填 |
| `product/responsible-party scope` | 必填 |
| `source_language` | 必填 |
| `document_status` | original/summary/translation/professional_opinion |
| `validity_confirmed_by` | 责任方或 unknown |
| `limitations` | 必填 |

## 3. 翻译对齐

每段记录：

- `source_segment_id`
- `source_text_location`
- `target_segment_id`
- `translation_text`
- `term_choices`
- `qualifiers/exceptions/negation`
- `dates/units/defined_terms`
- `uncertainties`
- `review_status`

Agent 翻译状态不得写 `official_translation`。

## 4. 要求候选

| 字段 | 说明 |
|---|---|
| `requirement_candidate_id` | 稳定编号 |
| `trigger_conditions` | 适用触发 |
| `requirement_or_prohibition` | 原文约束 |
| `exceptions` | 例外 |
| `required_evidence_or_action` | 资料/测试/标签等 |
| `responsible_party` | 责任主体 |
| `timing` | 时间点 |
| `parent_authority_evidence_ids` | 必填 |
| `interpretation_status` | extracted/needs_qualified_interpretation |

## 5. 文档覆盖

状态：

- `evidence_available`
- `evidence_partial`
- `scope_mismatch`
- `expired_or_stale`
- `authority_confirmation_required`
- `qualified_review_required`
- `missing`
- `not_assessed`

每项记录产品版本、市场、依据、文档路径、有效期和限制。

## 6. 四轴与谱系

所有记录保留 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、`source_path` 或 `parent_evidence_ids`。

Agent 的要求映射是 inference，不是法律事实。

## 7. 来源可用性与业务状态

`source_availability_status` 与商品合规 `result_status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无要求、无缺口或无风险；`true_zero` 仅用于完整可验证范围明确为零的字段，不能替代当前依据与专业判断。

正例：完整 BOM 经责任方确认无线模块数为 0，可记 `true_zero`。反例：法规原文未查询时记 `not_queried`，不能写“无需认证”。
