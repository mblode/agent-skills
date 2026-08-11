---
title: Load Scripts With defer, async, or module
id: perf-script-loading
category: perf
defaultTier: fix-this-sprint
detect: static
---

## Load Scripts With defer, async, or module

A bare `<script>` in `<head>` blocks parsing and paint. Use `defer` for app code needing the DOM and ordering, `async` for independent third-party scripts, `type="module"` (deferred by default) for modern code.

**Incorrect (render-blocking script in head):**

```html
<head>
  <script src="/app.js"></script>
</head>
```

**Correct (deferred app code, async third-party):**

```html
<head>
  <script src="/app.js" defer></script>
  <script src="https://cdn.example.com/analytics.js" async></script>
</head>
```
