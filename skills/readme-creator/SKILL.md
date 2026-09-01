---
name: readme-creator
description: >-
  Writes or rewrites a project's README.md for the reader deciding whether to
  use it: centered header, one install command, one runnable quickstart, two to
  four capability sections, license. Detects the project type (CLI, library,
  web app, framework, monorepo, skill bundle) from manifests, picks sections
  per type, keeps images and badges rendering on GitHub, npm, PyPI, and
  crates.io, then scores the result against a checklist. Use when "write a
  README for this project", "create a README", "rewrite this bad README",
  "README for my npm package", "my README is too long", "unify the READMEs
  across my repos", "bootstrap project documentation", or "the create-next-app
  README is still here". For auditing an existing README's prose or a docs site
  use docs-writing; for AGENTS.md or CLAUDE.md use agents-md; for the install
  and first-run experience itself rather than its write-up use dx-audit; for
  landing-page copy use copywriting.
---

# README Creator

Write a README that reads as a shop window, not a wiki.

- **IS:** writing or rewriting `README.md` for the person deciding whether to use the project, with the project type driving which capability sections earn a place and where the file will render (GitHub only, or also a registry page) driving image and badge choices.
- **IS NOT:** polishing the prose of a README that already covers the project, or a multi-page docs site (use `docs-writing`); AGENTS.md or CLAUDE.md agent-instruction files (use `agents-md`); fixing the install or first-run experience the README describes (use `dx-audit`); marketing copy for a landing page (use `copywriting`).

## The reader

Someone arrived from a search result, a registry listing, or a profile page. They have about fifteen seconds and one question: is this worth my time? Every line either answers that or gets cut.

They are not a contributor. Nothing about the build pipeline, the workspace layout, the release process, or the coding standards helps them decide, so none of it belongs here.

This deliberately departs from standard-readme and Make a README, which require `## Contributing`, add a table of contents past 100 lines, and hold that too long beats too short. Do not drift back to those defaults: contributor content moves to `CONTRIBUTING.md` or `AGENTS.md`, and length follows what the reader needs.

## Reference Files

| File | Read when |
|------|-----------|
| `references/section-templates.md` | Phase 3: markup for each spine section, the capability-section menu, and per-type notes |
| `references/badges-and-shields.md` | Phase 4: only once Phase 1 has found a registry listing (npm, crates.io, PyPI, VS Code Marketplace, skills.sh) |
| `references/quality-checklist.md` | Phase 5: score before declaring done |

## Voice

Check for a profile from the external `ghostwriter` skill before drafting: `${GHOSTWRITER_HOME:-~/.config/ghostwriter}/readme.md`. When one exists it owns the register, the spelling convention, and any house-style markup (header block, badge colours, footer credit), and it wins every conflict with this skill. Follow it; do not restate it here.

With no profile, default to terse second-person imperative, no emoji, no exclamation marks, and concrete numbers over adjectives.

## Workflow

Copy this checklist to track progress:

```text
README progress:
- [ ] Phase 1: Detect project type and where the README renders
- [ ] Phase 2: Fix the spine, then choose capability sections
- [ ] Phase 3: Write each section from the template
- [ ] Phase 4: Add badges (registry-listed projects only)
- [ ] Phase 5: Score against the checklist; report the pass count and render-check output
```

### Phase 1: Detect project type and render targets

Read the manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for name, description, license, scripts, `bin`, `"private"`, and `repository`. Read the existing README if rewriting. Scan the top-level layout.

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

Then record where the file renders. A `"private": true` manifest or no registry listing means GitHub only. A published package also renders on npmjs.com, PyPI, or crates.io, which changes image URLs and earns badges (Phase 4 and the Gotchas).

Ask the user only what code cannot reveal:
- What problem does this solve (the "why" behind the tagline)?
- Any section to force in or leave out?

If unreachable, infer the "why" from the manifest and code, note the assumption in your summary, and proceed rather than block.

### Phase 2: Fix the spine, then choose capability sections

Every README, every type, gets these five and in this order:

1. **Header block** (title, tagline, plain second line, badges if registry-listed)
2. **`## Demo`** (only when a live URL exists)
3. **`## Install`**
4. **`## Quickstart`**
5. **`## License`**

Between Quickstart and License go the capability sections: two to four, chosen from the menu in `references/section-templates.md`. Four is a ceiling because a fifth section is almost always contributor content wearing a reader-facing heading; when a fifth genuinely serves the reader, say why in your summary rather than silently adding it.

Canonical heading names keep a set of repos consistent: `Install`, `Quickstart`, `Demo`, `License`. Not `Installation`, `Getting Started`, `Quick start`, `Quick Start`, `Licence`. Sentence case throughout, so `## Browser support` and not `## Browser Support`.

**The audience gate.** Before writing any section, ask whether it helps someone deciding to use the project or only someone changing it. Contributor content goes to `CONTRIBUTING.md` or `AGENTS.md` (the destination table is in `references/section-templates.md`), and the README keeps at most a one-line pointer. When no destination file exists, create it: deleting load-bearing setup notes is a worse outcome than a slightly long README.

### Phase 3: Write sections

Copy each section's skeleton from `references/section-templates.md`, fill it, then apply the per-type notes at the end of that file. These rules hold across every type:

