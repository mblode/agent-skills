---
title: Every section earns its place
impact: CRITICAL
tags: structure, length, redundancy, padding
---

## Every section earns its place

A section that restates another section, or that exists because the format seemed to expect it, costs the reader a scan and returns nothing. Cut it rather than filling it. The usual offenders are a summary that repeats the introduction, an "Overview" that only lists the headings below it, a "Conclusion" on reference material, and a "Prerequisites" heading with nothing under it.

Test each section against the one before it: if a reader who read the previous section learns nothing new here, it is padding. Length should follow from what the reader has to do, never from the shape of a template.

**Incorrect (opens by announcing itself, closes by repeating itself):**

```markdown
## Overview

This section covers how to configure webhooks. We will look at
creating an endpoint, setting the retry policy, and verifying
signatures. Webhooks are an important part of the platform.

## Configure webhooks

Create an endpoint at any HTTPS URL you control...

## Summary

In this section, we covered how to configure webhooks, including
creating an endpoint, setting the retry policy, and verifying
signatures.
```

**Correct (one section, no framing around it):**

```markdown
## Configure webhooks

Create an endpoint at any HTTPS URL you control...
```

Reference: [Diataxis: the map is not the territory](https://diataxis.fr/)
