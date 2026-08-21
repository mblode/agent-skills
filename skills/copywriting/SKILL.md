---
name: copywriting
description: >-
  Writes and edits short product and marketing copy, including landing pages,
  CTAs, onboarding strings, product descriptions, email subjects, UI state
  copy, brand voice charts, and AI-ism cleanup. Use when asked to "write
  copy", "fix the copy", "make this shorter", "improve the CTA", "rewrite
  from first principles", "remove AI-isms", "clean up AI writing", "flag AI
  patterns", "define our tone of voice", or "write a voice guide". For blog
  posts use the external ghostwriter skill with platform blog; for slide copy
  use presentation-creator; for docs use docs-writing; for in-session
  assistant talk use eli5; for product behavior decisions use product-design.
---

# Copywriting

- **IS:** short conversion copy (landing pages, hero, subheads, CTAs, product descriptions, onboarding strings, email subjects); product-state strings (destructive CTAs, error, success, empty, loading, permission copy); stripping AI writing tells from any copy.
- **IS NOT:** long-form articles, posts, or anything written as a person rather than a brand (use the external `ghostwriter` skill; `blog` for long-form), slide or deck copy (use `presentation-creator`), API/product/reference docs (use `docs-writing`), in-session assistant talk (use `eli5`), or deciding which action exists, its scope, consequence, reversibility, or reachable states (use `product-design`; this skill writes final wording once those are decided).

Two modes, auto-detected (do not ask):

- Copy exists or user pasted copy to fix: **Mode B (Edit)**.
- Nothing written yet, or user wants something new: **Mode A (Write)**.
- Genuinely ambiguous ("improve this", no copy in scope): ask one question, then commit.

## Reference files

| File | Read when |
|------|-----------|
| `references/frameworks.md` | Pick a framework (Write Step 4); audit against the nine frameworks (Edit Step 3) |
| `references/page-types.md` | Copy norms for a known page type (Write Step 4) |
| `references/word-lists.md` | Flag Tier 1/2/3 AI vocabulary (Edit Step 4) |
| `references/ai-patterns.md` | Flag structural, sentence-level, and drafting AI tells; P0/P1/P2 triage (Edit Step 4) |
| `references/sweeps.md` | Run the seven line-level sweeps, then the hyphenation pass (Edit Step 5) |
| `references/ui-states.md` | The copy is a product state or action label, not marketing (Write Step 4; Edit Step 6 before using `[STATE-COPY]`) |
| `references/voice-chart.md` | No usable voice file exists and the product needs one (Write Step 3; Edit Step 1) |

---

## Mode A: Writing new copy

```
Writing progress:
- [ ] Step 1: Gather context
- [ ] Step 2: State the brief, then write
- [ ] Step 3: Discover brand voice
- [ ] Step 4: Choose framework and load references
- [ ] Step 5: Write 2-3 alternatives
- [ ] Step 6: Recommend and explain
- [ ] Step 7: Verify every line before handing back
```

### Step 1: Gather context

Settle all four before writing, from the user or from the files. Where the files do not settle one, infer it and name the inference in Step 2; the failure mode is an invented audience or goal presented as fact.

1. **Page purpose.** The one action this page drives (sign up, book a demo, download).
2. **Audience.** The specific reader: job title, pain, what they've already tried.
3. **Product.** What it does; the concrete user outcome.
4. **Traffic source.** Where the reader comes from (cold ad, warm email, organic search, referral).

Traffic source sets temperature: cold needs more Why; warm can lead with How or What.

### Step 2: State the brief, then write

State the brief and keep going. Mark every field you inferred rather than were told, so the user can correct it against real copy instead of against a question:

```
Brief:
- Page: [page type]
- Goal: [single action]
- Reader: [specific audience]
- Core outcome: [what changes for the reader]
- Tone: [inferred from brand voice or user-stated]
- Traffic temperature: [cold / warm / hot]

Inferred (correct me): [fields you guessed]
```

Stop and ask before writing only when a wrong guess makes the work useless or unsafe: the copy ships in this turn with no review, or the goal is genuinely unknown and each candidate goal produces different copy.

### Step 3: Discover brand voice

