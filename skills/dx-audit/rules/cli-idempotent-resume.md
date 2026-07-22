---
title: Make Retries Idempotent and Resumable
impact: HIGH
impactDescription: prevents an ambiguous retry from duplicating a job, worktree, deployment, or charge
tags: cli, agents, automation, idempotency, resume
---

## Make Retries Idempotent and Resumable

Agents retry when a command times out or returns ambiguous output. A mutating long-running command
must detect an existing operation for the same stable target or accept an idempotency key, then
return that operation's id and state. Creating a second operation should require an explicit fresh
flag. A retry that silently duplicates work turns a recoverable timeout into conflicting state and
double cost.

**Incorrect (every retry creates another operation):**

```ts
const job = await createJob({ issue: flags.issue });
console.log(job.id);
```

**Correct (return the existing operation unless fresh work is explicit):**

```ts
const key = `issue:${flags.issue.toLowerCase()}`;
const existing = await findActiveJob(key);
if (existing && !flags.fresh) {
  printJson({ id: existing.id, resumed: true, state: existing.state });
  return;
}
const job = await createJob({ key, issue: flags.issue });
printJson({ id: job.id, resumed: false, state: job.state });
```
