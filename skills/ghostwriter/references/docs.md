# Docs

Read when writing, rewriting, or auditing technical documentation.

## Classify first

Diataxis compass: does the page serve action or understanding, and is the reader learning or working? Tutorial (a lesson, "we" voice, reliable result), how-to (a task for a competent reader), explanation ("About X"), reference (neutral, mirrors the product). One type per file; split a mixed page. Classify by the reader's task, not the filename.

Type-gated checks: a quick start (the fewest steps that produce visible output) only on getting-started pages and READMEs; next steps (what the reader most likely needs next) only on tutorials and how-tos; the same operation in the 2-3 most used languages plus `curl` only on multi-SDK references; request and response beside each entry only on API references; `llms.txt` and a Markdown variant of every page only on docs sites. Demanding one of these elsewhere is a finding against Diataxis.

## Write against this

**Voice.** Active, present tense, second person, common contractions. No superlatives, no "simply" or "easy". Lead with what the reader can do. Software returns, rejects, and stores; it does not think or try. Define a term on first use. "Must" for a requirement, "should" only for a recommendation, no "please".

**Structure.** Bottom line up front: what the page covers and what the reader can do after. Conditions before instructions. One topic per section. Every section earns its place: an Overview that lists the headings, a summary that repeats the intro, an empty Prerequisites heading are padding, cut not filled. An orienting sentence after a heading only when the heading alone does not say what the section covers; a heading that names a list is enough. Steps start with an imperative verb, one action each.

**Clarity.** Plain words. Cut filler (very, really, just, basically, in order to). Specific with a measured number when you have one, otherwise cut the adjective; never invent a figure or a time-to-complete. US English for a global audience unless the profile says otherwise. One idea per sentence; a sentence over 25 words with two "and"s is a candidate to split, not a failure by length. Verbs, not nominalisations.

**Code.** Every concept, function, or endpoint gets a complete runnable example: imports, expected output in a comment, a language tag on the fence, comments that say why. Tutorials are prose with short code steps; references are signature, table, request, response. Example values from the product's domain, never `foo`. Placeholders in `UPPER_SNAKE_CASE`, explained once; credentials use the provider's test prefix, never a live-looking key. Errors documented as the message seen, the cause, the fix.

**Format and navigation.** Sentence case headings. Bold for UI the reader clicks, code font for filenames and commands. Link text names the destination. Alt text describes what the image shows. Lowercase hyphenated filenames. Markdown syntax, not raw HTML. Every doc linked from another; link to the existing explanation instead of repeating it; relative paths; headings use the words readers search for; a parent or prerequisite named at the top only where the site renders no breadcrumb.

**Hygiene.** Delete docs for removed features. Docs live in `docs/` by type. No status reports or dated plans. Experimental features get a callout after the intro; a page written ahead of the code is marked `[PLANNED]` and unmarked in the PR that ships it. Freshness comes from the build, never a hand-typed date.

**Review.** A fresh reader follows the page from scratch. Run every example, check parameter names and defaults against the implementation, resolve every link. Docs change in the same PR as the code, with prose lint in CI.

## Writing and auditing

Writing: pick the type, name the audience and what they can do afterwards, write the page, ship it when its examples ran and its links resolved. Length follows what the reader has to do.

Auditing: scope to changed files unless asked for a sweep. Classify, then run the checks in priority order (voice and structure, then clarity and code, then the rest), skipping what the type excludes. Report by file, by severity; every finding names the check, the issue, and the fix, with `file:line` when available; clean files listed as pass; no praise. "Improve" or "fix" means apply the fixes and return the page. Misclassification is the top false positive; "should" is not a bug.
