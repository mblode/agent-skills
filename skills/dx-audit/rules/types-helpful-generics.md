---
title: Make Generics Improve Autocomplete, Not Fight It
impact: HIGH
impactDescription: keeps the editor helpful instead of demanding ritual type arguments
tags: types, generics, autocomplete
---

## Make Generics Improve Autocomplete, Not Fight It

Generics should make the editor smarter: constrain them so autocomplete suggests valid keys and the compiler catches typos. An unconstrained `<T>` the caller must supply by hand, or one so loose it accepts anything, adds ceremony without safety.

**Incorrect (unconstrained generic, no key suggestions, no checking):**

```ts
function pick<T, K>(obj: T, keys: K[]): unknown {}
pick(user, ["naem"]); // typo accepted, return type useless
```

**Correct (K constrained to the object's keys; result is precise):**

```ts
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {}
pick(user, ["name"]); // autocompletes keys, rejects "naem", returns {name}
```
