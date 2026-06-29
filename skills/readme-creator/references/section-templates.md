# Section Templates

README skeletons by project type. Copy the relevant template, fill placeholders, adapt.

## Contents

- [CLI tool](#cli-tool)
- [Library / package](#library--package)
- [Web app](#web-app)
- [Framework](#framework)
- [Monorepo (published)](#monorepo-published)
- [Monorepo (private / internal)](#monorepo-private--internal)
- [Skill bundle](#skill-bundle)

---

## CLI Tool

```markdown
<h1 align="center">{{name}}</h1>

<p align="center">{{one-liner}}</p>

<p align="center">
  <a href="https://www.npmjs.com/package/{{name}}"><img src="https://img.shields.io/npm/v/{{name}}.svg" alt="npm version"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

- **Feature one:** short explanation.
- **Feature two:** short explanation.
- **Feature three:** short explanation.

## Install

\`\`\`bash
npm install -g {{name}}
\`\`\`

Requires Node.js {{node-version}}+.

## Usage

\`\`\`bash
{{name}} {{basic-command}}
{{name}} {{command-with-flag}}
{{name}} {{command-with-options}}
\`\`\`

## Options

\`\`\`
-o, --output <file>    Description
-v, --verbose          Description
-h, --help             Show help
-V, --version          Show version
\`\`\`

## API

\`\`\`typescript
import { {{mainExport}} } from "{{name}}";

const result = await {{mainExport}}({{args}});
\`\`\`

## License

[MIT](LICENSE.md)
```

### Notes

- Lead with the centered title + one-liner + badges block for impact.
- Show `npm install -g` first, then `npx` as alternative if applicable.
- Options: copy from `--help` output; keep as a code block, not a table.
- API section: only if the CLI also exports a programmatic API; else omit.

---

## Library / Package

```markdown
<h3 align="center">{{name}}</h3>
<p align="center">{{one-liner}}</p>

<p align="center">
  <a href="https://www.npmjs.com/package/{{name}}"><img alt="npm version" src="https://img.shields.io/npm/v/{{name}}"></a>
  <a href="LICENSE.md"><img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
</p>

## Highlights

- Highlight one
- Highlight two
- Highlight three

## Quick Start

\`\`\`bash
npm install {{name}}
\`\`\`

\`\`\`tsx
import { {{mainExport}} } from "{{name}}"

{{minimal-usage-example}}
\`\`\`

## Usage

\`\`\`tsx
// Pattern one
import { A } from "{{name}}"

// Pattern two (tree-shaking)
import { B } from "{{name}}/b"
\`\`\`

All components/functions accept these props/options:

- `option`: description (default: `value`)

## License

[MIT](LICENSE.md)
```

### Notes

- "Highlights" not "Features": show what makes the library stand out.
- Quick Start = install + minimal working example, under 10 lines total.
- Link an external docs site if one exists (add a Documentation section after Highlights).

---

## Web App

```markdown
# {{name}}

{{one-liner describing what the app does and who it's for}}

## Features

- **Feature one:** short explanation.
- **Feature two:** short explanation.
- **Feature three:** short explanation.

## Getting Started

\`\`\`bash
git clone https://github.com/{{owner}}/{{repo}}.git
cd {{repo}}
npm install
cp .env.example .env.local
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `API_KEY` | Third-party API key | Yes |

## Tech Stack

- [Next.js](https://nextjs.org/): framework
- [TypeScript](https://www.typescriptlang.org/): language
- [Tailwind CSS](https://tailwindcss.com/): styling

## License

[MIT](LICENSE.md)
```

### Notes

- No badges, no centered title for apps (no registry presence, less brand).
- Getting Started replaces Install: readers clone and configure.
- Environment variables table is critical; include `.env.example` in the repo.
- Tech Stack is optional but helps contributors.

---

## Framework

```markdown
# {{name}}

[![npm version](https://img.shields.io/npm/v/{{name}}.svg)](https://www.npmjs.com/package/{{name}})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

{{one-liner explaining the core value proposition}}

## Features

- **Feature one:** detailed explanation of what it does and why it matters.
- **Feature two:** detailed explanation.
- **Feature three:** detailed explanation.

## Install

\`\`\`bash
npm install {{name}}
\`\`\`

## Quick Start

\`\`\`typescript
{{minimal-working-example}}
\`\`\`

## Usage

### Basic

\`\`\`typescript
{{basic-usage}}
\`\`\`

### Advanced

\`\`\`typescript
{{advanced-usage-with-configuration}}
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option` | `string` | `"default"` | What it controls |

## Requirements

- Node.js {{version}}+
- {{other-dependency}}

## License

[MIT](LICENSE.md)
```

### Notes

- Feature descriptions run longer than CLI/library: explain the "why" with the "what".
- Progressive disclosure: Quick Start (5 lines) → Basic Usage → Advanced Usage → Configuration reference.
- Configuration table with types and defaults is essential.
- Requirements matters more here: frameworks often have specific runtime needs.

---

## Monorepo (published)

```markdown
# {{name}}

{{one-liner}}

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`{{pkg-a}}`](packages/{{pkg-a}}) | What it does | [![npm](https://img.shields.io/npm/v/{{pkg-a}}.svg)](https://www.npmjs.com/package/{{pkg-a}}) |
| [`{{pkg-b}}`](packages/{{pkg-b}}) | What it does | [![npm](https://img.shields.io/npm/v/{{pkg-b}}.svg)](https://www.npmjs.com/package/{{pkg-b}}) |

## Getting Started

\`\`\`bash
git clone https://github.com/{{owner}}/{{repo}}.git
cd {{repo}}
npm install
npm run dev
\`\`\`

## Development

\`\`\`bash
npm run build       # Build all packages
npm run test        # Run all tests
npm run lint        # Lint all packages
\`\`\`

## Contributing

See individual package READMEs for package-specific setup.

## License

[MIT](LICENSE.md)
```

### Notes

- The packages table is the centerpiece: how readers discover what's in the monorepo.
- Link each package name to its directory (which should have its own README).
- Version badges give at-a-glance status per package.
- Development commands run from root via the workspace tool (turbo, nx, etc.).

---

## Monorepo (private / internal)

Use when the monorepo is unpublished (`"private": true` in package.json, no npm publish). No badges, no version column. Focus on getting a contributor running fast.

```markdown
# {{name}}

{{one-liner}}

## Requirements

- Node {{node-version}}+ (npm {{npm-version}}, see `packageManager` in `package.json`)
- {{additional-runtime}} (e.g., Python 3 for pipeline scripts)

## Quick start

\`\`\`bash
npm install
{{additional-setup-commands}}
npm run dev
\`\`\`

## Workspaces

| Package | Purpose |
|---------|---------|
| [`{{app-a}}`](apps/{{app-a}}) | What it does |
| [`{{pkg-a}}`](packages/{{pkg-a}}) | What it does |
| [`{{pkg-b}}`](packages/{{pkg-b}}) | What it does |

## Common commands

\`\`\`bash
npm run build            # build all workspaces
npm run typecheck        # type-check applicable workspaces
{{project-specific commands with inline comments}}
\`\`\`

{{optional: one paragraph on what is gitignored and why}}
```

### Notes

- No badges, no version column: no registry presence.
- "Workspaces" not "Packages" reads clearer for mixed app + package monorepos.
- "Purpose" column not "Description" encourages specific, action-oriented text.
- Requirements is critical with multiple runtimes (Node + Python, Node + Rust).
- List secondary-runtime setup in Quick start (e.g., `npm run setup:python`).
- Common commands replaces "Development": show commands people actually run, not generic build/test/lint.

---

## Skill Bundle

```markdown
# {{name}}

{{one-liner}}

## Quick Start

\`\`\`bash
npx skills add {{owner}}/{{repo}} -g --all -y
\`\`\`

Supports OpenCode, Claude Code, Codex, and Cursor. Install a single skill with `--skill <name>`.

## Skills

| Skill | Phase | What it does |
|-------|-------|-------------|
| `{{skill-a}}` | {{phase}} | {{description}} |
| `{{skill-b}}` | {{phase}} | {{description}} |

## Contributing

Edit the files in `skills/`. Keep `SKILL.md` concise and use reference files for detail.
```

### Notes

- Quick Start is the single install command, nothing else.
- Skills table is the core content: one row per skill with phase and description.
- Contributing is minimal: point to the skills/ directory.
- No license section unless the bundle is a published package.
