---
title: Multi-step agent task shows no progress
slug: comm-no-progress-signal
category: comm
defaultTier: release-blocker
surfaces: agent-chat, agent-tool-execution, agent-dashboard
ax-pattern: Confidence Cues (progress dimension)
detection: code-auditable
related: comm-no-intent-handshake, context-no-adaptive-canvas
---

## Multi-step agent task shows no progress

Agent runs a task that takes 30+ seconds. The UI shows nothing: no streaming, no step counter, no thinking indicator. User doesn't know if it's working, stuck, or crashed. Silent agents feel broken.

## What goes wrong

User asks the agent to analyze a dataset. Three tool calls, API waits, synthesis, 45 seconds. The user sees a spinner or nothing. At 15 seconds they wonder if it's broken. At 30 they refresh.

## Detection

**Surfaces:** agent-chat, agent-tool-execution, agent-dashboard

**Auditability:** code-auditable

**Static signals:**
1. Find agent invocation code (chat submit handlers, tool execution triggers).
2. Check for streaming (`onChunk`, `onToken`, SSE, `useChat`) or progress events (`onProgress`, `onStatus`).
3. Flag agent calls with only a final result handler and no intermediate feedback.

**Concrete commands:**
```bash
rg '(useChat|useCompletion|agent\.chat|agent\.run|streamText|generateText)' --type=ts -l src/
rg '(onChunk|onToken|onProgress|onStatus|stream:\s*true)' --type=ts src/
rg -A 10 '(executeTool|runTool|toolCall)' --type=ts src/ | rg -v '(onProgress|onStatus|stream)'
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-progress-signal`.
- Skip test and Storybook fixtures.
- Skip agent calls that reliably complete in under 2 seconds.

## Fix

Stream responses incrementally. Show a thinking indicator. For multi-step tasks, emit step-level progress: "Thinking..." then "Searching for X..." then "Found 3 results, analyzing..." then final response.

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent dashboard | fix-this-sprint |

## Examples

**Anti-pattern (fails):**

```tsx
async function onAsk(query: string) {
  const data = await fetch("/api/agent/research", {
    method: "POST", body: JSON.stringify({ query }),
  }).then((r) => r.json()); // 30-60s silence, no feedback
  setResult(data);
}
```

**Applied (passes):**

```tsx
export function ResearchPanel() {
  const [steps, setSteps] = useState<string[]>([]);
  const { data, isStreaming } = useAgentStream("/api/agent/research", {
    onStatus: (s) => setSteps((prev) => [...prev, s]),
  });
  return <>
    {isStreaming && <ProgressList steps={steps} current={steps.at(-1)} />}
    {data && <Results data={data} />}
  </>;
}
```

## Suppression

```tsx
{/* ax-audit-ignore:comm-no-progress-signal, instant lookup, sub-second response */}
<QuickLookup />
```
