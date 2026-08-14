---
name: skill-management
displayChineseName: Skill 使用与管理
version: 0.2.0
description: 指导 Agent 查找、安装、激活、使用、创建、更新、删除和验证 Skill，并理解摘要、完整正文、references、assets 与受管路径的加载机制。适用于用户要求寻找能力、安装或移除 Skill、使用 Skill 资源、沉淀新能力或排查 Skill 可见性时。
requiredTools: [skill_find, skill_activate]
optionalTools: [skill_resource, skill_create, skill_remove]
---

<!--
文件功能：定义 Agent 使用和管理 Skill 的完整生命周期，统一发现、安装、激活、资源访问、创建、更新、删除与验证方式。
职责边界：只通过 AgentSkill 和 AgentTool 的公开合同操作 Skill，不直接修改受管目录、产品选择状态或安装登记。
关联关系：skill_find 负责发现和远端安装，skill_activate 加载完整正文，skill_resource 按需读取资源，skill_create 创建或更新受控包，skill_remove 删除已登记受管 Skill。
-->

# Skill 使用与管理

## 目标

让 Agent 正确理解 Skill 不是始终完整注入的提示词，也不是可随意复制到任意目录的普通文件。先从摘要判断是否匹配，再按任务需要发现、安装、激活和读取资源；只有用户要求沉淀或更新能力时才创建 Skill。

## 运行合同

### 渐进式加载

1. 当前可用 Skill 的 `name` 和 `description` 以摘要形式进入 Agent 上下文。
2. `skill_find` 返回已安装 Skill 的轻量信息和远端候选，不返回完整 `SKILL.md`。
3. 任务确认匹配后，使用 `skill_activate` 加载完整 `SKILL.md`，CLI 会将其提升为 `<loaded_skill>` 上下文。
4. references、workflows、assets 和 templates 不随正文一次性加载；需要时使用 `skill_resource` 按文件读取或复制。
5. 同一 thread 中已经激活的 Skill 由 CLI 按内容 hash 去重和保留，不需要每轮重复激活。

### 受管路径

- AgentSkill 默认托管路径为 `~/.agent-cli/skills`，产品也可以在构造对象时注入自己的 `.agent-cli/skills` 路径。
- 当前注入对象的 `skillsPath` 才是本次运行的唯一事实来源，不能因为知道默认值就假设实际路径。
- 不使用 `run_shell`、`exec_command`、环境变量或手工文件复制直接写受管路径。
- 安装结果中的 `managedRoot`、`path` 或 `managedSkillsPath` 可用于说明真实位置，但不能绕开 AgentSkill 继续写入。

### 工具职责

- `skill_find`：搜索已安装 Skill 和远端目录，或安装用户选定的远端候选。
- `skill_activate`：加载一个已登记 Skill 的完整 `SKILL.md` 和资源清单。
- `skill_resource`：以 `read_reference` 读取文本资料，或以 `copy_asset` 把模板和资产物化到 workspace 受控临时目录。
- `skill_create`：把新定义组装成完整包并委托 `AgentSkill.install()`；它默认不对所有产品开放。
- `skill_remove`：在用户明确要求删除后，把精确 Skill 名称委托给 `AgentSkill.remove()`；它默认不对所有产品开放，也不接受文件路径。

## 工作流

### 第一步：判断是使用、安装还是创建

1. 当前摘要已经存在匹配能力：直接激活，不做远端搜索。
2. 当前没有匹配能力，但可能已有公共 Skill：先用 `skill_find` 搜索，再由用户目标决定是否安装。
3. 没有合适候选，且用户明确要求沉淀可复用能力：设计并调用 `skill_create`。
4. 用户只是要求完成一次任务：优先完成任务，不为了“以后可能有用”擅自创建 Skill。

### 第二步：发现和安装

