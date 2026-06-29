---
title: Make Config Optional with Sensible Defaults and Escape Hatches
impact: MEDIUM
impactDescription: keeps the simple case zero-config while advanced cases stay possible
tags: config, defaults, escape-hatches
---

## Make Config Optional with Sensible Defaults and Escape Hatches

Configuration should be optional: the tool works with no config and improves as the user opts in. Leave a documented escape hatch (a raw override, a lower-level API) so the advanced 5% are not blocked when the abstraction does not fit. Optional defaults and escape hatches are not opposites; ship both.

**Incorrect (config is mandatory, and there is no way past the abstraction):**

```ts
const tool = new Tool(); // throws: "config is required"
// and the only API is the high-level one, no way to override the request
```

**Correct (works with no config; a documented escape hatch exists):**

```ts
const tool = new Tool();                 // defaults cover the common case
const tuned = new Tool({ retries: 5 });  // opt into more as needed
tool.use((req) => ({ ...req, headers })); // escape hatch for the edge cases
```
