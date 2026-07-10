---
name: scaffold-cli
description: Scaffolds a production-ready TypeScript CLI and npm package with ESM, a dual tsdown build (CLI binary plus typed library), vitest, oxlint and oxfmt via ultracite, changesets, GitHub Actions CI with OIDC npm publishing, AGENTS.md, and a bundled agent skill definition. Use when creating a new CLI tool, bootstrapping a TypeScript package, scaffolding a node CLI, starting a new npm package, or asking "scaffold a CLI project" or "set up a new TypeScript CLI". For a Next.js web app use scaffold-nextjs; for structuring an existing codebase use define-architecture; for releasing an already-built package use autoship.
---

# Scaffold CLI

- **IS:** bootstrapping a brand-new TypeScript CLI or npm package (Node 24+, TypeScript 7) from the pinned templates in `references/`.
- **IS NOT:** a Next.js web app (use `scaffold-nextjs`), folder structure or module contracts for an existing codebase (use `define-architecture`), or shipping a release of an existing package (use `autoship`).

Low-freedom scaffold. Generate files exactly as templated, substituting only `{{placeholder}}` variables. Do not swap tools (no eslint, prettier, tsup, jest, chalk, or ora) or restructure the layout.

## Reference Files

| File | Read When |
|------|-----------|
| `references/scaffold-configs.md` | Step 3: package.json, tsconfig, tsdown, gitignore, license, changeset config, GitHub Actions |
| `references/scaffold-source.md` | Steps 4-5: src/cli.ts, src/index.ts, src/types.ts, AGENTS.md, README.md, skills/SKILL.md |
| `references/post-scaffold.md` | Steps 6-7: post-scaffold commands, validation checklist, troubleshooting |

## Scaffold Workflow

Copy this checklist to track progress:

```text
Scaffold progress:
- [ ] Step 1: Gather project info
- [ ] Step 2: Create directory structure
- [ ] Step 3: Generate config files
- [ ] Step 4: Generate source files
- [ ] Step 5: Generate docs and skill
- [ ] Step 6: Run post-scaffold commands
- [ ] Step 7: Validate scaffold
```

### Step 1: Gather project info

Ask only for what the user didn't provide:

| Variable | Example | Default | Used in |
|----------|---------|---------|---------|
| `{{name}}` | `md-tools` | required | package.json name, README title |
| `{{description}}` | `CLI tool to convert content to markdown` | required | package.json, README, SKILL.md |
| `{{bin}}` | `md` | same as `{{name}}` | package.json bin field, CLI examples |
| `{{repo}}` | `acme/md-tools` | required | package.json repository, badges |
| `{{author}}` | `Your Name` | required | package.json, LICENSE |
| `{{year}}` | `2026` | current year | LICENSE |

### Step 2: Create directory structure

```
{{name}}/
  .changeset/
  .github/
    workflows/
  src/
  skills/{{bin}}/
```

### Step 3: Generate config files

Load `references/scaffold-configs.md`. Generate all config files, replacing every `{{placeholder}}`.

Files: `package.json`, `tsconfig.json`, `tsdown.config.ts`, `.gitignore`, `LICENSE.md`, `.changeset/config.json`, `.changeset/README.md`, `.github/workflows/ci.yml`, `.github/workflows/npm-publish.yml`

### Step 4: Generate source files

Load `references/scaffold-source.md`. Generate:

- `src/cli.ts`: Commander entry point
- `src/index.ts`: Public API exports
- `src/types.ts`: Shared type definitions

### Step 5: Generate docs and skill

From the same `references/scaffold-source.md`, generate:

- `AGENTS.md`: commands, architecture, gotchas
- `README.md`: install, usage, API, agent skill install, license
- `skills/{{bin}}/SKILL.md`: agent skill definition

Do not create the CLAUDE.md symlink here; Step 6 creates it exactly once.

### Step 6: Run post-scaffold commands

Load `references/post-scaffold.md`. Run the full sequence in order: `git init` must precede `ultracite init` (lefthook hooks need `.git/` to install into).

### Step 7: Validate scaffold

Run the validation checklist in `references/post-scaffold.md`. Every item must pass with command output as evidence, not a visual once-over. Includes the placeholder sweep (`grep` for leftover `{{variable}}` tokens).

## Dependencies

**Runtime:** `@clack/prompts`, `commander`

**Development (in the package.json template):** `@changesets/cli`, `@types/node`, `tsdown`, `typescript`, `ultracite`, `vitest`

**Added by `ultracite init` (never list by hand):** `oxlint`, `oxfmt`, `lefthook`, plus `check`, `fix`, and `prepare` scripts

**Replacements:** `node:util` `styleText` instead of chalk (stable since Node 22.13), `@clack/prompts` spinner instead of ora.

## Anti-patterns

- **No CommonJS.** Everything is ESM (`"type": "module"`); a `require()` or missing `.js` import extension fails the NodeNext typecheck and build.
- **No shebang in `src/cli.ts`.** tsdown's `banner` injects `#!/usr/bin/env node` at build; a source shebang doubles it in `dist/cli.js`.
- **Do not merge the dual tsdown builds.** CLI entry (shebang, no dts) and library entry (dts, no shebang) have conflicting output; merging breaks one.
- **Do not add `oxlint`/`oxfmt` scripts or devDeps by hand, or call those binaries directly.** `ultracite init` owns them; run `npm run check` (lint) and `npm run fix` (autofix). By-hand entries cause duplicate scripts and version skew.
- **Do not run `ultracite init` before `git init`.** Its lefthook integration installs hooks into `.git/hooks` and fails without a repo.
- **Do not write `"test": "vitest run"` without `--passWithNoTests`.** Zero test files means plain `vitest run` exits 1 and the first CI run goes red.
- **Do not skip AGENTS.md or `skills/`.** The contract is that every generated CLI is agent-ready out of the box.
- **Do not create test files;** the user adds tests for their specific features.
- **No chalk or ora;** see Replacements above.

## After Scaffolding

For releases of the generated package, the `autoship` skill drives the changeset, CI, and Version Packages PR flow.
