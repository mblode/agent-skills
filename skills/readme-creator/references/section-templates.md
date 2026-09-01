# Section Templates

Markup for each section, plus which capability sections fit each project type. Phase 2 of SKILL.md fixes the five-section spine; this file supplies the skeletons and the per-type choices that go between Quickstart and License.

## Contents

- [The spine](#the-spine)
- [Capability sections](#capability-sections)
- [Per-type notes](#per-type-notes)
- [Sections that belong somewhere else](#sections-that-belong-somewhere-else)

## The spine

### Header block

One shape for every type. Registry-listed projects keep the badge row; everything else drops it. Keep every blank line shown: each HTML tag runs as raw HTML until the next blank line.

```markdown
<div align="center">

# {{Display Name}}

**{{tagline, 8 to 16 words, no full stop, inline links where an upstream project earns credit}}**

{{one plain sentence on what you actually do with it}}

<p align="center">
  <a href="{{registry-url}}"><img src="{{version-badge}}" /></a>
  <a href="{{license-url}}"><img src="{{license-badge}}" /></a>
</p>

</div>
```

Link the H1 to the live site when one exists: `# [{{Display Name}}]({{url}})`.

A logo replaces the H1 only when the wordmark is the brand. Use `<picture>` so it survives both GitHub themes, with the light version as the fallback (PyPI drops the `<source>` lines and shows only the `<img>`):

```markdown
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="{{image-base}}/logo-dark.svg">
  <img alt="{{Display Name}}" src="{{image-base}}/logo-light.svg" width="320">
</picture>
```

`{{image-base}}` is `.github/assets` for a GitHub-only repo and `https://raw.githubusercontent.com/{{owner}}/{{repo}}/main/.github/assets` for anything published to a registry.

### Demo

Only when a live URL exists. One line, then the button:

```markdown
## Demo

{{One line naming what the reader will see.}}

<p>
<a href="{{live-url}}">
<img alt="View demo" src="{{image-base}}/demo.svg" width="200" />
</a>
</p>
```

A plain link works too. The button is a house-style choice; check the ghostwriter `readme` profile for the asset.

A screenshot can stand in for a demo when there is nothing to interact with. Commit it under `.github/assets/`.

### Install

The single fastest path, one command:

```bash
npm install -g {{name}}      # CLI
npm install {{name}}         # library
```

Add one sentence under it only when the command has a consequence worth stating ("Run that inside any git repository", "Requires Node 20.11+").

No package-manager matrix, no `<details>` tabs. Anyone who prefers pnpm can translate `npm install`.

For an app with no install step, this section becomes the deploy or hosted link, or drops out entirely and Demo carries it.

### Quickstart

The shortest complete thing that produces visible output. Complete beats short: this is the one section that keeps its full length.

```markdown
## Quickstart

{{optional one-line setup, e.g. the HTML element the library mounts to}}

{{one code block, real values, runnable as pasted}}
```

For a CLI, that is two or three commands with a comment above each. For a library, one import plus one rendered result. For an app, the URL to open.

### License

```markdown
## License

{{MIT}}

---

{{footer credit line, if the house style has one}}
```

Bare licence name is the default. A licence that imposes real constraints keeps its real text: font licences, non-commercial upstreams, and anything the reader could get wrong need the sentence that explains the constraint.

## Capability sections

Two to four, between Quickstart and License. Named for what the reader gets, as a plain noun phrase.

| Section | Use it for | Shape |
|---------|-----------|-------|
| `## What you can do` | An app or tool whose value is a set of things you do | `- **Verb phrase:** what happens.` bullets |
| `## Modes` / `## Presets` | Distinct operating modes the reader picks between | one bullet per mode, with the parameters it exposes |
| `## Usage` | A library with two or three patterns beyond the Quickstart | one code block per pattern, simplest first |
| `## API` | A library or a CLI that also exports one | signature plus one-line description per public export |
| `## Options` | A CLI with more than three flags | table: Flag, Default, Description |
| `## Commands` | A CLI with subcommands | table: Command, Description |
| `## Keyboard shortcuts` | Anything with a UI | table: Key, Action |
| `## Configuration` | A config file or options object | table: Option, Type, Default, Description |
| `## Environment variables` | An app the reader self-hosts | table: Variable, Description, Required |
| `## Requirements` | A non-obvious runtime, OS, or hardware need | bullets, each with the reason |
| `## Notes` | The two or three awkward facts, plus credit to prior art | bullets |
| `## Theming` / `## Browser support` | Where it is the actual question readers have | whatever fits |

`## Notes` is the pressure valve. Three sections of one bullet each (Requirements, Caveats, Credits) read as padding; one `## Notes` with three bullets reads as honest.

Bullet form throughout: `- **Name:** what it does.` Table cells meaning "not applicable" are empty, not a dash.

A `> [!WARNING]` alert earns a place only for the one fact that breaks installs (a native dependency, a breaking major). It renders as a callout on GitHub, npm, and crates.io and as a literal `[!WARNING]` blockquote on PyPI, so a Python package states the fact in plain prose instead.

## Per-type notes

### CLI tool

- Install shows the global install; add `npx {{name}}@latest` above it when the tool is more often run than installed.
- `## Options` as a table beats a pasted `--help` dump, which goes stale silently and is unreadable on mobile.
- Document the flags a reader would not guess. `--help` already covers the rest, and a README documenting all thirty flags pushes Quickstart below the fold.
- Only add `## API` if the package genuinely exports one.

### Library / package

- Quickstart is install plus a minimal working example, under about 15 lines.
- Link an external docs site rather than growing an API section past a screenful.
- `## Notes` carries the platform requirements and the prior art. A library inspired by others should say so; it is also the fastest way for a reader to place it.
- Images use the `raw.githubusercontent.com` base: the same file renders on the repo page and the registry page.

### Web app

- No badges, no registry install. Demo is the most important section, and often the only one above Quickstart.
- `## Environment variables` matters only for an app readers self-host. For a hosted app nobody will run locally, skip it and skip Quickstart too; Demo plus capability sections is the whole README.
- A privacy or data-handling claim, where true, is worth its own two-sentence section. It is often the reader's real question.

### Framework

- Feature descriptions run longer here: explain the why with the what.
- Quickstart then one `## Usage` with the two or three core patterns. Push the configuration reference to a docs site rather than inlining a forty-row table.

### Monorepo

Write the README for what a stranger installs or visits, not for the repo layout. A repo whose `apps/cli` publishes to npm gets a CLI README at the root, with the published package name in the install command and the badge.

- No workspaces table. The layout is `AGENTS.md` content.
- If the repo genuinely ships several things a reader chooses between, that is a `## Packages` table of two to five rows, each linking to its own README, and it is a capability section rather than the lede.

### Skill bundle

The bundle's registry is skills.sh, which lists the skills with install counts and renders each `SKILL.md` on its own page; it does not show the README. So the README is read on GitHub, and its job is the install command plus a scannable catalogue.

- Header carries the skill count in the second line, the skills.sh installs badge, and the license badge (`badges-and-shields.md` has the endpoint).
- Install is the one `npx skills add {{owner}}/{{repo}}` command. Name the compatible agents in one line under it; where the command takes agent flags, state the flag shape once (`--agent` is space-separated, and a comma-separated list is rejected whole).
- One line linking the skills.sh listing, so readers can see install counts and browse per-skill pages.
- The `## Skills` table or list is the core content: one row per skill, name linked to its `SKILL.md`, then what it does in one clause. Group under `###` category headings once past about ten skills; this is the sanctioned use of `###`.
- No Quickstart: invoking a skill is the agent's job, and the per-skill pages show the body.

## Sections that belong somewhere else

The audience gate in Phase 2 rules these out. Move the content, do not delete it, and create the destination file when it does not exist.

| Section | Destination |
|---------|-------------|
| `## Development`, `## Scripts`, `## Common commands` | `AGENTS.md` or `CONTRIBUTING.md` |
| `## Workspaces`, `## Project structure`, `## Architecture` | `AGENTS.md` |
| `## Release`, `## Publishing` | `CONTRIBUTING.md` |
| `## Tech Stack` | nowhere; the reader can see the language on the repo sidebar |
| `## Contributing` | `CONTRIBUTING.md`, which GitHub links from the issue and PR composer |
| `## Roadmap` | GitHub issues or a project board, where it can stay current |
| `## Changelog` | `CHANGELOG.md` or GitHub releases |

`## Contributing` is the one worth arguing about. GitHub already links `CONTRIBUTING.md` from the issue and PR composer, so a README section repeating it costs a screenful and reaches nobody who was not already looking.
