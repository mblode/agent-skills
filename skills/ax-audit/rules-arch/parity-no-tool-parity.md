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

A route or UI handler exists that performs an operation the agent cannot achieve through any available tool. User asks the agent to do it, agent says "I can't do that." Parity means the agent can do everything the user can do.

## What goes wrong

UI has an "Archive" button calling `POST /api/projects/:id/archive`. No tool exposes this endpoint. The agent responds "I don't have the ability to archive projects."

## Detection

**Surfaces:** agent-config, agent-tool-execution

**Static signals:**
1. Diff new routes/pages/handlers.
2. For each, check whether a corresponding tool definition exists.
3. Flag routes with no tool counterpart.

**Concrete commands:**
```bash
rg -l 'export (async )?function (POST|PUT|PATCH|DELETE)' --type=ts src/app/api/
rg -l 'tool\(|defineTool|createTool|server\.tool' --type=ts src/tools/
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
