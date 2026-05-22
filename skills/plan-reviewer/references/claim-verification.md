# Claim Verification

Verify claims and assumptions with local evidence instead of accepting them at face value. Load during plan review when a claim can be checked locally, or when the user explicitly asks to verify a specific claim.

## When to use

- During plan review (Step 3) when the user makes a specific, verifiable claim
- Standalone when the user says "verify this", "is this true", "prove it", "check this claim"
- Before relying on an assumption that drives a critical implementation decision
- When a plan asserts something about the codebase, performance, or behavior that can be measured

## Workflow

### 1. Restate as falsifiable hypothesis

Convert the claim into a testable statement with a clear condition, metric, and threshold.

| Claim | Falsifiable hypothesis |
|-------|----------------------|
| "This function is small" | `getUser` in `src/user.ts` is under 50 lines |
| "The API is fast" | `GET /api/users` responds in under 200ms locally |
| "We have good test coverage" | `src/auth/` directory has co-located test files for >80% of modules |
| "Nobody uses this" | `legacyHelper` has zero call sites outside its own test file |
| "This is thread-safe" | Concurrent writes to `cache.ts` don't produce data races under `--race` |

If the claim cannot be restated falsifiably (too vague, philosophical, or unfalsifiable), say so and skip verification.

### 2. Identify the minimal evidence surface

Choose the smallest, most direct source of evidence:

| Evidence type | Tools | When to use |
|--------------|-------|-------------|
| Code existence | `grep -r`, `find`, file reading | "Does X exist?", "Is Y used?" |
| Code metrics | `wc -l`, `tokei`, line counting | "How big is X?", "How many files?" |
| History | `git log`, `git blame`, `git shortlog` | "When was X added?", "Who wrote Y?" |
| Test output | `npm test`, `pytest`, `cargo test` | "Does X pass?", "Is Y covered?" |
| Runtime behavior | `curl`, `time`, script execution | "How fast is X?", "What does Y return?" |
| Static analysis | `tsc --noEmit`, `eslint`, `oxlint` | "Does X compile?", "Are there warnings?" |

### 3. Capture baseline artifact

Run the evidence-gathering command and save the raw output. For comparisons (before/after), capture the baseline first.

Include the exact command run and its full output — do not paraphrase.

### 4. Capture treatment artifact (if comparing)

For claims about changes ("this is faster", "this reduces complexity"), capture the treatment state using the same command on the same machine.

### 5. Compare and verdict

Compare the artifacts directly. Return one of three outcomes:

**VERIFIED** — evidence supports the claim within the stated threshold.
```
Claim: "getUser is under 50 lines"
Evidence: wc -l src/user.ts → getUser function spans lines 12-38 (26 lines)
Verdict: VERIFIED — 26 lines, well under 50
```

**NOT VERIFIED** — evidence contradicts the claim.
```
Claim: "Nobody uses legacyHelper"
Evidence: grep -r "legacyHelper" src/ → 4 call sites in 3 files
Verdict: NOT VERIFIED — 4 active call sites found
```

**INCONCLUSIVE** — insufficient evidence or mixed signals.
```
Claim: "The API responds in under 200ms"
Evidence: 5 curl requests → 180ms, 210ms, 190ms, 350ms, 185ms
Verdict: INCONCLUSIVE — 3/5 under 200ms, but p95 is 350ms. Depends on the threshold definition.
```

## Output format

```markdown
**Claim:** <original claim>
**Hypothesis:** <falsifiable restatement>
**Evidence:** <command run and raw output>
**Verdict:** VERIFIED | NOT VERIFIED | INCONCLUSIVE
**Confidence:** High | Medium | Low
**Note:** <one line of context if needed>
```

## Integration with plan review

During Step 3 dialogue, when the user responds to a question with a verifiable claim:

1. Recognize the claim is checkable ("this is under 100 lines", "we already handle that case", "the test covers this")
2. Pause the dialogue
3. Run the verification workflow
4. Report the verdict
5. Use the verdict to inform whether to ACCEPT, PUSH DEEPER, or REFRAME

Do not verify every claim — only those that are load-bearing for a plan decision or that seem surprising.
