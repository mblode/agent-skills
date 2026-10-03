# Module audit, 2026-10-03

Baseline: `51e9ae4`. Lens: the codebase-design vocabulary (module, interface, depth, seam, adapter, deletion test), with every skill, reference and section treated as a module, plus the capability-delta retention test. The audit was three read-only auditors, then eight editors with disjoint folders, then one adversarial reviewer. Proven contracts from a private product repo (verify harness, proof file, unattended fix jobs, drift gate, repo evals, vendor ports with fakes, decision-record door types) were generalised into app-verification, agents-md and codebase-architecture.

This is a static deletion judgement. No with-skill or without-skill run was executed, and no routing eval was rerun after the description edits. Authored scenarios remain unexecuted.

## Results

- No skill was retired. typography-audit failed the deletion test (78 tutorial rules with no detection recipes), but the user chose to keep it; only its three contradictions with ui-design were fixed.
- Tracked diff: about 2,430 lines removed, 1,000 added, plus four new files (`codebase-architecture/references/vocabulary.md`, `agents-md/references/repo-evals.md`, `ui-design/guidelines/components.md`, `maintenance/sources/`).
- Description listing: 10,638 to 7,932 characters (text count, not tokens).
- `validate.sh --all`: 0 FAIL on all 28 skills. `maintenance/tests`: OK.
- New collection rules (the Module lens in `agent-skills-creator/references/improving-existing-skills.md`):
  - a deletion test per skill, reference and section;
  - a gotcha stays in SKILL.md only if it fires before its reference loads;
  - never-load files go outside `references/`;
  - each fact has one owner;
  - descriptions carry triggers, not IS-NOT routing.
- Contradictions resolved:
  - the CLAUDE.md symlink advice (codebase-architecture vs agents-md);
  - the meaning of `verify` (tiers renamed to `check:commit` and `check:full`);
  - the enforcement order, now owned by enforcement-ladder;
  - the hover transition (ui-design vs ui-animation);
  - the `vw` type example;
  - typography body size and uppercase tracking.

## Per-skill ledger

