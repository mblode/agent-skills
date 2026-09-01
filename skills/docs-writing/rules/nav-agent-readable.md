---
title: Publish llms.txt and a Markdown variant of every page
impact: MEDIUM-HIGH
tags: llms-txt, agents, markdown, machine-readable
---

## Publish llms.txt and a Markdown variant of every page

A growing share of docs-site traffic is coding agents fetching pages on a developer's behalf, and an agent reading rendered HTML pays for navigation, scripts, and tab widgets before it reaches the content. Two conventions fix that: an `/llms.txt` index at the site root (an H1, a one-paragraph blockquote summary, then H2 sections of `[title](url): one-line description` links, with an `## Optional` section for what an agent can skip), and a clean Markdown variant of each page at the same URL with `.md` appended. Stripe, Vale, and Supabase all serve both. Content rules follow from the same reader: every code fence carries a language tag, and no fact lives only in an image or a collapsed tab.

The docs author decides what the index lists and writes the one-line descriptions; the site build generates the file. In a Next.js App Router site, `optimise-seo` implements the routes.

**Incorrect (no machine-readable index, content trapped in a screenshot):**

```markdown
<!-- Site has no /llms.txt; each page is HTML only -->

## Rate limits

![Table of rate limits per plan](rate-limits.png)
```

**Correct (index with described links, content as Markdown):**

```markdown
<!-- /llms.txt -->
# Acme API

> Acme processes payments and subscriptions through a REST API with
> SDKs for Node, Python, and Go. Sandbox keys start with `sk_test_`.

## Reference

- [Authentication](https://docs.acme.com/reference/auth.md): key types, headers, sandbox vs live
- [Rate limits](https://docs.acme.com/reference/rate-limits.md): per-plan limits and the 429 retry contract

## Optional

- [Changelog](https://docs.acme.com/changelog.md): dated release notes
```

Reference: [llms.txt specification](https://llmstxt.org/), [Stripe docs: read this page in your terminal](https://docs.stripe.com/docs)
