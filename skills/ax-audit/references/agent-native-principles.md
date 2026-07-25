# Agent-Native Principles (Condensed)

<!-- TOC -->
- [Core Principles](#core-principles)
- [Tool Design](#tool-design)
- [Context Patterns](#context-patterns)
- [Agent-UI Communication](#agent-ui-communication)
<!-- /TOC -->

## Core Principles

- **Parity:** every UI capability has a tool; if not, add one.
- **Granularity:** atomic primitives, one action per tool; decision logic lives in prompts, so behavior changes are prompt edits, not refactors.
- **Composability:** atomic tools plus parity make new features new prompts.
- **Emergent capability:** ship atomic tools, watch requests, add domain tools for common patterns.
- **Improvement over time:** context files plus refined prompts improve the app without code; self-modification needs audit logs and rollback.

## Tool Design

**Atomic primitives first.** Bash, file ops, storage; prove the architecture before domain tools.

**CRUD completeness.** Verify every entity has create, read, update, delete. Common failure: `create_note` + `read_notes` exist but `update_note` and `delete_note` are missing.

**Domain tools.** Add deliberately for vocabulary anchoring, guardrails (validation not left to judgment), or bundling a multi-step operation.

**Dynamic capability discovery.** Expose `list_available_types()` + `read_data(type)` over one-tool-per-endpoint, so capabilities are discovered at runtime. MCP standardizes discover + access; prefer MCP servers over hand-coded wrappers for external services.

**Graduation.** Hot paths can move to optimized code, but the agent still triggers them and falls back to primitives for edge cases.

## Context Patterns

**Entity-scoped directories.** `{entity_type}/{entity_id}/`; separate ephemeral (`AgentCheckpoints/`, `AgentLogs/`) from durable (`Research/`).

**The `context.md` pattern.** Read at session start, updated as state changes (agent identity, user knowledge, what exists, recent activity, current state). Portable working memory, no code changes.

**Context injection.** System prompts include three sections:
1. **Available resources**: what data exists, where
2. **Capabilities**: what the agent can do
3. **Recent activity**: what happened since last session

**Durable state outside the transcript.** A session that outgrows its window silently drops the earliest decisions, so anything the agent must still honour at step 40 belongs in a file it re-reads, not in message history (see `rules-arch/context-no-checkpoint-resume`). Audit the store, not the window-management technique.

## Agent-UI Communication

**Completion signals.** Every model API returns a terminal reason for a turn. The audit question is whether the orchestrator reads that field, or infers "done" from idle time, an empty delta, or a timeout. Orchestrators that add their own states (`pause`, `escalate`, `retry`) must emit them as explicitly as completion, or the UI guesses again.

**Partial completion tracking.** Per-task status (pending, in_progress, completed, failed, skipped); show `3/5 tasks complete (60%)` with error notes.

**Agent event types.** Emit typed events (`thinking`, `toolCall`, `toolResult`, `textResponse`, `statusChange`); an `ephemeralToolCalls` flag hides noisy internals.

**Shared workspace.** Agents and users share one data space, each building on the other's work. Sandbox only when security or data integrity requires it.

**Approval gates.** Match approval to stakes and reversibility:

| Stakes | Reversibility | Pattern |
|--------|--------------|---------|
| Low | Easy | Auto-apply |
| Low | Hard | Quick confirm |
| High | Easy | Suggest + apply (show diff) |
| High | Hard | Explicit approval |

An explicit user request is already approval. Self-modification always requires explicit approval + audit log + rollback.
