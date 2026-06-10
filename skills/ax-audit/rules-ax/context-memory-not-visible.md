---
title: Agent uses context the user can't see or edit
slug: context-memory-not-visible
category: context
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-config, agent-dashboard
ax-pattern: Memory in Motion
detection: code-auditable
related: context-under-contextual, context-no-adaptive-canvas
---

## Agent uses context the user can't see or edit

Agent injects preferences, past interactions, or learned patterns into its prompt, but the user can't see what the agent "knows" about them. Opaque memory feels invasive. Memory in Motion requires every piece of stored context to have a user-facing view and edit path.

## What goes wrong

Agent says "Based on your preference for concise answers..." and the user thinks "What preference? I never said that." The system built a profile from past interactions, injected it into the system prompt, and the user had zero visibility. No settings page, no memory panel, no way to correct it.

## Detection

**Surfaces:** agent-chat, agent-config, agent-dashboard

**Auditability:** code-auditable

**Static signals:**
1. Find context injection points (prompt builders, context loaders, preference injectors).
2. Search for UI that exposes this context (settings pages, memory panels).
3. Flag injected context with no user-facing view or edit path.

**Concrete commands:**
```bash
rg '(systemPrompt|buildPrompt|contextLoader|injectContext|userPreferences|userMemory)' --type=ts -l src/
rg '(MemoryPanel|PreferencesView|WhatIKnow|MemorySettings)' --type=ts -l src/
rg '(savePreference|updateMemory|storePattern|learnFrom)' --type=ts -l src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-memory-not-visible`.
- Skip test and Storybook fixtures.
- Skip internal admin-only agent tools where the operator is the developer.

## Fix

For every piece of context injected into the agent prompt, provide a corresponding UI where the user can view and edit it. A "Memory" or "What I know about you" panel with edit/delete per item.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |
| Agent dashboard | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
async function getAgentContext(userId: string) {
  const prefs = await redis.get(`user:${userId}:prefs`);
  const history = await redis.get(`user:${userId}:patterns`);
  return { preferences: prefs, patterns: history }; // never shown to user
}
```

**Applied (passes):**

```tsx
// Context store is shared: same data feeds the agent AND the settings UI
async function getAgentContext(userId: string) {
  return await getVisibleMemory(userId); // MemorySettings reads the same store
}

function MemorySettings() {
  const memory = useMemory();
  return memory.items.map((m) => (
    <li key={m.id}>{m.summary} <button onClick={() => memory.delete(m.id)}>Delete</button></li>
  ));
}
```

## Suppression

```tsx
{/* ax-audit-ignore:context-memory-not-visible, internal dev tool, operator is the developer */}
<AgentPromptBuilder />
```
