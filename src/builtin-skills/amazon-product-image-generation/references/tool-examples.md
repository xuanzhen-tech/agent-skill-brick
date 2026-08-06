# AgentTool 调用示例

这些示例只说明参数合同。根据商品事实改写 prompt 和参考图，不要照抄商品描述。

## 一次生成白底图和场景图

```json
{
  "modelId": "gpt-image-2",
  "basePrompt": "Use the exact insulated travel mug from image 1. Preserve its shape, matte black color, lid, proportions, logo and all visible product details across every image.",
  "referenceImages": [
    {
      "path": "uploads/product.png",
      "role": "product",
      "preserve": "strict"
    }
  ],
  "requests": [
    {
      "key": "white-background",
      "prompt": "Create a realistic Amazon main product image. Center one product on a seamless pure white background, front three-quarter view, soft natural contact shadow, evenly lit, sharp edges. No props, added text, badge, border or watermark.",
      "size": "1:1",
      "resolution": "2K",
      "quality": "high",
      "count": 1
    },
    {
      "key": "lifestyle",
      "prompt": "Show the product in a bright modern kitchen use scene with realistic scale and natural daylight. Do not add people, accessories or unsupported product features.",
      "size": "4:5",
      "resolution": "2K",
      "quality": "high",
      "count": 1
    }
  ],
  "output": {
    "format": "png"
  }
}
```

生成调用会由工具阻塞到批次终态。只有 `deliveryReady=true` 且存在 artifact 时读取完成项的 `assetId`、`versionId` 和 path。顶层 `failed` 且 `operationStatus=partial` 时只能交付已验证项目，并明确说明其余项目失败；`failed` 或 `interrupted` 时不得自行重放调用。

## 基于 v1 创建 v2

```json
{
  "modelId": "gpt-image-2",
  "edits": [
    {
      "assetId": "asset-...",
      "versionId": "v1",
      "prompt": "Change only the background to a bright modern kitchen counter. Keep the exact mug shape, matte black color, lid, proportions and visible product details unchanged. Do not add text, logos, accessories or people.",
      "size": "1:1",
      "resolution": "2K",
      "quality": "high",
      "additionalReferenceImages": [
        {
          "path": "uploads/kitchen-style.jpg",
          "role": "scene",
          "preserve": "loose"
        }
      ]
    }
  ],
  "output": {
    "format": "png"
  }
}
```

## 查询资产历史

```json
{
  "assetId": "asset-..."
}
```

选择历史版本继续编辑时，必须使用查询结果里真实存在的 `versionId`。

## 参数提醒

- `requests` 表示不同图片职责；每个 request 的 `count` 表示该职责的独立候选，不是矩阵、拼图或模型分组。
- `basePrompt` 和顶层 `referenceImages` 约束整套图片的一致性，场景专属参考图放入对应 request 的 `additionalReferenceImages`。
- 不同职责放在同一次 generate 的不同 requests，不要拆成串行工具调用。
- `size` 使用正整数宽高比字符串，优先原样采用 Product 或用户选择；`1:1`、`4:5`、`16:9`、`9:16` 仅为示例，不是 Skill 维护的固定选项。
- `resolution` 使用 Product 或用户选择的 `1K`、`2K` 或 `4K`，不要根据比例擅自改档。
- 生成和编辑统一使用 `quality: "high"`，不要向用户暴露或询问质量模式。
- PNG 不传 `compression`。JPEG/WebP 才可传 0 到 100 的压缩质量。
- 参考图使用 workspace 相对路径，只支持 PNG、JPEG 和 WebP。
