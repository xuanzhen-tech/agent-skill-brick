<!--
文件功能：作为 Agent 生成客服模板来源审查、变量/声明登记、翻译复核、审批和版本治理产物时使用的稳定模板。
职责边界：模板不表示任何客服消息已发送、平台已同步或敏感承诺已获批准。
重要关联：由 ../../SKILL.md 写入 outputs/customer-experience/template-governance/<run-id>/ 前读取或物化；字段语义见 ../../references/customer-service-template-contract.md。
-->

# Amazon 客服模板治理登记

## 治理任务

- Run ID：
- Use cases：
- Marketplaces / Languages：
- 材料时间范围：
- Template owner：
- Policy / Privacy / Language approvers：
- 本次动作：`create | revise | deprecate | retire`
- `execution_status=not_executed`
- `send_status=not_sent`

## 来源与授权审查

| Source ID | Evidence ID / 定位 | Owner | 授权 | 版本/时间 | 站点/语言/场景 | PII/承诺风险 | 完整性 | 准入结论 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 模板登记

| Template ID | Version | Use Case | Marketplace | Language | Lifecycle | Risk Status | Owner | Policy Evidence | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  | `draft_for_review` |  |  |  |  |

## 变量合同

| Variable ID | Name | Meaning / Type | Required | Allowed Source | Validation | Missing Action | Privacy | Default |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 声明与承诺审查

| Statement ID | Template ID | Source Locator | Template Text | Parent Evidence IDs | Type | Support | Promise Class | 人工复核 |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 适用门禁与升级

| Template ID | Required Evidence | Applicable Scope | Exclusions | Block Conditions | 目标责任方 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 翻译复核

| Translation ID | Segment ID | 原文定位 | Agent 译文 | Glossary | 数字/日期/否定 | 限定词 | 人工复核 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 审批与版本事件

| Event ID | Template ID / Version | From | To | 时间 | 操作人/批准人 | Evidence IDs | 理由 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 每次人工使用清单

- [ ] 当前案件已运行对应单案 Skill
- [ ] 所有必填变量来自当前案件 Evidence
- [ ] 缺失/冲突变量已阻塞或澄清
- [ ] 当前政策仍适用
- [ ] 无未经批准的退款、赔付、时限、法律或平台结果承诺
- [ ] PII 最小化
- [ ] 翻译与语言已人工复核
- [ ] 授权人员在本 Skill 外决定是否发送

## 双层证据账本

### 来源证据

| Evidence ID | 来源/定位 | Evidence Origin | 原值/摘要 | 时间/版本 | 四轴 | 授权/隐私/限制 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

### Agent 输出

| Agent Output ID | Parent Evidence IDs | 转换/判断 | 结果 | 生命周期/风险 | 四轴 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 能力声明

- 未调用 SIF、SP-API、Seller Central、DeepL、CRM 或消息工具。
- 未发送、排程、发布或同步任何模板。
- 历史回复未被当作当前政策或默认事实。
- PII 与跨客户上下文未进入模板。
- `approved_for_manual_use` 不等于自动发送授权。
