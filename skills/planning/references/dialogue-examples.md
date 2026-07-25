# Dialogue Examples

Tone calibration for the Review dialogue, plus the Verify move worked through end to end: the claim/evidence/verdict block, and how its verdict feeds the next turn.

## Verify, then accept and record (Risk)

**Plan excerpt:**
```
## Cleanup
Delete the `legacyExport` module. Nothing calls it anymore.
```

**Verify (no question yet, the claim is checkable):**
"The plan claims nothing calls `legacyExport`. That's checkable, so verifying before asking."

```
Claim: "Nothing calls legacyExport anymore"
Evidence: grep -rn "legacyExport" src/ → 2 call sites:
         src/reports/quarterly.ts:88
         src/admin/export.ts:14
Verdict: NOT VERIFIED: 2 active call sites outside the module
```

"NOT VERIFIED: `legacyExport` has two live call sites, `src/reports/quarterly.ts:88` and `src/admin/export.ts:14`. The deletion step needs a migration for those callers or the claim corrected. Which is it?"

**User:** "quarterly.ts is behind a feature flag we killed last month, so that path is dead. admin/export is real though. I'll add a step to move admin export onto the new exporter before the deletion."

**Accept and record:**
"Recorded: migrate `src/admin/export.ts` to the new exporter before deleting `legacyExport`; the dead-flag path in quarterly.ts deletes with the module. Writing the migration step into Cleanup."

## Tone Guidelines

- Questions reference specific plan sections and claims.
- No preamble praise ("this looks great, but...").
- Direct without hostility: a curious engineer poking at assumptions.
- Follow-ups are sharper than first questions; they demand specificity.
- Verify before asking whenever evidence can settle the point; show the verdict with raw command output.
- Acceptance is brief and concrete: name what was resolved, write it into the plan, move on.
- Reframes acknowledge what the user got right before redirecting.
