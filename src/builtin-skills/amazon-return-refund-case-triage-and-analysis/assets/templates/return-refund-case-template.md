<!--
文件功能：作为 Agent 生成单笔退货退款事件链、理由核对、程序草案与人工交接时使用的稳定模板。
职责边界：模板不表示退款、换货、赔付、仓内处置或案件状态变更已经执行。
重要关联：由 ../../SKILL.md 写入 outputs/customer-experience/<case-id>/02-return-refund/ 前读取或物化；字段语义见 ../../references/return-refund-case-contract.md。
-->

# Amazon 退货退款单案分析

## 案件摘要

- Case ID：
- Marketplace：
- Order / Return / Refund / Claim 掩码 ID：
- 币种：
- 观察截止时间与时区：
- 顶层状态：
- `execution_status=not_executed`
- `refund_status=not_executed`
- `replacement_status=not_executed`
- 人工审核人：

## 数据就绪度

| 必要材料 | Evidence IDs | 覆盖范围 | 状态 | 缺口影响 | 责任方 |
|---|---|---|---|---|---|
| 订单记录 |  |  |  |  |  |
| 买家请求/案件通知 |  |  |  |  |  |
| 退货记录 |  |  |  |  |  |
| 退款/换货/补偿记录 |  |  |  |  |  |
| 当前政策证据 |  |  |  |  |  |

## 单案事件链

| Event ID | Event Type | 原始/规范状态 | 时间/时区 | Actor | 金额/数量 | Parent Evidence IDs | Evidence State |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 事件冲突与未证事实

| Conflict ID | 版本 A + Evidence | 版本 B + Evidence | 不可得出的结论 | 所需验证 |
|---|---|---|---|---|
|  |  |  |  |  |

## 理由编码

| Reason ID | Layer | Reason Code / 描述 | Parent Evidence IDs | Support Status | 替代解释 | 下一验证 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 待人工复核的程序草案

1. 已证事实：
2. 待确认事实：
3. 政策/授权检查：
4. 建议人工处理顺序：
5. 对买家最少必要澄清：
6. 禁止承诺与未执行动作：

## 指标请求

- 是否请求总体比率：
- Numerator 定义与 Evidence：
- Denominator 定义与 Evidence：
- 时间窗/站点/粒度：
- Metric status：`not_requested | computable | not_computable`
- 转第 13 专家的工作包：

## 跨专家交接

| Handoff ID | 问题 | 当前 Evidence IDs | 不得推断 | 目标专家 | 所需结果 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 双层证据账本

### 来源证据

| Evidence ID | 来源/定位 | Evidence Origin | 原值/摘要 | 时间 | 四轴 | 隐私与限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### Agent 输出

| Agent Output ID | Parent Evidence IDs | 转换/判断 | 结果 | 状态 | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 能力声明

- 未调用 SIF、SP-API、Seller Central、WMS、支付或承运商工具。
- 未执行退款、换货、赔付、仓内处置或平台状态变更。
- 退货请求、实物退回、退款、替换和拒付没有互相替代。
- 无有效分母时未计算总体比率。
- 原因假设未写成已确认根因。
