---
title: One doc type per file
impact: CRITICAL
tags: structure, diataxis, doc-types, compass
---

## One doc type per file

Per Diataxis, each document is exactly one type: tutorial, how-to guide, reference, or explanation. Each serves a different need and reading mode, so mixing them fails every reader at once. Classify with the compass: does the content serve action (doing) or cognition (understanding), and is the reader acquiring a skill or applying one?

| | Acquisition | Application |
|---|---|---|
| **Action** | Tutorial: a lesson, "we" voice, reliable result, no options | How-to: a task for a competent reader, no teaching |
| **Cognition** | Explanation: "About X", context and alternatives | Reference: neutral description mirroring the product's structure |

When one page answers differently for different sections, split it into separate files and link between them. Name each by its type: a how-to says exactly what it shows ("Rotate API tokens"), an explanation reads with an implicit "About" ("How authentication works").

**Incorrect (tutorial, reference, and explanation in one file):**

```markdown
# Authentication

## Getting started with auth
Follow these steps to add login to your app...

## API reference
### POST /auth/token
Parameters:
- grant_type (required): The OAuth grant type...

## How authentication works
The system uses a three-legged OAuth flow where...
```

**Correct (separate files, each one type, cross-linked):**

```markdown
<!-- tutorials/add-login.md -->
# Add login to your app
In this tutorial, we add authentication to the sample app...
See [How authentication works](../explanation/authentication.md) for the why.

<!-- reference/auth-api.md -->
# Auth API
### POST /auth/token
Parameters:
- grant_type (required): The OAuth grant type...

<!-- explanation/authentication.md -->
# How authentication works
The system uses a three-legged OAuth flow where...
```

Reference: [Diataxis framework](https://diataxis.fr/), [Diataxis compass](https://diataxis.fr/compass/)
