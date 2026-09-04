# Capability Delta

Use when simplifying a skill, responding to a model upgrade, or auditing a collection.

## Retention test

A skill supplies something the task, tools, repository, and host do not already supply. Classify each section before expanding it:

| Content | Default action | Evidence to preserve |
|---|---|---|
| Generic competence: reason carefully, write clear prose, inspect code, fix mistakes | Delete | None unless a specific regression justifies a targeted instruction |
| Host behavior: tool syntax, permissions, progress updates, memory, delegation | Delete duplication; scope necessary adapters to the host | Actual tool interface or host documentation |
| Public domain knowledge | Cut tutorial prose; retain a compact rubric when an explicit audit needs repeatable coverage | Rule applicability, detection method, false positives |
| Team taste or product policy | Keep in one authoritative location | User preference or repository convention |
| Operational contract or observed failure | Keep the minimum reproducible guidance | Command, schema, failure consequence, or regression case |
| Volatile facts: quotas, prices, SDK APIs | Resolve from current official sources when used | Source and date; no undated snapshot presented as live |

Strong model performance is a reason to revisit instructions, not proof that removing a particular contract preserves behavior. Do not infer what was in a vendor's post-training from an announcement. Label a static deletion judgement as such; reserve measured claims for actual runs.

## Keep, cut, merge, retire

Keep a skill with a distinct trigger and useful payload. Cut generic explanations inside it. Merge when the remaining payload shares an existing skill's trigger and output contract. Retire when nothing unique remains; record the replacement or native capability and remove routing pointers, README entries, and obsolete fixtures together.

A domain checklist can remain useful even when every rule is familiar: the user requested consistent coverage. Prefer applicability and detection recipes over lectures explaining the concept. Never delete a shipped application's security, accessibility, or data-integrity requirement merely because the model knows its name.

## Collection workflow

1. Pull safely and record the baseline revision, dirty paths, skill inventory, and validator result.
2. Update the creator's retention criteria first. Audit each skill's entry point, references, scripts, routing neighbors, and evaluation coverage against those criteria.
3. Keep a collection ledger with one row per skill: unique payload, concrete change or retention reason, and verification status. For large rule sets, record which categories were sampled and expand inspection when a sample fails.
4. Fill gaps with a concrete contract, tool, or regression scenario. Do not add a new skill simply to cover a topic a frontier agent already handles.
5. Validate every changed skill and the collection; check stale paths after deletions. Update descriptions and README entries to match final behavior.
6. Report static checks separately from behavior runs. If target models or a runner are unavailable, ship reviewable edits and scenarios with that limitation explicit. Do not fabricate scores or call authored assertions passing tests.

## Behavioral comparison

Use identical task inputs, repository state, tool access, and effort settings in fresh contexts for no-skill, previous-skill, and revised-skill arms. Record model identifier, host, date, loaded files, output artifact, assertion evidence, and failures. Compare task success, preference conformance, tool calls, latency, and context cost. Repeat borderline results before a destructive retirement decision.

User-named target models define the matrix. Unavailable models stay untested; a different model cannot stand in for them. Preserve contract assertions even when both arms pass, since a later edit can regress them. Revisit the retained rule when the task or host changes; no rule has permanent tenure.
