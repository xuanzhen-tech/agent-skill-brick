<!--
文件功能：定义 A+ 内容模块的功能角色、事实映射、视觉资产需求和跨专家交接字段。
职责边界：不提供当前后台模块清单、尺寸、字符限制、资格判断或生图指令实现。
重要关联：由 ../SKILL.md 在模块编排与视觉 brief 前读取；正式结构见 ../assets/templates/aplus-content-brief-template.md。
-->

# A+ 模块与视觉 brief 合同

## 一、模块记录

| 字段 | 含义 |
|---|---|
| `module_id` | 本任务内稳定 ID |
| `functional_role` | hero、功能解释、场景、步骤、对比、品牌故事或 FAQ |
| `communication_task` | 该模块要解决的具体理解问题 |
| `audience_question` | 用户可能提出的问题 |
| `fact_ids` | 支撑文案与视觉的产品事实 |
| `keyword_ids` | 需要自然承载的关键词 |
| `voc_evidence_ids` | 支撑疑虑或主题的 VOC 证据 |
| `copy_draft` | 基于事实的短文案 |
| `asset_ids` | 所需视觉资产 |
| `consistency_anchor_asset_id` | 全套模块共同引用的已确认产品身份锚点 |
| `policy_checks` | 运营方必须在当前后台核验的事项 |
| `status` | `ready_for_brief`、`needs_evidence`、`needs_asset` 或 `blocked` |

功能角色不等于 Amazon 当前后台模块名称。实际映射必须由运营方根据账户和站点核验。

## 二、对比模块

只有满足以下条件才规划对比：

1. 比较对象明确且合法；
2. 比较字段有相同定义、单位和期间；
3. 每个单元格都有事实证据；
4. 缺失值保持缺失，不填成“无”；
5. 不用主观“更好”代替具体差异；
6. 变体和其他产品没有被混写。

不满足时改为单产品功能解释，或将模块标为 `needs_evidence`。

## 三、视觉资产记录

每个资产至少包含：

| 字段 | 含义 |
|---|---|
| `asset_id` | 稳定 ID |
| `module_id` | 服务的模块 |
| `consistency_anchor_asset_id` | 本资产继承的产品身份锚点 |
| `visual_purpose` | 要让读者看懂什么 |
| `required_elements` | 必须出现的产品、动作、环境、细节 |
| `fact_ids` | 画面必须忠实呈现的事实 |
| `prohibited_elements` | 不得添加的部件、徽章、文本、效果或场景 |
| `source_assets` | 用户图片或品牌资产路径 |
| `rights_status` | `confirmed`、`user_asserted` 或 `unknown` |
| `localization_notes` | 文字叠加和目标语言要求 |
| `shared_visual_constraints` | 产品外观、色彩、字体体系、光照方向和背景语言 |
| `acceptance_checks` | 单资产与跨模块的一致性验收 |
| `rework_scope` | 失败时仅需返工的 Module/Asset ID 与冻结项 |
| `owner` | 视觉专家、用户、运营或合规 |

“现代、高级、转化感”不能替代视觉目的和验收条件。

## 四、跨模块一致性与局部返工

1. 锚点必须来自用户确认且权利状态不为 `unknown` 的现有资产；没有锚点时标记 `needs_asset`。
2. 每个模块都显式引用同一 `consistency_anchor_asset_id`，但可以按沟通任务改变构图。
3. 产品形态、颜色、材质、部件、比例、色彩系统、字体体系、光照方向和背景语言逐项验收。
4. 某一模块失败时，只重新制作受影响的 Asset ID，并冻结已通过模块；返工后重新做跨模块一致性检查。
5. 固定模块数、像素、字号、安全区或后台名称属于当前运营核验项，不能从历史候选直接当作平台事实。

## 五、资格与政策状态

- `eligibility_unverified`：没有当前后台或可信资料证明资格；
- `module_mapping_required`：功能角色尚未映射到实际模块；
- `policy_check_required`：尺寸、字符、内容或提交规则待运营核验；
- `ready_for_production`：内容与资产 brief 完整，不代表可上传；
- `ready_for_submission_review`：运营完成政策核验，不代表 Amazon 已批准。

这些状态不得简化为“已具备 A+ 权限”或“已上线”。

## 六、交接方向

- 文案问题交给 Listing 文案开发；
- 图片生成和编辑交给第 04 视觉内容专家；
- 账户资格、模块映射、尺寸和上传交给运营；
- 高风险宣称和资产权利交给相应合规或权利负责人；
- 本 Skill 保留模块 ID、Fact ID 和 Asset ID 作为跨责任方追踪键。
