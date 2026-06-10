---
title: Entity with incomplete CRUD tool coverage
slug: parity-crud-incomplete
category: parity
defaultTier: release-blocker
surfaces: agent-tool-execution, agent-config, agent-dashboard
agent-native-principle: Parity
detection: code-auditable
related: parity-no-tool-parity
---

## Entity with incomplete CRUD tool coverage

Entity has create and read tools but is missing update or delete. Agent creates a note but can't fix a typo. Agent lists tasks but can't mark one complete.

## What goes wrong

Agent creates a note. User spots a typo. No `update_note` tool exists. Agent says "I can't edit it." The agent generated work instead of completing it.

## Detection

**Surfaces:** agent-tool-execution, agent-config, agent-dashboard

**Static signals:**
1. List all entity types from tool definitions.
2. For each entity, verify create/read/update/delete tools exist.
3. Flag entities with <4 CRUD operations.

**Concrete commands:**
```bash
rg 'name:\s*["\x27](create|get|list|update|edit|delete|remove)_(\w+)' \
  --type=ts -o --no-filename src/tools/ | awk -F'_' '{print $2}' | sort | uniq -c | sort -n
rg 'name:\s*["\x27]create_' --type=ts -o --no-filename src/tools/ | \
  sed 's/.*create_//' | sed 's/["\x27]//' | while read e; do
    rg -q "update_${e}|edit_${e}" src/tools/ || echo "MISSING update: $e"; done
```

**False-positive guards:**
- Skip immutable entities (audit logs, event streams) and `// ax-audit-ignore:parity-crud-incomplete`.

## Fix

Add the missing CRUD tools. Every entity needs all four.

```ts
// before: [createNote, listNotes]: after: add update and delete
export const updateNote = tool({
  name: "update_note",
  execute: async ({ noteId, ...fields }) => api.patch(`/notes/${noteId}`, fields),
});
export const deleteNote = tool({
  name: "delete_note",
  execute: async ({ noteId }) => api.delete(`/notes/${noteId}`),
});
```

## Default tier and overrides

**Defaults to:** `release-blocker`: incomplete CRUD strands agents mid-workflow.

## Examples

**Anti-pattern (fails):**
```ts
export const createTask = tool({ name: "create_task", /* ... */ });
export const listTasks = tool({ name: "list_tasks", /* ... */ });
// No update_task, no delete_task: agent can't mark tasks complete
```

**Applied (passes):**
```ts
// All four CRUD operations present
export const tools = [createTask, listTasks, getTask, updateTask, deleteTask];
```

## Suppression
```ts
// ax-audit-ignore:parity-crud-incomplete, audit_log is intentionally immutable
export const listAuditLogs = tool({ name: "list_audit_log", /* ... */ });
```
