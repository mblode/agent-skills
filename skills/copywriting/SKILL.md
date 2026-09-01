---
name: copywriting
description: >-
  Writes and edits short product and marketing copy, including landing pages,
  CTAs, onboarding strings, product descriptions, email subjects, UI state
  copy (errors, empty states, button labels), brand voice charts, and AI-ism
  cleanup. Use when asked to "write copy", "fix the copy", "make this
  shorter", "improve the CTA", "write the error message", "empty state copy",
  "name this button", "rewrite from first principles", "remove AI-isms",
  "clean up AI writing", "flag AI patterns", "define our tone of voice", or
  "write a voice guide". For blog posts use the external ghostwriter skill
  with platform blog; for slide copy use presentation-creator; for docs use
  docs-writing; for in-session assistant talk use eli5; for product behavior
  decisions use product-design.
---

# Copywriting

- **IS:** short conversion copy (landing pages, hero, subheads, CTAs, product descriptions, onboarding strings, email subjects); product-state strings (destructive CTAs, error, success, empty, loading, permission copy); stripping AI writing tells from any copy.
- **IS NOT:** long-form articles, posts, or anything written as a person rather than a brand (use the external `ghostwriter` skill with platform `blog`), slide or deck copy (use `presentation-creator`), API/product/reference docs (use `docs-writing`), in-session assistant talk (use `eli5`), or deciding which action exists, its scope, consequence, reversibility, or reachable states (use `product-design`; this skill writes final wording once those are decided).

Two modes, auto-detected:

- Copy exists or the user pasted copy to fix: **Mode B (Edit)**.
- Nothing written yet, or the user wants something new: **Mode A (Write)**.
- Genuinely ambiguous ("improve this", no copy in scope): ask one question, then commit.

## Reference files

| File | Read when |
|------|-----------|
| `references/frameworks.md` | Pick a framework by awareness stage (Write Step 4); audit against the frameworks (Edit Step 3) |
| `references/page-types.md` | Copy norms for a homepage, landing, pricing, feature, or about page (Write Step 4) |
| `references/word-lists.md` | Flag Tier 1/2/3 AI vocabulary (Edit Step 4) |
| `references/ai-patterns.md` | Flag structural, sentence-level, and drafting AI tells; P0/P1/P2 triage (Edit Step 4) |
| `references/sweeps.md` | Run the seven line-level sweeps, then the hyphenation pass (Edit Step 5) |
| `references/ui-states.md` | The copy is a product state or action label, not marketing (Write Step 4; Edit Step 6 before using `[STATE-COPY]`) |
| `references/voice-chart.md` | No usable voice file exists and the product needs one (Write Step 3; Edit Step 1); also holds the tone-by-reader-state table |
| `evals/evals.json` | Only when changing this skill: behavioural scenarios with assertions plus should-trigger and near-miss routing prompts. Never loads during a user task |

## Banned words

The never-write set. Applies in both modes and to every line you hand back:

> delve, leverage (verb), robust, seamless, holistic, paradigm, game-changing, cutting-edge, innovative, synergy, revolutionary, effortless, world-class, powerful, showcase, unlock

Also ban **"simple"** as a claim ("our simple onboarding"): never earned upfront, reads as an unkept promise.

Em dashes count as a banned word: none in headings or body, and no `--` or spaced hyphen standing in for one. Use a comma, colon, full stop, or parentheses.

A voice file that names one of these as a signature word is the only thing that overrides the list (Write Step 3). `references/word-lists.md` holds the wider tiered vocabulary with replacements; that list is for detection in Edit mode, not a second copy of this one.

---

## Mode A: Writing new copy

```
Writing progress:
- [ ] Step 1: Gather context
- [ ] Step 2: State the brief, then write
- [ ] Step 3: Discover brand voice
- [ ] Step 4: Route by copy type, choose framework
- [ ] Step 5: Write 2-3 alternatives
- [ ] Step 6: Recommend and explain
- [ ] Step 7: Check every option against the brief
```

### Step 1: Gather context

Settle four things, from the user or from the files. Where the files do not settle one, infer it and name the inference in Step 2; the failure mode is an invented audience or goal presented as fact.

1. **Page purpose.** The one action this page drives (sign up, book a demo, download).
2. **Audience.** The specific reader: job title, pain, what they've already tried.
3. **Product.** What it does; the concrete user outcome.
4. **Traffic source.** Where the reader comes from (cold ad, warm email, organic search, referral, inside the product).

Traffic source sets the reader's awareness stage (`references/frameworks.md`): cold readers need the problem named before the product; warm readers already know the problem and want the mechanism or proof.

### Step 2: State the brief, then write

State the brief and keep going. Mark every field you inferred rather than were told, so the user corrects it against real copy instead of against a question:

