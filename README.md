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

## CLI

```bash
agent-skill version
agent-skill diagnostics --json
agent-skill roots --json
agent-skill scan --workspace C:\Project --index C:\Project\.agent\agent-skill.index.json
agent-skill install C:\Downloads\my-skill.zip --managed-root C:\Users\you\.agent\skills
agent-skill remove my-skill --managed-root C:\Users\you\.agent\skills
agent-skill manifest --json
```

## Skill Roots

Default precedence, highest first:

```text
<workspace>/skills
<workspace>/.agents/skills
~/.agent/skills
~/.agents/skills
<installed-skill-artifact>/skills
AGENT_SKILL_EXTRA_DIRS
```

Same-name skills from higher-precedence roots override lower-precedence skills.

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

The release flow validates the brick definition, skill index contract, package install/remove behavior, artifact descriptor, placeholder OSS descriptor, and package shape.
