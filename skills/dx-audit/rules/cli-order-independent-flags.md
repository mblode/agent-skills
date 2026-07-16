---
title: Accept Flags in Any Position
impact: HIGH
impactDescription: lets a user append a flag to the last command without reordering it
tags: cli, flags, parsing
---

## Accept Flags in Any Position

Users build a command by hitting up-arrow and appending a flag, so a flag must work whether it comes before or after the subcommand and its arguments. Accepting `mytool --verbose build` but rejecting `mytool build --verbose` fails the most common way people edit a command.

**Incorrect (a global flag only parses before the subcommand):**

```text
$ mytool --verbose build ./src
ok
$ mytool build ./src --verbose
error: unknown option '--verbose'
```

**Correct (the flag is accepted in either position):**

```text
$ mytool --verbose build ./src
ok
$ mytool build ./src --verbose
ok
```
