---
title: Every heading needs an intro paragraph
impact: CRITICAL
tags: structure, headings, introductions
---

## Every heading needs an intro paragraph

Never follow a heading directly with a subheading, list, or code block. Add at least one sentence explaining what the section covers and why the reader should care. This brief introduction provides context so readers can decide whether to keep reading or skip ahead.

Without an intro, sections feel like bare outlines. A single sentence is enough to orient the reader.

**Incorrect (heading jumps straight to a list):**

```markdown
## Configuration

- `DB_HOST`: The database hostname
- `DB_PORT`: The database port
- `DB_NAME`: The database name
```

**Correct (heading followed by an intro sentence):**

```markdown
## Configuration

Configure the database connection by setting these environment
variables in your `.env` file.

- `DB_HOST`: The database hostname (default: `localhost`)
- `DB_PORT`: The database port (default: `5432`)
- `DB_NAME`: The database name
```

This also applies when a heading is followed by a subheading. Add a sentence between them to explain the relationship.
