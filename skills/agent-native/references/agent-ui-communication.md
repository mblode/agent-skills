# Agent-UI Communication

<!-- TOC -->
- [Completion Signals](#completion-signals)
- [Partial Completion](#partial-completion)
- [Agent Event Types](#agent-event-types)
- [Shared Workspace](#shared-workspace)
- [Context Limits](#context-limits)
- [Approval Gates](#approval-gates)
- [Communication Principles](#communication-principles)
<!-- /TOC -->

---

## Completion Signals

Agents need an explicit way to signal "I'm done." Never detect completion through heuristics (consecutive idle iterations, presence of expected output files).

**How the orchestrator loop actually works:**

The LLM API drives continuation via `stop_reason`. Your orchestrator observes it — tools don't control the loop, the model does:

```
Claude response → stop_reason: "tool_use"  → orchestrator executes tools → sends results back → loop
Claude response → stop_reason: "end_turn"  → orchestrator stops → returns final text to user
```

**App-level orchestration pattern** — define a `ToolResult` type in your orchestrator to wrap results and carry control signals back to your loop logic (not to Claude):

```swift
// This is YOUR orchestrator type, not a Claude API type
struct ToolResult {
    let success: Bool
    let output: String
    let shouldContinue: Bool  // signal to YOUR loop, not to Claude
}

// Usage in your orchestrator:
.success("Result")    // completed a step, loop continues
.error("Message")     // recoverable error, orchestrator retries
.complete("Done")     // task finished, orchestrator stops before Claude's end_turn
```

Completion is separate from success/failure: a tool result can succeed and stop your loop early, or fail and let the loop continue for recovery.

**Richer control flow signals** your orchestrator can implement:
- **pause** — agent needs user input; surface to UI before continuing
- **escalate** — decision is outside the agent's scope; hand to a human
- **retry** — transient failure; orchestrator retries with exponential backoff

If the agent needs input, it asks in its text response and your orchestrator detects the prompt and surfaces it to the user.

---

## Partial Completion

For multi-step tasks, track progress at the task level, not just session level.

```swift
struct AgentTask {
    var status: TaskStatus  // pending, in_progress, completed, failed, skipped
    var notes: String?      // Why it failed, what was partially done
}

var isComplete: Bool {
    tasks.allSatisfy { $0.status == .completed || $0.status == .skipped }
}
```

**What to show in the UI:**
```
Progress: 3/5 tasks complete (60%)

✓ [1] Find source materials
✓ [2] Download full text
✓ [3] Extract key passages
✗ [4] Generate summary — Error: context limit
○ [5] Create outline
```

**Partial completion scenarios:**
- **Max iterations hit** — some tasks completed, some pending; checkpoint saved, resume continues
- **Task fails, others continue** — failed task marked with error notes; agent decides whether to continue
- **Network error mid-task** — iteration throws; session marked failed; checkpoint preserves prior messages

---

## Agent Event Types

Emit typed events so the UI can respond appropriately:

```swift
enum AgentEvent {
    case thinking(String)           // → Show thinking indicator
    case toolCall(String, String)   // → Show tool being used + arguments
    case toolResult(String)         // → Show result (optional, can be hidden for noisy tools)
    case textResponse(String)       // → Stream to chat incrementally
    case statusChange(Status)       // → Update status bar
}
```

Some tools are noisy (internal state checks, metadata reads). Use an `ephemeralToolCalls` flag to hide them from the UI while still showing meaningful actions like file writes and API calls.

---

## Shared Workspace

Agents and users should work in the same data space, not separate sandboxes.

```
UserData/
├── notes/           ← Both agent and user read/write here
├── projects/        ← Agent can organize, user can override
└── preferences.md   ← Agent reads, user can edit
```

**Benefits:**
- Users can inspect and modify agent work
- Agents can build on what users create
- No synchronization layer needed
- Complete transparency

**Default:** Shared. Sandbox only when there's a specific need — security, preventing corruption of critical data.

---

## Context Limits

Agent sessions can extend indefinitely; context windows cannot. Design for bounded context from the start.

- Tools should support iterative refinement (summary → detail → full) rather than all-or-nothing loading
- Give agents a way to consolidate learnings mid-session ("summarize what I've learned so far and continue")
- Assume context will fill up — build in checkpointing so sessions can resume without losing progress

---

## Approval Gates

When agents take actions on their own (not in direct response to a user request), match the approval requirement to stakes and reversibility:

| Stakes | Reversibility | Pattern | Example |
|--------|--------------|---------|---------|
| Low | Easy | Auto-apply | Organizing files into folders |
| Low | Hard | Quick confirm | Publishing a draft to a feed |
| High | Easy | Suggest + apply | Editing code with diff shown |
| High | Hard | Explicit approval | Sending an email or message |

When the user explicitly asks the agent to do something, that's already approval — just do it.

**Self-modification** (agent edits its own prompts or configuration) always requires explicit approval, an audit log, and a rollback path.

---

## Communication Principles

- **No silent actions** — agent changes should be visible in the UI immediately
- **Show progress during execution** — not just results at the end; build trust through visibility
- **Stream text incrementally** — don't wait for the full response before rendering
- **Silent agents feel broken** — visible progress is not optional; it's a trust requirement
