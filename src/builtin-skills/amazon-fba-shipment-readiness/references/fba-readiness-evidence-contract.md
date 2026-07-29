<!--
文件功能：提供 FBA 人工建件资料就绪审查的证据字段、状态规则和负面校验表。
使用方式：由 SKILL.md 在登记材料、建立矩阵和执行质量门时引用；不包含任何平台执行步骤。
维护边界：只定义资料审查合同，不定义补货、货运、清关或利润计算。
-->

# FBA 资料就绪证据合同

## 1. 原始证据 envelope

| 字段 | 必需 | 说明 |
|---|---:|---|
| `evidence_id` | 是 | 当前任务内唯一、稳定 |
| `source_type` | 是 | `user_input` / `user_upload` / `trusted_upstream_output` |
| `source_locator` | 是 | 文件、页/表/行、截图区域或返回记录 |
| `source_version` | 是 | 来源版本；未知必须显式写明 |
| `observed_at` | 是 | 本任务读取或观察时间及时区 |
| `business_time` | 是 | 证据声明的业务时点；未知要显式写明 |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `unknown` |
| `transformation_type` | 是 | `raw` / `provider_derived` |
| `raw_value` | 是 | 不覆盖的原始值 |
| `raw_unit_or_currency` | 条件必需 | 数量、重量、尺寸或费用出现时必填 |
| `provider_or_owner` | 是 | 谁提供并对该事实负责 |
| `confirmation_status` | 是 | `confirmed` / `unconfirmed` / `not_required` |
| `limitations` | 是 | 覆盖、读取、时效和适用限制；无则写 `none` |

本包不调用 `sif_mcp` 或其他外部业务工具。外部销量信号不能替代库存、货件、标签、包装、箱规、目的节点或账户状态证据。合法来源未提供、未返回、解析失败和未查询必须分别记录，不得写成零或“不存在”。

## 2. 派生 record

### 2.1 正式派生对象本体

| 派生对象 | 稳定 ID | `parent_evidence_ids` | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` | 必要载荷 |
|---|---|---|---|---|---|---|---|
| `normalized` | `normalized_id` | 支撑原值与规范化值的原始 Evidence IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | 固定 `normalized` | 原值/单位、规范化值/单位、换算规则、精度和舍入 |
| `check` | `check_id` | 支撑检查输入、规则与阈值的 Evidence/Normalized IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | `calculation` / `comparison` | 检查项、带单位步骤、结果、差异、状态和原因 |
| `conclusion` | `conclusion_id` | 支撑结论的 Evidence/Normalized/Check IDs | 固定 `agent` | `current` / `historical` / `future` / `mixed` / `unknown` | `not_applicable` / `estimated` / `unknown` | 固定 `decision` | 结论、阻塞、假设、下一责任人和人工交接 |

### 2.2 三类对象共同元数据

| 字段 | 必需 | 说明 |
|---|---:|---|
| `output_id` | 是 | 当前任务内唯一派生记录 ID |
| `rule_version` | 是 | 本次规范化、检查或结论规则版本 |
| `generated_at` | 是 | 派生生成时间与时区 |
| `uncertainty` | 是 | 未知、冲突、覆盖或估算限制 |
| `result_status` | 是 | `ready` / `ready_with_limitations` / `blocked` / `out_of_scope` |
| `reason_codes[]` | 是 | `SCOPE_UNRESOLVED` / `QUANTITY_CONFLICT` / `LABEL_OR_IDENTITY_CONFLICT` / `MEASUREMENT_UNVERIFIED` / `SNAPSHOT_STALE_OR_UNDATED` / `EXTERNAL_TOOL_UNAVAILABLE` / `OUT_OF_SCOPE_REQUEST`；无原因写空数组 |
| `readiness_status` | 检查/结论必需 | 六种字段级状态之一 |
| `blocking_level` | 检查/结论必需 | `critical` / `major` / `minor` / `none` |
| `reason` | 是 | 可复核的判断原因 |
| `assumptions` | 是 | 无假设写 `none` |
| `next_owner` | 条件必需 | 需要人工处理时填写 |
| `decided_at` | 结论必需 | 领域判断时间；通常等于 `generated_at` |

对象、时间、单位/币种和口径是附加比较维度，不得替代 envelope/record 的任何必填字段。

## 3. 关键字段分组

### 3.1 范围键

- Marketplace/站点
- 目的国家/地区
- 货件批次标识
- 商品范围版本
- 计划发运窗口

任一范围键冲突时，不得合并记录。

### 3.2 商品映射

- Merchant SKU
- ASIN
- FNSKU 或标签策略
- 变体辨识信息
- 标签责任方
- 标签版本

商品名称不能作为唯一连接键。近似文本匹配只能生成候选关系，必须由人工确认。

### 3.3 数量口径

- 计划总件数
- 箱数
- 每箱件数
- 散箱件数
- 混装箱明细
- 数量证据的版本与责任人

只核对一致性，不计算建议补货量。

### 3.4 箱规口径

- 包装层级
- 长、宽、高及单位
- 实际重量及单位
- 实测/估算标记
- 测量时间
- 特殊处理声明

商品尺寸、包装尺寸、箱体尺寸和托盘尺寸不得互换。

### 3.5 目的与交接

- 目的节点/代码
- 地址版本
- 发货地
- 承运责任方
- 计划提货窗口
- 预约、托盘、交付要求的来源

平台尚未生成的字段保留为待人工确认，不得推测。

## 4. 用户状态快照专用规则

IPI、stranded inventory、suppressed listing 等快照必须具有：

1. 用户主动提供；
2. 日期；
3. 站点或账户范围；
4. 页面/状态名称；
5. 与本批次商品的关联；
6. “仅代表该时点”的提示。

缺少日期时，证据可登记但不能支持就绪结论。不得主动查询、刷新或修复。

## 5. 状态决策表

| 情况 | 字段状态 | 对整体结论的影响 |
|---|---|---|
| 必需证据完整、范围一致、责任人确认 | `ready` | 可继续 |
| 必需证据不存在 | `missing` | 关键项则 `BLOCKED` |
| 有效证据互相矛盾 | `conflict` | 关键项则 `BLOCKED` |
| 明确超出材料自身有效期 | `expired` | 关键项则 `BLOCKED` |
| 经规则或人工确认无需该项 | `not_applicable` | 不阻塞 |
| 存在材料但尚待责任人确认 | `needs_human_confirmation` | 关键项不得完全就绪 |

## 6. 负面校验

出现以下表述时必须返工：

- “已创建/已提交货件。”
- “已从 Seller Central 刷新 IPI。”
- “stranded 为 0”，但实际是工具未返回或未查询。
- “箱重约等于商品重量之和”，但没有实际称重证据。
- “FNSKU 应该与上次一样”，但没有当前批次证据。
- “平台一般会分到某仓”，因而填入目的节点。
- “资料基本齐全”，却没有逐项状态和阻塞等级。

## 7. 最小人工交接

每个阻塞项必须包含：

- 缺什么或冲突在哪里。
- 影响哪个站点、批次、SKU 或箱。
- 当前证据 ID。
- 需要的最小补充材料。
- 确认责任人。
- 期望确认时间。
- 确认后需要重新运行的检查步骤。
