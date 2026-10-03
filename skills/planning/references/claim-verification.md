# Claim Verification

Verify claims with local evidence, not at face value. Load during plan review when a claim is locally checkable, or when the user asks to verify one.

## Contents

- When to use
- Workflow (hypothesis, evidence surface, artifact, verdict)
- Verifying against documentation
- Output format
- Worked example: the Verify move in a review
- Integration with plan review

## When to use

- Review: the plan asserts something checkable about the codebase, performance, or behavior
- Interview: the user responds with a specific, verifiable claim
- Standalone: the user says "verify this", "is this true", "prove it", "check this claim"
- Before relying on an assumption that drives a critical decision

## Workflow

1. **Restate as a falsifiable hypothesis:** condition, metric, threshold. "Nobody uses this" becomes "`legacyHelper` has zero call sites outside its own test file". If the claim cannot be restated that way, say so and skip it.
2. **Pick the smallest direct evidence surface:** search for existence and call sites, line counts for size, `git log`/`git blame` for history, the test runner for behavior, a timed request or script for runtime, the type checker or linter for static claims.
3. **Capture the artifact verbatim:** exact command plus raw output, no paraphrase. For a change claim ("this is faster"), capture the baseline first, then the treatment with the same command on the same machine.
4. **Verdict:** VERIFIED (evidence supports it within threshold), NOT VERIFIED (evidence contradicts it), or INCONCLUSIVE (insufficient or mixed evidence, for example 3 of 5 requests under 200ms with a 350ms outlier; say which threshold definition decides it).

## Verifying against documentation

Some claims concern a *documented decision*, not code or runtime behavior ("the RFC says writes are idempotent", "the library supports retries natively", "the ADR rejected this approach"). Verify against the authoritative doc, not just the code.

1. **Find the authoritative source.** Closest-to-code first: ADRs/decision records, then design docs/RFCs, then official library/API docs. The user's named spec is the source of truth when one exists.
2. **Quote the relevant line.** Copy the exact sentence plus its location (file/path or doc name + section); do not paraphrase the decision.
3. **Check the doc against reality.** Docs drift. If the code contradicts the doc, that itself is the finding: report which is authoritative for this plan.
4. **Verdict.** Same three outcomes, with the citation:

```
Claim: "The payments RFC says webhook handling is idempotent"
Evidence: docs/rfc/payments.md §4: "handlers MUST dedupe on event_id before side effects"
         but src/webhooks/stripe.ts has no dedupe check on event_id
Verdict: NOT VERIFIED, RFC requires idempotency; current code does not implement it
```

If no authoritative doc exists, say so and fall back to code/runtime evidence. Never treat an undocumented assumption as verified.

## Output format

```markdown
**Claim:** <original claim>
**Hypothesis:** <falsifiable restatement>
**Evidence:** <command run and raw output>
**Verdict:** VERIFIED | NOT VERIFIED | INCONCLUSIVE
**Confidence:** High | Medium | Low
**Note:** <one line of context if needed>
```

## Worked example: the Verify move in a review

The plan claims something checkable; verify before asking, show the raw evidence, then let the verdict pick the next move.

**Plan excerpt:**
```
## Cleanup
Delete the `legacyExport` module. Nothing calls it anymore.
```

**Verify (no question yet):** "The plan claims nothing calls `legacyExport`. That's checkable, so verifying before asking."

```
Claim: "Nothing calls legacyExport anymore"
Evidence: grep -rn "legacyExport" src/ -> 2 call sites:
         src/reports/quarterly.ts:88
         src/admin/export.ts:14
Verdict: NOT VERIFIED: 2 active call sites outside the module
```

"NOT VERIFIED: `legacyExport` has two live call sites, `src/reports/quarterly.ts:88` and `src/admin/export.ts:14`. The deletion step needs a migration for those callers or the claim corrected. Which is it?"

**User:** "quarterly.ts is behind a feature flag we killed last month, so that path is dead. admin/export is real though. I'll add a step to move admin export onto the new exporter before the deletion."

**Accept and record:** "Recorded: migrate `src/admin/export.ts` to the new exporter before deleting `legacyExport`; the dead-flag path in quarterly.ts deletes with the module. Writing the migration step into Cleanup."

Tone throughout: reference the specific section and claim, no preamble praise, follow-ups sharper than first questions, acceptance brief and written into the file before moving on.

## Integration with plan review

In review, verify the plan's load-bearing checkable claims before asking anything; a NOT VERIFIED claim becomes the first question.

In an interview, when the user responds with a verifiable claim:

1. Recognize it is checkable ("this is under 100 lines", "we already handle that case", "the test covers this")
2. Pause the interview
3. Run the verification workflow
4. Report the verdict with the raw evidence
5. Use the verdict to choose the next move: ACCEPT, PUSH DEEPER, or REFRAME

Do not verify every claim, only those load-bearing for a plan decision or that seem surprising.
