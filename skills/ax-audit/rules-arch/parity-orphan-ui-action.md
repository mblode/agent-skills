---
title: New UI capability without corresponding tool
slug: parity-orphan-ui-action
category: parity
defaultTier: fix-this-sprint
surfaces: agent-config, agent-tool-execution
agent-native-principle: Parity
detection: code-auditable
related: parity-no-tool-parity, parity-crud-incomplete
---

## New UI capability without corresponding tool

A PR adds a new UI feature (button, page, form action) but no new tool. Each PR without tool parity widens the gap between what users and agents can do.

## What goes wrong

PR adds a "Duplicate project" button calling a new endpoint. No tool is added. PR merges. Months later a user asks the agent to duplicate a project. It can't.

## Detection

**Surfaces:** agent-config, agent-tool-execution

**Static signals:**
1. In the diff, find new onClick handlers, form actions, route handlers.
2. Cross-reference with new tool definitions in the same diff.
3. Flag new UI capabilities with no new tool.

**Concrete commands:**
```bash
git diff main --name-only -- '*.ts' '*.tsx' | xargs rg -l 'export (async )?function (POST|PUT|PATCH|DELETE)' 2>/dev/null
git diff main -U0 -- '*.tsx' | rg '^\+.*onClick'
git diff main -U0 -- '*.ts' | rg '^\+.*(tool\(|defineTool|createTool)'
```

**False-positive guards:**
- Skip cosmetic UI changes with no new backend call and `// ax-audit-ignore:parity-orphan-ui-action`.

## Fix

When adding a UI capability, add the corresponding tool in the same PR.

```ts
// before: POST /api/projects/[id]/duplicate added, no tool
// after: tool ships in the same PR
export const duplicateProject = tool({
  name: "duplicate_project",
  execute: async ({ projectId }) => api.post(`/projects/${projectId}/duplicate`),
});
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`: orphans are drift, not crisis. Cumulative effect degrades agent usefulness.

## Examples

**Anti-pattern (fails):**
```tsx
<button onClick={() => fetch(`/api/reports/${id}/export`, { method: "POST" })}>
  Export CSV
</button>
// No export_report tool in this PR
```

**Applied (passes):**
```ts
// Same PR adds the button AND the tool
export const exportReport = tool({
  name: "export_report",
  parameters: { reportId: { type: "string", required: true } },
  execute: async ({ reportId }) => api.post(`/reports/${reportId}/export`),
});
```

## Suppression
```tsx
{/* ax-audit-ignore:parity-orphan-ui-action, cosmetic preview, no agent use case */}
<button onClick={handlePreview}>Preview</button>
```
