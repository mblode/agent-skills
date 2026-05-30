---
name: reverse-engineer-animation
description: Reverse-engineers a UI animation from a screen recording — extracts frames, tracks motion per frame, fits easing and spring curves, annotates choreography, and emits CSS, Motion/Framer Motion, SwiftUI, React Native, or UIKit code. Use when the user shares or uploads a screen recording or video of a UI animation, or asks to "reverse engineer this animation", "recreate this animation", "match this easing", "extract the animation curve", "figure out the spring from this video", "copy this transition from a video", "how does this animation work", or "reproduce this motion".
---

# Reverse Engineer Animation

Measure motion that already exists in a recording, then reproduce it. This is the forensic
counterpart to the `ui-animation` skill (which prescribes how motion *should* be designed).

## Reference files

| File | Read when |
|------|-----------|
| [references/measurement-guide.md](references/measurement-guide.md) | Deciding what to measure, eye vs script, reading `metrics.json`, choosing an ROI |
| [references/curve-fitting.md](references/curve-fitting.md) | Reading `fit_curves.py` output, spring vs bezier, judging fit error, asymmetric open/close |
| [references/code-output.md](references/code-output.md) | Emitting code for CSS, Motion/Framer Motion, SwiftUI, React Native, or UIKit |
| [references/choreography.md](references/choreography.md) | Multi-element / multi-phase motion: staggers, blur-before-move, per-edge settling |

## Dependencies

- `ffmpeg` — frame extraction (`brew install ffmpeg`). Required for step 1.
- Python: `pip install opencv-python numpy scipy` — tracking + curve fitting (steps 4).

Extraction degrades gracefully: with only ffmpeg you can still extract frames and reason
visually. Tracking and fitting need the Python packages.

## Workflow

Copy and track this checklist:

```text
Reverse-engineer progress:
- [ ] Step 1: Extract frames + contact sheet
- [ ] Step 2: Vision pass — identify element, effects, phases
- [ ] Step 3: Decide precision (eye-only vs scripted)
- [ ] Step 4: Track motion and fit curves (if escalating)
- [ ] Step 5: Annotate choreography (delays, asymmetry)
- [ ] Step 6: Emit code for the target(s)
- [ ] Step 7: Validate against the recording
```

### Step 1: Extract frames

**Run** `python3 scripts/extract_frames.py <video> <outdir>` (add `--fps N` for very
slow clips). On a multi-second recording, trim to just the transition with
`--start SECONDS --duration SECONDS` — extracting the whole clip floods the contact sheet
and dilutes tracking. Open the generated `contact_sheet.png` first — it shows the whole
window at once.

### Step 2: Vision pass

View the contact sheet and name, in order:
- The element(s) that move.
- Every effect present — translate, scale (often anisotropic), opacity, blur, corner
  radius, shadow, color. Use the property checklist in `references/measurement-guide.md`.
- The phases — e.g. backdrop blurs in, element tucks under the notch, over-stretches, then
  settles per-edge. Note which property *leads* and which *lags*.

### Step 3: Decide precision

- Simple fade or linear slide → read timing off the contact sheet and skip to step 5.
- Elastic, springy, or multi-property motion → escalate to step 4. Eyeballing a spring is
  unreliable.

### Step 4: Track and fit

**Run** `python3 scripts/track_motion.py <outdir>` → `metrics.json`. Pass `--bbox X,Y,W,H`
to isolate one element when several move (one bbox per element). Then **run**
`python3 scripts/fit_curves.py <outdir>/metrics.json` → spring params, cubic-bezier, and a
fit error per property. Read `references/curve-fitting.md` to interpret the numbers and
pick the model. **High error on both models means multi-phase motion** — split the timeline
and fit each segment.

### Step 5: Annotate choreography

Load `references/choreography.md`. Build the timing-offset table (when each property starts
and settles) — those lead/lag gaps and the over-stretch carry more of the feel than any
single curve.

### Step 6: Emit code

Substitute the fitted parameters into the templates in `references/code-output.md` for the
requested target. Keep movement on `transform`/`opacity`. Emit **two** transitions when
open and close differ. Produce the consolidated **handoff motion spec** (timing table +
curves + snippet) from `references/code-output.md` so the result can be implemented without
the video.

### Step 7: Validate

See Validation below.

## Asymmetric open/close

Open and close are almost never mirror images — open tends to be slower and springier,
close faster and flatter. Measure each **direction separately** (record or trim two clips
and run the pipeline on each). Report two curves; never reuse the open curve reversed.

## Anti-patterns

- Fitting one global curve to multi-phase motion — split into phases and compose keyframes.
- Tracking only position and ignoring blur/opacity — those usually *lead* the move and are
  where the polish lives.
- Assuming symmetric open/close — measure both directions.
- Reporting spring params without checking the fit error — a bad fit gives confident-looking
  but wrong numbers.
- Emitting code that animates layout props (`width`, `height`, `top`, `left`) — reproduce
  the motion on `transform`/`opacity` (defer to `ui-animation` rules).
- Re-reading a script to reconstruct its logic instead of running it — the scripts are the
  canonical, deterministic path.

## Validation

- Re-derive: play the emitted animation, screen-record it, run it back through
  `extract_frames.py`, and compare contact sheets side-by-side with the original.
- Slow to 0.1x in DevTools to confirm phase order (lead/lag) and the over-stretch survive.
- Confirm the emitted code only animates `transform`, `opacity`, and `filter`.
- Sanity-check fitted spring `overshoot`/`zeta` against what you saw — a clear bounce must
  not fit as a flat ease.

## Related skills

- `ui-animation` — turn the extracted spec into production-grade, interruptible motion and
  apply its easing defaults and anti-pattern rules.
