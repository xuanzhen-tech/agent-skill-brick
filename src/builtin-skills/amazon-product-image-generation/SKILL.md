---
name: amazon-product-image-generation
displayChineseName: 亚马逊商品生图
version: 0.4.0
description: 为亚马逊商品创建白底主图、卖点图、场景图和可迭代版本；适用于用户要求生成、调整、对比或继续编辑 Amazon 商品图片的任务。
requiredTools: [ecommerce_image_generate, ecommerce_image_edit, ecommerce_image_list]
---

# 亚马逊商品生图

## 目标

把商品事实、图片用途和视觉要求整理成稳定提示词，再调用 AgentTool 生成独立图片资产。只使用三个模型可见的 `ecommerce_image_*` 工具，不直接调用 provider，不索要或处理 API key。

## 工作流

1. 确认站点、图片用途、商品名称、真实外观、必须保留内容、禁止变化内容、尺寸、数量和参考图。
2. 若要生成可上架图片但没有真实商品参考图，先说明只能产出概念草稿；不要凭文字承诺商品结构、颜色、包装或 Logo 完全准确。
3. 按任务最小化读取 reference，不要一次加载全部资料：
   - 需要工具 JSON：读取 `references/tool-examples.md`。
   - 需要编写提示词：读取 `references/prompt-playbook.md`。
   - 输入包含商品图、风格图、场景图、人物图或布局参考：读取 `references/reference-analysis.md`。
   - 用户要求多张 Amazon Listing 套图：读取 `references/amazon-listing-set.md`。
   - 要实际生成、编辑或验收图片：读取 `references/production-quality-gate.md`。
   - 准备 Amazon US 图片：读取 `references/amazon-us-guidance.md`。
4. 多张不同职责的图片先规划数量和每张职责。将共享的商品身份、Logo 和品牌约束写入 `basePrompt`，将白底图、场景图、特写图等职责分别写入同一次 generate 的 `requests`。不要擅自补足固定七张。
5. 初稿通常使用 `quality: "medium"`、每个 request 的 `count: 1`。`count` 只用于同一职责的多个候选；不同职责使用不同 request。定稿使用 `quality: "high"`。
6. 调用一次 `ecommerce_image_generate` 提交整套 requests。工具会公平并发并自行完成排队、重试、等待、落盘和验证；不要拆成多个串行 generate，也不要保存 batchId、轮询状态或主动调用取消/重试工具。
7. 只有最终结果为 `deliveryReady=true` 且存在 artifact 时才向用户呈递完成项，并保留每张图的 `assetId`、`versionId` 和 path。部分成功必须明确报告未完成项；只有实际观察到图片时才执行视觉质量判断。
8. 用户要求调整时调用 `ecommerce_image_edit`。明确传入来源 `assetId` 和 `versionId`，只描述要改和必须保持的内容。
9. 需要查历史或从旧版本继续时调用 `ecommerce_image_list`。不要覆盖原图，也不要假造不存在的版本。

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
- 用户中断运行中工具时提醒用户：同步上游请求仍可能继续生成并计费。
- 不执行无上限返工。新增候选、重新生成整套或继续付费编辑前，应遵循用户已经确认的数量和范围。
- 第一阶段不承诺生成可直接上传的 Amazon A+ 精确尺寸文件；相关尺寸与后处理能力另行设计。

## 停止条件

缺少决定商品真实性的关键信息时先追问；用户拒绝提供时只做概念方向。工具返回 failed、interrupted 或没有可交付 artifact 时，返回稳定错误信息，不声称已经生成图片。
