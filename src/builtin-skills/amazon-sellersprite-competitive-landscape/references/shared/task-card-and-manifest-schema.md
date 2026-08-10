---
contract: task-card-and-manifest-schema
version: 1.0.0
cluster: amazon-asin-research-skill-cluster
applies_to: orchestrator only
---
# 总控执行契约：Task Card、Module Manifest、Claim Ledger

本文件专供总控 Skill 使用，定义调度、验收和冲突裁决的可执行 schema。子模块不需要读取本文件——它们接收总控下发的 Task Card 并按 collaboration-handoff-contract 回传 Module Result。

## 一、Module Manifest（静态能力登记）

总控在首次调度前读取各模块的 manifest，用于判断哪些模块适用于本轮研究。

`yaml
manifest:
  module: string  # 如 competitive-landscape
  version: string
  capabilities:
    - id: string
      description: string
      requires: [string]  # 前提能力
      min_fields: [string]  # 最低字段要求
      max_claim_level: string
  required_inputs:
    - field: string
      source: string  # task_card|dataset|upstream_module
  outputs:
    - artifact: string
      schema_ref: string
      required: boolean
  quality_gates:
    - id: string
      description: string
      blocking: boolean
  dependencies:
    upstream: [string]  # 必须先完成的模块
    parallel_ok: [string]  # 可以并行的模块
  known_limitations: [string]
`

### 各模块依赖与并行规则

| 模块 | 必须先完成 | 可并行 | 说明 |
|---|---|---|---|
| competitive-landscape | - | event-anomaly | 身份门结果需共享 |
| event-anomaly-analysis | - | competitive-landscape, ad-visibility, listing-audit, review-voc | 需数据集就绪 |
| listing-competitor-audit | competitive-landscape | ad-visibility, review-voc | 需 ASIN 身份确认 |
| ad-visibility-gap-analysis | competitive-landscape | listing-audit, review-voc | 需竞品身份 |
| review-voc-anomaly-screening | competitive-landscape | listing-audit, ad-visibility | 需 ASIN 和父/子体确认 |

身份门（competitive-landscape）是所有模块的共同前提，必须先通过身份门再并行下发四个领域模块。

---

## 二、Task Card（实例化任务单）

总控为每个启用的模块生成一份 Task Card。格式见 collaboration-handoff-contract 第一节。总控额外维护：

### Task Registry

`yaml
task_registry:
  case_id: string
  tasks:
    - task_id: string  # case_id + module
      module: string
      status: string  # module_status 枚举
      issued_at: string
      completed_at: string optional
      dataset_version: string
      superseded_by: string optional
`

### 停止规则

1. 若 competitive-landscape 返回 blocked_* 或 failed_quality_gate，总控停止所有后续模块，仅交付 data-readiness
2. 若任一模块返回 blocked_data_missing 但其缺口不影响其他模块并行任务，其他模块继续
3. 若同一模块连续两次返回 failed_quality_gate，总控标记为 failed，不再重试，在最终报告中说明该模块未完成
4. 三个以上模块返回 blocked_* 时，总控终止本轮研究，交付部分报告并附模块状态汇总

### 补数协议

1. 模块在 follow_up_requests 中提出补数申请，必须包含：
   - 需要补充的 SellerSprite 工具/字段
   - 当前缺少导致什么结论受阻
   - 补数后结论可能变化的方向
2. 总控审批后执行补数查询，更新 dataset_version
3. 只有受影响的模块收到新 Task Card（含新 dataset_version），未受影响模块不重跑
4. 补数最多两轮。两轮后仍 blocked_data_missing，标记为 ready_with_limits

---

## 三、Claim Ledger（主张台账）

总控内部维护，用于追踪、合并和冲突裁决。

### Schema

`yaml
claim_ledger:
  case_id: string
  entries:
    - claim_id: string  # 总控分配，如 CL-001
      source_module: string
      source_claim_id: string  # 模块原始 claim_id
      claim_text: string
      claim_level: string
      claim_status: string
      asin_scope: [string]
      period_scope: {start: string, end: string}
      conflicts_with: [string]  # 冲突的 claim_id 列表
      resolution: string  # accepted|downgraded|rejected|merged|conflict_unresolved
      resolution_reason: string
      used_in_report: boolean
`

### 合并规则

1. 两个模块对同一观察给出 L1 claim，方向一致、口径一致 → 合并为一条 L1，注明两源模块
2. 两个模块对同一现象给出不同 level claim → 取较低 level，高 level 模块的附加证据作为二级支持
3. 冲突裁决优先级：数据口径一致性 > 证据独立性 > 时序证据完整性

---

## 四、最终报告合成规则

### 报告结构（必须章节）

1. 执行摘要
2. 研究合同与范围
3. 数据与证据总账
4. 当前竞争格局
5. 趋势与变化账本
6. 竞品可见动作时间线
7. 事件研究（若具备条件）
8. 评论与 VOC（若语料就绪）
9. 广告与流量观察
10. 可复用运营机制
11. 自有 ASIN 适配方案
12. 限制与后续验证
13. 附录：模块状态汇总、Claim Ledger、Query Log

### 总控最终质检清单

- [ ] 所有 claim 可回溯到模块 evidence-ledger
- [ ] 无 claim 超过其来源模块的 max_claim_level
- [ ] 所有 L2+ claim 列出了替代解释
- [ ] 所有 L3 claim 附事件预注册和可证伪条件
- [ ] "刷评""操纵""根因""已证""归因确认"等禁用词未出现
- [ ] SellerSprite 数据未被写成 Amazon 第一方事实
- [ ] 缺失、截断、空结果未被写成零/不存在
- [ ] 模块间冲突已裁决并记录
- [ ] 每个运营建议附适用前提、风险、所需一方数据
- [ ] 最终报告仅引用 module_status = ready | ready_with_limits 的模块结果r
