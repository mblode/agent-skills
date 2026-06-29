---
title: Zero-Config Defaults and a Copy-Pasteable Quickstart
impact: HIGH
impactDescription: gets the user to first success in one paste, not a setup chapter
tags: onboarding, quickstart, zero-config, time-to-first-success
---

## Zero-Config Defaults and a Copy-Pasteable Quickstart

The first README example must run as written, with no placeholders to resolve and no config file to author first. Sensible defaults make the simplest use work immediately. Time-to-first-success is the strongest predictor of adoption; the hello-world should be one paste.

**Incorrect (requires a config file and undefined placeholders before anything runs):**

```ts
// "First, create mytool.config.ts, set up a provider, then:"
import { Tool } from "mytool";
const tool = new Tool(config); // where does `config` come from?
await tool.run(SOME_OPTIONS);  // and SOME_OPTIONS?
```

**Correct (runs verbatim on a fresh install):**

```ts
import { Tool } from "mytool";

const tool = new Tool();        // zero-config defaults
const result = await tool.run("./src");
console.log(result.summary);    // works on first paste
```
