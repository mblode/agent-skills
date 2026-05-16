---
title: Server-side rendering for AI crawlers
impact: CRITICAL
tags: markdown, ssr, rendering
---

## Server-side rendering for AI crawlers

AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute JavaScript. The server must return fully populated HTML on first response — not a SPA shell with client-side rendering. Sites with complete SSR see ~30% better AI indexing.

**Failing:**

```html
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
```

**Passing:**

```html
<body>
  <article>
    <h1>API Reference</h1>
    <p>Full content rendered server-side...</p>
    <script type="application/ld+json">{"@context":"https://schema.org",...}</script>
  </article>
</body>
```

JSON-LD injected via client-side JavaScript is invisible to AI crawlers — always render it in the initial server response.
