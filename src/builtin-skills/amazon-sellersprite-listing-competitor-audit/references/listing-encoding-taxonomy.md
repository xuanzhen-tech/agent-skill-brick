<!--
文件功能：提供当前 Listing 文本结构的可复核编码分类，并约束竞品表达向自有商品迁移的事实门。
职责边界：只编码实际取得的完整文本，不验证产品事实、关键词需求或业务效果。
重要关联：../SKILL.md、snapshot-diff-and-voc-alignment.md。
-->

# Listing 字段编码分类

## 标题 span 角色

`brand | product_identity | core_function | specification | compatibility | use_case | audience | quantity | differentiator | claim | condition | noise`

每个 span 保留原文、起止位置、角色、产品事实状态、关键词证据和风险。竞品出现某个词不等于自有可用词，也不证明需求或转化。

## Bullet 表达四元组

- `fact`：文本中的可核验属性声明；
- `benefit`：文本声称的用户价值；
- `evidence`：数字、认证、组成或机制等支持形式；
- `condition`：适用/不适用边界、设备、环境或步骤。

一条 Bullet 可含多个四元组。缺失项只说明返回文本的表达结构，不证明产品没有相应事实、利益、证据或条件。

## 买家决策任务

`identify_product | verify_compatibility | compare_spec | understand_benefit | reduce_risk | learn_usage | know_package | establish_trust`

## 可迁移机制

可迁移的是信息顺序、条件前置、规格比较逻辑、场景解释和消除疑虑的结构。不可直接迁移竞品品牌词、专有文案、图片、认证、功效、兼容性和未经自有事实验证的卖点。

编码结果可作为当前快照摘要和 diff 的语义标签，但不规定必须生成多少主题、发现或图表。
