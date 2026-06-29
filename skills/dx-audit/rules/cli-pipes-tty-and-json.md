---
title: Respect Pipes and the TTY
impact: HIGH
impactDescription: makes output safe to pipe, parse, and redirect
tags: cli, tty, pipes, json, stdin
---

## Respect Pipes and the TTY

A well-behaved CLI checks whether it talks to a terminal or a pipe. Disable color and spinners when `stdout` is not a TTY, offer `--json` for machine-readable output, write progress and logs to `stderr` so they never corrupt piped `stdout`, and read `stdin` when no file argument is given. Otherwise ANSI codes and spinner frames land in the file the user redirected to.

**Incorrect (color and progress always on, mixed into stdout):**

```ts
console.log(chalk.green("✓ done"));      // ANSI codes land in piped output
console.log(`Processing ${file}...`);    // progress pollutes stdout
// no --json, no stdin support
```

**Correct (TTY-aware, machine output on request, progress to stderr):**

```ts
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
if (flags.json) {
  process.stdout.write(JSON.stringify(result)); // clean, parseable
} else {
  console.error(`Processing ${file}...`);        // progress to stderr
  console.log(useColor ? chalk.green("✓ done") : "done");
}
const input = file ? readFile(file) : readStdin(); // read stdin when no file
```
