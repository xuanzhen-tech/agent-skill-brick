# Listing 字段就绪矩阵

状态：
- `ready_complete`：完整原文/结构可定位；
- `ready_limited`：仅部分字段，允许有限结构观察；
- `metadata_only`：仅URL/数量/位次等元数据；
- `not_returned`；
- `truncated`；
- `not_verifiable`；
- `baseline_not_comparable`；
- `blocked`。

矩阵字段：`marketplace,asin,parent_child,variation,field,status,completeness,evidence_id,tool,queried_at,baseline_status,allowed_analysis,prohibited_analysis,supplement_needed`。

标题/五点只有 `ready_complete` 可做完整结构审计；主图 `metadata_only` 只能交视觉专家，不得做图像语义判断；历史diff必须 `ready_complete + fully_comparable`。
