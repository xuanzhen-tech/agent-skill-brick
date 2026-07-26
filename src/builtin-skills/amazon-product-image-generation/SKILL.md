---
name: amazon-product-image-generation
displayChineseName: 亚马逊商品生图
description: 为亚马逊商品创建白底主图、卖点图、场景图和可迭代版本；适用于用户要求生成、调整、对比或继续编辑 Amazon 商品图片的任务。
requiredTools: [ecommerce_image_generate, ecommerce_image_edit, ecommerce_image_batch, ecommerce_image_list]
---

# 亚马逊商品生图

## 目标

把商品事实、图片用途和视觉要求整理成稳定提示词，再调用 AgentTool 生成独立图片资产。只使用四个 `ecommerce_image_*` 工具，不直接调用 provider，不索要或处理 API key。

## 工作流

1. 确认站点、图片用途、商品名称、真实外观、必须保留内容、禁止变化内容、尺寸、数量和参考图。
2. 若要生成可上架图片但没有真实商品参考图，先说明只能产出概念草稿；不要凭文字承诺商品结构、颜色、包装或 Logo 完全准确。
3. 需要工具 JSON 示例时读取 `references/tool-examples.md`；需要编写提示词时读取 `references/prompt-playbook.md`。
4. 初稿通常使用 `quality: "medium"`、`count: 1`。只有用户明确需要多个候选时才增加 `count`，最多 9。定稿使用 `quality: "high"`。
5. 调用 `ecommerce_image_generate` 后保存 `batchId`，再用 `ecommerce_image_batch` 的 `status` 和 `waitMs` 轮询。不要把 `queued` 当成已完成。
6. 向用户呈递完成项，并保留每张图的 `assetId`、`versionId` 和 path。
7. 用户要求调整时调用 `ecommerce_image_edit`。明确传入来源 `assetId` 和 `versionId`，只描述要改和必须保持的内容。
8. 需要查历史或从旧版本继续时调用 `ecommerce_image_list`。不要覆盖原图，也不要假造不存在的版本。

## 图片类型

- 主图：优先真实商品参考图，`role: "product"`、`preserve: "strict"`；纯白背景、单一商品主体、无额外文案或装饰。
- 卖点图：保持商品真实外观，可加入清晰的信息层级；任何数据、认证、配件和功能必须来自用户事实。
- 场景图：展示真实使用环境和尺度关系，不虚构未包含配件、使用效果或安全能力。
- 品牌图：Logo 参考图使用 `role: "logo"`；需要逐字保持时使用 `preserve: "strict"`。

## 质量边界

- 不把 AI 图片称为“平台已审核”“一定合规”或“可直接上架”。
- 不虚构商品功能、材质、认证、规格、文字、包装内容、人体效果或对比结论。
- 商品身份准确性优先于画面创意。关键主体使用严格保真，风格参考通常使用宽松保真。
- 图中文字和 Logo 必须人工复核。模型生成文字不可靠时，生成无文字底图并明确提示后续排版。
- 美国站规则变化快。准备 Amazon US 图片时读取 `references/amazon-us-guidance.md`，将其作为待产品经理确认的网页参考，不作为 SDK 硬校验。
- 取消运行中批次时提醒用户：同步上游请求仍可能继续生成并计费。

## 停止条件

缺少决定商品真实性的关键信息时先追问；用户拒绝提供时只做概念方向。所有批次均失败时返回稳定错误信息，不声称已经生成图片。

