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
- [Common copy problems and solutions](#common-copy-problems-and-solutions)
- [Quick-pass editing checks](#quick-pass-editing-checks)

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

**Common mismatches:**
- Marketing page enthusiastic; product description reads like a manual
- Hero uses "you"; about page switches to "our customers"
- Email subject punchy; body formal and slow

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

**Focus:** Evoke the right feeling alongside the right facts.

**Check for:**
- Pain points named and acknowledged, not just implied
- Aspirational outcomes that let the reader picture success
- Sensory or visceral language that makes abstract benefits feel real
- Emotional pacing: does it move from problem to possibility?

**Guidance:**
- Don't manufacture emotion; forced enthusiasm reads as inauthentic.
- Mirror the reader's actual emotional state at this point in the copy.
- Pain acknowledgment often beats benefit statements: readers feel understood before they feel sold to.

**Ask per section:**
- What is the reader feeling before they read this?
- What do they want to feel after?
- Does the copy bridge those two states?

**Signs emotion is missing:**
- Reads like a product spec sheet
- No "yes, that's exactly my problem" moment
- Benefits listed but never made vivid or personal

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

## Common copy problems and solutions

| Problem | Symptom | Fix |
|---|---|---|
| Wall of features | Features listed, no reader benefit | Add "which means..." bridges linking each feature to an outcome |
| Corporate speak | "leverage", "synergise", "solution-oriented" | Ask "How would a confident human say this?" Rewrite that way |
| Weak opening | Starts with product name or "We are..." | Lead with the reader's problem, not your identity |
| Buried CTA | CTA only at page bottom | Make CTA visible in the first screen; repeat contextually |
| No proof | Pure claims, nothing behind them | Add testimonials, hard numbers, named customers |
| Generic claims | "Best in class", "industry-leading", "world-class" | Specify: who says so, how measured, by how much |
| Mixed audiences | Speaks to multiple buyers at once | One primary audience per page/section; separate paths for others |
| Feature overload | 10+ features at equal weight | Focus on 3 to 5 key benefits; move secondary ones to a comparison table or FAQ |

---

## Quick-pass editing checks

Apply at the end of all seven sweeps as a final line-level pass.

### Word level

Cut on sight; these rarely add meaning:
- "very", "really", "truly", "highly"
- "just", "simply", "easily"
- "actually", "basically", "essentially"
- "things", "stuff", "aspects", "elements"

**Test:** Remove the word. If the sentence still means the same, cut it.

### Sentence level

- One idea per sentence.
- Max ~25 words for web and marketing copy.
- Front-load the key claim: most important word or phrase early.
- Avoid opening with "There is", "It is", or "We believe".

**Test:** Read each sentence aloud. If you run out of breath or lose the thread, split it.

### Paragraph level

- One topic per paragraph.
- 2 to 4 sentences for web copy; longer only when depth is needed.
- The opening sentence carries the paragraph's main point.
- Skimming only the first sentence of each paragraph should convey the full argument.

**Test:** Read only the first sentence of each paragraph in sequence. Does the story hold?
