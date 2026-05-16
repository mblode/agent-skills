---
name: ax-audit
description: >
  Audits agentic applications across two layers: agent-native architecture
  (tool parity, atomic primitives, context injection, completion signals,
  approval gates) and agentic experience design (trust patterns, confidence
  cues, escape hatches, intent handshake, adaptive canvas, memory visibility).
  Produces a 3-tier ship-readiness verdict (release-blocker / fix-this-sprint
  / backlog) plus an AX Relationship Summary naming the evolution stage, trust
  signal, and key gap. Use before merging an agentic feature PR, when asked
  "is this agent-native?", "AX review", "AX critique", "critique this AI
  feature", "does this earn user trust?", "is this design actually agentic?",
  "trust review", "AX patterns check", or "audit this for AX". For traditional
  UX auditing (forms, states, focus, async, microcopy), use ux-audit.
---

# AX Audit

Agentic experience reviewer for applications where agents act on behalf of users. Operates at the **feature level** (an agent chat, a tool execution panel, an agent config screen) and answers one question: "**does this agent earn trust, and where does it break?**"

## What this skill IS

- An audit for agentic features: agent chat, tool execution, agent config, agent dashboards
- A rules-based reviewer across two layers: architecture correctness and trust/relationship design
- A ship-readiness verdict generator: every finding gets `release-blocker | fix-this-sprint | backlog`
- An AX Relationship Summary producer: names the evolution stage, trust signal, and key gap

## What this skill IS NOT

| Concern | Use instead | Why |
|---|---|---|
| Traditional UX (forms, states, focus, async, microcopy) | `ux-audit` | 60+ rules, 12 feature playbooks for React/Next.js UX |
| Core Web Vitals, bundle size | Lighthouse, size-limit | Runtime measurement |
| WCAG violations | axe-core / jsx-a11y | Authoritative accessibility rules |
| General design critique | design:design-critique | Not AX-specific |
| Conversational AX design partner | ax-feature-design | For exploring, not auditing |
| Agent instruction file quality | `agents-md` | CLAUDE.md / AGENTS.md auditing |

## Audit Workflow

Copy and track this checklist:

```text
AX Audit progress:
- [ ] Step 1: Determine scope (PR diff via `git diff --name-only main` OR explicit file/folder)
- [ ] Step 2: Detect agentic features in scope (agent chat / tool execution / config / dashboard)
- [ ] Step 3: For each feature, run its playbook from references/feature-playbooks.md
- [ ] Step 4: For each check, load the matching rule (rules-arch/ or rules-ax/)
- [ ] Step 5: Assign each finding a ship tier per references/ship-readiness.md
- [ ] Step 6: Render findings + AX Relationship Summary per references/output-format.md
- [ ] Step 7: Verify the audit-self-check before reporting
```

1. **Scope.** Default to `git diff --name-only main` if in a git repo. Audit only changed files. For a full sweep, use explicit `--full src/`.
2. **Detect features.** Match on component names, props, routes, and import patterns. See `references/feature-playbooks.md` for detection heuristics.
3. **Run playbook.** Each agentic feature has 5-7 ordered checks. Don't skip checks even when you expect them to pass.
4. **Load rules.** Two layers:
   - **`rules-arch/`** (Layer 1) — agent-native architecture: tool parity, atomicity, context injection, completion signals. 11 rules.
   - **`rules-ax/`** (Layer 2) — agentic experience: trust, control, context/memory, agent communication. 12 rules.
5. **Ship tier.** Every finding gets one tier (see `references/ship-readiness.md`):
   - `release-blocker` — fix before merge (no escape hatch, silent execution, heuristic completion, broken parity)
   - `fix-this-sprint` — merge but log issue (no confidence cues, no intent handshake, opaque memory)
   - `backlog` — track, ship (static canvas, no generative momentum, no checkpoint)
6. **Render.** Group by surface. Include the AX Relationship Summary after findings (see `references/output-format.md`).
7. **Self-check.** Verify the audit was actually run.

## Two audit layers

```
Layer 1 — Agent-native architecture
  rules-arch/<category>-<slug>.md
  11 rules covering parity, granularity, context, communication.
  Structural/architectural correctness. "Can the agent do what
  the user can do? Are the tools atomic? Does the agent know
  what exists?"

Layer 2 — Agentic experience
  rules-ax/<category>-<slug>.md
  12 rules covering trust, control, context/memory, communication.
  Trust and relationship design. "Does the agent earn trust?
  Can the user push back? Is memory visible? Does the agent
  confirm intent before acting?"
```

## Agentic feature detection

| Feature | Detect by |
|---|---|
| Agent chat / copilot | `<Chat>`, `<Assistant>`, `<Copilot>`, `role="assistant"`, `isStreaming`, `useChat`, `useCompletion`, route `/chat`, `/assistant`, `/copilot` |
| Agent tool execution | `<ToolCall>`, `<Action>`, `tool_use`, `function_call`, `executeAction`, `agentAction`, component `*ToolPanel*`, `*ActionLog*` |
| Agent config | `<SystemPrompt>`, `<AgentConfig>`, `<PromptEditor>`, route `/agent/settings`, `/configure` |
| Agent dashboard | `<AgentStatus>`, `<TaskList>`, `<RunHistory>`, component `*AgentDashboard*`, route `/agent`, `/runs` |