| Skill | Verdict | Lines (approx) | Validator |
|---|---|---|---|
| [agent-ready](../skills/agent-ready/SKILL.md) | keep; trimmed description, duplicated gotchas, Related list and Sources | -21 / +3 | 0 FAIL |
| [agent-skills-creator](../skills/agent-skills-creator/SKILL.md) | keep; cut duplicated mechanics, merged authoring-tips sections, added Module Lens | -82 / +28 | 0 FAIL (2 SKIP) |
| [agents-md](../skills/agents-md/SKILL.md) | keep; deduplicated @import guidance, merged skeletons, added a drift gate and repo evals | -75 / +95 | 0 FAIL |
| [app-verification](../skills/app-verification/SKILL.md) | keep; deepened references with the harness contracts, deduped repeated ideas so each has one owner, and moved the credit to a footer | -75 / +150 | 0 FAIL |
| [autoship](../skills/autoship/SKILL.md) | Failure Recovery table becomes a pointer; 'never changeset version locally' now stated once | -14 / +5 | 0 FAIL |
| [ax-audit](../skills/ax-audit/SKILL.md) | keep; merged 5 rules into 2 (27 -> 24), retired 2 references, cut ship-readiness trigger lists, moved scenarios to evals/ | -501 / +123 | 0 FAIL (1 SKIP) |
| [chat-history](../skills/chat-history/SKILL.md) | keep; retired hosts.md | -33 / +3 | 0 FAIL |
| [ci-speedup](../skills/ci-speedup/SKILL.md) | cut gotchas L74/78-79/81 | -6 / +1 | 0 FAIL |
| [codebase-architecture](../skills/codebase-architecture/SKILL.md) | keep; cut duplicated sections, added shared vocabulary reference and unattended-fix-job contracts | -150 / +95 | 0 FAIL |
| [dx-audit](../skills/dx-audit/SKILL.md) | keep; folded two duplicate gotchas into Step 4, moved scenarios to evals/ | -6 / +3 | 0 FAIL (1 SKIP) |
| [eli5](../skills/eli5/SKILL.md) | keep; vocabulary list replaced by pointer | -3 / +2 | 0 FAIL |
| [ghostwriter](../skills/ghostwriter/SKILL.md) | keep; tells.md made canonical, description trimmed | -12 / +10 | 0 FAIL |
| [multi-tenant-architecture](../skills/multi-tenant-architecture/SKILL.md) | keep; cut duplicate checklist and reference-duplicating gotchas, limits file reduced to names plus sources | -75 / +20 | 0 FAIL |
| [planning](../skills/planning/SKILL.md) | merged refs | -330 / +75 | 0 FAIL |
| [pr-babysitter](../skills/pr-babysitter/SKILL.md) | cut sections: manual-fetch path removed, SKILL tables become pointers | -245 / +12 | 0 FAIL |
| [pr-creator](../skills/pr-creator/SKILL.md) | trimmed | -4 / +2 | 0 FAIL |
| [presentation-creator](../skills/presentation-creator/SKILL.md) | cut Core principles; trimmed speaker-notes and the pitch frame | -45 / +4 | 0 FAIL |
| [product-design](../skills/product-design/SKILL.md) | keep; deleted lint-patterns, slimmed a11y rules, cut the self-check | -95 / +15 | 0 FAIL |
| [scaffold-cli](../skills/scaffold-cli/SKILL.md) | cut L115-118; fixed a contradiction in the reference | -6 / +4 | 0 FAIL |
| [scaffold-nextjs](../skills/scaffold-nextjs/SKILL.md) | cut 23 restated gotchas; Cache Components rules moved into the generated apps/web AGENTS.md template | -75 / +45 | 0 FAIL |
| [seo](../skills/seo/SKILL.md) | keep; three micro-references merged into audit.md | -46 / +38 | 0 FAIL |
| [test-audit](../skills/test-audit/SKILL.md) | keep; Sources moved | -4 / +17 | 0 FAIL |
| [tidy](../skills/tidy/SKILL.md) | trimmed refs | -28 / +12 | 0 FAIL |
| [typography-audit](../skills/typography-audit/SKILL.md) | left alone except the three contradiction fixes; the description count is correct (78 rules) and unchanged | -8 / +8 | 0 FAIL |
| [ui-animation](../skills/ui-animation/SKILL.md) | keep; merged overlapping references, cut live-tuning, fixed the #9 contradiction | -225 / +100 | 0 FAIL |
| [ui-design](../skills/ui-design/SKILL.md) | keep; wired unreachable rules, cut tool-owned rules, merged small guidelines, moved never-load content | -255 / +175 | 0 FAIL |
| [ui-verification](../skills/ui-verification/SKILL.md) | keep; coverage mappings updated for deleted and renamed ui-design rules | -10 / +7 | 0 FAIL |

save-md and typography-audit (apart from its three contradiction fixes) were not changed.

## Deferred