```
Brief:
- Page: [page type]
- Goal: [single action]
- Reader: [specific audience]
- Core outcome: [what changes for the reader]
- Tone: [inferred from brand voice or user-stated]
- Awareness: [unaware / problem-aware / solution-aware / product-aware / most-aware]

Inferred (correct me): [fields you guessed]
```

Stop and ask before writing only when a wrong guess makes the work useless or unsafe: the copy ships in this turn with no review, or the goal is genuinely unknown and each candidate goal produces different copy.

### Step 3: Discover brand voice

Find voice signals before inventing one. Work down this order and stop at the first hit:

1. **A voice file in the repo:** `VOICE.md`, `BRAND.md`, `docs/voice.md`, or a tone-of-voice doc. Authoritative when it exists.
2. **The user's own voice, on request only.** When the user asks for their voice ("in my voice", "sound like me") and the brand is theirs, read `$GHOSTWRITER_HOME/soul.md`, falling back to `~/.config/ghostwriter/soul.md`. A personal voice belongs only to the person's own brand, and the file's contents stay out of the output, the brief, and the repo.
3. **Existing copy:** copy files, README headers, or shipped marketing pages.
4. **Inference:** B2B SaaS direct and confident, consumer apps warmer, developer tools terse and honest. Ask for brand guidelines alongside the draft, not instead of it.

A discovered voice outranks the word lists: a listed word the voice file or shipped copy uses as a signature stays. Locale and spelling convention come from the voice too. Note in the brief which source you used, and mark the voice as inferred when it came from step 4. When no voice file exists and the product will need one, load `references/voice-chart.md` and offer to write `VOICE.md` alongside the copy.

Voice is constant; tone adapts to the reader's state (frustrated, confused, confident, cautious, successful). The table in `references/voice-chart.md` sets the expected shifts; copy that keeps one register across all five reads as robotic in the good moments and cold in the bad ones.

### Step 4: Route by copy type, choose framework

- **Product-state copy** (error, empty, success, loading, permission) or an action label: load `references/ui-states.md` and stop here. Persuasion frameworks do not apply to a button that deletes something.
- **Marketing copy:** load `references/frameworks.md`, plus `references/page-types.md` when the target is a homepage, landing, pricing, feature, or about page.

Choose the lead framework from the brief's awareness stage:

| Reader | Lead framework |
|--------|---------------|
| Unaware or problem-aware, cold traffic | Why/How/What, or PAS when the pain is sharp |
| Solution-aware, comparing options | Benefit Not Feature, backed by Show Don't Tell |
| Product-aware, low trust | Show Don't Tell, proof-led |
| Most-aware, transactional page | CTA Clarity |
| Long-form sales page, any stage | PAS or BAB as the spine, others layered inside |

