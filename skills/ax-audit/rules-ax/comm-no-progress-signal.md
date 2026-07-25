---
title: Multi-step agent task shows no progress
slug: comm-no-progress-signal
category: comm
defaultTier: release-blocker
surfaces: agent-chat, agent-tool-execution, agent-dashboard
ax-pattern: Confidence Cues (progress dimension)
detection: code-auditable
related: comm-no-intent-handshake, context-no-adaptive-canvas, comm-no-progress-visibility
---

## Multi-step agent task shows no progress

Agent runs a task that takes 30+ seconds. The UI shows nothing: no streaming, no step counter, no thinking indicator. User doesn't know if it's working, stuck, or crashed. Silent agents feel broken.

Scope: this rule audits what the user sees. If the server never emitted progress events in the first place, the finding belongs to `rules-arch/comm-no-progress-visibility`, and fixing the component cannot resolve it.

## What goes wrong

User asks the agent to analyze a dataset. Three tool calls, API waits, synthesis, 45 seconds. The user sees a spinner or nothing. At 15 seconds they wonder if it's broken. At 30 they refresh.

## Detection

**Surfaces:** agent-chat, agent-tool-execution, agent-dashboard

**Auditability:** code-auditable

**Static signals:**
1. Find the components that call the agent (chat submit handlers, action panel triggers).
2. Check whether they subscribe to progress (`onChunk`, `onToken`, `onProgress`, `onStatus`, `useChat`) and render what arrives, not just the final value.
3. Flag components that receive events but only render on completion: a handler that sets state no JSX reads is the same silence to the user.

**Concrete commands:**
```bash
rg '(useChat|useCompletion|agent\.chat|agent\.run|streamText|generateText)' --type=ts -l src/components/ src/app/
rg '(onChunk|onToken|onProgress|onStatus|stream:\s*true)' --type=ts src/components/ src/app/
rg -n 'isStreaming|isLoading|status ===' --type=ts src/components/ | rg -v '(Spinner|Skeleton)'
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-progress-signal`.
- Skip test and Storybook fixtures.
- Skip agent calls that reliably complete in under 2 seconds.

## Fix

Render each event as it arrives instead of waiting for the final value. Name the current step in the user's words, not the tool's: "Searching for X..." then "Found 3 results, analyzing..." beats three identical spinners. A generic "Thinking..." held for 45 seconds is still a frozen UI.

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
