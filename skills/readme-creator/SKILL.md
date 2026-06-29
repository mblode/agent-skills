---
name: readme-creator
description: Writes or rewrites a project's README.md tailored to its type (CLI, library, app, framework, monorepo, or skill bundle). Discovers project context from manifests, dispatches on the detected type, writes section by section, and validates against a quality checklist. Use when "write a README for this project", "create a README", "write a README from scratch", "rewrite this bad README", "bootstrap project documentation", or "the create-next-app README is still here". For auditing or improving an existing README or a docs site, use docs-writing. For AGENTS.md or CLAUDE.md agent-instruction files, use agents-md.
---

# README Creator

Write or rewrite a README.md tailored to the project type and audience.

- **IS:** writing a new or rewritten README.md, structured by detected project type (CLI, library, app, framework, monorepo, skill bundle), section by section.
- **IS NOT:** auditing or polishing an existing README's prose, or a multi-page docs site (use `docs-writing`); AGENTS.md or CLAUDE.md agent-instruction files (use `agents-md`). A README that already covers the project and just needs polish is `docs-writing`, not a rewrite.

## Reference Files

| File | Read when |
|------|-----------|
| `references/section-templates.md` | Phase 3: copy the matching skeleton and section guidance |
| `references/badges-and-shields.md` | Phase 4: only if publishing to a registry |
| `references/quality-checklist.md` | Phase 5: score before declaring done |

## Workflow

Copy this checklist to track progress:

```text
README progress:
- [ ] Phase 1: Detect project type from manifests and structure
- [ ] Phase 2: Select sections for that type
- [ ] Phase 3: Write each section from the template
- [ ] Phase 4: Add badges (published projects only)
- [ ] Phase 5: Score against the checklist; record the pass count
```

### Phase 1: Detect project type

Read the project before asking anything; the type drives every later decision, so detect from evidence.

Read the manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for name, description, license, scripts, `bin`, and `"private"`. Read the existing README if rewriting. Scan the top-level layout.

Classify into exactly one type. First matching row wins, top to bottom:

| Type | Decisive signal |
|------|-----------------|
| Skill bundle | `skills/` dir of `SKILL.md` files |
| Monorepo (private) | workspace config (`turbo.json`, `pnpm-workspace.yaml`, workspaces) plus `"private": true`; no publish |
| Monorepo (published) | workspace config; packages published to a registry |
| CLI tool | `bin` field, `src/cli.*`, or commander/yargs/clap dep |
| Framework | plugin/middleware architecture, config API, documented extension points |
| Library / package | `main`/`exports` set, no `bin`, `src/index.*` entry |
| Web app | framework config (`next.config.*`, `vite.config.*`); no publish |

If two types fit (a CLI that also exports an API, a framework published as a library), pick how most users consume it and fold the secondary role into one extra section.

Ask the user only what code cannot reveal:
- What problem does this solve (the "why" behind the one-liner)?
- Audience: end users, contributors, both?
- Any section to force in or leave out?

If unreachable, infer the "why" from the manifest and code, note the assumption in your summary, and proceed rather than block.

### Phase 2: Select sections

Load `references/section-templates.md`. Use this matrix to pick sections (`yes` = include, `opt` = include if warranted, blank = omit):

| Section | CLI | Library | App | Framework | Mono (pub) | Mono (priv) | Skills |
|---------|-----|---------|-----|-----------|------------|-------------|--------|
| Title + one-liner | yes | yes | yes | yes | yes | yes | yes |
| Badges | yes | yes |  | yes | yes |  |  |
| Features / highlights | yes | yes | yes | yes |  |  | yes |
| Install | yes | yes |  | yes | yes |  |  |
| Quick start / usage | yes | yes | yes | yes | yes | yes | yes |
| Options / API reference | yes | yes |  | yes |  |  |  |
| Configuration | opt | opt | yes | yes | opt |  |  |
| Environment variables |  |  | yes |  |  |  |  |
| Packages / workspaces table |  |  |  |  | yes | yes |  |
| Skills table |  |  |  |  |  |  | yes |
| Requirements | yes | yes | opt | yes | opt | yes |  |
| Common commands |  |  |  |  | opt | yes |  |
| Contributing | opt | opt | opt | opt | opt | opt | opt |
| License | yes | yes | yes | yes | yes | opt | opt |

### Phase 3: Write sections

Copy the matching skeleton from `references/section-templates.md` and fill it. The skeleton plus its Notes block carries per-type detail; these rules hold across every type:

- H1 is the project name. The one-liner sits directly below with no heading; state what it does, not what it "is". Good: "Manage configurations across environments with type-safe schemas." Bad: "This is a tool that helps you manage your configurations."
- Put the feature list above the fold (before Install) so value lands before setup cost.
- Install shows the fastest path first: `npm install -g` (CLIs), `npm install` (libraries), clone-and-run (apps).
- Usage gives 3 to 5 runnable examples, simplest first, real values (never `foo`, `bar`, `example`, `test`).
- Every code block runs as-is after copy-paste: no pseudocode, no leftover placeholder imports.
- A first-time reader gets something running within 60 seconds.
- Disclose progressively: basics in the README, advanced detail in linked docs.

### Phase 4: Add badges

Skip entirely unless the project publishes to a registry (npm, crates.io, PyPI). Private apps, internal monorepos, unpublished skill bundles: no badges.

When badges apply, load `references/badges-and-shields.md`, place them under the title and one-liner, cap at 4.

### Phase 5: Validate

Load `references/quality-checklist.md`. Score every applicable item, report the pass count as evidence; do not exit on "it reads fine". Fix every failed item, then reread top to bottom once to confirm flow.

Attach a render-check alongside the pass count: `rg -n "foo|bar|TODO|\{\{" README.md` must return nothing (no leftover placeholders or unresolved `{{...}}` mustaches). A non-empty result means not done.

The checklist's Automatic Fail list is the hard gate: missing description, missing install/getting-started, leftover boilerplate (unchanged create-next-app README), or a code example that cannot run. Any of these means not done, regardless of score.

## Gotchas

- Detect the type before writing a line: a library README with a `git clone` Getting Started, or an app README with npm install/registry badges, means the type was guessed wrong and sends readers down a dead path.
- Skill-bundle and private-monorepo READMEs get no badges and no version column: no registry entry behind them, so badges render broken or stale.
- Stale install commands are the most common rewrite bug: copy the package name from the manifest `name` field, not the old README (it may predate a rename).
- Feature bullets use `- **Name:** what it does.` with a colon, never a hyphen separator (`- **Name** - what it does.` is the spaced-hyphen pattern this repo forbids).
- A "Features" section that restates the one-liner is noise: cut it or make each bullet add a capability the one-liner did not name.
- No table of contents in a README under 100 lines: it pushes install below the fold for no navigation benefit.
- Never ship a default scaffold README (create-next-app, create-vite): replace it wholesale; readers treat it as abandoned.

## Related skills

| When | Run |
|------|-----|
| README exists and needs a prose audit, or a full docs site | `docs-writing` |
| Project needs agent instructions (AGENTS.md, CLAUDE.md) | `agents-md` |
