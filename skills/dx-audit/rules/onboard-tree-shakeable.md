---
title: Ship Tree-Shakeable ESM with an Accurate sideEffects Flag
impact: HIGH
impactDescription: lets bundlers drop unused code so consumers ship kilobytes, not the whole package
tags: onboarding, bundle, esm, tree-shaking, side-effects
---

## Ship Tree-Shakeable ESM with an Accurate sideEffects Flag

A CommonJS-only bundle, or a package with `sideEffects` unset (bundlers then assume `true`), makes every consumer ship the whole library for one import. Ship ESM, set `"sideEffects": false` or the exact list of files that do run code on import (a polyfill, a CSS import), and put heavy optional features behind subpath exports so `import "pkg/charts"` costs nothing to the consumer who never uses it. Whether each entry then resolves and is typed is `onboard-exports-resolve-typed`.

**Incorrect (CJS-only, no exports map, sideEffects unset so it defaults to true):**

```jsonc
{
  "main": "dist/index.js"
  // no "type", no "exports", no "sideEffects": importing one helper
  // pulls the entire bundle into the consumer's build
}
```

**Correct (ESM, tree-shaking enabled, heavy feature behind a subpath):**

```jsonc
{
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./charts": { "types": "./dist/charts.d.ts", "default": "./dist/charts.js" }
  }
}
```
