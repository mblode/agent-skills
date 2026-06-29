# Agent Skills

[![skills.sh](https://skills.sh/b/mblode/agent-skills)](https://skills.sh/mblode/agent-skills)

24 skills for shipping better software.

## Quickstart

```bash
npx skills add mblode/agent-skills
```

Works with Claude Code, OpenCode, Codex, and Cursor.

## Why these skills exist

Code review catches logic bugs. Nobody checks the loading states, the type scale, or whether half the diff is AI slop. These skills do.

## Skills

### Architecture

- **[define-architecture](./skills/define-architecture/SKILL.md)**: Folder structures, module contracts, and middleware pipelines for TypeScript apps, plus deepening existing codebases.
- **[scaffold-nextjs](./skills/scaffold-nextjs/SKILL.md)**: Scaffolds a Next.js turborepo with Blode UI, Ultracite tooling, GitHub setup, and Vercel deploy.
- **[scaffold-cli](./skills/scaffold-cli/SKILL.md)**: Scaffolds a TypeScript CLI/npm package: ESM, dual tsdown build, vitest, ultracite, changesets, GitHub Actions.
- **[multi-tenant-architecture](./skills/multi-tenant-architecture/SKILL.md)**: Multi-tenant domain strategy, isolation, routing, custom domains, and plan mapping on Cloudflare or Vercel.

### Design

- **[product-design](./skills/product-design/SKILL.md)**: Product and UX judgment: the right interaction, action scope and consequence, reachable-state coverage, resilience, and accessibility as a product concern. Routes by mode (shape, spec, review, action, harden) and defers builds to ui-design, audits to ui-audit, and wording to copywriting.
- **[ui-design](./skills/ui-design/SKILL.md)**: Designs and builds UI end to end: visual direction (palettes, type scales, tokens, CRO, brand kits), Tailwind implementation with the ui.sh design guidelines, multi-variant browser picker, screenshot-to-markup scaffolding, dark-mode and responsive retrofits, and componentization with Tailwind class cleanup.
- **[ui-animation](./skills/ui-animation/SKILL.md)**: Designs, implements, reviews, and reverse-engineers UI motion: springs, gestures, easing, CSS transition recipes, plus extracting easing and spring curves from a screen recording into CSS, Motion, SwiftUI, RN, or UIKit code.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Dark-first slide decks with narrative arcs, speaker notes, investor pitch decks, and a QA pass.

### Writing

- **[copywriting](./skills/copywriting/SKILL.md)**: Short product and marketing copy; persuasion frameworks, seven sweeps, AI-ism removal, before/after diffs, and product-state copy (destructive CTAs, error, empty, and loading strings).
- **[blog-post](./skills/blog-post/SKILL.md)**: Long-form blog posts (listicles, tutorials, narratives, thought leadership) with research, SEO, and polish.
- **[docs-writing](./skills/docs-writing/SKILL.md)**: Technical docs. Diataxis doc types, 52 rules, audit and writing workflows.
- **[readme-creator](./skills/readme-creator/SKILL.md)**: Writes or rewrites a README tailored to the project type, validated against quality checks.

### Quality

- **[ui-audit](./skills/ui-audit/SKILL.md)**: Frontend UX audit for React/Next.js diffs and rendered web surfaces. 95 rules, 12 playbooks, 3-tier ship verdict.
- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit: 23 rules over architecture + trust layers, ship verdict, AX Relationship Summary.
- **[dx-audit](./skills/dx-audit/SKILL.md)**: Developer-experience audit for libraries, CLIs, and SDKs: API ergonomics and contract stability, dev-facing errors, CLI UX, type ergonomics, onboarding and bundle ergonomics, and config, grounded in DX principles.
- **[typography-audit](./skills/typography-audit/SKILL.md)**: 90-rule typography audit: punctuation, fonts, sizing, spacing, OpenType, hierarchy, pairing.
- **[optimise-seo](./skills/optimise-seo/SKILL.md)**: Next.js App Router SEO: sitemaps, metadata, structured data, hreflang, CWV, security headers, and resilience.

### Shipping

- **[planning](./skills/planning/SKILL.md)**: Builds and stress-tests a plan before any code: Create mode interrogates one question at a time; Review mode scores six dimensions to 5/5, verifying claims against local code and docs.
- **[pr-reviewer](./skills/pr-reviewer/SKILL.md)**: Read-only review of your local diff: bugs, structural quality, AI slop, and on-request security audits.
- **[pr-creator](./skills/pr-creator/SKILL.md)**: Creates PRs with short human-sounding descriptions, Linear ID titles, commit restructuring, and reviewer guidance.
- **[pr-babysitter](./skills/pr-babysitter/SKILL.md)**: Autonomously monitors an open PR: conflicts, CI, review comments, merge readiness. Fixes what it can.
- **[autoship](./skills/autoship/SKILL.md)**: End-to-end npm releases with changesets: fix loop, CI watch, Version Packages merge, publish verify.

### Authoring

- **[agents-md](./skills/agents-md/SKILL.md)**: Audits, scores, and refactors AGENTS.md/CLAUDE.md: 10-check triage or 45-check full audit with grades.
- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Skill creation and improvement following the open format spec.

## License

[MIT](LICENSE.md)
