# 商品视频提示词手册

## 固定结构

按以下顺序写一个完整段落，不要只堆关键词：

1. **Product identity lock**：说明输入图中的商品是唯一权威主体，保持形状、结构、颜色、材质观感、包装、Logo、可见文字、数量和比例。
2. **Shot**：只选一条镜头主线，写明景别、机位、镜头运动和速度。
3. **Subject motion**：写商品允许发生的轻微运动；静态商品可保持不动，让相机和光线运动。
4. **Scene and light**：写背景、承托面、光线方向、反射和阴影。
5. **Pacing**：写开场、主体展示和结尾定格，保证 4-15 秒内可完成。
6. **Truth constraints**：禁止新增结构、配件、功能、文字、Logo、数量或未提供的卖点。
7. **Failure prevention**：禁止变形、融化、漂浮、穿模、闪烁、跳切、镜头抖动、背景突变和文字重绘。

## 默认模板

```text
Use the supplied product image as the exact identity reference and first frame. Preserve the product's visible geometry, proportions, colors, materials, packaging, logo, readable text, quantity, and accessory relationships. Keep the product physically stable. Create one continuous premium commercial shot: [camera movement] at a slow controlled speed, with [scene] and [lighting]. Use subtle realistic reflections and shadows. Pace the shot with a clean opening, a clear hero view, and a short final hold. Do not add or remove parts, rewrite text, change branding, alter product color, invent functions, duplicate the product, deform edges, melt surfaces, float the object, introduce flicker, use abrupt cuts, or change the background unexpectedly.
```

## 常见意图

- “高级一点”：不要只写 luxury。改成克制的缓慢环绕、柔和轮廓光、真实材质反射、干净背景和结尾定格。
- “突出细节”：使用单次缓慢推近或小幅横移；不要声称展示照片中不可见的内部结构。
- “有使用场景”：只添加与已知商品用途一致的环境，不新增人物操作、配件或性能结果。
- “适合广告”：保证前 1 秒主体清晰、镜头连续、结尾留出可后期排版的稳定画面；不要让模型直接生成营销文案。

## 简单输入扩写示例

用户：`让这个咖啡包装看起来更高级，做 6 秒方形视频。`

扩写重点：包装盒不变；商品静止；镜头从轻微俯视缓慢降到平视并小幅环绕；暖色棚拍轮廓光；桌面反射克制；不新增咖啡豆、杯子、文字或包装变化；结尾停留英雄视角。

