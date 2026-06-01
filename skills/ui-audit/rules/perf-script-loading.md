---
title: Load Scripts With defer, async, or module
impact: HIGH
impactDescription: stops render-blocking scripts from delaying first paint
tags: performance, scripts, render-blocking
---

## Load Scripts With defer, async, or module

A bare `<script>` in `<head>` blocks parsing and paint. Use `defer` for app code that needs the DOM and ordering, `async` for independent third-party scripts, and `type="module"` (deferred by default) for modern code.

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
