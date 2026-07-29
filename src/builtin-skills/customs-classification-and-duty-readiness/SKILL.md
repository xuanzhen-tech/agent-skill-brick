---
name: customs-classification-and-duty-readiness
description: 整理商品构成、功能、用途、原产地、估价、候选税则编码、税率与贸易救济依据，形成报关分类和税费专业确认就绪包。适用于新品进口准备、编码复核和物流/利润交接；不适用于自行确定 HS/税则编码、税率、反倾销措施或应缴金额，也不从免费网站、Web 或外部 API 抓取海关数据。
---

<!--
文件功能：定义海关商品事实、候选编码证据、归类理由、原产地、估价、税费依据、贸易救济问题和专业确认流程。
职责边界：只组织用户/可信上游/合格责任方提供的带日期资料，不自定编码、税率或金额，不执行报关或缴税。
重要关联：分类、税费和确认状态见 references/customs-classification-readiness-contract.md；正式交付使用 assets/templates/customs-classification-readiness-template.md；08消费确认结论做物流准备，14消费确认成本做利润分析。
-->

# 海关分类与税费就绪

## 目标与完成定义

把“HS 编码和关税是多少”转成专业可确认的事实包：

1. 商品由什么构成、主要功能和用途是什么；
2. 进口到哪个国家/地区、在什么日期；
3. 候选编码来自谁、哪个税则版本和什么依据；
4. 原产地、估价基础、Incoterms 和关联交易事实是什么；
5. 用户提供的税率、附加税和贸易救济资料适用于什么范围；
6. 哪些问题必须由报关行、海关、税务或法律责任方确认；
7. 确认结论如何交给08物流和14利润。

本 Skill 的完成状态是 `ready_for_customs_broker_review` 或明确缺口，不是“编码已确定”。

## 运行合同

### 合法输入

- 用户对话及只读 `uploads/` 中的规格、BOM、材料、功能、照片、说明书、用途、价格、合同、发票、Incoterms 和原产地资料；
- 用户或可信上游提供的候选编码、税则原文、裁定、报关行意见、税率、贸易救济或估价意见；
- 可信 `outputs/` 中的产品、采购、合规、物流和利润输入；
- 合格报关行、海关、律师或税务责任方的可追溯结论。

当前编码、税率、税则版本、附加税和反倾销/反补贴事实只能来自用户或可信上游带日期依据。

### 外部数据边界

- 不调用 `sif_mcp`；当前 SIF 目录没有 HS/税则分类、税率、原产地、估价或贸易救济能力，商品/市场字段也不能确定海关编码；
- 运行时输入仅限用户对话、只读 `uploads/` 与带来源/日期/版本的可信 `outputs/`；
- 不使用 Web、浏览器、HS 查询网站、海关 API、关税计算器、其他 MCP/API；
- 不读取报关/物流平台密钥；
- 不提交报关、不生成可提交申报、不缴税；
- 没有候选编码或现行依据时只准备商品事实和咨询问题。

### 工作区

- `uploads/` 只读；
- `temp/compliance/<case-id>/05-customs-readiness/` 存放商品事实、候选编码、原产地/估价和税费问题草稿；
- `outputs/compliance/<case-id>/05-customs-readiness/` 存放唯一正式就绪包；
- 发票、主体、税号和价格敏感字段在输出中最小化。

### 双层谱系

输入证据记录 `evidence_id`、`source_path`、商品版本、进口辖区、日期、税则版本、币种、四轴和限制。

Agent 的事实归一、候选对比、缺口、影响和专业问题为 `agent_output`，记录 `parent_evidence_ids`、转换类型、假设和结论上限。

四轴：

- `source_type`
- `temporal_scope`
- `estimation_status`
- `transformation_type`

## 启动检查

### 最低输入

至少需要：

1. 商品、型号和变体；
2. 材料/成分和主要功能；
3. 预期用途和销售呈现；
4. 进口国家/地区和计划日期；
5. 原产地事实或缺口；
6. 交易、价格和 Incoterms 基础；
7. 用户/责任方提供的候选编码或明确尚无；
8. 报关/法律责任人。

### 状态

- `ready_for_customs_broker_review`
- `product_facts_partial`
- `candidate_code_missing`
- `tariff_version_missing`
- `origin_unresolved`
- `valuation_unresolved`
- `trade_remedy_review_required`
- `conflicted`
- `blocked`
- `out_of_scope`

### 来源缺失语义（与业务状态分列）

业务 `result_status` 继续使用上述海关就绪状态；商品、候选编码、原产地、估价和税率字段另记 `source_availability_status`，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。只有完整、可验证且范围匹配的来源明确为零时才可使用 `true_zero`。

前五项不得写成 0、无税费、无限制或无风险，也不得覆盖 `candidate_code_missing/tariff_version_missing/...` 等业务门禁。正例：合格责任方基于带日期税则和明确商品范围确认附加税率为 0，可记 `true_zero`，最终归类仍由其负责。反例：税率字段未返回时记 `not_returned`，不能补成 0% 或写“无附加税”。

## 执行流程

### 第一步：冻结商品事实

记录：

