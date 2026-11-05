# Exploratory Test

A fresh tester uses the feature the way a user would, after the written checks pass, to find what nobody wrote down. A probe answers a known question; this pass looks for the questions the contract never asked.

## Contents

- When it runs
- Who runs it
- Permission
- Charter
- When to stop
- Each finding

## When It Runs

After the feature's own checks pass: its acceptance criteria, its rubric or verifier, and CI. Run earlier and the pass rediscovers known gaps, so its findings duplicate the checklist instead of extending it.

Against a test, preview, or staging environment with seeded data. Never production: exploration submits forms, deletes records, and repeats actions on purpose.

## Who Runs It

A fresh context, not the session that built the feature: the builder's blind spots are the cases it already steered around.

The tester reads what the feature is for (the task contract, ticket, or PR description) and the routes it lives on, not the diff. Reading the implementation first teaches the tester which cases are handled, and it stops trying the rest.

## Permission

The environment is disposable, so create, edit, and delete test records, sign up throwaway users, submit forms repeatedly, and reload mid-flow without asking. Stop and ask before anything that leaves the environment: email or SMS to an address that is not a test inbox, a live payment provider, a webhook to a third party, or any URL that resolves to production.

## Charter

Write a short charter before driving anything: the feature, the user it serves, and the paths the contract names. Drive each named path end to end once as written, since nothing else means anything until the happy path works. Then press on it where the feature holds state:

- **Navigation:** back, forward, refresh, and a deep link into the middle of a multi-step flow; a second tab on the same record.
- **Repetition and timing:** double submit, submit while a request is in flight, a slow network mid-step. `probes/failure-injection.md` covers the request-level states; this pass covers what the user does around them.
- **Identity:** a user with fewer permissions, a session that expires mid-flow, two users changing the same thing.
- **Input:** empty, maximum length, pasted rich text, emoji and right-to-left text, values on a boundary the contract names. `probes/viewport-stress.md` covers layout under long strings.
- **Leaving and returning:** abandon halfway and come back; check the draft, selection, or error survives the way a user would expect.

A static page earns little of this list. Spend the time where the feature has state.

## When to Stop

Stop when every charter path has been driven and pressed on, and the last round of pressure found nothing new, or when the time box the user set runs out. One finding is not a reason to stop.

## Each Finding

- **Reproduce before reporting.** Replay the exact steps in a fresh browser context. A replay that shows the defect makes it `reproduced`. One that will not repeat after two tries is `unknown` with `reason: "flaky"`, steps kept.
- **Record steps a person can follow:** a numbered list, the account and seed used, and the screenshot and console and network logs in the artifact layout from `references/evidence-output.md`.
- **Classify it.** A `defect` is behaviour the contract or ordinary user expectation says should work. A `contract-gap` is a case nobody decided, such as two users editing the same invoice. Send a gap to the contract owner as a question with the observed behaviour, never to the builder as a failure: a gap reported as a bug gets "fixed" into whichever behaviour the builder guesses.
- **Emit it under `explore:<slug>`** with the exploratory fields in `references/evidence-output.md`: a defect as a finding, a contract gap in `session.contractGaps[]`. No tier and no verdict; `ui-design` owns both.
- **Do not fix during the pass.** A fix changes the app under test and blurs which steps reproduce. Name each reproduced defect as a candidate regression test; writing the durable test belongs to the repo's suite.
