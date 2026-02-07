---
title: One doc type per file
impact: CRITICAL
tags: structure, diataxis, doc-types
---

## One doc type per file

Follow the Diataxis framework: each document should be exactly one type -- tutorial, how-to, reference, or explanation. Mixing types confuses readers because each type serves a different need and reading mode. When a document drifts into another type, split it into separate files and link between them.

**Incorrect (mixed tutorial, reference, and explanation in one file):**

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

**Correct (separate files, each one type):**

```markdown
<!-- tutorial-authentication.md -->
# Tutorial: Add login to your app
Follow these steps to add authentication...

<!-- reference-auth-api.md -->
# Auth API reference
### POST /auth/token
Parameters:
- grant_type (required): The OAuth grant type...

<!-- explanation-auth-architecture.md -->
# How authentication works
The system uses a three-legged OAuth flow where...
```

Reference: [Diataxis framework](https://diataxis.fr/)
