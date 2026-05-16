---
title: robots.txt with AI directives
impact: HIGH
tags: bot-policy, robots-txt
---

## robots.txt with AI directives

robots.txt must exist and include explicit directives for AI crawler user agents. 78% of sites have robots.txt, but most only address traditional search crawlers.

**Failing:**

```
User-agent: *
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml
```

**Passing:**

```
User-agent: *
Disallow: /admin/

# AI Search/Retrieval Crawlers — allowed
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# AI Training Crawlers — blocked
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

Sitemap: https://example.com/sitemap.xml
```
