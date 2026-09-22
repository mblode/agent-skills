// apps/api/src/instrumentation.ts (and the same in apps/worker)
// Loaded before the app with `node --import ./dist/instrumentation.js dist/main.js`,
// so instrumentation patches modules before anything imports them. Exporting an
// initializer that nothing calls is the failure this file exists to prevent:
// importing it is the initialization.
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? "{{service_name}}",
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// The completion hook. The entrypoint's shutdown handler calls this last, after
// closing the server or draining the worker, so the final spans and log lines
// before a deploy or crash are flushed rather than dropped.
export function shutdownTelemetry(): Promise<void> {
  return sdk.shutdown();
}
