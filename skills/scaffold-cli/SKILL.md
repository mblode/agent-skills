---
name: scaffold-cli
description: Scaffolds a production-ready TypeScript CLI and npm package with ESM, a dual tsdown build (CLI binary plus typed library), vitest, oxlint and oxfmt via ultracite, changesets, GitHub Actions CI with OIDC npm publishing, AGENTS.md, and a bundled agent skill definition. Use when creating a new CLI tool, bootstrapping a TypeScript package, scaffolding a node CLI, starting a new npm package, or asking "scaffold a CLI project" or "set up a new TypeScript CLI". For a Next.js web app use scaffold-nextjs; for structuring an existing codebase use define-architecture; for releasing an already-built package use autoship.
---

# Scaffold CLI

Scaffold a production-ready TypeScript CLI project (Node 22+) with ESM modules, a dual build (CLI binary plus typed library), automated changeset releases, and an agent skill definition.

- **IS:** bootstrapping a brand-new TypeScript CLI or npm package from the pinned templates in `references/`.
- **IS NOT:** a Next.js web app (use `scaffold-nextjs`), folder structure or module contracts for an existing codebase (use `define-architecture`), or shipping a release of an existing package (use `autoship`).

This is a low-freedom scaffold. Generate files exactly as templated, substituting only the `{{placeholder}}` variables. Do not swap tools (no eslint, prettier, tsup, jest, chalk, or ora) or restructure the layout.

## Reference Files

| File | Read When |
|------|-----------|
| `references/scaffold-configs.md` | Step 3: templates for package.json, tsconfig, tsdown, gitignore, license, changeset config, GitHub Actions |
| `references/scaffold-source.md` | Steps 4-5: templates for src/cli.ts, src/index.ts, src/types.ts, AGENTS.md, README.md, skills/SKILL.md |
| `references/post-scaffold.md` | Steps 6-7: post-scaffold command sequence, validation checklist, troubleshooting |

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

Collect from the user (ask only what was not provided):

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

Load `references/scaffold-configs.md`. Generate all config files, replacing every `{{placeholder}}` with actual values.

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

Do not create the CLAUDE.md symlink here; the post-scaffold sequence in Step 6 creates it exactly once.

### Step 6: Run post-scaffold commands

Load `references/post-scaffold.md`. Run the full command sequence in order. The order matters: `git init` must run before `ultracite init` (lefthook hooks need `.git/` to install into).

### Step 7: Validate scaffold

Run the validation checklist in `references/post-scaffold.md`. Every item must pass with command output as evidence; do not report success from a visual once-over. The placeholder sweep (`grep` for leftover `{{variable}}` tokens) is part of this checklist.

## Dependencies

**Runtime:** `@clack/prompts`, `commander`

**Development (in the package.json template):** `@changesets/cli`, `@types/node`, `tsdown`, `typescript`, `ultracite`, `vitest`

**Added by `ultracite init` (never list by hand):** `oxlint`, `oxfmt`, `lefthook`, plus `check`, `fix`, and `prepare` scripts

**Replacements for common packages:** use `node:util` `styleText` instead of chalk (stable since Node 22.13), and the `@clack/prompts` spinner instead of ora.

## Anti-patterns

- Do not use CommonJS. Everything is ESM with `"type": "module"`; a `require()` call or missing `.js` import extension fails the NodeNext typecheck and build.
- Do not put a shebang in `src/cli.ts`. The tsdown `banner` option injects `#!/usr/bin/env node` at build time; a source shebang produces a doubled shebang in `dist/cli.js`.
- Do not merge the dual tsdown builds. The CLI entry (shebang, no dts) and library entry (dts, no shebang) have conflicting output needs; merging breaks one or the other.
- Do not add `oxlint`/`oxfmt` scripts or devDependencies by hand, and do not call those binaries directly. `ultracite init` owns them; run `npm run check` (lint) and `npm run fix` (autofix) instead, or duplicate script entries and version skew result.
- Do not run `ultracite init` before `git init`. Its lefthook integration installs hooks into `.git/hooks` during the install it triggers and fails without a repo.
- Do not write `"test": "vitest run"` without `--passWithNoTests`. The scaffold ships zero test files, so plain `vitest run` exits 1 and the first CI run goes red.
- Do not skip AGENTS.md or the `skills/` directory; the scaffold's contract is that every generated CLI is agent-ready out of the box.
- Do not create test files in the scaffold; the user adds tests for their specific features.
- Do not add chalk or ora; see the replacements above.

## After Scaffolding

For the first and subsequent releases of the generated package, the `autoship` skill drives the changeset, CI, and Version Packages PR flow end to end.
