# Section Templates

Markup for each section, plus which capability sections fit each project type. Phase 2 of SKILL.md fixes the five-section spine; this file supplies the skeletons and the per-type choices that go between Quickstart and License.

## Contents

- [The spine](#the-spine)
- [Capability sections](#capability-sections)
- [Per-type notes](#per-type-notes)
- [Sections that belong somewhere else](#sections-that-belong-somewhere-else)

## The spine

### Header block

One shape for every type. Published projects keep the badge row; everything else drops it.

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

The blank lines inside the `<div>` are load-bearing. GitHub only parses Markdown inside an HTML block when the block is separated by blank lines, so `# Title` on the line directly after `<div align="center">` renders as literal text.

### Demo

Only when a live URL exists. One line, then the button:

```markdown
## Demo

{{One line naming what the reader will see.}}

<p>
<a href="{{live-url}}">
<img alt="View demo" src=".github/assets/demo.svg" width="200" />
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

Bullet form throughout: `- **Name:** what it does.` Colon after the bold label, never a spaced hyphen. Full stop at the end.

Table cells meaning "not applicable" are empty, not a dash.

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

- Install is the one command, then a line naming the compatible hosts.
- The skills table is the core content: one row per skill, name linked to its `SKILL.md`, plus what it does.
- Group the table by category once past about ten skills.

## Sections that belong somewhere else

The audience gate in Phase 2 rules these out. Move the content, do not delete it, and create the destination file when it does not exist.

| Section | Destination |
|---------|-------------|
| `## Development`, `## Scripts`, `## Common commands` | `AGENTS.md` or `CONTRIBUTING.md` |
| `## Workspaces`, `## Project structure`, `## Architecture` | `AGENTS.md` |
| `## Release`, `## Publishing` | `CONTRIBUTING.md` |
| `## Tech Stack` | nowhere; the reader can see the language badge on the repo |
| `## Contributing` | `CONTRIBUTING.md`, which GitHub surfaces in its own UI |
| `## Roadmap` | GitHub issues or a project board, where it can stay current |
| `## Changelog` | `CHANGELOG.md` or GitHub releases |

`## Contributing` is the one worth arguing about. GitHub already links `CONTRIBUTING.md` from the issue and PR composer, so a README section repeating it costs a screenful and reaches nobody who was not already looking.
