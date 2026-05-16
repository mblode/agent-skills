---
title: Sitemap linked from robots.txt
impact: MEDIUM
tags: bot-policy, sitemap
---

## Sitemap linked from robots.txt

robots.txt must reference the XML sitemap. AI crawlers use sitemaps to discover content — without it, they rely on link-following which misses deeper pages.

**Failing:**

```
User-agent: *
Disallow: /admin/
# No Sitemap directive
```

**Passing:**

```
User-agent: *
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml
```
