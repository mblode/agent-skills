<div align="center">

# Agent Skills

**UI audits, typography, docs, PR review, and releases, loaded on demand by your coding agent**

24 skills for the parts of shipping that code review never covers: the loading states, the type scale, and whether half the diff is AI slop.

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
npx skills add mblode/agent-skills
```

The bundle is listed at [skills.sh](https://www.skills.sh/mblode/agent-skills).

Agents: these skills. Humans: [Taste Training](https://blode.co/taste-training), a course on spotting and fixing AI slop. First unit free.

## Skills

### Architecture

- **[codebase-architecture](./skills/codebase-architecture/SKILL.md)**: Design a structure, deepen an existing one, or harden it with guardrails.
- **[scaffold-nextjs](./skills/scaffold-nextjs/SKILL.md)**: Next.js turborepo with Blode UI, Ultracite, GitHub, and Vercel.
- **[scaffold-cli](./skills/scaffold-cli/SKILL.md)**: TypeScript CLI package: ESM, tsdown, vitest, changesets, CI.
- **[multi-tenant-architecture](./skills/multi-tenant-architecture/SKILL.md)**: Tenant isolation, routing, and custom domains on Cloudflare or Vercel.

### Design

- **[product-design](./skills/product-design/SKILL.md)**: What the interface should do, before anyone builds it.
- **[ui-design](./skills/ui-design/SKILL.md)**: Visual direction, Tailwind builds, screenshot to markup, dark mode, responsive, and a React and Next.js UX audit with a ship verdict.
- **[ui-animation](./skills/ui-animation/SKILL.md)**: Springs, gestures, easing, and curves pulled from a screen recording.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Decks with a story spine, speaker notes, and a QA pass, as markdown or a web app.

### Writing

- **[copywriting](./skills/copywriting/SKILL.md)**: Product and marketing copy, persuasion frameworks, brand voice charts, AI-ism removal.
- **[docs-writing](./skills/docs-writing/SKILL.md)**: Diataxis doc types, 48 rules, audit and writing modes.
- **[readme-creator](./skills/readme-creator/SKILL.md)**: Writes or rewrites a README as a public-facing shop window.

Personal voice, blog posts, and voice evaluation live in [ghostwriter](https://github.com/mblode/ghostwriter).

### Quality

- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit: 23 rules, ship verdict.
- **[dx-audit](./skills/dx-audit/SKILL.md)**: Libraries, CLIs, and SDKs: root-cause findings, agent-friendly checks.
- **[typography-audit](./skills/typography-audit/SKILL.md)**: 78 rules: punctuation, fonts, sizing, spacing, hierarchy, pairing.
- **[optimise-seo](./skills/optimise-seo/SKILL.md)**: Next.js SEO: sitemaps, metadata, structured data, hreflang, CWV.

### Shipping

- **[planning](./skills/planning/SKILL.md)**: Builds the plan, then scores it to 5/5 before any code.
- **[pr-reviewer](./skills/pr-reviewer/SKILL.md)**: Read-only diff review: bugs, structure, AI slop, security.
- **[tidy](./skills/tidy/SKILL.md)**: Hunts complexity across five angles and applies the simplifications.
- **[pr-creator](./skills/pr-creator/SKILL.md)**: PRs with short human descriptions, Linear IDs, tidied commits.
- **[pr-babysitter](./skills/pr-babysitter/SKILL.md)**: Watches an open PR: conflicts, CI, comments. Fixes what it can.
- **[autoship](./skills/autoship/SKILL.md)**: npm releases with changesets: fix loop, CI watch, publish verify.

### Authoring

- **[agents-md](./skills/agents-md/SKILL.md)**: Sets a repo up for Claude Code, Codex and Cursor, then audits and refactors AGENTS.md and CLAUDE.md, with grades.
- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Creates and improves skills to the open format spec.
- **[save-md](./skills/save-md/SKILL.md)**: Writes a named source as a markdown file the next turn can reread.

## License

MIT

---

Crafted by [<img src="https://blode.co/avatar-circle.png" width="20" align="top" />](https://blode.co) [Matthew Blode](https://blode.co)
