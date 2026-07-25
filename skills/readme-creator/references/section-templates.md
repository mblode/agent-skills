# Section Templates

Markup for each README section, plus the notes that differ per project type. Phase 2's section matrix in SKILL.md decides which sections a type gets; copy those skeletons from here, then apply the notes for your type.

## Contents

- [Section skeletons](#section-skeletons)
- [Per-type notes](#per-type-notes)

## Section skeletons

### Title block

Centered with badges for published CLIs and libraries (`<h1>` for a CLI, `<h3>` for a library):

```markdown
<h1 align="center">{{name}}</h1>

<p align="center">{{one-liner}}</p>

<p align="center">
  <a href="https://www.npmjs.com/package/{{name}}"><img src="https://img.shields.io/npm/v/{{name}}.svg" alt="npm version"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>
```

Plain for apps, monorepos, and skill bundles:

```markdown
# {{name}}

{{one-liner: what it does and who it's for}}
```

Frameworks keep the plain H1 with inline badges between title and one-liner:

```markdown
# {{name}}

[![npm version](https://img.shields.io/npm/v/{{name}}.svg)](https://www.npmjs.com/package/{{name}})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

{{one-liner explaining the core value proposition}}
```

### Features / Highlights

Three to five bullets, heading `## Features` everywhere except libraries, which use `## Highlights`.

### Install / Getting Started

Published packages head this `## Install`, with a `Requires Node.js {{node-version}}+.` line under the block:

```bash
npm install -g {{name}}
```

Clone-and-run projects head it `## Getting Started` (private monorepos: `## Quick start`), followed by `Open [http://localhost:3000](http://localhost:3000).` for apps:

```bash
git clone https://github.com/{{owner}}/{{repo}}.git
cd {{repo}}
npm install
cp .env.example .env.local
npm run dev
```

Skill bundles head it `## Quick Start` with one command, then "Supports OpenCode, Claude Code, Codex, and Cursor. Install a single skill with `--skill <name>`.":

```bash
npx skills add {{owner}}/{{repo}} -g --all -y
```

### Usage

CLI, `## Usage` with one line per command, simplest first:

```bash
{{name}} {{basic-command}}
{{name}} {{command-with-flag}}
{{name}} {{command-with-options}}
```

Library or framework, `## Quick Start` (install plus a minimal working example) then `## Usage` for the patterns:

```tsx
// Pattern one
import { A } from "{{name}}"

// Pattern two (tree-shaking)
import { B } from "{{name}}/b"
```

Frameworks split Usage into `### Basic` and `### Advanced` subsections, the second showing configuration in context.

A CLI that also exports a programmatic API adds an `## API` section with a single `import` plus call example.

### Options (CLI flags)

Under `## Options`, as an unlabelled code block copied from `--help`, not a table:

```
-o, --output <file>    Description
-v, --verbose          Description
-h, --help             Show help
-V, --version          Show version
```

### Configuration

```markdown
## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option` | `string` | `"default"` | What it controls |
```

Libraries state options inline under Usage instead: `` `option`: description (default: `value`) ``.

### Environment variables

```markdown
## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `API_KEY` | Third-party API key | Yes |
```

### Inventory table

One row per package, app, or skill, each name linked to its directory:

| Type | Heading | Columns |
|------|---------|---------|
| Monorepo (published) | `## Packages` | Package, Description, Version |
| Monorepo (private) | `## Workspaces` | Package (apps and packages together), Purpose |
| Skill bundle | `## Skills` | Skill, Phase, What it does |

The Version column holds a per-package npm badge:

```markdown
| [`{{pkg-a}}`](packages/{{pkg-a}}) | What it does | [![npm](https://img.shields.io/npm/v/{{pkg-a}}.svg)](https://www.npmjs.com/package/{{pkg-a}}) |
```

### Requirements

```markdown
## Requirements

- Node {{node-version}}+ (npm {{npm-version}}, see `packageManager` in `package.json`)
- {{additional-runtime}} (e.g. Python 3 for pipeline scripts)
```

### Common commands / Development

Published monorepos head this `## Development`, private ones `## Common commands`:

```bash
npm run build            # build all workspaces
npm run typecheck        # type-check applicable workspaces
{{project-specific commands with inline comments}}
```

### Closing sections

```markdown
## Tech Stack

- [Next.js](https://nextjs.org/): framework
- [TypeScript](https://www.typescriptlang.org/): language

## Contributing

See individual package READMEs for package-specific setup.

## License

[MIT](LICENSE.md)
```

Tech Stack is apps only. License links `LICENSE.md`, never a badge in the body.

## Per-type notes

### CLI tool

- Lead with the centered title + one-liner + badges block for impact.
- Show `npm install -g` first, then `npx` as alternative if applicable.
- Options: copy from `--help` output; keep as a code block, not a table.
- API section: only if the CLI also exports a programmatic API; else omit.

### Library / package

- "Highlights" not "Features": show what makes the library stand out.
- Quick Start = install + minimal working example, under 10 lines total.
- Link an external docs site if one exists (add a Documentation section after Highlights).

### Web app

- No badges, no centered title for apps (no registry presence, less brand).
- Getting Started replaces Install: readers clone and configure.
- Environment variables table is critical; include `.env.example` in the repo.
- Tech Stack is optional but helps contributors.

### Framework

- Feature descriptions run longer than CLI/library: explain the "why" with the "what".
- Progressive disclosure: Quick Start (5 lines) → Basic Usage → Advanced Usage → Configuration reference.
- Configuration table with types and defaults is essential.
- Requirements matters more here: frameworks often have specific runtime needs.

### Monorepo (published)

- The packages table is the centerpiece: how readers discover what's in the monorepo.
- Link each package name to its directory (which should have its own README).
- Version badges give at-a-glance status per package.
- Development commands run from root via the workspace tool (turbo, nx, etc.).

### Monorepo (private / internal)

Use when the monorepo is unpublished (`"private": true` in package.json, no npm publish).

- No badges, no version column: no registry presence.
- "Workspaces" not "Packages" reads clearer for mixed app + package monorepos.
- "Purpose" column not "Description" encourages specific, action-oriented text.
- Requirements is critical with multiple runtimes (Node + Python, Node + Rust).
- List secondary-runtime setup in Quick start (e.g. `npm run setup:python`).
- Common commands lists what people actually run, not generic build/test/lint.
- Close with one optional paragraph on what is gitignored and why.

### Skill bundle

- Quick Start is the single install command, nothing else.
- Skills table is the core content: one row per skill with phase and description.
- Contributing is minimal: point to the `skills/` directory.
- No license section unless the bundle is a published package.