- Permission-allowlist guidance ('allowlist by command shape, not prefix breadth') was dropped from agent-runtime as generic. If a reviewer counts it as safety floor, restore it as one line.
- Seeded randomness and the frozen-clock helper (from the verification-tiers parallelism section that was cut) were not moved anywhere. They probably belong to test-audit, which I don't own.
- Kept the sign-in backdoor as a one-line SKILL.md gotcha that points at worktree-isolation.md, even though rule 2 would move it entirely to the reference. It is security floor content, and Maintain mode can add a shortcut without loading that reference.
- Kept the verify --ci flag in create-mode. It overlaps with the new rule that verify always exits non-zero on a failure or an uncovered file, but cutting it may change behaviour for repos that gate only in CI.
- Description is 231 chars, not about 200. Getting closer would mean dropping one of the three trigger phrases.
- agents-md root-content-guidance 'Emphasis for critical rules' overlaps SKILL Step 5 item 6 and the emphasis gotcha. Not in the plan; kept
- agents-md quick-checklist item 10 and quality-criteria items 26/39 still mention @import. They are scoring criteria, not restated mechanics; kept
- chat-history references/verification.md is maintenance-only (read when changing the skill) yet sits in references/. Under collection rule 3 it could move to evals/ or maintenance/, but the plan did not ask; kept
- agent-ready Priority section keeps the dated Mintlify 2026 benchmark figures. They drive the ordering, and their source link is now in maintenance/sources/agent-ready.md
- maintenance/retired-names.tsv NOT updated with the retired ax-audit rule IDs: validate.sh's no-retired-names check is for skill names (message 'names a retired skill'), so adding rule IDs would misreport; stale rule IDs were grepped by hand instead (none remain in skills/)
- dx-audit 'cut L261/263': those line numbers do not exist; I made the closest dedupe (two Gotchas folded into Step 4) rather than guess further
- ax-audit ship-readiness.md still carries a TOC though it is now 58 lines; left as harmless
- Unit tests (maintenance/tests) pass unchanged; no validator change was needed
- tidy security Always Do: kept boundary validation, security headers and cookie attributes as checklist items (floor content not named by the OWASP table or sweep) rather than cutting Always Do to zero
- eli5: the vocabulary fallback is now a pure pointer to ghostwriter/references/tells.md; if eli5 is installed without ghostwriter it loses the word list (default install is all skills, so accepted)
- tidy structural-quality-rubric adapter line cites codebase-architecture's vocabulary by name, not by file path, since references/vocabulary.md is being created by group 1 in parallel
- ui-design direction/cro.md still has undated vendor conversion stats (34%, 223% ROI, 363% lift, benchmark tables). The plan scoped the stat cut to testing.md and modern.md, so I only fixed cro.md's dangling 'CTA statistics' pointer. Once those stats go, the deleted SKILL gotcha ('do not quote conversion stats as promises') loses its last target
- ui-animation internal tension left in place: the Core rule (hover highlights enter at 0ms) and the easing table (hover color 200ms) were reconciled only by scoping the table row to 'one control'. Whether list-sweep hover should be instant is now stated in ui-design general.md, not restructured in ui-animation
- ui-design guidelines/copywriting.md: the pointer to product-design's copy rule IDs drops the worked examples ('Delete member', 'Build failed...'). A Build-mode agent does not load product-design's rules.md, so verb-plus-noun guidance now depends on the rule IDs being self-describing. Kept the house-only formatting bullets
- Did not touch typography-audit beyond the three contradiction fixes, per the user's instruction. That includes not adding a pointer to ui-design's new severity mapping in its SKILL.md
- No group-7 skill had Sources/Rejected sections or evaluation-scenarios.md files under references/, so nothing needed moving to evals/ or maintenance/sources/.
- pr-babysitter: kept the Gotchas 'Cron when Monitor is available' and 'subscription-only watch never sees conflicts'. They partly overlap monitoring-setup.md, but they warn before a mechanism is picked, so cutting them risks a behaviour change.
- ci-speedup: kept the gotcha on task-runner oversubscription (L77), although levers.md 'Contention inside one job' holds a similar fact. The plan did not list it, and its 0:47 to 3:04 numbers are unique.
- Description routing removal (collection rule 5) was applied to all 7 skills. Each body already carries the IS NOT routing, but no should-trigger or near-miss routing eval was run to confirm triggering is unchanged.
- multi-tenant-architecture: did not move the 'Sources' sections out of cloudflare-platform.md, vercel-platform.md, vercel-domains.md, data-isolation.md and psl.md into maintenance/sources/ (collection rule 3). Those references still hold numbers whose only date is the 'Accessed 2026-09-01' line, so moving them would leave those values undated. They need the same names-plus-source treatment first; plan section 8 does not list this work
- Did not trim the IS-NOT routing from either description (collection rule 5). seo's description is the only place that names Mintlify Agent Score -> agent-ready, and both skills have near_miss routing evals that rely on that wording. A description change should be re-run against the routing evals
- Did not move seo/references/sources.md out of references/. It loads at task time ('a claim depends on current engine behavior'), and audit.md cites it from the hreflang and spam-policy sections
