// packages/config/src/index.ts
// Parse the environment when an entrypoint asks, never at import. A module-level
// `export const env = schema.parse(process.env)` throws inside any test or tool
// that imports this package without the full environment, and a cached test run
// hides it until someone runs with the cache disabled.
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_DATABASE_URL: z.string().url(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
});

export type Config = z.infer<typeof schema>;

let cached: Config | undefined;

export function loadConfig(source: NodeJS.ProcessEnv = process.env): Config {
  if (cached) return cached;
  const result = schema.safeParse(source);
  if (!result.success) {
    const keys = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid configuration: ${keys}. See .env.example.`);
  }
  cached = result.data;
  return cached;
}