If no agentic features are detected, this skill does not apply — use `ux-audit` instead.

## Ship-readiness verdict

Every audit emits a top-level verdict before per-finding details:

```text
═══════════════════════════════════════════════════════════
AX VERDICT: ❌ NOT READY (1 release-blocker)

Surfaces:            2 (ChatPanel, ToolExecutionPanel)
Findings:            6
  Release blockers:  1   ⛔  No escape hatch (ToolExecutionPanel.tsx:34)
  Fix this sprint:   3   ⚠️
  Backlog:           2   📋

AX Relationship:
  Stage:       Task-Aware (2 of 4)
  Trust:       Low — no escape hatch, no confidence cues
  Key gap:     Agent executes multi-step tasks with no cancel or undo
  Question:    Will users accept a confirmation step before tool execution?

Cross-reference:     Run ux-audit for traditional UX findings
═══════════════════════════════════════════════════════════
```

Verdict tiers:
- ✅ **READY** — 0 release-blockers, ≤3 fix-this-sprint
- ⚠️ **READY WITH FOLLOW-UP** — 0 release-blockers, ≥4 fix-this-sprint
- ❌ **NOT READY** — ≥1 release-blocker
- 🚫 **INCOMPLETE** — audit-self-check failed (re-run)

## AX Relationship Summary

Produced after findings. Names the relationship between user and agent in behavioral terms.

Four fields:
- **Evolution stage** — which of 4 stages the design sits at (see `references/ax-evolution-curve.md`). Describe behavior, not label.
- **Trust signal** — high / moderate / low, based on trust-critical rule results.
- **Key gap** — the single most important architectural or trust gap. Specific enough to act on.
- **Trust Question** — one question for the next round of work. Should require prototyping or research to answer.

## Reference Files

| File | Read when |
|------|-----------|
| `references/agent-native-principles.md` | Understanding the 5 core principles: Parity, Granularity, Composability, Emergent Capability, Improvement Over Time |
| `references/ax-evolution-curve.md` | Assessing relationship depth: Conversational → Task-Aware → Personally Intelligent → Socially Embedded |
| `references/feature-playbooks.md` | Step 2-3 — detecting agentic features and running their playbooks |
| `references/ship-readiness.md` | Step 5 — assigning each finding a ship tier with agentic surface overrides |
| `references/output-format.md` | Step 6 — rendering findings + AX Relationship Summary |
| `rules-arch/_sections.md` | Category index for the architecture rule layer |
| `rules-arch/<category>-<slug>.md` | Step 4 — running a Layer 1 architecture check |
| `rules-ax/_sections.md` | Category index for the agentic experience rule layer |
| `rules-ax/<category>-<slug>.md` | Step 4 — running a Layer 2 agentic experience check |

## Cross-reference to ux-audit

AX Audit and UX Audit are complementary. Run both on agentic features:

- **ax-audit** catches: broken parity, silent agents, missing escape hatches, opaque memory, over-conversational design, no intent handshake
- **ux-audit** catches: form data loss, missing loading/empty/error states, broken focus traps, optimistic UI without rollback, vague microcopy

When an agentic surface also contains traditional UI (a form inside a chat panel, a modal triggered by an agent action), the ux-audit rules apply to those elements. ax-audit does not duplicate them.

## Gotchas

- **Don't run ax-audit on non-agentic features.** If the diff contains only forms, lists, and modals with no agent interaction, use `ux-audit`. Running ax-audit rules against traditional UI produces noise.
- **Don't duplicate ux-audit findings.** If a finding is "missing loading state" or "form clears on error," that's ux-audit territory. ax-audit covers the agent-specific layer on top.
- **Don't inflate tiers.** Reserve `release-blocker` for genuine trust-breakers (no escape hatch, silent execution, heuristic completion). "No generative momentum" is backlog, not a blocker.
- **Don't skip feature detection.** Running all 23 rules against every file produces noise. Run the right playbook per agentic feature.
- **Don't fabricate detections.** If you can't grep or read the relevant code, mark the finding `unknown` with a reason. Never claim a finding without evidence.
- **Don't apply observational rules without judgment context.** Rules marked `observational` in their frontmatter require understanding the interaction flow, not just static code analysis. If you can't assess the interaction, mark as `unknown`.
- **Don't skip the AX Relationship Summary.** It's the most valuable output for designers and PMs. Findings are for engineers; the summary is for the team.

## Audit-self-check

Self-flag the audit as `INCOMPLETE` if any of these are true:

- Fewer rules ran than the playbook's planned count
- More than 30% of rules returned `unknown` (insufficient evidence)
- No `file:line` cited on any fail/warn finding
- No fix snippet provided on any fail/warn finding
- Every finding ended up in the same tier (suspect blanket-assignment)
- AX Relationship Summary is missing when Layers 1-2 both fired

## Related Skills

- `ux-audit` — traditional UX quality audit (forms, states, focus, async, microcopy)
- `agents-md` — audit CLAUDE.md / AGENTS.md for agent instruction quality
- `define-architecture` — repo structure and module boundaries
