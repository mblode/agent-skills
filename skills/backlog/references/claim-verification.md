# Claim Verification

Verify claims with local evidence, not at face value: a plan's claim about the code, a user's claim during an interview, or an agent's claim that a ticket is done.

## Contents

- When to use
- Workflow (hypothesis, evidence surface, artifacts, verdict)
- Verifying against documentation
- Output format
- Worked example: the Verify move in a review
- Agent completion claims

## When to use

- A plan or ticket asserts something checkable about the codebase, performance, or behavior
- During an interview, the user responds with a specific, verifiable claim
- An agent reports a ticket done, tests passing, or a bug fixed, before the ledger moves the row
- Standalone: the user says "verify this", "is this true", "prove it", "check this claim"
- Before relying on an assumption that drives a critical decision

## Workflow

### 1. Restate as falsifiable hypothesis

Convert the claim into a testable statement: condition, metric, threshold.

| Claim | Falsifiable hypothesis |
|-------|----------------------|
| "This function is small" | `getUser` in `src/user.ts` is under 50 lines |
| "The API is fast" | `GET /api/users` responds in under 200ms locally |
| "We have good test coverage" | `src/auth/` directory has co-located test files for >80% of modules |
| "Nobody uses this" | `legacyHelper` has zero call sites outside its own test file |
| "This is thread-safe" | Concurrent writes to `cache.ts` don't produce data races under `--race` |

If it can't be restated falsifiably (too vague or unfalsifiable), say so and skip verification.

### 2. Identify the minimal evidence surface

Choose the smallest, most direct source:

| Evidence type | Tools | When to use |
|--------------|-------|-------------|
| Code existence | `grep -r`, `find`, file reading | "Does X exist?", "Is Y used?" |
| Code metrics | `wc -l`, `tokei`, line counting | "How big is X?", "How many files?" |
| History | `git log`, `git blame`, `git shortlog` | "When was X added?", "Who wrote Y?" |
| Test output | `npm test`, `pytest`, `cargo test` | "Does X pass?", "Is Y covered?" |
| Runtime behavior | `curl`, `time`, script execution | "How fast is X?", "What does Y return?" |
| Static analysis | `tsc --noEmit`, `eslint`, `oxlint` | "Does X compile?", "Are there warnings?" |

### 3. Capture baseline artifact

Run the command and save raw output verbatim (exact command plus full output, no paraphrase). For before/after comparisons, capture the baseline first.

### 4. Capture treatment artifact (if comparing)

For change claims ("this is faster", "this reduces complexity"), capture the treatment state with the same command on the same machine.

### 5. Compare and verdict

Compare the artifacts. Three outcomes:

**VERIFIED**: evidence supports the claim within threshold.
```
Claim: "getUser is under 50 lines"
Evidence: wc -l src/user.ts → getUser function spans lines 12-38 (26 lines)
Verdict: VERIFIED, 26 lines, well under 50
```

**NOT VERIFIED**: evidence contradicts the claim.
```
Claim: "Nobody uses legacyHelper"
Evidence: grep -r "legacyHelper" src/ → 4 call sites in 3 files
Verdict: NOT VERIFIED, 4 active call sites found
```

**INCONCLUSIVE**: insufficient evidence or mixed signals.
```
Claim: "The API responds in under 200ms"
Evidence: 5 curl requests → 180ms, 210ms, 190ms, 350ms, 185ms
Verdict: INCONCLUSIVE, 3/5 under 200ms but p95 is 350ms. Depends on the threshold definition.
```

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

## Agent completion claims

An agent's "done" is a claim like any other, and the ledger moves on evidence. Name which of four things the evidence shows, because each can be green while the next is red:

| Claim level | Evidence | Known false green |
|-------------|----------|-------------------|
| Cached check | Task runner reports a cache hit | A cached `turbo run test` was green while a fresh `--force` run failed on an env singleton evaluated at import |
| Fresh tests | The suite ran now, uncached, from a clean install | A test that cannot fail, a skipped suite, a test-only branch in production code |
| Build | The artifact the deploy uses was built (including the container) | A PR build that never built the container |
| Runtime startup | The service started and answered a real request | Dev startup failing on module resolution that no test imports |

Record the level in the ledger's `last evidence`. `in_review` needs fresh tests at minimum; a claim resting only on a cached check is INCONCLUSIVE.

During an interview, when the user responds with a verifiable claim, pause, verify, report the verdict with the raw evidence, and let it choose the next move. Verify only claims that are load-bearing for a decision or that seem surprising.