Layer frameworks freely. Hero copy almost always opens with Why (the reader's motivation), whatever else it uses.

### Step 5: Write 2-3 alternatives

Label them **Option A**, **Option B**, **Option C**. Three for a page, hero, or campaign; two for a single string like a CTA or subject line, where a third is padding. One is not a choice, and four is a survey. Each option applies the chosen framework visibly, includes a headline, subhead, and at least one CTA, and is structurally different from the others, not the same idea with new adjectives.

### Step 6: Recommend and explain

Pick one; state which and why in one sentence. For each unpicked option, give one specific edit note.

### Step 7: Check every option against the brief

Two tells survive a good draft and only show up when you hold the option against the brief: **prompt echo** (the headline hands the brief's own wording back) and **generic default** (a number, name, price, or integration the user supplied has become "thousands of teams" or "your favourite tools"). Fix both before handing back, along with any banned word. An option containing a banned word is not an option to present.

---

## Mode B: Editing existing copy

Set the edit posture before running the workflow:

- **Point edit:** The user named one line, word, or section. Read enough surrounding copy to preserve context, change only the target plus the minimum connective tissue, and return the final wording. A point edit does not become a page audit.
- **Restoration:** The copy already has a clear voice, angle, or opinion. Preserve its vocabulary level, relative emphasis, deliberate omissions, sentence shape, and positioning. Fix specific failures without rebalancing the argument or replacing its lead with a cleverer one.
- **Rebuild:** The copy is generic, contradictory, or has no discernible perspective. Run the full workflow with latitude to reconstruct it from the brief, and invent no proof.

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

Scan every reader-facing surface: README headers, landing components, hero, CTAs, product descriptions, feature lists, onboarding strings, meta descriptions, email subjects. Read the voice file too if one exists (`VOICE.md`, `BRAND.md`, `docs/voice.md`); it settles register and locale, and it overrides the word lists for any word it names as a signature. Where the audit keeps turning on a voice question nobody has answered, load `references/voice-chart.md` and offer to settle it. Ask which files if unclear; judge copy only in the context you have read it in.

### Step 2: Set the north star

Write one sentence before auditing: "[User] can now [do X] without [old pain]." Every flag and rewrite serves it. If you can't write it confidently, ask; the copy is unfixable until the value proposition is clear.

### Step 3: Audit against persuasion frameworks

Load `references/frameworks.md`. Check every major copy block against each framework and carry forward only the highest-impact problems; Step 6 sets the flag budget.

### Step 4: Remove AI writing patterns

Load `references/word-lists.md` and `references/ai-patterns.md`. Flag each AI-ism with `[AI-ISM]` plus its pattern type:

- **Tier 1 words** (`word-lists.md`): always flag and replace.
- **Tier 2 clusters** (`word-lists.md`): flag when 2+ appear in one paragraph.
- **Structural patterns** (`ai-patterns.md`): formulaic openings, chatbot artefacts, "let's" transitions, engagement hooks, rhetorical-question openers, negative parallelisms, participle tails, significance inflation, copula avoidance, em dashes as ordinary punctuation.
- **Drafting tells** (`ai-patterns.md` section 7): prompt echo, a supplied specific swapped for a generic default, uniform confidence. These survive a word-level pass, so check them separately.

Skip for persuasion-only edits. If the user asked for AI pattern removal, run this first, before the sweeps.

### Step 5: Run seven sweeps

Load `references/sweeps.md`; run all seven in order, each targeting a distinct failure mode. Finish with the compound adjective hyphenation pass at the end of that file, fixing what it catches silently rather than flagging it.

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

Flag the 3-7 weakest elements, prioritised by impact on conversion or comprehension. A list of twenty issues dilutes into one nobody acts on.

### Step 7: Rewrite flagged sections

- Cut hard: a block that reads as already-tight usually isn't. Same meaning in half the words.
- Lead with Why (the user's problem or desire), not What (the product).
- Name the concrete outcome, not the capability. Replace adjectives with proof: "powerful analytics" becomes "see which pages kill signups".
- Make CTAs outcome-specific and short: "Start syncing" beats "Get started"; the feature explanation lives above the button, not in it.
- When replacing an AI-ism, rewrite the sentence; a synonym swap moves the tell one tier down.

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

Every "After" line keeps every fact, number, and link from its "Before", and every change fixes a named failure from the audit. A rewrite that is merely different is a regression: restore the original.

---

## Gotchas

- "Get started" and "Learn more" attract clicks and mislead: NN/g found readers who wanted pricing or basic information landing in signup flows and losing trust. Name the destination or outcome ("See pricing", "Start a 14-day trial") instead.
- The Tier 1 list dates fast. "delve" and "tapestry" were 2023-2024 tells and have largely gone; current output leans on "enhance", "highlighting", "showcasing", "align with", and participle tails ("...ensuring a smooth experience"). A pass that only greps the word table passes copy that still reads as generated; run the structural section of `ai-patterns.md` every time.
- Swapping a flagged word for its neighbour in the same table ("leverage" to "harness", "robust" to "comprehensive") reintroduces the tell one tier down and reads as edited-by-machine. Rewrite the sentence around the specific instead.
- `frameworks.md` lists unearned adjectives (powerful, seamless, robust) that also sit in the banned words and in `word-lists.md`. One occurrence is one flag; stacking `[TELL-NOT-SHOW]` and `[AI-ISM]` on the same word inflates the count and hides the real problems.
- A destructive dialog labeled "Confirm", "OK", or "Yes" forces the user to reconstruct the consequence from body text they skipped; `product-design` will cite `rule/no-confirm-ok-labels` back at you. Verb plus object ("Delete project") every time; the bare-verb exemption covers only Save, Cancel, and Close.
- Template variables hide the hyphenation rule: `{{days}} day trial` ships as "7 day trial" on every plan. The hyphen goes between the variable and the unit (`{{days}}-day trial`), and never onto a standalone noun phrase ("expires in {{days}} days").
- A US-spelling rewrite on an en-AU product ships as a regression across every string it touches. Read three existing strings for locale before changing one.
- The personal voice lookup in Step 3 is opt-in and read-only. Reading `soul.md` does not make this the skill for personal messages, posts, or long-form; those stay with `ghostwriter`.

---

## Skill handoffs

| When | Run |
|------|-----|
| After rewriting technical documentation copy | `docs-writing` |
| To optimise meta descriptions and page titles | `optimise-seo` |
| To review the full UI including copy in context | `ui-design` (Audit mode) |
| Landing page visual design, CRO strategy, conversion benchmarks | `ui-design` (Direction mode, marketing track) |
| The product decision of which action exists and its scope and consequence | `product-design` |
| Casing of headings and labels (sentence case versus title case) | `typography-audit` (`punct-case-rules`) |
| In-session assistant talk, recaps, or ELI5 | `eli5` |

