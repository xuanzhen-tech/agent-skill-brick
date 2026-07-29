<!--
文件功能：作为 Agent 生成 Amazon 买家索赔单案时间线、主张证据矩阵、附件索引与待人工提交回应草案时使用的稳定模板。
职责边界：模板不表示回应已提交、附件已上传、平台已接受或案件会胜诉。
重要关联：由 ../../SKILL.md 写入 outputs/customer-experience/<case-id>/04-buyer-claim/ 前读取或物化；字段语义见 ../../references/buyer-claim-case-contract.md。
-->

# Amazon 买家索赔回应工作包

## 案件摘要

- Case ID：
- Claim type：`atoz_guarantee_claim | payment_chargeback`
- Marketplace：
- Claim / Order 掩码 ID：
- 观察截止时间与时区：
- 顶层状态：
- `execution_status=not_executed`
- `submission_status=not_submitted`
- 人工审核人 / 提交责任人：

## 原始通知与期限

- Notice Evidence ID：
- 原始通知定位：
- 原始通知时间/时区：
- Deadline Evidence ID：
- 原始 deadline：
- Marketplace：
- Deadline timezone：
- 透明转换：
- Deadline status：`verified | unverified | conflicted | expired_in_source_record`
- 限制：

## 案件事件时间线

| Event ID | 类型 | 原始状态 | 时间/时区 | Actor | Parent Evidence IDs | 状态/限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Allegation—Evidence 矩阵

| Allegation ID | 原文定位/摘要 | Supporting Evidence | Contradicting Evidence | Missing Evidence | Support Status | Allowed Conclusion |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## 附件索引

| Attachment ID | 来源/类型 | Related Allegation | Parent Evidence IDs | Parse Status | Privacy | Minimum Necessary | 人工选择 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 待人工提交回应草案

> `draft_for_human_review`：以下内容尚未提交，不表示平台已接受或结果已确定。

### 案件引用

[仅写掩码标识和已证范围。]

### 对 Allegation 的逐项回应

[每项声明使用 Statement ID，并在下表映射证据。]

### 附件说明

[只引用经人工批准、最小必要且未被改造的附件。]

### 证据限制

[列出缺失、冲突、时区、覆盖和政策限制。]

## 草案声明—证据映射

| Statement ID | Allegation ID | 草案文本 | Parent Evidence IDs | Support Status | Attachment IDs | 人工复核 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

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

- 未调用 SIF、SP-API、Seller Central、支付、承运商或消息工具。
- 未提交回应、上传附件、改案件状态、退款或联系买家。
- 未伪造、删改或重构原始证据。
- 未给法律结论、胜诉保证或账号级 POA。
- Deadline 缺日期、站点或时区时保持 `unverified`。
