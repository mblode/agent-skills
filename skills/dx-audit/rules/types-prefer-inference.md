---
title: Let Inference Do the Work
impact: HIGH
impactDescription: removes annotation ceremony from every call site
tags: types, inference, generics
---

## Let Inference Do the Work

The caller should rarely write a type annotation. If your API requires manually specifying generic parameters or annotating results, the signatures are under-inferring. Design generics so the return type flows from the arguments.

**Incorrect (caller must annotate because the result is not inferred):**

```ts
function get<T>(key: string): T {}
const port = get<number>("port"); // forced annotation, and it is a lie:
                                  // the cast is unchecked
```

**Correct (return type flows from a typed schema argument):**

```ts
function get<T>(key: string, schema: Schema<T>): T {}
const port = get("port", z.number()); // T inferred as number, validated
```
