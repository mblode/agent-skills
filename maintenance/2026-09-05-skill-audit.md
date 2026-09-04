# Skill collection audit, 2026-09-05

Baseline: `ac9df85`, pulled with `git pull --ff-only` from a clean checkout. The pull added upstream browser-verification work. All 27 skills remain because each retains a distinct operational contract, house preference, or repeatable audit rubric. This is a static retention decision, not a measured claim that these skills improve every model.

## Changes

Updated the creator first, then all 27 entry points. Entry-point text fell from 4,625 to 3,901 lines. Normalized description text fell from 24,230 to 8,250 characters (66% reduction). These are text counts, not tokenizer measurements. Removed generic prose references from ELI5 and cut forced interviews, generic coding coaching, fixed delegation, repeated self-checks, and universal host assumptions.

Every skill now has `evals/evals.json`: 68 authored behavior scenarios in total. Existing richer evaluation fixtures remain in place. New scenario prompts supply decisive conditions; an execution runner must provision the indicated disposable repository or app state. No target-model run is claimed from writing these files.

## Per-skill disposition

All rows: retain the listed payload, update as described. Scenario structure is validated; cross-model behavior is unrun.

| Skill | Retained value | Change |
|---|---|---|
| [agent-skills-creator](../skills/agent-skills-creator/SKILL.md) | Retention criteria, validator, and evaluation workflow | Added capability-delta decisions and collection ledger; removed unsupported universal model claims; validate scenario structure |
| [agents-md](../skills/agents-md/SKILL.md) | Cross-agent instruction wiring and manifest-backed commands | Removed a redundant approval gate for requested edits; added command/pointer scenarios |
| [autoship](../skills/autoship/SKILL.md) | CI-owned changesets version and publish sequence | Reuse pending coverage; preserve pre-existing edits during fixer cleanup |
| [ax-audit](../skills/ax-audit/SKILL.md) | Agent execution and trust contracts with two rule layers | Use the actual PR base; distinguish user-facing rationale from private reasoning panels |
| [codebase-architecture](../skills/codebase-architecture/SKILL.md) | Module boundaries and gates proven to fail | Removed a stale tool-maintenance assertion; added gate and existing-contract scenarios |
| [copywriting](../skills/copywriting/SKILL.md) | House vocabulary, brand voice, and state-copy contracts | Removed fixed alternative/finding counts and mandatory seven-pass edits |
| [docs-writing](../skills/docs-writing/SKILL.md) | Repeatable Diataxis-aware audit rubric | Classify by reader task rather than assuming every README is a tutorial |
| [dx-audit](../skills/dx-audit/SKILL.md) | Local package/CLI probes and contract-specific rules | Packing is not inherently read-only; account for lifecycle side effects |
| [eli5](../skills/eli5/SKILL.md) | House vocabulary and preservation of exact technical terms | Replaced the long template with a compact style; deleted two generic prose references |
| [multi-tenant-architecture](../skills/multi-tenant-architecture/SKILL.md) | Isolation, domain lifecycle, and routing contracts | Corrected RLS owner exception; require collision-free keys; removed undated quota claims |
| [optimise-seo](../skills/optimise-seo/SKILL.md) | Next.js implementation pitfalls and served-page checks | Preserve DNS verification; use owned free ports; allow consistent multiple JSON-LD blocks |
| [planning](../skills/planning/SKILL.md) | Self-contained handoffs and vertical-slice verification | Removed forced interview, minimum questions, redundant approval, and perfect-score loop |
| [pr-babysitter](../skills/pr-babysitter/SKILL.md) | Paginated thread accounting and PR state monitoring | Made script paths portable; scoped communication; repaired unsafe artifact/index cleanup |
| [pr-creator](../skills/pr-creator/SKILL.md) | House PR presentation, issue linking, and templates | Use actual PR base and body files; metadata-only edits do not push commits |
| [pr-reviewer](../skills/pr-reviewer/SKILL.md) | Severity, context-error, and structural rubrics | Allow reviews of failing branches; reuse current checks and preserve command exit status |
| [presentation-creator](../skills/presentation-creator/SKILL.md) | House visual system and live/async deck distinction | Render actual outputs; distinguish editorial scores from measured evidence; broaden PPTX adapter |
| [product-design](../skills/product-design/SKILL.md) | Action semantics, reversibility, and state contracts | Compressed duplicate routing theory and replaced self-check ceremony with decision evidence |
| [readme-creator](../skills/readme-creator/SKILL.md) | Consumer-first house README structure | Allow hosted-only products; remove substring false positives and score-as-render-proof |
| [save-md](../skills/save-md/SKILL.md) | Faithful source artifact and direct export endpoints | Removed blanket shell-writing prohibition and universal compaction claim |
| [scaffold-cli](../skills/scaffold-cli/SKILL.md) | House toolchain and packaging/publish bootstrap contracts | Adapt proven incompatible templates; honor local-only and already-authorized scope |
| [scaffold-nextjs](../skills/scaffold-nextjs/SKILL.md) | Blode UI workspace/tooling templates | Use version-matched flags and free owned ports |
| [seo-program](../skills/seo-program/SKILL.md) | Metric provenance, Exact match, and brief contract | Removed compulsory query modifiers; host-neutral scheduling; clarified durable briefs and quiet monitoring |
| [tidy](../skills/tidy/SKILL.md) | Guard-deletion evidence and ownership-focused simplification | Removed fixed five-agent/five-pass workflow and generic coding tutorial; preserve user edits |
| [typography-audit](../skills/typography-audit/SKILL.md) | Repeatable font, OpenType, spacing, and punctuation rubric | Include committed PR changes; require rendered font evidence when relevant |
| [ui-animation](../skills/ui-animation/SKILL.md) | Motion defaults, recipes, and measured curve fitting | Removed blanket keyboard-motion ban and next-day review; added reduced motion and portable script paths |
| [ui-design](../skills/ui-design/SKILL.md) | House visual defaults, mode routing, and defect rubric | Removed full extraction for small edits, mandatory fresh-eyes agents, and rejection quotas |
| [ui-verification](../skills/ui-verification/SKILL.md) | Reproducible browser probes and evidence schema | Fixed hit-target execution and false positives; qualified non-reproduction; removed ritual reruns and unsafe port cleanup |

