# 电商生图提示词手册

## 提示词结构

按以下顺序写成一段完整指令：

1. 目标图片类型和用途。
2. 商品真实身份与必须保持的属性。
3. 构图、角度、占比和相机视角。
4. 背景、场景、光线和阴影。
5. 允许变化的内容。
6. 禁止添加或改变的内容。
7. 输出质量要求。

## 保真表达

使用商品参考图时，把可观察事实写清楚：

```text
Use image 1 as the exact product reference.
Preserve the product geometry, color, material appearance, proportions,
packaging text and visible logo. Do not redesign or invent product details.
```

不要只写“保持一致”。列出用户最在意且能从参考图确认的属性。

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
- 多种用途：分别调用 generate，避免一个 prompt 同时要求主图、场景图和卖点图。
- 文字较多：优先生成无文字底图，提醒在确定性排版工具中添加文字。

