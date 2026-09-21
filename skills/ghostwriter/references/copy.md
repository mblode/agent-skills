# Copy

Read when writing or editing as a company: landing pages, hero and subheads, CTAs, product descriptions, UI strings, product-state copy, and transactional emails. The company's profile sets the voice, glossary, and locale; this file is the craft.

## Brief, then write

Settle purpose (the one action), reader (who, how they arrived), product (the concrete outcome), and voice (the company profile). Infer what the user did not say and mark it so they correct it against real copy. Then write one recommended draft; alternatives only when asked to compare directions. A button task returns labels, not a headline bundle. No company profile is a setup gap: say so, and label the draft provisional.

## The rules that change the copy

- **Why before what.** Open with the reader's problem, then how the product meets it, then what it is. "Stale dashboards kill trust. StrataSync keeps every client in sync." beats "StrataSync is a real-time sync engine."
- **Benefit, then mechanism.** "Ship without writing release notes" beats "automated changelog generation".
- **Specifics prove; adjectives claim.** "Powerful", "simple", "seamless", "intuitive", "easy" in a hero are unearned. Replace with the outcome, the number, or the scenario, or cut. "Simple" as a claim is never earned upfront.
- **Cut dead weight.** "We believe that", "Our mission is to", "Designed to be", "X is a Y that helps you Z" (say "X does Z"), any line restating the headline.
- **CTA names the outcome.** Verb plus what they get, 2 to 5 words, a qualifier when there is room: "Start syncing free", "See pricing". "Get started" and "Learn more" send readers who wanted pricing into a signup flow. Two CTAs with the same verb read as one decision offered twice.
- **Match the reader's stage.** Cold traffic knows nothing: open on their world, then the problem. Problem-aware: the pain in their words, then the fix. Solution-aware: the mechanism and how it differs. Product-aware: proof. Most-aware: the offer and the CTA. Offer-and-urgency copy aimed at a problem-aware reader is the common hero mismatch.
- **Page types in one line each.** Homepage: one segment, one primary CTA. Landing page: one action matched to what brought the reader, exits stripped. Pricing: plans named for the buyer, not the tier. Feature page: straight to the outcome, no setup. About: every paragraph answers "what does this mean for me".

## Product-state copy

Words read while doing a task, where clarity beats persuasion. The product decision (scope, reversibility, whether a confirmation exists) is `product-design`'s; this writes the wording once that is settled, against the rule IDs it owns.

- `rule/destructive-names-action`, `rule/no-confirm-ok-labels`: labels name the object: `Delete project`, never `Confirm`, `OK`, `Yes`, or a bare verb. `Save`, `Cancel`, `Close` are the exemptions.
- `rule/canonical-verb`: one verb per operation: Delete destroys, Remove detaches, Archive hides reversibly, Discard drops unsaved edits.
- `rule/error-states-recovery`: errors say what happened, why when known, and how to recover; never raw exception text, never blame ("invalid", "you failed to"). Keep what the user typed.
- `rule/success-state-specific`: success confirms in past tense what happened to which object, proportional to the action: "Changes saved", "Invite sent to jane@acme.com".
- `rule/empty-state-action`: empty states name the object and offer the first action; a filtered-to-zero state offers to clear the filter.
- `rule/loading-state-specific`: loading names the target ("Loading your projects…"); the triggering control keeps its label.
- `rule/permission-benefit-first`: permission requests lead with the benefit, asked at first use, with an honest decline option.
- `rule/reads-without-seeing`: copy works when heard: a field error reads sensibly after its label, links name the destination, no "above" or "below".
- Budgets: button 2 to 4 words, error 12 to 18 with the recovery, any sentence the user acts on under 25. Leave translation headroom.

## Transactional emails

Ground the event: trigger, recipient, affected object, next action, expiry. Never invent retry schedules, refund promises, security conclusions, or URLs; mark unknowns as placeholders, ask when one decides what the recipient must do. Reuse the nearest approved precedent and check its claims against current behaviour. Deliver subject (names the event), preheader (adds to it), heading, body (what happened, to which account, what next), action (label and destination). A point edit returns only the changed text. Preserve variables, amounts, and dates exactly. Writing the email does not authorise sending it.

## Editing existing copy

Point edit: change the named line plus the minimum around it. Restoration: the copy has a voice and an angle; fix the failures without rebalancing the argument. Rebuild: the copy is generic; write from the brief and invent no proof. Return the rewritten copy with before and after per changed line; each change fixes a named failure, and a change that is merely different goes back. Tone shifting with the reader's state (brisk on a save, careful before a delete) is not voice drift.

## Mechanics

Compound adjectives before a noun take a hyphen (`a 7-day trial`, `{{days}}-day trial`); standing alone they do not (`the trial lasts 7 days`); `-ly` adverbs never do. Casing follows the surface, and every platform guide says sentence case for UI text. Read the glossary before replacing a term.
