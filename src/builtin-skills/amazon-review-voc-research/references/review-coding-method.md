<!--
文件功能：提供 Amazon 已取样评论的主题编码、方向编码、版本控制和频率解释方法。
职责边界：只定义可复核的编码过程，不提供固定行业主题、不把评分等同情感，也不把样本编码外推为全部消费者结论。
关联关系：由 ../SKILL.md 的 codebook 与分析阶段读取；证据字段和覆盖口径见 review-evidence-contract.md，正式 codebook 表头见 ../assets/templates/review-voc-workbook-template.md。
-->

# 评论编码方法

## 编码单位

- 默认编码单位是一条去重后的评论。
- 一条评论可以命中多个主题，但同一主题在同一评论内只计一次。
- 需要分析评论内部相反意见时，可以增加有界片段证据，但主题频率分母仍是评论数，不是句子数。
- 标题与正文属于同一评论单元；媒体标记只说明存在图片或视频，不代表媒体内容已被观察。

## 三类编码

### 主题代码

描述评论谈论什么，例如安装、耐用、尺寸、气味、包装、客服。主题必须来自样本，不预置为跨类目真理。

### 方向代码

描述该主题在本条评论中的评价方向：

- `positive`
- `negative`
- `mixed`
- `neutral_or_unclear`

方向由相关文本决定，不能只看总星级。

### 旅程代码

仅在文本明确支持时标记：

- `purchase_decision`
- `delivery_unboxing`
- `setup_first_use`
- `ongoing_use`
- `maintenance`
- `support_return`
- `unclear`

## 建立 codebook

1. 从各主要星级和 ASIN 取一个小型、可追溯的校准样本。
2. 提取候选主题，并合并同义但业务含义一致的标签。
3. 为每个代码写定义、纳入条件、排除条件、正例和反例。
4. 检查代码之间是否重叠到无法稳定区分；必要时建立父子关系。
5. 冻结为 `version=1` 后再编码完整样本。
6. 遇到新主题时记录待决案例；只有证据足够时新增代码并升级版本。

## 编码产物的四轴

| 产物 | source_type | temporal_scope | estimation_status | transformation_type |
|---|---|---|---|---|
| 当前 Agent 新建的 codebook 定义 | `agent` | `not_applicable` | `not_applicable` | `coding` |
| 单条评论的主题、方向或旅程代码 | `agent` | 继承评论的 `historical` 或 `unknown` | `not_applicable` | `coding` |
| 样本计数、分母、频率或加权结果 | `agent` | 继承合格样本范围；跨当前查询与历史评论时为 `mixed` | `not_applicable` | `calculation` |
| 从编码结果得到的产品或服务含义 | `agent` | 按所引用证据范围填写 | `not_applicable` | `inference` |
| 面向未来的验证命题 | `agent` | `future` | `not_applicable` | `hypothesis` |

原样复用上游 codebook 时使用 `source_type=upstream_output`，保留上游来源文件、evidence ID 和原四轴。当前 Agent 只要合并、改名或修改定义，就应创建新版本，使用 `source_type=agent`、`transformation_type=coding`，同时保留上游谱系和直接 `parent_evidence_ids`。

## 代码质量

一个合格代码应满足：

- 单一：只表达一个稳定主题；
- 可观察：能由评论文本判断是否命中；
- 可区分：与相邻代码有明确排除边界；
- 可追溯：至少有一个匿名证据 ID 作为正例；
- 可维护：名称不依赖当前 ASIN、某次错误或作者身份。

“质量差”“体验好”“用户不满意”过于宽泛，应拆成可行动主题。产品改良建议属于推断，不能作为评论主题代码。

## 频率计算

对主题 `C`：

```text
sample_frequency(C) = coded_review_count(C) / eligible_deduplicated_reviews
```

必须同时报告分子、分母和 eligible 条件。例如：

> 在 US 站 ASIN A 的本次 1–3 星已取样且去重后的 42 条评论中，11 条命中“安装步骤不清晰”。

不能写成：

> 26% 的消费者认为安装困难。

若采用按星级等额抽样，跨星级总体频率没有自然分布意义。只能分别报告各星级，或在获得真实星级分布且说明加权方法后生成 `source_type=agent`、`transformation_type=calculation` 的加权结果。

## 分层分析

优先检查：

- 主题是否只集中在某个 ASIN 或变体；
- 主题是否只出现在特定星级；
- Verified Purchase 与非 Verified 样本的覆盖是否足以比较；
- Vine 样本是否被单独披露；
- 媒体评论是否只是被筛选更多，而非问题更常见；
- 主题是否集中在特定期间，可能反映批次或版本变化；
- 不同语言是否因翻译或编码方式产生偏差。

样本不足时写 `insufficient_sample`，不为了得出结论合并不相容分层。

## 证据强度

| 等级 | 条件 | 允许表述 |
|---|---|---|
| `strong_within_sample` | 多条独立评论、跨合理分层重复、代码稳定、存在反证检查 | 本次样本中的稳定主题 |
| `moderate_within_sample` | 多条评论支持，但覆盖或可比性有限 | 本次样本中的重复信号 |
| `weak_signal` | 少量评论或只在单一分层出现 | 待验证信号 |
| `unsupported` | 无直接文本、字段缺失或完全依赖推断 | 不下主题结论 |

等级只描述本次样本内的证据强度，不表示市场发生率。

## 从编码到洞察

每项洞察按顺序写：

1. 直接证据：匿名摘录和 evidence ID；
2. 编码观察：主题、方向、分层和样本频率；
3. 反证：相反评价、未覆盖分层或冲突；
4. 推断：可能的产品、内容或服务含义；
5. 下一步：能验证该推断的低成本动作。

原文没有明确表达的动机、身份和因果关系一律标记为 `source_type=agent`、`transformation_type=inference`，或放入报告的“开放问题”状态；“开放问题”不是四轴标签。
