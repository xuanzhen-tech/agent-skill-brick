# Agent Skill Brick

`agent-skill` is a standalone skill registry and skills-index brick. It manages where skills are discovered from, validates skill packages, installs managed skills, and generates an index file that tool/orchestrator runtimes can consume.

## Boundary

This brick owns:

- skill root resolution and precedence
- skill package validation
- skills-index generation
- local directory, zip, URL, and registry-index install inputs
- managed skill removal
- skills-index artifact packaging

This brick does not own:

- model provider calls
- shell, browser, Python, or web tool execution
- chat loop orchestration
- thread storage or loaded-skill persistence
- desktop UI, installer, updater, or release manifest composition

## Host Entrypoint

`agent-skill` includes a command entrypoint so host launchers, release workflows,
and local smoke tests can scan roots, write an index, and manage installed
skills. It is not a user-facing product CLI; the product-facing CLI is expected
to be provided by the orchestrator brick.

```bash
agent-skill version
agent-skill diagnostics --json
agent-skill roots --json
agent-skill scan --workspace C:\Project --index C:\Project\.agent\agent-skill.index.json
agent-skill install C:\Downloads\my-skill.zip --managed-root C:\Users\you\.agent-cli\skills
agent-skill remove my-skill --managed-root C:\Users\you\.agent-cli\skills
agent-skill manifest --json
```

## SDK Object Usage

Product repositories should prefer the object API when composing bricks in
process. The command entrypoint remains available for release smoke tests and
host-managed index generation.

```js
import { AgentSkill } from "@xuanzhen-tech/agent-skill-brick";

const agentSkill = new AgentSkill({
  env: process.env,
  workspace,
  managedRoot: "C:\\Users\\you\\.agent-cli\\skills"
});

await agentSkill.refresh();
const promptSection = await agentSkill.buildPrompt();
const found = await agentSkill.find({ query: "github" });
const activated = await agentSkill.activate("github");
```

`buildPrompt()` only returns a concise available-skills summary. It does not
inject full `SKILL.md` content automatically. Full instructions are returned by
`activate()` as a `loadedSkill` payload so the orchestrator can decide how to
persist, deduplicate, and compact loaded skill context.

## Skill Roots

Default precedence, highest first:

```text
<workspace>/skills
<workspace>/.agents/skills
~/.agent-cli/skills
<installed-skill-artifact>/skills
AGENT_SKILL_EXTRA_DIRS
```

Same-name skills from higher-precedence roots override lower-precedence skills.

`~/.agent-cli/skills` is the default managed root. Older or product-specific
skill directories can still be included explicitly through
`AGENT_SKILL_EXTRA_DIRS`.

## Skill Package

Allowed structure:

```text
<skill>/
  SKILL.md
  references/
  scripts/
  assets/
```

`SKILL.md` must include frontmatter with `name` and `description`.

## Index Contract

`agent-skill scan` writes:

```text
agent-skill.index.v1
```

The generated index is intended to be injected into `agent-tool` through:

```text
AGENT_TOOL_SKILL_INDEX=<path>/agent-skill.index.json
```

## Local Verification

```bash
npm install
npm run release:local
```

The release flow validates the brick definition, command entrypoint, skill index contract, package install/remove behavior, artifact descriptor, placeholder OSS descriptor, and package shape.
