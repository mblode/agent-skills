---
title: Start with the bottom line
impact: CRITICAL
tags: structure, bluf, introduction, purpose
---

## Start with the bottom line

The first paragraph should tell readers what the document covers and what they'll be able to do after reading it ("bottom line up front"). State the problem and the outcome in the opening paragraph. Save backstory for later or put it in a separate explanation doc.

**Incorrect (buries the purpose under background):**

```markdown
# Deploying to production

In the early days of our platform, deployments were done manually
using SSH. Over time, we developed an internal tool that automated
parts of the process. In version 2.3, we introduced the deploy
pipeline, which builds on lessons learned from these earlier
approaches. This guide covers the deploy pipeline.
```

**Correct (leads with the purpose and outcome):**

```markdown
# Deploying to production

This guide shows you how to deploy your application to production
in under 5 minutes. You'll configure the build pipeline, set
environment variables, and trigger your first deploy.

Before you begin, make sure you have the CLI installed and access
to the production project.
```

Reference: [Write the Docs — Writing style](https://www.writethedocs.org/guide/writing/style-guides/)
