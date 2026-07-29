<!--
文件功能：提供商品图片质量审计的正式报告、逐问题 CSV 和证据账本模板。
职责边界：只承载冻结对象、观察证据与返工规格，不把模板字段解释为已观察结论或平台合规证明。
重要关联：../../SKILL.md；字段语义见 ../../references/image-audit-observation-and-evidence-contract.md。
-->

# 图片质量审计交付模板

> 使用说明：将下列三个区段分别物化为 `image-quality-audit.md`、`image-issue-ledger.csv` 和 `image-audit-evidence-ledger.md`。不可观察维度必须保留 `not_assessed`。

## 文件 A：image-quality-audit.md

# Amazon 商品图片质量审计

## 1. 案例与审计范围

- Case ID：
- Amazon 站点与语言：
- 产品与变体：
- 审计目标：
- 上游输出路径与版本：
- 审计就绪状态：
- 审计时间：

## 2. 责任与结论上限

- 本报告状态：独立质量审计，不是图片生成或编辑结果。
- 图像生产责任方：`amazon-product-image-generation`
- 当前观察能力：
- 未观察或未评估范围：
- `policy_check_required`：
- 权利结论上限：

## 3. 冻结资产

| Asset ID | Version ID | Source path | Fingerprint | Role/slot | Market/language | Variant | Observation status/scope | Rights status |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 4. 保留清单

| Preserve ID | Asset/version | 可见有效内容 | Evidence/Observation IDs | 返工时必须保持 |
|---|---|---|---|---|
|  |  |  |  |  |

## 5. 维度覆盖

| 维度 | 适用资产 | 证据条件 | 状态 | 未评估原因 |
|---|---|---|---|---|
| product_identity |  |  |  |  |
| factual_claims |  |  |  |  |
| asset_role |  |  |  |  |
| thumbnail_recognition |  |  |  |  |
| hierarchy_readability |  |  |  |  |
| scene_plausibility |  |  |  |  |
| cross_asset_consistency |  |  |  |  |
| source_and_rights |  |  |  |  |
| provided_policy_check |  |  |  |  |

## 6. 优先问题

### Issue：`<issue_id>`

- Asset / Version / Region：
- Observation IDs：
- 问题类型：
- 可观察问题：
- Parent Evidence IDs：
- Source type：`agent`
- Temporal scope：`current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown`
- Estimation status：`reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown`
- Transformation type：`inference`
- 影响机制：
- 受影响范围：
- 必须保留：
- 修复规格：
- 验收方式：
- Priority：
- Status：
- 限制：

## 7. 局部返工 Handoff

| Issue ID | 原 Asset/Version | 修改区域 | 必须保持 | 允许改变 | 禁止新增 | Repair spec | Acceptance | Target owner |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 8. 阻塞与待核验

| Item ID | 类型 | 问题 | 影响维度/资产 | 所需证据或动作 | Owner | 状态 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 文件 B：image-issue-ledger.csv

按以下列顺序创建 UTF-8 CSV；含逗号、引号或换行的值必须按 CSV 规则转义：

`issue_id,asset_id,version_id,source_path,region,observation_ids,issue_type,parent_evidence_ids,source_type,temporal_scope,estimation_status,transformation_type,impact_mechanism,affected_scope,preserve,repair_spec,acceptance_check,priority,status,limitations`

## 文件 C：image-audit-evidence-ledger.md

# 图片审计证据账本

## 输入证据

| Evidence ID | Parent Evidence ID | Source type | Source path | Locator | Version | Temporal scope | Estimation status | Transformation type | Rights status | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

## 观察记录

| Observation ID | Asset ID | Version ID | Region | Observation | Status/scope | Parent Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Limitations |
|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `inference` |  |

## Agent 问题推断

| Issue ID | Parent Observation/Evidence IDs | Source type | Temporal scope | Estimation status | Transformation type | Priority | Status | Limitations |
|---|---|---|---|---|---|---|---|---|
|  |  | `agent` | `current/historical/future/mixed/not_applicable/unknown` | `reported/estimated/forecast/mixed/not_applicable/unknown` | `inference` |  |  |  |
