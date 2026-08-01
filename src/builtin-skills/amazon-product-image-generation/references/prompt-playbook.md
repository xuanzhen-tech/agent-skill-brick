# 电商生图提示词手册

## 提示词结构

按以下顺序写成一段完整指令：

1. 目标图片类型和用途。
2. 商品身份锁与必须保持的属性。
3. 风格契约中要迁移的视觉维度。
4. 构图、角度、占比和相机视角。
5. 商品与人物、手或场景的合理关系。
6. 背景、场景、光线和阴影。
7. 允许变化的内容。
8. 禁止添加或改变的内容。
9. 输出质量要求。

## 商品身份锁

先从商品参考图和用户事实中建立简短身份锁：

```text
Product identity lock:
- geometry and proportions: [...]
- colors and material appearance: [...]
- fixed structural details: [...]
- packaging and included items: [...]
- visible logo/text locations: [...]
```

只记录能观察或由用户确认的事实。看不清的标签、材质、包装内容或功能不得猜测。

## 风格契约

风格参考不能只总结成“高级”“白底”或“电影感”。至少明确：

```text
Style contract:
- keep: camera attitude, lighting behavior, negative space, visual density
- adapt: palette, scene and typography for the actual product
- reject: source brand, source product, people, price, claims and exact copy
- loss risk: what would make the result become a generic marketplace image
```

将风格图作为 `role: "style"`、通常使用 `preserve: "loose"`。布局参考使用 `role: "layout"`，只迁移阅读顺序和空间关系，不复刻品牌内容。

## 使用合理性

有人物、手或使用场景时，补充真实交互约束：

- 商品通常如何握持、穿戴、打开、摆放或操作。
- 哪些部件必须和手、身体、地面或环境保持正确关系。
- 哪些参考姿势只迁移情绪和镜头感，不能照搬动作。
- 哪些结果会造成不可能、不安全或误导性的使用方式。

同一人物跨多张图出现时，记录年龄范围、发型、肤色、体型和造型基调作为人物身份锁；姿势和裁剪可以按图片职责变化。

## 保真表达

使用商品参考图时，把可观察事实写清楚：

```text
Use image 1 as the exact product reference.
Preserve the product geometry, color, material appearance, proportions,
packaging text and visible logo. Do not redesign or invent product details.
```

不要只写“保持一致”。列出用户最在意且能从参考图确认的属性。

参考图上传顺序必须和提示词编号一致。生成时第一张参考图是图片 1；编辑时待编辑版本是图片 1，额外参考图从图片 2 开始。

## 主图模板

```text
Create a realistic Amazon main product image of [product] using image 1 as
the exact product reference. Preserve [identity attributes]. Show one product,
centered, [view], occupying most of a square frame, on a seamless pure white
background with a subtle natural contact shadow. Professional studio lighting,
accurate color and crisp edges. No props, no extra accessories, no added text,
no added logo, no badge, no border, no watermark, no collage.
```

## 场景图模板

```text
Create a realistic lifestyle image of the exact [product] from image 1 in
[scene]. Preserve [identity attributes]. Show a plausible use case and natural
scale. Use [lighting/mood] while keeping the product clear and unobstructed.
Do not invent accessories, claims, features, text or people unless explicitly
provided.
```

## 编辑模板

```text
Change only [requested change]. Keep [identity attributes] unchanged.
Do not alter [protected details]. Do not add [forbidden elements].
```

编辑提示词不要重新描述一个完全不同的画面。改动范围越小，越要明确“只改什么”和“哪些不能改”。

## 出图策略

- 信息不足：先生成 1 张 medium 概念稿。
- 方向已确定：生成 2 到 4 张同需求候选。
- 用户选中方向：以明确版本编辑，并切换 high。
- 多种用途：在一次 generate 中创建多个 request，避免一个 prompt 同时要求主图、场景图和卖点图。
- 文字较多：优先生成无文字底图，提醒在确定性排版工具中添加文字。
- 同一职责的多个视觉候选：使用一个 prompt 配合 `count`。
- 不同职责的套图：每个职责使用独立 request prompt，由工具在一个批次内公平并发。

## 声明安全

将准备写入画面或提示词的卖点分成四类：

- 可观察：参考图能直接支持的形状、颜色、结构和包装事实。
- 用户确认：用户提供的规格、配件、功能、认证或性能数据。
- 类别用途：只可使用保守措辞描述常见使用场景。
- 不支持：价格、认证、医疗效果、性能指标、兼容性和比较结论等未提供事实。

只使用前两类具体事实。类别用途不得改写成性能承诺；不支持声明必须删除或追问。
