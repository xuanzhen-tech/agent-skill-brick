# 生态 Skill 离线共享池

## 边界

`agent-skill-brick` 是统一 Skill 目录、离线包、受管安装、索引和 Agent 白名单
语义的 owner。它不实现 Product 页面，也不保存 Product 的角色或专家配置。

共享目录当前包含 79 个 `core` Skill 和 203 个 `ecosystem` Skill。生态内容来自
既有详情服务中已经翻译和加工的正文，内容在发版前固化进仓库；构建、安装和
运行时均不访问详情服务或 GitHub。

## 安装与启用

目录中的 Skill 只是可安装候选。`installCatalogSkill()` 将离线包安装到
`~/.agent-cli/skills`，不会改变任何 Agent 的白名单。只有 canonical name 被传给
`skillNames` 或 `setSkillNames()` 后，该 Skill 才会进入 `find()`、`activate()` 和
`buildPrompt()`。

旧生态 ID 只作为 `legacyEcosystemId` 查找别名。安装记录和后续 Agent 白名单应使用
目录返回的 canonical `name`。

## 分类

平台和业务场景是独立维度。平台包括 Amazon、eBay、Etsy、Shopify、TikTok Shop、
Walmart、WooCommerce、Mercado Libre 和 cross-platform。业务场景使用以下受控值：

- `product-research`
- `listing-content`
- `pricing-profit`
- `advertising-growth`
- `customer-voice`
- `inventory-supply-chain`
- `brand-compliance`
- `store-operations`
- `analytics-automation`
- `cross-platform`

导入脚本优先根据名称、中文展示名、加工描述和来源路径推导分类，不信任旧接口中
已经发现错配的单一 `platformId`。分类规则变化后必须重新运行全量门禁并人工查看
分布，不得在运行时动态分类。

## 维护

只有维护者需要运行：

```sh
npm run import:ecosystem-skills
```

导入完成后必须提交 `ecosystem-skill-catalog.json` 和对应 `SKILL.md`。CI 只消费提交
后的快照，不运行联网导入。正式发布前执行：

```sh
npm run validate:ecosystem-skills
npm run validate:ecosystem-package
npm run release:local
```

第三方来源和授权状态见仓库根目录 `THIRD_PARTY_NOTICES.md`。
