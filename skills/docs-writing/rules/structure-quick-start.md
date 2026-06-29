---
title: Include a quick start for getting-started docs
impact: CRITICAL
tags: structure, quick-start, onboarding, getting-started
---

## Include a quick start for getting-started docs

Every getting-started or README doc needs a minimal Quick Start (3-5 steps) early, before detailed explanations. Readers arrive with high motivation and low patience: get them to results fast, then link to the full guide.

**Incorrect (buries the first command under background sections):**

```markdown
# Getting started

## Overview
Acme CLI is a tool for managing cloud deployments...

## Architecture
The CLI communicates with the Acme API using...

(six more sections before the first command)
```

**Correct (Quick Start gets the reader to "Hello World" fast):**

```markdown
# Getting started

## Quick start

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

Reference: [Write the Docs: Getting started guide template](https://www.writethedocs.org/guide/)
