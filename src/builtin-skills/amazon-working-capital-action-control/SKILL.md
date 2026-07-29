---
name: amazon-working-capital-action-control
description: 治理已有领域责任方提出的 Amazon 资金行动候选；适用于把现金流情景与采购、补货、广告、促销、税费等正式行动关联，登记资金影响和依赖，分开人工批准与外部承诺，并在行动身份、领域 owner、可推迟证据或关键字段缺失时失败关闭；不适用于根据现金流发明行动、自动审批或排序，也不执行下单、调拨、付款或融资。
---

<!--
文件功能：指导 Agent 对已有领域行动执行资金影响登记、可推迟性核对、审批与承诺门禁。
职责边界：只治理用户、只读 uploads 或可信上游已有行动；三 MCP 仅在正式库存、成本、现金流与行动材料齐全时提供外部需求情景，不能创造或修改行动。
重要关联：控制方法见 references/working-capital-action-contract.md；正式交付使用 assets/templates/working-capital-action-control.md。
-->

# Amazon 营运资金行动控制

## 目标

本 Skill 不发明“为了省现金该做什么”，而是评估领域专家已经提出的行动：

- 行动由谁提出、解决什么领域问题；
- 何时产生或释放多少现金；
- 金额、日期和币种依据是什么；
- 能否推迟、缩小、分阶段或替代；
- 推迟会影响哪些库存、广告、促销、税务或供应商承诺；
- 谁批准、谁已经对外承诺；
- 哪些情景变化会让决定失效。

## 开始条件

每项行动至少需要：

- 稳定来源行动及领域 owner；
- 正式库存台账（涉及库存/补货时）；
- 已批准成本口径；
- 现金流情景与版本；
- 现金影响金额、币种和日期依据；
- 可推迟性及最晚决策/执行时间；
- 依赖、不可逆后果和风险；
- 当前审批与对外承诺；
- 人工决策人。

缺行动身份或 owner 时，不得由本 Skill创造新行动。

`uploads/` 只读；过程材料写入 `temp/profit-management/<run-id>/03-working-capital/`，正式结果写入 `outputs/profit-management/<run-id>/03-working-capital/`。

## 执行流程

### 1. 冻结现金流情景

确认：

- 基准日期、币种和时间粒度；
- 期初现金、预计流入和流出；
- 已承诺与未承诺项目；
- 税费、工资、供应商、广告、物流等关键期限；
- 汇率和其他假设；
- 情景版本、owner 和批准人。

不同情景不可混用金额和日期。

### 2. 验证行动身份

行动必须来自采购、补货、广告、促销、税务、物流或其他领域责任方，说明原始目标、对象、版本和状态。

本 Skill只能治理资金影响和决策门，不能修改领域动作内容。例如“减少补货数量”必须由库存/采购 owner 提出或批准。

### 3. 登记资金影响

逐项写：

- 现金流出/流入/释放；
- 金额、币种和发生日期；
- 一次性、分期或持续；
- gross/net 与税费；
- 与库存、订单、合同或活动的联接；
- 情景基准和直接材料；
- 金额范围或不确定性。

利润、收入、订单价值和现金流不是同义。没有付款时点就不能推断现金影响日期。

### 4. 评估可推迟性

问：

- 最晚何时必须决定/执行；
- 可推迟多久、可否缩量或分阶段；
- 是否已有合同、PO、广告、促销或税务承诺；
- 推迟对缺货、排名、销售、罚金、供应商、客户和合规的影响；
- 是否存在前置付款、取消费或不可逆步骤；
- 推迟后如何恢复。

“技术上能推迟”不等于“业务上可接受”。领域 owner 必须确认。

### 5. 分开审批与承诺

- **审批**：内部是否允许行动；
- **承诺**：是否已对供应商、平台、客户或政府形成外部义务。

可以已批准但尚未承诺，也可以未经完整内部审批却已有外部承诺。两者分别核对责任人、时间和材料。

本 Skill不自动批准、不取消承诺。

### 6. 比较行动

只在金额、日期、币种、情景、可推迟性和风险可比时比较：

- 近期现金释放；
- 中期现金影响；
- 对收入/利润/库存/合规的代价；
- 可逆性；
- 依赖和执行时限；
- 决策所需的领域批准。

输出“现金影响与风险权衡”，不产生黑箱优先级或替领域 owner 排序。

### 7. 可选外部需求情景

只有库存、成本、现金流情景和既有行动四类正式材料齐全，才可读取同一站点、ASIN 和期间的需求趋势：

- SIF：`market_get_keyword_demand`、`market_get_keyword_history`、`ops_get_asin_sales_trend`；
- SellerSprite：`market_product_demand_trend`、`asin_sales_trend`、`keyword_research_trends`；
- Sorftime：`product_trend`、`category_trend`、`keyword_trend`。

每个工具首次调用前按外层 `search → describe → call`，只按本次 `inputSchema` 传参。禁止点式调用、Gateway、HTTP、SDK、CLI、shell 或浏览器回退。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

外部需求只用于压力情景，不能填补现金金额/日期、库存、成本、可推迟性、审批或承诺，也不能创建/修改行动。多源对齐站点、对象、时间、粒度和单位；冲突不平均。

### 8. 执行人工门禁

每项行动交决策前确认：

- 领域 owner 仍认可动作；
- 金额和日期可追溯；
- 可推迟性与后果已由责任方确认；
- 审批与承诺已分开；
- 所有依赖和截止时间清楚；
- 外部需求情景未替代一方事实；
- 执行与复核责任人明确。

## 失败与降级

- 无来源行动/owner：不创建行动；
- 库存、成本或现金流情景缺失：不比较资金影响；
- 金额或日期不明：只列定性影响；
- 可推迟性未证：不得标为可延期；
- 已有外部承诺不清：升级责任方；
- 多项行动不可比：分别展示；
- 三 MCP 失败：不影响正式行动事实，只缺外部情景；
- 用户要求自动批准、付款、下单或融资：明确越界。

## 正式交付

使用 `assets/templates/working-capital-action-control.md` 生成：

1. `working-capital-action-control.md`
2. `action-cash-impact.csv`
3. `approval-and-commitment.md`
4. `action-comparison.md`
5. `external-demand-scenarios.md`（调用三 MCP 时）

## 质量门

- 每项行动来自明确领域 owner；
- 库存、成本、现金流和行动材料齐全；
- 现金金额、币种和日期可追溯；
- 可推迟性与业务后果有责任方确认；
- 审批与外部承诺分开；
- 不可比行动未强行排序；
- 外部需求未修改行动或现金事实；
- 未自动批准、下单、调拨、付款或融资。

## 资源读取

- 开始前读取 `references/working-capital-action-contract.md`。
- 写正式交付前读取 `assets/templates/working-capital-action-control.md`。
