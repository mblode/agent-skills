# Badges and Shields

Badges go directly below the title and one-liner. Only add badges for published projects with real CI and registry presence.

## When to Add Badges

- Project is published to a package registry (npm, crates.io, PyPI)
- Project has CI that actually runs
- Maximum 4 badges — more than that adds noise without value

## When NOT to Add Badges

- Private or unpublished projects
- Projects without CI pipelines
- Web apps that are not packaged for distribution
- Skill bundles (unless published to npm)

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

Used by CLIs and icon libraries. Creates visual impact.

```html
<h1 align="center">{{name}}</h1>

<p align="center">{{one-liner}}</p>

<p align="center">
  <a href="https://www.npmjs.com/package/{{name}}"><img src="https://img.shields.io/npm/v/{{name}}.svg" alt="npm version"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>
```

### Inline (for utilities and libraries)

Simpler, less visual weight. Badges sit below the markdown title.

```markdown
# {{name}}

[![npm version](https://img.shields.io/npm/v/{{name}}.svg)](https://www.npmjs.com/package/{{name}})
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

{{one-liner}}
```

## Common Badge Set

Most projects need at most three:

| Badge | Why | URL pattern |
|-------|-----|-------------|
| Version | Shows the project is published and maintained | `shields.io/npm/v/{{name}}` |
| License | Tells users the terms at a glance | `shields.io/badge/license-MIT-blue` |
| CI status | Signals code quality (optional) | `github.com/{{owner}}/{{repo}}/actions/workflows/ci.yml/badge.svg` |
