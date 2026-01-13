# Agent skills

A minimal, opinionated set of skills for planning, design, engineering, and UI quality.

## Lifecycle chooser

- Plan (before coding): `plan-feature` for a full implementation plan/spec.
- Architecture setup (project start): `define-architecture` for repo shape, backend patterns, and workflow.
- Visual direction (design phase): `design-ui` for product vs marketing look/feel.
- Implementation (build phase): `implement-frontend` for React/TypeScript/Next standards.
- UI QA (pre‑ship): `audit-ui` for motion, typography, accessibility, and final craft pass.
- Review (pre‑merge): `review-pr` for bug and CLAUDE.md compliance checks.
- Launch/SEO (pre‑launch and audits): `optimise-seo` for metadata, structure, and Core Web Vitals.

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
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/plan-feature
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/define-architecture
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/design-ui
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/implement-frontend
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/audit-ui
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/review-pr
$skill-installer https://github.com/mblode/agent-skills/tree/main/skills/optimise-seo
```

Restart Codex to pick up new skills.

For manual installation, copy `skills/` into `.codex/skills` (project scope) or `$CODEX_HOME/skills` (or `~/.codex/skills`) for personal scope.

## Skills included

- plan-feature
- define-architecture
- design-ui
- implement-frontend
- audit-ui
- review-pr
- optimise-seo

## Contributing

Edit the files in `skills/`. Keep `SKILL.md` concise and use reference files for detail.
