---
title: Harden Inputs Against Hallucinated and Hostile Values
impact: HIGH
impactDescription: stops a malformed or injected value from reaching the filesystem, a URL, or an API
tags: cli, security, validation, agents, injection
---

## Harden Inputs Against Hallucinated and Hostile Values

An agent will confidently pass a plausible but wrong value, and the CLI is the last checkpoint before that value reaches a filesystem, URL, or API, so reject path traversal (`../`), control characters (0x00 to 0x1F), and identifiers carrying `?`, `#`, or `%`, percent-encode any value spliced into a URL path, and never concatenate agent input straight into a URL or shell string. This extends `err-fail-fast-validation` from shape checks to the adversarial case; the same guard is where you strip any prompt-injection sequence from a value before echoing it back.

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
