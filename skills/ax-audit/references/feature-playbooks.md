# Feature Playbooks

Detect each agentic feature from element + filename + route signals, then run its checks in order. Every check names a rule file in `rules-ax/` (Layer 2, agentic experience) or `rules-arch/` (Layer 1, architecture, marked explicitly).

The tier in parentheses is the rule's override for that surface, copied here for scanning. **The rule file's override table is authoritative**: if they ever disagree, the rule file wins.

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

No agentic features detected → stop; this skill does not apply. Route to `ux-audit`.

## Diff-wide checks

Run on every PR-mode audit, regardless of which features were detected:

1. **`parity-orphan-ui-action`** (rules-arch, fix-this-sprint): the diff adds a UI capability (button, form action, route handler) with no corresponding tool in the same PR. Each orphan widens the user/agent capability gap.

## Agent Chat / Copilot

User need: get help from the agent, trust its output, control what it does.

Checks (in order):

1. **`comm-no-progress-signal`** (release-blocker): streaming/thinking indicator visible during agent response; the user must never stare at a frozen UI.
2. **`control-no-escape-hatch`** (release-blocker): agent actions triggered from chat are interruptible mid-execution and reversible after completion.
3. **`context-no-injection`** (rules-arch, release-blocker): sessions initialize with dynamic context (preferences, recent activity, project state), not a bare static prompt.
4. **`trust-no-confidence-cues`** (fix-this-sprint): agent output includes rationale or sources so the user can verify correctness.
5. **`trust-no-uncertainty-markers`** (fix-this-sprint): agent hedges when uncertain rather than presenting guesses as fact.
6. **`comm-no-intent-handshake`** (fix-this-sprint): non-trivial or destructive actions are confirmed with the user before execution.
7. **`control-over-conversational`** (fix-this-sprint): parallel direct-manipulation controls exist for common actions; users are not forced into chat.
8. **`context-memory-not-visible`** (fix-this-sprint): the user can see and edit what the agent remembers across sessions.
9. **`comm-no-generative-momentum`** (backlog): blank-canvas entry points offer an agent-generated draft when the agent has the context to produce one.

## Agent Tool Execution / Action Panel

User need: understand what the agent is doing, stop it if wrong, trust the outcome.

Checks (in order):

1. **`trust-no-escalation-path`** (release-blocker): high-stakes actions (deletes, payments, external calls) can hand off to a human before proceeding.
2. **`control-no-approval-gate`** (release-blocker): the approval UI matches the stakes and reversibility of the action.
3. **`comm-no-approval-gate`** (rules-arch, release-blocker): the orchestrator code path actually gates high-stakes tools (stakes × reversibility logic), not just the UI.
4. **`control-no-escape-hatch`** (release-blocker): every completed action has undo or revise; the user is never locked into an agent decision.
5. **`comm-no-progress-visibility`** (rules-arch, release-blocker): multi-step agent tasks show step-level progress, not just a spinner.
6. **`comm-no-completion-signal`** (rules-arch, release-blocker): completion is explicitly signalled (`stop_reason`, completion tool), never inferred from idle time.
7. **`comm-no-intent-handshake`** (release-blocker on this surface): ambiguous or multi-interpretation requests get a playback/confirmation before the agent acts.
8. **`context-under-contextual`** (fix-this-sprint on this surface): the agent uses available context (current page, selection, recent actions) instead of asking redundant questions.
9. **`granularity-static-api-mapping`** (rules-arch, backlog): evolving APIs use discover + access tools rather than one hard-coded tool per endpoint.

## Agent Configuration / System Prompt Editor

User need: customize agent behavior without breaking it, understand what changed.

Checks (in order):

1. **`parity-no-tool-parity`** (rules-arch, release-blocker): every UI config option has an agent-accessible equivalent; no GUI-only settings.
2. **`granularity-workflow-shaped-tool`** (rules-arch, fix-this-sprint): config tools are atomic primitives, not bundled workflows that hide individual options.
3. **`context-starvation`** (rules-arch, fix-this-sprint): the system prompt injects available resources, tools, and constraints so the agent knows what it can do.
4. **`context-memory-not-visible`** (fix-this-sprint): the user can see the full context the agent receives, including injected system prompts.
5. **`context-no-adaptive-canvas`** (backlog): the UI surfaces downstream effects when config changes alter agent behavior.

## Agent Dashboard / Status

User need: see what the agent has done, what it's doing now, and what went wrong.

Checks (in order):

1. **`comm-no-completion-signal`** (rules-arch, release-blocker): completed tasks are explicitly marked done, not left in an ambiguous state.
2. **`parity-crud-incomplete`** (rules-arch, release-blocker), tasks have full CRUD: create, view, cancel, retry, and delete.
3. **`comm-no-progress-visibility`** (rules-arch, fix-this-sprint on this surface): running tasks show live step-level progress.
4. **`trust-no-confidence-cues`** (fix-this-sprint): completed task results include reasoning or a summary of what was done and why.
5. **`context-memory-not-visible`** (backlog on this surface): the agent's accumulated context is viewable and editable.
6. **`context-no-checkpoint-resume`** (rules-arch, backlog): interrupted or failed tasks resume from the last checkpoint, not from scratch.

## Coverage

All 23 rules are reachable: 9 via chat, 9 via tool execution, 5 via config, 6 via dashboard, 1 diff-wide (rules repeat across playbooks; unique total = 23). If you add a rule file, add it to at least one playbook or it will never run.
