---
title: Include a quick start for getting-started docs
impact: CRITICAL
tags: structure, quick-start, onboarding, getting-started
---

## Include a quick start for getting-started docs

Every getting-started or README document should include a minimal Quick Start section (3-5 steps) for readers who just want the thing to work. Many readers arrive with high motivation and low patience. A Quick Start lets them see results immediately and build confidence before diving into detailed configuration.

Place the Quick Start early in the document, before detailed explanations. Link to the full guide for readers who want more context.

**Incorrect (requires reading 10 sections before the first command):**

```markdown
# Getting started

## Overview
Acme CLI is a tool for managing cloud deployments...

## Architecture
The CLI communicates with the Acme API using...

## System requirements
You'll need the following installed...

## Authentication concepts
Acme uses OAuth 2.0 for authentication...

(four more sections before the first command)
```

**Correct (Quick Start gets the reader to "Hello World" fast):**

```markdown
# Getting started

## Quick start

Get a working deployment in under 2 minutes:

1. Install the CLI:
   ```bash
   brew install acme-cli
   ```
2. Log in to your account:
   ```bash
   acme login
   ```
3. Deploy the starter template:
   ```bash
   acme deploy --template hello-world
   ```

Your app is live at the URL shown in the output. For detailed
setup options, see [Configuration](configuration.md).
```

Reference: [Write the Docs — Getting started guide template](https://www.writethedocs.org/guide/)
