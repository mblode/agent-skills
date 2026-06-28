---
title: Use Consistent kebab-case Flags
impact: HIGH
impactDescription: makes flags guessable and scriptable across the whole CLI
tags: cli, flags, naming
---

## Use Consistent kebab-case Flags

Long flags are kebab-case (`--dry-run`, not `--dryRun` or `--dry_run`), every flag that takes a value names it the same way across commands, and short aliases are reserved for the few common flags. Surprising aliases (`-p` meaning `--port` in one command and `--project` in another) are worse than none.

**Incorrect (mixed casing, inconsistent aliases for the same concept):**

```text
$ mytool build --dryRun --out_dir dist
$ mytool deploy -d            # -d means --dry-run here
$ mytool serve -d ./public    # -d means --dir here: collision
```

**Correct (kebab-case, one meaning per alias):**

```text
$ mytool build --dry-run --out-dir dist
$ mytool deploy --dry-run
$ mytool serve --dir ./public
# short aliases only for the handful that are truly common, never reused
```
