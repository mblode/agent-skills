---
title: Single h1 with logical hierarchy
impact: MEDIUM
tags: content-quality, html, headings
---

## Single h1 with logical hierarchy

Each page needs exactly one `<h1>` and a logical heading hierarchy (`h1` > `h2` > `h3`). AI agents use headings as natural content dividers for chunking and navigation.

**Failing:**

```html
<h2>API Reference</h2>
<h4>Authentication</h4>
<h2>Endpoints</h2>
<h1>Welcome</h1>
```

**Passing:**

```html
<h1>API Reference</h1>
<h2>Authentication</h2>
<h3>OAuth 2.0</h3>
<h3>API Keys</h3>
<h2>Endpoints</h2>
<h3>GET /users</h3>
```
