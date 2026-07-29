<!--
文件功能：提供 Search Term 证据、产品锚点、行动、迁移、否定、冲突和人工执行回填模板。
职责边界：模板不执行广告写入；所有动作在人工批准与回填前均为候选。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ad-search-term-action-contract.md。
-->

# Amazon 广告搜索词行动账本

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/profile/marketplace` | `<values>` |
| `period/timezone/attribution` | `<values>` |
| `report_artifact_ids` | `<ids>` |
| `result_status` | `<从下方允许值中选择一个>` |
| `reason_codes[]` | `<从下方允许值中选择零个或多个>` |

模板允许的字面合同：

- `result_status`: `ready | ready_with_limitations | blocked | out_of_scope`
- `reason_codes[]`: `NO_SEARCH_TERM_REPORT | REPORT_NOT_INGESTED | REPORT_IMMATURE | UNSTABLE_JOIN | PRODUCT_ANCHOR_MISSING | KEYWORD_CONTEXT_MISSING | LIMITED_HISTORY | PLATFORM_ENUM_CONFIRMATION_REQUIRED | OUT_OF_SCOPE_REQUEST`

## B. 产品锚点

| Product ID | Fact IDs | Include | Exclude | Brand Scope | Claim Restrictions | Valid As Of |
|---|---|---|---|---|---|---|
| `<id>` | `<ids>` | `<attributes>` | `<attributes>` | `<scope>` | `<rules>` | `<date>` |

## C. Search Term 观察

| Observation ID | Search Term | Target ID | Campaign/Ad Group/Ad/Product IDs | Report ID | Period | Platform Type | Evidence IDs |
|---|---|---|---|---|---|---|---|
| `<id>` | `<raw>` | `<id>` | `<ids>` | `<id>` | `<window>` | `<reported>` | `<ids>` |

## D. 关键词映射

| Observation ID | Keyword/Cluster ID | Mapping Status | Intent | Relevance | Include/Exclude | Supplier Observation Date | Evidence IDs |
|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<direct/manual_candidate/unmapped/conflicted>` | `<value>` | `<value>` | `<rules>` | `<date>` | `<ids>` |

## E. 广告证据

| Observation ID | Impressions | Clicks | Spend | Orders | Sales | CTR | CPC | CVR | ACoS | Attribution Maturity | Data Status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| `<id>` | `<value>` | `<value>` | `<value currency>` | `<value>` | `<value currency>` | `<value/not_computable>` | `<value>` | `<value>` | `<value>` | `<mature/immature/unknown>` | `<reported/missing>` |

## F. 行动账本

| Action ID | Observation ID | Action Type | Reason | Evidence IDs | Conflict/Collateral Risk | Human Review | Execution Status |
|---|---|---|---|---|---|---|---|
| `<id>` | `<id>` | `<harvest_candidate/migration_candidate/negative_candidate/observe/retain/no_action_due_to_conflict/not_assessable>` | `<reason>` | `<ids>` | `<risk>` | `<required/status>` | `<proposed>` |

## G. 迁移计划

| Migration ID | Source IDs | Destination Plan ID | Observation ID | Abstract Target Type | Sequence | Coverage Risk | Rollback | Approval Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<ids>` | `<id/tbd>` | `<id>` | `<type>` | `<steps>` | `<risk>` | `<rule>` | `<owner>` | `<proposed/human_review_required>` |

## H. 否定复核

| Negative ID | Object | Scope | Source Target IDs | Evidence Reason | Collateral Risk | Include/Exclude Conflict | Platform Enum | Approval Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| `<id>` | `<text/id>` | `<level>` | `<ids>` | `<reason>` | `<risk>` | `<conflict>` | `<known/tbd_platform_enum>` | `<owner>` | `<proposed/human_review_required>` |

## I. 证据谱系

| Record ID | Layer | Source Path / Parent Evidence IDs | Source Type | Temporal Scope | Estimation Status | Transformation Type | Scope | Limitations |
|---|---|---|---|---|---|---|---|---|
| `<id>` | `<input_evidence/agent_output>` | `<value>` | `<axis>` | `<axis>` | `<axis>` | `<axis>` | `<scope>` | `<limits>` |

若来源为 `sif_mcp`，同一输入对象还须直接保存 `source_provider=sif`、`source_tool`、三类 request ID、`retrieved_at`、`marketplace`、`query_scope`、覆盖/分页、`raw_result_locator` 和 `transformation_type=reported`；Agent 输出另建对象并回指 `parent_evidence_ids`。

## J. 质量门

- [ ] 仅真实 Search Term 报表产生动作
- [ ] 使用稳定实体 ID
- [ ] 产品锚点和排除属性完整
- [ ] 关键词研究未被重复
- [ ] 归因成熟度和零分母正确
- [ ] 无固定阈值
- [ ] 迁移和否定含误伤/冲突检查
- [ ] 平台枚举未知时保留 TBD
- [ ] 所有动作等待人工执行
- [ ] 正式文件位于 `outputs/`
