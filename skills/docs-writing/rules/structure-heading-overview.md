---
title: Follow every heading with an orienting sentence
impact: CRITICAL
tags: structure, headings, introductions
---

## Follow every heading with an orienting sentence

A heading followed directly by a subheading, list, or code block leaves the reader to infer what the section is for and why it matters. One sentence orients them: what this covers and when they need it. Google's guide puts it as "don't use empty headings."

The allowance is reference pages: an entry heading (`### POST /auth/token`, `### --timeout`) followed by its signature or parameter table is the standard pattern Diataxis asks reference to adopt, and a sentence there would be padding. Everywhere else, write the sentence.

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

This applies to a heading followed by a subheading too: add a sentence between them.

Reference: [Google developer documentation style guide: Headings](https://developers.google.com/style/headings), [Diataxis: Reference](https://diataxis.fr/reference/)
