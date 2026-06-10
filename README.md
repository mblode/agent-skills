# Agent Skills

[![skills.sh](https://skills.sh/b/mblode/agent-skills)](https://skills.sh/mblode/agent-skills)

25 skills for shipping better software.

## Quickstart

```bash
npx skills add mblode/agent-skills -g --all -y
```

Works with Claude Code, OpenCode, Codex, and Cursor.

## Why these skills exist

Code review catches logic bugs. Nobody checks the loading states, the type scale, or whether half the diff is AI slop. These skills do.

## Skills

### Architecture

- **[define-architecture](./skills/define-architecture/SKILL.md)**: Repo structure and module boundaries for TypeScript apps, plus domain-informed deepening of existing codebases.
- **[scaffold-nextjs](./skills/scaffold-nextjs/SKILL.md)**: Next.js turborepo with TypeScript, Tailwind, shadcn/ui, Blode UI, and Vercel.
- **[scaffold-cli](./skills/scaffold-cli/SKILL.md)**: TypeScript CLI with ESM, tsdown, vitest, oxlint, changesets, and GitHub Actions.
- **[multi-tenant-architecture](./skills/multi-tenant-architecture/SKILL.md)**: Multi-tenant domain strategy, isolation, and routing on Cloudflare or Vercel.

### Design

- **[ui-design](./skills/ui-design/SKILL.md)**: Colour palettes, type scales, layout patterns, and landing page CRO strategy for product or marketing UI.
- **[ui-animation](./skills/ui-animation/SKILL.md)**: Springs, gestures, drag, clip-path, easing, CSS transition recipes, and animation review.
- **[reverse-engineer-animation](./skills/reverse-engineer-animation/SKILL.md)**: Extract easing, spring, and choreography from a screen recording and emit CSS, Motion, SwiftUI, RN, or UIKit code.
- **[typography-audit](./skills/typography-audit/SKILL.md)**: 90-rule typography audit — punctuation, fonts, sizing, spacing, OpenType, hierarchy, pairing.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Dark-first slide decks with narrative arcs and speaker notes.

### Writing

- **[copywriting](./skills/copywriting/SKILL.md)**: Product copy. Strips AI patterns, seven auditing sweeps, before/after diffs.
- **[blog-post](./skills/blog-post/SKILL.md)**: Blog posts from source materials or topic briefs.
- **[docs-writing](./skills/docs-writing/SKILL.md)**: Technical docs. Diataxis doc types, 52 rules, audit and writing workflows.
- **[readme-creator](./skills/readme-creator/SKILL.md)**: README files matched to the project type.

### Quality

- **[ui-audit](./skills/ui-audit/SKILL.md)**: Page-level web UI audit — 35 rules across a11y, forms, interaction, layout, perf, motion, and microcopy.
- **[ux-audit](./skills/ux-audit/SKILL.md)**: Feature-level UX audit for React/Next.js. 33 failure modes, diff-aware.
- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit. Architecture rules, trust patterns, AX Relationship Summary.
- **[optimise-seo](./skills/optimise-seo/SKILL.md)**: SEO, redirects, hreflang, structured data, security headers, privacy, and resilience for Next.js.

### Shipping

- **[plan-creator](./skills/plan-creator/SKILL.md)**: Collaborative interrogation that produces a plan. Reads docs and code first, then asks one question at a time with recommended answers.
- **[plan-reviewer](./skills/plan-reviewer/SKILL.md)**: Stress-tests plans. Verifies claims against local code and docs.
- **[pr-reviewer](./skills/pr-reviewer/SKILL.md)**: Catches bugs, structural issues, and AI slop before you push; runs whole-codebase security audits on request.
- **[pr-creator](./skills/pr-creator/SKILL.md)**: Human-sounding PR descriptions. Cleans up noisy commits.
- **[pr-babysitter](./skills/pr-babysitter/SKILL.md)**: Polls for merge conflicts, CI failures, and review comments. Fixes what it can.
- **[autoship](./skills/autoship/SKILL.md)**: npm releases with changesets, compiler fix loops, and CI monitoring.

### Authoring

- **[agents-md](./skills/agents-md/SKILL.md)**: Audits, scores, and refactors AGENTS.md/CLAUDE.md — 10-check triage or 45-check full audit with grades.
- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Skill creation and improvement following the open format spec.

## License

[MIT](LICENSE.md)
