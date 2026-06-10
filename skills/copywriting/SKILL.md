---
name: copywriting
description: Writes and edits short product and marketing copy using persuasion frameworks, and removes AI writing patterns. Writing mode gathers context, locks a brief, discovers brand voice, picks a framework, and outputs 2-3 alternatives. Editing mode audits against frameworks, strips AI-isms, runs seven sweeps, and outputs a before/after diff. Use when writing landing pages, hero copy, CTAs, product descriptions, onboarding strings, or email subjects. Also use for "this is a bad sell", "write copy for", "rewrite from first principles", "use Simon Sinek", "show don't tell", "make this shorter", "fix the copy", "write a headline", "improve the CTA", "edit existing copy", "remove AI-isms", "clean up AI writing", "make this sound less like AI", "flag AI patterns", or "scan for AI tells". For long-form articles use blog-post; for slide copy use presentation-creator; for API or product docs use docs-writing.
---

# Copywriting

- **IS:** short, conversion-bearing product and marketing copy (landing pages, hero, subheads, CTAs, product descriptions, onboarding strings, email subjects), plus stripping AI writing tells from any copy.
- **IS NOT:** long-form articles or posts (use `blog-post`), slide or deck copy (use `presentation-creator`), or API/product/reference documentation (use `docs-writing`).

Two modes. **Auto-detect, do not ask:**

- Copy already exists in the files or the user pasted copy to fix? Run **Mode B (Edit)**.
- No copy exists yet, or the user asks to write something new? Run **Mode A (Write)**.
- Genuinely ambiguous (e.g. "improve this" with no copy in scope)? Ask one question, then commit to a mode.

## Reference files

| File | Read when |
|------|-----------|
| `references/frameworks.md` | Picking a framework (Write Step 4) or auditing copy against the nine persuasion frameworks (Edit Step 3) |
| `references/page-types.md` | Choosing structure and copy norms for a known page type (Write Step 4) |
| `references/word-lists.md` | Flagging Tier 1/2/3 AI vocabulary (Edit Step 4) |
| `references/ai-patterns.md` | Flagging structural and sentence-level AI tells and triaging by P0/P1/P2 severity (Edit Step 4) |
| `references/sweeps.md` | Running the seven line-level sweeps (Edit Step 5) |

---

## Mode A: Writing new copy

```
Writing progress:
- [ ] Step 1: Gather context
- [ ] Step 2: Lock the brief (hard gate)
- [ ] Step 3: Discover brand voice
- [ ] Step 4: Choose framework and load references
- [ ] Step 5: Write 2-3 alternatives
- [ ] Step 6: Recommend and explain
```

### Step 1: Gather context

Ask these four questions before writing a single word. Do not proceed until all four are answered.

1. **Page purpose.** What is the one action this page must drive? (e.g. sign up, book a demo, download)
2. **Audience.** Who is the specific reader? Job title, pain, what they've already tried.
3. **Product.** What does this product do, and what is the concrete outcome for the user?
4. **Traffic source.** Where is the reader coming from? (cold ad, warm email, organic search, referral)

Traffic source determines temperature. Cold traffic needs more Why. Warm traffic can lead with How or What. Skip a question only if the answer is already unambiguous in the files; never invent an audience or a goal.

### Step 2: Lock the brief (hard gate)

Before writing, state the brief back to the user and get explicit confirmation:

```
Brief:
- Page: [page type]
- Goal: [single action]
- Reader: [specific audience]
- Core outcome: [what changes for the reader]
- Tone: [inferred from brand voice or user-stated]
- Traffic temperature: [cold / warm / hot]

Confirm this is correct before I write.
```

Do not write copy until the user confirms. If they push back on any point, update the brief and re-confirm.

### Step 3: Discover brand voice

Look for brand voice signals before inventing one:

- Read existing copy files, README headers, or marketing pages if accessible
- Ask: "Do you have brand guidelines, a tone-of-voice doc, or existing copy I should match?"
- If nothing exists, infer from the product and audience: B2B SaaS defaults to direct and confident, consumer apps can be warmer, developer tools lean terse and honest

Note the inferred voice in the brief. Never default to generic corporate warmth.

### Step 4: Choose framework and load references

Load `references/frameworks.md` and `references/page-types.md`.

Choose the primary framework for this copy based on the brief:

| Situation | Lead framework |
|-----------|---------------|
| Cold traffic, unfamiliar product | Why/How/What (Simon Sinek) |
| Feature-heavy product | Benefit Not Feature |
| High-trust audience, low awareness | Show Don't Tell |
| Transactional page, known intent | CTA Clarity |
| Long-form sales page | Problem → Agitate → Solution (PAS) |

You can layer frameworks. Why/How/What almost always applies to hero copy regardless of the primary choice.

### Step 5: Write 2-3 alternatives

Write exactly 2-3 distinct alternatives. Each must:

- Apply the chosen framework visibly
- Lead with Why, not What
- Use no banned words (see below)
- Include a headline, subhead, and at least one CTA per alternative
- Be structurally different, not the same idea with different adjectives

Label each: **Option A**, **Option B**, **Option C**.

### Step 6: Recommend and explain

Pick one option and state clearly which and why in one sentence. Give the user a specific edit note for each alternative they did not pick: what it would take to make it stronger.

---

## Mode B: Editing existing copy

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

Scan for all reader-facing text: README headers, landing page components, hero text, CTAs, product descriptions, feature lists, onboarding strings, meta descriptions, email subjects.

Ask which files to target if unclear. Never audit copy you haven't read in full context.

### Step 2: Set the north star

Write one sentence before auditing anything: "[User] can now [do X] without [old pain]."