1. 使用 `skill_find({ action: "search", query })` 同时查看本地结果和远端候选；需要限制来源时再指定 `source`。
2. 根据名称、description、来源和候选标识选择精确对象，不因名称相似就假设内容相同。
3. 用户明确要求安装后，使用 `skill_find({ action: "install", ...候选精确标识 })`。安装 skills.sh 候选传 `package`，SkillHub/ClawHub 候选传 `slug`，受控 GitHub 目录传 `url` 和 `name`。
4. 安装成功不等于当前产品已经可见。检查结果中的 diagnostics，再次搜索；若提示未选择，只报告需要宿主通过公开选择接口启用，不修改产品状态文件。

### 第三步：激活和使用

1. 使用 `skill_activate({ skill: "<精确名称>" })` 加载正文。
2. 遵循正文中的流程、边界、停止条件和资源导航；不得只凭搜索摘要执行复杂任务。
3. 需要具体 reference 时使用 `skill_resource({ action: "read_reference", skill, path })`。
4. 需要模板、图片或其它 asset 时使用 `skill_resource({ action: "copy_asset", skill, path })`；使用工具返回的实际目标路径，不猜路径。
5. scripts 不会因激活自动执行。只有 Skill 明确要求、工具权限允许且当前任务需要时，才通过合适执行工具运行。

### 第四步：创建或更新

1. 先确认新 Skill 的任务边界、触发表达、成功标准和禁止事项。
2. description 必须同时写清“做什么”和“什么时候使用”，因为正文激活前模型只能看到摘要。
3. 正文只保留关键工作流和资源导航；长资料放 references，确定性代码放 scripts，模板和二进制文件放 assets。
4. 首次调用 `skill_create` 使用 `conflict=check`。返回 conflict 时不写盘；只有用户明确授权更新或覆盖后才用 `replace`。
5. 创建后依次使用 `skill_find`、`skill_activate`，并按需用 `skill_resource` 验证真实安装内容。

### 第五步：删除

1. 只有用户明确要求移除某个 Skill 时才使用 `skill_remove`，不能根据“似乎没用”自行清理。
2. 先用当前 Skill 摘要或 `skill_find` 确认精确名称，再传 `confirm=true`；不要提交目录路径或猜测名称。
3. 删除成功只代表当前 AgentSkill 受管目录和当前实例选择已经更新。若产品配置仍显式选择同名预制 Skill，下次启动时可能重新安装，应如实告知用户由产品同步更新白名单。
4. 删除后再次使用 `skill_find` 确认该名称不再出现在当前索引中，不用 shell 检查或修改受管目录。

## 失败与降级

- 找不到 Skill：调整查询词或指定远端来源；不要虚构已安装能力。
- 远端安装失败：保留来源、候选标识和结构化错误，不改用 shell 下载到受管目录。
- 安装成功但不可见：报告选择状态问题，由产品或宿主通过公开接口处理。
- 激活失败：重新核对精确名称和当前索引；不要根据猜测路径读取 `SKILL.md`。
- reference 或 asset 不存在：先查看激活结果中的资源清单，不把相似文件名当成真实资源。
- `skill_create` 不可见：当前产品没有开放创建能力；仍可使用查找、安装、激活和资源工具，不用 shell 替代。
- `skill_remove` 不可见：当前产品没有开放删除能力；说明限制并保留现有 Skill，不用 shell 或 `run_shell` 绕过。

## 质量门

完成 Skill 相关任务前确认：

- 使用的是当前运行时实际可见的工具和 Skill，而不是记忆中的名称；
- 复杂 Skill 已激活完整正文，不只依赖 description；
- reference 和 asset 按需读取，没有一次加载全部资源；
- 安装和创建均经过 AgentSkill，没有直接写受管路径；
- conflict、unchanged、installed 和 replaced 没有混为“创建成功”；
- 没有把密钥、token、密码、用户私有绝对路径或产品内部状态写入 Skill。

## 参考资源

- 查找、安装、激活和资源工具的精确路由：`references/skill-usage-flow.md`。
- 安装路径、选择状态、冲突和生效机制：`references/installation-lifecycle.md`。
- 创建 Skill 时的目录、frontmatter 和渐进加载规范：`references/skill-format.md`。
