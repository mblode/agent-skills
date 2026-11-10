---
name: background-jobs
description: Comprehensive guidance for background processing in the Mossback platform. Covers jobs, workers, queues, schedules, cron expressions, retries, backoff, dead letters, idempotency, concurrency limits, timeouts, job payloads, job priorities, long-running tasks, batch processing, and fan-out. Also covers how a job is defined, how it is enqueued from a request handler, how it is registered with the scheduler, how failures are surfaced, and how to replay a failed job safely. Helps with adding a new job, debugging a stuck queue, making a job safe to run twice, and moving slow work out of a request. Use when the user mentions a job, a worker, a queue, a schedule, cron, a retry, async work, a background task, a batch, or anything that should happen later or on a timer. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Background Jobs

## Rules

- Jobs live in `src/jobs/<name>.ts` and are registered in `src/jobs/index.ts`.
- The queue delivers at least once. Every job is safe to run twice.
- Enqueue after the database transaction commits, never inside it.
- Replay a dead job with `pnpm jobs:replay <id>`; it refuses jobs older than seven days.