Find voice signals before inventing one; never default to generic corporate warmth. Work down this order and stop at the first hit:

1. **A voice file in the repo:** `VOICE.md`, `BRAND.md`, `docs/voice.md`, or a tone-of-voice doc. This is the authoritative source when it exists.
2. **The user's own voice, on request only.** When the user asks for their voice ("in my voice", "sound like me") and the brand is theirs, read `$GHOSTWRITER_HOME/soul.md`, falling back to `~/.config/ghostwriter/soul.md`. Never apply a personal voice to a client's or employer's brand, and never quote the file back.
3. **Existing copy:** copy files, README headers, or shipped marketing pages.
4. **Inference:** B2B SaaS direct and confident, consumer apps warmer, developer tools terse and honest. Ask for brand guidelines alongside the draft, not instead of it.

**A discovered voice outranks the word lists.** If the voice file or the shipped copy uses a listed word as a signature, keep it; the lists catch generic AI vocabulary, not a deliberate house style. Locale and spelling convention come from the voice too.

Note in the brief which source you used, and mark the voice as inferred when it came from step 4. When no voice file exists and the product will need one, load `references/voice-chart.md` and offer to write `VOICE.md` alongside the copy.

**Voice is constant, tone adapts.** Voice is the brand's personality and does not change between screens. Tone is how that voice meets the reader's state:

| Reader state | Tone | Example |
|--------------|------|---------|
| Frustrated (error, failure, block) | Empathetic, solution-first, never blaming | "Payment failed. Your card was declined. Try a different card." |
| Confused (first use, complex feature) | Patient, one step at a time | "Connect your bank to see spending insights. We'll walk you through it." |
| Confident (routine task, return visit) | Efficient, minimal | "Saved" |
| Cautious (high stakes, data loss) | Serious, transparent, no nudging | "Delete account? You'll lose all data and this can't be undone." |
| Successful (completion) | Positive, proportional, brief | "Your changes are live." |

Copy that keeps one register across all five reads as robotic in the good moments and cold in the bad ones. A tone shift is not voice drift; drift is when the copy reads as a different brand, not the same brand in a different moment.

### Step 4: Choose framework and load references

Route on what the copy is:

- **Product-state copy** (error, empty, success, loading, permission) or an action label: load `references/ui-states.md` and stop here. Persuasion frameworks do not apply to a button that deletes something, and the rest of this step is for marketing surfaces.
- **Marketing copy:** load `references/frameworks.md`, plus `references/page-types.md` when the target is a homepage, landing, pricing, feature, or about page.

Choose the primary framework from the brief:

| Situation | Lead framework |
|-----------|---------------|
| Cold traffic, unfamiliar product | Why/How/What (Simon Sinek) |
| Feature-heavy product | Benefit Not Feature |
| High-trust audience, low awareness | Show Don't Tell |
| Transactional page, known intent | CTA Clarity |
| Long-form sales page | Problem → Agitate → Solution (PAS) |

Layer frameworks freely. Why/How/What almost always applies to hero copy.

### Step 5: Write 2-3 alternatives

Write distinct alternatives, labeled **Option A**, **Option B**, **Option C**. Three for a page, hero, or campaign; two for a single string like a CTA or subject line, where a third is padding. One is not a choice, and four is a survey. Each option:

- Apply the chosen framework visibly
- Lead with Why, not What
- Use no banned words (see below)
- Include a headline, subhead, and at least one CTA
- Be structurally different, not the same idea with new adjectives

### Step 6: Recommend and explain

Pick one; state which and why in one sentence. For each unpicked option, give one specific edit note: what would make it stronger.

### Step 7: Verify every line before handing back

Check each line of every option: leads with Why, names a concrete outcome, no banned word, no em dash or stand-in. Then check the option whole: it does not hand the brief's wording back (prompt echo), and every specific the user supplied appears rather than a stock default. New copy containing a banned word is not an option to present; rewrite it first.

---

## Mode B: Editing existing copy

Set the edit posture before running the workflow:

