---
title: Order Arguments by Required-First, Options-Object for 3+
impact: CRITICAL
impactDescription: removes positional-argument guessing and boolean-trap call sites
tags: api, arguments, signatures
---

## Order Arguments by Required-First, Options-Object for 3+

Put required arguments before optional ones so callers never pass `undefined` as a placeholder. At three or more parameters, or any boolean toggle, switch to a named options object: a call site reading `(true, false, null)` is unreadable and a boolean trap.

**Incorrect (optional before required, positional boolean trap):**

```ts
function createUser(role = "member", name: string, sendEmail: boolean, isAdmin: boolean) {}
createUser(undefined, "Ada", true, false); // what is true? what is false?
```

**Correct (required first, options object for the rest):**

```ts
function createUser(name: string, options: { role?: string; sendEmail?: boolean; isAdmin?: boolean } = {}) {}
createUser("Ada", { sendEmail: true });
```
