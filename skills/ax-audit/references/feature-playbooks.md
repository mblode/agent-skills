# Feature Playbooks

Detect each agentic feature from element + filename + route signals, then run its checks in order. Every check names a rule file in `rules-ax/` (Layer 2, agentic experience) or `rules-arch/` (Layer 1, architecture, marked explicitly).

The tier in parentheses is a scan copy of the rule's override for that surface. The rule file's override table wins if they disagree.

## Table of contents

- [Feature detection](#feature-detection)
- [Diff-wide checks](#diff-wide-checks)
- [Agent Chat / Copilot](#agent-chat--copilot)
- [Agent Tool Execution / Action Panel](#agent-tool-execution--action-panel)
- [Agent Configuration / System Prompt Editor](#agent-configuration--system-prompt-editor)
- [Agent Dashboard / Status](#agent-dashboard--status)
- [Coverage](#coverage)

## Feature detection

| Feature | Detect by |
|---|---|
| agent chat / copilot | `<Chat>`, `<Assistant>`, `<Copilot>`, `role="assistant"`, `aiResponse`, `useChat`, `useCompletion`, `chatCompletion`, route `/chat`, `/assistant`, `/copilot` |
| agent tool execution / action panel | `<ToolCall>`, `tool_use`, `function_call`, `executeAction`, `agentAction`, `server.tool(`, `registerTool(`, `runAgent(`, `toolApproval`, `needsApproval`, `addToolApprovalResponse`, `canUseTool`, `PreToolUse`, `ToolLoopAgent`, `destructiveHint`, `ui/resourceUri`, component `*ToolPanel*`, `*ActionLog*` |
| agent configuration / system prompt editor | `<SystemPrompt>`, `<AgentConfig>`, `<PromptEditor>`, route `/agent/settings`, `/configure`, `systemPrompt`, `permissionMode`, `allowedTools` |
| agent dashboard / status | `<AgentStatus>`, `<TaskList>`, `<RunHistory>`, `<RunLog>`, `RUN_FINISHED`, component `*AgentDashboard*`, route `/agent`, `/runs` |

**The table is illustrative, not exhaustive.** It lists the signals seen most often, not every form agent code takes. A handler registered as `server.tool("send_invoice", ...)`, or an executor reached only as `runAgent(...)` from a scheduler, is an agentic surface whether or not it matches a listed string. Detect on what the code does; the table is a starting sweep, not a checklist that licenses "no agentic features detected" over obvious executor code.

**Weak signals, never on their own.** `completion`, `isStreaming`, and `<Action>` match ordinary non-agentic code: a progress percentage (`const completion = done / total`), a video upload flag, and a generic icon-button component. Count any of them only alongside a strong signal from the table. A chat surface detected from a bare `completion`, or a tool-execution surface from a toolbar's `<Action>`, runs a full playbook against a form and produces exactly the noise the stop condition below exists to prevent.

No agentic features detected → stop; this skill does not apply. Route to `ui-design` Audit mode.

## Diff-wide checks

Run on every PR-mode audit, regardless of detected features:

1. **`parity-orphan-ui-action`** (rules-arch, fix-this-sprint): the diff adds a UI capability (button, form action, route handler) with no matching tool in the same PR; each orphan widens the user/agent capability gap.

## Agent Chat / Copilot

User need: get help from the agent, trust its output, control what it does. Checks in order:

1. **`comm-no-progress-signal`** (release-blocker): streaming/thinking indicator visible during the response; never a frozen UI.
2. **`control-no-escape-hatch`** (release-blocker): chat-triggered actions are interruptible mid-execution and reversible after completion.
3. **`context-no-injection`** (rules-arch, release-blocker): sessions initialize with dynamic context (preferences, recent activity, project state), not a bare static prompt.
4. **`trust-no-confidence-cues`** (fix-this-sprint): output includes rationale or sources so the user can verify correctness.
5. **`trust-no-uncertainty-markers`** (fix-this-sprint): agent hedges when uncertain rather than presenting guesses as fact.
6. **`comm-no-intent-handshake`** (fix-this-sprint): non-trivial or destructive actions confirmed before execution.
7. **`control-thin-approval-payload`** (fix-this-sprint): chat-triggered approvals show the call's arguments, not just the tool's name; the user approves an act, not a category.
8. **`control-over-conversational`** (fix-this-sprint): parallel direct-manipulation controls exist for common actions; users not forced into chat.
9. **`context-memory-not-visible`** (fix-this-sprint): the user can see and edit what the agent remembers across sessions.
10. **`comm-no-generative-momentum`** (backlog): blank-canvas entry points offer an agent-generated draft when the agent has the context.

## Agent Tool Execution / Action Panel

User need: understand what the agent is doing, stop it if wrong, trust the outcome. Checks in order:

1. **`trust-no-escalation-path`** (release-blocker): high-stakes actions (deletes, payments, external calls) can hand off to a human first.
2. **`control-no-approval-gate`** (release-blocker): the approval UI matches the stakes and reversibility of the action.
3. **`comm-no-approval-gate`** (rules-arch, release-blocker): a gate exists on the orchestrator's execution path and every tool reaches it, not just the ones with a confirmation dialog at the call site.
4. **`control-thin-approval-payload`** (release-blocker on this surface): the gate renders the call's arguments, target, and blast radius; a prompt naming only the tool is a click-through. Runs after check 2, which establishes that a gate exists at all.
5. **`comm-unrequested-action-no-consent`** (release-blocker on this surface): scheduled, webhook, and queue entry points that reach the executor carry a standing consent boundary and emit a notice the user can act on. Checks 2 to 4 only cover the path a user started.
6. **`control-no-escape-hatch`** (release-blocker): every completed action has undo or revise; the user is never locked into an agent decision.
7. **`comm-no-progress-visibility`** (rules-arch, release-blocker): the server emits step-level events during a multi-step run; `comm-no-progress-signal` covers whether the UI shows them.
8. **`comm-no-completion-signal`** (rules-arch, release-blocker): completion is explicitly signalled (`stop_reason`, completion tool), never inferred from idle time.
9. **`parity-unstructured-tool-output`** (rules-arch, release-blocker on this surface): tool handlers return a typed result whose failure branch is machine-readable, never prose with a success status.
10. **`comm-no-intent-handshake`** (release-blocker on this surface): ambiguous or multi-interpretation requests get a playback/confirmation before the agent acts.
11. **`trust-undisclosed-access-scope`** (release-blocker on this surface): the accounts and scopes the agent acts through are visible and individually revocable; undisclosed reach on an autonomous surface is the case the user cannot discover by watching.
12. **`context-under-contextual`** (fix-this-sprint on this surface): the agent uses available context (current page, selection, recent actions) instead of asking redundant questions.
13. **`granularity-static-api-mapping`** (rules-arch, backlog): evolving APIs use discover + access tools, not one hard-coded tool per endpoint.

## Agent Configuration / System Prompt Editor

User need: customize agent behavior without breaking it, understand what changed. Checks in order:

1. **`parity-no-tool-parity`** (rules-arch, release-blocker): every UI config option has an agent-accessible equivalent; no GUI-only settings.
2. **`granularity-workflow-shaped-tool`** (rules-arch, fix-this-sprint): config tools are atomic primitives, not bundled workflows that hide individual options.
3. **`context-starvation`** (rules-arch, fix-this-sprint): the system prompt injects available resources, tools, and constraints so the agent knows what it can do.
4. **`trust-undisclosed-access-scope`** (fix-this-sprint): connected accounts, their scopes, and what is retained are all nameable in the user's terms, with a revoke per connector rather than one global disconnect.
5. **`context-memory-not-visible`** (fix-this-sprint): the user can see the full context the agent receives, including injected system prompts.
6. **`context-no-adaptive-canvas`** (backlog): the UI surfaces downstream effects when config changes alter agent behavior.

## Agent Dashboard / Status

User need: see what the agent has done, what it's doing now, and what went wrong. Checks in order:

1. **`comm-no-completion-signal`** (rules-arch, release-blocker): completed tasks are explicitly marked done, not left ambiguous.
2. **`parity-crud-incomplete`** (rules-arch, release-blocker): tasks have full CRUD: create, view, cancel, retry, and delete.
3. **`comm-no-progress-visibility`** (rules-arch, fix-this-sprint on this surface): the run loop emits step events the dashboard can subscribe to or poll, not just a start and end row.
4. **`trust-no-confidence-cues`** (fix-this-sprint): completed results include reasoning or a summary of what was done and why.
5. **`comm-unrequested-action-no-consent`** (fix-this-sprint on this surface): unattended runs appear here with what they touched and a way back; the dashboard is where a scheduled action becomes visible at all, so a missing notice is the defect rather than a report of one.
6. **`context-memory-not-visible`** (backlog on this surface): the agent's accumulated context is viewable and editable.
7. **`context-no-checkpoint-resume`** (rules-arch, backlog): interrupted or failed tasks resume from the last checkpoint, not from scratch.

## Coverage

All 27 rules are reachable: 10 via chat, 13 via tool execution, 6 via config, 7 via dashboard, 1 diff-wide (rules repeat across playbooks; unique total = 27). To add a rule, copy `rules-<layer>/_template.md` as the starting structure, then add the rule to at least one playbook or it will never run.
