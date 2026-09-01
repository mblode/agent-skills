# Reduced Motion

Implementation recipes for `prefers-reduced-motion`. Supporting the preference is opt-in in this skill: load this file only when the project already handles reduced motion or the user asks for it, and build without it otherwise. When a project does opt in, this is how to build the reduced path in CSS, Tailwind, Motion, and for media, plus the mechanisms people miss.

## Contents
- [Gentler, not zero: the transformation](#gentler-not-zero-the-transformation)
- [Workflow: a second pass, verified by emulation](#workflow-a-second-pass-verified-by-emulation)
- [CSS and Tailwind](#css-and-tailwind)
- [Motion: useReducedMotion and MotionConfig](#motion-usereducedmotion-and-motionconfig)
- [Dependency-free useReducedMotion hook](#dependency-free-usereducedmotion-hook)
- [Autoplaying images and video](#autoplaying-images-and-video)
- [Looping animation: pause on a hero frame](#looping-animation-pause-on-a-hero-frame)
- [Explanatory visuals: jump, don't tween](#explanatory-visuals-jump-dont-tween)

## Gentler, not zero: the transformation

`reduce` does not mean "no animations". Animations exist to make UI easier to understand; deleting them wholesale makes the interface harder to follow, which is the opposite of accessible. The transformation is: **remove the motion, keep the meaning.**

| Under `reduce` | Do |
| --- | --- |
| Movement: `transform`, `translate`, `scale`, position, layout | **Remove.** Nothing should move. |
| Meaning: `opacity`, `color`, `background-color` | **Keep.** These carry the state change without motion. |
| Autoplaying and looping animation | **Disable**, or pause on a representative frame. |
| Purely decorative motion (an idle float, an ambient loop) | **Remove entirely.** It conveys nothing, and lingering motion falsely implies interactivity. |

So a modal that scales in becomes a modal that fades in. A sidebar that slides from `-100%` becomes a sidebar that fades. A multi-step form that slides horizontally crossfades instead. The state change stays legible; nothing travels across the screen.

## Workflow: a second pass, verified by emulation

1. Build the animation; get it feeling right first.
2. Apply the table above.
3. Watch the `reduce` variant with emulation on (DevTools Rendering panel, "Emulate CSS media feature prefers-reduced-motion"). Reasoning about it is not the same as seeing it: the common failure is a "reduced" variant that still moves because one `transform` was left behind in a shared class or a spring config.

Movement usually hides in more than one place. In a Motion component, a transform, a measured `height` animation, and a `layout` prop are three separate opt-outs; missing any one leaves the reduced variant still moving. One `useReducedMotion()` call, then audit every animating property in the component.

## CSS and Tailwind

Swap the animation, don't delete it:

```css
.element { animation: bounce 0.2s; }

@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s; }
}
```

Tailwind's `motion-safe:` and `motion-reduce:` variants map to the two media queries:

```html
<svg class="motion-safe:animate-bounce motion-reduce:animate-fade">...</svg>
```

Smooth scrolling is motion the user didn't ask for, so opt *in* under `no-preference` rather than opting out under `reduce`; written this way the accessible behavior is the default even in browsers matching neither query:

```css
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

## Motion: useReducedMotion and MotionConfig

`useReducedMotion()` returns `true` under `reduce`, so you can branch values, or better, whole variant sets:

```jsx
import { useReducedMotion, motion } from "motion/react";

const variants = {
  initial: (d) => ({ x: `${110 * d}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (d) => ({ x: `${-110 * d}%`, opacity: 0 }),
};
// Same three states, opacity only: the change stays legible, nothing moves.
const reducedVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1 },
  exit: { opacity: 0 },
};

const reduce = useReducedMotion();
<motion.div variants={reduce ? reducedVariants : variants} ... />
```

The hook also gates the properties CSS can't reach: skip `animate={{ height }}` (`animate={reduce ? {} : { height: bounds.height }}`) and pass `layout={!reduce}`, since layout animations move things by definition.

App-wide safety net: `<MotionConfig reducedMotion="user">` makes Motion respect the preference everywhere below it, animating only `opacity` and `backgroundColor`. **The default is `never`, so this does nothing until you set it.** Wrap the whole application as a baseline, with per-component `useReducedMotion` on top wherever the fade-only default loses meaning.

## Dependency-free useReducedMotion hook

Without Motion, the hook is short. Read `matchMedia` inside the effect so it never runs during server rendering, and sync once on mount:

```tsx
import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  // Starts false so server and client markup match, then syncs on mount.
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setPrefers(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return prefers;
}
```

Because the first render is always `false`, don't let the value gate *mounting*: branch animation values only, or the reduced-motion user sees a flash of the animated variant.

## Autoplaying images and video

An animated GIF or AVIF autoplays with no user control at all. `<picture>` swaps in a static frame under `reduce`: no JavaScript, and the browser never downloads the animated file:

```html
<picture>
  <source srcset="animated.avifs" type="image/avif"
          media="(prefers-reduced-motion: no-preference)" />
  <source srcset="animated.gif" type="image/gif"
          media="(prefers-reduced-motion: no-preference)" />
  <img src="static.png" alt="" />
</picture>
```

For autoplaying video: under `no-preference` it autoplays; under `reduce` it stays paused and gets a visible play control so the user can start it deliberately. Check `window.matchMedia("(prefers-reduced-motion: no-preference)").matches` before setting `autoplay`, and ship the play button `hidden` until the script wires it up so a dead control never flashes on load.

## Looping animation: pause on a hero frame

Don't just stop a loop: a paused animation sits on frame 0, usually its least representative state (an empty chart, a collapsed shape). A **negative `animation-delay` seeks into the timeline**, so pausing lands on a frame you chose:

```css
.animation { animation: shake 0.2s infinite; }

@media (prefers-reduced-motion: reduce) {
  .animation {
    animation-play-state: paused;
    /* Pauses on the frame at 0.4s; try values and pick the best-looking frame. */
    animation-delay: -0.4s;
  }
}
```

## Explanatory visuals: jump, don't tween

Anything that reads as an image or video, a visual metaphor explaining a concept, often can't be removed, because the motion is what carries the explanation. Reduce it instead of deleting it: **jump between the frames rather than animating between them.** The user still gets every state of the sequence; nothing slides or morphs on screen.
