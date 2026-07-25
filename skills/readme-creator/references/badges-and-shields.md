# Badges and Shields

Markup and placement for badges. Phase 4 of SKILL.md decides whether this project gets badges at all; this file assumes it does. They sit directly below the title and one-liner.

One extra condition applies to the CI badge specifically: add it only if CI actually runs, since a badge pointing at a workflow that never fires renders as a permanent failure.

## Recommended Badges by Registry

### npm (CLI tools and libraries)

```markdown
[![npm version](https://img.shields.io/npm/v/{{name}}.svg)](https://www.npmjs.com/package/{{name}})
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
```

### Rust crates

```markdown
[![crates.io](https://img.shields.io/crates/v/{{name}}.svg)](https://crates.io/crates/{{name}})
[![docs.rs](https://docs.rs/{{name}}/badge.svg)](https://docs.rs/{{name}})
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

### Python (PyPI)

```markdown
[![PyPI version](https://img.shields.io/pypi/v/{{name}}.svg)](https://pypi.org/project/{{name}}/)
[![Python](https://img.shields.io/pypi/pyversions/{{name}}.svg)](https://pypi.org/project/{{name}}/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

## Placement Styles

### Centered (for strong brand presence)

Used by CLIs and icon libraries; high visual impact.

```html
<h1 align="center">{{name}}</h1>

<p align="center">{{one-liner}}</p>

<p align="center">
  <a href="https://www.npmjs.com/package/{{name}}"><img src="https://img.shields.io/npm/v/{{name}}.svg" alt="npm version"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>
```

### Inline (for utilities and libraries)

Simpler, less visual weight; badges sit below the markdown title.

```markdown
# {{name}}

[![npm version](https://img.shields.io/npm/v/{{name}}.svg)](https://www.npmjs.com/package/{{name}})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

{{one-liner}}
```

## Common Badge Set

Version and license carry almost all the signal; CI is the only common third.

| Badge | Why | URL pattern |
|-------|-----|-------------|
| Version | Project is published and maintained | `shields.io/npm/v/{{name}}` |
| License | License terms at a glance | `shields.io/badge/license-MIT-blue` |
| CI status | Signals code quality (optional) | `github.com/{{owner}}/{{repo}}/actions/workflows/ci.yml/badge.svg` |
