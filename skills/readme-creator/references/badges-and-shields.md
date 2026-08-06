# Badges and Shields

Markup and placement for badges. Phase 4 of SKILL.md decides whether this project gets badges at all; this file assumes it does.

One placement, one colour scheme, two badges. The point of the constraint is that a set of repos should look like one set of repos.

## Placement

Inside the centered header block, below the tagline and second line:

```markdown
<div align="center">

# {{Display Name}}

**{{tagline}}**

{{one plain sentence on what you do with it}}

<p align="center">
  <a href="{{registry-url}}">
    <img src="{{version-badge}}" />
  </a>
  <a href="https://github.com/{{owner}}/{{repo}}/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/{{owner}}/{{repo}}?style=flat&colorA=000000&colorB=000000" />
  </a>
</p>

</div>
```

Unpublished projects use the same block with the `<p align="center">` row removed. The centered header is not a badge feature; it works on its own.

## Colour scheme

Every badge carries `?style=flat&colorA=000000&colorB=000000`. `colorA` is the label half, `colorB` the value half, so both go black and the badge reads as one solid chip.

Two consequences worth knowing:

- A black version badge no longer signals freshness by colour, which is the point. It is a link to the registry, not a status light.
- Shields' own defaults (blue, yellow, green, brightgreen) and the `for-the-badge` and `flat-square` styles are what drift looks like. If one repo in a set uses them, the set looks unmaintained.

## Version badge by registry

```markdown
<!-- npm -->
https://img.shields.io/npm/v/{{name}}?style=flat&colorA=000000&colorB=000000
<!-- link to -->  https://www.npmjs.com/package/{{name}}

<!-- crates.io -->
https://img.shields.io/crates/v/{{name}}?style=flat&colorA=000000&colorB=000000
<!-- link to -->  https://crates.io/crates/{{name}}

<!-- PyPI -->
https://img.shields.io/pypi/v/{{name}}?style=flat&colorA=000000&colorB=000000
<!-- link to -->  https://pypi.org/project/{{name}}/

<!-- VS Code Marketplace -->
https://img.shields.io/visual-studio-marketplace/v/{{publisher}}.{{ext}}?style=flat&colorA=000000&colorB=000000
<!-- link to -->  https://marketplace.visualstudio.com/items?itemName={{publisher}}.{{ext}}
```

For a monorepo publishing one package from a subdirectory, the badge uses the **published** package name from that package's manifest, not the private root name.

## What does not earn a badge

| Badge | Why not |
|-------|---------|
| CI status | Renders as a permanent failure whenever the workflow does not fire on the default branch. Only add it where CI genuinely runs on every push, and even then it tells the reader nothing they can act on. |
| Stars, forks, watchers | Decoration. The count is already on the page, immediately above. |
| Downloads per month | Fluctuates for reasons unrelated to the project, and a low number argues against you. |
| Runtime version (`node-20+`) | Duplicates the Requirements section in a second visual language. Put the version in prose where it can carry a reason. |
| "maintained: yes" | Hand-set, so it means nothing, and it goes stale in exactly the case where a reader would want it. |
| License, when the repo has no LICENSE file | The shields endpoint reads the repo's detected license. With no license file it renders as unknown, which is worse than no badge. |

## Third badge

One case earns a third: a distribution channel a reader would otherwise not know exists, such as a VS Code Marketplace listing alongside the npm package, or a Homebrew tap. Add it as a distribution link, in the same black style, and stop there.
