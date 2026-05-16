---
title: Separate training from retrieval crawlers
impact: HIGH
tags: bot-policy, robots-txt, crawlers
---

## Separate training from retrieval crawlers

AI companies split their crawlers into training bots (scrape for model training) and retrieval bots (fetch for search/citations). Blocking one does NOT block the other — each requires its own User-agent directive.

**Failing:**

```
User-agent: GPTBot
Disallow: /
# Thinks this blocks all OpenAI access — it doesn't block OAI-SearchBot
```

**Passing:**

```
# OpenAI
User-agent: GPTBot           # Training
Disallow: /
User-agent: OAI-SearchBot    # Search/retrieval
Allow: /
User-agent: ChatGPT-User     # User-initiated
Allow: /

# Anthropic
User-agent: ClaudeBot         # Training
Disallow: /
User-agent: Claude-SearchBot  # Search/retrieval
Allow: /
User-agent: Claude-User       # User-initiated
Allow: /
```

Key crawler pairs: GPTBot/OAI-SearchBot (OpenAI), ClaudeBot/Claude-SearchBot (Anthropic), Google-Extended/Googlebot (Google).
