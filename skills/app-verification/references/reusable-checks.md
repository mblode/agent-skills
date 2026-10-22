# Reusable API and Flow Checks

Read when adding API checks, mutating flow checks, or captures from several platforms. Implement these contracts in the repo's existing runner and feature map; do not add a competing harness.

## API requests that survive environment changes

Keep the request definition and its assertions as a versioned artifact. Extend an existing request before adding another. Use the repo's established format, such as a Bruno collection or executable API test; Bruno is not a required dependency. Parameterize hosts, credentials and fixture identifiers, preserving the method, operation, input semantics and behavioral assertions across environments.

Assert the changed behavior: response fields, GraphQL errors, persisted state or rejection semantics, not just HTTP success. A request with zero assertions is unchecked even when the runner exits zero. Keep setup, dependent requests and cleanup in one reproducible invocation when they share runtime variables.

Record the artifact revision or content hash, runner version, environment, served build identity, nonsecret fixture identifiers and per-assertion outcomes. A local pass does not establish QA or production acceptance. A later environment runs the same artifact revision; if it must change, explain the difference and rerun earlier stages before claiming parity. Do not weaken assertions to accommodate a failure.

Credentials stay in the repo's existing secret mechanism. Redact sensitive URLs, headers and bodies from evidence. Running later deployment stages requires authorization for that environment and its effects; this workflow does not grant permission to deploy or mutate production. Name stages that were not run.

## Scenario coverage and checked cleanup

Associate each claimed scenario with its expected observable result and at least one assertion that checks that result. Navigation steps may be actions only, but successful clicks cannot cover a scenario. A scenario without an assertion is unchecked and maps to skipped coverage with a reason. A failing assertion maps to failed coverage. One passing assertion elsewhere cannot upgrade either result.

For mutating checks, register each created resource immediately by a stable identifier, with its cleanup action and a postcondition proving removal or restoration. Run registered cleanups in reverse order even after an assertion aborts. Remove injected faults and release held requests before cleanup, so the test's own failure injection cannot sabotage it. Never delete resources solely because they share a test-looking prefix.

Check cleanup through an authoritative read or refreshed UI state. An accepted delete request alone is not proof of absence. Missing cleanup, failed cleanup, or an unproven postcondition records the resource and makes the run fail, while preserving the original test failure and evidence. If a create request times out after a possible write, reconcile using the run's unique identifier; unresolved creation is a reported cleanup gap. Process termination can prevent cleanup, so persist owned identifiers without secrets for recovery.

A fresh browser profile can still share server-side state. Use an account or namespace per run when possible; otherwise serialize mutations on the shared account. Fresh-account onboarding should use the project's test provisioning path. Report unavailable signup or OTP support as blocked rather than substituting a shared account whose onboarding already ran.

## Capture adapters

For a harness that needs web, native and terminal evidence, separate capture from reporting. Reuse the repo's existing renderer: browser screenshots, a native snapshot target, or a TUI frame exporter. Each adapter emits a common envelope with run identity, source revision and local edits, state id, capture conditions, artifact paths and failures. Preserve platform details: browser/viewport for web, device/OS/appearance for native, columns/rows/font for terminal. A TUI exporter can retain text and ANSI beside its image.

Compare only compatible conditions. A missing adapter is skipped coverage with a concrete reason; adding one belongs to the requested harness scope. Rendered snapshots prove appearance of their fixtures, not native navigation, keyboard handling or an entire flow. Keep those interaction checks separately mapped. Extend the existing proof record with artifact references rather than maintaining another coverage registry.

## Sources

Adapted from a private set of verification skills: reusable request artifacts, checked cleanup, and capture adapters. No vendor code is included. Organization-specific paths, build and auth conventions, and tool mandates are excluded. The bundle's one-assertion overall pass is replaced with scenario-level coverage. Existing isolation and failure-injection guidance remains authoritative.
