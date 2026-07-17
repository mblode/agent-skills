# Linear voice (demo persona)

Fictional demo persona: "Sam", a Melbourne-based senior engineer and indie builder. This file ships so the skill works out of the box. To make it yours, create `~/.config/tone-of-voice/linear.md` from this structure and replace the rules and excerpts with your own (see `references/refreshing.md`). Everything below is invented, not real tickets.

## Contents

- [Register](#register)
- [Ticket shapes](#ticket-shapes)
- [Titles](#titles)
- [Description patterns](#description-patterns)
- [Compression: halve it](#compression-halve-it)
- [Anti-patterns](#anti-patterns)
- [Excerpts](#excerpts)

## Register

The gold standard: just enough detail that a human or an agent can pick the ticket up cold and start work, and nothing more. Every ticket answers two questions fast: why does this exist, and what do I do. This is the flattest register of any platform: no emoji, no exclamation marks, no greeting, no sign-off, no "!!". The warmth of the chat voice does not apply here; the value is entirely in precision per word.

## Ticket shapes

**Scoped task** (the default): 1-3 sentences. A gap sentence (what's missing or wrong), an action sentence (what to add or change), then a status or routing tag ("Deferred.", "Folds into APP-2016.", "PR #1983."). Most tickets are this shape.

**Bug, evidence-first**: the quickest bug tickets are pure evidence: the failing request, the error response, and the URL where it happens, with zero prose. The title carries the whole summary ("Reminder digest email 500s for pro accounts"). When more words are needed: what surface, a one-line repro, the expected behaviour, and an evidence link.

**Investigation finding**: first person ("I generated and inspected..."), numbered observations grounded in real data pulled, then a "Net:" paragraph that says what it means and states explicitly whether it blocks anything or just feeds a decision.

**Deferred / dependency ticket**: name what doesn't exist yet, what to add, then "Deferred." with the condition or sequencing ("paywall first", "so post-V1", "the step after the beta allowlist").

## Titles

- Imperative verb or a tight noun phrase: "Add a weekly streak digest [P1]", "Seed the beta cohort (the invite allowlist)".
- Area prefix for routing: "Reminders:", "Billing:", "Onboarding:", "Sync:".
- The specific noun lives in the title, so the title alone is actionable: "Shorten the reminder push CTA so it fits the notification", never "Fix notification bug".
- Parentheticals and tags carry scope: "(signal + enable tool)", "[P1]", "[Stretch]", "(internal-only soft launch)".

## Description patterns

- Identifiers and numbers do the arguing: function names (`scheduleReminder`, `computeOffset`), event names (`ReminderQueued`), env flags, caps ("1/user/day", "14-day dedup"), thresholds ("Fine at beta volume, must-solve before ~10k users").
- Provenance and people are named: "[Name]'s ask:", "From [Name]'s support handover (26 Jun)", "Wrap Billing's existing mutations, with Billing".
- Cross-links inline and load-bearing: "See APP-632 for the underlying calendar sync", "needs APP-492", "Feeds the allowlist gate. PR #1983."
- Scope fences stated flat: "No new settings screen.", "Generic copy this quarter."
- Sequencing as a closing fragment, not a paragraph: "Deferred, paywall first.", "so post the first send."
- Sentence fragments are fine; ceremony is not. Never "This ticket tracks the work to..."

## Compression: halve it

When given a document, thread, or long draft to turn into a ticket, cut the word count in half while keeping the essence, then check: could someone start work from this without asking a question? If yes, try halving again. Keep every identifier, number, link, and scope fence; drop narrative, justification the reader can infer, and anything restating the title.

> **Before:** We've noticed that when users open the Reminders page via the left-hand navigation, the page can remain in a loading skeleton state for an extended period. This appears to be related to how settings data is fetched during client-side navigation. We should investigate the data fetching logic and implement a fix so the settings load quickly. Acceptance criteria: page loads promptly; no regression to direct loads.
>
> **After:** Reminders page opened via the left rail sits in skeletons 4+ seconds; a direct load renders normally. Client-side nav should hydrate the settings at least as fast as a cold load.

## Anti-patterns

- User-story boilerplate ("As a user, I want...") and acceptance-criteria checklists on small tickets.
- Restating the title in the first line of the body, or empty template sections (Background, Notes, Out of scope with nothing in them).
- Hype, emoji, exclamation marks, or chat warmth of any kind.
- Em dashes anywhere.
- Padding a 2-sentence ticket into a brief; a ticket that fits in 3 sentences takes 3 sentences.
- Vague deferral ("revisit later"); deferrals name the unblocking condition.
- Long structured briefs (## Problem / Root cause / Fix / Files / Verification) are agent-drafted execution handoffs, a different artifact. Don't imitate them for a normal ticket; if the user explicitly wants a full execution brief, that's a planning task, and even then the prose stays in this register: short sentences, concrete identifiers, no filler.

## Excerpts

**Scoped task with threshold and provenance**
> Frequency capping and opt-out only work if the email provider and our in-house scheduler share send history + consent. Today provider sends are invisible to the in-house cap, and an opt-out in one isn't mirrored in the other. Fine at beta volume, must-solve before ~10k users. Evaluate reverse-ETL vs opt-out-as-source-of-truth. From [Name]'s support handover (26 Jun).

**Risk ticket with a cross-link**
> The 1/user/day cap is enforced in the scheduler and that path is barely covered by tests. Reminders alone can't exceed it (14-day dedup is ~1 push per fortnight). Before scaling, confirm who owns the cross-feature cap, or add a producer-side backstop. See APP-632 for the underlying calendar sync.

**Deferred, blocked both ways**
> The enable-notifications nudge is blocked both ways: no notification-permission signal in the batch, and no enable-notifications action in-app. Add both, then wire the nudge. Deferred.

**Deferred, two sentences (title: "Add a weekly streak digest [P1]")**
> The [P1] streak digest needs a per-user streak feed, which doesn't exist. Add one, then build the digest. Deferred.

**Deferred, names why the feature was cut**
> best-time-to-remind was cut: no per-user activity history, so it would invent windows. Add an activity source, then re-enable the dormant type. Deferred.

**Scoped task with function names and a scope fence**
> Wire the Category A nudges: enableReminders and snoozeReminder via their actions, addHabit via the existing create flow (a habit is a standard record), dismissNudge via acknowledge. No new nudge type. Folds into APP-2016.

**Scoped task, dependency and ownership in one line**
> For V1, "add a goal" is a local record (addHabit). A real shared goal needs the 3-step group flow (createGroup, addMember, linkGoal) + invite data. Wrap Billing's existing mutations, with Billing. Deferred.

**Sequenced rollout step**
> Add a percentage gate for WEEKLY_DIGEST (deterministic user-UUID bucketing), replacing the allowlist escape hatch, then flip in stages. The step after the beta allowlist launch, so post-V1.

**Task with its PR attached as the closer**
> Seed query for the beta cohort: recently-active users with at least one habit and notifications on, type-agnostic (any reminder, not just streaks). Feeds the allowlist gate. PR #1983.

**Experiment ticket: hypothesis, metrics, sequencing**
> Test two digest framings per user (deterministic UUID split) to see if wording moves open rate, app opens, and 7-day return. Generic copy this quarter. Needed to read the hypotheses, so post the first send.

**Delegated ask, scoped in two sentences**
> [Name]'s ask: run the reminder engine on the group-goals surface (per-member nudges, digest aggregation). Scope the work and write the LOE for after the beta.

**Investigation finding: first-person opening and the "Net:" closer**
> I generated and inspected the reminder recs behind the deep-linked digest for a test account (sam-demo, ...) and compared against the V1 spec. A few things are off, both in what the scheduler produces and how the email renders it.
>
> [numbered observations]
>
> Net: for this account the experience doesn't match V1 yet. The reminders are a single off-spec type with no activity grounding, and the email over-produces on top of that. Logging as a parallel finding, not a blocker, so the cohort (APP-563), policy (APP-564), and first send (APP-577) keep moving. It feeds the reminder-type/grounding decision rather than gating it.
