# Evaluation scenarios

Rubric for changing this skill. Never loaded during a user audit. No runner: treat each `expected_behavior` as a pass/fail checklist and run it by hand (or a thin harness) against a fixture repo.

Ablate one rule at a time. Keep a rule only if a scenario below regresses without it. House opinions (evolution curve, costume vs intelligence, verdict thresholds) are not ablatable this way.

## Contents

- Scenarios 1-3: thin approval payload, unattended cron, prose tool result
- Scenarios 4-6: no agentic surface, weak detection signals, generic `Action` toolbar
- Scenarios 7-8: executor code outside the detection table, out-of-scope layers
- Scenarios 9-11: MCP `isError`, gate only in `canUseTool`, client-only Stop

## Scenario 1: thin approval on an execution surface

**Query:** "AX review this PR. The agent can send email."

**Fixture:** an `ApprovalDialog` that receives `call.args` and renders only `call.name`, on a tool-execution panel.

**Expected behavior:**
- Detects an agent tool-execution surface
- Runs `control-thin-approval-payload` and returns `fail` with `file:line`
- Assigns `release-blocker` from the rule's override table, not from stacking the generic bump
- Does not also file `control-no-approval-gate` on the same dialog (the gate exists)

## Scenario 2: unattended cron, interactive gates pass

**Query:** "Audit this for AX. We have approval dialogs on every tool."

**Fixture:** a `cron.schedule` job that calls `runAgent` with no standing policy and no user notification. Interactive tool calls go through a populated approval dialog.

**Expected behavior:**
- Interactive path passes `control-no-approval-gate` and `control-thin-approval-payload`
- `comm-unrequested-action-no-consent` fails, evidence names the cron entry point, not `runAgent`
- A path with a standing policy and no notice still fails (either half missing is enough)
- Assigned tier on the execution surface is `release-blocker`
- Does not report the cron path as `control-no-approval-gate`

## Scenario 3: prose tool result with HTTP 200

**Query:** "Can an agent use our product? Review the tool handlers."

**Fixture:** `sendInvoice` catches, logs, and returns `"Something went wrong."` with status 200. A sibling `draft_reply` tool returns a string on purpose.

**Expected behavior:**
- `parity-unstructured-tool-output` fails on `sendInvoice` with `file:line`
- `draft_reply` is `pass` or `suppressed` (the draft is the payload)
- Routes to this skill, not `dx-audit` (the question is whether an agent can recover, not whether a human likes the error string)
- Verdict is ❌ NOT READY

## Scenario 4: traditional form PR, no agentic surface

**Query:** "AX review this PR."

**Fixture:** a settings form with a loading-state bug and no chat, tools, or agent routes.

**Expected behavior:**
- Feature detection finds nothing
- Stops. Does not run the 27 rules
- Routes to `ui-design` Audit mode
- Does not file AX findings about the missing spinner

## Scenario 5: non-agentic code that trips a weak detection signal

**Query:** "AX review this PR."

**Fixture:** an onboarding widget computing `const completion = done / total`, and an upload component with an `isStreaming` flag for video. No chat, tools, agent routes, or model calls anywhere.

**Expected behavior:**
- Feature detection finds nothing; neither token counts as a signal on its own
- Stops. Does not run the chat playbook's rules
- Routes to `ui-design` Audit mode
- Regression guard: this scenario failed before the weak-signal rule was added to `feature-playbooks.md`, when bare `completion` and `isStreaming` were listed as chat signals

## Scenario 6: a generic toolbar named Action

**Query:** "AX review this PR."

**Fixture:** `function Action({ icon, onClick })`, a generic icon-button in a toolbar, beside a plain to-do list. No tool call, no executor, no agent context.

**Expected behavior:**
- Does not detect a tool-execution surface; `<Action>` alone is a weak signal
- Stops and routes to `ui-design` Audit mode
- Regression guard: two models independently invented this guard themselves when `<Action>` was listed as a strong signal

## Scenario 7: real executor code that matches no listed string

**Query:** "Can an agent use our product?"

**Fixture:** `server.tool("send_invoice", ...)` handlers, and a `cron.schedule` calling `runAgent(...)`. Neither matches `<ToolCall>`, `tool_use`, or `executeAction`.

**Expected behavior:**
- Detects a tool-execution surface anyway; the detection table is illustrative, not a checklist
- Does not report "no agentic features detected" over obvious executor code

## Scenario 8: correctly scoped audit with layers out of scope

**Query:** "AX review this PR." (a UI-only diff: an approval component, no orchestrator, no connectors)

**Expected behavior:**
- Rules whose layer is absent return `out-of-scope`, not `unknown`
- The self-check's 30% threshold counts only `unknown`, so the audit is not flagged INCOMPLETE
- With a release-blocker present, the verdict is ❌ NOT READY, not 🚫 INCOMPLETE
- Regression guard: two models both returned 🚫 INCOMPLETE here while holding two to six real blockers

## Scenario 9: MCP handler that reports failure without `isError`

**Query:** "Audit our MCP server for AX."

**Fixture:** `server.tool("send_invoice", ...)` whose `catch` returns `{ content: [{ type: "text", text: "Could not send the invoice." }] }` with no `isError`. A sibling tool returns `isError: true` with the same prose.

**Expected behavior:**
- `parity-unstructured-tool-output` fails on `send_invoice` with `file:line`, citing the missing `isError`
- The sibling is `pass`: the flag is the machine-readable half
- Does not report the prose text itself as the defect

## Scenario 10: gate that lives only in `canUseTool`

**Query:** "AX review this PR. Every tool goes through our approval callback."

**Fixture:** a Claude Agent SDK query with `canUseTool` prompting the user, and `allowedTools: ["Bash", "Write"]` bare in the same options.

**Expected behavior:**
- `comm-no-approval-gate` fails: allow rules resolve those tools before the callback runs, so the gate is off the path for them
- Fix names a `PreToolUse` hook or scoped rules, not a change to the callback body
- Does not also file `control-no-approval-gate` on the callback, which is well-shaped for the tools that do reach it

## Scenario 11: Stop button that stops the stream, not the run

**Query:** "Critique this AI feature."

**Fixture:** a chat panel whose Stop button calls `useChat().stop()`, and a route handler that calls `streamText` without `abortSignal` and whose tool `execute` functions ignore the signal.

**Expected behavior:**
- `control-no-escape-hatch` fails, evidence at the route handler and a tool `execute`, not at the button
- Tier is `release-blocker` on the chat surface per the rule's table
- A fixture where `req.signal` is threaded through both passes