- 产品/型号/变体和版本；
- 材料/成分及比例（用户提供）；
- 主要功能、次要功能和工作原理；
- 预期用途和用户；
- 套装、组合、未组装或零部件状态；
- 包装和随附物；
- 关键照片/图纸/说明书证据；
- 未知和冲突。

Agent 不从外观猜材料、成分比例或主要功能。

### 第二步：固定进口情景

记录：

- 进口国/地区和口岸（若相关）；
- 计划日期；
- 进口商/申报责任方；
- 原产国/加工地点陈述；
- 货物状态和数量单位；
- 交易关系；
- Incoterms 规则、版本和指定地点；
- 发票币种和价格证据。

不同进口辖区、日期或产品版本分开评估。

### 第三步：登记候选编码

候选编码只能来自：

- 用户；
- 可信上游；
- 报关行/海关/专业责任方；
- 用户提供的正式税则/裁定原文。

每个候选记录：

- 编码和层级；
- 税则版本和生效日期；
- 提供者；
- 商品描述；
- 归类理由；
- 排除/替代编码；
- 原文或意见证据；
- 确认状态。

Agent 不自行生成“最可能 HS 编码”。

### 第四步：建立候选对比

只比较证据：

- 商品描述与事实对应；
- 材料、功能、用途和套装状态；
- 归类规则/注释由用户资料如何引用；
- 适用辖区和税则版本；
- 责任方意见冲突；
- 还缺什么事实。

输出 `candidate_for_review`、`conflicted` 或 `insufficient_basis`，不输出 `final_code`，除非合格责任方提供正式确认并注明范围。

### 第五步：整理原产地问题

记录：

- 声称原产地；
- 材料和生产步骤；
- 供应商/生产地点；
- 现有原产地证明；
- 用户提供的现行规则或专业意见；
- 优惠原产地与非优惠原产地是否分开；
- 需要专业确认的问题。

Agent 不自行套用实质性改变、区域价值或其他规则。

### 第六步：整理估价基础

记录：

- 交易价格和币种；
- 买卖双方关系；
- 模具、协助、特许权、佣金、包装、运保等用户提供事实；
- Incoterms；
- 调整项目的现行依据；
- 估价责任方；
- 未知项。

本 Skill 不计算完税价格或应缴金额。

### 第七步：登记税率和税费证据

只有用户或可信上游提供时记录：

- 编码；
- 税则版本；
- 普通/优惠税率陈述；
- 增值税/销售税/附加税陈述；
- 生效日期；
- 原产地和适用条件；
- 责任方确认；
- 币种和基础；
- 限制。

不得把来源不明费率写进成本。

### 第八步：贸易救济与限制升级

对反倾销、反补贴、配额、禁限、制裁或特殊许可：

- 只登记用户/可信上游带日期依据；
- 固定商品、编码、原产地、生产商/出口商和期间；
- 标记 `qualified_legal_or_broker_review_required`；
- 不自行判断适用或金额；
- 未确认前对进口/利润决策设置 hold。

### 第九步：形成专业确认包

向报关/法律责任方提供：

- 商品事实；
- 进口情景；
- 候选编码与冲突；
- 原产地和估价事实；
- 税率/贸易救济依据；
- 封闭问题；
- 截止日期和业务闸门。

### 第十步：输出跨专家 handoff

只有合格责任方确认后，向08/14交付：

- confirmed classification evidence ID；
- 商品/变体/辖区/日期范围；
- 原产地和估价状态；
- 税率/附加费的来源和生效日；
- 未决贸易救济或限制；
- 结论上限。

08不重新分类，14不重猜税费。

## 失败与降级

- `candidate_code_missing`：只给商品事实与咨询问题；
- `tariff_version_missing`：不比较编码/税率；
- `product_facts_conflicted`：暂停候选判断；
- `origin_unresolved`：不应用优惠税率；
- `valuation_unresolved`：不计算金额；
- `trade_remedy_unknown`：设置专业复核 hold；
- `stale_evidence`：只作历史参考；
- `out_of_scope`：最终归类、税率确定、反倾销判断、报关、缴税或法律意见。

## 正式交付

至少生成：

1. `customs-classification-readiness.md`
2. `customs-product-fact-and-candidate-code-register.csv`
3. `origin-valuation-and-duty-evidence-register.csv`
4. `customs-broker-question-pack.md`
5. `customs-evidence-ledger.md`

使用 `assets/templates/customs-classification-readiness-template.md`。首页明确 `not_a_final_classification_or_duty_calculation`。

## 质量门

- 商品、变体、辖区和日期明确；
- 候选编码有提供者、税则版本和证据；
- Agent 未自定 final code；
- 原产地、估价和 Incoterms 事实完整；
- 税率/附加税只来自带日期依据；
- 贸易救济与限制交专业责任方；
- 未计算完税价格或应缴金额；
- Handoff 只传合格确认结论；
- 无 HS 网站、Web、API、报关或缴税；
- 双层谱系与工作区合同完整。

## 资源读取

- 建立候选编码、原产地、估价和税费问题前读取 `references/customs-classification-readiness-contract.md`。
- 写正式就绪包前读取或物化 `assets/templates/customs-classification-readiness-template.md`。
