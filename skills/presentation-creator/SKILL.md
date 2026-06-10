---
name: presentation-creator
description: Creates bold, minimal, dark-first presentations with structured narrative arcs, punchy slide copy, high-contrast visual design, and conversational speaker notes. Covers live talks, async/recorded decks, and 10-slide investor pitch decks. Use when creating a presentation, structuring a deck, writing slides, building a pitch deck for investors, or asking "outline a presentation about...", "write slides for...", "design a deck for...", or "turn this doc into a deck". For long-form articles use blog-post; for marketing copy outside slides use copywriting; for product UI design systems use ui-design.
---

# Presentation Creator

Bold, minimal, dark-first slide decks, from narrative arc to final QA.

- **IS:** slide decks end to end: narrative structure, slide copy, visual design, speaker notes, and investor pitch decks.
- **IS NOT:** long-form prose (use `blog-post`), marketing copy outside slides (use `copywriting`), or general visual systems for product UI (use `ui-design`).

## Workflow

Copy and track this checklist:

```text
Presentation progress:
- [ ] Step 1: Gather context (audience, setting, format: live / async / pitch)
- [ ] Step 2: Outline narrative arc and slide sequence (references/outline-structure.md)
- [ ] Step 3: Write slide copy (references/writing-slides.md)
- [ ] Step 4: Design visual layout and composition (references/visual-design.md)
- [ ] Step 5: Write speaker notes (references/speaker-notes.md); skip for pitch decks
- [ ] Step 6: QA pass, output the slide-by-slide review table
```

### Step 1: Gather context

Before outlining, establish three things (ask if not provided):

- **Audience:** internal (shared context, be direct) vs. external (build credibility, define terms)
- **Setting:** live talk, recorded/async, or standalone investor pitch
- **The three messages:** what must the audience remember when the deck is over

Then route by format:

- **Live talk or internal/recorded deck** → Steps 2-6 in order.
- **Investor pitch deck** (read without a presenter) → read [references/pitch-decks.md](references/pitch-decks.md) first. Use its 10-slide framework for Step 2 and its async copy rules (denser, standalone headlines) for Step 3. Skip Step 5; there is no presenter. Steps 4 and 6 still apply.

### Steps 2-5: Build the deck

Each step has a dedicated reference; read it when you reach the step:

| Step | Reference | Covers |
|------|-----------|--------|
| 2. Outline | [references/outline-structure.md](references/outline-structure.md) | Narrative flow, 12 slide types, section colors, outline output format |
| 3. Write | [references/writing-slides.md](references/writing-slides.md) | Headline patterns, body text rules, per-type slide templates, before/after examples |
| 4. Design | [references/visual-design.md](references/visual-design.md) | Typography scale, layout patterns, slide-type → layout mapping, visual elements |
| 5. Notes | [references/speaker-notes.md](references/speaker-notes.md) | Per-slide note structure, delivery cues, notes by slide type |

### Step 6: QA pass (produces evidence)

Review every slide and output the results as a table. This is the deliverable that proves the deck is done, not a "looks good" sign-off:

```markdown
| # | Slide | 3-sec test | One message | Layout | Section color |
|---|-------|-----------|-------------|--------|---------------|
| 1 | Title | pass | pass | full statement | teal |
```

- **3-sec test:** can the slide be parsed in 3 seconds at arm's length? Flag any failure and cut copy until it passes.
- **One message:** exactly one idea per slide; split slides that carry two.
- **Layout:** no more than 2 consecutive slides with the same layout.
- **Section color:** matches the section assigned in the outline; no stray accents.

Deck-level checks below the table:

- Accent color count equals section count (teal reused for opening/closing)
- Recap slide has exactly one line per core section
- Pitch decks only: ≤15 slides, explicit ask slide with amount and use of funds, headlines pass the forwardable test (make sense with zero context)

Fix every flagged row and re-output the table before handing the deck over.

## Core principles

- **Dark-first, high contrast:** black/zinc-900 backgrounds, white text, section-colored accents
- **Headlines do the work:** bold statements, not topic labels:
  ```
  Before: "An Overview of Our Q3 Performance Metrics and Results"
  After:  "Q3: Revenue Up 40%. Here's How."
  ```
- **Impact through scale, not weight:** large light type beats small bold type
- **Section colors create rhythm:** one accent per major section so the audience can track position

## Gotchas

- **Paragraphs on slides:** the audience reads instead of listening, and the speaker becomes redundant. If a slide fails the 3-second arm's-length test, cut copy until it passes.
- **Accents outside the section system:** section colors are wayfinding; a random accent mid-section reads as a topic change that never happened. One color per major section, teal reused for opening and closing.
- **Speaker notes as a script:** a verbatim script gets read aloud and sounds flat. Notes are scannable prompts: key point, talk-track bullets, transition line.
- **Same layout on every slide:** uniform layouts flatten the rhythm and the audience stops registering new slides. Alternate full-statement, split, and data layouts per the mapping in visual-design.md.
- **Skipping the outline:** jumping straight to slides produces a list of facts with no arc, and the deck gets rewritten once the missing narrative shows. Always lock the three key messages first.
- **Sparse headlines on pitch decks:** "Traction" as a headline tells a skimming investor nothing. Write the complete claim: "1,000+ Customers, $10M ARR". Pitch decks are read, not presented.
- **Using presented-deck density for a pitch deck:** a 3-words-per-slide deck forwarded to an investor with no presenter is unreadable. Route to pitch-decks.md in Step 1, not after the deck is built.

## Related skills

- `blog-post`: long-form articles and tutorials; use it when the output is prose, not slides
- `copywriting`: landing pages, CTAs, marketing copy outside a deck
- `ui-design`: visual systems for product UI and landing pages; presentation visual rules live in references/visual-design.md instead
