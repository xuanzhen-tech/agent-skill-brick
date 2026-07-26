# AgentTool 调用示例

这些示例只说明参数合同。根据商品事实改写 prompt 和参考图，不要照抄商品描述。

## 生成一张白底主图初稿

```json
{
  "modelId": "gpt-image-2",
  "prompt": "Create a realistic Amazon main product image of the exact insulated travel mug from image 1. Preserve its shape, matte black color, lid, proportions and all visible product details. Center one product on a seamless pure white background, front three-quarter view, soft natural contact shadow, evenly lit, sharp edges. No props, no added text, no added logo, no badge, no border, no watermark.",
  "size": {
    "width": 2048,
    "height": 2048
  },
  "quality": "medium",
  "count": 1,
  "referenceImages": [
    {
      "path": "uploads/product.png",
      "role": "product",
      "preserve": "strict"
    }
  ],
  "output": {
    "format": "png"
  }
}
```

生成调用立即返回 `batchId`，不是图片结果。

## 轮询批次

```json
{
  "action": "status",
  "batchId": "batch-...",
  "waitMs": 30000
}
```

状态为 `completed` 或 `partial` 时读取完成项的 `assetId`、`versionId` 和 artifact path。`failed`、`cancelled`、`interrupted` 需要向用户说明；只有用户明确要求时才调用 `retry`。

## 基于 v1 创建 v2

```json
{
  "modelId": "gpt-image-2",
  "edits": [
    {
      "assetId": "asset-...",
      "versionId": "v1",
      "prompt": "Change only the background to a bright modern kitchen counter. Keep the exact mug shape, matte black color, lid, proportions and visible product details unchanged. Do not add text, logos, accessories or people.",
      "size": {
        "width": 2048,
        "height": 2048
      },
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

- `count` 表示同一模型、同一 prompt 生成多少张独立候选，不是矩阵、拼图或模型分组。
- 不同需求使用不同的 generate 调用。
- `size.width` 和 `size.height` 必须是 16 的倍数，并满足工具 schema 的像素和长宽比限制。
- PNG 不传 `compression`。JPEG/WebP 才可传 0 到 100 的压缩质量。
- 参考图使用 workspace 相对路径，只支持 PNG、JPEG 和 WebP。

