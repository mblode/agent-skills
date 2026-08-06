# Seven-Sweep Editing Framework

Structured audit for existing copy. Run sweeps in order, one at a time.

## Table of contents

- [How to use this framework](#how-to-use-this-framework)
- [Sweep 1: clarity](#sweep-1-clarity)
- [Sweep 2: voice and tone](#sweep-2-voice-and-tone)
- [Sweep 3: so what](#sweep-3-so-what)
- [Sweep 4: prove it](#sweep-4-prove-it)
- [Sweep 5: specificity](#sweep-5-specificity)
- [Sweep 6: emotion](#sweep-6-emotion)
- [Sweep 7: zero risk](#sweep-7-zero-risk)
- [Quick-pass editing checks](#quick-pass-editing-checks)
- [Compound adjective hyphenation](#compound-adjective-hyphenation)

---

## How to use this framework

1. Work sweeps in sequence; each builds on the last.
2. Flag issues with the inline tags per sweep (e.g. `[VAGUE]`, `[NO-PROOF]`).
3. Flag everything before fixing, to prevent scope creep.
4. After all seven sweeps, resolve every flag before publishing.

---

## Sweep 1: clarity

**Focus:** Comprehension. Reader never re-reads a sentence.

**Check for:**
- Confusing structure (nested clauses, stacked passive voice)
- Unclear pronouns ("it", "they", "this" with ambiguous antecedents)
- Undefined jargon or acronyms
- Claims readable two ways
- Context the writer assumed

**Flags:** `[JARGON]` (needs definition or replacement), `[VAGUE]` (could mean multiple things)

**Example fix:**
- Before: "It integrates with the tools your team already uses to streamline it."
- After: "The app connects to Slack, Notion, and Google Drive. No new workflows required."

---

## Sweep 2: voice and tone

**Focus:** Consistency. Copy reads as one person with a stable personality.

**Watch for:**
- Formal/casual shifts in one section ("utilise" then "use")
- Brand personality inconsistencies (playful headline, stiff body)
- Tense changes without narrative reason
- Mismatched register (technical then colloquial)

**Action:** Identify the dominant voice, standardise to it. Don't average; pick one and commit.

**Voice, not tone.** Tone is meant to shift with the reader's state: brisk on a routine save, careful before a deletion. That is not drift. Flag the line where the copy reads as a different brand, not the line where the same brand meets a different moment. The tone table in `SKILL.md` Step 3 sets the expected shifts.

**Flag:** `[VOICE-DRIFT]` on the line that breaks from the dominant voice, not on the voice you decided to keep.

**The test:** Read the section as one speaker. If two people seem to be talking, the second one is the flag. For each drifting line, ask "how would a confident human say this?" and rewrite that way.

**Common mismatches:**
- Marketing page enthusiastic; product description reads like a manual
- Hero uses "you"; about page switches to "our customers"
- Email subject punchy; body formal and slow
- Corporate register ("leverage", "synergise", "solution-oriented") next to plain sentences

---

## Sweep 3: so what

**Focus:** Every claim answers "why should the reader care?"

**The test:** Ask "so what?" of each sentence; if you can't answer, it failed.

**Flags:** `[DEAD-WEIGHT]` (no reader value), `[FEATURE-NOT-BENEFIT]` (what the product does, not what it does for the reader)

**Examples:**
- Feature: "Automatic daily backups." → `[FEATURE-NOT-BENEFIT]`
- Benefit: "Your data is safe even if your laptop dies tonight."
- Dead weight: "We are committed to excellence in everything we do." → `[DEAD-WEIGHT]`

**Note:** Not every sentence must be a direct benefit. Context, transitions, and proof earn their place; flag only what neither informs nor motivates.

---

## Sweep 4: prove it

**Focus:** Back every claim with evidence.

**Check for:**
- Testimonials from real, named customers
- Case studies with specific outcomes
- Stats, percentages, timeframes, hard numbers
- Third-party validation (awards, press, certifications, analyst reports)
- Guarantees or risk-reversal offers that show confidence

**Flag:** `[NO-PROOF]` on any strong assertion without support.

**Placeholder:** `[PLACEHOLDER: add proof: stat / testimonial / example]`

**Claims that need proof:**
- "Trusted by thousands of teams worldwide." → `[NO-PROOF]` → `[PLACEHOLDER: add proof: exact customer count or named logos]`
- "The fastest solution on the market." → `[NO-PROOF]` → `[PLACEHOLDER: add proof: benchmark stat or third-party comparison]`
- "Our customers see results immediately." → `[NO-PROOF]` → `[PLACEHOLDER: add proof: testimonial with timeframe]`

---

## Sweep 5: specificity

**Focus:** Replace vague language with concrete detail.

**Check for:**
- Vague time ("quickly", "fast", "soon")
- Vague quantity ("many", "several", "a lot")
- Vague outcome ("better results", "improved performance", "saves time")
- Named outcomes without named contexts (who achieves what, under what conditions)

**Flag:** `[VAGUE]` on anything that could be more concrete.

**Transformations:**
- "Saves time" → "Cuts weekly reporting from 4 hours to 15 minutes"
- "Used by many companies" → "Used by 4,200 teams across 60 countries"
- "Improves team performance" → "Teams close 30% more tickets per sprint after the first month"
- "Easy to set up" → "Most teams are live in under 20 minutes"
- "Affordable pricing" → "Plans start at $12 per user per month"

**Note:** If the number isn't known, use the `[PLACEHOLDER]` pattern from Sweep 4 rather than leaving vague language in place.

---

## Sweep 6: emotion

**Focus:** Name the pain the reader already feels before selling the outcome. Readers act once they feel understood, so pain acknowledgment usually outperforms one more benefit statement.

**Flag:** `[PAIN-NOT-NAMED]` on a section that states benefits without ever naming the frustration the reader arrived with.

**The test:** Point at the exact line where the reader thinks "yes, that's exactly my problem". If the section has no such line, flag it. If it has three, the copy is wallowing; cut to one.

**Check for:**
- Pain named in the reader's own words, not abstracted ("teams struggle with alignment")
- Aspirational outcomes concrete enough to picture
- Movement from problem to possibility, not benefits listed flat

**Guidance:**
- Don't manufacture emotion; forced enthusiasm reads as inauthentic and is the default failure here.
- Mirror the reader's actual state at this point in the page; a pricing page reader is further along than an ad reader.

---

## Sweep 7: zero risk

**Focus:** Remove friction at and near CTAs. The next step should feel costless.

**Check for:**
- Objections not addressed before the CTA
- Missing trust signals (security badges, customer logos, review counts)
- Unclear next step: what happens when I click?
- Missing risk reversal: free trial, money-back guarantee, no-credit-card-required, cancel-anytime

**Flag:** `[WEAK-CTA]` on any CTA standing alone without a qualifier or trust signal.

**Examples:**
- Weak: "Sign up now."
- Stronger: "Start free. No credit card required."
- Stronger still: "Start your 14-day free trial. Cancel anytime. No card needed."

**CTA qualifier checklist:**
- What does the reader get immediately?
- Time or money commitment?
- What if they change their mind?
- Is the next step one plain sentence?

---

## Quick-pass editing checks

Apply at the end of all seven sweeps as a final line-level pass.

Cut these words on sight; they rarely add meaning:

- "very", "really", "truly", "highly"
- "just", "simply", "easily"
- "actually", "basically", "essentially"
- "things", "stuff", "aspects", "elements"

**Test:** Remove the word. If the sentence still means the same, cut it.

**Paragraph length:** 2 to 4 sentences is the web-copy norm, but vary it deliberately and use 1-sentence paragraphs for emphasis. Uniform paragraph length is itself an AI tell; see `ai-patterns.md` section 5.

---

## Compound adjective hyphenation

Mechanical, high-frequency, and invisible to a persuasion pass. The rule turns on one question: does the multi-word modifier sit **before** the noun it describes?

**Before the noun, hyphenate.** Most often number plus unit.

| Correct | Incorrect |
|---------|-----------|
| a **7-day** free trial | a 7 day free trial |
| a **4-digit** code | a 4 digit code |
| **real-time** updates | real time updates |
| **one-click** setup | one click setup |
| **full-width** imagery | full width imagery |

**Standing alone as a noun phrase, no hyphen.** Usually after a verb or a preposition.

| Correct | Incorrect |
|---------|-----------|
| The trial lasts **7 days** | The trial lasts 7-days |
| Expiring in **14 days** | Expiring in 14-days |
| Your code must be **4 digits** | Your code must be 4-digits |
| **3 days** left in your trial | 3-days left in your trial |

**Template variables follow the same rule.** The hyphen goes between the variable and the unit, which is the case teams get wrong most often because the variable hides the pattern.

| Correct | Incorrect |
|---------|-----------|
| `{{days}}-day free trial` | `{{days}} day free trial` |
| `a {{count}}-digit code` | `a {{count}} digit code` |
| `Expiring in {{numOfDays}} days` | `Expiring in {{numOfDays}}-days` |

**Decision:** is a noun coming next, and does the modifier describe it? Hyphenate. Otherwise leave it open. Never hyphenate an adverb ending in `-ly`: "a fully managed service", not "a fully-managed service".

Fix these silently in a rewrite. They don't earn a flag of their own unless the same error repeats across a surface, which makes it a style decision worth naming.
