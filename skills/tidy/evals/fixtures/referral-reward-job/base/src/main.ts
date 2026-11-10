import { handlers } from "./jobs/index.ts";
import type { Queue } from "./queue/types.ts";
import { work } from "./queue/worker.ts";

export function startWorker(queue: Queue): AbortController {
  const controller = new AbortController();
  work(queue, handlers, controller.signal).catch((error) => {
    console.error("worker stopped", error);
    process.exitCode = 1;
  });
  return controller;
}
