<!--
文件功能：定义 Amazon 评论 VOC 的允许来源、证据行、匿名化、去重、覆盖与对象血缘合同。
职责边界：只处理用户、uploads 或可信上游已提供的评论，不从 SIF 或其他外部来源取数，不定义主题代码，也不补造缺失字段。
关联关系：由 ../SKILL.md 的就绪闸门、规范化、覆盖和交付阶段读取；编码规则见 review-coding-method.md。
-->

# 评论 VOC 证据合同

## 允许来源

正式评论原文只接受：

- `user_input`：用户对话或 `uploads/`；
- `upstream_output`：可信上游 `outputs/`；
- `agent`：只用于规范化、编码、计算、推断和假设，不是新评论正文来源。

SIF 当前没有评论正文能力。禁止用 SIF 的 ASIN、关键词、流量、广告或任何供应商结构替代评论。

## 四轴与对象血缘

| 轴 | 允许值 |
|---|---|
| `source_type` | `user_input / upstream_output / agent` |
| `temporal_scope` | `current / historical / future / mixed / not_applicable / unknown` |
| `estimation_status` | `reported / estimated / forecast / mixed / not_applicable / unknown` |
| `transformation_type` | `reported / normalized / calculation / coding / inference / hypothesis` |

来源材料中原样保留的评论记录使用 `transformation_type=reported`。Agent 派生对象必须使用 `source_type=agent`，并列出直接 `parent_evidence_ids`；不得覆盖原始证据。

字段状态只允许：

```text
not_returned | not_queried | parse_failed | missing | conflicted | true_zero
```

来源不含某字段写 `not_returned`；字段存在但本次未解析写 `not_queried`；解析失败写 `parse_failed`。不得使用 0、false 或空字符串代替未知。

## 来源登记

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

文件修改时间只能证明文件状态，不能冒充评论日期或数据期间。

## 上游证据链

`source_type=upstream_output` 时同时保留：

```text
upstream_source_file
upstream_evidence_id
upstream_source_type
upstream_temporal_scope
upstream_estimation_status
upstream_transformation_type
```

上游缺少时间或估算轴时写 `unknown`；缺少来源或转换轴时保持缺口并将记录降级，不从结论文字补造。

## 正式评论证据行

| 字段 | 语义 | 规则 |
|---|---|---|
| `evidence_id` | 本案例匿名稳定编号 | 使用 `REV-0001` 等编号 |
| `source_type` | `user_input/upstream_output/agent` | 来源评论不能是 `agent` |
| `source_record_id` | 对应来源登记 | 必须可定位 |
| `parent_evidence_ids` | 直接父证据 | 原始来源记录为空；派生记录必填 |
| `temporal_scope` | 时间轴 | 评论日期可解释时为 `historical` |
| `estimation_status` | 估算轴 | 按来源元数据填写，无法确认写 `unknown` |
| `transformation_type` | 转换轴 | 原样为 `reported`；匿名化/摘录/去重为 `normalized` |
| `marketplace` | Amazon 站点 | 不同站点不得空值合并 |
| `asin` | 评论所属 ASIN | 无法对应时阻断 |
| `review_date` | 来源提供的评论日期 | 不可用文件或导入时间代替 |
| `rating_raw` | 原始评分 | 保留量表 |
| `verified_raw` | Verified Purchase | 缺失用六态 |
| `vine_raw` | Vine | 缺失用六态 |
| `media_raw` | 媒体标记 | 不代表观察了媒体内容 |
| `title_excerpt` | 有界标题摘录 | 删除作者身份 |
| `text_excerpt` | 支持复核的有界正文摘录 | 不改写语气 |
| `language` | 来源语言或 Agent 派生语言记录 | 派生识别另建 `inference` |
| `duplicate_count` | 合并记录数 | 至少为 1 |
| `evidence_location` | workspace 内证据位置 | 不指向外部网页 |
| `field_states` | 六态字段状态 | 不用空值代替 |
| `limitations` | 口径限制 | 必填 |

## 禁止字段

正式证据不得包含作者姓名、用户名、昵称、个人主页、邮箱、电话、地址、订单号、外链个人资料，或 Agent 根据写作风格猜测的年龄、性别、地区、职业和身份。

## 去重顺序

1. 来源有稳定记录 ID 时，仅在 `temp/` 使用它判重。
2. 没有稳定 ID 时，规范化 ASIN、评论日期、评分、标题和正文后组合判重。
3. 仅空格、大小写、标点或转义差异可视为同一文本；翻译、摘要或语义相似不能自动合并。
4. 不使用作者身份作为判重条件。
5. 同一评论在多个来源出现时保留一条规范化证据，并记录所有直接父 evidence ID。

## 覆盖账本

```text
coverage_id
source_record_ids
marketplace
asin
period
star_bucket
verified_bucket
vine_bucket
media_bucket
language_bucket
provided_count
deduplicated_count
truncated
field_states
comparability
parent_evidence_ids
notes
```

覆盖与计数使用 `source_type=agent`、`transformation_type=calculation`。样本范围只描述已提供材料，不能写为 Amazon 全量覆盖。

## 可比性

跨 ASIN 或分层比较需要：

- 同站点；
- 可对齐期间；
- 相同或可解释的抽样/导出方式；
- 相同星级结构；
- 关键字段覆盖一致；
- 去重规则一致。

任一条件不满足时设为 `limited` 或 `not_comparable`，只并列展示，不计算强弱差异。

## 就绪判断

### `ready`

存在可复核正文、ASIN 映射、来源文件和足够覆盖说明；作者身份可以安全去除。

### `partial`

只有部分文件、分层、期间或字段可用；仅分析可追溯部分并披露失败率。

### `blocked`

无正文、无 ASIN 映射、来源不可访问/解析失败、只有汇总结论，或身份数据无法安全剥离。

正式报告不得把编码、计算、推断或假设改写成评论原始字段，也不得把样本频率外推为消费者总体发生率。
