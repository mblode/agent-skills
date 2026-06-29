---
title: No Leaked any in Public Types
impact: HIGH
impactDescription: one any erases autocomplete and type-safety downstream
tags: types, any, type-safety
---

## No Leaked any in Public Types

An `any` in a public return type or parameter silently disables type-checking for everything the caller derives from it: a single `Promise<any>` from a core method turns the rest of the user's typed code untyped. Use `unknown` with narrowing, or a real type, never `any`.

**Incorrect (any infects every downstream value):**

```ts
function request(path: string): Promise<any> {}
const user = await request("/me"); // user: any, no autocomplete, no checks
user.naem; // typo compiles fine
```

**Correct (generic result or unknown the caller must narrow):**

```ts
function request<T>(path: string): Promise<T> {}
const user = await request<User>("/me"); // user: User
user.naem; // compile error
```
