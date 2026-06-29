---
title: Keep the Public Contract Stable; Deprecate, Don't Break
impact: CRITICAL
impactDescription: a silent breaking change costs every consumer an upgrade debugging session
tags: api, versioning, deprecation, backwards-compat
---

## Keep the Public Contract Stable; Deprecate, Don't Break

Renaming or removing a public export, or changing its return or parameter shape, breaks every consumer who upgrades; a non-major bump breaks them silently. Add the new shape alongside the old, mark the old `@deprecated` naming the replacement, and remove it only on a major version.

This rule needs the prior contract to judge a break. Establish it first: diff the public surface against the last release (`git show <last-tag>:dist/index.d.ts`, the published `.d.ts` on npm, or `git diff main` for a PR). With no prior version (snapshot audit or pre-1.0 package), flag the weaker signal: a public surface with no deprecation mechanism at all (no `@deprecated` tags, no aliasing convention), which guarantees the next rename breaks silently.

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
