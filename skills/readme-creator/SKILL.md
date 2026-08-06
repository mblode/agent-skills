---
name: readme-creator
description: Writes or rewrites a project's README.md as a public-facing shop window with a centered header, one fast install, one runnable example, and nothing that only serves contributors. Detects project type (CLI, library, app, framework, monorepo, skill bundle) to pick capability sections, then validates against a quality checklist. Use when "write a README for this project", "create a README", "rewrite this bad README", "make my README consistent", "unify the READMEs across my repos", "my README is too long", "bootstrap project documentation", or "the create-next-app README is still here". For auditing an existing README's prose or a multi-page docs site, use docs-writing. For AGENTS.md or CLAUDE.md agent-instruction files, use agents-md.
---

# README Creator

Write a README that reads as a shop window, not a wiki.

- **IS:** writing or rewriting `README.md` for the person deciding whether to use the project, with the project type driving which capability sections earn a place.
- **IS NOT:** auditing or polishing an existing README's prose, or a multi-page docs site (use `docs-writing`); AGENTS.md or CLAUDE.md agent-instruction files (use `agents-md`). A README that already covers the project and just needs polish is `docs-writing`, not a rewrite.

## The reader

Someone arrived from a search result, a registry listing, or a profile page. They have about fifteen seconds and one question: is this worth my time? Every line either answers that or gets cut.

They are not a contributor. Nothing about the build pipeline, the workspace layout, the release process, or the coding standards helps them decide, so none of it belongs here.

## Reference Files

| File | Read when |
|------|-----------|
| `references/section-templates.md` | Phase 3: per-section markup plus the per-type capability sections |
| `references/badges-and-shields.md` | Phase 4: only if publishing to a registry |
| `references/quality-checklist.md` | Phase 5: score before declaring done |

## Voice

Check for a ghostwriter platform profile before drafting: `${GHOSTWRITER_HOME:-~/.config/ghostwriter}/readme.md`. When one exists it owns the register, the spelling convention, and any house-style markup (header block, badge colours, footer credit), and it wins every conflict with this skill. Read it and follow it; do not restate it here.

With no profile, default to terse second-person imperative, no emoji, no exclamation marks, and concrete numbers over adjectives.

## Workflow

Copy this checklist to track progress:

```text
README progress:
- [ ] Phase 1: Detect project type from manifests and structure
- [ ] Phase 2: Fix the spine, then choose capability sections
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
| Monorepo | workspace config (`turbo.json`, `pnpm-workspace.yaml`, workspaces) |
| CLI tool | `bin` field, `src/cli.*`, or commander/yargs/clap dep |
| Framework | plugin/middleware architecture, config API, documented extension points |
| Library / package | `main`/`exports` set, no `bin`, `src/index.*` entry |
| Web app | framework config (`next.config.*`, `vite.config.*`); no publish |

**A monorepo is not a project type for README purposes.** It is a delivery mechanism. Ask what a stranger installs or visits, then write the README for that: a repo whose `apps/cli` publishes to npm gets a CLI README at the root, not a workspaces table. The workspace layout goes in `AGENTS.md`.

If two types still fit (a CLI that also exports an API, a framework published as a library), pick how most users consume it and fold the secondary role into one extra section.

Ask the user only what code cannot reveal:
- What problem does this solve (the "why" behind the tagline)?
- Any section to force in or leave out?

If unreachable, infer the "why" from the manifest and code, note the assumption in your summary, and proceed rather than block.

### Phase 2: Fix the spine, then choose capability sections

Every README, every type, gets these five and in this order:

1. **Header block** (title, tagline, plain second line, badges if published)
2. **`## Demo`** (only when a live URL exists)
3. **`## Install`**
4. **`## Quickstart`**
5. **`## License`**

Between Quickstart and License go **two to four capability sections**, and no more. `references/section-templates.md` lists which ones fit each type. Pick the ones this project actually needs; four is a ceiling, not a target.

Canonical heading names, so a set of repos stays consistent: `Install`, `Quickstart`, `Demo`, `License`. Not `Installation`, `Getting Started`, `Quick start`, `Quick Start`, `Licence`. Sentence case throughout, so `## Browser support` and not `## Browser Support`.

