---
title: Document Public Symbols with JSDoc/TSDoc
impact: HIGH
impactDescription: shows guidance on hover, where developers actually read it
tags: types, jsdoc, tsdoc, documentation
---

## Document Public Symbols with JSDoc/TSDoc

Every exported function, type, and option deserves a JSDoc comment. The editor surfaces it on hover and autocomplete, where developers learn an API, not in a docs site. Note units, defaults, and a `@example` for non-obvious calls; mark deprecations with `@deprecated`.

**Incorrect (no hover docs; units and default are a mystery):**

```ts
export function retry(fn: () => Promise<void>, delay?: number): Promise<void> {}
// is delay ms or s? what is the default? hover shows nothing
```

**Correct (hover explains units, default, and an example):**

```ts
/**
 * Retry `fn` until it resolves or attempts are exhausted.
 * @param delay - Base delay between attempts, in milliseconds. Default 200.
 * @example retry(() => save(), 500)
 */
export function retry(fn: () => Promise<void>, delay = 200): Promise<void> {}
```
