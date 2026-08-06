---
name: presentation-creator
description: Creates bold, minimal presentations built on a story spine, with punchy slide copy, high-contrast visual design (full-bleed palettes or dark with section accents), and conversational speaker notes. Covers live talks, async/recorded decks, 10-slide investor pitch decks, and decks built as a web app with a route per slide and live demos. Use when creating a presentation, structuring a deck, writing slides, building a pitch deck for investors, fixing a deck that has no narrative, or asking "outline a presentation about...", "write slides for...", "design a deck for...", "turn this doc into a deck", "my talk has no story", or "build this deck as a website". For long-form articles use the external ghostwriter skill with platform blog; for marketing copy outside slides use copywriting; for product UI design systems use ui-design.
---

# Presentation Creator

Bold, minimal slide decks with a story underneath: spine to final QA.

- **IS:** slide decks end to end: story spine, narrative structure, slide copy, visual design, speaker notes, investor pitch decks, and decks built as a web app.
- **IS NOT:** long-form prose (use the external `ghostwriter` skill with platform `blog`), marketing copy outside slides (use `copywriting`), or general visual systems for product UI (use `ui-design`).

## Workflow

Track this checklist:

```text
Presentation progress:
- [ ] Step 1: Gather context (audience, setting, format, output)
- [ ] Step 2: Write the story spine and the ending (references/story-structure.md)
- [ ] Step 3: Outline the slide sequence (references/outline-structure.md)
- [ ] Step 4: Write slide copy (references/writing-slides.md; pitch decks: references/pitch-decks.md instead)
- [ ] Step 5: Design visual layout and composition (references/visual-design.md)
- [ ] Step 6: Write speaker notes (references/speaker-notes.md); skip for pitch decks
- [ ] Step 7: QA pass, output the slide-by-slide review table
```

### Step 1: Gather context

Establish four things (ask if not provided):

- **Audience:** internal (shared context, be direct) vs. external (build credibility, define terms)
- **Setting:** live talk, recorded/async, or standalone investor pitch
- **The three messages:** what the audience must remember after the deck
- **The output:** a markdown outline to hand to a deck tool, a deck built as a web app, or slides in an existing template. Ask before Step 5, because the visual step is where it starts to matter

Route by format:

- **Live talk or internal/recorded deck** → Steps 2-7 in order.
- **Investor pitch deck** (read without a presenter) → read [references/pitch-decks.md](references/pitch-decks.md) first. Its 10-slide framework replaces Step 3's outline, and its async copy rules (denser, standalone headlines, 2-3 bullets per section) replace `writing-slides.md` for Step 4: do not load `writing-slides.md` on this path, its presented-deck copy limits contradict it. Step 2 still applies, in a compressed form: an investor is an audience too, and the spine is what stops a pitch reading as a feature list. Skip Step 6 (no presenter); Steps 5 and 7 still apply.

### Steps 2-6: Build the deck

Read each step's reference when you reach it:

| Step | Reference | Covers |
|------|-----------|--------|
| 2. Story | [references/story-structure.md](references/story-structure.md) | The spine template, writing the ending first, taking a position, stakes, the unstick move |
| 3. Outline | [references/outline-structure.md](references/outline-structure.md) | Narrative flow, 12 slide types, section colors, outline output format |
| 4. Write | [references/writing-slides.md](references/writing-slides.md), replaced by [references/pitch-decks.md](references/pitch-decks.md) on the pitch path | Headline patterns, body text rules, copy per slide type, before/after examples |
| 5. Design | [references/visual-design.md](references/visual-design.md) | Two colour systems, fluid type scale, layout patterns, slide-type → layout mapping |
| 6. Notes | [references/speaker-notes.md](references/speaker-notes.md) | Per-slide note structure, delivery cues, notes by slide type |

Building the deck as a web app rather than exporting from a deck tool: [references/web-deck.md](references/web-deck.md) covers the route-per-slide structure, navigation, layout primitives, motion, and live demos. Read it at Step 5, after the copy exists, never before Step 3.

### Step 7: QA pass (produces evidence)

