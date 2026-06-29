---
name: ax-audit
description: >-
  Audits agentic applications for architecture and trust: tool parity, tool
  granularity, context injection, completion signals, approval gates,
  confidence cues, escape hatches, intent handshakes, memory visibility, and
  adaptive canvases. Produces a ship-readiness verdict plus an AX Relationship
  Summary. Use when reviewing agentic feature PRs or asking "is this
  agent-native", "AX review", "critique this AI feature", "does this earn user
  trust", or "audit this for AX". For traditional frontend UX use ui-audit.
---

# AX Audit

Feature-level reviewer for apps where an agent acts for the user. One question: **does it earn trust, and where does it break?**

- **IS:** rules-based audit of agentic surfaces (agent chat, tool execution panels, agent config, dashboards) across two layers (architecture in `rules-arch/`, trust/relationship design in `rules-ax/`), ending in a ship-readiness verdict plus an AX Relationship Summary.
- **IS NOT:** traditional frontend UX (forms, states, focus, async, microcopy, accessibility, layout, typography, performance, use `ui-audit`); agent instruction-file quality (use `agents-md`).

No agentic features in scope (only forms, lists, modals)? Route to `ui-audit`; AX rules against traditional UI produce only noise.

## Contents

- [Audit workflow](#audit-workflow)
- [Two rule layers](#two-rule-layers)
- [Tiers and verdict](#tiers-and-verdict)
- [AX Relationship Summary](#ax-relationship-summary)
- [Reference files](#reference-files)
- [Gotchas](#gotchas)
- [Audit self-check](#audit-self-check)
- [Related skills](#related-skills)

## Audit workflow

Track this checklist:

```text
AX Audit progress:
- [ ] Step 1: Scope, via `git diff --name-only main` (PR mode) or explicit path (full sweep)
- [ ] Step 2: Detect agentic features per references/feature-playbooks.md
- [ ] Step 3: Run each detected feature's playbook in order, plus the diff-wide checks
- [ ] Step 4: For each check, load the rule file and follow its detection recipe
- [ ] Step 5: Tier each finding per references/ship-readiness.md (rule override table wins)
- [ ] Step 6: Render verdict + findings + AX Relationship Summary per references/output-format.md
- [ ] Step 7: Run the audit self-check and report its evidence counts
```

Step notes:

1. **Scope.** Default: PR diff plus the tool definitions and orchestrator code it touches. Findings in untouched files belong in a full sweep, not a PR verdict.
2. **Detect.** Heuristics (component names, hooks, routes) for the four feature types live in `references/feature-playbooks.md`.
3. **Playbooks.** Each feature has 5-9 ordered checks; run all, even expected passes (a pass with evidence belongs in the report). The diff-wide `parity-orphan-ui-action` runs on every PR-mode audit regardless of detected features.
4. **Rules.** Each rule file carries its own detection commands, false-positive guards, tier override table, and suppression syntax, and is authoritative; playbook annotations are a convenience copy.
5. **Tier.** Three tiers; precedence below.
6. **Render.** Group findings by surface; verdict block first, AX Relationship Summary last.
7. **Self-check.** Evidence or it didn't happen (see below).

## Two rule layers

| Layer | Folder | Rules | Question it answers | Category index |
|---|---|---|---|---|
| 1: Agent-native architecture | `rules-arch/` | 11 | Can the agent do what the user can do? Are tools atomic? Does the agent know what exists? Is completion explicit? | `rules-arch/_sections.md` |
| 2: Agentic experience | `rules-ax/` | 12 | Does the agent earn trust? Can the user interrupt, undo, push back? Is memory visible? | `rules-ax/_sections.md` |

Load `rules-arch/<category>-<slug>.md` or `rules-ax/<category>-<slug>.md` when a playbook check names it. Categories: arch = parity, granularity, context, comm; ax = trust, control, context, comm. Both layers share the `comm` and `context` prefixes, but the rules differ: `rules-arch/comm-no-approval-gate.md` (orchestrator code has no gate logic) is not `rules-ax/control-no-approval-gate.md` (approval UI doesn't match the stakes).

## Tiers and verdict

Every finding gets exactly one tier (full trigger lists in `references/ship-readiness.md`):

- `release-blocker`, fix before merge: no escape hatch, silent execution, heuristic completion, broken parity, ungated high-stakes actions
- `fix-this-sprint`, merge with a tracked issue: no confidence cues, no intent handshake, opaque memory, bundled config tools
- `backlog`, ship and track: static canvas, no generative momentum, static API mapping, no checkpoint/resume

Tier precedence: a rule's own surface-override table > the generic surface bump in `references/ship-readiness.md` > the rule's `defaultTier`. Apply at most one adjustment; never stack the generic bump on a rule's explicit override.

Verdict: ✅ READY (0 blockers, ≤3 sprint) · ⚠️ READY WITH FOLLOW-UP (0 blockers, ≥4 sprint) · ❌ NOT READY (≥1 blocker) · 🚫 INCOMPLETE (self-check failed).

## AX Relationship Summary

Rendered after findings when any agentic feature was detected. Findings serve engineers; this serves designers and PMs, so never skip it. Four fields:

- **Evolution stage**: behavior description, not a label (see `references/ax-evolution-curve.md`)
- **Trust signal**: high/moderate/low, one-line reasoning from trust-critical rules
- **Key gap**: the single most important gap, one actionable sentence
- **Trust question**: one question only prototyping or research can answer

## Reference files

| File | Read when |
|---|---|
| `references/feature-playbooks.md` | Steps 2-3: detection heuristics, per-feature ordered checks, diff-wide checks |
| `references/ship-readiness.md` | Step 5: tier triggers, precedence, verdict logic |
| `references/output-format.md` | Step 6: findings JSON schema, summary schema, terminal rendering |
| `references/agent-native-principles.md` | A Layer 1 finding needs grounding: parity, granularity, CRUD completeness, context patterns, approval matrices, checkpoint/resume |
| `references/ax-evolution-curve.md` | Writing the evolution-stage field of the AX summary |
| `rules-arch/_sections.md` | Layer 1 categories and default tiers |
| `rules-ax/_sections.md` | Layer 2 categories, default tiers, co-firing rule pairs |

## Gotchas

- **Scope before rules.** Running all 23 rules repo-wide on a 3-file PR buries a new release-blocker under pre-existing backlog noise; the verdict stops meaning "can this PR merge."
- **The rule's override table is authoritative.** `comm-no-intent-handshake` defaults to `fix-this-sprint` but its table says `release-blocker` on tool execution. Stacking the generic "+1 tier on tool execution" bump on an explicit override double-upgrades backlog findings into blockers.
- **A stop button not wired to `AbortController.abort()` is a false affordance.** `control-no-escape-hatch` still fails: verify the `abort()` call, not the button label, or the audit passes a UI that lies to users.
- **Absence checks need a recorded file list.** "Find components lacking X" greps return nothing both when everything passes and when nothing was scanned. List candidate files first (`rg -l <feature-pattern>`), check each for the counter-pattern, and cite the file list as evidence.
- **`detection: observational` rules cannot fail on grep evidence alone.** `granularity-static-api-mapping`, `trust-no-uncertainty-markers`, `control-over-conversational`, and `comm-no-generative-momentum` need interaction-flow judgment; on static evidence alone, return `unknown` with a reason, not `fail`.
- **`ax-audit-ignore:<slug>` comments count as `suppressed`, not `pass`.** Report the count in the verdict block; a suppression with no reason is itself worth a `warn`.
- **Don't duplicate ui-audit findings.** "Missing loading state" and "form clears on error" are `ui-audit` territory; duplicating them trains engineers to dismiss the whole AX report.
- **Don't inflate tiers.** `comm-no-generative-momentum` and `granularity-static-api-mapping` default to `backlog`. Promoting cosmetic findings to blocker trains the team to ignore ❌ verdicts.

## Audit self-check

Flag the audit `INCOMPLETE` if any of these hold, and include the counts as evidence (planned vs. run rules per playbook, unknown rate, suppressed count):

- Fewer rules ran than the playbooks planned
- More than 30% of rules returned `unknown`
- Any `fail`/`warn` finding lacks `file:line` evidence or a fix snippet
- Every finding landed in the same tier (suspect blanket assignment)
- AX Relationship Summary is missing despite detected agentic features

## Related skills

- `ui-audit`: traditional frontend UX quality around agentic surfaces; run both on agentic feature PRs, with ax-audit covering the agent layer
- `agents-md`: audit CLAUDE.md / AGENTS.md agent instruction files
- `define-architecture`: repo structure and module boundaries
