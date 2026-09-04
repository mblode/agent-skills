---
name: ax-audit
description: Audits agentic products for tool parity, authority, approval payloads, recovery, and trust using 27 rules and a ship verdict. Use when asked for an "AX audit", to review an agent approval flow, or whether an agent can operate the product. For human-facing API ergonomics use dx-audit; for ordinary UI use ui-design.
---

# AX Audit

Feature-level reviewer for apps where an agent acts for the user. One question: **does it earn trust, and where does it break?**

- **IS:** rules-based audit of agentic surfaces (chat, tool execution, config, dashboards) across architecture (`rules-arch/`) and trust (`rules-ax/`), ending in a ship-readiness verdict plus an AX Relationship Summary.
- **IS NOT:** traditional frontend UX (use `ui-design` Audit mode); developer-facing API, CLI, or type ergonomics (use `dx-audit`); agent instruction files (use `agents-md`); what the product should do before it exists (use `product-design`).

No agentic features in scope? Stop. AX rules against forms and lists are noise.

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

```text
AX Audit progress:
- [ ] Step 1: Scope, via the diff against the PR base merge-base (PR mode) or explicit path (full sweep)
- [ ] Step 2: Detect agentic features per references/feature-playbooks.md
- [ ] Step 3: Run each detected feature's playbook in order, plus the diff-wide checks (PR mode only)
- [ ] Step 4: For each check, load the rule file and follow its detection recipe
- [ ] Step 5: Tier each finding per references/ship-readiness.md (rule override table wins)
- [ ] Step 6: Render verdict + findings + AX Relationship Summary per references/output-format.md
- [ ] Step 7: Run the audit self-check and report its evidence counts
```

PR-mode scope is the diff plus the tool definitions and orchestrator it touches. Findings in untouched files belong in a full sweep, not this verdict. Playbook annotations are a scan copy; the rule file is authoritative. `parity-orphan-ui-action` runs on every PR-mode audit and never in a full sweep, where there is no diff for it to read.

Rule greps name the most common identifiers, not every framework's spelling. When a grep misses in code that plainly does the thing (a gate, a stream, a tool result), check `references/framework-signals.md` for the stack's name for it before recording `unknown`.

## Two rule layers

| Layer | Folder | Rules | Load when a playbook names |
|---|---|---|---|
| 1: Architecture | `rules-arch/` | 12 | `rules-arch/<category>-<slug>.md` |
| 2: Experience | `rules-ax/` | 15 | `rules-ax/<category>-<slug>.md` |

Categories: arch = parity, granularity, context, comm; ax = trust, control, context, comm. Shared prefixes are different rules: `rules-arch/comm-no-approval-gate.md` (no gate on the execution path) is not `rules-ax/control-no-approval-gate.md` (gate exists, stakes are wrong).

Run Layer 1 `comm`/`parity` and Layer 2 `control`/`trust` first. They hold the blockers. Category map: `rules-arch/_sections.md`, `rules-ax/_sections.md`.

| Priority | Layer | Category | Prefix | Rules |
|---|---|---|---|---|
| 1 | arch | Communication | `comm-` | 3 |
| 2 | arch | Parity | `parity-` | 4 |
| 3 | ax | Control | `control-` | 4 |
| 4 | ax | Trust | `trust-` | 4 |
| 5 | arch | Context | `context-` | 3 |
| 6 | ax | Communication | `comm-` | 4 |
| 7 | ax | Context | `context-` | 3 |
| 8 | arch | Granularity | `granularity-` | 2 |

## Tiers and verdict

Three tiers. Full trigger lists and the generic surface bump live in `references/ship-readiness.md`.

Precedence: the rule's own surface-override table > the generic bump > `defaultTier`. Apply at most one adjustment.

Verdict: ✅ READY (0 blockers, ≤3 sprint) · ⚠️ READY WITH FOLLOW-UP (0 blockers, ≥4 sprint) · ❌ NOT READY (≥1 blocker) · 🚫 INCOMPLETE (self-check failed).

Blockers outrank an incomplete audit. With ≥1 release-blocker and a failed self-check, report ❌ NOT READY and note the self-check failure beneath it: the blockers are established findings and stay actionable, while 🚫 reads as "nothing was learned" and sends the reader away. Reserve 🚫 for an audit with no blockers whose coverage you cannot vouch for.

## AX Relationship Summary

Render after findings when any agentic feature was detected. Findings serve engineers; this serves designers and PMs. Four fields: evolution stage (behavior, not a label), trust signal (high/moderate/low plus one-line reason), key gap (one actionable sentence), trust question (one question only research can answer).

## Reference files

