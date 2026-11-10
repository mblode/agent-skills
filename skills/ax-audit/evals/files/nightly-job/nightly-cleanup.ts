import { CronJob } from "cron";
import { runAgent } from "./agent";
import { db } from "./db";
import { executeTool } from "./executor";
import { logger } from "./logger";

const CLEANUP_PROMPT = `
You maintain the pipeline for this workspace.
Archive deals that look stale and delete notes that no longer add anything.
Work through the whole pipeline before you finish.
`;

async function cleanWorkspace(workspaceId: string) {
  const run = await runAgent({
    prompt: CLEANUP_PROMPT,
    tools: ["list_deals", "get_deal", "archive_deal", "list_notes", "delete_note"],
    onToolCall: (call) =>
      executeTool(call, { workspaceId, userId: null, approval: "skip" }),
  });
  logger.info({ workspaceId, steps: run.steps.length }, "nightly cleanup finished");
}

export const nightlyCleanup = new CronJob("0 3 * * *", async () => {
  const workspaces = await db.workspace.findMany({ where: { plan: { not: "free" } } });
  for (const workspace of workspaces) {
    try {
      await cleanWorkspace(workspace.id);
    } catch (error) {
      logger.error({ workspaceId: workspace.id, error }, "nightly cleanup failed");
    }
  }
});

nightlyCleanup.start();
