# Web Deck

Building the deck as a web app instead of exporting it from a deck tool. Written for Next.js App Router; the structure transfers to any router.

The reason to do it: the deck can run the thing it is about. Everything else here is in service of that.

## Contents

- [When a web deck is worth it](#when-a-web-deck-is-worth-it)
- [One array as the source of truth](#one-array-as-the-source-of-truth)
- [A route per slide](#a-route-per-slide)
- [Navigation](#navigation)
- [Primitives, not bespoke markup](#primitives-not-bespoke-markup)
- [Motion](#motion)
- [Live demos](#live-demos)
- [Sharing and metadata](#sharing-and-metadata)
- [Gotchas](#gotchas)

## When a web deck is worth it

Worth it when at least one is true:

- Something in the deck should be interactive: a working demo, a playground, a live query
- The deck is a permanent artefact with a URL, not a file emailed once
- The design is specific enough that a template fights you

Not worth it for an internal update, a deck someone else has to edit, or anything due tomorrow. A deck tool is faster and the audience cannot tell.

## One array as the source of truth

Slide order, titles, and palettes live in one place. Everything else derives from it: the route params, the counter, the outline page, the metadata.

```ts
export const SLIDES = [
  { slug: "intro", title: "Care made easy", palette: "e" },
  { slug: "thesis", title: "The bottleneck has changed", palette: "e" },
  { slug: "sync-demo", title: "Apps that just work", palette: "stratasync" },
] as const satisfies readonly { slug: string; title: string; palette: Palette }[];

export const TOTAL_SLIDES = SLIDES.length;
```

`as const satisfies` is the part that pays: the palette on every slide is checked against the union of defined palettes, so a typo is a build error rather than an unstyled slide discovered on stage.

## A route per slide

`/7` opens slide 7. That is worth more than it sounds: you can link a colleague to the one slide you want reviewed, restart mid-talk without arrowing through 20 slides, and let the browser back button behave.

```tsx
export function generateStaticParams() {
  return SLIDES.map((_, i) => ({ slide: String(i + 1) }));
}

export default async function SlidePage({ params }: { params: Promise<{ slide: string }> }) {
  const slideNum = Number.parseInt((await params).slide, 10);
  if (Number.isNaN(slideNum) || slideNum < 1 || slideNum > TOTAL_SLIDES) notFound();

  const SlideContent = slideComponents[slideNum - 1];
  return (
    <SlideNavigation currentSlide={slideNum} palette={SLIDES[slideNum - 1].palette} totalSlides={TOTAL_SLIDES}>
      <SlideContent />
    </SlideNavigation>
  );
}
```

Statically generate all of them. A slide that compiles on demand is a black screen in front of a room.

## Navigation

Arrow keys, plus a visible control for touch. Route with `scroll: false` so the browser does not jump on transition.

```tsx
useHotkeys("right", goNext, { preventDefault: true }, [goNext]);
useHotkeys("left", goPrev, { preventDefault: true }, [goPrev]);
```

Make the counter accessible: it is the only thing telling a screen reader the position changed.

```tsx
<span aria-live="polite" className="tabular-nums">
  <span className="sr-only">Slide </span>
  {currentSlide}
  <span className="sr-only"> of </span>
  <span aria-hidden="true"> / </span>
  {totalSlides}
</span>
```

`tabular-nums` stops the counter jittering as the number changes width. Disable the prev and next buttons at the ends rather than wrapping around; wrapping past the last slide during Q&A is worse than a dead key.

## Primitives, not bespoke markup

Twenty hand-built slides drift by slide six. A handful of primitives keeps them one deck:

| Primitive | Job |
|-----------|-----|
| `Stage` | Full-bleed surface, sets `data-palette`, owns `min-h-dvh` |
| `Display` | The headline. One per slide, sized by a named step |
| `Split` | Two columns at a named ratio, optional hairline |
| `Block` | Bordered region, replaces the UI kit's Card on a slide |
| `Mark` | Pill label for a category or product name |
| `Numeral` | Oversized zero-padded number as marginalia |
| `KineticList` | Staggers its children on enter |

Each takes an enum, not a className: `ratio="60/40"`, `size="display"`, `tone="outline"`. The enum is what stops slide 14 from being 63/37.

Use `min-h-dvh` rather than `h-screen`. Mobile browser chrome makes `100vh` wrong on the device most people will forward the deck to.

## Motion

Three effects, no more. Enter animations only, since there is no exit worth watching.

- **Headline settle**: on a variable typeface, animate weight and tracking from light and loose to heavy and tight over the first few hundred milliseconds. The one motion effect that reads as craft.
- **Staggered rise**: list items fade up on a per-index delay, `calc(var(--stagger-i) * 50ms + 80ms)`. Set the index as a CSS variable rather than an inline delay so the stagger is data, not markup.
- **Nothing else.** No slide transitions, no parallax.

Honour `prefers-reduced-motion` by collapsing durations and delays rather than removing the animation:

```css
@media (prefers-reduced-motion: reduce) {
  .honk-display, .honk-stagger > * {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

## Live demos

The whole reason for the format. A working sync demo, not a screenshot of one. A typeface playground the audience watches you drag. An inspector that reads styles off the slide it is sitting on.

Rules that keep a demo from eating the talk:

- **It runs offline.** In-memory transport, seeded data, no network. Conference wifi is the single most common way a demo dies.
- **It resets on mount.** You will show it twice.
- **It survives being poked.** Someone will click it during Q&A.
- **It is one interaction.** A demo needing three steps of setup is a video.

If any of those fails, ship a recording on the slide instead. A recording that plays beats a demo that hangs.

## Sharing and metadata

Every slide gets an OG image so any single slide is forwardable. Generate them from the slide title rather than hand-designing 20 images.

Keep the deck one indexable document: canonical every slide route to the deck root and set `robots: { index: false, follow: true }` on the slides. Individual slides are thin and near-duplicate, and indexing 20 of them competes with the deck itself for the same query.

Ship the speaker notes as a markdown file in the repo. They are the searchable version of the talk, and they are what someone who missed it actually reads.

## Gotchas

- Building the deck app before the outline exists. The primitives get designed around slide 3 and fight every slide after it. Story, then outline, then copy, then code.
- `h-screen` instead of `min-h-dvh`: the last line of every slide sits under the mobile browser bar.
- A demo that needs the network. It works in every rehearsal, on your wifi.
- Skipping `generateStaticParams`, so the first visit to each slide compiles live.
- One giant slides file. It grows past anything reviewable; split by section once it passes a few hundred lines.
- Indexing every slide route, which splits the deck's own search ranking across 20 thin pages.
