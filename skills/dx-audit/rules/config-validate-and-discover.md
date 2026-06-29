---
title: Validate Config with Actionable Errors and Keep It Discoverable
impact: MEDIUM
impactDescription: turns a silent typo into a named, fixable error and surfaces options in the editor
tags: config, validation, discoverability, types
---

## Validate Config with Actionable Errors and Keep It Discoverable

Config should be a typed object so the editor lists options and rejects typos, validated on load so a bad value fails with the offending key and allowed range, not a downstream crash. Avoid magic implicit files read from disk without documentation; a config source the user cannot see is one they cannot reason about.

**Incorrect (loose object, silent typo, undocumented implicit file):**

```ts
function loadConfig(opts: Record<string, unknown>) {
  // also silently merges .mytoolrc from cwd, never mentioned in docs
  return { ...defaults, ...opts }; // "retires: 5" typo ignored, no warning
}
```

**Correct (typed, validated with a precise message, sources documented):**

```ts
interface Config { retries?: number; timeout?: number }
function loadConfig(opts: Config): Required<Config> {
  if (opts.retries != null && (opts.retries < 0 || opts.retries > 10)) {
    throw new RangeError(`config.retries must be 0-10, received ${opts.retries}`);
  }
  return { ...defaults, ...opts }; // Config type rejects unknown keys at compile time
}
```
