---
title: UI action with no agent tool equivalent
slug: parity-no-tool-parity
category: parity
defaultTier: release-blocker
surfaces: agent-config, agent-tool-execution
agent-native-principle: Parity
detection: code-auditable
related: parity-crud-incomplete, parity-orphan-ui-action
---

## UI action with no agent tool equivalent

A route or UI handler performs an operation no available tool exposes. User asks the agent to do it; it says "I can't do that." Parity means the agent can do everything the user can do.

Scope: codebase-wide. This rule enumerates every mutating handler that ships today against the whole tool registry, so it fires on gaps nobody introduced in this PR. Run it in full-sweep mode or when auditing a config surface. For gaps the diff under review adds, use `parity-orphan-ui-action`, which is diff-scoped and tiered lower because new drift has an owner in the room.

## What goes wrong

UI has an "Archive" button calling `POST /api/projects/:id/archive`, but no tool exposes the endpoint. The agent responds "I don't have the ability to archive projects."

## Detection

**Surfaces:** agent-config, agent-tool-execution

**Static signals:**
1. Enumerate every mutating handler in the tree, not only changed files: `POST`/`PUT`/`PATCH`/`DELETE` route exports, server actions, form actions.
2. Enumerate the full tool registry.
3. Match one list against the other by operation, not by name; `archive_project` and `POST /projects/:id/archive` are the same capability under different spellings.
4. Report the unmatched handlers as a list. An empty grep is not a pass here: cite the handler count you compared.

**Concrete commands:**
```bash
rg -l 'export (async )?function (POST|PUT|PATCH|DELETE)' --type=ts src/app/api/ | sort   # handler inventory
rg -o 'name:\s*["\x27]\w+' --no-filename --type=ts src/tools/ | sed 's/.*["\x27]//' | sort   # tool inventory
rg -c 'export (async )?function (POST|PUT|PATCH|DELETE)' --type=ts src/app/api/ | wc -l   # count to cite
```

**False-positive guards:**
- Skip health-check endpoints (`/api/health`), webhook receivers, test files.
- Skip files with `// ax-audit-ignore:parity-no-tool-parity`.

## Fix

For every UI capability, ensure an equivalent tool exists.

```ts
// before: route exists, no tool
// POST /api/projects/[id]/archive exists; no archive_project tool

// after: tool mirrors the UI action
export const archiveProject = tool({
  name: "archive_project",
  description: "Archive a project by ID.",
  parameters: { projectId: { type: "string", required: true } },
  execute: async ({ projectId }) => api.post(`/projects/${projectId}/archive`),
});
```

## Default tier and overrides

**Defaults to:** `release-blocker`: a missing tool is a hard wall the agent cannot work around.

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent config | release-blocker |

Config does not taper: a GUI-only setting is exactly the capability gap this rule exists to catch.

## Examples

**Anti-pattern (fails):**
```ts
// Route handler exists, tools array has no archive tool
export const tools = [createProject, listProjects, getProject];
```

**Applied (passes):**
```ts
export const tools = [createProject, listProjects, getProject, archiveProject];
```

## Suppression

```ts
// ax-audit-ignore:parity-no-tool-parity, internal admin endpoint
export async function POST(req: Request) { ... }
```
