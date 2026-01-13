# Agent skills

A minimal set of skills for high-quality UI and frontend work.

## Install

### Claude Code

Install via plugin marketplace from GitHub:

```
/plugin marketplace add mblode/agent-skills
/plugin install mblode-agent-skills@mblode-agent-skills
```

Restart Claude Code to pick up new skills.

For project scope without plugins, copy `skills/` into `.claude/skills`. For personal scope, copy into `~/.claude/skills`.

### Codex

Use the built-in installer for each skill:

```
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/design-principles
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/frontend-design
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/craft-checklist
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/animation-guidelines
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/frontend-standards
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/fullstack-architecture
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/repository-workflow
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/flawless-typography
```

Restart Codex to pick up new skills.

For manual installation, copy `skills/` into `.codex/skills` (project scope) or `$CODEX_HOME/skills` (or `~/.codex/skills`) for personal scope.

## Skills included

- design-principles
- frontend-design
- craft-checklist
- animation-guidelines
- frontend-standards
- fullstack-architecture
- repository-workflow
- flawless-typography

## Contributing

Edit the files in `skills/`. Keep `SKILL.md` concise and use reference files for detail.
