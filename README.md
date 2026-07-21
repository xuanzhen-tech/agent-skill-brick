# Agent Skill Brick

`agent-skill` 是独立的 skill 注册管理和 `skills-index` 积木。它负责管理托管 skill 目录、校验 skill 包、安装或删除托管 skill，并生成可被外部编排器或工具层消费的索引。

## 能力边界

本积木负责：

- 扫描唯一托管目录 `~/.agent-cli/skills`
- 校验 skill 包结构
- 生成 `agent-skill.index.v1` 索引
- 支持本地目录、zip、HTTP zip、registry json 和受控 inline 安装来源
- 删除托管目录中的 skill
- 为远端目录安装维护来源、revision 和内容摘要记录
- 在替换技能前提供显式冲突检查与可回滚的目录切换
- 随 SDK 和 runtime artifact 发布预制 skill，并按产品传入的名称数组受控安装
- 枚举 skill 包内的 `references/` 与 `assets/`，并提供受控 reference 读取和 asset 解析
- 打包 `skills-index` artifact

本积木不负责：

- 调用模型 provider
- 执行 shell、浏览器、Python 或 web 工具
- 向 workspace 复制 asset 或决定 asset 的目标路径
- 编排 chat loop
- 存储 thread 或持久化 loaded skill 上下文
- 桌面 UI、安装器、更新器或产品 release manifest 组合

## Host 入口

`agent-skill` 提供命令入口，供 host launcher、release workflow 和本地 smoke 测试扫描托管目录、写入索引并管理已安装 skills。它不是面向最终用户的产品 CLI；产品侧 CLI 应由编排积木提供。

```bash
agent-skill version
agent-skill diagnostics --json
agent-skill roots --json
agent-skill scan --skills-path C:\Users\you\.agent-cli\skills
agent-skill install C:\Downloads\my-skill.zip --skills-path C:\Users\you\.agent-cli\skills
agent-skill remove my-skill --skills-path C:\Users\you\.agent-cli\skills
agent-skill manifest --json
```

## SDK 对象用法

产品仓库组合 brick 时应优先使用对象 API。产品只需要传要启用的 skill 名称数组；
预制包的安装、索引和 prompt 摘要预算都由积木内部处理。命令入口继续保留给
release smoke 和 host 侧索引生成。

```js
import { AgentSkill } from "@xuanzhen-tech/agent-skill-brick";

const agentSkill = new AgentSkill([
  "amazon-sku-profit-summary",
  "amazon-inventory-ledger-summary"
]);

await agentSkill.refresh();
const promptSection = await agentSkill.buildPrompt();
console.log(agentSkill.definitions); // 只包含上述两个被选择的 skill
```

也可以使用对象形式；`skillsPath` 是测试或 host 隔离时才需要的可选路径覆盖，
不是产品必须理解的运行时细节：

```js
const agentSkill = new AgentSkill({
  skills: ["amazon-operating-analysis"],
  skillsPath: "C:\\Users\\you\\.agent-cli\\skills"
});
```

预制 skill 实际被安装到唯一的 `skillsPath` 后才会进入索引。它们不会被当作
第二个扫描根，也不会在未选择时出现在 `definitions`、`buildPrompt()`、
`find()` 或 `activate()` 中。切换产品配置时可以复用同一对象：

```js
await agentSkill.setSkillNames([
  "amazon-operating-analysis"
]);
```

`remove(name)` 会同时从当前对象的白名单移除该名称，避免本次运行中被预制
catalog 立刻装回。产品若持久化了选择数组，也应同步移除该名称；否则下次重新
创建对象且再次传入该名称时，它会按配置重新准备。

`new AgentSkill()` 保持旧行为：显示默认 `~/.agent-cli/skills` 中全部已安装
skill，且不会自动安装预制内容。传入单个目录字符串或仅传 `skillsPath` 时也
保持相同语义；新产品只有需要按需启用预制 skill 时才应使用名称数组。

可通过 `builtinSkills` 或 `listBuiltinSkills()` 查询当前 SDK 可选择的预制名称：

```js
import { listBuiltinSkills } from "@xuanzhen-tech/agent-skill-brick";

console.log(listBuiltinSkills());
```

远端搜索和安装能力仍保留：

```js
// search 会同时返回本地已安装 skills 和远端候选，不会返回完整 SKILL.md。
const found = await agentSkill.find({ query: "github", source: "all", limit: 8 });
console.log(found.skills);      // 已安装且已被选择的本地 skills
console.log(found.candidates);  // skills.sh / SkillHub / OpenAI curated 等远端候选

// 安装远端候选后，需要由产品把该名称加入技能白名单，随后才能 activate。
await agentSkill.find({
  action: "install",
  source: "skillhub",
  slug: "owner-repo-github"
});
await agentSkill.setSkillNames(["github"]);
const activated = await agentSkill.activate("github");
```

