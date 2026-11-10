import { PostHog } from "posthog-node";

type Area = "billing" | "catalog" | "checkout" | "account";

const client = new PostHog(process.env.POSTHOG_PROJECT_KEY ?? "", {
  host: process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com",
  flushAt: 1,
});

export function captureError(error: unknown, context: { area: Area; requestPath?: string; customerId?: string }): void {
  const exception = error instanceof Error ? error : new Error(String(error));
  client.captureException(exception, context.customerId ?? "anonymous", {
    area: context.area,
    request_path: context.requestPath,
  });
}
