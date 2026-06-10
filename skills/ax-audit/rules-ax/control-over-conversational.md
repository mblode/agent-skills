---
title: Chat interface for actions that should be buttons
slug: control-over-conversational
category: control
defaultTier: fix-this-sprint
surfaces: agent-chat
ax-pattern: Over-conversational (anti-pattern)
detection: observational
related: comm-no-intent-handshake, comm-no-generative-momentum
---

## Chat interface for actions that should be buttons

User wants to toggle a setting or trigger a known action. Only interface is chat. User types "turn on dark mode" and waits for a round-trip instead of flipping a switch. Chat is the ONLY path to deterministic actions.

## What goes wrong

User wants dark mode. Types "enable dark mode" in chat. Agent responds after 2 seconds. Same action could be a toggle taking 50ms. Multiply across every simple action and chat becomes a bottleneck.

## Detection

**Surfaces:** agent-chat

**Auditability:** observational

**Static signals:**
1. Find chat input surfaces.
2. Identify deterministic actions achievable through chat (toggles, selections, CRUD).
3. Flag cases where chat is the only path to a simple action.

**Concrete commands:**
```bash
rg -l 'ChatInput|MessageInput|PromptInput' --type=ts src/
rg -l 'Toggle|Switch|Select|Dropdown' --type=ts src/components/
```

**Judgment signals:**
- The anti-pattern is chat-only for deterministic actions. Some conversational interface is expected.

**False-positive guards:**
- Skip `// ax-audit-ignore:control-over-conversational`, test, and Storybook files.

## Fix

Add direct-manipulation controls alongside chat: quick-action buttons, command palette, context menus. Keep chat for ambiguous or multi-step requests.

## Examples

**Anti-pattern (fails):**

```tsx
<div>
  <DataTable data={data} />
  <AgentChat onSend={handleAgentCommand} /> {/* no sort, filter, or action controls */}
</div>
```

**Applied (passes):**

```tsx
<div>
  <DataTable data={data} onSort={handleSort} sortable />
  <QuickActions actions={[{ label: "Export CSV", handler: exportCsv }]} />
  <AgentChat onSend={handleAgentCommand} />
</div>
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | backlog |
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

## Suppression

```tsx
{/* ax-audit-ignore:control-over-conversational, chat-first product by design */}
<AgentChat onSend={onSend} />
```