Every flagged line and rewrite must serve this sentence. If you cannot write it confidently, ask the user; the copy will be unfixable until the value proposition is clear.

### Step 3: Audit against persuasion frameworks

Load `references/frameworks.md`. Check every major copy block against each framework. Mark candidates for flagging. Do not flag everything: identify the 3-7 highest-impact problems only.

### Step 4: Remove AI writing patterns

Load `references/word-lists.md` and `references/ai-patterns.md`.

Scan for AI-isms and flag each with `[AI-ISM]` plus the specific pattern type:
- **Tier 1 words** (from `word-lists.md`): always flag and replace (delve, leverage, robust, seamless, paradigm, holistic, and more)
- **Tier 2 clusters** (from `word-lists.md`): flag when 2+ appear in the same paragraph (harness, empower, streamline, elevate, and more)
- **Structural patterns** (from `ai-patterns.md`): formulaic openings, chatbot artefacts, "let's" transitions, significance inflation, copula avoidance, em dashes used as ordinary punctuation

The literal em dash (and its `--` substitute) is itself a Tier 1 AI tell. Cap it at 1 per 1,000 words, zero is better. See `ai-patterns.md` section 1 for the rule and `ai-patterns.md` section 7 for the P0/P1/P2 triage order when time is limited.

If the user asked for persuasion-only editing, skip this step. If the user asked specifically for AI pattern removal, run this step first, before the sweeps.

### Step 5: Run seven sweeps

Load `references/sweeps.md` and run all seven sweeps in order. Do not skip sweeps because the copy "looks fine": each sweep targets a distinct failure mode.

### Step 6: Flag weakest elements

Attach a label inline to every weak line. Use exactly these labels:

| Label | Meaning |
|-------|---------|
| `[WHAT-NOT-WHY]` | Leads with the product or feature, not the user's motivation |
| `[FEATURE-NOT-BENEFIT]` | Describes what the product has, not what changes for the user |
| `[TELL-NOT-SHOW]` | Adjective claim without proof ("powerful", "seamless", "easy") |
| `[VAGUE]` | Generic; could describe any product in this category |
| `[PASSIVE]` | Subject is acted upon instead of acting |
| `[DEAD-WEIGHT]` | Adds no information not already conveyed; safe to cut |
| `[JARGON]` | Technical term that obscures meaning for a non-expert reader |
| `[NO-PROOF]` | Claim that needs a number, example, or testimonial to be credible |
| `[WEAK-CTA]` | CTA describes the action, not the outcome |
| `[AI-ISM]` | AI writing pattern: Tier 1 word, Tier 2 cluster, or structural tell |

Flag the 3-7 weakest elements. Prioritise by impact on conversion or comprehension.

### Step 7: Rewrite flagged sections

Rewrite each flagged block:

- Lead with Why (the user's problem or desire), not What (the product)
- Name the concrete outcome, not the capability
- Replace adjectives with proof: instead of "powerful analytics", write "see which pages kill signups"
- Make CTAs outcome-specific: "Start syncing" beats "Get started"
- Every sentence must add new information or it gets cut
- Never lengthen a CTA in the name of clarity
- When replacing AI-isms, rewrite the sentence; don't just swap the flagged word for a synonym

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

Before handing the diff back, verify each "After" line yourself: it leads with Why, names a concrete outcome, carries no banned word, and contains no em dash used as ordinary punctuation. A diff that reintroduces an AI tell in the rewrite is a regression, not an edit.

---

## Banned words

Never write these. Flag them immediately in edit mode. Full replacement list in `references/word-lists.md`.

> delve, leverage (verb), robust, seamless, holistic, paradigm, game-changing, cutting-edge, innovative, synergy, revolutionary, effortless, world-class, powerful

Also ban **"simple"** used as a claim ("our simple onboarding"): never earned upfront, always reads as a promise not yet kept.

---

## Gotchas

- **Do not write before the brief is confirmed.** Skipping Step 2 produces copy that sounds good but serves the wrong goal.
- **Do not flag every line in edit mode.** Over-flagging dilutes attention and makes the audit useless. Cap it at 3-7 issues, prioritised by impact.
- **Do not audit copy you haven't read in context.** A vague-looking line may be intentional contrast with adjacent copy.
- **Do not impose locale changes.** Switching British to American spelling (or vice versa) when the project uses the other locale makes the rewrite look broken to the owner. Check existing copy first.
- **Do not lengthen CTAs.** "Sync your data across every device instantly" is worse than "Start syncing".
- **If the product name appears in the first hero sentence, it's almost always `[WHAT-NOT-WHY]`.**
- **"Simple", "easy", "powerful", and "seamless" are automatic `[TELL-NOT-SHOW]`:** they are never earned upfront.
- **An em dash in the rewrite re-fails the AI-ism check.** Demonstrated em dashes inside before/after examples are the subject being flagged and stay; em dashes you write as ordinary punctuation do not. Use a comma, colon, parentheses, or two sentences.
- **Do not generate copy with an unconfirmed value proposition.** If you cannot write the north star sentence, stop and ask.
- **CTAs often live in components, not markdown.** Ask the user where CTAs live if not obvious from the files.
- **Traffic temperature changes the entire strategy.** Cold traffic from a paid ad needs far more Why than warm traffic from a referral link. Ask if unsure.
- **Brand voice mismatch is the fastest way to make good copy feel wrong.** Always check for existing copy before inventing a tone.

---

## Skill handoffs

| When | Run |
|------|-----|
| After rewrite, audit prose quality | `docs-writing` |
| To optimise meta descriptions and page titles | `optimise-seo` |
| To review the full UI including copy in context | `ui-audit` |
| For landing page visual design, CRO strategy, and conversion benchmarks | `ui-design` (marketing track) |
