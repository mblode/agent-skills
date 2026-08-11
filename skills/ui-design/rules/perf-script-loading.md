---
title: Load Scripts With defer, async, or module
id: perf-script-loading
category: perf
defaultTier: fix-this-sprint
detect: static
---

## Load Scripts With defer, async, or module

A bare `<script>` in `<head>` blocks parsing and paint. Use `defer` for app code needing the DOM and ordering, `async` for independent third-party scripts, `type="module"` (deferred by default) for modern code.

## Detection

Search for `<script src>` tags carrying none of `defer`, `async`, or `type="module"`.

```bash
rg -nUP '<script\b(?![^>]*\b(?:defer|async|type="module"))[^>]*\bsrc=' -g '*.html' -g '*.tsx' -g '*.jsx' src/
```

Next.js `<Script>` (capital S) is non-blocking by default and does not match; audit it by reading its `strategy` prop, where only `beforeInteractive` blocks. Inline `<script>` blocks such as JSON-LD have no `src` and never match.

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
