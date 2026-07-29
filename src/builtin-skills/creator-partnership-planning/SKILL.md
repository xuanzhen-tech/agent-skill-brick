---
name: creator-partnership-planning
description: 基于用户提供的 creator dossier，并在任务明确指定 TikTok 平台、站点和对象时按需补充 Sorftime 的公开视频/作者观察，形成候选筛选、证据缺口、风险门禁和待人工审批合作 brief。适用于 creator 合作前的信息核对与策划；不适用于把公开作者数据当身份、受众去重、商业条件、rights 或效果证明，也不联系、签约、付款或发布。
---

<!--
文件功能：指导 Agent 完成 creator 身份核对、品牌匹配、受众/内容判断、权利与披露门禁及合作 brief。
职责边界：以合法 dossier 为主；TikTok 明确任务门内可用 Sorftime 形成候选线索，SIF 与 SellerSprite 不适用；不外联、签约、付款或发布。
重要关联：规划方法见 references/creator-partnership-evidence-contract.md；正式交付使用 assets/templates/creator-partnership-plan-template.md。
-->

# Creator 合作规划

## 目标

把“这个 creator 值不值得合作”拆成可复核问题：

- 身份和账号是否已由责任方核实；
- 内容、价值观和受众是否与品牌任务匹配；
- 公开表现能说明什么，不能说明什么；
- 费用、交付、权利和披露还缺哪些商业确认；
- 合作目标、创意空间、审核与衡量怎样设计；
- 哪些候选可进入人工沟通，哪些应暂缓或排除。

## 开始条件

至少需要：

- 目标平台、站点、活动目标与受众；
- 每位候选的 dossier、公开账号定位和身份核验情况；
- 历史内容样本及观察时间；
- 品牌安全、排除类目和利益冲突要求；
- 初步预算、交付形式、时间和审核人；
- 对使用权、付费放大、排他、披露与合规的要求。

只有用户名、单条热视频或粉丝数时，只能形成候选线索，不能给合作批准。

`uploads/` 保持只读；过程材料写入 `temp/brand-marketing/<run-id>/02-creator-partnership/`，正式交付写入 `outputs/brand-marketing/<run-id>/02-creator-partnership/`。

## 执行流程

### 1. 冻结合作问题

明确：

- 想影响哪个受众和行为；
- Creator 扮演认知、教育、演示、信任还是转化角色；
- 目标平台与地域；
- 必须交付和可选交付；
- 预算和时间边界；
- 哪些条件必须人工或法律/政策责任方批准。

没有明确任务时，不做泛化“达人排名”。

### 2. 核对身份与账号

同名账号、转载账号、机构账号和个人账号必须分开。检查：

- 官方账号链接或稳定定位；
- 名称、简介、头像、链接、历史内容是否一致；
- dossier 中的联系方是否有代表权限；
- 账号是否有明显冒充、长期停更或所有权变化；
- 哪些事实由用户/creator 提供，哪些只是公开观察。

公开作者页面不能证明法律身份、联系方式、商务代表或账号所有权。身份未核实时，只保留候选。

### 3. 明确 TikTok 数据门

只有用户明确给出 `platform=tiktok`、目标站点、公开商品/视频/作者对象和合作用途时，才可调用 `sorftime_mcp`：

- `tiktok_product_video`
- `tiktok_product_video_author`
- `tiktok_author`

`tiktok_author` 若实时 `describe` 不支持目标站点，停止该分支。`sif_mcp` 与 `sellersprite_mcp` 对 creator 身份/作者分支不适用，不为凑三源调用。

调用前：

1. 不知道精确名称时先 `search`；已知时可直接 `describe`。
2. 每个工具首次 `call` 前实时 `describe` 同一精确名称。
3. `arguments` 只按本次 `inputSchema`，明确站点、对象、范围和分页。
4. 禁止点式调用、Gateway、HTTP、SDK、CLI、shell、浏览器或自行注册/启停 MCP。

Sorftime 的 `favorite_keyword`、`change_favorite_keyword`、`del_favorite_keyword`、`shopee_favorite_keyword`、`shopee_change_favorite_keyword`、`shopee_del_favorite_keyword`、`walmart_favorite_keyword`、`walmart_change_favorite_keyword`、`walmart_del_favorite_keyword` 精确禁止。