| File | Read when |
|---|---|
| `references/feature-playbooks.md` | Steps 2-3: detection heuristics, per-feature ordered checks, diff-wide checks |
| `references/framework-signals.md` | Step 4, when the code uses AI SDK, MCP, the Claude Agent SDK, or AG-UI: where the gate, the stream, the completion signal, and the structured result live in each, with the spec defaults the rules lean on |
| `references/ship-readiness.md` | Step 5: tier triggers, precedence, verdict logic |
| `references/output-format.md` | Step 6: findings JSON schema, summary schema, terminal rendering |
| `references/agent-native-principles.md` | A Layer 1 finding needs grounding the rule file does not carry |
| `references/ax-evolution-curve.md` | Writing the AX Relationship Summary: stage, action depth, costume vs intelligence |
| `references/invisible-interface.md` | Grounding for structured tool output, approval payload, access scope, unprompted action; also the arguments that stay in `keyGap` |
| `references/evaluation-scenarios.md` | When changing this skill. Never loads during a user audit |
| `rules-arch/_sections.md` | Layer 1 categories, default tiers, co-firing pairs |
| `rules-ax/_sections.md` | Layer 2 categories, default tiers, co-firing pairs |

## Gotchas

- **Scope before rules.** Running all 27 rules repo-wide on a 3-file PR buries a new release-blocker under pre-existing backlog noise; the verdict stops meaning "can this PR merge."
- **The rule's override table is authoritative.** `comm-no-intent-handshake` defaults to `fix-this-sprint` but its table says `release-blocker` on tool execution. Stacking the generic "+1 tier on tool execution" bump on an explicit override double-upgrades backlog findings into blockers.
- **A stop button not wired to `AbortController.abort()` is a false affordance.** `control-no-escape-hatch` still fails: verify the `abort()` call, not the button label, or the audit passes a UI that lies to users.
- **A client `stop()` that only closes the stream leaves the executor running.** `useChat().stop()` aborts the fetch. Unless the route passes `req.signal` into `streamText({ abortSignal })` and tool `execute` reads it, the server finishes every remaining tool call after the user pressed Stop. Trace the signal to the loop, not to the button.
- **Tool annotations are hints, not stakes.** MCP tells clients to treat `annotations` from untrusted servers as untrusted; a gate that auto-approves on a third-party server's `readOnlyHint: true` has handed the gate to that server. `comm-no-approval-gate` fails it. The spec defaults (`destructiveHint: true`, `readOnlyHint: false`) are the fail-closed baseline.
- **A framework approval flag is the gate's input, not the gate.** AI SDK `toolApproval: "user-approval"` emits a `tool-approval-request` part and waits. A UI that never renders `state === "approval-requested"`, or answers it with `addToolApprovalResponse({ approved: true })` on arrival, has a gate in the type system and none for the user. Check the renderer and the response call, not the option.
- **Absence checks need a recorded file list.** "Find components lacking X" greps return nothing both when everything passes and when nothing was scanned. List candidate files first (`rg -l <feature-pattern>`), check each for the counter-pattern, and cite the file list as evidence.
- **`detection: observational` rules cannot fail on grep evidence alone.** `granularity-static-api-mapping`, `trust-no-uncertainty-markers`, `control-over-conversational`, and `comm-no-generative-momentum` need interaction-flow judgment; on static evidence alone, return `unknown` with a reason, not `fail`.
- **Gates fail in three separate places.** Absent from the path (`comm-no-approval-gate`), present but mismatched to the stakes (`control-no-approval-gate`), or correct and unreadable (`control-thin-approval-payload`). Report the first that holds and fix in that order.
- **Interactive gates do not cover unattended runs.** Cron, webhook, and queue entry points reach the same executor with nobody to prompt. `comm-unrequested-action-no-consent` audits that path; evidence names the entry point, not the executor.
- **`ax-audit-ignore:<slug>` comments count as `suppressed`, not `pass`.** Report the count in the verdict block; a suppression with no reason is itself a `warn`.
- **Don't inflate tiers.** `comm-no-generative-momentum` and `granularity-static-api-mapping` default to `backlog`. One finding promoted to `release-blocker` flips the whole PR to ❌ NOT READY, so promoting cosmetic ones trains the team to ignore the verdict entirely.
- **Don't duplicate `ui-design` Audit mode findings.** "Missing loading state" and "form clears on error" are its territory; duplicating them trains engineers to dismiss the whole AX report.
- **A Personally Intelligent agent that only ever suggests has plateaued.** Memory stage is not trust. Name the highest action rung in `evolutionStage.behavior` or the summary flatters a polite chatbot.

## Audit self-check

Flag the audit `INCOMPLETE` if any of these hold, and include the counts as evidence (planned vs. run rules per playbook, unknown rate, suppressed count):

- Fewer rules ran than the playbooks planned
- More than 30% of rules returned `unknown`. Count only `unknown` here, never `out-of-scope`: a rule whose layer is absent from the scope you were given was answered correctly, and a narrow diff is the scope Step 1 asks for. Marking a correctly scoped audit INCOMPLETE buries its real blockers under a verdict that reads as "we learned nothing".
- Any `fail`/`warn` finding lacks `file:line` evidence or a fix snippet
- Every finding landed in the same tier (suspect blanket assignment)
- AX Relationship Summary is missing despite detected agentic features

## Related skills

- `ui-design` Audit mode: traditional frontend UX around agentic surfaces; run both on agentic feature PRs
- `dx-audit`: same files, different reader. This skill asks whether an agent can operate and recover; `dx-audit` asks whether a human adopting the API, CLI, or types finds it ergonomic
- `product-design`: what the agentic feature should do, before this audit
- `agents-md`: CLAUDE.md / AGENTS.md instruction files

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
