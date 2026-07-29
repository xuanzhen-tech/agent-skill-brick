<!--
文件功能：定义商品图片审计的冻结对象、观察能力、双层证据、逐问题字段、优先级和返工验收合同。
职责边界：只规范审计记录，不提供任意评分、平台固定阈值、点击转化预测或图片生成与编辑实现。
重要关联：../SKILL.md；正式报告结构见 ../assets/templates/image-quality-audit-delivery-template.md。
-->

# 图片审计观察与证据合同

## 1. 冻结资产记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `asset_id` | 是 | 业务资产稳定标识 |
| `version_id` | 是 | 生产版本或本次审计快照 ID |
| `source_path` | 是 | 只读输入或可信上游路径 |
| `content_fingerprint` | 可得时 | 文件指纹、artifact 标识或尺寸与修改时间组合 |
| `asset_role` | 是 | main、secondary、lifestyle、infographic、aplus 或其他用户定义角色 |
| `target_slot` | 是 | 当前业务槽位；未知写 `unknown` |
| `market_language` | 是 | 站点、市场和语言 |
| `variant_scope` | 是 | 父体、子体或明确变体 |
| `observation_status` | 是 | observed、partially_observed、metadata_only 或 unavailable |
| `observation_scope` | 是 | 全图、页码、区域、帧或仅元数据 |
| `observed_at` | 是 | 本次观察时间 |
| `rights_status` | 是 | confirmed_for_scope、user_asserted_unverified、permission_required、restricted 或 unknown |

同一 `asset_id` 的不同 `version_id` 是不同审计对象。路径改变、内容改变或上游生成新版本后不得沿用旧观察。

## 2. 观察记录

每项观察先陈述可见事实，再形成问题推断。

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `observation_id` | 是 | 本案例内稳定唯一 |
| `asset_id` | 是 | 对应冻结资产 |
| `version_id` | 是 | 对应冻结版本 |
| `region` | 是 | 全图或可复核区域 |
| `observation` | 是 | 只写可见内容，不夹带效果判断 |
| `observation_status` | 是 | 与当前观察能力一致 |
| `parent_evidence_ids` | 是 | 产品事实、上游需求或输入资产 Evidence IDs |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown`；视觉观察通常为 `not_applicable` |
| `transformation_type` | 是 | 固定为 `inference` |
| `limitations` | 是 | 分辨率、裁切、页码、帧或不可见区域 |

示例结构：写“缩略预览中产品与背景亮度接近，主体轮廓在右侧把手处不连续”，不要直接写“这会导致 CTR 下降”。

## 3. 维度与可评估条件

| 维度 | 最低证据 | 无法满足时 |
|---|---|---|
| `product_identity` | 可观察图片和当前产品事实 | `not_assessed` |
| `factual_claims` | 可观察文字/图标和 Fact IDs | `not_assessed` |
| `asset_role` | 可观察图片和明确资产目的 | `not_assessed` |
| `thumbnail_recognition` | 可观察缩略或可可靠缩放的完整图 | `not_assessed` |
| `hierarchy_readability` | 可观察布局、语言和目标显示情境 | `not_assessed` |
| `scene_plausibility` | 可观察场景和产品使用事实 | `not_assessed` |
| `cross_asset_consistency` | 至少两个冻结资产和身份锚点 | `not_assessed` |
| `source_and_rights` | 来源记录和权利声明 | `rights_unverified` |
| `provided_policy_check` | 用户提供且适用于当前站点/期间的规则 | `policy_check_required` |

不能实际观察图像时，只允许审计路径、版本、格式、元数据、来源和权利记录。

## 4. 问题记录

| 字段 | 必填 | 使用逻辑 |
|---|---|---|
| `issue_id` | 是 | 一行一个独立问题 |
| `asset_id` / `version_id` | 是 | 固定问题对象 |
| `source_path` / `region` | 是 | 让修复者定位 |
| `observation_ids` | 是 | 引用可见事实 |
| `issue_type` | 是 | 使用 SKILL.md 的审计维度 |
| `parent_evidence_ids` | 是 | 引用事实、规则或上游资产要求 |
| `source_type` | 是 | 固定为 `agent` |
| `temporal_scope` | 是 | `current` / `historical` / `future` / `mixed` / `not_applicable` / `unknown` |
| `estimation_status` | 是 | `reported` / `estimated` / `forecast` / `mixed` / `not_applicable` / `unknown`；问题判断通常为 `not_applicable` |
| `transformation_type` | 是 | 固定为 `inference` |
| `impact_mechanism` | 是 | 限定为准确性、识别、理解、信任或生产就绪机制 |
| `affected_scope` | 是 | 单资产、多个资产、变体或发布准备 |
| `preserve` | 是 | 修复时不能破坏的有效内容 |
| `repair_spec` | 是 | 精准改变对象、区域或关系 |
| `acceptance_check` | 是 | 可观察、可复核的完成条件 |
| `priority` | 是 | must_fix、high_value、refinement、needs_evidence 或 not_assessed |
| `status` | 是 | open、handoff_ready、needs_evidence、resolved 或 rejected |
| `limitations` | 是 | 不确定性和判断上限 |

`impact_mechanism` 不得使用 CTR、CVR、排名、销量、下架概率或固定效果百分比。

## 5. 优先级判断

依次判断：

1. 是否造成产品事实、变体身份、使用安全或权利错误；
2. 是否阻止购物者识别产品或理解当前资产的单一任务；
3. 是否破坏跨资产一致性或下游制作；
4. 证据是否足以提出具体修复；
5. 修复是否只影响局部且可独立验收。

没有证据支持“问题存在”时使用 `needs_evidence`，没有观察能力时使用 `not_assessed`。不得通过分数或权重替代这些判断。

## 6. 返工与修订验收

返工 handoff 至少包含：

- 原 `asset_id`、原 `version_id`、Issue IDs 和问题区域；
- 必须保持、允许改变、禁止新增；
- 可使用源资产、权利状态和 Fact IDs；
- 精确修复规格和验收条件；
- 未受影响资产与一致性锚点。

返工完成后：

- 为结果登记新 `version_id`；
- 对每个 Issue ID 标记 resolved、open 或 needs_evidence；
- 检查保留项和跨资产一致性；
- 新问题使用新 Issue ID，不覆盖旧记录；
- 无法观察新版本时不得标记 resolved。
