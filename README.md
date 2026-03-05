# Agent Skills

A minimal, opinionated set of skills for planning, design, engineering, and UI quality.

## Quick Start

```bash
npx skills add mblode/agent-skills
```

Supports OpenCode, Claude Code, Codex, and Cursor.

## Skills

| Skill | Phase | What it does |
|-------|-------|-------------|
| `plan-feature` | Before coding | Implementation plans and technical specs |
| `define-architecture` | Project start | Repo structure, backend patterns, workflow conventions |
| `scaffold-cli` | Project start | TypeScript CLI scaffold with ESM, tsdown, vitest, biome, changesets, and GitHub Actions |
| `scaffold-nextjs` | Project start | Next.js turborepo scaffold with TypeScript, Tailwind, shadcn + Blode UI registry components, blode-icons-react, Ultracite, and Vercel deployment |
| `design-ui` | Design | Visual direction for product or marketing UI |
| `implement-frontend` | Build | React/TypeScript/Next.js standards for forms, state, and type safety |
| `audit-ui` | Pre-ship | Accessibility, typography, and UX polish audit |
| `audit-typography` | Design/dev | Punctuation, font selection, sizing, spacing, and typographic quality |
| `ui-animation` | Design/dev | Motion easing, timing, and reduced-motion rules |
| `creating-presentations` | Design/dev | Bold, minimal, dark-first slide decks and pitch decks |
| `mind-map` | Design/dev | Mermaid mindmap diagrams from codebases, topics, files, or conversations |
| `briefing-document` | Writing/audit | Executive briefing documents synthesizing source materials |
| `study-guide` | Writing/audit | Study guides with quiz questions, essay prompts, and glossaries from sources |
| `blog-post` | Writing/audit | Engaging listicle-style blog posts from source insights |
| `docs-writing` | Writing/audit | Documentation quality rules for voice, structure, clarity, code examples, formatting, and navigation |
| `readme-creator` | Writing/audit | Writes or rewrites README.md files tailored to the project type |
| `agents-md` | Maintenance | AGENTS.md/CLAUDE.md audits, pruning, and hygiene |
| `review-pr` | Pre-merge | Bug detection and CLAUDE.md compliance checks |
| `pr-comments` | Pre-merge | PR review comment triage and resolution from humans and bots |
| `optimise-seo` | Pre-launch | Metadata, structured data, sitemaps, and Core Web Vitals |
| `agent-native` | Architecture | Designs agent-native apps with tool parity, atomic primitives, completion signals, and context injection |
| `multi-tenant-platform-architecture` | Architecture | Multi-tenant domain strategy, isolation, and routing on Cloudflare/Vercel |
| `quiz` | Learning | Interactive codebase quizzes with configurable difficulty and card count |
| `anki` | Learning | Anki flashcard generation from source material with configurable quantity and difficulty |
| `agent-skills-creator` | Authoring | Best-practice skill creation following the open format specification |

## Contributing

Edit the files in `skills/`. Keep `SKILL.md` concise and use reference files for detail.
