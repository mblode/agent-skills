---
title: Model State with Discriminated Unions, Not Boolean Soup
impact: HIGH
impactDescription: makes impossible states unrepresentable and narrowing automatic
tags: types, unions, state-modeling
---

## Model State with Discriminated Unions, Not Boolean Soup

Several optional booleans or nullable fields let callers construct impossible combinations (`isLoading: true` with `data` and `error` both set) and force guessing which fields are valid together. A discriminated union ties fields to the state and lets the compiler narrow.

**Incorrect (boolean soup; every field is optional and may contradict):**

```ts
interface Result {
  isLoading?: boolean;
  data?: User;
  error?: Error;
} // what does { isLoading: true, data, error } even mean?
```

**Correct (one tag drives which fields exist):**

```ts
type Result =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };

if (result.status === "success") result.data; // narrowed, no optional checks
```