Review every slide and output a table. This is the deliverable that proves the deck is done, not a "looks good" sign-off:

```markdown
| # | Slide | 3-sec test | One message | Spine beat | Layout | Color |
|---|-------|-----------|-------------|------------|--------|-------|
| 1 | Title | pass | pass | once upon a time | full statement | teal |
```

- **3-sec test:** parseable in 3 seconds at arm's length? Cut copy on any failure until it passes.
- **One message:** exactly one idea per slide; split slides carrying two.
- **Spine beat:** which beat of the Step 2 spine this slide serves. A slide serving none is a fact you found interesting; cut it.
- **Layout:** no more than 2 consecutive slides with the same layout.
- **Color:** the section accent, or the full-bleed palette, matching what Step 5 assigned.

Deck-level checks below the table:

- Every spine beat has at least one slide, and the ending matches the one written first
- The deck states a position a reasonable person could disagree with
- One colour system throughout: accents per section, or full-bleed palettes, never both
- Recap slide has exactly one line per core section
- Pitch decks only: ≤15 slides, explicit ask slide (amount + use of funds), headlines pass the forwardable test (make sense with zero context)

Fix every flagged row and re-output the table before handing over.

## Core principles

- **Story before slides:** the spine decides which slides exist. Write the ending first
- **Take a position:** a deck nobody could disagree with has not said anything
- **Headlines do the work:** bold statements, not topic labels:
  ```
  Before: "An Overview of Our Q3 Performance Metrics and Results"
  After:  "Q3: Revenue Up 40%. Here's How."
  ```
- **Impact through scale, not weight:** large light type beats small bold type
- **One colour system, held for the whole deck:** full-bleed palettes where a palette owns the entire slide, or dark with one accent per section. Either creates the rhythm the audience tracks position by
- **Demo it live where you can:** a working demo, not a screenshot of one

## Gotchas

- **A deck with no opinion:** surveying the landscape feels safe to write and gives the room nothing to hold. If nobody could disagree, there is no talk yet.
- **Paragraphs on slides:** the audience reads instead of listening and the speaker becomes redundant. Fail the 3-second arm's-length test, cut copy until it passes.
- **Accents outside the section system:** section colors are wayfinding; a random mid-section accent reads as a topic change that never happened. One color per major section, teal reused for opening and closing.
- **Accent thinking on a full-bleed deck:** adding a highlight colour to a slide whose palette already owns the screen. On that system the slide is the accent; the colour changes at the slide boundary, not inside it.
- **Fixed pixel type:** a deck sized for the presenter's laptop is a different deck on the projector and unreadable on the phone it gets forwarded to. Size in `clamp()`.
- **A screenshot where a live demo would land:** if the deck is a web app and the thing runs, run it. A screenshot of a working demo is the weaker version of both.
- **Speaker notes as a script:** a verbatim script gets read aloud and sounds flat. Notes are scannable prompts: key point, talk-track bullets, transition line.
- **Same layout on every slide:** uniform layouts flatten rhythm; the audience stops registering new slides. Alternate full-statement, split, and data layouts per visual-design.md.
- **Skipping the spine:** jumping straight to slides produces a list of facts with no arc, then a rewrite once the missing narrative shows. Spine and ending first, then the outline.
- **Building the deck app before the story exists:** the primitives get designed around slide 3 and fight every slide after it.
- **Sparse headlines on pitch decks:** "Traction" tells a skimming investor nothing. Write the complete claim: "1,000+ Customers, $10M ARR". Pitch decks are read, not presented.
- **Presented-deck density on a pitch deck:** a 3-words-per-slide deck forwarded with no presenter is unreadable. Route to pitch-decks.md in Step 1, not after the deck is built.

## Related skills

- Optional external `ghostwriter` where installed: long-form articles and tutorials from the `blog` platform profile; use when the output is prose, not slides
- `copywriting`: landing pages, CTAs, marketing copy outside a deck
- `ui-design`: visual systems for product UI and landing pages; presentation visual rules live in references/visual-design.md instead
- Taste Training (blode.co/taste-training): trains the eye these rules encode, across type, copy, craft, interaction, and motion
