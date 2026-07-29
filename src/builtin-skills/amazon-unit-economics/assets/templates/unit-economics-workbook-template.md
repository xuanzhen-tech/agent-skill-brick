<!--
文件功能：提供单个 Amazon SKU 的单位经济输入账本、利润瀑布、保本反算、情景比较和独立复核模板。
职责边界：模板不提供任何默认费率、成本或推荐阈值；所有项目数值必须来自用户事实、内置利润包输出或经用户确认的 SIF 预填。
关联关系：由 ../../SKILL.md 的建模与复核阶段使用，公式和成本分类见 ../../references/unit-economics-model.md。
-->

# 单位经济工作表

将本模板按 SKU 复制到：

```text
temp/product-selection/<case-id>/03-unit-economics/<sku>-unit-economics-workbook.md
```

完成全部复核后，再把核准版移入同一 case 的 `outputs/`。多个 SKU 各用一份，不混用币种、站点或输入状态。

## 1. 模型身份与准备状态

| 字段 | 本次值 |
|---|---|
| case_id |  |
| SKU/候选 |  |
| Amazon 站点 |  |
| 币种 |  |
| 售价是否不含销售税 | `是/否/待确认` |
| 汇率及日期（如适用） |  |
| 计算日期 |  |
| `input_readiness` | `ready/preview/blocked` |
| 不能进入正式结论的原因 |  |

状态汇总规则：

- 任一关键输入 `missing` → `blocked`，停止盈利计算；
- 无 `missing` 但任一关键输入 `provisional` → `preview`；
- 全部关键输入为 `ready` 或有理由的 `not_applicable` → `ready`；
- SIF 预填在用户确认前只能是 `provisional`。

## 2. 输入账本

每个字段一行。金额统一为本表币种；费率统一为 `0–1`。

### 售价与费率

| field | value | unit | status | source_type | evidence_id | as_of | reason |
|---|---:|---|---|---|---|---|---|
| `selling_price` |  | currency/unit |  |  |  |  |  |
| `discount_rate` |  | rate |  |  |  |  |  |
| `refund_rate` |  | rate |  |  |  |  |  |
| `referral_fee_rate` |  | rate |  |  |  |  |  |
| `advertising_rate` |  | rate |  |  |  |  |  |

### 落地成本

| field | value | unit | status | source_type | evidence_id | as_of | reason/是否已含其他项 |
|---|---:|---|---|---|---|---|---|
| `product` |  | currency/unit |  |  |  |  |  |
| `packaging` |  | currency/unit |  |  |  |  |  |
| `quality_control` |  | currency/unit |  |  |  |  |  |
| `tooling_amortization` |  | currency/unit |  |  |  |  |  |
| `first_mile` |  | currency/unit |  |  |  |  |  |
| `international_freight` |  | currency/unit |  |  |  |  |  |
| `duty_and_tax` |  | currency/unit |  |  |  |  |  |
| `brokerage` |  | currency/unit |  |  |  |  |  |
| `prep_and_inbound` |  | currency/unit |  |  |  |  |  |

### 平台、履约与固定成本

| field | value | unit | status | source_type | evidence_id | as_of | reason |
|---|---:|---|---|---|---|---|---|
| `fulfillment` |  | currency/unit |  |  |  |  |  |
| `storage` |  | currency/unit |  |  |  |  |  |
| `other_channel` |  | currency/unit |  |  |  |  |  |
| `return_processing_per_return` |  | currency/return |  |  |  |  |  |
| `fixed_launch_cost` |  | currency |  |  |  |  |  |
| `planned_lifetime_units` |  | units |  |  |  |  |  |
| `target_margin_rate` |  | rate |  |  |  |  |  |

允许状态：`ready`、`provisional`、`missing`、`not_applicable`。数值为 0 时必须是 `not_applicable` 且有非空理由；字段缺失不得改写成 0。SIF 的探索性利润门槛不得作为成本行或正式利润结论。

## 3. SIF 探索性证据

只在实际使用 SIF 预填或探索性利润门槛时填写；没有调用时写 `not_queried`。

| evidence_id | source_type | source_provider | source_tool | agent_request_id | tool_call_id | provider_request_id | retrieved_at | marketplace | query_scope | temporal_scope | coverage_or_pagination | estimation_status | transformation_type | result_state | field_state | raw_result_locator | parent_evidence_ids | parent_input_evidence_ids |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | sif_mcp | sif |  | not_returned | not_returned | not_returned |  |  |  |  |  |  | reported |  |  |  |  |  |
|  | sif_mcp | sif | market_estimate_profit_threshold | not_returned | not_returned | not_returned |  |  |  |  |  |  | vendor_calculation |  |  |  |  |  |

`agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`；利润门槛行还必须记录本次全部显式输入的 Evidence ID。

`result_state` 与 `field_state` 只允许 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。前五态不得补成 0；只有响应明确返回且语义可确认的零才使用 `true_zero`。

## 4. 防双算检查

| 检查 | 结论 | 证据/处理 |
|---|---|---|
| 采购是否已含包装、质检或国内运费 |  |  |
| 国际运费是否已含关税、清关或入仓 |  |  |
| FBA 估算是否已含履约或仓储 |  |  |
| 模具费是否已摊入采购价 |  |  |
| 退款准备与退货处理是否分开 |  |  |
| 广告使用 TACoS/销售额口径且未重复扣除 |  |  |
| 售价税口径是否一致 |  |  |

任一“无法确认”都要回到输入状态；不得继续标 `ready`。

## 5. 基准情景计算

保留未四舍五入值用于后续运算，展示列才按币种精度四舍五入。

### 收入

| 项目 | 公式 | 未舍入结果 | 展示结果 |
|---|---|---:|---:|
| 售价 `P` | 输入 |  |  |
| 折扣准备 | `P × discount_rate` |  |  |
| 退款准备 | `P × refund_rate` |  |  |
| 净收入 | `P - 折扣准备 - 退款准备` |  |  |

### 落地成本

| 项目 | 未舍入结果 |
|---|---:|
| 产品 |  |
| 包装 |  |
| 质检 |  |
| 模具摊销 |  |
| 国内段 |  |
| 国际运费 |  |
| 关税税费 |  |
| 清关 |  |
| 备货入仓 |  |
| **落地成本合计** |  |

### 平台与履约

| 项目 | 公式 | 未舍入结果 |
|---|---|---:|
| 平台佣金 | `P × referral_fee_rate` |  |
| 履约 | 输入 |  |
| 仓储 | 输入 |  |
| 其他渠道 | 输入 |  |
| 退货处理准备 | `refund_rate × return_processing_per_return` |  |
| **平台与履约合计** | 明细相加 |  |

### 利润瀑布

| 层级 | 公式 | 金额 | 利润率（金额/P） |
|---|---|---:|---:|
| CM1 | `净收入 - 落地成本` |  |  |
| CM2 | `CM1 - 平台与履约合计` |  |  |
| 广告 | `P × advertising_rate` |  |  |
| CM3 | `CM2 - 广告` |  |  |
| 固定成本摊销 | `fixed_launch_cost / planned_lifetime_units` |  |  |
| 完全负担贡献 | `CM3 - 固定成本摊销` |  |  |

## 6. 保本与目标售价

| 指标 | 公式 | 结果 | 解释 |
|---|---|---:|---|
| 保本 ACoS | `max(CM2/P, 0)` |  | CM2≤0 时无广告空间 |
| 保本 ROAS | `1 / 保本 ACoS` |  | ACoS=0 时不可计算 |
| 随售价变化费率 | 四项费率相加 |  |  |
| 固定每单位成本 `F` | 落地 + 非比例平台履约 + 固定成本摊销 |  |  |
| 保本售价 | `F / (1 - price_linked_rate)` |  | 分母≤0 时无有限解 |
| 目标利润售价 | `F / (1 - price_linked_rate - target_margin_rate)` |  | 分母≤0 时不可达 |

## 7. 用户确认的情景

未获用户确认的建议情景写入待确认问题，不填入本表。

| 情景名 | `approved_by_user` | evidence_id | 只改变的输入 | 基准值 → 情景值 | 完全负担贡献 | 利润率 | 保本售价 | 结论变化 |
|---|---|---|---|---|---:|---:|---:|---|
|  | `true` |  |  |  |  |  |  |  |

每个情景只改变显式列出的输入，其余必须与基准一致。

## 8. 独立复核

复核时从输入账本重新相加，不直接复制第一遍合计。

| 复核项 | 第一遍 | 独立复核/反算 | 差异 | 通过 |
|---|---:|---:|---:|---|
| 落地成本明细合计 |  |  |  |  |
| 平台与履约明细合计 |  |  |  |  |
| `CM1 = 净收入 - 落地成本` |  |  |  |  |
| `CM2 = CM1 - 平台与履约` |  |  |  |  |
| `CM3 = CM2 - 广告` |  |  |  |  |
| `完全负担贡献 = CM3 - 固定摊销` |  |  |  |  |
| 保本售价代回后的完全负担贡献 |  | 0（舍入容差内） |  |  |
| 每个情景只改变已声明输入 |  |  |  |  |

若任一差异超过币种舍入容差，先检查单位、费率、重复计费和过早舍入。复核全部通过且 `input_readiness=ready` 后，才能向下游提供 `unit_economics=ready`。
