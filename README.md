# Agent Skills

[![skills.sh](https://skills.sh/b/mblode/agent-skills)](https://skills.sh/mblode/agent-skills)

25 skills for shipping better software.

## Quickstart

```bash
npx skills add mblode/agent-skills -g --agent codex claude-code -y
```

Works with Claude Code, OpenCode, Codex, and Cursor.

## Why these skills exist

Code review catches logic bugs. Nobody checks the loading states, the type scale, or whether half the diff is AI slop. These skills do.

## Skills

### Architecture

- **[codebase-architecture](./skills/codebase-architecture/SKILL.md)**: Design a structure, deepen an existing one, or harden it with guardrails.
- **[scaffold-nextjs](./skills/scaffold-nextjs/SKILL.md)**: Next.js turborepo with Blode UI, Ultracite, GitHub, and Vercel.
- **[scaffold-cli](./skills/scaffold-cli/SKILL.md)**: TypeScript CLI package: ESM, tsdown, vitest, changesets, CI.
- **[multi-tenant-architecture](./skills/multi-tenant-architecture/SKILL.md)**: Tenant isolation, routing, and custom domains on Cloudflare or Vercel.

### Design

- **[product-design](./skills/product-design/SKILL.md)**: What the interface should do, before anyone builds it.
- **[ui-design](./skills/ui-design/SKILL.md)**: Visual direction, Tailwind builds, screenshot to markup, dark mode, responsive.
- **[ui-animation](./skills/ui-animation/SKILL.md)**: Springs, gestures, easing, and curves pulled from a screen recording.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Dark-first decks with narrative arcs, speaker notes, and a QA pass.

### Writing

- **[copywriting](./skills/copywriting/SKILL.md)**: Product and marketing copy, persuasion frameworks, brand voice charts, AI-ism removal.
- **[docs-writing](./skills/docs-writing/SKILL.md)**: Diataxis doc types, 48 rules, audit and writing modes.
- **[readme-creator](./skills/readme-creator/SKILL.md)**: Writes or rewrites a README for the project type.

Personal voice training, evaluation, and long-form blog writing now live in the standalone [ghostwriter](https://github.com/mblode/ghostwriter) project, where posts are drafted from the `blog` platform profile.

### Quality

- **[ui-audit](./skills/ui-audit/SKILL.md)**: React and Next.js UX audit: 82 rules, 12 playbooks, ship verdict.
- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit: 23 rules, ship verdict.
- **[dx-audit](./skills/dx-audit/SKILL.md)**: Libraries, CLIs, and SDKs: root-cause findings, agent-friendly checks.
- **[typography-audit](./skills/typography-audit/SKILL.md)**: 78 rules: punctuation, fonts, sizing, spacing, hierarchy, pairing.
- **[optimise-seo](./skills/optimise-seo/SKILL.md)**: Next.js SEO: sitemaps, metadata, structured data, hreflang, CWV.
- **[browser-evidence](./skills/browser-evidence/SKILL.md)**: Throwaway headless browser: screenshots and console errors an unattended agent can cite.

### Shipping

- **[planning](./skills/planning/SKILL.md)**: Builds the plan, then scores it to 5/5 before any code.
- **[pr-reviewer](./skills/pr-reviewer/SKILL.md)**: Read-only diff review: bugs, structure, AI slop, security.
- **[tidy](./skills/tidy/SKILL.md)**: The same sweep across four agents, but it applies the fixes.
- **[pr-creator](./skills/pr-creator/SKILL.md)**: PRs with short human descriptions, Linear IDs, tidied commits.
- **[pr-babysitter](./skills/pr-babysitter/SKILL.md)**: Watches an open PR: conflicts, CI, comments. Fixes what it can.
- **[autoship](./skills/autoship/SKILL.md)**: npm releases with changesets: fix loop, CI watch, publish verify.

### Authoring

- **[agents-md](./skills/agents-md/SKILL.md)**: Audits and refactors AGENTS.md and CLAUDE.md, with grades.
- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Creates and improves skills to the open format spec.

## License

[MIT](LICENSE.md)

---

Crafted by [<img src="https://blode.co/avatar-circle.png" width="20" align="top" />](https://blode.co) [Matthew Blode](https://blode.co)
