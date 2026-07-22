---
title: Harden Inputs Against Hallucinated and Hostile Values
impact: HIGH
impactDescription: stops a malformed or injected value from reaching the filesystem, a URL, or an API
tags: cli, security, validation, agents, injection
---

## Harden Inputs Against Hallucinated and Hostile Values

An agent will confidently pass a plausible but wrong value, and the CLI is the last checkpoint before that value reaches a filesystem, URL, shell, or API. Validate according to the actual sink: contain filesystem paths, reject control characters where the target format forbids them, percent-encode URL path segments, and pass shell arguments as discrete values rather than concatenated command strings. This extends `err-fail-fast-validation` from shape checks to concrete trust-boundary sinks.

**Incorrect (agent input flows straight into a path and a URL):**

```ts
const id = argv.id; // "../../.ssh/id_rsa", or "42?admin=true"
const data = readFileSync(join(baseDir, id)); // escapes baseDir via ../
const res = await fetch(`https://api.example.com/items/${id}`); // splices raw input
```

**Correct (validate, contain, and encode before use):**

```ts
if (!/^[a-z0-9-]+$/.test(id)) {
  throw new TypeError(`invalid id ${JSON.stringify(id)}: expected [a-z0-9-]`);
}
const full = resolve(baseDir, id);
if (!full.startsWith(resolve(baseDir) + sep)) {
  throw new Error(`path ${JSON.stringify(id)} escapes ${baseDir}`);
}
const res = await fetch(`https://api.example.com/items/${encodeURIComponent(id)}`);
```
