# Output Schema

All findings emit as JSON conforming to this schema. Render to markdown only after the JSON is complete.

## Table of contents

- [Top-level](#top-level)
- [Verdict + tier semantics](#verdict--tier-semantics)
- [Self-check codes](#self-check-codes)
- [Finding (modern, Layer 2)](#finding-modern-layer-2)
- [Finding (laws, Layer 3)](#finding-laws-layer-3)
- [Finding (rubric, Layer 3)](#finding-rubric-layer-3)
- [Finding (unknown)](#finding-unknown)
- [Field reference](#field-reference)
- [Validation rules](#validation-rules)

## Top-level

```json
{
  "audit": {
    "ranAt": "2026-05-01T12:34:56Z",
    "skill": "ux-audit",
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
  "verdict": "NOT_READY",
  "summary": {
    "releaseBlockers": 1,
    "fixThisSprint": 3,
    "backlog": 3,
    "unknown": 0,
    "suppressed": 0
  },
  "deferredTo": [
    { "concern": "performance", "tool": "Lighthouse", "reason": "CWV measurement" },
    { "concern": "wcag", "tool": "axe-core", "reason": "Authoritative rule violations" }
  ],
  "findings": [ /* Finding[] */ ]
}
```

## Verdict + tier semantics

`verdict` is computed from per-finding tiers:

| Verdict | Condition |
|---|---|
| `READY` | 0 release-blockers AND ≤3 fix-this-sprint |
| `READY_WITH_FOLLOW_UP` | 0 release-blockers AND ≥4 fix-this-sprint |
| `NOT_READY` | ≥1 release-blocker |
| `INCOMPLETE` | `audit.selfCheck.passed === false` |

`tier` per finding is one of: `release-blocker | fix-this-sprint | backlog`.

Default tier comes from the rule's frontmatter (`defaultTier`); the rule's `surfaceOverrides` table can bump it up or down based on the detected feature. Always include `defaultTier`, `assignedTier`, and `tierReason` in the finding.

## Self-check codes

`audit.selfCheck.failures[]` is empty on a clean audit. Possible codes:

```
"rules-not-fully-executed"     // rulesRun < rulesPlanned
"too-many-unknown"             // > 30% of run rules returned "unknown"
"no-evidence-cited"            // No file:line on any fail/warn finding
"no-fix-provided"              // Some fail/warn findings missing `fix`
"implausible-timing"           // Median time-per-rule too short to be real
"uniform-tier"                 // All findings ended in same tier (suspect blanket)
```

If `failures[]` is non-empty, set `verdict: "INCOMPLETE"`.

## Finding (modern, Layer 2)

```json
{
  "rule": "forms-lost-data-on-error",
  "layer": "modern",
  "category": "forms",
  "feature": "checkout",
  "surface": "PaymentStep",
  "file": "src/checkout/PaymentStep.tsx",
  "line": 42,
  "result": "fail",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "release-blocker",
  "tierReason": "Surface is checkout; payment-data loss is money-flow blocker.",
  "severity": "HIGH",
  "observed": "Card number cleared on shipping-address 422 response. Form re-renders without `state.fields`.",
  "evidence": [
    "src/checkout/PaymentStep.tsx:42, useState reset on every render",
    "src/checkout/PaymentStep.tsx:88, onSubmit re-throws without preserving values"
  ],
  "fix": "Use `useActionState` with field-level errors; hoist `state.fields` across error responses.",
  "fixSnippet": "const [state, formAction] = useActionState(updateOrder, { fields: { card: '', expiry: '', cvc: '' }, errors: {} });",
  "docsLink": "https://react.dev/reference/react/useActionState",
  "reactApis": ["useActionState"],
  "suppressed": false
}
```

## Finding (laws, Layer 3)

```json
{
  "rule": "decision-hicks-law",
  "layer": "laws",
  "prefix": "decision",
  "feature": "modal",
  "surface": "ConfirmDialog",
  "file": "src/checkout/ConfirmDialog.tsx",
  "line": 18,
  "result": "fail",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "fix-this-sprint",
  "severity": "HIGH",
  "observed": { "count": 5 },
  "expected": { "max": 3 },
  "fix": "Modal footers should expose ≤3 actions; consolidate or move secondary actions to a meta-menu."
}
```

## Finding (rubric, Layer 3)

```json
{
  "rule": "interaction-aesthetic-usability",
  "layer": "laws",
  "kind": "rubric",
  "feature": "marketing-hero",
  "surface": "Hero",
  "file": "src/Hero.tsx",
  "line": 12,
  "result": "warn",
  "defaultTier": "backlog",
  "assignedTier": "backlog",
  "severity": "MEDIUM",
  "score": 3,
  "anchor": "Type scale present but inconsistent; spacing rhythm broken in 1-2 places; colour palette neutral but flat shadows.",
  "fix": "Adopt a spacing token (4/8/12/16/24); replace flat box-shadow with two-tier elevation; bump heading weight to 600."
}
```

## Finding (unknown)

```json
{
  "rule": "async-out-of-order-responses",
  "layer": "modern",
  "category": "async",
  "feature": "search",
  "surface": "SearchBar",
  "file": "src/search/SearchBar.tsx",
  "result": "unknown",
  "reason": "Search request handler not visible in scope; need to inspect onChange handler or fetch utility."
}
```

## Field reference

| Field | Required when | Description |
|---|---|---|
| `rule` | always | kebab-case slug matching a file in `rules-modern/` or `rules/` |
| `layer` | always | `modern` (Layer 2) or `laws` (Layer 3) |
| `category` | layer=modern | `forms | states | async | focus | mobile | dark-i18n | microcopy` |
| `prefix` | layer=laws | `cognitive | decision | perception | memory | interaction` |
| `kind` | layer=laws | `programmatic | rubric` (from the rule's frontmatter; rubric rules also emit `score` + `anchor`) |
| `feature` | always | feature playbook this finding came from (`checkout`, `sign-in`, etc.) |
| `surface` | always | component or page name (PascalCase, no extension) |
| `file` | when result ≠ unknown | source file path |
| `line` | when grep reveals it | line number |
| `result` | always | `pass | warn | fail | unknown` |
| `defaultTier` | fail / warn | rule's default tier |
| `assignedTier` | fail / warn | tier after surface overrides applied |
| `tierReason` | when assignedTier ≠ defaultTier | explanation of override |
| `severity` | fail / warn | `HIGH | MEDIUM | LOW` |
| `observed` | Layer 2 fail | string OR object describing measurement |
| `expected` | Layer 2 fail (when applicable) | object with rule threshold |
| `score` | Layer 3 rubric | integer 1-5 |
| `anchor` | Layer 3 rubric | verbatim text from rule's rubric table |
| `evidence` | fail (recommended) | array of `file:line: observation` strings |
| `fix` | fail / warn | string with the literal change |
| `fixSnippet` | fail (recommended) | code snippet ready for `suggestion` block |
| `docsLink` | fail (recommended) | URL to React/Next.js doc for the API in the fix |
| `reactApis` | layer=modern | array of React 19 / Next.js APIs used in the fix |
| `suppressed` | always | boolean, true if `// ux-audit-ignore:<slug>` was present |
| `reason` | unknown | why the rule could not produce a verdict |

## Validation rules

- Every `fail` and `warn` finding has `assignedTier`, `severity`, `fix`.
- Every Layer-2 fail finding has `observed`.
- Every Layer-3 rubric finding has `score` AND `anchor`.
- Every `unknown` finding has `reason`.
- Every finding belongs to exactly one `feature` and one `surface`.
- `pass` findings can be elided from the markdown rendering; keep them in JSON for audit-self-check.
- If `audit.selfCheck.passed === false`, set `verdict: "INCOMPLETE"`.
- `summary.suppressed` counts findings where `suppressed: true` (matched a `ux-audit-ignore` comment).
- `assignedTier` defaults to `defaultTier` unless surface override applies; always populate both.
