# Skill 使用工具路由

## 已安装与远端发现

`skill_find` 的 `action` 为 `search` 或 `install`。省略 action 时按搜索处理。

搜索示例：

```json
{
  "action": "search",
  "query": "亚马逊评论分析",
  "source": "all",
  "limit": 10
}
```

结果中的 `skills` 是当前已安装且可见的 Skill，`candidates` 是远端候选。搜索结果不包含完整正文；本地命中应继续使用 `skill_activate`。

远端来源包括：

- `openai-curated`：安装时传精确 `name`；
- `skills-sh`：安装时传候选的 `package`；
- `skillhub` 或兼容别名 `clawhub`：安装时传候选 `slug`；
- 受控 GitHub Skill 目录：安装时传 `url` 与目标 `name`。

不要凭空构造 package、slug 或 URL。先搜索并使用结果返回的精确标识。

## 激活正文

```json
{
  "skill": "amazon-review-analysis"
}
```

`skill_activate` 返回 `loadedSkill`，其中包含 name、content、contentHash、bytes 和资源清单。CLI 会把完整 content 提升为 `<loaded_skill>`，普通 Tool Result 只保留摘要。

## 读取 reference

```json
{
  "action": "read_reference",
  "skill": "amazon-review-analysis",
  "path": "references/field-contract.md"
}
```

只读取激活结果中实际登记的 reference 或 workflow。返回的 `loadedSkillReference` 会成为专门上下文，不用 `run_shell` 读取包内文档。

## 使用 asset

```json
{
  "action": "copy_asset",
  "skill": "amazon-review-analysis",
  "path": "assets/report-template.xlsx"
}
```

`copy_asset` 会把文件复制到当前 workspace 的受控临时目录并返回实际路径。不要假设目标文件名，也不要直接操作 Skill 源目录。

## 创建 Skill

`skill_create` 一次创建或更新一个完整 Skill 包。它接收 name、description、instructions 和可选 files；文本 reference/script 使用 `content`，workspace 中已有的二进制 asset 使用相对 `sourcePath`。

创建后固定执行：

```text
skill_create
→ skill_find 确认可见
→ skill_activate 验证正文
→ skill_resource 抽查资源
```

`skill_create` 不直接接收“包含多个 Skill 的 ZIP”。产品批量导入 ZIP 时，应由产品导入服务拆分并逐包调用 AgentSkill 安装合同。

## 删除 Skill

删除使用单独的 `skill_remove`，不复用 `skill_find` 的安装动作，也不通过 shell 操作目录：

```text
skill_find 确认精确名称
→ 用户明确要求删除
→ skill_remove({ skill, confirm: true })
→ skill_find 验证当前索引已移除
```

`skill_remove` 只改变当前 AgentSkill 受管目录、安装登记和当前实例选择。产品白名单仍是产品配置；如果产品继续选中同名预制 Skill，后续启动可能再次安装。
