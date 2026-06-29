---
title: Return One Predictable Shape, Not a Polymorphic Union
impact: CRITICAL
impactDescription: lets callers handle the result without runtime type sniffing
tags: api, return-types, polymorphism
---

## Return One Predictable Shape, Not a Polymorphic Union

A function whose return type shifts with its arguments (`T` for one id, `T[]` for many, `null` for none) forces every caller to sniff the result with `Array.isArray`. Give each behavior its own function with a single, stable return shape.

**Incorrect (return shape depends on the argument):**

```ts
// User | User[] | null depending on what you pass
function find(query: string | string[]): User | User[] | null {}
const r = find(ids);
if (Array.isArray(r)) { /* ... */ } else if (r) { /* ... */ }
```

**Correct (one function, one shape each):**

```ts
function findOne(id: string): User | null {}
function findMany(ids: string[]): User[] {} // empty array, never null
```