**The audience gate.** Before writing any section, ask whether it helps someone deciding to use the project or only someone changing it. If the latter, it goes in `CONTRIBUTING.md` or `AGENTS.md`, and the README keeps at most a one-line pointer. This rules out `## Development`, `## Tech Stack`, `## Architecture`, `## Release`, `## Workspaces`, `## Scripts`, `## Project structure`, and `## Contributing`.

When you move content out and no destination file exists, create it. Deleting load-bearing setup notes with nowhere to land is a worse outcome than a slightly long README.

### Phase 3: Write sections

Copy each section's skeleton from `references/section-templates.md`, fill it, then apply the per-type notes at the end of that file. These rules hold across every type:

- **Title** is the display name with spaces and capitals ("React Vello", not `react-vello`), linked to the live site when one exists.
- **Tagline** sits directly below with no heading, roughly 8 to 16 words, and says what the project does rather than what it is. Starting with the project's own name wastes the reader's first three words on something they just read in the H1.
- **Second line** is one plain sentence on what you actually do with it.
- **Install** is the single fastest command. One command, not a four-tab npm/pnpm/yarn/bun matrix; anyone who prefers another package manager can translate `npm install`.
- **Quickstart** is the shortest complete thing that produces visible output. It keeps its full length even when that makes it the longest block in the file, because a truncated example fails only after the reader has pasted it.
- Every code block runs as-is after copy-paste: no pseudocode, no placeholder imports, no `foo`, `bar`, `my-app`, or `your-name-here`. Use real ports, real branch names, real hex colours.
- **Copy the package name from the manifest `name` field**, never from the old README, which may predate a rename.
- Target 40 to 90 lines. A CLI with real flag tables earns 120. Past 130 lines the overflow belongs in a docs site.
- `##` only. Reach for `###` just where genuinely parallel variants need separating inside one section, such as a CLI's install modes.

### Phase 4: Add badges

Skip entirely unless the project publishes to a registry (npm, crates.io, PyPI, VS Code Marketplace). Unpublished apps, internal monorepos, and skill bundles get the header block with no badge row.

When badges apply, load `references/badges-and-shields.md`. Two badges, version and license. A CI badge pointing at a workflow that never fires renders as a permanent failure, and a stars badge is decoration.

### Phase 5: Validate

Load `references/quality-checklist.md`. Score every applicable item, report the pass count as evidence; do not exit on "it reads fine". Fix every failed item, then reread top to bottom once to confirm flow.

Attach these render-checks alongside the pass count. Each must return nothing:

```bash
rg -n "foo|bar|TODO|\{\{" README.md     # leftover placeholders or unresolved mustaches
rg -n '\x{2014}' README.md               # em dashes
rg -n "^## (Installation|Getting Started|Quick Start|Licence|Development|Tech Stack)" README.md
```

The checklist's Automatic Fail list is the hard gate: missing description, missing install, leftover boilerplate, a code example that cannot run, or a section that only serves contributors. Any of these means not done, regardless of score.

## Gotchas

- Detect the type before writing a line: a library README with a `git clone` Getting Started, or an app README with registry badges, means the type was guessed wrong and sends readers down a dead path.
- The most common rewrite failure is a published package whose README was written for the person maintaining it. Symptom: the first heading is `## Workspaces` or the install step is `git clone`. The fix is not trimming, it is writing for a different reader.
- Feature bullets use `- **Name:** what it does.` with a colon, never a spaced hyphen (`- **Name** - what it does.`), which reads as a stand-in for an em dash.
- A `## Features` section that restates the tagline is noise. Name it for what the reader gets (`## Modes`, `## What you can do`, `## Keyboard shortcuts`) so each bullet has to add a capability.
- Host screenshots in the repo under `.github/assets/`. Off-repo image hosts rot, and old ones are often plain HTTP, which GitHub blocks.
- No table of contents in a README under 100 lines: it pushes install below the fold for no navigation benefit. A README that needs one is usually too long.
- A dash in a table cell meaning "not applicable" should be an empty cell instead.
- Never ship a default scaffold README (create-next-app, create-vite): replace it wholesale; readers treat it as abandoned.
- Rewriting several repos at once tempts you to guess install commands. Cite the manifest `bin` entry or script you drew each one from, and paste-test a sample.

## Related skills

| When | Run |
|------|-----|
| README exists and needs a prose audit, or a full docs site | `docs-writing` |
| Project needs agent instructions (AGENTS.md, CLAUDE.md) | `agents-md` |
| Drafting in the user's own voice | `ghostwriter`, platform `readme` |
