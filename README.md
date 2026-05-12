# Agent Skills

A minimal, opinionated set of skills for planning, design, engineering, and UI quality.

## Quick Start

```bash
npx skills add mblode/agent-skills -g --all -y
```

Supports OpenCode, Claude Code, Codex, and Cursor.

## Skills

| Skill                       | Phase         | What it does                                                                                                                                     |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `define-architecture`       | Project start | Repo structure, backend patterns, workflow conventions                                                                                           |
| `scaffold-cli`              | Project start | TypeScript CLI scaffold with ESM, tsdown, vitest, oxlint, oxfmt, changesets, and GitHub Actions                                                  |
| `scaffold-nextjs`           | Project start | Next.js turborepo scaffold with TypeScript, Tailwind, shadcn/ui + ui.blode.co registry components, blode-icons-react, Ultracite, and Vercel deployment |
| `ui-design`                 | Design        | Visual direction for product or marketing UI                                                                                                     |
| `ui-audit`                  | Pre-ship      | Accessibility, typography, and UX polish audit                                                                                                   |
| `ux-audit`                  | Pre-ship      | Feature-level UX audit for React/Next.js. Diff-aware, ship-readiness verdict, 30 modern failure-mode rules + 30 Laws of UX, 12 feature playbooks  |
| `typography-audit`          | Design/dev    | Punctuation, font selection, sizing, spacing, and typographic quality                                                                            |
| `ui-animation`              | Design/dev    | Motion design, springs, gestures, clip-path, and animation review                                                                                |
| `presentation-creator`      | Design/dev    | Bold, minimal, dark-first slide decks and pitch decks                                                                                            |
| `mermaid`                   | Design/dev    | Mermaid diagrams — flowcharts, sequence, class, state, ER, C4, mindmap, Gantt, timeline, journey, gitGraph, pie, quadrant, requirement, and beta types |
| `copywriting`               | Writing/audit | Writes and edits product copy — persuasion frameworks, AI-ism removal, seven-sweep audit, page-specific guidance, and before/after diffs        |
| `blog-post`                 | Writing/audit | Engaging listicle-style blog posts from source insights                                                                                          |
| `docs-writing`              | Writing/audit | Documentation quality rules for voice, structure, clarity, code examples, formatting, and navigation                                             |
| `readme-creator`            | Writing/audit | Writes or rewrites README.md files tailored to the project type                                                                                  |
| `agents-md`                 | Maintenance   | AGENTS.md/CLAUDE.md audits, pruning, and hygiene                                                                                                 |
| `plan-reviewer`             | Pre-implementation | Adversarial rubber-duck dialogue to stress-test implementation plans before coding starts                                                        |
| `review-pr`                 | Pre-merge     | Runs a local end-of-session review of the current diff for high-confidence bugs and instruction-file compliance before commit, push, or handoff  |
| `babysit-pr`                | Pre-merge     | Monitors PR health on a schedule — merge conflicts, CI/CD failures, review comment triage, and merge readiness. Also runs as one-shot comment triage |
| `optimise-seo`              | Pre-launch    | Metadata, structured data, sitemaps, and Core Web Vitals                                                                                         |
| `agent-native`              | Architecture  | Designs agent-native apps with tool parity, atomic primitives, completion signals, and context injection                                         |
| `multi-tenant-architecture` | Architecture  | Multi-tenant domain strategy, isolation, and routing on Cloudflare/Vercel                                                                        |
| `autoship`                  | Release       | Automates npm releases: changesets, changelogs, quality gates, CI monitoring, Version Packages PR merge, and npm-publish watch                   |
| `agent-skills-creator`      | Authoring     | Best-practice skill creation following the open format specification                                                                             |
| `linear-worktree`           | Development   | Creates a git worktree from the repo's default branch for a Linear issue — parses URLs, copy-as-prompt strings, or bare issue IDs, then sets up branch and worktree |

## License

[MIT](LICENSE.md)
