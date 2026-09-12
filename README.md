<div align="center">

# Agent Skills

**UI audits, typography, docs, PR review, and releases, loaded on demand by your coding agent**

26 skills for the parts of shipping that code review never covers: the loading states, the type scale, and whether half the diff is AI slop.

<p align="center">
  <a href="https://www.skills.sh/mblode/agent-skills">
    <img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fwww.skills.sh%2Fapi%2Fbadge%2Fmblode%2Fagent-skills&label=installs" />
  </a>
  <a href="https://github.com/mblode/agent-skills/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/mblode/agent-skills?style=flat&colorA=000000&colorB=000000" />
  </a>
</p>

</div>

## Install

```bash
npx skills add mblode/agent-skills -g --agent codex claude-code -y
```

Agents: these skills. Humans: [Taste Training](https://blode.co/taste-training), a course on spotting and fixing AI slop. First unit free.

## Skills

### Architecture

- **[codebase-architecture](./skills/codebase-architecture/SKILL.md)**: Design a structure, deepen an existing one, or harden it with guardrails.
- **[scaffold-nextjs](./skills/scaffold-nextjs/SKILL.md)**: Next.js turborepo with Blode UI, Ultracite, GitHub, and Vercel.
- **[scaffold-cli](./skills/scaffold-cli/SKILL.md)**: TypeScript CLI package: ESM, tsdown, vitest, changesets, CI.
- **[multi-tenant-architecture](./skills/multi-tenant-architecture/SKILL.md)**: Tenant isolation, routing, and custom domains on Cloudflare or Vercel.

### Design


- **[product-design](./skills/product-design/SKILL.md)**: What the interface should do, before anyone builds it.
- **[ui-design](./skills/ui-design/SKILL.md)**: Visual direction, design-system extraction, Tailwind builds, screenshot to markup, dark mode, responsive, and a React and Next.js UX audit with a ship verdict.
- **[ui-verification](./skills/ui-verification/SKILL.md)**: Boots the app in a headless browser and runs nine probes that turn inferred UI defects into measured ones, then proves the fix cleared.
- **[ui-animation](./skills/ui-animation/SKILL.md)**: Springs, gestures, easing, and curves pulled from a screen recording.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Decks with a story spine, speaker notes, and a contrast-checked QA pass, as Marp markdown, a web app, or a handoff to pptx.

### Writing

- **[eli5](./skills/eli5/SKILL.md)**: Session talk in plain language: optional analogy, exact technical terms, and house vocabulary without forced templates.
- **[docs-writing](./skills/docs-writing/SKILL.md)**: Diataxis doc types, 51 rules, audit and writing modes, agent-readable docs.
- **[readme-creator](./skills/readme-creator/SKILL.md)**: Type-aware README from the manifests: one install, a runnable quickstart, badges only where published.

Personal voice, blog posts, and voice evaluation live in [ghostwriter](https://github.com/mblode/ghostwriter).

### Quality

- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit: 27 rules for tool parity, approval gates, and escape hatches, ship verdict.
- **[dx-audit](./skills/dx-audit/SKILL.md)**: Libraries, CLIs, SDKs, npm packages: 38 rules, agent-friendly checks, root-cause findings.
- **[typography-audit](./skills/typography-audit/SKILL.md)**: 78 rules: punctuation, fonts, sizing, spacing, hierarchy, pairing.
- **[seo](./skills/seo/SKILL.md)**: SEO/AEO audits and fixes, search-demand research, writer briefs, and search, AI visibility, and conversion measurement.

### Shipping

- **[planning](./skills/planning/SKILL.md)**: Writes and reviews executable plans with repository evidence, vertical slices, and explicit acceptance criteria.
- **[pr-reviewer](./skills/pr-reviewer/SKILL.md)**: Read-only diff review: bugs, structure, AI slop, security.
- **[tidy](./skills/tidy/SKILL.md)**: Applies diff-scoped simplifications, preserving necessary guards and existing edits.
- **[pr-creator](./skills/pr-creator/SKILL.md)**: PRs with short human descriptions, Linear IDs, templates, drafts, tidied commits.
- **[pr-babysitter](./skills/pr-babysitter/SKILL.md)**: Watches an open PR: conflicts, CI, comments. Fixes what it can.
- **[autoship](./skills/autoship/SKILL.md)**: npm releases with changesets: fix loop, CI watch, Version Packages merge, OIDC publish verify.

### Authoring

- **[chat-history](./skills/chat-history/SKILL.md)**: Recover decisions, previous fixes, and context from past AI conversations with fast local search and source evidence.

- **[agents-md](./skills/agents-md/SKILL.md)**: Wires a repo so Claude Code, Codex and Cursor read the same instructions, then audits and refactors AGENTS.md and CLAUDE.md, with grades.
- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Creates and audits skills by their added value, with portable workflows, a validator, and regression scenarios.
- **[save-md](./skills/save-md/SKILL.md)**: Writes a named source as a markdown file the next turn can reread.

## License

MIT

---

Crafted by [<img src="https://blode.co/avatar-circle.png" width="20" align="top" />](https://blode.co) [Matthew Blode](https://blode.co)
