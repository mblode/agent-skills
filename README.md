# Design skills

A minimal set of skills for high-quality UI and frontend work.

## Install

### Claude Code

Install via plugin marketplace:

```
/plugin marketplace add mblode/agent-skills
/plugin install mblode-agent-skills@mblode-agent-skills
```

Restart Claude Code to pick up new skills.

For project scope without plugins, copy `skills/` into `.claude/skills`. For personal scope, copy into `~/.claude/skills`.

### Codex

Use the built-in installer for a single skill:

```
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/design-principles
```

For project scope, copy `skills/` into `.codex/skills`. For personal scope, copy into `$CODEX_HOME/skills` (or `~/.codex/skills`). Restart Codex to pick up new skills.

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
