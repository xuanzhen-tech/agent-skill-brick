---
name: amazon-review-voc-research
description: 对用户、uploads 或可信上游提供的 Amazon 评论正文做可追溯 VOC 研究，覆盖匿名化、去重、样本覆盖、主题编码、痛点、正向体验与反证。适用于竞品评论拆解、产品改良证据和购买后 VOC；SIF 当前不提供评论正文，本 Skill 不调用 SIF 取评论，也不适用于网页抓取、全网舆情、销量分析或把样本频率外推为全市场发生率。
---

<!--
文件功能：定义 Amazon 评论 VOC 的受控语料工作流，将用户、uploads 或可信上游提供的评论正文转化为可审计覆盖账本、编码证据和条件化洞察。
职责边界：不通过 SIF 或其他外部来源获取评论，不抓取网页，不输出作者身份，不把主题编码或样本频率包装成全体消费者事实。
关联关系：证据、匿名化和覆盖合同见 references/review-evidence-contract.md；编码方法见 references/review-coding-method.md；正式交付使用 assets/templates/。
-->

# Amazon 评论 VOC 研究

## 能力边界

SIF 当前没有评论正文能力。本 Skill：

- 不调用 `sif_mcp` 获取评论；
- 不用 ASIN profile、关键词、流量、广告或任何其他 SIF 字段替代评论正文；
- 不用网页、浏览器、其他 MCP/API 或模型常识补造评论；
- 只处理用户对话、`uploads/` 或可信上游 `outputs/` 中已经提供的评论材料；
- 缺少合格评论正文时失败关闭，只交付 `data-readiness.md`。

允许的来源：

| 来源 | `source_type` | 要求 |
|---|---|---|
| 用户对话或 `uploads/` | `user_input` | 原文件、站点、ASIN、字段与覆盖可定位 |
| 可信上游 `outputs/` | `upstream_output` | 保留上游文件、evidence ID、原四轴与版本 |
| 本 Skill 派生对象 | `agent` | 必须列出直接 `parent_evidence_ids` |

## 核心目标

回答“这批已提供评论中，消费者具体赞扬、抱怨和要求什么”，并让每项结论回到明确的站点、ASIN、期间、取样设计、分母和匿名 evidence ID。

评论正文与来源字段是证据；主题、方向、旅程、计数、产品含义和验证动作分别是 `coding`、`calculation`、`inference` 或 `hypothesis`，不得混写。

## 运行合同

### 工作区

- 原始文件只读保留在 `uploads/` 或上游 `outputs/`。
- 字段探测、去重中间表与编码草稿写入 `temp/market-research/<case-id>/01-review-voc/`。
- 正式交付写入 `outputs/market-research/<case-id>/01-review-voc/`。
- 正式文件不得包含评论作者姓名、用户名、个人主页、联系方式、订单号或其他直接身份字段。

### 四轴、血缘与六态

每条正式记录同时保存：

- `source_type`：`user_input | upstream_output | agent`；
- `temporal_scope`：`current | historical | future | mixed | not_applicable | unknown`；
- `estimation_status`：`reported | estimated | forecast | mixed | not_applicable | unknown`；
- `transformation_type`：`reported | normalized | calculation | coding | inference | hypothesis`。

来源材料中原样保留的评论记录使用 `transformation_type=reported`；字段清洗或有界摘录另建 `normalized` 记录。Agent 派生对象使用 `source_type=agent` 并直接列出 `parent_evidence_ids`。

字段状态只用 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。来源文件没有某字段时写 `not_returned`，不得推断 false 或 0。

## 启动判断

### 最小输入

必须明确：

1. Amazon 站点；
2. 一个或多个 ASIN；
3. 研究用途；
4. 已提供评论材料的位置；
5. 目标期间或接受现有覆盖；
6. 希望比较的分层。

站点、ASIN 或评论材料缺失时，先集中询问一次。用户暂不补充时生成 `data-readiness.md`，不开始编码。

### 语料就绪闸门

读取 `references/review-evidence-contract.md`，逐文件核对：

- 来源文件可定位且在当前 workspace；
- 每条记录能映射到 ASIN；
- 存在可复核评论正文；
- 评分、评论日期、Verified Purchase、Vine、媒体、语言等字段按实际存在性登记；
- 站点、期间、抽样或导出范围至少可披露；
- 上游记录可追溯到上游 evidence ID；
- 正式处理不需要保留作者身份。

以下情况失败关闭：

- 只有主题汇总、星级总数或截图结论，没有可复核正文；
- 评论正文与 ASIN 无法对应；
- 来源文件不可访问或解析失败；
- 只有 SIF 的 ASIN/关键词/流量/广告数据；
- 关键覆盖未知且用户不接受有限样本结论。

## 研究工作流

### 第一步：冻结研究范围

记录站点、ASIN、目标期间、研究问题、允许分层、来源文件版本、导出/抽样方式、已知语言或变体问题，以及用户接受的结论上限。

不同站点、ASIN、语言和期间先分开保存，不在导入阶段混合。

### 第二步：建立来源登记

为每个输入文件记录：

```text
source_record_id
source_type
source_path
source_version_or_modified_at
provided_at
marketplace
asin_scope
period_scope
sampling_or_export_scope
available_fields
missing_fields
parse_status
limitations
```

