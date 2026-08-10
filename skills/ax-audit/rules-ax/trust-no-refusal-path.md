---
title: Agent has no way to decline, so it improvises instead
slug: trust-no-refusal-path
category: trust
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-tool-execution
ax-pattern: Uncertainty (refusal dimension)
detection: hybrid
related: trust-no-uncertainty-markers, trust-no-escalation-path, granularity-raw-primitive-escape, comm-no-intent-handshake
---

## Agent has no way to decline, so it improvises instead

Nothing in the prompt, the tool set, or the response contract lets the agent return "I can't do this safely". Every path ends in an action, so a request it cannot serve becomes a speculative one: an adjacent tool, a partial write, a plausible answer assembled from what it could reach. Users read the output as the product's answer, because nothing distinguishes it from one. A refusal that names the gap is a better product than a guess that looks like a result.

Scope: `trust-no-uncertainty-markers` covers hedging an answer the agent did give. `trust-no-escalation-path` covers handing a high-stakes case to a person. This rule covers stopping: the agent completing zero actions and saying why, which is the right outcome when there is no human queue to escalate into.

## What goes wrong

A user asks an agent to "clean up the duplicate contacts". It has read and update tools but no merge and no delete. Rather than saying so, it rewrites one record of each pair to look like the other and reports the list as tidied. The duplicates are still there, now with edited history, and the user only finds out weeks later. Every individual tool call was valid.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Auditability:** hybrid

**Static signals:**
1. Read the system prompt for a stated refusal path: what the agent should do when a request has no safe completion. Absence is a signal, not a verdict.
2. Check tool results for a refusal shape. Tools that only throw, or only return success, give the model nothing to report; a `{ ok: false, reason }` result does.
3. Check whether any tool refuses on unresolvable input rather than falling back to a default, an unfiltered list, or a best guess.
4. Check the response contract for a terminal outcome other than answered or errored.

**Concrete commands:**
```bash
rg -in '(cannot|can.t|refuse|decline|not able to|out of scope)' src/prompts/ src/**/instructions.md
rg -n '(ok:\s*false|available:\s*false|status:\s*"refused"|reason:)' --type=ts src/tools/
rg -n 'catch' --type=ts -A 3 src/tools/ | rg -i '(default|fallback|\[\]|null)'
```

**Judgment signals:**
- A prompt that says only what the agent can do, with no sentence about what happens when it cannot, usually has no refusal path.
- A tool returning an empty list where it meant "I could not apply your filter" is the dangerous case: an unfiltered or empty result reads as a perfectly good answer.
- Grep alone cannot confirm this rule. Without a trace showing an unservable request, return `unknown` with the prompt evidence rather than `fail`.

**False-positive guards:**
- Skip files with `// ax-audit-ignore:trust-no-refusal-path`.
- Skip agents whose whole action space is read-only, where a wrong answer is recoverable and refusal buys little.
- Skip surfaces that already escalate to a human on the same condition, which is a stronger form of the same fix.
- Skip test fixtures and eval harnesses.

## Fix

Give refusal a shape in the tool results and a sentence in the prompt, and prefer refusing to defaulting whenever an argument cannot be resolved.

```ts
// before: an unresolvable filter degrades into everything
const view = params.view ?? undefined;
return await listTasks({ view });

// after: refuse, and name what would fix it
if (!resolvedView) {
  return { ok: false, reason: `Could not resolve the "${params.view}" view. Ask which view, or list them first.` };
}
```

Pair it with one standing instruction: when no tool can serve the request, say what is missing and stop, rather than completing the nearest thing you can reach.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |

Tool execution takes the bump because an improvised action there writes to real state, while in chat the same defect produces a wrong sentence the user can still challenge.

## Examples

**Anti-pattern (fails):** a handler that ends `return plan.actions.length ? execute(plan) : execute(bestEffort(req))`, so an empty plan still produces an action. The prompt lists capabilities and never says what to do without one, and every tool returns either a value or a throw.

**Applied (passes):** the same handler returns `{ status: "declined", reason: plan.blockedBy }` on an empty plan, tools return `{ ok: false, reason }` on unresolvable input, and one prompt line tells the agent to name what is missing and stop.

## Suppression

```tsx
{/* ax-audit-ignore:trust-no-refusal-path, read-only summariser, worst case is a weak summary */}
<AgentPanel tools={readOnlyTools} />
```
