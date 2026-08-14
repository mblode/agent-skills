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

**Atomic primitives first.** One action per tool, scoped to a domain noun: `read_note`, `update_note`, `list_projects`. Prove the architecture on these before bundling them into workflow tools.

**Atomic is not raw.** A domain primitive has a blast radius you can state in a sentence. Raw substrate access over production data (arbitrary code eval, a shell on the live host, a SQL or GraphQL passthrough, an untyped SDK call) has the blast radius of the whole system and makes every tool boundary above it advisory. Ship the first. Some long-tail requests then stop being servable; that is a refusal, not a reason to add the substrate tool back.

**CRUD completeness.** Verify every entity has create, read, update, delete. Common failure: `create_note` + `read_notes` exist but `update_note` and `delete_note` are missing.

**Domain tools.** Add deliberately for vocabulary anchoring, guardrails (validation not left to judgment), or bundling a multi-step operation.

**Dynamic capability discovery.** For evolving type systems (CMS, CRM custom objects), expose `list_available_types()` + `read_data(type)` over one wrapper per type. A product agent whose tools *are* the product nouns (`create_issue`, `update_document`) does not need to discover them at runtime.

MCP standardizes discover and access for external services. Prefer those servers over hand-coded wrappers.

**Graduation.** Hot paths can move to optimized code, but the agent still triggers them and falls back to domain primitives for edge cases.

## Context Patterns

**Entity-scoped directories.** `{entity_type}/{entity_id}/`; separate ephemeral (`AgentCheckpoints/`, `AgentLogs/`) from durable (`Research/`).

**The `context.md` pattern.** Read at session start, updated as state changes (agent identity, user knowledge, what exists, recent activity, current state). Portable working memory, no code changes.

**Context injection.** System prompts include three sections, scoped to this run, not the whole product:
1. **Available resources**: what data exists, where
2. **Capabilities**: what the agent can do
3. **Recent activity**: what happened since last session

Context is a budget with two ends. Too little and the agent asks redundant questions. Too much (every tool, every procedure, every run) and it picks the wrong one from a longer list.

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

**Provenance is the third axis.** Stakes and reversibility classify by tool name, so a gate built from them treats every delete the same. Two questions adjust the row:

- **Did the agent create this in the current conversation?** Deleting a draft it just made is not the same act as deleting a record that existed before the session.
- **Does the target reach outside the workspace?** Posting to an internal thread and posting to one synced with a public repo differ in blast radius, not in the tool name.

A gate that cannot read those two facts can only be tuned by making it stricter, and a gate strict enough to catch the pre-existing delete will also interrupt the draft cleanup. Pass provenance into the checkpoint alongside stakes.