不复制作者身份到正式来源登记。文件解析失败写 `parse_failed`，不得用部分乱码继续编码。

### 第三步：规范化、匿名化与去重

1. 保留原始评分、评论日期/期间、正文、ASIN，以及来源实际提供的 Verified Purchase、Vine、媒体和语言字段。
2. 查询或导出时间与评论日期分开；文件修改时间不能冒充评论时间。
3. 删除作者姓名、用户名、主页、联系方式、地址、订单号等身份字段。
4. 优先用来源内稳定记录 ID 在 `temp/` 判重，但不把该 ID 暴露到正式文件。
5. 没有记录 ID 时，用 ASIN、日期、评分、标题和正文的确定性规范化组合判重；不使用作者身份。
6. 同一评论只保留一个正式 evidence ID，记录重复数量与命中来源。
7. 正式 CSV 使用必要的有界摘录；需要全文复核时用 `evidence_location` 指向 `temp/` 中的受控证据。
8. 每个 `normalized` 记录直接链接原始 `reported` evidence ID。

### 第四步：建立覆盖账本

按 ASIN、星级、Verified Purchase、Vine、媒体、语言和期间记录：

- 来源提供数量与去重后数量；
- 字段未返回、未查询、解析失败或冲突；
- 已知抽样/导出范围与截断状态；
- 分层是否可比；
- 样本只覆盖已提供材料，不声称占 Amazon 全部评论的比例。

没有覆盖账本时，不发布主题频率或跨 ASIN 比较。

### 第五步：冻结编码表

读取 `references/review-coding-method.md`：

- 用跨主要 ASIN/星级的小型校准样本建立 codebook；
- 每个代码写定义、纳入、排除、正例、反例和父子关系；
- 一条评论可命中多个主题；主题与方向分开；
- 星级不能替代情感方向；
- 新主题升级 codebook 版本，不静默改写旧定义；
- 每个代码必须能由匿名评论文本复核。

### 第六步：编码、计数与反证

按层级建立独立对象：

1. 来源评论：`source_type=user_input/upstream_output`、`transformation_type=reported`；
2. 匿名化/摘录/去重：`source_type=agent`、`transformation_type=normalized`；
3. 主题、方向、旅程：`source_type=agent`、`transformation_type=coding`；
4. 分层计数与比例：`source_type=agent`、`transformation_type=calculation`；
5. 产品或服务含义：`source_type=agent`、`transformation_type=inference`；
6. 面向未来的验证动作：`source_type=agent`、`temporal_scope=future`、`transformation_type=hypothesis`。

每层列出直接 `parent_evidence_ids`。主题频率只写：

> 在本次已提供、符合 eligible 条件且去重后的 N 条评论中，n 条命中该代码。

不得写“X% 消费者”或“市场普遍存在”。

### 第七步：跨 ASIN 与分层比较

只有站点、期间、抽样策略、星级结构、字段覆盖和去重规则可比时才比较。不可比时并列报告，状态为 `limited` 或 `not_comparable`，不强制排序。

### 第八步：形成条件化洞察

每项洞察包含：

- 样本范围与分母；
- 代表 evidence IDs；
- 编码规则；
- 反例、冲突与未覆盖分层；
- 可支持的产品问题或验证假设；
- 当前证据不能证明的内容。

不凑 Top N。只支持三个稳定主题时就交付三个。

## 失败关闭

- 无评论正文或 ASIN 映射：生成 `data-readiness.md`。
- 来源文件不可读或解析失败：保留 `parse_failed`，停止受影响文件。
- 字段未返回：按六态记录，不以相似字段或常识补齐。
- 部分语料可用：仅分析可追溯部分，披露失败文件、失败率和覆盖。
- 多份来源冲突：保留冲突，要求用户指定权威版本或将分支 `blocked`。
- 内容含作者身份：匿名化成功后才进入正式证据；无法安全去除时停止该记录。

任何失败都不能触发 SIF、网页、浏览器或其他 MCP/API。

## 正式交付

数据就绪时至少生成：

1. `review-voc-report.md`；
2. `review-evidence.csv`；
3. `review-codebook.csv`；
4. `review-coverage.csv`；
5. `source-register.md`。

缺语料时生成 `data-readiness.md`，写明用户可提供的最小文件与字段。使用 `assets/templates/review-voc-report-template.md`、`assets/templates/review-voc-workbook-template.md`、`assets/templates/data-readiness-template.md` 和 `assets/templates/query-log-template.md`（作为来源登记结构，不记录 MCP 调用）。

## 质量门

- 所有评论正文来自用户、`uploads/` 或可信上游；
- 没有调用 SIF 或其他外部来源取评论；
- 没有作者身份字段进入正式产物；
- 原始来源、匿名化、编码、计算、推断和假设分层；
- 四轴、直接父证据和六态完整；
- 去重规则、重复数量和最终分母可复核；
- 每个频率都有“本次已提供评论”分母；
- 没有把分层样本当自然分布，没有凑 Top N；
- 正式产物在 `outputs/`，中间证据在 `temp/`。

## 参考资源

- 导入、匿名化、去重和覆盖前读取 `references/review-evidence-contract.md`。
- 建立或修订 codebook 前读取 `references/review-coding-method.md`。
- 写正式交付时使用 `assets/templates/` 中对应模板。
