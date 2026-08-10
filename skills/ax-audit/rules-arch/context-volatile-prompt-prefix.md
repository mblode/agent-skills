---
title: Per-turn volatile values sit ahead of the stable prompt
slug: context-volatile-prompt-prefix
category: context
defaultTier: backlog
surfaces: agent-chat, agent-tool-execution
agent-native-principle: Context (stable prefix)
detection: code-auditable
related: context-no-injection, context-unscoped-tool-surface, context-starvation
---

## Per-turn volatile values sit ahead of the stable prompt

Providers cache a request by its longest matching prefix, so the cache survives only up to the first byte that changed. A timestamp, a request id, or a token counter rendered at the top of the system prompt moves that boundary to zero on every turn: the whole prompt and every tool schema behind it are reprocessed as new input. The content is usually right and the position is wrong, which is why this survives review.

Scope: this rule is about placement, not about whether dynamic context belongs in the prompt at all. `context-no-injection` asks for that content to exist. This rule asks for it to sit after everything stable, so asking for both is not a contradiction.

## What goes wrong

An agent renders `Current time: 2026-08-10T09:14:33Z` as line one of a 20,000-token system prompt, so the model can resolve "tomorrow". It works. Six months later the bill is three times what the traffic predicts and every turn reports zero cache reads, because a prompt whose first line changes every second has no reusable prefix. Moving that line below the tool schemas changes no behaviour and restores the cache.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Static signals:**
1. Find where the system prompt is assembled and record the order of its parts.
2. In each part that lands before the stable body, look for values that differ per turn: clock reads, `Date`, `Math.random`, uuid mints, counters, cursors, per-request ids, "messages so far".
3. Confirm the stable body is actually large enough to matter, that is, tool schemas and standing instructions sit behind the volatile part.
4. Fail when a per-turn value precedes a stable block. Record the file, the line, and which value moves.

**Concrete commands:**
```bash
rg -n '(new Date|Date\.now|toISOString|randomUUID|Math\.random|performance\.now)' --type=ts src/ \
  | rg -i '(prompt|system|instruction|context)'
rg -n 'system\s*[:=]' --type=ts -A 15 src/          # read the assembly order
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-volatile-prompt-prefix`.
- Skip volatile values already placed after the stable body or carried in the user message, which is the corrected shape.
- Skip build-time values baked into a compiled manifest: those are stable across turns even though the expression looks dynamic.
- Skip providers and gateways with no prefix caching, but say so in the finding rather than passing silently.
- Skip test fixtures and eval harnesses.

## Fix

Order the request stable-to-volatile, and put anything that changes per turn at the tail or in the turn's own message.

```ts
// before: the cache boundary is line 1
const system = `Current time: ${new Date().toISOString()}\n\n${CORE_PROMPT}`;

// after: the stable prefix is reusable, the clock rides at the end
const system = `${CORE_PROMPT}\n\n${TOOL_NOTES}\n\n<runtime>\nCurrent time: ${now}\n</runtime>`;
```

A tool the model can call for the current time is often better still: it removes the value from the prompt entirely and costs a round trip only on turns that need it.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent tool execution | backlog |
| Agent chat | backlog |

The rows do not taper. This is a cost and latency defect with no user-visible failure, so it does not rise on tool execution the way a safety rule does. Promote it only when the finding comes with a measured cache-miss rate.

## Examples

**Anti-pattern (fails):** `system` is built as a template literal whose first interpolation is `new Date().toISOString()`, followed by 18,000 characters of standing instructions and tool notes.

**Applied (passes):** `CORE_PROMPT` is a module constant, the only interpolation happens inside a trailing `<runtime>` block, and the assembly function has a comment naming the cache boundary.

## Suppression

```ts
// ax-audit-ignore:context-volatile-prompt-prefix, prompt is 400 tokens, no cacheable prefix to protect
const system = `${now}\n${TINY_PROMPT}`;
```
