---
name: amazon-fx-payout-exposure-analysis
description: "分析 Amazon 跨币种 payout、渠道结算与银行到账的汇率和金额差异；适用于把参考中间价、渠道报价率、结算有效率、银行到账有效率分开，核对同一交易链、金额分子分母、显式费用和未解释差额，或在报价不可比、证据不足时失败关闭。"
---

<!--
文件功能：指导 Agent 对同一 Amazon 回款交易链进行汇率、费用、扣款和到账差异的证据化分析。
职责边界：只分析用户、只读 uploads 或可信上游已有的带日期金额与汇率证据；当前 SIF 没有结算、FX、payout、银行到账或现金流真相，因而不调用 SIF；不获取实时汇率、不监控、不交易、不划款、不推荐具体换汇时点。
重要关联：references/fx-payout-analysis-contract.md 定义四类汇率、交易链和金额恒等式；assets/templates/fx-payout-exposure-report.md 是正式交付模板。
-->

# Amazon FX 与回款暴露分析

## 先读取哪些资源

- 每次执行都读取 `references/fx-payout-analysis-contract.md`，先按确定 schema 归一化交易链，再做比较。
- 需要正式报告时复制 `assets/templates/fx-payout-exposure-report.md` 到本次 `outputs/`，保留所有证据和限制字段。

## 结果与非目标

把同一笔或同一批可唯一关联的外币销售回款拆成：

1. 参考中间价换算；
2. 渠道报价；
3. 实际结算；
4. 银行到账；
5. 可由证据支持的点差、显式费用、其他扣款与未解释差额。

本 Skill 不承担：

- 不调用 ExchangeRate-API、Web、浏览器、银行、支付渠道、SP-API 或其他外部服务。
- 不做汇率监控、定时任务、自动提醒或后台订阅。
- 不交易、不划款、不换汇、不套保，不推荐具体交易时点或具体金融产品。
- 不用参考中间价冒充渠道成交价、结算率或银行到账率。
- 不把参考换算与实际到账差额自动归因为渠道费、汇损或欺诈。
- 不比较金额、时间、方向、速度、税费或提现条件不一致的渠道报价。
- 不提供会计、税务、法律、外汇监管或投资适当性结论。

## 输入合同

### 允许输入

- 用户在对话中提供的金额、报价和交易记录。
- 只读 `uploads/` 中的 Amazon payout、支付渠道结算单、银行到账单、费用凭证和带日期参考汇率。
- 可信上游 `outputs/` 中的版本化交易链、金额或情景。
- 用户明确指定的未来汇率情景；它只能标记 `scenario_only`。

### 必需关联

实际交易分析至少要能建立：

- `payout_id`
- `settlement_id`
- `bank_transaction_id`

某一环节没有系统 ID 时，必须保存可复核的替代定位、其来源和限制，状态仍保持缺失或待核验。Agent 不得仅凭金额相近或日期接近自动认定同一交易链。

### 外部数据边界

当前 `sif_mcp` 的 34 项目录不提供成本、结算、汇率、payout、银行到账或现金流真相，本 Skill 不调用 SIF。SIF 的关键词、ASIN、流量、销量、广告和采购阈值计算均不得进入交易链或汇率对象；未来若目录新增金融工具，必须先重新设计凭据、权限、交易链和证据合同，不能在当前 Skill 中临时扩张。

合法资料不足时失败关闭，不回退 ExchangeRate-API、Sorftime、WhaleBridge、SP-API、Web 或浏览器。

## 工作区

- 中间归一化与比对：`temp/profit-management/<case-id>/fx-payout-exposure/`
- 唯一正式交付：`outputs/profit-management/<case-id>/fx-payout-exposure/`

`uploads/` 只读，不移动、不覆盖、不删除。中间文件不得作为正式结论引用；正式结果必须写入 `outputs/`。

## 证据与缺失语义

每个原始金额、汇率、费用、扣款和链路 ID 都记录四轴：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

同时记录原币、目标币、金额方向、单位、交易时间/时区、站点、实体、来源定位和限制。

每个换算、有效率、差额拆分、可比性、情景或阻断判断都直接使用：

```text
output_evidence_id
output_type=rate_calculation|effective_rate|comparability_assessment|difference_decomposition|scenario_record|gap_classification
parent_evidence_ids[]
source_type=agent
temporal_scope=point_in_time|period|scenario
estimation_status=not_applicable|scenario_only
transformation_type=calculation|reciprocal_direction_conversion|comparability_assessment|difference_decomposition|scenario_construction|gap_classification
created_at
limitations[]
```

每个正式对象本体都必须包含父证据与四轴，不能只在总谱系中登记一次。

缺失状态只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五种不等于零；`true_zero` 必须有来源明确返回真实零。

