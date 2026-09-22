# Live tuning

The reverse-engineer workflow runs backwards: record a motion you admire, then fit a curve to it. This is the forward version, for when there is no reference to copy and the table value is contested. Tune against the running component instead of guessing, reloading, and guessing again.

Start in DevTools. It is already open, it costs nothing, and it covers every bezier in the easing defaults table.

## Contents

- [When this is worth it](#when-this-is-worth-it)
- [The bezier editor](#the-bezier-editor)
- [Retiming in the Animations panel](#retiming-in-the-animations-panel)
- [What DevTools cannot do](#what-devtools-cannot-do)
- [Baking the value back](#baking-the-value-back)

## When this is worth it

- **The value is contested.** Two people disagree on whether a drawer should be 300ms or 400ms and neither can win the argument from a table.
- **The component is hard to reach.** A toast that needs a form submitted, a sheet three navigations deep. Each rebuild round trip costs more than the setup does once, and an HMR reload loses the state that got you there.
- **The motion is multi-phase.** Stagger offset, blur ramp, and settle interact, so three numbers guessed one reload at a time converge slowly.

Not for picking a button press duration. The easing defaults table answers that in one line.

## The bezier editor

Chrome, Edge, and Firefox render a small curve swatch next to any `transition-timing-function` or `animation-timing-function` in the Styles (or Rules) pane. Click it for a draggable cubic-bezier editor.

Edits apply live with no rebuild, so retrigger the interaction and watch it under the new curve. The editor emits the literal (`cubic-bezier(0.22, 1, 0.36, 1)`), which is what goes back into source.

Two things that waste time otherwise:

- The swatch only exists once the property is valid. On an element with no timing function yet, add the declaration in the `element.style` pane first and the swatch appears.
- Start from the table value, not a built-in preset. Opening on `cubic-bezier(0.22, 1, 0.36, 1)` gives you something to judge against; opening on `ease` means finding the table value by hand.

Safari has no bezier editor. Tune in Chrome, verify in Safari.

## Retiming in the Animations panel

The panel's slow-motion playback is a debugging tool and belongs to the Validation workflow. Two of its controls are tuning tools:

- **Drag a bar's edges** to change a duration or delay live, then replay. Faster than editing per-item delays for a stagger you are trying to feel out.
- **Read the captured group** to see every element's delay and duration side by side. This is the quickest way to recover the timing of a stagger you did not write, including one a library is generating.

## What DevTools cannot do

- **Springs.** No spring editor exists. Reach for the presets and the `visualDuration`/`bounce` framing in `spring-animations.md`: they are perceptual, so they land close on the first try, and a wrong spring usually needs one parameter moved rather than a search.
- **Composing multi-phase choreography.** The panel retimes what already fired; it will not let you build the phases against a shared playhead.

If a project hits those two often enough to matter, a control-panel library (DialKit, Leva, Tweakpane) earns a dev dependency: a spring control returns a Motion `TransitionConfig` that drops straight into `animate()`, and a timeline dock composes phases. That is a standing decision about the project, not something to install mid-task for one curve.

## Baking the value back

A tuning surface is a measuring instrument, not a delivery mechanism.

- A DevTools edit lives only in that tab and dies on navigation. Paste the literal into source before you believe it.
- Put it next to the other timing constants, so the next person sees it beside the values it has to agree with.
- A control panel leaves more behind than the dock: replace every sampled binding with the real animation, then remove the panel, its root, and the dependency. Framework roots hide themselves in production builds, but a vanilla root does not, and a forgotten one ships a control panel to users.
- Re-check the result against the ten standards. What felt right after ten iterations on a fast laptop still has to clear no layout-property transitions, `prefers-reduced-motion` handled, and interruption retargeting rather than restarting.

Tune on the real surface. A curve dialled on an isolated demo reads differently against the distance, size, and neighbours of the actual component, and how often the user sees it moves the answer more than any parameter does.
