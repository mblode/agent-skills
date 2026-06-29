---
title: Ship Tree-Shakeable ESM with an Accurate sideEffects Flag
impact: HIGH
impactDescription: lets bundlers drop unused code so consumers ship kilobytes, not the whole package
tags: onboarding, bundle, esm, tree-shaking, exports
---

## Ship Tree-Shakeable ESM with an Accurate sideEffects Flag

A `main`-only CommonJS package with no `exports` map and no `sideEffects` flag forces every consumer to bundle the whole library even when they import one function. Publish dual ESM/CJS through an `exports` map, set `"sideEffects": false` (or an accurate file list) so bundlers drop unused modules, and put heavy optional features behind subpath exports.

**Incorrect (CJS-only, no exports map, sideEffects unset so it defaults to true):**

```jsonc
{
  "main": "dist/index.js"
  // no "type", no "exports", no "sideEffects": importing one helper
  // pulls the entire bundle into the consumer's build
}
```

**Correct (dual entry, tree-shaking enabled, heavy feature behind a subpath):**

```jsonc
{
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": { "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./charts": { "import": "./dist/charts.js", "require": "./dist/charts.cjs" }
  }
}
```
