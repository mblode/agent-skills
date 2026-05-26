[![skills.sh](https://skills.sh/b/mblode/agent-skills)](https://skills.sh/mblode/agent-skills)

# Agent Skills

24 skills for shipping better software.

## Quickstart

```bash
npx skills add mblode/agent-skills -g --all -y
```

Works with Claude Code, OpenCode, Codex, and Cursor.

## Why these skills exist

**The "looks fine" deploy.** Tests pass, PR approved, then a user on mobile hits a layout break, a blank loading state, and an empty state that says "No data." [`ui-audit`](./skills/ui-audit/SKILL.md) and [`ux-audit`](./skills/ux-audit/SKILL.md) catch what reviewers miss.

**The AI-slop PR.** The agent wrote 400 lines overnight. It compiles. Buried in the diff: redundant state, copy that reads like a prompt, a commit message that says "Update various files." [`pr-reviewer`](./skills/pr-reviewer/SKILL.md) catches it before you push. [`pr-creator`](./skills/pr-creator/SKILL.md) cleans up the PR.

**The unreviewed plan.** Three days building a feature, then you find the API doesn't paginate. [`plan-reviewer`](./skills/plan-reviewer/SKILL.md) questions your plan and checks claims against local code.

**The "good enough" typography.** `font-family: Inter, sans-serif` with no size scale, no OpenType, straight quotes in the marketing copy. [`typography-audit`](./skills/typography-audit/SKILL.md) and [`ui-design`](./skills/ui-design/SKILL.md) fix this from the start.

## Skills

### Architecture

- **[define-architecture](./skills/define-architecture/SKILL.md)**: Repo structure and module boundaries for TypeScript apps.
- **[scaffold-nextjs](./skills/scaffold-nextjs/SKILL.md)**: Next.js turborepo with TypeScript, Tailwind, shadcn/ui, Blode UI, and Vercel.
- **[scaffold-cli](./skills/scaffold-cli/SKILL.md)**: TypeScript CLI with ESM, tsdown, vitest, oxlint, changesets, and GitHub Actions.
- **[multi-tenant-architecture](./skills/multi-tenant-architecture/SKILL.md)**: Multi-tenant domain strategy, isolation, and routing on Cloudflare or Vercel.

### Design

- **[ui-design](./skills/ui-design/SKILL.md)**: Colour palettes, type scales, and layout patterns for product or marketing UI.
- **[ui-animation](./skills/ui-animation/SKILL.md)**: Springs, gestures, drag, clip-path, easing, and animation review.
- **[typography-audit](./skills/typography-audit/SKILL.md)**: Font selection, sizing, spacing, OpenType, hierarchy, and pairing.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Dark-first slide decks with narrative arcs and speaker notes.

### Writing

- **[copywriting](./skills/copywriting/SKILL.md)**: Product copy. Strips AI patterns, seven auditing sweeps, before/after diffs.
- **[blog-post](./skills/blog-post/SKILL.md)**: Blog posts from source materials or topic briefs.
- **[docs-writing](./skills/docs-writing/SKILL.md)**: Technical docs. Diataxis, Stripe-style clarity, 52 rules.
- **[readme-creator](./skills/readme-creator/SKILL.md)**: README files matched to the project type.

### Quality

- **[ui-audit](./skills/ui-audit/SKILL.md)**: Accessibility, forms, typography, layout, performance, and microcopy.
- **[ux-audit](./skills/ux-audit/SKILL.md)**: Feature-level UX audit for React/Next.js. 30+ failure modes, diff-aware.
- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit. Architecture rules, trust patterns, AX Relationship Summary.
- **[optimise-seo](./skills/optimise-seo/SKILL.md)**: Metadata, structured data, sitemaps, and Core Web Vitals for Next.js.

### Shipping

- **[plan-creator](./skills/plan-creator/SKILL.md)**: Collaborative interrogation that produces a plan. Asks one question at a time with recommended answers.
- **[plan-reviewer](./skills/plan-reviewer/SKILL.md)**: Stress-tests plans. Verifies claims against local code.
- **[pr-reviewer](./skills/pr-reviewer/SKILL.md)**: Catches bugs, structural issues, and AI slop before you push.
- **[pr-creator](./skills/pr-creator/SKILL.md)**: Human-sounding PR descriptions. Cleans up noisy commits.
- **[pr-babysitter](./skills/pr-babysitter/SKILL.md)**: Polls for merge conflicts, CI failures, and review comments. Fixes what it can.
- **[autoship](./skills/autoship/SKILL.md)**: npm releases with changesets, compiler fix loops, and CI monitoring.

### Authoring

- **[agents-md](./skills/agents-md/SKILL.md)**: Audits AGENTS.md and CLAUDE.md for stale commands and bloat.
- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Skill creation following the open format spec.

> [!TIP]
> Install a single skill instead of the full bundle:
> ```bash
> npx skills add mblode/agent-skills/ux-audit -g -y
> ```

## License

[MIT](LICENSE.md)
