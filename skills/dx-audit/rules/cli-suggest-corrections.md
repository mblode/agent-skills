---
title: Suggest a Correction on a Near Miss
impact: HIGH
impactDescription: turns a typo into a one-line recovery instead of a dead end
tags: cli, errors, discoverability, suggestions
---

## Suggest a Correction on a Near Miss

When a user types an unknown command or flag that is one edit away from a real one, name the closest match rather than a bare "unknown command," and exit non-zero. Suggest, do not silently run the guessed command: a wrong guess that mutates state is worse than the error.

**Incorrect (bare rejection, no hint):**

```text
$ mytool buld ./src
error: unknown command 'buld'
$ echo $?
1
```

**Correct (name the closest match, still exit non-zero):**

```text
$ mytool buld ./src
error: unknown command 'buld'. Did you mean 'build'?
$ echo $?
1
```
