---
name: ecommerce-product-video-generation
displayChineseName: 商品照片生视频
version: 0.1.0
description: 把一张真实商品照片和简单意图扩写为高质量商品视频提示词，并调用 Seedance 生成可交付 MP4；适用于电商商品展示、广告素材、详情页动态演示和社媒短视频，不处理真人或数字人视频。
requiredTools: [ecommerce_video_generate, ecommerce_video_status, ecommerce_video_cancel, ecommerce_video_retry, ecommerce_video_list]
---

# 商品照片生视频

## 目标

从一张真实商品照片出发，把用户的简单描述转化为可控、可信的商品短视频。只调用 `ecommerce_video_*` 工具，不直接接触 Provider、API key、Provider taskId 或下载地址。

## 工作流

1. 确认输入是当前 workspace 内的一张商品 PNG、JPEG 或 WebP。出现真人、人脸、手部特写或需要数字人表演时，说明首版不支持，并停止调用。
2. 提取用户已给出的用途、平台、画幅、时长、场景、镜头感和音频要求。不要为了 Provider 参数追问用户；缺省使用 6 秒、1080p、`adaptive`、无音频。
3. 先判断商品身份是否足以从照片确认。不得虚构看不见的背面结构、内部功能、材质、认证、规格、配件、文字或使用效果。
4. 需要编写提示词时读取 `references/prompt-playbook.md`；需要工具参数实例时读取 `references/tool-examples.md`；实际交付前读取 `references/production-quality-gate.md`。
5. 一次视频只设计一个清晰镜头主线。优先使用缓慢推近、轻微环绕、平移或克制的场景动效，避免在 4-15 秒内塞入多个跳切、复杂剧情和互相冲突的机位。
6. 提示词必须包含：商品身份锁定、镜头与运动、主体允许的动作、场景与光线、节奏、真实性约束和禁止项。禁止改变 Logo、包装文字、颜色、结构、数量、比例和配件关系。
7. 调用一次 `ecommerce_video_generate`。它会可靠记录本地任务后立即返回；`queued` 只表示已受理，不代表完成。向用户说明任务正在后台生成，并保留返回的本地 `jobId`。
8. 用户主动询问进度时调用 `ecommerce_video_status`。不要在同一轮里连续高频轮询，也不要因为等待较久而再次调用 generate。
9. 只有状态结果 `deliveryReady=true` 且存在 `kind: "video"` artifact 时才能报告完成。失败、中断、排队和运行都不是完成，不假造视频路径。
10. 用户明确要求停止时调用 `ecommerce_video_cancel`。取消结果不确定时明确说明 Provider 仍可能继续执行和计费。
11. `interrupted` 且已有上游任务时，`ecommerce_video_retry` 会续查原任务；其它失败或取消任务的 retry 会新建计费任务，必须先得到用户明确同意并传 `confirm=true`。
12. 用户查看历史任务时调用 `ecommerce_video_list`；它只读取本地状态，不会重新计费。

## 选择原则

- 画幅：沿用用户或 Product 的选择；未指定时使用 `adaptive`。商品详情和方形广告可用 `1:1`，横向展示可用 `16:9`，竖向社媒可用 `9:16`。
- 时长：默认 6 秒。只有需要完整缓慢展示时再增加，不要把时长当作质量档位。
- 分辨率：默认 1080p；快速草稿或用户明确要求低成本时才用 720p。
- 音频：默认关闭。只有用户明确需要环境声或声音素材时开启，不虚构配音、商标口播或合规声明。

## 边界

- 首版只处理商品照片，不处理真人、数字人、人物口播或人脸驱动。
- 不承诺平台审核、广告合规、文字完全准确或商品物理行为绝对真实。
- 不把静态照片里不存在的卖点变成视频事实。
- 不为“更有创意”牺牲商品身份准确性。商品真实性优先于镜头炫技。
- 不自动重试完整生成。续查同一个 Provider 任务不重复计费；创建新任务必须由用户明确确认。
