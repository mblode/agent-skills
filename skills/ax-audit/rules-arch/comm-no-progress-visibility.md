---
title: Agent actions produce no UI feedback during execution
slug: comm-no-progress-visibility
category: comm
defaultTier: release-blocker
surfaces: agent-chat, agent-tool-execution, agent-dashboard
agent-native-principle: Parity (agent-UI communication)
detection: code-auditable
related: comm-no-completion-signal, comm-no-approval-gate
---

## Agent actions produce no UI feedback during execution

Agent runs for 30 seconds with no visible progress. User sees a spinner or nothing. They kill the session and restart. "Silent agents feel broken." Violates Parity: the UI must communicate what the agent is doing, not just what it finished.

## What goes wrong

Agent makes 12 tool calls over 45 seconds analyzing a codebase. UI shows "Thinking..." the entire time. User assumes it froze, refreshes, agent starts over. With events they'd see "Reading src/index.ts... Found 3 issues."

## Detection

**Surfaces:** agent-chat, agent-tool-execution, agent-dashboard

**Static signals:**
1. Find execution handlers: tool call loops, streaming handlers.
2. Check whether they emit typed events or update UI during execution.
3. Check whether text streams incrementally or batches until completion.
4. Flag handlers that only surface results at the end.

**Concrete commands:**
```bash
rg '(toolCall|tool_use|function_call)' --type=ts -A 10 src/ | rg '(for|while|map)'
rg '(emit|dispatch|onProgress|onToolCall|publish)' --type=ts src/
rg '(stream|onChunk|onToken|onDelta)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-progress-visibility`.
- Skip sub-second operations.
- Skip backend-only code with no UI surface.
- Skip test files and fixtures.

## Fix

```tsx
// before: silent execution
async function handleChat(msg: string) {
  const response = await agent.run(msg); // 30s silence
  setMessages((prev) => [...prev, response]);
}

// after: progressive event emission
async function handleChat(msg: string) {
  for await (const event of agent.stream(msg)) {
    switch (event.type) {
      case "thinking":   setStatus("Reasoning..."); break;
      case "toolCall":   setStatus(`Running ${event.toolName}...`); break;
      case "textDelta":  appendToCurrentMessage(event.text); break;
      case "done":       setStatus("idle"); break;
    }
  }
}
```

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent config | backlog |
| Agent dashboard | fix-this-sprint |

## Examples

**Anti-pattern (fails):** `const result = await agent.run(msg)`: 30s silence, then result.

**Applied (passes):** `for await (const e of agent.stream(msg))`: progressive events.

## Suppression

```tsx
{/* ax-audit-ignore:comm-no-progress-visibility, instant lookup, <500ms */}
<QuickLookupAgent />
```
