# Badges and Shields

Markup and placement for badges. Phase 4 of SKILL.md decides whether this project gets badges at all; this file assumes Phase 1 found a registry listing.

One placement, one colour scheme, two badges. The point of the constraint is that a set of repos should look like one set of repos.

## Placement

The `<p align="center">` row inside the header block from `section-templates.md`, below the tagline and second line:

```markdown
<p align="center">
  <a href="{{registry-url}}">
    <img src="{{version-badge}}" />
  </a>
  <a href="https://github.com/{{owner}}/{{repo}}/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/{{owner}}/{{repo}}?style=flat&labelColor=000000&color=000000" />
  </a>
</p>
```

Blank line before and after the `<p>` row: the block is HTML until the next blank line, and the `</div>` that follows needs its own.

## Colour scheme

Every badge carries `?style=flat&labelColor=000000&color=000000`. `labelColor` paints the left half, `color` the right, so both go black and the badge reads as one solid chip.

- `style`, `color`, `labelColor`, `logo`, and `logoColor` are the query parameters shields.io documents. `colorA` and `colorB` are older aliases that still render identically; leave them alone in repos that already use them, and write the documented names in new ones.
- `flat` is the shields default, so `style=flat` is redundant. Keep it anyway: the point of the query string is that every badge URL in a set is byte-for-byte the same shape.
- A black version badge no longer signals freshness by colour, which is the point. It is a link to the registry, not a status light.
- Shields' own defaults (blue, yellow, green, brightgreen) and the `for-the-badge` and `flat-square` styles are what drift looks like. If one repo in a set uses them, the set looks unmaintained.

## Version badge by registry

```markdown
<!-- npm -->
https://img.shields.io/npm/v/{{name}}?style=flat&labelColor=000000&color=000000
<!-- link to -->  https://www.npmjs.com/package/{{name}}

<!-- crates.io -->
https://img.shields.io/crates/v/{{name}}?style=flat&labelColor=000000&color=000000
<!-- link to -->  https://crates.io/crates/{{name}}

<!-- PyPI -->
https://img.shields.io/pypi/v/{{name}}?style=flat&labelColor=000000&color=000000
<!-- link to -->  https://pypi.org/project/{{name}}/

<!-- VS Code Marketplace -->
https://img.shields.io/visual-studio-marketplace/v/{{publisher}}.{{ext}}?style=flat&labelColor=000000&color=000000
<!-- link to -->  https://marketplace.visualstudio.com/items?itemName={{publisher}}.{{ext}}
```

For a monorepo publishing one package from a subdirectory, the badge uses the **published** package name from that package's manifest, not the private root name.

## Skill bundle: installs badge

A skill bundle has no version, but skills.sh is its registry and serves a shields endpoint with install counts. It already returns black-on-black `flat`, so no query string is needed beyond the label:

```markdown
<a href="https://www.skills.sh/{{owner}}/{{repo}}">
  <img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fwww.skills.sh%2Fapi%2Fbadge%2F{{owner}}%2F{{repo}}&label=installs" />
</a>
```

The `url` parameter is percent-encoded once; pasting the raw `https://www.skills.sh/api/badge/...` URL renders a shields error badge. Pair it with the license badge and stop.

## What does not earn a badge

| Badge | Why not |
|-------|---------|
| CI status | Renders as a permanent failure whenever the workflow does not fire on the default branch, and even when green tells the reader nothing they can act on. |
| Stars, forks, watchers | Decoration. The count is already on the page, immediately above. |
| Downloads per month | Fluctuates for reasons unrelated to the project, and a low number argues against you. |
| Runtime version (`node-20+`) | Duplicates the Requirements section in a second visual language. Put the version in prose where it can carry a reason. |
| "maintained: yes" | Hand-set, so it means nothing, and it goes stale in exactly the case where a reader would want it. |
| License, when the repo has no LICENSE file | The shields endpoint reads the repo's detected license. With no license file it renders `not identified`, which is worse than no badge. |

## Third badge

One case earns a third: a distribution channel a reader would otherwise not know exists, such as a VS Code Marketplace listing alongside the npm package, or a Homebrew tap. Add it as a distribution link, in the same black style, and stop there.
