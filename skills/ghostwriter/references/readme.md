# README

Read when writing a README from scratch or rewriting one wholesale. A `readme` profile, when present, owns register, spelling, and house markup (header block, badge style, heading names, footer) and wins every conflict here. Without one: terse second-person imperative, no emoji, no exclamation marks, numbers over adjectives.

## The reader

Someone arrived from a search result or a registry listing with fifteen seconds and one question: is this worth my time? Every line answers that or gets cut. They are not a contributor: build pipeline, workspace layout, release process, and coding standards move to `CONTRIBUTING.md` or `AGENTS.md` (create the file rather than delete the content), and the README keeps at most a one-line pointer.

## Detect the type

Read the manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) for name, description, license, `bin`, `"private"`, and `repository`. First match wins: skill bundle (`skills/` of `SKILL.md` files), monorepo (workspace config), CLI (`bin` or a CLI dependency), framework (extension points), library (`exports`, no `bin`), web app (framework config, no publish). A monorepo is a delivery mechanism, not a type: write for what a stranger installs or visits. A `"private": true` manifest or no registry means GitHub only; a published package also renders on npmjs.com, PyPI, or crates.io, which changes image URLs and earns badges.

Ask the user only what the code cannot reveal: what problem it solves, sections to force in or out. Unreachable: state what it does from the code. Never invent a motive or an origin story.

## The spine

1. **Header:** display name with spaces and capitals, linked to the live site if one exists; a one-line tagline saying what it does, not opening with the project's name; a plain second line only when the tagline leaves the reader unsure what they would do with it; badges when registry-listed.
2. **`## Demo`** only with a live URL or screenshot.
3. **`## Install`**: the single fastest command, copied from the manifest `name`. One command, no package-manager matrix. A hosted app leads with its URL instead.
4. **`## Quickstart`**: the shortest complete thing that produces visible output, kept whole even when it is the longest block. A skill bundle has none; invoking a skill is the agent's job.
5. Capability sections, as many as the decision needs, usually one or two, named for what the reader gets (`## What you can do`, `## Options`, `## Configuration`, `## Notes` for the awkward facts and prior art). Bullets as `- **Name:** what it does.` A skill bundle's `## Skills` lists each skill linked to its `SKILL.md`, one clause each.
6. **`## License`**: the bare licence name, plus the footer credit if the profile has one.

Canonical heading names across a set of repos: `Install`, `Quickstart`, `Demo`, `License`, sentence case. Every code block runs as pasted: real values, no `foo` or `my-app`. One `> [!NOTE]` at most, for the fact that breaks installs; PyPI renders it as literal text, so a Python package says it in prose.

## Badges

Only when listed on a registry. Two, one style: version (installs for a skill bundle, via the skills.sh endpoint) and license. Never CI, stars, downloads, or "maintained". The license badge renders `not identified` without a `LICENSE` file. A third only for a distribution channel the reader would not otherwise know exists.

## Check before returning

```bash
grep -nE "TODO|\{\{" README.md
perl -CSD -ne 'print "$.: $_" if /\x{2014}/' README.md
grep -nE "^## (Installation|Getting Started|Quick Start|Licence|Development|Tech Stack|Contributing)" README.md
grep -nE '(src|\]\()=?"?\.?/?\.github/assets' README.md   # relative images break on npm and PyPI
```

Confirm the install line exists on the registry (`npm view <name> version`). Not done, whatever else is right: no description, no install or demo, a scaffold README left in place, an example that cannot run, a section that only serves contributors. For a published package, say the registry page changes after the next release.

## Gotchas

- Blank lines inside `<div align="center">` and around a `<p align="center">` row are load-bearing; without them the heading renders as literal text.
- A relative image path 404s on npmjs.com and PyPI; use `https://raw.githubusercontent.com/{owner}/{repo}/main/...` for a published package and commit the file under `.github/assets/`.
- A dark/light logo uses `<picture>` with an `<img>` fallback that is the light version; PyPI strips `<source>`.
- The common rewrite failure is a package README written for its maintainer: the first heading is `## Workspaces` or install is `git clone`. Change the reader, not the length.
- A library with a `git clone` quickstart or an app with registry badges means the type was guessed wrong.
