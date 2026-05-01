# Output Adapters

The same JSON document renders to three formats. Build the JSON first; then render to the format the user (or pipeline) wants.

## Table of contents

- [Adapter 1: Terminal table](#adapter-1-terminal-table)
- [Adapter 2: PR comment (GitHub / Vercel review)](#adapter-2-pr-comment-github--vercel-review)
- [Adapter 3: CI JSON](#adapter-3-ci-json)
- [Choosing the adapter](#choosing-the-adapter)
- [Common rendering rules](#common-rendering-rules)

## Adapter 1: Terminal table

For local dev, fast scan in the agent transcript or piped output. Tight, monospace-aware.

```text
═══════════════════════════════════════════════════════════
UX Audit · 8 files · diff vs main
SHIP VERDICT: ❌ NOT READY (1 release-blocker, 3 sprint, 3 backlog)
═══════════════════════════════════════════════════════════

⛔ src/checkout/PaymentStep.tsx
  L42  release-blocker  forms-lost-data-on-error
       Card number cleared on shipping-address 422 response.
       Fix: hoist form state; use useActionState with field-level errors.

⚠️  src/checkout/PaymentStep.tsx
  L88  fix-this-sprint  states-no-skeleton
       <CardElement> renders during stripe load with no fallback (CLS risk).
       Fix: <Suspense fallback={<CardSkeleton h="44px" />}>

⚠️  src/checkout/PaymentStep.tsx
  L102 fix-this-sprint  microcopy-vague-error
       Error: "Something went wrong." Replace with cause + retry path.

⚠️  src/checkout/ConfirmStep.tsx
  L34  fix-this-sprint  focus-not-restored
       Modal closes; focus returns to <body> not the trigger button.
       Fix: pass triggerRef to <Dialog onCloseAutoFocus={...}>

📋 src/checkout/CheckoutForm.tsx
  L12  backlog  dark-i18n-untested
       No dark-mode story or visual regression.

📋 src/checkout/PaymentStep.tsx
  L67  backlog  mobile-hover-only-affordance
       Help tooltip only on hover; touch users miss it.

📋 src/checkout/ConfirmStep.tsx
  L51  backlog  microcopy-generic-loading
       "Loading..." → "Confirming order — this takes 2-3 seconds"

═══════════════════════════════════════════════════════════
Defer-to:
  Performance (CWV):     Run Lighthouse on /checkout
  Bundle size:           Run next-bundle-analyzer
  WCAG violations:       Run axe-core in Storybook

Audit Self-Check:        ✓ 14 rules run · ✓ all findings cited · ✓ all fixes provided
═══════════════════════════════════════════════════════════
```

Rules:
- Group by surface (file path), severity-sorted within group (blocker → sprint → backlog).
- Use Unicode emoji for tier (`⛔ ⚠️ 📋`); fall back to ASCII (`X ! .`) when `--no-emoji`.
- Line numbers are `L42` not `:42` (easier to spot in terminals).
- Fix is one line; if longer, truncate with `→` and put the full fix in JSON.
- Always close with deferred-to and self-check footers.

## Adapter 2: PR comment (GitHub / Vercel review)

For GitHub PR review. Markdown with `suggestion` blocks for inline diffs where possible.

### Top-of-PR comment

```markdown
## 🔍 UX Audit — `feature/checkout-redesign` vs `main`

**Verdict:** ❌ NOT READY

**1 release-blocker** · 3 fix-this-sprint · 3 backlog · 0 unknown

| Surface | ⛔ | ⚠️ | 📋 |
|---|---|---|---|
| `CheckoutForm.tsx` | – | – | 1 |
| `PaymentStep.tsx` | 1 | 2 | 1 |
| `ConfirmStep.tsx` | – | 1 | 1 |

<details>
<summary>What this audit checks (and what it doesn't)</summary>

ux-audit catches feature-level UX bugs static analysis can detect from the diff:
state coverage, form data preservation, focus mgmt, optimistic rollback, microcopy.

It does **not** measure performance (run Lighthouse) or replace WCAG rules
(run axe-core / `eslint-plugin-jsx-a11y`). See [defer-to-other-tools.md](...).

</details>
```

### Inline comments (one per finding)

```markdown
**⛔ release-blocker · `forms-lost-data-on-error`**

Card number is cleared on shipping-address 422 response. The form unmounts
its state when the server returns validation errors on a different field.

```suggestion
const [state, formAction] = useActionState(updateOrder, {
  fields: { card: '', expiry: '', cvc: '' },
  errors: {},
});
```

Hoist form state so field-level errors don't reset unrelated fields.
Use [`useActionState`](https://react.dev/reference/react/useActionState)
to keep `state.fields` populated across error responses.

[Suppress this finding: add `{/* ux-audit-ignore:forms-lost-data-on-error */}` above the component.]
```

Rules:
- One inline comment per finding, anchored at the line.
- Use GitHub `suggestion` blocks where the fix is mechanical (≤5 lines).
- Link to React/Next.js docs for the API being prescribed.
- Always include the suppression hint at the bottom.
- Top-of-PR comment is summary only — no per-finding detail (avoid duplication).

## Adapter 3: CI JSON

For pipelines, dashboards, status checks. Strict JSON per `references/output-schema.md`.

```json
{
  "audit": {
    "ranAt": "2026-05-01T12:34:56Z",
    "skill": "ux-audit",
    "scope": ["src/checkout/PaymentStep.tsx", "src/checkout/CheckoutForm.tsx", "..."],
    "diffBase": "main",
    "filesAudited": 8,
    "selfCheck": { "passed": true, "failures": [] }
  },
  "verdict": "NOT_READY",
  "summary": {
    "releaseBlockers": 1,
    "fixThisSprint": 3,
    "backlog": 3,
    "unknown": 0
  },
  "deferredTo": [
    { "concern": "performance", "tool": "Lighthouse" },
    { "concern": "wcag", "tool": "axe-core" },
    { "concern": "bundle", "tool": "size-limit" }
  ],
  "findings": [
    {
      "rule": "forms-lost-data-on-error",
      "tier": "release-blocker",
      "feature": "checkout",
      "surface": "PaymentStep",
      "file": "src/checkout/PaymentStep.tsx",
      "line": 42,
      "severity": "HIGH",
      "result": "fail",
      "observed": "Card number cleared when shipping-address validation returns 422.",
      "fix": "Use useActionState; hoist field state across error responses.",
      "fixSnippet": "const [state, formAction] = useActionState(...)",
      "docsLink": "https://react.dev/reference/react/useActionState",
      "tierReason": "Surface is checkout; payment-data loss is money-flow blocker."
    }
  ]
}
```

CI usage:

```bash
# Pipeline check that exits non-zero on release-blockers
ux-audit --format json | jq -e '.summary.releaseBlockers == 0'
```

## Choosing the adapter

| Where the audit runs | Adapter |
|---|---|
| Local terminal (`npm run audit`, agent CLI) | terminal |
| Cursor / Claude Code chat | terminal |
| GitHub PR comment | PR-comment |
| Vercel preview review | PR-comment |
| CI gating (block merge on release-blocker) | JSON + jq |
| Status dashboard | JSON |

## Common rendering rules

- **JSON first.** Always render the JSON document complete, then transform to the chosen adapter.
- **Pass findings elide.** Don't render `result: "pass"` findings in terminal or PR adapters; keep them in JSON.
- **One finding = one observable bug.** Don't bundle multiple bugs under one rule. If two issues fire the same rule, that's two findings.
- **Tier-first, surface-second sort.** ⛔ first, ⚠️ next, 📋 last; within tier, group by surface.
