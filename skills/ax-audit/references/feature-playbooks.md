# Feature Playbooks

Each feature gets an ordered checklist. Detect the feature from element + filename + route, then run the checks in order. Each check pulls from `rules-ax/` (agentic experience rules) or `rules-arch/` (architecture rules).

## Table of contents

- [Feature detection](#feature-detection)
- [Agent Chat / Copilot](#agent-chat--copilot)
- [Agent Tool Execution / Action Panel](#agent-tool-execution--action-panel)
- [Agent Configuration / System Prompt Editor](#agent-configuration--system-prompt-editor)
- [Agent Dashboard / Status](#agent-dashboard--status)

## Feature detection

Match on element semantics + filenames + route paths:

| Feature | Detect by |
|---|---|
| agent chat / copilot | `<Chat>`, `<Assistant>`, `<Copilot>`, `role="assistant"`, `isStreaming`, `aiResponse`, `completion`, `useChat`, `useCompletion`, route `/chat`, `/assistant`, `/copilot` |
| agent tool execution / action panel | `<ToolCall>`, `<Action>`, `tool_use`, `function_call`, `executeAction`, `agentAction`, component `*ToolPanel*`, `*ActionLog*` |
| agent configuration / system prompt editor | `<SystemPrompt>`, `<AgentConfig>`, `<PromptEditor>`, route `/agent/settings`, `/configure`, `systemPrompt` |
| agent dashboard / status | `<AgentStatus>`, `<TaskList>`, `<RunHistory>`, `<RunLog>`, component `*AgentDashboard*`, route `/agent`, `/runs` |

---

## Agent Chat / Copilot

User need: get help from the agent, trust its output, control what it does.

Checks (in order):

1. **`comm-no-progress-signal`** — streaming/thinking indicator visible during agent response; user must never stare at a frozen UI. **release-blocker.**
2. **`trust-no-confidence-cues`** — agent output includes rationale or sources so user can verify correctness. **fix-this-sprint.**
3. **`trust-no-uncertainty-markers`** — agent hedges when uncertain rather than presenting guesses as fact. **fix-this-sprint.**
4. **`control-no-escape-hatch`** — agent actions triggered from chat are interruptible mid-execution and reversible after completion. **release-blocker.**
5. **`comm-no-intent-handshake`** — non-trivial or destructive actions confirmed with the user before execution. **fix-this-sprint.**
6. **`control-over-conversational`** — parallel direct-manipulation controls exist for common actions so users are not forced into chat. **fix-this-sprint.**
7. **`context-memory-not-visible`** — user can see and edit what the agent remembers across sessions. **fix-this-sprint.**

## Agent Tool Execution / Action Panel

User need: understand what the agent is doing, stop it if wrong, trust the outcome.

Checks (in order):

1. **`trust-no-escalation-path`** — high-stakes actions (deletes, payments, external calls) have human escalation before proceeding. **release-blocker.**
2. **`control-no-approval-gate`** — approval step matches the stakes and reversibility of the action. **release-blocker.**
3. **`control-no-escape-hatch`** — every completed action has undo or revise; user is never locked into an agent decision. **release-blocker.**
4. **`comm-no-progress-visibility`** (rules-arch) — multi-step agent tasks show step-level progress, not just a spinner. **release-blocker.**
5. **`comm-no-completion-signal`** (rules-arch) — task completion is explicitly signalled, not inferred from idle state. **release-blocker.**
6. **`comm-no-intent-handshake`** — ambiguous or multi-interpretation requests get a confirmation before the agent acts. **fix-this-sprint.**
7. **`context-under-contextual`** — agent uses all available context (current page, selection, recent actions) to reduce unnecessary questions. **backlog.**

## Agent Configuration / System Prompt Editor

User need: customize agent behavior without breaking it, understand what changed.

Checks (in order):

1. **`parity-no-tool-parity`** (rules-arch) — every UI config option has an agent-accessible equivalent; no GUI-only settings. **release-blocker.**
2. **`granularity-workflow-shaped-tool`** (rules-arch) — config tools are atomic primitives, not bundled workflows that hide individual options. **fix-this-sprint.**
3. **`context-starvation`** (rules-arch) — system prompt injects available resources, tools, and constraints so the agent knows what it can do. **fix-this-sprint.**
4. **`context-memory-not-visible`** — user can see the full context the agent receives, including injected system prompts. **fix-this-sprint.**
5. **`context-no-adaptive-canvas`** — UI adapts when config changes affect agent behavior, surfacing downstream effects. **backlog.**

## Agent Dashboard / Status

User need: see what the agent has done, what it's doing now, and what went wrong.

Checks (in order):

1. **`comm-no-progress-visibility`** (rules-arch) — running tasks show live progress with step-level detail. **release-blocker.**
2. **`comm-no-completion-signal`** (rules-arch) — completed tasks are explicitly marked done, not left in an ambiguous state. **release-blocker.**
3. **`parity-crud-incomplete`** (rules-arch) — tasks have full CRUD: create, view, cancel, retry, and delete. **release-blocker.**
4. **`context-memory-not-visible`** — agent's accumulated context and memory is viewable and editable by the user. **fix-this-sprint.**
5. **`trust-no-confidence-cues`** — completed task results include reasoning or a summary of what was done and why. **fix-this-sprint.**
6. **`context-no-checkpoint-resume`** (rules-arch) — interrupted or failed tasks can resume from the last checkpoint, not restart from scratch. **backlog.**
