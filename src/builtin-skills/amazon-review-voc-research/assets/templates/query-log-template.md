<!--
文件功能：提供评论 VOC 来源文件、字段映射、解析状态和导入边界的正式登记结构。
职责边界：只记录已提供文件与已发生处理，不记录 MCP 调用，不把计划语料写成已取得语料。
关联关系：由 ../../SKILL.md 物化为 source-register.md；字段语义见 ../../references/review-evidence-contract.md。
-->

# Amazon 评论 VOC 来源登记

| Source Record ID | source_type | 来源路径 | 版本/修改时间 | 提供时间 | 站点 | ASIN 范围 | 期间范围 | 导出/抽样范围 | 可用字段 | 字段六态 | 解析状态 | 限制 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SRC-001 | user_input/upstream_output |  |  |  |  |  |  |  |  |  | ready/partial/parse_failed |  |

## 字段映射

| Source Record ID | 来源字段 | 标准字段 | 映射规则 | parent_evidence_ids | 状态 |
|---|---|---|---|---|---|
|  |  |  |  |  | ready/not_returned/not_queried/parse_failed/missing/conflicted/true_zero |

## 未导入材料

| 材料 | 未导入原因 | 对结论的影响 |
|---|---|---|
|  |  |  |

> 本登记不包含 SIF 或其他外部取数。文件修改时间与导入时间不能冒充评论日期。