## Verification and coverage

- Read every skill entry point and inspected linked references relevant to the changes. Surveyed the reference inventory, searched cross-file contradictions, and sampled rule requirements across every category. The retained audit rule corpora were not rewritten wholesale. This is not a line-by-line recertification of every external API example.
- Ran the repository validator before edits. Ran the updated validator for all 27 skills, including JSON scenario structure. Authored scenarios are explicitly reported as authored, not executed.
- Exercised the new validator with a valid fixture, malformed JSON, duplicate case IDs, and empty assertions. The valid case passed; each invalid case failed with nonzero exit status.
- Executed the revised hit-target recipe unchanged in headless Chrome through Playwright against a disposable page. Six assertions passed: small control fails, expanded pseudo-element passes, exact 44px control passes, list button is not a prose exception, inline link is recognized, and offscreen control is excluded. The first run exposed mobile layout-viewport expansion; switching the viewport filter to document client bounds fixed it.
- Executed the layout-shift recipe unchanged in headless Chrome against a disposable local server. Request interception held the skeleton, then released it: the measured container changed from 30px to 90px and one shift entry was captured.
- Shell syntax and `git diff --check` are checked. Installation behavior was not changed; no global install, release, commit, or push was performed.

The Opus 5, Astra, and Grok 4.6 no-skill/old-skill/new-skill matrix remains unrun. This session is not an isolated behavioral evaluation. No quality score or post-training coverage claim is inferred from a vendor announcement. Future comparisons should record exact model, host, effort, fixture revision, loaded context, artifact, assertion evidence, tool calls, and elapsed time.

## Sources and interpretation

The [Astra announcement](https://openai.com/index/gpt-6-astra/) motivates revisiting generic coaching as model capability improves. It does not establish that a particular skill can be removed without regression, nor describe the training contents of the other target models.

Technical corrections were checked against [PostgreSQL row security](https://www.postgresql.org/docs/17/ddl-rowsecurity.html), [Tailwind hover behavior](https://tailwindcss.com/docs/hover-focus-and-other-states), and [npm lifecycle scripts](https://docs.npmjs.com/misc/scripts/). Repository preferences remain preferences; their strength of wording alone is not a reason to delete them.

## Specification follow-up

Checked the collection against the current [Agent Skills specification](https://agentskills.io/specification) and [creator best practices](https://agentskills.io/skill-creation/best-practices).

- All 27 skills passed the official `skills-ref` validator from `agentskills/agentskills` revision `69ef37e9424c0a7ea9dd2293b559e43ec8176379`, installed in a disposable checkout.
- Corrected the local validator's classification: body structure, reference naming, README counts, and house trigger phrasing are local conventions, not normative format restrictions. `allowed-tools` is a portable experimental field.
- Added validation for frontmatter mappings, field types, compatibility limits, metadata string maps, and unsupported top-level fields. Nine temporary boundary fixtures passed, including rejection cases.
- Replaced unsupported universal host claims in the creator references. Added compatibility prerequisites to seven skills whose execution depends on particular runtimes or tools.
- Corrected the creator's validation command paths and installation smoke-test guidance so it tests edited local source in a disposable target.

These metadata checks do not execute the 68 behavioral scenarios or prove compatibility with every host. The entry-point text counts earlier in this report describe the first simplification pass, before this follow-up.

Progressive disclosure check: moved SEO indexing/validation detail and animation discovery steps into directly indexed references. All 27 entry-point bodies are below 5,000 tokens using `cl100k_base`; this is a named tokenizer measurement, not a guarantee for every model tokenizer.
