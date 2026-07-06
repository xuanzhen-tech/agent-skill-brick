# Agent Skill Brick

`agent-skill` 是独立的 skill 注册管理和 `skills-index` 积木。它负责管理托管 skill 目录、校验 skill 包、安装或删除托管 skill，并生成可被外部编排器或工具层消费的索引。

## 能力边界

本积木负责：

- 扫描唯一托管目录 `~/.agent-cli/skills`
- 校验 skill 包结构
- 生成 `agent-skill.index.v1` 索引
- 支持本地目录、zip、HTTP zip 和 registry json 安装来源
- 删除托管目录中的 skill
- 打包 `skills-index` artifact

本积木不负责：

- 调用模型 provider
- 执行 shell、浏览器、Python 或 web 工具
- 编排 chat loop
- 存储 thread 或持久化 loaded skill 上下文
- 桌面 UI、安装器、更新器或产品 release manifest 组合

## Host 入口

`agent-skill` 提供命令入口，供 host launcher、release workflow 和本地 smoke 测试扫描托管目录、写入索引并管理已安装 skills。它不是面向最终用户的产品 CLI；产品侧 CLI 应由编排积木提供。

```bash
agent-skill version
agent-skill diagnostics --json
agent-skill roots --json
agent-skill scan --workspace C:\Project --index C:\Project\.agent\agent-skill.index.json
agent-skill install C:\Downloads\my-skill.zip --managed-root C:\Users\you\.agent-cli\skills
agent-skill remove my-skill --managed-root C:\Users\you\.agent-cli\skills
agent-skill manifest --json
```

## SDK 对象用法

产品仓库组合 brick 时应优先使用对象 API。命令入口继续保留给 release smoke 和 host 侧索引生成。

```js
import { AgentSkill } from "@xuanzhen-tech/agent-skill-brick";

const agentSkill = new AgentSkill();

await agentSkill.refresh();
const promptSection = await agentSkill.buildPrompt();
const found = await agentSkill.find({ query: "github" });
const activated = await agentSkill.activate("github");
```

产品主路径不需要传 `env`、`workspace`、`indexPath`、`promptSkillLimit` 或 `promptBytes`。这些属于内部默认策略或测试/host 隔离场景。`AgentCli` 会在调用 `buildPrompt()`、`find()`、`activate()` 时把当前 workspace 放入 context；`AgentSkill` 自身只管理托管 skill 目录。

`buildPrompt()` 只返回可用 skills 的简短摘要，不会自动注入完整 `SKILL.md`。完整说明只能通过 `activate()` 返回 `loadedSkill` payload，由外部编排器决定如何持久化、去重和 compact。

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

测试或 host 隔离场景可以通过 `managedRoot` 或 `AGENT_SKILL_MANAGED_ROOT` 指向临时目录；这只是替换托管根目录的位置，不会恢复多 root 扫描。

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