## 执行流程

### 1. 冻结币对与范围

记录：

- 原币和目标币
- 汇率方向
- 金额口径：毛额、净额、含费或不含费
- payout、settlement、bank transaction 的 ID 与时间
- 站点、账户/实体、期间和时区
- 是否实际交易或未来情景

不同币对、方向、交易链或金额口径分别分析，不得混合。

### 2. 建立同一交易链

优先使用来源明确给出的关联 ID。没有直接关联时，只能列为 `candidate_linkage` 并交人工核验，不能进入确定差额拆分。

若一笔 payout 拆成多次结算、一次结算合并多笔 payout、或多笔结算合并到账，必须保留一对多/多对一关系与分配证据。没有分配依据时，不按金额比例硬分。

### 3. 归一化金额对

每个率记录都必须包含：

- `numerator_amount`
- `numerator_currency`
- `denominator_amount`
- `denominator_currency`
- `quote_direction`
- `rate_value`
- `rate_timestamp`
- 对应交易链 ID

统一定义 `rate_value = numerator_amount / denominator_amount`，方向写成 `numerator_currency_per_denominator_currency`。只有证据明确且转换被记录时才可倒数换向；原始率和转换后率必须分别保留 Evidence ID。

### 4. 区分四类汇率

- `reference_mid_rate`：带日期的参考中间价，只作基准换算；它不包含 bid/ask、渠道点差或实际成交条件。
- `provider_quote_rate`：渠道对明确金额、方向、时间、速度与费用条件给出的报价。
- `settlement_effective_rate`：同一 payout 到渠道结算金额之间，由实际金额对得到的有效率。
- `bank_receipt_effective_rate`：同一交易链原始金额到银行实际到账金额之间的有效率。

如果银行到账金额已扣除显式费用或其他扣款，`bank_receipt_effective_rate` 必须称“含费用的到账有效率”，不得称纯 FX 率。

### 5. 检查报价可比性

多渠道报价只有同时满足以下条件才可排序或比较：

- 同一币对和同一方向
- 同一原始金额
- 可比时间点
- 同一结算速度
- 同一税费、提现和最低金额条件
- 同一毛额/净额与含费/不含费口径

不满足时输出 `blocked_incomparable_basis`，列出差异字段，不强行计算“更优渠道”。

### 6. 拆分实际差额

只有交易链、币种、金额口径和时间证据足够时才拆：

- `rate_spread`
- `explicit_fee`
- `other_deduction`
- `unexplained_difference`

显式费用必须来自费用凭证；其他扣款必须有命名和来源。剩余不能解释的差额保留为 `unexplained_difference`，不得自动贴成汇损、手续费、税款或异常。

参考中间价只用于构造“参考换算对照”，不能单独证明 `rate_spread`。渠道报价未被实际成交采用时，也不能替代结算证据。

### 7. 处理未来情景

未来率只接受用户指定或可信上游明确提供的透明情景。记录 `scenario_only`、假设值、方向、期间、来源和限制。

不预测汇率，不推荐交易时点，不声称套保适当。涉及法规、税务、外汇限制或会计分类时路由第 09 合规税务专家或合格财务人员。

### 8. 形成状态与交付

顶层状态使用：

- `analysis_ready_for_review`
- `scenario_only`
- `blocked_missing_transaction_linkage`
- `blocked_missing_amounts`
- `blocked_incomparable_basis`
- `conflicted`
- `out_of_scope`

至少输出：

- `fx-payout-exposure-report.md`
- `transaction-chain-ledger.md`
- `evidence-and-gap-register.md`

报告必须区分已观察、Agent 计算和仍未知，不声称已监控、已换汇、已划款、已节省或已完成财务确认。

## 路由

- 交易级利润或费用池：内置 `amazon-sku-profit-summary`。
- 未来经营/现金流情景：内置 `amazon-operating-analysis`。
- 税务、监管、外汇或合同限制：第 09 合规税务专家。
- 领域行动的资金门禁：`amazon-working-capital-action-control`。
- 任何实际付款、换汇、套保或银行操作：人工授权的外部责任方，本 Skill 不执行。

## 完成前自检

- 四类汇率是否严格分开？
- 每个率是否都有金额分子、分母、币种、方向、时间和交易链 ID？
- 实际差额是否只在同一交易链和同一口径下拆分？
- 含费到账有效率是否明确标为含费，而不是纯 FX 率？
- 多渠道报价是否通过全部可比性条件？
- 四轴、双层谱系和缺失枚举是否完整？
- 是否没有调用外部汇率源、后台监控、交易或划款？
- 正式产物是否只在 `outputs/`？

任何答案为“否”时，保持阻断或待人工复核状态。
