# 工具调用实例

## 默认商品视频

```json
{
  "modelId": "doubao-seedance-2-0",
  "imagePath": "uploads/product.png",
  "prompt": "Use the supplied product image as the exact identity reference and first frame. Preserve the visible product geometry, proportions, colors, packaging, logo, readable text, quantity, and accessory relationships. Keep the product physically stable. Create one continuous premium commercial shot with a slow clockwise camera orbit of about 15 degrees, clean studio background, soft key light and subtle rim light, realistic grounded shadow, and a short hero-frame hold at the end. Do not add or remove parts, rewrite text, change branding, duplicate or deform the product, create floating motion, flicker, abrupt cuts, or background changes.",
  "aspectRatio": "1:1",
  "duration": 6,
  "resolution": "1080p",
  "generateAudio": false
}
```

首次提交的正常结果是：

```text
status=completed              # 工具调用成功
details.job.status=queued     # 视频任务已受理
details.deliveryReady=false
details.accepted=true
```

这时只能告诉用户视频正在生成，不能报告完成。后续按本地 `jobId` 查询：

```json
{
  "jobId": "video-job-...",
  "waitMs": 30000
}
```

只有状态结果同时满足以下条件才可交付：

```text
status=completed
deliveryReady=true
artifacts[0].kind=video
artifacts[0].mimeType=video/mp4
```

## 取消任务

只有用户明确要求停止时：

```json
{
  "jobId": "video-job-..."
}
```

## 恢复或重试

用户明确同意可能创建新的计费任务后：

```json
{
  "jobId": "video-job-...",
  "confirm": true
}
```

## 查询历史

等待被中断或用户询问历史时：

```json
{
  "jobId": "video-job-..."
}
```

按状态浏览：

```json
{
  "status": "completed",
  "limit": 20
}
```

不要通过再次调用 `ecommerce_video_generate` 查询同一个任务，也不要自行构造或向用户暴露 Gateway taskId。
