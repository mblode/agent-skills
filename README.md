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
| `typography-audit`          | Design/dev    | Punctuation, font selection, sizing, spacing, and typographic quality                                                                            |
| `ui-animation`              | Design/dev    | Motion design, springs, gestures, clip-path, and animation review                                                                                |
| `presentation-creator`      | Design/dev    | Bold, minimal, dark-first slide decks and pitch decks                                                                                            |
| `mermaid-mind-map`          | Design/dev    | Mermaid mindmap diagrams from codebases, topics, files, or conversations                                                                         |
| `copywriting`               | Writing/audit | Writes and edits product copy — persuasion frameworks, AI-ism removal, seven-sweep audit, page-specific guidance, and before/after diffs        |
| `blog-post`                 | Writing/audit | Engaging listicle-style blog posts from source insights                                                                                          |
| `docs-writing`              | Writing/audit | Documentation quality rules for voice, structure, clarity, code examples, formatting, and navigation                                             |
| `readme-creator`            | Writing/audit | Writes or rewrites README.md files tailored to the project type                                                                                  |
| `agents-md`                 | Maintenance   | AGENTS.md/CLAUDE.md audits, pruning, and hygiene                                                                                                 |
| `review-pr`                 | Pre-merge     | Runs a local end-of-session review of the current diff for high-confidence bugs and instruction-file compliance before commit, push, or handoff  |
| `babysit-pr`                | Pre-merge     | Monitors PR health on a schedule — merge conflicts, CI/CD failures, review comment triage, and merge readiness. Also runs as one-shot comment triage |
| `optimise-seo`              | Pre-launch    | Metadata, structured data, sitemaps, and Core Web Vitals                                                                                         |
| `agent-native`              | Architecture  | Designs agent-native apps with tool parity, atomic primitives, completion signals, and context injection                                         |
| `multi-tenant-architecture` | Architecture  | Multi-tenant domain strategy, isolation, and routing on Cloudflare/Vercel                                                                        |
| `autoship`                  | Release       | Automates npm releases: changesets, changelogs, quality gates, CI monitoring, Version Packages PR merge, and npm-publish watch                   |
| `agent-skills-creator`      | Authoring     | Best-practice skill creation following the open format specification                                                                             |
| `linear-worktree`           | Development   | Creates a git worktree from main for a Linear issue — parses URLs, copy-as-prompt strings, or bare issue IDs, then sets up branch and worktree  |

## License

[MIT](LICENSE.md)