- **Point edit:** The user named one line, word, or section. Read enough surrounding copy to preserve context, change only the target plus the minimum connective tissue, and return the final wording. Do not turn a point edit into a page audit.
- **Restoration:** The copy already has a clear voice, angle, or opinion. Preserve its vocabulary level, relative emphasis, deliberate omissions, sentence shape, and positioning. Run the workflow to fix specific failures without rebalancing the argument or replacing its lead with a cleverer one.
- **Rebuild:** The copy is generic, contradictory, or has no discernible perspective. Run the full workflow with latitude to reconstruct it from the brief, but never invent proof.

```
Editing progress:
- [ ] Step 1: Read all copy-bearing files
- [ ] Step 2: Set the north star
- [ ] Step 3: Audit against persuasion frameworks
- [ ] Step 4: Remove AI writing patterns
- [ ] Step 5: Run seven sweeps
- [ ] Step 6: Flag weakest elements with labels
- [ ] Step 7: Rewrite flagged sections
- [ ] Step 8: Output before/after diff
```

### Step 1: Read all copy-bearing files

Scan every reader-facing surface: README headers, landing components, hero, CTAs, product descriptions, feature lists, onboarding strings, meta descriptions, email subjects. Read the voice file too if one exists (`VOICE.md`, `BRAND.md`, `docs/voice.md`); it settles the register and locale questions the audit would otherwise guess at, and it overrides the word lists for any word it names as a signature. Where the audit keeps turning on a voice question nobody has answered, load `references/voice-chart.md` and offer to settle it. Ask which files if unclear; never audit copy you haven't read in context.

### Step 2: Set the north star

Write one sentence before auditing: "[User] can now [do X] without [old pain]." Every flag and rewrite serves it. If you can't write it confidently, ask; the copy is unfixable until the value proposition is clear.

### Step 3: Audit against persuasion frameworks

Load `references/frameworks.md`. Check every major copy block against each framework, and carry forward only the highest-impact problems; Step 6 sets the flag budget.

### Step 4: Remove AI writing patterns

Load `references/word-lists.md` and `references/ai-patterns.md`. Flag each AI-ism with `[AI-ISM]` plus its pattern type:

- **Tier 1 words** (`word-lists.md`): always flag and replace.
- **Tier 2 clusters** (`word-lists.md`): flag when 2+ appear in one paragraph.
- **Structural patterns** (`ai-patterns.md`): formulaic openings, chatbot artefacts, "let's" transitions, engagement hooks, rhetorical-question openers, significance inflation, copula avoidance, em dashes as ordinary punctuation.
- **Drafting tells** (`ai-patterns.md` section 7): prompt echo, a supplied specific swapped for a generic default, uniform confidence. These survive a word-level pass, so check them separately.

Em dashes and their substitutes are Tier 1 tells in their own right; `ai-patterns.md` section 1 holds the rule and section 8 the P0/P1/P2 triage.

Skip for persuasion-only edits. If the user asked for AI pattern removal, run this first, before the sweeps.

### Step 5: Run seven sweeps

Load `references/sweeps.md`; run all seven in order. Each targets a distinct failure mode; don't skip any because copy "looks fine". Finish with the compound adjective hyphenation pass at the end of that file, and fix what it catches silently rather than flagging it.

### Step 6: Flag weakest elements

Attach a label inline to every weak line. Use exactly these labels:

| Label | Meaning |
|-------|---------|
| `[WHAT-NOT-WHY]` | Leads with product/feature, not user motivation |
| `[FEATURE-NOT-BENEFIT]` | Describes what the product has, not what changes for the user |
| `[TELL-NOT-SHOW]` | Adjective claim without proof ("powerful", "seamless", "easy") |
| `[VAGUE]` | Generic; could describe any product in the category |
| `[PASSIVE]` | Subject is acted upon instead of acting |
| `[VOICE-DRIFT]` | Breaks from the dominant voice of the surrounding copy (register, tense, or person) |
| `[PAIN-NOT-NAMED]` | States benefits without naming the frustration the reader arrived with |
| `[DEAD-WEIGHT]` | Adds nothing not already conveyed; safe to cut |
| `[JARGON]` | Technical term that obscures meaning for non-experts |
| `[NO-PROOF]` | Claim needing a number, example, or testimonial |
| `[WEAK-CTA]` | CTA describes the action, not the outcome |
| `[STATE-COPY]` | Vague, leaky, or dead-end state string (error, success, empty, loading, permission), or a destructive CTA labeled "Confirm"/"OK"/bare verb. Load `references/ui-states.md` before using this label; it holds the rule IDs `product-design` cites |
| `[AI-ISM]` | AI writing pattern: Tier 1 word, Tier 2 cluster, or structural tell |

