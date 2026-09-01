# Sections

Rule categories in audit priority order. The ID in parentheses is the filename prefix grouping rules (`<prefix>-<slug>.md`). Category impact is the default; an individual rule may override it in frontmatter.

---

## 1. API and SDK Ergonomics (api)

**Impact:** CRITICAL
**Description:** The public surface developers call. Consistent naming and argument order, one predictable return shape, defaults that make the common case one call, no hidden side effects, one async style, and a contract that deprecates rather than breaks. A surprising or shifting API gets misused, worked around, or abandoned, so this category runs first.

## 2. Developer-Facing Errors (err)

**Impact:** CRITICAL
**Description:** What a developer reads when something goes wrong. Errors name the cause and the offending value, suggest the fix or link to it, carry a stable code and structured fields for programmatic handling, keep the raw stack out of the headline, and fail at the boundary rather than three hops later. A bad error costs hours of debugging per occurrence.

## 3. CLI UX (cli)

**Impact:** HIGH
**Description:** How a CLI behaves in a real shell and pipeline for the humans and agents that drive it. Unix conventions: help and version, kebab-case flags in any position, exit codes, TTY-aware output with data on stdout and progress on stderr, stdin support, and correction hints. Agent conventions: structured JSON in and out, a machine-readable schema, hardened inputs, dry-run and non-interactive confirmation for mutations, idempotent retries, and compact status snapshots for polling. A CLI that ignores the first set fights every script that wraps it; one that ignores the second hangs, duplicates work, or burns context on unchanged state.

## 4. Type Ergonomics (types)

**Impact:** HIGH
**Description:** How public types feel in an editor: inference that does the work, no leaked `any`, generics that improve autocomplete instead of demanding ritual type arguments, JSDoc on public symbols, and discriminated unions over optional booleans. Types are the SDK's first and most-read documentation.

## 5. Install and First Run (onboard)

**Impact:** HIGH
**Description:** The path from `npm install` to a working first import or command: every export resolves with types under the module systems the package claims, a minimal install footprint with peer dependencies stated, tree-shakeable ESM, zero-config defaults, a quickstart that runs as pasted, and no environment setup before first success. Friction here is where most evaluations end.

## 6. Config Ergonomics (config)

**Impact:** MEDIUM
**Description:** How developers configure the tool when defaults are not enough: config optional, validated with the offending key and allowed range, typed so the editor lists options, no undocumented implicit files, XDG base directories for stored config, and one documented precedence order across flags, environment, and files. Audit last, after API and error surfaces are clear.
