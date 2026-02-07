---
title: Numbered for sequential, bullets for non-sequential
impact: CRITICAL
tags: structure, lists, numbered, bullets
---

## Numbered for sequential, bullets for non-sequential

Use numbered lists only when order matters: step-by-step procedures, ranked results, or sequences where step 2 depends on step 1. Use bullet lists for everything else: feature lists, options, requirements, supported platforms. Numbering a non-sequential list falsely implies priority or order.

Avoid mixing sequential and non-sequential items in the same list.

**Incorrect (numbered list where order doesn't matter):**

```markdown
## Supported platforms

1. macOS 12 or later
2. Ubuntu 22.04 LTS
3. Windows 11
4. Debian 12

## Features

1. Automatic retries on failure
2. Built-in rate limiting
3. TLS encryption by default
```

**Correct (bullets for non-sequential, numbers for sequential):**

```markdown
## Supported platforms

- macOS 12 or later
- Ubuntu 22.04 LTS
- Windows 11
- Debian 12

## Install the CLI

1. Download the binary for your platform.
2. Move it to a directory in your `PATH`.
3. Run `acme --version` to verify the installation.
```