产品主路径只需要 skill 名称数组。扫描、索引缓存、prompt 摘要预算、预制包安装
和冲突保护都由积木内部默认策略管理。`AgentSkill` 自身只管理一个 skills 目录，
不从产品仓库接收多 root 或索引路径配置。

`buildPrompt()` 只返回可用 skills 的简短摘要，不会自动注入完整 `SKILL.md`。完整说明只能通过 `activate()` 返回 `loadedSkill` payload，由外部编排器决定如何持久化、去重和 compact。

## Skill 资源合同

`references/` 与 `assets/` 是 skill 包的正式内容，但它们不等同于任意工作区文件：

- `activate(name)` 只读取 `SKILL.md`，并在 `loadedSkill.resources` 返回轻量清单，不会自动读取 reference 全文或复制 asset。
- `listResources(name)` 返回可安全访问的 `reference` / `asset` 路径和大小。
- `readReference(name, "references/...")` 只读取 UTF-8 文本，返回 `loadedSkillReference` payload。
- `resolveAsset(name, "assets/...")` 只返回已经校验的源文件描述和内容 hash，不写 workspace。
- `scripts/` 永远不会被这些接口读取或执行。

产品和编排器不应自行拼接 skill 内部绝对路径。模型侧通过注入的 `AgentTool.skill_resource`
访问资源：reference 会被编排器保存为专门上下文，asset 则由工具层复制到固定的
`workspace/temp/skill-assets/` 目录。

`find({ query })` 的返回值中，`skills` 表示已经安装在 `~/.agent-cli/skills` 下并进入索引的 skill；`candidates` 表示远端可安装候选。`skill_find` 搜索阶段不会把远端 skill 当成已激活上下文，也不会读取候选的完整 `SKILL.md`。

## 受控安装来源与更新

生态目录等上游可以把已规范化的安装来源交给 `AgentSkill`，但产品层不应自行
创建或写入 `SKILL.md`。`AgentSkill` 是唯一的磁盘写入方：

```js
import { AgentEcosystem } from "@xuanzhen-tech/agent-ecosystem-brick";

const ecosystem = new AgentEcosystem();
const source = await ecosystem.resolveInstall("sample-skill");
const result = await agentSkill.install(source, { conflict: "check" });

if (result.status === "conflict") {
  // 产品在获得用户确认后才允许替换。
  await agentSkill.install(source, { conflict: "replace" });
}

const installations = await agentSkill.listInstallations();
```

受控来源的格式为 `agent-skill.inline.v1`。安装时会先在暂存目录写入和校验，
再原子切换目标目录；安装记录只写在唯一技能根目录中的：

```text
~/.agent-cli/skills/.agent-skill-installations.json
```

相同远端来源且 revision 未变化时，`conflict: "check"` 返回 `unchanged`；内容
变化时返回 `conflict`，不会写盘。只有 `conflict: "replace"` 才会替换已有受管
技能。既有字符串路径、zip 和 HTTP zip 的安装语义保持不变。

## Skill 路径

默认且唯一的生产扫描路径是：

```text
~/.agent-cli/skills
```

对应 Windows 示例：

```text
C:\Users\you\.agent-cli\skills
```

历史项目级、workspace 级、artifact 内置或额外环境变量目录都不再作为扫描来源。这样可以避免产品仓库自行扩展路径后出现优先级分叉。

测试或 host 隔离场景可以通过构造函数字符串路径、`--skills-path` 或 `AGENT_SKILL_SKILLS_PATH` 指向临时目录；这只是替换唯一托管目录的位置，不会恢复多 root 扫描。

## Skill 包结构

允许的结构：

```text
<skill>/
  SKILL.md
  references/
  scripts/
  assets/
```

`SKILL.md` 必须包含 frontmatter，至少声明 `name` 和 `description`。

## Index 合同

`agent-skill scan` 写入：

```text
agent-skill.index.v1
```

对象化集成时，`AgentTool` 直接注入 `AgentSkill` 对象；文件索引主要用于 host、release smoke 或兼容流程。

## 本地验证

```bash
npm install
npm run release:local
```

`release:local` 会验证积木定义、命令入口、skill index 合同、安装和删除行为、artifact descriptor、placeholder OSS descriptor 以及 npm package 形状。
