---
name: observability
description: Comprehensive guidance for logging, metrics, tracing, and alerting in the Mossback platform. Covers structured logs, log levels, log fields, request ids, correlation ids, counters, gauges, histograms, metric names, metric labels, spans, trace context, sampling, dashboards, alerts, alert thresholds, on-call routing, and service level objectives. Also covers how logs and metrics are emitted from request handlers and jobs, how to add a dashboard panel, how to add or tune an alert, and how to trace a slow request end to end. Helps with investigating an incident, finding why something is slow, adding instrumentation to new code, and reducing noisy alerts. Use when the user mentions logs, logging, a metric, a dashboard, an alert, tracing, monitoring, latency, an incident, on-call, or asks how to see what the system is doing. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Observability

## Rules

- Log through `request.log` or `job.log` with an object first and a message second.
- Never log an email address, phone number, or street address. Log the internal id.
- Metric names are snake case with the unit as a suffix, registered in `src/observability/metrics.ts`.
- An alert is added in `ops/alerts/<service>.yaml` with a runbook link.