Flag the 3-7 weakest elements, prioritised by impact on conversion or comprehension. Over-flagging is the failure mode here: a list of twenty issues dilutes into one nobody acts on.

### Step 7: Rewrite flagged sections

- Cut hard: a block that reads as already-tight usually isn't. Same meaning in half the words.
- Lead with Why (the user's problem or desire), not What (the product).
- Name the concrete outcome, not the capability.
- Replace adjectives with proof: "powerful analytics" becomes "see which pages kill signups".
- Make CTAs outcome-specific: "Start syncing" beats "Get started".
- Every sentence adds new information or gets cut.
- A CTA stays short; it is not the place to explain the feature.
- When replacing AI-isms, rewrite the sentence; don't swap the flagged word for a synonym.

### Step 8: Output before/after diff

```markdown
## Copy Audit: [file or component name]

**North star:** [one-sentence value prop]

---

### [Section name]

**Before:**
> [original text]

**Issues:** `[LABEL]`, `[LABEL]`

**After:**
> [rewritten text]

**Why:** [one sentence explaining the change]

---

### Summary
- N issues flagged across N sections
- Top pattern: [most common label]
- Confidence: [high / medium; note if copy context was limited]
```

Verify each "After" line before handing back: leads with Why, names a concrete outcome, no banned word, no em dash or stand-in, and every fact, number, and link from the "Before" still present. A rewrite that reintroduces an AI tell, or quietly drops a specific, is a regression. Then apply the leave-it-alone test: every change must fix a named failure from the audit. If it is merely different, restore the original.

---

## Banned words

The never-write set. Applies in both modes, so it lives here rather than behind a reference load:

> delve, leverage (verb), robust, seamless, holistic, paradigm, game-changing, cutting-edge, innovative, synergy, revolutionary, effortless, world-class, powerful, showcase, unlock

Also ban **"simple"** as a claim ("our simple onboarding"): never earned upfront, reads as an unkept promise.

A voice file that names one of these as a signature word is the only thing that overrides the list (Step 3). Absent that, treat it as absolute.

`references/word-lists.md` holds the wider tiered AI vocabulary with replacements; that list is for detection in Edit mode, not a second copy of this one.

---

## Gotchas

- State the brief before writing and mark what you inferred: copy written without a goal and value proposition reads well and solves the wrong problem.
- Read copy in context before judging; a vague-looking line may carry contrast with adjacent copy.
- `frameworks.md` lists unearned adjectives (powerful, seamless, robust) that also sit in the banned words and in `word-lists.md`. One occurrence is one flag; don't stack `[TELL-NOT-SHOW]` and `[AI-ISM]` on the same word.
- The personal voice lookup in Step 3 is opt-in and read-only. Reading `soul.md` does not make this the skill for personal messages, posts, or long-form; those stay with `ghostwriter`. Never copy its contents into a repo, a brief, or the output.
- Preserve the project's locale and brand voice; check existing copy before switching spelling or tone. A US-spelling rewrite on an en-AU product ships as a regression across every string it touches.

---

## Skill handoffs

| When | Run |
|------|-----|
| After rewriting technical documentation copy | `docs-writing` |
| To optimise meta descriptions and page titles | `optimise-seo` |
| To review the full UI including copy in context | `ui-design` (Audit mode) |
| Landing page visual design, CRO strategy, conversion benchmarks | `ui-design` (Direction mode, marketing track) |
| The product decision of which action exists and its scope and consequence | `product-design` |
| In-session assistant talk, recaps, or ELI5 | `eli5` |

Taste Training (blode.co/taste-training) trains the eye these rules encode, across type, copy, craft, interaction, and motion.
