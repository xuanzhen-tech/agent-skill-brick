---
name: social-channel-content-adaptation
description: 将带版本、审批状态和声明依据的核心品牌内容，依据用户提供的当前渠道规则改写为逐渠道待人工审核草稿；当任务明确指定 TikTok 平台、站点和对象时，可用 Sorftime 公热视频/作者观察补充内容形态背景。适用于格式、语气、locale 与 CTA 适配；不适用于把供应商观察当渠道规则、生成未证声明、回复互动、排程或发布。
---

<!--
文件功能：指导 Agent 把已批准核心内容适配为不同社媒渠道的草稿，同时保护声明、规则与人工发布边界。
职责边界：SIF 与 SellerSprite 不适用；Sorftime 仅在明确 TikTok 任务中提供公开内容背景，不能证明渠道规则、账号、互动、转化或发布状态；不制作视觉或发布。
重要关联：适配方法见 references/social-channel-adaptation-contract.md；正式交付使用 assets/templates/social-channel-adaptation-template.md。
-->

# 社媒渠道内容适配

## 目标

适配不是简单缩短或翻译。它要在不改变核心事实的前提下，重组：

- 开场方式；
- 信息顺序；
- 语气与语言；
- 长度与节奏；
- CTA；
- 视觉/字幕 brief；
- 标签、链接或格式；
- 渠道所需的审核与禁区。

每份草稿必须让审核者看得出：保留了什么、改了什么、为什么改、哪些内容仍缺依据。

## 开始条件

至少需要：

- 已批准、带版本的核心内容；
- 事实性声明及其直接材料；
- 目标渠道、站点/locale、格式和受众；
- 用户提供或可信上游提供的当前渠道规则；
- 品牌语气、禁用表达和 CTA 边界；
- 视觉/素材可用性和权利；
- 促销 brief（涉及价格/优惠时）；
- 人工审核人。

核心内容未批准或渠道规则不明时，只能输出差距和问题清单，不能交付“可发布”草稿。

`uploads/` 保持只读；过程材料写入 `temp/brand-marketing/<run-id>/05-social-adaptation/`，正式交付写入 `outputs/brand-marketing/<run-id>/05-social-adaptation/`。

## 执行流程

### 1. 冻结核心内容

先标出：

- 绝不能改变的事实和限定词；
- 可调整的叙事顺序与语气；
- 必须保留的法律、政策或品牌用语；
- 可删除但不能改写的细节；
- 仍待验证的内容；
- 促销、价格和期限的当前依据。

历史帖子不能替代当前批准内容。

### 2. 拆成信息单元

把核心内容拆为：

- 受众问题或钩子；
- 主要结论；
- 支撑事实/证明；
- 使用场景或故事；
- 异议与限定；
- CTA；
- 视觉或声音要求。

拆分用于重新编排，不用于把一个有条件的声明切成无条件承诺。

### 3. 核对渠道规则

只使用用户提供或可信上游的当前规则，并写清适用渠道、地区、内容格式和时间。重点核对：

- 字符/时长/比例；
- 链接、标签和 CTA；
- 广告/赞助披露；
- 音乐、字幕和可访问性；
- 敏感类目和禁止声明；
- 促销、抽奖和地区限制；
- 品牌安全与审核要求。

供应商公开视频观察不是渠道规则。规则缺失时向用户索取，不凭记忆填平台限制。

### 4. 明确 TikTok 观察门

只有任务明确给出 `platform=tiktok`、目标站点、公开商品/视频/作者对象和适配用途时，才可通过 `sorftime_mcp` 调用：

- `tiktok_product_video`
- `tiktok_product_video_author`
- `tiktok_author`

`tiktok_author` 若实时 `describe` 不支持目标站点，停止该分支。`sif_mcp` 与 `sellersprite_mcp` 不为凑三源调用。

每个工具首次调用前按外层 `search → describe → call` 使用，`arguments` 只服从本次 `inputSchema`。禁止点式调用、Gateway、HTTP、SDK、CLI、shell、浏览器或自行注册/启停 MCP。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

公开视频/作者结果只用于观察内容形态、节奏和常见表达，不能证明渠道规则、完整样本、账号所有权、互动真实性、转化或未来效果。截断或分页不完整时说明覆盖。

### 5. 逐渠道重构

每个渠道依次决定：

1. 受众为何会停下来；
2. 哪一个信息最应先出现；
3. 需要保留哪些证明和限定；
4. 什么长度和节奏适合该格式；
5. 视觉、字幕或声音承担什么信息；
6. CTA 是否符合用户旅程与当前规则；
7. 哪些内容因规则、素材或声明限制必须删除。

不同渠道应共享事实核心，但不应只是同一段文案复制粘贴。

### 6. 处理 locale 与翻译

逐段复核数字、日期、币种、计量单位、否定、条件、例外、文化语气和 CTA。不要逐字翻译导致不自然，也不要本地化时扩大产品功效。

高风险政策、法律、健康、安全或促销术语需要人工语言/专业复核。

### 7. 设计视觉与素材 brief

说明：

- 画面/镜头需要传达什么；
- 哪些产品事实必须可见；
- 文案与字幕承担什么；
- 尺寸、比例、时长和封面要求；
- 所需资产及使用权；
- 不可生成或未获批准的内容。

本 Skill 不制作视觉。需要生成或编辑图像/视频时交对应视觉专家。

### 8. 核对声明与促销

每条事实性声明回到核心内容材料。每个价格、折扣、赠品和截止时间回到当前促销 brief。

若渠道长度不足以保留必要限定，不得只保留吸引人的主张；应改选更安全的信息或阻塞。

### 9. 交付差异说明

对每个渠道说明：

- 核心内容保留项；
- 删除、压缩、翻译或重排的内容；
- 渠道规则依据；
- TikTok 公开观察如何影响内容形式；
- 待补素材、声明、规则或审核；
- 明确未发布。

## 失败与降级

- 核心内容未批准：只交差距；
- 渠道规则缺失或冲突：不凭记忆定稿；
- 声明缺依据：删除或转为待核；
- 促销 brief 缺失：删除价格/折扣/截止时间；
- 素材或使用权不明：只写 brief，不安排使用；
- TikTok 站点不支持或结果不完整：不调用/不称全量；
- 用户要求发布、排程或回复互动：明确越界。

## 正式交付

使用 `assets/templates/social-channel-adaptation-template.md` 生成：

1. `social-channel-adaptation-plan.md`
2. `channel-drafts.md`
3. `claim-and-rule-review.md`
4. `visual-briefs.md`
5. `adaptation-differences.md`

## 质量门

- 核心事实、限定和版本已冻结；
- 渠道规则来自当前可信材料，不是供应商观察；
- 每个渠道真正重构信息，而非机械截短；
- 本地化未改变事实、数字、条件或责任；
- 声明和促销均有直接依据；
- TikTok 公开数据只用于内容形态背景；
- 视觉需求有 brief 和权利检查；
- 每份草稿有差异说明和人工审核；
- 未回复互动、排程或发布。

## 资源读取

- 开始适配前读取 `references/social-channel-adaptation-contract.md`。
- 写正式交付前读取 `assets/templates/social-channel-adaptation-template.md`。
