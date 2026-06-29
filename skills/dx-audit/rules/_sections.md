# Sections

Rule categories in audit priority order. The ID in parentheses is the filename prefix grouping rules (`<prefix>-<slug>.md`). Category impact is the default; individual rules may override it in frontmatter.

---

## 1. API and SDK Ergonomics (api)

**Impact:** CRITICAL
**Description:** The public surface developers call: consistent naming and argument order, predictable return types, sensible defaults, no hidden side effects, a stable contract that deprecates rather than breaks, and consistent async behavior. A surprising or shifting API gets misused, worked around, or abandoned; run this category first.

## 2. Developer-Facing Errors (err)

**Impact:** CRITICAL
**Description:** The messages a developer reads when something goes wrong. Errors must name the cause and offending value, suggest the fix or link to it, carry a stable code, never surface a raw stack as the headline, and fail fast with actionable validation. A bad error message costs hours of debugging per occurrence.

## 3. CLI UX (cli)

**Impact:** HIGH
**Description:** How a CLI behaves in a real shell and pipeline: discoverable help and version, consistent kebab-case flags, correct exit codes, and pipe/TTY awareness (no color when piped, machine output on request, progress to stderr, stdin support). A CLI that ignores Unix conventions fights every script that wraps it.

## 4. Type Ergonomics (types)

**Impact:** HIGH
**Description:** How public types feel in an editor: inference that does the work, no leaked `any`, generics that improve autocomplete instead of fighting it, JSDoc on public symbols, and discriminated unions over boolean soup. Strong types are the SDK's first and most-read documentation.

## 5. Install and First Run (onboard)

**Impact:** HIGH
**Description:** The path from `npm install` to a working hello-world: minimal install footprint with stated peer-dependency expectations, tree-shakeable ESM so consumers ship only what they import, zero-config defaults, a copy-pasteable quickstart that runs, and no required environment setup before first success. Friction here is where most evaluations are abandoned.

## 6. Config Ergonomics (config)

**Impact:** MEDIUM
**Description:** How developers configure the tool when defaults are not enough: config optional thanks to defaults, validation with actionable errors, escape hatches for advanced cases, and a discoverable, typed options surface with no magic implicit files. Audit last, after API and error surfaces are clear.
