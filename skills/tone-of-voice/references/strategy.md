# Strategy: making a message land

Voice rules make a draft sound like you; these rules make it work. Adapted in original wording from Wes Kao's communication frameworks (weskao.com) via https://github.com/kinantid/skills (MIT). The warm-no close draws on Alison Green (Ask a Manager); "plausible linkage" is Marc Randolph's phrase.

Read this file when the message is an ask, a decline, bad news, feedback or praise, a delicate answer, or anything external or high-stakes. Skip it for pure logistics, family WhatsApp, and casual DM banter; strategy applied there reads as weird ("don't BLUF your mum").

## Contents

- [How to use these](#how-to-use-these)
- [Lead with the point](#lead-with-the-point)
- [Most obvious objection](#most-obvious-objection)
- [The easy yes](#the-easy-yes)
- [The warm no](#the-warm-no)
- [Finesse: delicate answers](#finesse-delicate-answers)
- [Invert the but](#invert-the-but)
- [Receipts before you credit](#receipts-before-you-credit)
- [Bad news: objective, not detached](#bad-news-objective-not-detached)
- [Speak in the affirmative](#speak-in-the-affirmative)
- [Answer the real question](#answer-the-real-question)
- [Diagnosis patterns](#diagnosis-patterns)

## How to use these

Apply the 2-3 principles the message actually needs (the intent table in SKILL.md maps intent to principles). Applying all of them to every draft dilutes the message and sands off the voice. Voice always wins: if a strategically perfect rewrite stops sounding like you, back off the polish, keep the structure.

## Lead with the point

Start right before the interesting part, not two scenes earlier. The first sentence carries the ask, the headline, or the number; backstory gets one sentence of context at most, or nothing. The reader will ask if they want history.

Test: delete the first paragraph. If the message still makes sense, that paragraph was setup.

> **Before:** Hey, so last sprint we noticed some drop-off in the onboarding flow and I've been digging into the analytics with Priya to figure out where people bail. After a lot of back and forth we think we found it and I put up a fix.
>
> **After:** Found the onboarding drop-off: 40% of bails happen on the username step. Fix is up: <PR link>

## Most obvious objection

Before sharing a recommendation, ask: what will a sharp reader push back on within ten seconds? Name that objection and answer it in the same breath, before they can raise it. An unaddressed objection means they stop reading and start rehearsing their rebuttal; naming it proves the idea was pressure-tested.

Address the top one or two objections, not five (that's padding). And never name an objection with a handwaved answer ("there's some migration risk but we'll manage"): that's worse than silence because it signals the problem is known and unsolved. If there's no solid one-sentence answer, the pitch isn't ready.

> **Before:** I think we should move the QA checks into CI so reviewers don't have to run them manually.
>
> **After:** I think we should move the QA checks into CI so reviewers don't have to run them manually. Main concern is CI time: I tested it and it adds about 90 seconds, and we can run it only on frontend paths.

## The easy yes

A reluctant yes is fragile; the person deprioritises it and won't defend it. Make the yes feel obvious:

- **Lead with the benefit to them**, not to you ("this kills the weekly on-call noise from X" beats "I need a review").
- **Pre-scope the work** so the yes is approval, not a new project. Named people already on board ("Priya is in") add momentum.
- **Make the ask specific and bounded**: "Can I get a review on <PR link>? It's small, ~50 lines" beats "could we work together on this?".
- **Replace vague urgency.** "ASAP", "urgent", "soon", and "when you get a chance" carry no information. Use one of: a concrete deadline ("by Thursday EOD"), a sequence ("X first, Y can wait until next sprint"), an anti-deadline ("this can genuinely wait until next month", which buys credibility for real deadlines), or a default ("if I don't hear back by 5pm I'll run with option A", for low-risk, already-aligned calls only).
- **Too big for an enthusiastic yes? Shrink it.** Ask for sign-off on the direction, debate the details after.

Test before sending: read it as the recipient. Would you say yes happily? If the honest answer is "reluctantly", rework the ask, don't send it.

> **Before:** Hey, when you get a chance it would be great to sync about maybe improving the flaky e2e situation, no pressure!
>
> **After:** Hey, the flaky e2e suite is costing us about 3 re-runs per PR. I've got a fix scoped (retry only network steps, ~1 day). Ok if I pick it up Monday?

## The warm no

The inverse of the easy yes: the goal is a clear no with the relationship intact. The no itself stays clear and kind; the warmth lives in the close, never in muddying the answer. A soft, hedged no leaves the person unsure they were even declined.

Three moves for the close:

1. **Carry the next step yourself.** "I'll ping you when we pick this back up" beats "feel free to follow up". Homework for the person you just declined is not warmth.
2. **Bounded offers only.** "Happy to send through the eval setup we used, just shout" beats "let me know if you ever want to chat about anything". Offer the specific thing you'll actually honour.
3. **One recallable specific.** A single true detail ("good luck with the App Store review") reads as paying attention. Three reads as a CRM record. Zero reads as a template. The detail must be correct: a garbled specific is worse than none.

## Finesse: delicate answers

Same facts, different framing, different outcome. When answering a delicate question (capability limits, pricing, "can you do X?"), choose which true things to lead with. Three answers to "how many concurrent users can it handle?", all built on "about 500":

- **Bare fact:** "500." True but inert; the reader supplies their own worst-case framing.
- **Negative framing (the trap):** "We don't have hard limits and most customers run without major issues, but you might hit some performance issues at scale, usually it's fine." Every clause plants a doubt; a true, good answer now reads as a warning.
- **Honest positive frame:** "It comfortably handles 500 concurrent users, well past your current size, and we'll flag well before you get near any threshold." Identical information, led with the capability, constraint stated once as something handled.

Two-pass edit for anything delicate or external:

1. **Negative-language audit:** scan for "don't", "without", "issues", "problems", "but", "usually", "should be fine", "hopefully". Each is a true thing stated in a way that costs you; rewrite to the positive truth.
2. **Misinterpretation pass:** read as the most skeptical reader. Close any gap where they could read a ceiling, a hedge, or a catch.

The bar: every reframe must stay true and defensible. If it can't be backed, it's spin, not finesse. And don't over-frame into marketing-speak; confident beats breathless.

## Invert the but

Readers keep whatever follows "but". "[Positive], but [negative]" cancels the compliment and only the criticism sticks. When the positive is the honest headline, invert: "[negative], but [positive]".

> **Before:** The new settings page looks great, but the save flow loses state on refresh.
>
> **After:** The save flow loses state on refresh (needs the same sessionStorage trick as the profile page), but the rest of the settings page looks great.

Guardrails: never fabricate the positive half; don't smother the fix in praise until it disappears; and never invert genuine risk flags or incident news, where the negative must stay the headline. One well-placed inversion beats five reflexive ones.

## Receipts before you credit

Every specific, verifiable claim in a compliment, shout-out, or characterisation needs a source you can point to: the thread, the PR, what the user told you. A wrong compliment costs more credibility than no compliment, and to the person being praised it reads as not having paid attention.

- Don't credit work that happened differently ("AI helped you ramp on Mapbox" when they actually read the docs because AI kept getting it wrong).
- Don't inflate scope ("tested with real users" when one person tried it once).
- Get domain facts right; imprecision is loudest to the person who knows the space.
- Don't tell someone to develop a skill they just demonstrated. Credit it, then push to make it systematic.

This extends the voice rule of generous named credit: the name and the specific both have to be true.

## Bad news: objective, not detached

Two failure directions. Detached: an agentless "an issue occurred and was resolved" summary that under-signals severity and reads as hiding something. Grovelling: three apologies that make the reader manage your feelings on top of the problem. The target is the middle: facts, one honest severity line, containment.

1. **Lead with the fact and its size.** Numbers beat adjectives: "affected 12 profiles, 3 noticed before we did".
2. **One severity signal.** "Not great, this is our second sync incident this quarter." This is the line detached drafts are missing.
3. **Own it once, cleanly.** "My miss." Then stop apologising and start fixing.
4. **Close on containment**: what's done, what's next, what prevents a repeat.

Passive voice in a bad-news draft is the tell: name the actor, size the damage, own the fix. Separate case: a reasonable decision someone won't love (declining a request, sunsetting a feature) is not a mistake. State it plainly with the reasoning; apologising for it invites relitigating.

## Speak in the affirmative

"Do this" is easier to process than "don't do that", and stating the negative plants the negative. Same facts, different residue:

- Instructions: "Keep blockers to 2 minutes, then priorities" beats "don't spend the whole standup on blockers".
- Availability: "I can pick this up Thursday" beats "I can't look at this until Thursday".
- If the negative is the message (a boundary, a correction), never leave a vacuum: follow it with the affirmative replacement ("Don't ship without QA sign-off. Get the tick in the release channel first, then ship").
- Unstack double negatives: "not unreasonable" becomes "reasonable".

The affirmative version must carry the same constraint; "ship whenever!" is affirmative and wrong if sign-off is mandatory.

## Answer the real question

People ask compressed surface questions; underneath is what they actually want: a judgment, a reassurance, a decision. "What's the status on X?" usually means "am I going to get surprised, and do you need anything from me?". "What do you think of this proposal?" usually means "should I approve it?".

Answer the real question first and let the literal answer ride along. Both failure modes are real: pure literalism reads as junior, and over-projection (inventing a hidden question that isn't there) reads as dodging. If the real question genuinely diverges, name it: "if the real question is X, then [answer]; if you meant it literally, [short answer]."

Plausible linkage, the aggressive cousin (bridging from what was asked to the more useful thing you'd rather address), is fine sparingly with people who trust you; overused it reads as evasion.

## Diagnosis patterns

Symptom to fix, for the diagnose step:

| Symptom | Fix with |
|---|---|
| Main point in paragraph 3 | Lead with the point |
| Setup and history before the ask | Lead with the point |
| Obvious pushback unaddressed | Most obvious objection |
| No clear action or decision requested | The easy yes |
| "ASAP" / "soon" / "when you get a chance" | The easy yes (concrete time) |
| Muddy decline the reader might miss | The warm no |
| True facts framed with doubt-words | Finesse (negative-language audit) |
| Compliment cancelled by trailing "but" | Invert the but |
| Praise claim with no source | Receipts before you credit |
| Praise names a feeling, not the specific ("stuck with us") | Receipts + state the observation, drop the label |
| Agentless bad news ("an issue occurred") | Objective, not detached |
| Apology stacking, or apologising for a reasonable decision | Objective, not detached |
| "Can't until X" / "don't do X" phrasing | Speak in the affirmative |
| Literal answer to a loaded question | Answer the real question |
| A real win stated so flatly it disappears | Lead with the number; one line of what it unlocks |
