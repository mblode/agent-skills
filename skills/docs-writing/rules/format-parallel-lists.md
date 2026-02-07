---
title: Keep list items parallel in structure
impact: MEDIUM-HIGH
tags: lists, parallelism, consistency
---

## Keep list items parallel in structure

Every item in a list must follow the same grammatical pattern. If one item starts with a verb, all items start with verbs; if one is a noun phrase, all are noun phrases -- mixed structures force the reader to re-parse each item.

**Incorrect (mixed grammatical patterns):**

```markdown
- Configure the database
- Authentication setup
- You need to deploy the application
- Monitoring
```

**Correct (all items start with imperative verbs):**

```markdown
- Configure the database
- Set up authentication
- Deploy the application
- Enable monitoring
```

Reference: [Google developer documentation style guide — Lists](https://developers.google.com/style/lists)
