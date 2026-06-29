---
title: Keep Async Contracts Consistent; Always Return a Promise
impact: HIGH
impactDescription: one async style means callers never guess whether to await or wrap in try/catch
tags: api, async, promises, consistency
---

## Keep Async Contracts Consistent; Always Return a Promise

A function that is sometimes sync and sometimes returns a Promise, or throws synchronously on bad input but rejects everywhere else, forces callers to handle two control-flow paths for one operation. Pick one style: an async operation always returns a Promise and routes every failure through rejection. Do not also ship a callback overload of the same function.

**Incorrect (sync-or-async return, split sync-throw and async-reject paths):**

```ts
function load(id: string) {
  if (!id) throw new Error("id required");   // sync throw
  if (cache.has(id)) return cache.get(id)!;  // sync return
  return fetch(`/x/${id}`).then((r) => r.json()); // async return
}
// caller must both try/catch AND await, depending on input
```

**Correct (always a Promise; every failure rejects):**

```ts
async function load(id: string): Promise<Item> {
  if (!id) throw new Error("id required"); // becomes a rejection
  if (cache.has(id)) return cache.get(id)!;
  const r = await fetch(`/x/${id}`);
  return r.json();
}
```
