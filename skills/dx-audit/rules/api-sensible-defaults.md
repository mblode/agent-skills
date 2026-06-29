---
title: Ship Sensible Defaults So the Common Case Is One Call
impact: CRITICAL
impactDescription: makes the happy path work without ceremony
tags: api, defaults, ergonomics
---

## Ship Sensible Defaults So the Common Case Is One Call

The most common usage should need the fewest arguments. If every caller passes the same boilerplate options, those defaults are wrong. Default to what 80% of users want; let the rest override.

**Incorrect (forces boilerplate every call for the common case):**

```ts
const client = new Client({
  retries: 3,
  timeout: 30_000,
  baseUrl: "https://api.example.com",
  format: "json",
}); // every user copies this same block
```

**Correct (defaults cover the common case; override only the unusual):**

```ts
const client = new Client(); // retries 3, 30s timeout, json by default
const slow = new Client({ timeout: 60_000 }); // override just what differs
```
