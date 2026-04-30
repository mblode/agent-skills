# Output Schema

All findings emit as JSON conforming to this schema. Render to markdown only after the JSON is complete.

## Table of contents

- [Top-level](#top-level) — full audit document shape
- [Verdict + grade derivation](#verdict--grade-derivation) — score, verdict tier, letter grade rules
- [Self-check](#self-check) — audit-the-audit failure codes
- [Finding (programmatic, Tier 1)](#finding-programmatic-tier-1) — example with all fields
- [Finding (rubric, Tier 3)](#finding-rubric-tier-3) — example with score + anchor
- [Finding (unknown)](#finding-unknown) — when evidence is missing
- [Field reference](#field-reference) — table of every field, when required
- [Validation rules](#validation-rules) — invariants every audit must hold

## Top-level

```json
{
  "audit": {
    "scope": ["src/Header.tsx", "src/Checkout/*.tsx"],
    "ranAt": "2026-05-01T12:34:56Z",
    "skill": "ux-audit",
    "surfaces": ["primary-nav", "marketing-hero"],
    "rulesRun": 9,
    "rulesPlanned": 9,
    "selfCheck": {
      "passed": true,
      "failures": []
    }
  },
  "verdict": "CONDITIONAL_PASS",
  "grade": "B",
  "summary": {
    "passed": 18,
    "warn": 4,
    "failed": 8,
    "unknown": 0,
    "score": 78,
    "hardGates": {
      "criticalCategoryFails": 1,
      "criticalCategoryFailsSevere": false,
      "foundationalInteractionFails": 1,
      "conventionBreak": false,
      "darkPatternRubric": null,
      "insufficientEvidence": false
    }
  },
  "findings": [ /* Finding[] */ ]
}
```

### Verdict + grade derivation

- `summary.score` = `passed / (passed + warn + failed) * 100`, rounded. `unknown` results are excluded from the denominator.
- `verdict` is `PASS | CONDITIONAL_PASS | FAIL | INCOMPLETE`. Apply the hard-gate logic from SKILL.md after computing per-rule findings.
- `grade` is `A` (90+), `B` (80-89), `C` (70-79), `D` (60-69), `F` (<60). Omitted when `verdict: "INCOMPLETE"`.

### Self-check

`audit.selfCheck.failures[]` lists any audit-the-audit checks that tripped. If non-empty, set `verdict: "INCOMPLETE"`. Possible values:

```
"rules-not-executed"        // Fewer rules ran than the playbook lists
"too-many-unknown"          // >50% of run rules returned unknown
"no-evidence-cited"         // No file:line on any fail/warn finding
"no-reproduce-steps"        // No reproduceSteps on any fail finding
"implausible-timing"        // Median time-per-rule too short to be real
"uniform-results"           // All rules returned identical result
```

## Finding (programmatic, Tier 1)

```json
{
  "rule": "decision-hicks-law",
  "tier": "programmatic",
  "surface": "primary-nav",
  "file": "src/Header.tsx",
  "line": 42,
  "suspectedLocation": "src/Header.tsx:42 (the <nav> element wrapping <a> children)",
  "severity": "HIGH",
  "result": "fail",
  "observed": { "count": 14 },
  "expected": { "max": 7 },
  "reproduceSteps": [
    "Open src/Header.tsx",
    "Locate the <nav> element starting at line 42",
    "Count direct interactive children (<a>, <button>): 14"
  ],
  "fix": "Group into 4 categories (Product, Resources, Pricing, Account); move tertiary items into in-category submenus.",
  "effort": "hours"
}
```

## Finding (rubric, Tier 3)

```json
{
  "rule": "interaction-aesthetic-usability",
  "tier": "rubric",
  "surface": "marketing-hero",
  "file": "src/Hero.tsx",
  "line": 12,
  "suspectedLocation": "src/Hero.tsx — full hero section",
  "severity": "MEDIUM",
  "result": "warn",
  "score": 3,
  "anchor": "Type scale present but inconsistent; spacing rhythm broken in 1-2 places; colour palette neutral but flat shadows.",
  "reproduceSteps": [
    "Open src/Hero.tsx in browser at marketing route",
    "Compare heading weights — only 2 weights used",
    "Inspect spacing — 3 ad-hoc px values rather than scale tokens",
    "Check shadow — single flat box-shadow, no elevation tier"
  ],
  "fix": "Adopt one of the spacing tokens (4/8/12/16/24); replace flat box-shadow with two-tier elevation; bump heading weight to 600.",
  "effort": "days"
}
```

## Finding (unknown)

```json
{
  "rule": "interaction-doherty-threshold",
  "tier": "programmatic",
  "surface": "search-results",
  "file": "src/Search.tsx",
  "result": "unknown",
  "reason": "No skeleton or progress UI in JSX; need runtime latency measurement to confirm violation."
}
```

Use `unknown` whenever evidence is missing. Always include a `reason`.

## Field reference

| Field | Required when | Description |
|---|---|---|
| `rule` | always | kebab-case slug matching a file in `rules/` |
| `tier` | always | `programmatic` or `rubric` |
| `surface` | always | kebab-case surface name from the playbook list |
| `file` | when result ≠ unknown | source file path |
| `line` | when grep reveals it | line number |
| `suspectedLocation` | fail / warn | natural-language pointer for human reviewer (e.g. "the cart button in the header") |
| `severity` | fail / warn | `HIGH | MEDIUM | LOW`, pulled from the rule's threshold table |
| `result` | always | `pass | warn | fail | unknown` |
| `observed` | Tier 1 | object with measured values (e.g. `{ count: 14 }`) |
| `expected` | Tier 1 | object with rule threshold (e.g. `{ max: 7 }`) |
| `score` | Tier 3 | integer 1-5 |
| `anchor` | Tier 3 | verbatim text from the rule's rubric table |
| `reproduceSteps` | fail / warn | ordered string array — concrete evidence-gathering steps |
| `fix` | fail / warn | literal change with code or class names |
| `effort` | fail / warn | `"hours" | "days" | "weeks"` |
| `reason` | unknown | why the rule could not produce a verdict |

## Validation rules

- Every Tier-1 finding has `observed` AND `expected`.
- Every Tier-3 finding has `score` AND `anchor`.
- Every `unknown` finding has `reason`.
- Every `fail` and `warn` finding has `reproduceSteps`, `fix`, and `effort`.
- `severity` is required on `fail` and `warn` results; omitted for `pass` and `unknown`.
- `result: "pass"` findings can be elided from the markdown rendering; keep them in the JSON for completeness.
- If `audit.selfCheck.passed === false`, set `verdict: "INCOMPLETE"` and omit `grade`.
