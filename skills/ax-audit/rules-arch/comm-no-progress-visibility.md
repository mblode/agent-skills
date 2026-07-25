---
title: Orchestrator emits no progress events during execution
slug: comm-no-progress-visibility
category: comm
defaultTier: release-blocker
surfaces: agent-chat, agent-tool-execution, agent-dashboard
agent-native-principle: Parity (agent-UI communication)
detection: code-auditable
related: comm-no-completion-signal, comm-no-approval-gate, comm-no-progress-signal
---

## Orchestrator emits no progress events during execution

The run loop awaits every tool call and returns one payload at the end, so there is no event for any client to subscribe to. Violates Parity: the agent knows which step it is on and the transport throws that away.

Scope: this rule asks whether the server emits step-level events at all. Whether the client renders them as a step list, a status line, or streamed text is `rules-ax/comm-no-progress-signal`. A streaming route with a UI that ignores the events fails that rule, not this one.

## What goes wrong

The agent makes 12 tool calls over 45s analyzing a codebase. The route handler is `const result = await agent.run(msg); return Response.json(result)`, so the only thing a client can show is a spinner. No UI change can fix it: the information never left the server.

## Detection

**Surfaces:** agent-chat, agent-tool-execution, agent-dashboard

**Static signals:**
1. Find the server-side run loop: the route handler or worker that iterates tool calls.
2. Check its return type. A resolved object or `Response.json(...)` after the loop means events were never emitted; a `ReadableStream`, SSE response, or async generator means they were.
3. Inside the loop, check whether each tool call and each reasoning step yields or publishes an event, or whether the loop only accumulates into a local variable.
4. Flag loops whose only observable output is the final return value.

**Concrete commands:**
```bash
rg -l '(agent|orchestrator)\.(run|invoke|execute)\(' --type=ts src/app/api/ src/server/
rg -n 'return (NextResponse|Response)\.json' --type=ts -B 15 src/app/api/ | rg '(toolCall|tool_use|for await|while)'
rg -n '(ReadableStream|text/event-stream|createDataStreamResponse|async function\*|yield |emit\()' --type=ts src/app/api/ src/server/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-progress-visibility`.
- Skip sub-second operations.
- Skip loops whose consumer is another server process with no user waiting on it.
- Skip test files and fixtures.

## Fix

```ts
// before: the loop accumulates, the route returns once
export async function POST(req: Request) {
  const result = await agent.run(await req.text()); // 30s, nothing observable
  return Response.json(result);
}

// after: the loop yields typed events, the route streams them
async function* run(msg: string) {
  for (const step of await plan(msg)) {
    yield { type: "toolCall", toolName: step.tool };
    const out = await tools[step.tool].execute(step.args);
    yield { type: "toolResult", toolName: step.tool, summary: summarize(out) };
  }
  yield { type: "done" };
}

export async function POST(req: Request) {
  return new Response(toSSE(run(await req.text())), {
    headers: { "content-type": "text/event-stream" },
  });
}
```

Event names are a contract: `rules-ax/comm-no-progress-signal` audits the client against the same set, so renaming them mid-stack breaks the surface that displays them.

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent dashboard | fix-this-sprint |

## Examples

**Anti-pattern (fails):** the route awaits the whole run and returns `Response.json(result)`. The client has nothing to subscribe to.

**Applied (passes):** the run loop is an async generator yielding `toolCall` / `toolResult` / `done`, and the route returns a stream of them.

## Suppression

```tsx
{/* ax-audit-ignore:comm-no-progress-visibility, instant lookup, <500ms */}
<QuickLookupAgent />
```
