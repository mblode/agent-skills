---
title: Ship --help and --version
impact: HIGH
impactDescription: the two flags every user tries first must work
tags: cli, help, discoverability
---

## Ship --help and --version

`--help` (and `-h`) and `--version` (and `-V`) are the first thing a developer types when they meet a CLI. Help must list commands, flags, and at least one example; version must print the package version and exit 0. A tool that errors or hangs on these flags signals it ignores convention everywhere.

**Incorrect (unknown flag, non-zero exit, no usage):**

```text
$ mytool --help
error: unknown option '--help'
$ echo $?
1
```

**Correct (usage with an example; version prints and exits 0):**

```text
$ mytool --help
Usage: mytool <command> [options]

Commands:
  init            Create a config file
  build [dir]     Build the project

Options:
  -h, --help      Show this help
  -V, --version   Print version

Example:
  mytool build ./src --watch
$ mytool --version
1.4.2
```
