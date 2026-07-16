---
title: Guard Mutations with Dry-Run and Explicit Confirmation
impact: HIGH
impactDescription: stops an agent from executing a destructive op it cannot preview or undo
tags: cli, safety, dry-run, mutations, agents
---

## Guard Mutations with Dry-Run and Explicit Confirmation

A destructive command must be previewable and must never auto-execute for a caller that cannot answer a prompt, so offer `--dry-run` that validates and reports the plan without executing, confirm interactively in a TTY, and when stdin is not a TTY require an explicit `--yes` and fail naming the flag rather than hang on a prompt or proceed silently.

**Incorrect (deletes immediately, or hangs on a prompt under a pipe):**

```ts
program.command("delete <id>").action(async (id) => {
  await api.delete(id); // no preview, no confirmation, runs the moment it is called
  // or: await confirm({ message: "Delete?" }) hangs forever when piped
});
```

**Correct (dry-run previews; non-TTY requires an explicit flag):**

```ts
program
  .command("delete <id>")
  .option("--dry-run")
  .option("--yes")
  .action(async (id, flags) => {
    if (flags.dryRun) {
      console.error(`would delete ${id}`); // validate and report, no side effect
      return;
    }
    if (!process.stdin.isTTY && !flags.yes) {
      console.error(`refusing to delete ${id} without --yes`);
      process.exitCode = 1;
      return;
    }
    await api.delete(id);
  });
```
