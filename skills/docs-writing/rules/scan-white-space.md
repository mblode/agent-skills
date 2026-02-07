---
title: Use white space to separate logical groups
impact: MEDIUM
tags: whitespace, readability, layout
---

## Use white space to separate logical groups

Dense text blocks signal "hard to read" before anyone reads a word. Add blank lines between conceptual groups. Keep paragraphs short -- 3-5 sentences maximum -- and use horizontal rules sparingly to separate major sections.

**Incorrect (wall of text with no visual breaks):**

```markdown
Configure the database connection by setting the `DB_HOST`
variable. The default port is 5432. You can override this with
`DB_PORT`. Authentication uses the `DB_USER` and `DB_PASS`
variables. For production, enable SSL by setting `DB_SSL=true`.
Connection pooling is controlled by `DB_POOL_SIZE`. The default
pool size is 10 connections. Increase this for high-traffic
applications. Monitor pool usage with the `/metrics` endpoint.
```

**Correct (content grouped by topic with breathing room):**

```markdown
Configure the database connection by setting the `DB_HOST`
variable. The default port is 5432, overridden with `DB_PORT`.

Authentication uses `DB_USER` and `DB_PASS`. For production,
enable SSL by setting `DB_SSL=true`.

Connection pooling is controlled by `DB_POOL_SIZE` (default: 10).
Monitor pool usage at the `/metrics` endpoint.
```

Reference: [Nielsen Norman Group — How users read on the web](https://www.nngroup.com/articles/how-users-read-on-the-web/)
