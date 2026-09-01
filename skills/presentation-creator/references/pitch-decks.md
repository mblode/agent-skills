# Pitch Decks

Investor pitch decks that work without a presenter: denser copy, an expected structure, optimised for a reader skimming on a laptop. The 10-slide frame is the common ground between Kawasaki's 10/20/30 rule, Sequoia's business-plan outline, and YC's seed deck guidance; the async copy rules are this skill's.

## Two pitch decks, not one

| Aspect | Sent deck (this file) | Presented deck (demo day, partner meeting) |
|--------|-----------------------|--------------------------------------------|
| Who reads it | An associate skimming at a desk, then forwarding it | A room, with you talking |
| Text density | Higher: every slide stands alone | Minimal: one idea, large type, you add the rest |
| Reading time | 30-60 sec per slide, studied | 3 sec per slide, glanced |
| Font floor | Legible at 50% zoom | 30pt body (Kawasaki), legible from the back row (YC) |
| Structure | The 10-slide frame, in order | The same frame, presented in 20 minutes or less |
| Copy rules | This file | `writing-slides.md`, with this frame as the outline |

Build the sent deck first. The presented version is a cut of it with the body text moved into the talk track.

## The 10-slide frame

Order is flexible where a slide is unusually strong (traction early when the numbers carry the story), fixed otherwise: readers expect it, and a Problem slide on page 7 reads as evasion.

### 1. Title
Company name, the company in one declarative sentence (Sequoia's "company purpose"), contact. Optional one-line traction hook.

### 2. Problem
Who feels the pain, why it is urgent, what they do about it today. Lead with a customer quote or a number.

### 3. Solution
Product in 30 seconds, as before and after, not a feature list. One screenshot at most.

### 4. Why now
What changed that makes this possible or necessary this year. Sequoia's question; a deck with no answer reads as a good idea anyone could have had five years ago.

### 5. Traction
Charts over text: revenue, users, growth rate, retention, logos. Put the number in the headline.

### 6. Market
Bottom-up TAM/SAM/SOM from customers times price, not a quoted "$1T market".

### 7. Business model
Revenue streams, pricing, unit economics (CAC, LTV, payback).

### 8. Competition
A landscape matrix or quadrant with your axis of differentiation. "No competition" reads as "no market".

### 9. Team
Names, roles, one line of relevant credential each. Why this team wins this market.

### 10. The ask
Amount, use of funds, the milestones it unlocks, next step.

```
**Raising:** $XM [Stage]
**Use of funds:**
- 50% Product
- 30% Go-to-market
- 20% Operations
**Unlocks:** [milestone] by [date]
**Next step:** 30-minute call
```

Financial projections and roadmap go in an appendix after the ask, clearly separated. Anything beyond 10 slides plus appendix is trimming, not adding.

## Writing for async reading

- Headlines are the complete claim: "1,000+ customers, $10M ARR", not "Traction". The forwardable test: does the headline alone make sense to someone who received this with no context?
- 2-3 bullets per section, each a complete thought. Bold the key phrase, explain after.
- Charts over tables over bullets over paragraphs.
- Metrics as text on the slide, not baked into an image: search, screen readers, and the associate's copy-paste all read text. Define acronyms on first use; slide titles match the expected categories so a skimmer finds Traction where they look for it.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| No clear ask | Explicit slide with amount, use, milestones, next step |
| Features over benefits | Lead with the outcome for the customer |
| TAM fantasy | Bottom-up calculation from customers times price |
| No traction proof | Chart, logos, or testimonials; a number in the headline |
| Too many slides | The 10-slide frame; everything else in a separated appendix |
| Presented-deck copy in a sent deck | Every headline passes the forwardable test |

## Format guidelines

- **PDF for sending:** under 10MB, named `Company - Stage Deck - Month Year.pdf`. Marp to PDF (`output-formats.md`), or the external `pptx` skill when the recipient expects PowerPoint
- **16:9**, high contrast, readable at 50% zoom
- Same colour systems and contrast thresholds as presented decks (`visual-design.md`); a sent deck is read on a laptop in daylight, so the paper or near-black pairs suit it better than pure black
