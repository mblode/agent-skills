# Output Adapters

One JSON document, two formats. Build the JSON first, then render to what the user or pipeline wants.

## Table of contents

- [Three counts: found, applied, remaining](#three-counts-found-applied-remaining)
- [Fix blast radius](#fix-blast-radius)
- [Considered and rejected](#considered-and-rejected)
- [Adapter 1: Terminal table](#adapter-1-terminal-table)
- [Adapter 2: CI JSON](#adapter-2-ci-json)
- [JSON schema](#json-schema)
- [Field reference](#field-reference)
- [Validation rules](#validation-rules)
- [Choosing the adapter](#choosing-the-adapter)
- [Common rendering rules](#common-rendering-rules)

## Three counts: found, applied, remaining

The audit reads and edits in the same pass, so a single total is a lie: it describes a working tree that no longer exists by the time the report prints. Every run carries three counts instead.

| Count | Meaning |
|---|---|
| `found` | Every finding the rules produced, measured against the code as it arrived |
| `applied` | Findings this run fixed in the working tree |
| `remaining` | Findings still present when the run ended |

Invariant, per tier and in total: `found = applied + remaining`. If they do not reconcile, the run is `INCOMPLETE`.

**The ship verdict computes over `remaining` only.** A release-blocker that was found and fixed does not block the ship; a release-blocker that was found and left does. `found` stays in the report so nobody loses sight of what the code looked like on arrival, and so a run that fixed nine real bugs reads as nine bugs fixed rather than a suspiciously green audit.

| Verdict | Condition |
|---|---|
| `READY` | 0 remaining release-blockers AND ≤3 remaining fix-this-sprint |
| `READY_WITH_FOLLOW_UP` | 0 remaining release-blockers AND ≥4 remaining fix-this-sprint |
| `NOT_READY` | ≥1 remaining release-blocker |
| `INCOMPLETE` | `audit.selfCheck.passed === false` |

Every applied finding states what was changed, with the file and line range touched. The count is only trustworthy if a reviewer can walk it against the diff. An `applied: true` finding with no `appliedChange` fails the self-check.

## Fix blast radius

**Fixes stay inside the audited files.** The audit's licence covers the diff it was pointed at, nothing else.

When the real fix lives outside that set (a shared `<Dialog>`, a design-token file, a layout wrapper the diff only consumes), do not apply it. Emit the finding with:

- `applied: false`
- `outOfScope: true`
- `outOfScopeReason`: which file the fix would have to touch, and what else consumes it
- `proposedDiff`: the unified diff a human can apply deliberately

The finding still counts toward `remaining`, and still tiers normally. A release-blocker whose fix is out of scope leaves the verdict at `NOT_READY`, which is the correct outcome: someone has to make a call about a shared component, and that someone is not the audit.

Silently editing a shared component to clear a blocker is the single worst failure mode of an audit that writes. One caller's bug becomes every caller's regression, and the report says "fixed".

## Considered and rejected

Every report names **2 to 5 things the audit looked at and deliberately did not flag**, each with the guard that killed it. This section is required, including on a clean run.

It is what keeps the taste rules honest. `slop-` findings are judgement calls against a threshold, and a rule that only ever fires reads as a rule with no threshold at all. Naming the near-misses proves the threshold was applied rather than pattern-matched.

Each entry is one candidate, the rule it was tested against, and the specific fact that cleared it:

- "Logo strip under the hero, tested against `slop-unverifiable-proof`: six real named customers with live links, not filler."
- "Hero gradient, tested against `slop-decoration-no-role`: one layer, threshold is 3."
- "Close control on the dialog, tested against `interaction-target-size`: 44px on both axes."

Vague entries ("checked the spacing, seemed fine") do not count. If the audit cannot name the guard, it did not really consider the candidate.

**An audit that finds nothing is a valid, good result.** Report it plainly: the counts, the verdict, the rules run, the rejections. Do not promote a backlog nit to fill the page, and do not pad with restated rule names. A four-line clean report is a stronger signal than a padded one.

## Adapter 1: Terminal table

For local dev, fast scan in the agent transcript or piped output. Tight, monospace-aware.

```text
═══════════════════════════════════════════════════════════
UI Audit · 8 files · diff vs main
FOUND 8  ·  APPLIED 3  ·  REMAINING 5
SHIP VERDICT: ✅ READY (0 release-blocker, 2 sprint, 3 backlog remaining)
═══════════════════════════════════════════════════════════

APPLIED IN THIS PASS (3)

✔ src/checkout/PaymentStep.tsx
  L42  was release-blocker  forms-lost-data-on-error
       Card number cleared on shipping-address 422 response.
       Applied L42-58: hoisted form state into useActionState with
       field-level errors, so unrelated fields survive a 422.

✔ src/checkout/PaymentStep.tsx
  L88  was fix-this-sprint  states-layout-shift
       <CardElement> rendered during stripe load with no reserved height (CLS risk).
       Applied L88: wrapped in <Suspense fallback={<CardSkeleton h="44px" />}>.

✔ src/checkout/ConfirmStep.tsx
  L51  was fix-this-sprint  forms-no-disable-while-submitting
       Applied L51: Place order stays enabled through the request; now disabled while pending.

REMAINING (5)

⚠️  src/checkout/PaymentStep.tsx
  L102 fix-this-sprint  microcopy-vague-error
       Error copy is "Something went wrong."
       Fix: name the cause and the retry path.
       Not applied: the wording is a product decision, not a mechanical edit.

⚠️  src/checkout/ConfirmStep.tsx  (fix is out of scope)
  L34  fix-this-sprint  focus-not-restored
       Modal closes; focus returns to <body>, not the trigger button.
       Root cause is src/components/Dialog.tsx, which this diff does not touch
       and 14 other surfaces consume. Not applied. Proposed diff:
         - <DialogPrimitive.Content>
         + <DialogPrimitive.Content onCloseAutoFocus={restoreToTrigger}>

📋 src/checkout/CheckoutForm.tsx
  L12  backlog  dark-i18n-untested
       No dark-mode story or visual regression. Not applied: needs a test file.

📋 src/checkout/PaymentStep.tsx
  L67  backlog  mobile-hover-only-affordance
       Help tooltip only on hover; touch users miss it.

📋 src/checkout/ConfirmStep.tsx
  L88  backlog  slop-token-drift
       `top: 37px` on the badge; no token covers it.

CONSIDERED AND REJECTED (3)

  · Logo strip under the hero, vs slop-unverifiable-proof: six real named
    customers with live links, not filler proof.
  · Hero gradient, vs slop-decoration-no-role: one layer, threshold is 3.
  · Close control on the dialog, vs interaction-target-size: 44px on both axes.

═══════════════════════════════════════════════════════════
Defer to:
  Performance (CWV):     Run Lighthouse on /checkout
  Bundle size:           Run next-bundle-analyzer
  WCAG violations:       Run axe-core in Storybook

Suppress a finding: add {/* ui-audit-ignore:<rule-slug> */} above the element.

Audit self-check: ✓ 14 rules run · ✓ counts reconcile (8 = 3 + 5)
                  ✓ every applied fix names its edit · ✓ 3 rejections named
═══════════════════════════════════════════════════════════

```

Rules:
- Two groups, `APPLIED` then `REMAINING`. Within `REMAINING`, sort by tier (blocker, sprint, backlog), then group by surface.
- Applied entries lead with `was <tier>` and a past-tense `Applied L<range>:` line naming the edit. Never render an applied finding with a bare `Fix:` line: that reads as outstanding work.
- Remaining entries carry a `Not applied:` reason. "Out of scope" entries name the owning file and show the proposed diff indented, not fenced.
- Unicode emoji for tier (`⛔ ⚠️ 📋`, `✔` for applied); ASCII fallback (`X ! . +`) on `--no-emoji`.
- Line numbers as `L42` not `:42` (easier to spot in terminals).
- One line per fix; if longer, truncate with `→` and keep the full text in JSON.
- `CONSIDERED AND REJECTED` is required and never empty.
- Close with the defer-to, suppression, and self-check footers.

A clean run is short and stays short:

```text
═══════════════════════════════════════════════════════════
UI Audit · 3 files · diff vs main
FOUND 0  ·  APPLIED 0  ·  REMAINING 0
SHIP VERDICT: ✅ READY
═══════════════════════════════════════════════════════════
11 rules ran. No findings.

CONSIDERED AND REJECTED (2)
  · Loading placeholder on the settings list, vs states-layout-shift: min-height at L22.
  · Close control on the dialog, vs interaction-target-size: 44px on both axes.
═══════════════════════════════════════════════════════════
```

## Adapter 2: CI JSON

For pipelines, dashboards, and merge gates. Emit the document exactly as specified below; this adapter adds no fields and drops none.

There is no binary to invoke: the audit runs as an agent, and this adapter describes the JSON it writes for a consumer to read. Two gates are worth building against that document, whatever pipes it:

- **Merge gate:** fail when `summary.remaining.releaseBlockers` is greater than 0, that is, when the audit found a blocker it could not fix.
- **Reconciliation guard:** fail when `summary.found.total` does not equal `summary.applied.total + summary.remaining.total`. That catches a run that lost findings between the two counts.

Gate on `remaining`, never on `found`. A gate on `found` fails a run that fixed everything it saw, which trains everyone to skip the audit.

There is no PR-comment adapter. Posting per-line review comments on a diff is the `pr-reviewer` skill's territory, and duplicating it here produces two bots arguing on the same line.

## JSON schema

Findings emit as JSON matching this schema; render the terminal table only after the JSON is complete.

### Top-level

```json
{
  "audit": {
    "ranAt": "2026-05-01T12:34:56Z",
    "skill": "ui-design",
    "mode": "audit",
    "scope": {
      "mode": "diff",
      "diffBase": "main",
      "files": ["src/checkout/PaymentStep.tsx", "..."],
      "filesAudited": 8
    },
    "featuresDetected": ["checkout", "modal"],
    "rulesPlanned": 18,
    "rulesRun": 18,
    "selfCheck": { "passed": true, "failures": [] }
  },
  "verdict": "READY",
  "summary": {
    "found":     { "releaseBlockers": 1, "fixThisSprint": 4, "backlog": 3, "total": 8 },
    "applied":   { "releaseBlockers": 1, "fixThisSprint": 2, "backlog": 0, "total": 3 },
    "remaining": { "releaseBlockers": 0, "fixThisSprint": 2, "backlog": 3, "total": 5 },
    "outOfScope": 1,
    "unknown": 0,
    "suppressed": 0
  },
  "consideredAndRejected": [
    {
      "candidate": "Logo strip under the hero",
      "rule": "slop-unverifiable-proof",
      "guard": "Six real named customers with live links, not filler proof."
    },
    {
      "candidate": "Hero background gradient",
      "rule": "slop-decoration-no-role",
      "guard": "One gradient layer; threshold is 3."
    },
    {
      "candidate": "Close control on the dialog",
      "rule": "interaction-target-size",
      "guard": "44px on both axes."
    }
  ],
  "deferredTo": [
    { "concern": "performance", "tool": "Lighthouse", "reason": "CWV measurement" },
    { "concern": "wcag", "tool": "axe-core", "reason": "Authoritative rule violations" }
  ],
  "findings": [ /* Finding[] */ ]
}
```

`verdict` is computed from `summary.remaining` alone. `tier` per finding is one of `release-blocker | fix-this-sprint | backlog`, and does not change when a fix is applied: an applied blocker stays a blocker in `found` and in its own record. Only the bucket it counts toward changes.

Default tier comes from the rule's frontmatter (`defaultTier`); the rule's `surfaceOverrides` table bumps it up or down per detected feature. Always include `defaultTier`, `assignedTier`, and `tierReason`.

### Self-check codes

`audit.selfCheck.failures[]` is empty on a clean audit. Codes:

```
"rules-not-fully-executed"     // rulesRun < rulesPlanned
"too-many-unknown"             // > 30% of run rules returned "unknown"
"no-evidence-cited"            // No file:line on any fail/warn finding
"no-fix-provided"              // Some fail/warn findings missing `fix`
"counts-do-not-reconcile"      // found ≠ applied + remaining, per tier or total
"applied-not-described"        // An applied finding has no `appliedChange`
"out-of-scope-applied"         // An edit landed outside audit.scope.files
"too-few-rejections"           // consideredAndRejected has < 2 entries
"uniform-tier"                 // ≥5 findings and every one landed in the same tier
```

`uniform-tier` needs the floor. Two backlog nits sharing a tier is what a small clean diff looks like; five or more findings that all land on the same tier is a tiering pass that never ran.

If `failures[]` is non-empty, set `verdict: "INCOMPLETE"`.

One finding example follows, for the `observed` / `expected` threshold shape. Everything an applied, out-of-scope, or unknown finding needs is a field in the table below with its own **Required when** condition; a worked object for those would narrow the shape without adding anything.

### Finding, threshold rule

```json
{
  "rule": "interaction-target-size",
  "feature": "modal",
  "surface": "ConfirmDialog",
  "file": "src/checkout/ConfirmDialog.tsx",
  "line": 18,
  "result": "fail",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "fix-this-sprint",
  "severity": "HIGH",
  "observed": { "width": 28, "height": 28 },
  "expected": { "min": 44 },
  "fix": "Close control is 28px; enlarge to 44px on both axes.",
  "applied": false
}
```

## Field reference

| Field | Required when | Description |
|---|---|---|
| `rule` | always | the rule's `id`, which matches its filename in `rules/` |
| `category` | always | the rule's `category`, one of the 14 in `rules/_sections.md` |
| `detect` | always | `static \| rendered \| rubric`, copied from the rule's frontmatter |
| `feature` | always | feature playbook this finding came from (`checkout`, `sign-in`, etc.) |
| `surface` | always | component or page name (PascalCase, no extension) |
| `file` | when result ≠ unknown | source file path |
| `line` | when grep reveals it | line number |
| `result` | always | `pass \| warn \| fail \| unknown` |
| `defaultTier` | fail / warn | rule's default tier |
| `assignedTier` | fail / warn | tier after surface overrides applied |
| `tierReason` | when assignedTier ≠ defaultTier | explanation of override |
| `severity` | fail / warn | `HIGH \| MEDIUM \| LOW` |
| `observed` | fail on a non-rubric rule | string OR object describing measurement |
| `expected` | fail on a non-rubric rule (when applicable) | object with rule threshold |
| `score` | `detect: rubric` | integer 1-5 |
| `anchor` | `detect: rubric` | verbatim text from rule's rubric table |
| `evidence` | fail (recommended) | array of `file:line: observation` strings |
| `fix` | fail / warn | string with the literal change |
| `fixSnippet` | fail (recommended) | code snippet for the prescribed change |
| `applied` | fail / warn | boolean; true if this run edited the working tree for this finding |
| `appliedChange` | applied=true | `file:startLine-endLine` plus one line naming the edit actually made |
| `outOfScope` | applied=false, fix reaches outside `audit.scope.files` | boolean |
| `outOfScopeReason` | outOfScope=true | the owning file and what else consumes it |
| `proposedDiff` | outOfScope=true | unified diff a human can apply deliberately |
| `docsLink` | fail (recommended) | URL to React/Next.js doc for the API in the fix |
| `reactApis` | when the fix uses a React or Next.js API | array of React 19 / Next.js APIs used in the fix |
| `suppressed` | always | boolean, true if `// ui-audit-ignore:<slug>` was present |
| `reason` | unknown | why the rule could not produce a verdict |

The suppression token is literally `ui-audit-ignore:`, matching what already exists in users' repos. It does not track the skill name.

## Validation rules

- Every `fail` and `warn` finding has `assignedTier`, `severity`, `fix`, and `applied`.
- Every `applied: true` finding has `appliedChange` naming a file and line range inside `audit.scope.files`.
- Every `outOfScope: true` finding has `applied: false`, an `outOfScopeReason`, and a `proposedDiff`.
- `summary.found` = `summary.applied` + `summary.remaining`, per tier and in total.
- `verdict` is derived from `summary.remaining` only.
- `consideredAndRejected` has 2 to 5 entries, each with `candidate`, `rule`, and `guard`.
- Every `detect: static` or `detect: rendered` fail finding has `observed`.
- Every `detect: rubric` finding has `score` AND `anchor`.
- Every `unknown` finding has `reason`, no tier, and no `applied`.
- Every finding belongs to exactly one `feature` and one `surface`.
- `pass` findings can be elided from the terminal rendering; keep them in JSON for the self-check.
- If `audit.selfCheck.passed === false`, set `verdict: "INCOMPLETE"`.
- `summary.suppressed` counts findings where `suppressed: true`. Suppressed findings are never applied.
- `assignedTier` defaults to `defaultTier` unless a surface override applies; always populate both.

## Choosing the adapter

| Where the audit runs | Adapter |
|---|---|
| Local terminal (`npm run audit`, agent CLI) | terminal |
| Claude Code chat | terminal |
| CI gating (block merge on remaining release-blockers) | JSON + jq |
| Status dashboard | JSON |

## Common rendering rules

- **JSON first.** Render the complete JSON document, then transform to the chosen adapter.
- **Pass findings elide.** Don't render `result: "pass"` findings in the terminal adapter; keep them in JSON.
- **One finding = one observable bug.** Don't bundle bugs under one rule; two issues firing the same rule are two findings.
- **Applied and remaining never mix.** A reader scanning the report should be able to answer "what do I still owe" from one block.
- **Tier-first, surface-second sort** inside each block: ⛔ first, ⚠️ next, 📋 last; within tier, group by surface.
- **The report ends at its footers.** Defer-to, suppression, and self-check close a run with findings; a clean run ends at the rejections. No sign-off, promotion, or summary paragraph follows either.
