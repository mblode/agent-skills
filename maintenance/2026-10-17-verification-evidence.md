# Verification evidence adaptation

Source: user-supplied verify-skills.tgz, inspected 2026-10-17. Baseline: 872bc83. Archive SHA-256: `7ea360edf4618be5751a88eef3a2b9d220569a5c64dfb98bc8f1b898b07fb3a4`.

| Owner | Concrete gap and change | Status |
|---|---|---|
| ui-verification | Add direct image review and duplicate-state investigation without owning persistent baselines | Two defect fixtures plus an intentional-duplicate boundary scenario authored |
| app-verification | Preserve API request assertions across environments; enforce per-scenario coverage and checked cleanup; describe shared capture envelopes | Cleanup evidence fixture and API/adapter scenarios authored |

Kept the existing owners and nine-probe catalogue. Did not vendor scripts, add competing skills, require Bruno, copy company-specific auth/build policy, or grant production execution. No installer behavior changed. Source attribution and rejection reasons travel in the new references.

Baseline validators: both skills passed. Behavioral baseline, revised-skill, no-skill, routing and model-tier comparisons remain unrun; the authored cases are specifications, not evidence of improvement. Neither agent-evals nor skills-ref is available on PATH. No claim of visual defect detection rate is made. Installed copies are unchanged.

The validator requires assertions on authored scenarios; these are provisional contract assertions derived from the supplied failure cases, not observations from executed model runs.

Final validation: the full collection passed `validate.sh --all`; `git diff --check` passed and all evaluation fixture paths resolved. Independent skills-ref validation was unavailable. Installation behavior was unchanged, so no installation smoke test was required.
