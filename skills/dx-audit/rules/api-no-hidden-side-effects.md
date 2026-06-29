---
title: No Hidden Side Effects or Global Mutation
impact: CRITICAL
impactDescription: prevents action-at-a-distance bugs that are near-impossible to trace
tags: api, side-effects, purity, global-state
---

## No Hidden Side Effects or Global Mutation

A function should do what its name says and nothing more. Mutating a caller's input, writing module-level globals, registering process handlers, or patching prototypes on import creates action-at-a-distance bugs invisible at the call site. Return new values; keep effects explicit and opt-in.

**Incorrect (mutates the argument and a shared global on import):**

```ts
let activeConfig: Config; // module global
export function configure(opts: Config) {
  opts.normalized = true; // mutates caller's object
  activeConfig = opts;    // hidden global state
}
process.on("exit", flush); // side effect at import time
```

**Correct (pure transform, explicit lifecycle):**

```ts
export function normalizeConfig(opts: Config): Config {
  return { ...opts, normalized: true }; // new object, no mutation
}
export function createSession(config: Config) {
  return { config, flush() {/* ... */} }; // effects owned by an instance
}
```
