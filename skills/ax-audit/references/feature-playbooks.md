# Feature Playbooks

Detect each agentic feature from element + filename + route signals, then run its checks in order. Every check names a rule file in `rules-ax/` (Layer 2, agentic experience) or `rules-arch/` (Layer 1, architecture, marked explicitly).

The tier in parentheses is the rule's override for that surface, copied here for scanning. **The rule file's override table is authoritative**: if they disagree, the rule file wins.

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
| agent chat / copilot | `<Chat>`, `<Assistant>`, `<Copilot>`, `role="assistant"`, `isStreaming`, `aiResponse`, `completion`, `useChat`, `useCompletion`, route `/chat`, `/assistant`, `/copilot` |
| agent tool execution / action panel | `<ToolCall>`, `<Action>`, `tool_use`, `function_call`, `executeAction`, `agentAction`, component `*ToolPanel*`, `*ActionLog*` |
| agent configuration / system prompt editor | `<SystemPrompt>`, `<AgentConfig>`, `<PromptEditor>`, route `/agent/settings`, `/configure`, `systemPrompt` |
| agent dashboard / status | `<AgentStatus>`, `<TaskList>`, `<RunHistory>`, `<RunLog>`, component `*AgentDashboard*`, route `/agent`, `/runs` |

No agentic features detected → stop; this skill does not apply. Route to `ui-audit`.

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
6. **`trust-no-refusal-path`** (fix-this-sprint): the agent can decline a request it cannot serve, instead of completing the nearest thing it can reach.
7. **`comm-no-intent-handshake`** (fix-this-sprint): non-trivial or destructive actions confirmed before execution.
8. **`control-over-conversational`** (fix-this-sprint): parallel direct-manipulation controls exist for common actions; users not forced into chat.
9. **`context-memory-not-visible`** (fix-this-sprint): the user can see and edit what the agent remembers across sessions.
10. **`context-unscoped-tool-surface`** (rules-arch, fix-this-sprint): the run carries the tools and procedures this task needs, not the whole product surface.
11. **`comm-no-generative-momentum`** (backlog): blank-canvas entry points offer an agent-generated draft when the agent has the context.
12. **`context-volatile-prompt-prefix`** (rules-arch, backlog): per-turn values sit behind the stable prompt, so the provider's prefix cache survives the turn.

## Agent Tool Execution / Action Panel

User need: understand what the agent is doing, stop it if wrong, trust the outcome. Checks in order:

1. **`trust-no-escalation-path`** (release-blocker): high-stakes actions (deletes, payments, external calls) can hand off to a human first.
2. **`granularity-raw-primitive-escape`** (rules-arch, release-blocker): no raw eval, shell, or query passthrough over production data sits alongside the domain tools, making every boundary above it advisory.
3. **`control-no-approval-gate`** (release-blocker): the approval UI matches the stakes and reversibility of the action.
4. **`comm-no-approval-gate`** (rules-arch, release-blocker): a gate exists on the orchestrator's execution path and every tool reaches it, not just the ones with a confirmation dialog at the call site.
5. **`granularity-permissive-tool-schema`** (rules-arch, release-blocker on this surface): constraints live in the schema, so an invalid target cannot be named in a well-formed call.
6. **`control-no-escape-hatch`** (release-blocker): every completed action has undo or revise; the user is never locked into an agent decision.
7. **`comm-no-progress-visibility`** (rules-arch, release-blocker): the server emits step-level events during a multi-step run; `comm-no-progress-signal` covers whether the UI shows them.
8. **`comm-no-completion-signal`** (rules-arch, release-blocker): completion is explicitly signalled (`stop_reason`, completion tool), never inferred from idle time.
9. **`comm-no-intent-handshake`** (release-blocker on this surface): ambiguous or multi-interpretation requests get a playback/confirmation before the agent acts.
10. **`trust-no-refusal-path`** (release-blocker on this surface): an unservable request ends in a stated refusal, not an improvised write to real state.
11. **`comm-no-subagent-attribution`** (rules-arch, fix-this-sprint): fan-out results carry their branch, and a failed branch is reported rather than filtered into silence.
12. **`context-under-contextual`** (fix-this-sprint on this surface): the agent uses available context (current page, selection, recent actions) instead of asking redundant questions.
13. **`granularity-static-api-mapping`** (rules-arch, backlog): evolving APIs use discover + access tools, not one hard-coded tool per endpoint.

## Agent Configuration / System Prompt Editor

User need: customize agent behavior without breaking it, understand what changed. Checks in order:

1. **`parity-no-tool-parity`** (rules-arch, release-blocker): every UI config option has an agent-accessible equivalent; no GUI-only settings.
2. **`granularity-raw-primitive-escape`** (rules-arch, release-blocker): a config surface cannot register a substrate tool that reaches production data unnarrowed.
3. **`granularity-workflow-shaped-tool`** (rules-arch, fix-this-sprint): config tools are atomic primitives, not bundled workflows that hide individual options.
4. **`granularity-permissive-tool-schema`** (rules-arch, fix-this-sprint): tool parameters express their constraints as types, not as prose in the description.
5. **`context-starvation`** (rules-arch, fix-this-sprint): the system prompt injects available resources, tools, and constraints so the agent knows what it can do.
6. **`context-unscoped-tool-surface`** (rules-arch, fix-this-sprint): the other end of the same budget, so growing the prompt to satisfy the check above does not ship every procedure on every run.
7. **`context-memory-not-visible`** (fix-this-sprint): the user can see the full context the agent receives, including injected system prompts.
8. **`context-no-adaptive-canvas`** (backlog): the UI surfaces downstream effects when config changes alter agent behavior.

## Agent Dashboard / Status

User need: see what the agent has done, what it's doing now, and what went wrong. Checks in order:

1. **`comm-no-completion-signal`** (rules-arch, release-blocker): completed tasks are explicitly marked done, not left ambiguous.
2. **`parity-crud-incomplete`** (rules-arch, release-blocker): tasks have full CRUD: create, view, cancel, retry, and delete.
3. **`comm-no-progress-visibility`** (rules-arch, fix-this-sprint on this surface): the run loop emits step events the dashboard can subscribe to or poll, not just a start and end row.
4. **`comm-no-subagent-attribution`** (rules-arch, fix-this-sprint): a fan-out run reports per-branch state and partial coverage, so a skipped branch is visible rather than absent.
5. **`trust-no-confidence-cues`** (fix-this-sprint): completed results include reasoning or a summary of what was done and why.
6. **`context-memory-not-visible`** (backlog on this surface): the agent's accumulated context is viewable and editable.
7. **`context-no-checkpoint-resume`** (rules-arch, backlog): interrupted or failed tasks resume from the last checkpoint, not from scratch.

## Coverage

All 29 rules are reachable: 12 via chat, 13 via tool execution, 8 via config, 7 via dashboard, 1 diff-wide (rules repeat across playbooks; unique total = 29). To add a rule, copy `rules-<layer>/_template.md` as the starting structure, then add the rule to at least one playbook or it will never run.
