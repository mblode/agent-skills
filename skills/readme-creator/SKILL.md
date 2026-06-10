---
name: readme-creator
description: Writes or rewrites a project's README.md tailored to its type (CLI, library, app, framework, monorepo, or skill bundle). Discovers project context from manifests, dispatches on the detected type, writes section by section, and validates against a quality checklist. Use when "write a README for this project", "create a README", "write a README from scratch", "rewrite this bad README", "bootstrap project documentation", or "the create-next-app README is still here". For auditing or improving an existing README or a docs site, use docs-writing. For AGENTS.md or CLAUDE.md agent-instruction files, use agents-md.
---

# README Creator

Write or rewrite a README.md tailored to the project type and audience.

- **IS:** producing a new or rewritten README.md, selecting structure from the detected project type (CLI, library, app, framework, monorepo, skill bundle) and writing each section.
- **IS NOT:** auditing or improving an existing README's prose, or writing a multi-page docs site (use `docs-writing`); writing AGENTS.md or CLAUDE.md agent-instruction files (use `agents-md`). A README that already covers the project and just needs polish is a `docs-writing` job, not a rewrite.

## Reference Files

| File | Read when |
|------|-----------|
| `references/section-templates.md` | Phase 3, after the project type is known: copy the matching skeleton and section guidance |
| `references/badges-and-shields.md` | Phase 4, only if the project publishes to a registry |
| `references/quality-checklist.md` | Phase 5: score the finished README before declaring done |

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

Read the project before asking the user anything. The type drives every later decision, so detect it from evidence, not assumption.

Read the manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for name, description, license, scripts, the `bin` field, and `"private"`. Read the existing README if rewriting. Scan the top-level directory layout.

Classify into exactly one type. The first matching row wins, top to bottom:

| Type | Decisive signal |
|------|-----------------|
| Skill bundle | `skills/` directory containing `SKILL.md` files |
| Monorepo (private) | workspace config (`turbo.json`, `pnpm-workspace.yaml`, workspaces field) plus `"private": true`, no registry publish |
| Monorepo (published) | workspace config with packages published to a registry |
| CLI tool | `bin` field in package.json, or `src/cli.*`, or a commander/yargs/clap dependency |
| Framework | plugin/middleware architecture, a configuration API, documented extension points |
| Library / package | `main`/`exports` set, no `bin` field, `src/index.*` entry |
| Web app | framework config (`next.config.*`, `vite.config.*`) with no registry publish |

If two types seem to fit (a CLI that also exports an API, a framework published as a library), pick the type that matches how most users consume it and fold the secondary role into one extra section.

Ask the user only what the code cannot reveal:
- What problem does this solve (the "why" behind the one-liner)?
- Who is the audience (end users, contributors, both)?
- Any section to force in or leave out?

If the user is unreachable, infer the "why" from the manifest description and code, and note the assumption at the top of your summary rather than blocking.

### Phase 2: Select sections

Load `references/section-templates.md`. Use this matrix to pick sections (`yes` = include, `opt` = include if the project warrants it, blank = omit):

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

Copy the matching skeleton from `references/section-templates.md` and fill it. The skeleton plus its Notes block carries the per-type detail; the rules below are the ones that hold across every type:

- The H1 is the project name. The one-liner sits directly below with no heading and states what the project does, not what it "is".
- Put the feature list above the fold (before Install) so a reader sees the value before any setup cost.
- Install shows the single fastest path first: `npm install -g` for CLIs, `npm install` for libraries, clone-and-run for apps.
- Usage gives 3 to 5 runnable examples, simplest first, with real values (never `foo`, `bar`, `example`, `test`).
- Every code block must run as-is after copy-paste. No pseudocode, no placeholder imports left behind.
- A first-time reader should get something running within 60 seconds of opening the file.
- Disclose progressively: basics in the README, advanced detail in linked docs.

### Phase 4: Add badges

Skip this phase entirely unless the project publishes to a registry (npm, crates.io, PyPI). Private apps, internal monorepos, unpublished skill bundles: no badges.

When badges apply, load `references/badges-and-shields.md`, place them directly under the title and one-liner, and cap at 4.

### Phase 5: Validate

Load `references/quality-checklist.md`. Score every applicable item and report the pass count as your evidence; do not exit on "it reads fine". Fix every failed item, then reread top to bottom once to confirm the flow.

The Automatic Fail list in the checklist is the hard gate: a missing description, missing install/getting-started, leftover boilerplate (an unchanged create-next-app README), or a code example that cannot run all mean the README is not done, regardless of the score.

## Gotchas

- Detect the type before writing a line: a library README with a `git clone` Getting Started, or an app README with npm install/registry badges, signals the type was guessed wrong and sends readers down a path that does not work.
- Skill-bundle and private-monorepo READMEs get no badges and no version column: there is no registry entry behind them, so the badge renders broken or stale.
- Stale install commands are the most common rewrite bug: copy the package name from the manifest `name` field, not from the old README, which may predate a rename.
- Feature bullets use `- **Name:** what it does.` with a colon, never a hyphen separator: `- **Name** - what it does.` is the spaced-hyphen pattern this repo forbids.
- A "Features" section that just restates the one-liner is noise; cut it or make each bullet add a capability the one-liner did not name.
- Do not add a table of contents to a README under 100 lines: it pushes the install command below the fold for no navigation benefit.
- Never ship the framework's default scaffold README (create-next-app, create-vite). Replace it wholesale; readers treat it as an abandoned project.

## Related skills

| When | Run |
|------|-----|
| The README exists and needs a prose-quality audit, or the project needs a full docs site | `docs-writing` |
| The project needs agent instructions (AGENTS.md, CLAUDE.md) | `agents-md` |
