# Agent-Native Principles (Condensed)

<!-- TOC -->
- [Core Principles](#core-principles)
- [Tool Design](#tool-design)
- [Context Patterns](#context-patterns)
- [Agent-UI Communication](#agent-ui-communication)
- [Mobile](#mobile)
<!-- /TOC -->

---

## Core Principles

**Parity**, Whatever the user can do through the UI, the agent must achieve through tools. When adding any UI capability, ask: can the agent achieve this outcome? If not, add the necessary tools.

**Granularity**: Tools are atomic primitives; decision logic lives in prompts. One conceptual action per tool. To change behavior, you edit prompts, not refactor code.

**Composability**: With atomic tools and parity, new features are new prompts. No code written. The agent uses primitives and judgment to pursue an outcome.

**Emergent Capability**: Agents accomplish things you did not explicitly design for. Build atomic tools, observe what users request, let the agent compose solutions or reveal gaps, then add domain tools for common patterns.

**Improvement Over Time**: Agent-native apps improve without shipping code. Accumulated context persists in files; prompts are refined at developer, user, or agent level. Self-modification requires audit logs and rollback.

---

## Tool Design

**Atomic primitives first.** Start with bash, file operations, basic storage. Prove the architecture before adding domain tools.

**CRUD completeness.** For every entity, verify the agent has create, read, update, and delete. Common failure: `create_note` + `read_notes` exist but `update_note` and `delete_note` are missing.

| Entity  | Create | Read | Update | Delete |
|---------|--------|------|--------|--------|
| (each)  | required | required | required | required |

**Domain tools.** Add deliberately as patterns emerge. Three reasons: vocabulary anchoring (teaches the agent your domain), guardrails (validation that should not be left to judgment), efficiency (common multi-step operation bundled).

**Dynamic capability discovery.** Instead of one tool per endpoint, expose `list_available_types()` + `read_data(type)`. New API capabilities are discovered at runtime, not hard-coded.

**MCP.** Model Context Protocol formalizes discover + access into a client-server standard. MCP servers expose typed tool schemas; clients discover tools at runtime. Prefer MCP servers over hand-coded wrappers for external services.

**Graduation.** Operations can move from agent-orchestrated loops to optimized code for hot paths. Even after graduation, the agent should be able to trigger the operation and fall back to primitives for edge cases.

---

## Context Patterns

**Entity-scoped directories.** Structure data as `{entity_type}/{entity_id}/` with primary content, metadata, and related materials. Separate ephemeral (`AgentCheckpoints/`, `AgentLogs/`) from durable (`Research/`) directories.

**The `context.md` pattern.** A file the agent reads at session start and updates as state changes. Contains: who the agent is, what it knows about the user, what exists, recent activity, guidelines, and current state. Portable working memory without code changes.

**Context injection.** System prompts include three sections:
1. **Available resources**: what data exists and where
2. **Capabilities**: what the agent can do
3. **Recent activity**: what happened since last session

**Context engineering.** Context windows are finite; long-running agents actively manage what they carry.

| Technique | When to use |
|-----------|-------------|
| **Compaction**: summarize old messages, drop raw history | Context >70% full |
| **Structured note-taking**: agent maintains `notes.md` of learnings and decisions | Multi-step research/planning |
| **Just-in-time retrieval**: load files/schemas only when the current step needs them | Large data sets, many tools |

---

## Agent-UI Communication

**Completion signals.** Always explicit via `stop_reason`, never heuristic. The LLM API drives continuation: `stop_reason: "tool_use"` means loop, `stop_reason: "end_turn"` means stop. App-level orchestrators can add richer signals: `pause`, `escalate`, `retry`.

**Partial completion tracking.** Track progress per task (pending, in_progress, completed, failed, skipped). Show `3/5 tasks complete (60%)` with per-task status and error notes.

**Agent event types.** Emit typed events: `thinking`, `toolCall`, `toolResult`, `textResponse`, `statusChange`. Use an `ephemeralToolCalls` flag to hide noisy internal operations from the UI.

**Shared workspace.** Agents and users work in the same data space, not separate sandboxes. Users can inspect and modify agent work; agents build on what users create. Sandbox only when security or data integrity requires it.

**Approval gates.** Match approval requirements to stakes and reversibility:

| Stakes | Reversibility | Pattern |
|--------|--------------|---------|
| Low | Easy | Auto-apply |
| Low | Hard | Quick confirm |
| High | Easy | Suggest + apply (show diff) |
| High | Hard | Explicit approval |

When the user explicitly requests an action, that is already approval. Self-modification always requires explicit approval + audit log + rollback.

---

## Mobile

**Checkpoint/resume.** Save full message history, iteration count, task status, and custom state to a `AgentCheckpoint` on backgrounding and after each tool result. On launch, scan for valid checkpoints (default TTL: 1 hour), offer resume, delete on completion.

**iCloud-first storage.** Use iCloud container with local fallback. Data syncs across devices without server infrastructure. Use a storage abstraction layer, not raw `FileManager`. Monitor `NSMetadataQuery` for cloud file state and conflict copies.

**Background execution.** iOS gives ~30 seconds. Priority: (1) complete the current tool call, (2) checkpoint session state, (3) transition to `.backgrounded` status. For truly long-running agents, use a server-side orchestrator with the mobile app as viewer/input.
