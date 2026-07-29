<!--
文件功能：作为 Agent 生成单笔 Amazon Review 请求证据核对和人工执行就绪结论时使用的稳定模板。
职责边界：模板不包含请求发送、排程、评价引导或买家筛选功能，也不表示任何请求已经执行。
重要关联：由 ../../SKILL.md 写入 outputs/customer-experience/<case-id>/03-review-request/ 前读取或物化；字段语义见 ../../references/review-request-readiness-contract.md。
-->

# Amazon Review 请求就绪核对

## 订单摘要

- Case ID：
- Marketplace：
- Order 掩码 ID：
- 观察截止时间与时区：
- 人工审核人：
- Top-level status：`human_execution_ready | blocked`
- Reason codes：
- `execution_status=not_executed`
- `request_status=not_executed`

## 必需证据

| Evidence Type | Evidence IDs | 时间/覆盖 | 状态 | 限制 |
|---|---|---|---|---|
| 订单 |  |  |  |  |
| 履约/送达 |  |  |  |  |
| 当前政策 |  |  |  |  |
| 既有请求历史 |  |  |  |  |
| 退货退款/索赔/安全案件 |  |  |  |  |

## 当前政策证据

- Policy Evidence ID：
- Marketplace / 适用对象：
- 原文定位：
- 发布/更新日与核验日：
- Window anchor：
- Window rules：
- Boundary inclusion：
- Exclusions：
- 限制/冲突：

## 政策窗口计算

| Calculation ID | Anchor Evidence | Anchor 时间/时区 | Policy Evidence | 计算规则 | Start | End | Observation | 状态 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 重复请求核对

- 历史覆盖范围：
- 导出/记录时间：
- 匹配规则：
- 原始状态：
- Evidence IDs：
- Missing semantics：
- 结论：

## 敏感案件与排除项

| Check ID | 类型 | Evidence IDs | 状态 | Policy Evidence | Reason Code |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 反操纵门禁

- 无激励或补偿交换：`pass | blocked`
- 无正面/五星引导：`pass | blocked`
- 无先评价后服务：`pass | blocked`
- 无评分倾向筛选：`pass | blocked`
- 未混淆 Review / Feedback / 问答：`pass | blocked`
- 无发送或排程动作：`pass | blocked`

## 人工执行前清单

- [ ] 单笔订单边界明确
- [ ] 当前政策可定位且适站点
- [ ] 窗口计算可复核
- [ ] 既有请求状态明确
- [ ] 无敏感案件或政策排除
- [ ] 人工责任人明确
- [ ] 所有外部动作仍为未执行

## 双层证据账本

### 来源证据

| Evidence ID | 来源/定位 | Evidence Origin | 原值/摘要 | 时间 | 四轴 | 限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### Agent 输出

| Agent Output ID | Parent Evidence IDs | 转换/判断 | 结果 | 状态 | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 能力声明

- 未调用 SIF、SP-API、Seller Central、Web 或消息工具。
- 未发送、排程或批量触发 Review 请求。
- 未使用固定天数代替当前政策。
- 未按好评概率、满意度或买家价值筛选。
- 公共 Review 未被当作订单资格证据。
