import type { Job, JobHandler, Queue } from "./types.ts";

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 2_000;
const IDLE_POLL_MS = 500;

function backoffMs(attempt: number): number {
  return BASE_DELAY_MS * 2 ** attempt;
}

export async function runJob(job: Job, handlers: Record<string, JobHandler>, queue: Queue): Promise<void> {
  const handler = handlers[job.type] as JobHandler<unknown> | undefined;
  if (!handler) {
    await queue.deadLetter(job, `no handler for ${job.type}`);
    return;
  }
  try {
    await handler(job.payload);
    await queue.ack(job.id);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    await queue.ack(job.id);
    if (job.attempt + 1 >= MAX_ATTEMPTS) {
      await queue.deadLetter(job, reason);
      return;
    }
    await queue.enqueue({ ...job, attempt: job.attempt + 1 }, backoffMs(job.attempt));
  }
}

export async function work(queue: Queue, handlers: Record<string, JobHandler>, signal: AbortSignal): Promise<void> {
  while (!signal.aborted) {
    const job = await queue.reserve();
    if (!job) {
      await new Promise((resolve) => setTimeout(resolve, IDLE_POLL_MS));
      continue;
    }
    await runJob(job, handlers, queue);
  }
}