Sorftime 只提供公开视频/作者观察。结果截断、压缩或分页不足时不能声称样本完整。

### 4. 评估内容匹配

不要只看粉丝数。抽样观察：

- 主要内容主题和稳定风格；
- 讲解、演示、故事或娱乐能力；
- 内容质量和更新稳定性；
- 品牌/产品出现是否自然；
- 受众问题与品牌目标是否相符；
- 过度推广、竞品冲突或安全风险；
- 近期与长期内容是否一致。

一个热视频不能代表常态。样本应覆盖足够时间和不同内容类型，并说明覆盖限制。

### 5. 评估受众证据

区分：

- Creator 自报受众；
- 平台/供应商公开指标；
- 用户提供的一方历史合作结果；
- Agent 对内容主题的推断。

公开粉丝、播放或互动不能证明去重受众、真实购买力、地理分布、品牌增量或未来效果。需要商业决策时，列出应由 creator/代理方提供并人工核验的资料。

### 6. 检查品牌安全

审查与目标活动相关的：

- 价值观和争议内容；
- 竞品、敏感类目或排他冲突；
- 不实功效、违规医疗/法律/财务表述；
- 儿童、伤害、仇恨、歧视或危险行为；
- 虚假互动或异常数据线索；
- 内容版权与第三方素材风险。

公开线索只能触发复核，不能在证据不足时给 creator 定性。

### 7. 检查权利与披露

合作 brief 必须把以下内容交人工/法律或政策责任方确认：

- 内容所有权和品牌使用许可；
- 有机使用、付费投放、剪辑、改编和二次分发；
- 地域、渠道、期限和排他；
- 第三方音乐、素材和肖像权；
- 广告/赞助披露；
- 审核轮次、删除和纠错机制；
- 付款、税务和取消条件。

公开数据不能证明任何 rights、商业报价或披露合规。

### 8. 形成 shortlist

分为：

- **进入人工沟通**：身份、内容匹配和关键风险已有合理材料；
- **待补证**：有潜力但缺身份、受众、权利、报价或品牌安全核验；
- **不建议**：与目标明显不匹配，或存在无法接受的冲突；
- **仅作内容灵感**：可观察，但不适合或无法进入合作。

每个结论说明理由、直接材料、限制和下一步，不使用不透明综合分数替代判断。

### 9. 草拟合作 brief

Brief 包含：

- 活动目标与目标受众；
- Creator 角色和为什么选他/她；
- 单一核心信息与必须准确的产品事实；
- 创意空间、禁区和品牌安全要求；
- 交付物、时间、审核和修改；
- 权利、披露和商业条件待确认项；
- 衡量假设和需要的一方数据；
- 终止或升级条件。

Brief 是谈判与审核起点，不代表已联系或达成协议。

## 失败与降级

- 身份未核：只保留候选线索；
- 只有单条热视频：不判断长期匹配或稳定表现；
- 受众数据仅自报：明确待核，不推断去重或购买力；
- 权利、披露或报价不明：阻塞合作批准；
- 品牌安全线索冲突：并列材料，交人工决定；
- 非 TikTok 或站点不受支持：不调用 Sorftime，使用用户 dossier；
- Sorftime 返回不完整：说明覆盖，不声称完整作者样本。

## 正式交付

使用 `assets/templates/creator-partnership-plan-template.md` 生成：

1. `creator-partnership-plan.md`
2. `creator-shortlist.csv`
3. `creator-evidence-gaps.md`
4. `creator-briefs.md`
5. `creator-public-observation-notes.md`（调用 Sorftime 时）

## 质量门

- 身份、公开账号与商务代表没有混为一体；
- 公开数据未被当成身份、去重受众、权利或效果证明；
- 内容匹配基于多个样本而非单条热视频；
- shortlist 理由透明，不用黑箱分数；
- 品牌安全线索与确定结论分开；
- 权利、披露、报价和付款保留人工门；
- brief 有目标、创意边界、交付、审核和衡量；
- 未联系、签约、付款或发布。

## 资源读取

- 开始筛选前读取 `references/creator-partnership-evidence-contract.md`。
- 写正式交付前读取 `assets/templates/creator-partnership-plan-template.md`。
