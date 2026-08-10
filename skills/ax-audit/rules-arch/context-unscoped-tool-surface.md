---
title: Every tool and the whole prompt ship on every run
slug: context-unscoped-tool-surface
category: context
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-tool-execution, agent-config
agent-native-principle: Context (progressive disclosure)
detection: code-auditable
related: context-starvation, context-no-injection, context-volatile-prompt-prefix, granularity-permissive-tool-schema
---

## Every tool and the whole prompt ship on every run

The registry hands the model every tool it owns and the system prompt carries every procedure the product supports, whatever the user asked for. Each new capability then taxes every unrelated request: more schemas to read past, more instructions competing for attention, and a larger surface for the model to pick the wrong thing from. Violates Context, which is a two-sided budget rather than a floor to clear.

Scope: this rule fires on the absence of any scoping mechanism. `context-starvation` fires on the opposite defect, a prompt that never says what exists. A codebase can fail both, and the fix is the same restructure: a small stable core plus procedures loaded when the task calls for them.

## What goes wrong

A support agent grows from 6 tools to 40 over two quarters. Nothing regresses in review, because each PR adds one tool. Then billing questions start resolving as refunds: `issue_refund` and `explain_charge` are adjacent in a 40-schema block, and the prompt's refund policy sits 3,000 tokens from the billing section that qualifies it. Nobody changed the refund logic. The context around it got noisier.

## Detection

**Surfaces:** agent-chat, agent-tool-execution, agent-config

**Static signals:**
1. Count registered tools at the call site that builds the model request. Record the number.
2. Measure the always-on system prompt in characters, including anything concatenated into it at request time.
3. Look for any scoping mechanism: a per-request tool filter, a load-on-demand procedure loader, prompt sections assembled from the channel or route, or subagents with their own prompt and tools.
4. Fail when steps 1 and 2 are both large (roughly 20+ tools or 12,000+ characters of prompt) and step 3 finds nothing. Report the counts as evidence either way.

**Concrete commands:**
```bash
rg 'tools\s*[:=]\s*[\[{]' --type=ts -A 40 src/        # what gets handed to the model
rg -c '' src/prompts/*.md src/**/instructions.md      # always-on prompt size
rg '(activeTools|toolChoice|filterTools|allowedTools|loadSkill|load_skill|defineSkill)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-unscoped-tool-surface`.
- Skip agents under the thresholds; a 6-tool agent with one prompt is correctly shaped and scoping it would only add indirection.
- Skip a registry that is already filtered upstream: confirm what reaches the model request, not what the module exports.
- Skip subagent definitions, which are themselves the scoping mechanism, and test fixtures.

## Fix

Keep a small stable core in the always-on prompt and move procedures behind a loader the model calls when a task matches. Tool sets follow the same split where the framework allows a per-request filter.

```ts
// before: one prompt, every tool, every turn
const result = await run({ system: ENTIRE_PROMPT, tools: allTools });

// after: stable core plus what this run actually needs
const result = await run({
  system: CORE_PROMPT,                              // identity, voice, standing rules
  tools: toolsFor(surface),                         // scoped by the invocation context
  skills: registry,                                 // procedures the model loads on demand
});
```

Which procedures earn a place in the core is a judgment call: anything the agent must honour on a turn where it never thinks to load it stays resident.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |

The rows do not taper. This is a shape problem in how the request is assembled, so it costs the same on every surface that assembles one, and it degrades accuracy rather than safety.

## Examples

**Anti-pattern (fails):** `run({ system: PROMPT, tools: allTools })` at the single call site, 40 entries in `allTools`, an 18,000-character prompt file, and no hit for `activeTools|load_skill|defineSkill` anywhere in the repo.

**Applied (passes):** the same call site reads `toolsFor(ctx.surface)`, the resident prompt is 4,000 characters of identity and standing rules, and six procedure files sit behind a loader the model can call mid-run.

## Suppression

```ts
// ax-audit-ignore:context-unscoped-tool-surface, single-purpose extraction agent, all 24 tools are one workflow
const agent = createAgent({ system: PROMPT, tools: extractionTools });
```