- **Title** is the display name with spaces and capitals ("React Vello", not `react-vello`), linked to the live site when one exists.
- **Tagline** sits directly below with no heading, roughly 8 to 16 words, and says what the project does rather than what it is. Starting with the project's own name wastes the reader's first three words on something they just read in the H1.
- **Second line** is one plain sentence on what you actually do with it.
- **Install** is the single fastest command, copied from the manifest `name` field (never from the old README, which may predate a rename). One command, not a four-tab npm/pnpm/yarn/bun matrix; anyone who prefers another package manager can translate `npm install`.
- **Quickstart** is the shortest complete thing that produces visible output. It keeps its full length even when that makes it the longest block in the file, because a truncated example fails only after the reader has pasted it.
- Every code block runs as-is after copy-paste: no pseudocode, no placeholder imports, no `foo`, `bar`, `my-app`, or `your-name-here`. Use real ports, real branch names, real hex colours.
- Length follows need. Most land between 40 and 90 lines; a CLI with real flag tables earns 120. Past about 130 the overflow is a docs site or `docs/` folder, linked from the README.
- `##` for sections; `###` only where genuinely parallel variants need separating inside one section, such as a CLI's install modes.

### Phase 4: Add badges

Skip unless Phase 1 found a registry listing. Unpublished apps and internal monorepos get the header block with no badge row. Registry listings include skills.sh for a skill bundle, which serves an install-count badge endpoint; the repo's own README uses it.

When badges apply, load `references/badges-and-shields.md`. Default to two, version and license (installs and license for a skill bundle), in one style and one colour scheme so a set of repos looks like one set. A CI badge pointing at a workflow that never fires renders as a permanent failure, and a stars badge repeats a number already on the page.

### Phase 5: Validate

Load `references/quality-checklist.md`. Score every applicable item, report the pass count as evidence; do not exit on "it reads fine". Fix every failed item, then reread top to bottom once to confirm flow.

Attach these render-checks alongside the pass count. Each must return nothing:

```bash
grep -nE "foo|bar|TODO|\{\{" README.md                                  # placeholders, unresolved mustaches
perl -CSD -ne 'print "$.: $_" if /\x{2014}/' README.md                  # em dashes
grep -nE "^## (Installation|Getting Started|Quick Start|Licence|Development|Tech Stack|Contributing)" README.md
grep -nE '(src|\]\()=?"?\.?/?\.github/assets' README.md                  # relative image paths: fine on GitHub, broken on npm and PyPI, so must be empty for a published package
```

The checklist's Automatic Fail list is the hard gate: missing description, missing install, leftover boilerplate, a code example that cannot run, or a section that only serves contributors. Any of these means not done, regardless of score.

Rewriting a published package's README, say in the summary that npmjs.com and PyPI show the README from the last publish, so the page changes only after the next release.

## Gotchas

- The blank lines inside `<div align="center">` are load-bearing. CommonMark treats `<div>` as an HTML block that runs until the next blank line, so `# Title` on the line directly after the tag renders as literal `# Title`. Same for the `<p align="center">` badge row and the closing `</div>`.
- A relative image path (`.github/assets/demo.png`) renders on GitHub and 404s on npmjs.com and PyPI, which serve the README off-repo. For a published package, point `src` at `https://raw.githubusercontent.com/{owner}/{repo}/main/.github/assets/demo.png`; the file still lives in the repo.
- Off-repo image hosts rot. GitHub proxies every external image through camo so an `http://` URL loads today, but the host disappearing takes the screenshot with it. Commit images under `.github/assets/`.
- A dark/light logo uses `<picture>` with two `<source media="(prefers-color-scheme: ...)">` lines and an `<img>` fallback. The `#gh-dark-mode-only` URL fragments are deprecated. PyPI strips `<source>` and shows only the fallback, so make the fallback the light version.
- `> [!NOTE]` alerts (also `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`) render on GitHub, npmjs.com, and crates.io. PyPI shows a literal `[!NOTE]` inside a grey blockquote. At most one per README, reserved for the thing that breaks installs; a README of callouts reads as a changelog.
- `https://img.shields.io/github/license/{owner}/{repo}` reads the repository's detected license. With no `LICENSE` file it renders `license: not identified`, which is worse than no badge. Check the file exists before adding the badge.
- The most common rewrite failure is a published package whose README was written for the person maintaining it. Symptom: the first heading is `## Workspaces` or the install step is `git clone`. The fix is not trimming, it is writing for a different reader.
- A library README with a `git clone` Getting Started, or an app README with registry badges, means the type was guessed wrong in Phase 1 and sends readers down a dead path. Reclassify before editing prose.
- Confirm the package exists under the name you are about to publish in the install line: `npm view {{name}} version` (or `cargo search`, `pip index versions`). A README pointing at an unpublished or renamed package fails the reader on line one.
- Rewriting several repos at once tempts you to guess install commands. Cite the manifest `bin` entry or script you drew each one from, and paste-test a sample.
- Never ship a default scaffold README (create-next-app, create-vite): replace it wholesale; readers treat it as abandoned.
- Feature bullets use `- **Name:** what it does.` with a colon. A spaced hyphen (`- **Name** - what it does.`) reads as a stand-in for an em dash and fails the house style.
- A `## Features` section that restates the tagline is noise. Name it for what the reader gets (`## Modes`, `## What you can do`, `## Keyboard shortcuts`) so each bullet has to add a capability.

## Related skills

| When | Run |
|------|-----|
| README exists and needs a prose audit, or a full docs site | `docs-writing` |
| Project needs agent instructions (AGENTS.md, CLAUDE.md), including the content the audience gate moved out | `agents-md` |
| The install or first-run path the README documents is itself the problem | `dx-audit` |
| Landing-page or marketing copy beyond the tagline | `copywriting` |
| Drafting in the user's own voice | external `ghostwriter` skill where installed, platform `readme` |
