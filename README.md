# Agent Skills

A minimal, opinionated set of skills for planning, design, engineering, and UI quality.

## Quick Start

```bash
npx skills add mblode/agent-skills
```

Supports OpenCode, Claude Code, Codex, and Cursor.

## Skills

| Skill                       | Phase         | What it does                                                                                                                                     |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `define-architecture`       | Project start | Repo structure, backend patterns, workflow conventions                                                                                           |
| `scaffold-cli`              | Project start | TypeScript CLI scaffold with ESM, tsdown, vitest, biome, changesets, and GitHub Actions                                                          |
| `scaffold-nextjs`           | Project start | Next.js turborepo scaffold with TypeScript, Tailwind, shadcn + Blode UI registry components, blode-icons-react, Ultracite, and Vercel deployment |
| `ui-design`                 | Design        | Visual direction for product or marketing UI                                                                                                     |
| `ui-audit`                  | Pre-ship      | Accessibility, typography, and UX polish audit                                                                                                   |
| `typography-audit`          | Design/dev    | Punctuation, font selection, sizing, spacing, and typographic quality                                                                            |
| `ui-animation`              | Design/dev    | Motion easing, timing, and reduced-motion rules                                                                                                  |
| `presentation-creator`      | Design/dev    | Bold, minimal, dark-first slide decks and pitch decks                                                                                            |
| `mermaid-mind-map`          | Design/dev    | Mermaid mindmap diagrams from codebases, topics, files, or conversations                                                                         |
| `blog-post`                 | Writing/audit | Engaging listicle-style blog posts from source insights                                                                                          |
| `docs-writing`              | Writing/audit | Documentation quality rules for voice, structure, clarity, code examples, formatting, and navigation                                             |
| `readme-creator`            | Writing/audit | Writes or rewrites README.md files tailored to the project type                                                                                  |
| `agents-md`                 | Maintenance   | AGENTS.md/CLAUDE.md audits, pruning, and hygiene                                                                                                 |
| `review-pr`                 | Pre-merge     | Runs a local end-of-session review of the current diff for high-confidence bugs and instruction-file compliance before commit, push, or handoff  |
| `pr-comments`               | Pre-merge     | PR review comment triage and resolution from humans and bots                                                                                     |
| `optimise-seo`              | Pre-launch    | Metadata, structured data, sitemaps, and Core Web Vitals                                                                                         |
| `agent-native`              | Architecture  | Designs agent-native apps with tool parity, atomic primitives, completion signals, and context injection                                         |
| `multi-tenant-architecture` | Architecture  | Multi-tenant domain strategy, isolation, and routing on Cloudflare/Vercel                                                                        |
| `agent-skills-creator`      | Authoring     | Best-practice skill creation following the open format specification                                                                             |

## License

[MIT](LICENSE.md)
