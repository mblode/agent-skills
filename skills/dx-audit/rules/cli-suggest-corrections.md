---
title: Suggest a Correction on a Near Miss
impact: HIGH
impactDescription: turns a typo into a one-line recovery instead of a dead end
tags: cli, errors, discoverability, suggestions, agents
---

## Suggest a Correction on a Near Miss

When a user types an unknown command or flag one edit away from a real one, name the closest match rather than a bare "unknown command", and exit non-zero. Suggest, never run the guess: a wrong guess that mutates state is worse than the error, and an agent caller treats a silently corrected command as a hazard. In `--json` mode put the candidate in the error envelope (`details.suggestions`) so an automated caller can act on it without parsing prose.

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
