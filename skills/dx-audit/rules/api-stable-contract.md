---
title: Keep the Public Contract Stable; Deprecate, Don't Break
impact: CRITICAL
impactDescription: a silent breaking change costs every consumer an upgrade debugging session
tags: api, versioning, deprecation, backwards-compat
---

## Keep the Public Contract Stable; Deprecate, Don't Break

Renaming or removing a public export, or changing its return or parameter shape, breaks every consumer who upgrades; a non-major bump breaks them silently. Add the new shape alongside the old, mark the old `@deprecated` naming the replacement, and remove it only on a major version.

Load this rule only when the current diff changes a public export, signature, parameter, or return shape. Compare that changed surface with the repository's normal base first. Use a release tag or published declaration only when the base cannot establish the prior contract. With no reliable prior contract, report this rule as not assessed; the mere absence of `@deprecated` tags or an aliasing convention is not evidence of a breaking change.

**Incorrect (renamed export and changed return type in a minor bump, no shim):**

```ts
// 1.4.0 had: export function getUser(id: string): User
// 1.5.0 (minor) ships:
export function fetchUser(id: string): Promise<User | null> {} // rename + shape change
// every caller of getUser() now throws "getUser is not a function"
```

**Correct (additive change; old name kept as a deprecated alias):**

```ts
export function fetchUser(id: string): Promise<User | null> {}

/** @deprecated since 1.5.0, use fetchUser. Removed in 2.0.0. */
export function getUser(id: string): Promise<User | null> {
  return fetchUser(id);
}
```
