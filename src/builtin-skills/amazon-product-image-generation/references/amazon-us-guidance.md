# Amazon US 图片网页参考

## 使用声明

本文件是 2026-07-26 整理的网页参考，不是 Amazon 合规保证，也不是 AgentTool 的硬校验合同。规则可能按类目、站点和时间变化。正式上架前应由产品经理在当前 Seller Central 帐号和目标类目中确认。

## 主图检查方向

根据 Amazon Seller Central 公开讨论区中的 Amazon 官方账号说明和 Amazon Ads 指南，主图通常应重点检查：

- 展示实际售卖商品，画面清晰、对焦准确、颜色可信。
- 使用纯白背景，常见参考值为 RGB 255/255/255。
- 商品通常应占画面约 85% 或以上。
- 不添加覆盖文字、徽章、边框、水印、额外 Logo 或无关装饰。
- 不展示未随商品销售的配件或可能误导买家的道具。
- 图片至少达到 1000 像素级通常更利于启用缩放，但仍需确认当前类目规则。

上述内容用于提示词和人工检查，不应由 Agent 宣称已经通过 Amazon 审核。

## 附图方向

- 展示不同角度、真实使用场景、尺寸关系和可验证卖点。
- 所有功能、规格、认证、效果和对比数据必须来自用户提供的商品事实。
- 避免生成不可能的使用方式、错误尺度、错误配件或误导性效果。

## 当前来源

- Amazon Seller Central: Product Image Requirements and Best Practices  
  https://sellercentral.amazon.com/seller-forums/discussions/t/13af96ea-6b07-4bf9-8dbe-a13292c2e3b1
- Amazon Seller Central: Quick Tip - Product Images  
  https://sellercentral.amazon.com/seller-forums/discussions/t/99a0dc92-15dc-492a-b24e-f327f4c28dd5
- Amazon Ads: How to Create Your Brand Foundation  
  https://advertising.amazon.com/library/guides/creating-your-brand-foundation-on-amazon

## Skill 设计参考

提示词组织参考了以下公开项目，但没有复制其实现：

- ecommerce-visual-copywriting-skill (MIT)  
  https://github.com/feichanggege/ecommerce-visual-copywriting-skill

工具参数只以当前 AgentTool 公开 schema 为准，不把任何 provider 文档作为 Skill 调用合同。
