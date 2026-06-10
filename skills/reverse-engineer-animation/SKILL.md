---
name: reverse-engineer-animation
description: Reverse-engineers a UI animation from a screen recording. Extracts frames with ffmpeg, tracks motion per frame with OpenCV, fits easing and spring curves, annotates choreography (leads, lags, over-stretch), and emits CSS, Motion/Framer Motion, SwiftUI, React Native, or UIKit code plus a handoff motion spec. Use when the user shares or uploads a screen recording or video of a UI animation, or asks to "reverse engineer this animation", "recreate this animation", "match this easing", "extract the animation curve", "figure out the spring from this video", "copy this transition from a video", "how does this animation work", or "reproduce this motion". For designing new motion from scratch or reviewing motion code, use ui-animation instead.
---

# Reverse Engineer Animation

- **IS:** measuring motion that already exists in a recording (extract frames, track per frame, fit curves, annotate choreography), then emitting code and a handoff spec that reproduce it.
- **IS NOT:** designing new motion from scratch, or reviewing/debugging motion code. Route both to `ui-animation`.

## Contents

- Reference files
- Dependencies
- Workflow (extract, vision pass, track, fit, annotate, emit, validate)
- Gotchas
- Validation
- Related skills

## Reference files

| File | Read when |
|------|-----------|
| [references/measurement-guide.md](references/measurement-guide.md) | Deciding what to measure, eye vs script, reading `metrics.json`, choosing an ROI |
| [references/curve-fitting.md](references/curve-fitting.md) | Reading `fit_curves.py` output, spring vs bezier, judging fit error, asymmetric open/close |
| [references/code-output.md](references/code-output.md) | Emitting code for CSS, Motion/Framer Motion, SwiftUI, React Native, or UIKit |
| [references/choreography.md](references/choreography.md) | Multi-element / multi-phase motion: staggers, blur-before-move, per-edge settling |

## Dependencies

- `ffmpeg`: frame extraction (`brew install ffmpeg`). Required for step 1.
- Python: `pip install opencv-python numpy scipy` for tracking + curve fitting (step 4).

Extraction degrades gracefully: with only ffmpeg you can still extract frames and reason
visually. Tracking and fitting need the Python packages.

## Workflow

Copy and track this checklist:

```text
Reverse-engineer progress:
- [ ] Step 1: Extract frames + contact sheet (per direction if open differs from close)
- [ ] Step 2: Vision pass: identify element, effects, phases
- [ ] Step 3: Decide precision (eye-only vs scripted)
- [ ] Step 4: Track motion and fit curves (if escalating)
- [ ] Step 5: Annotate choreography (delays, asymmetry)
- [ ] Step 6: Emit code for the target(s)
- [ ] Step 7: Validate against the recording
```

### Step 1: Extract frames

**Run** `python3 scripts/extract_frames.py <video> <outdir>`. On a multi-second recording,
trim to just the transition with `--start SECONDS --duration SECONDS`; extracting the
whole clip floods the contact sheet and dilutes tracking. If the interaction has both an
open and a close, trim **two windows and run the whole pipeline once per direction**.
They are almost never mirror images, so one measurement cannot serve both.

Match `--fps` to the source: probe with
`ffprobe -v 0 -select_streams v -show_entries stream=avg_frame_rate <video>` and never
sample above the source rate (see Gotchas). Open the generated `contact_sheet.png` first;
it shows the whole timeline at once.

### Step 2: Vision pass

View the contact sheet and name, in order:
- The element(s) that move.
- Every effect present: translate, scale (often anisotropic), opacity, blur, corner
  radius, shadow, color. Use the property checklist in `references/measurement-guide.md`.
- The phases (e.g. backdrop blurs in, element tucks under the notch, over-stretches, then
  settles per-edge). Note which property *leads* and which *lags*.

### Step 3: Decide precision

- Simple fade or linear slide: read timing off the contact sheet and skip to step 5.
- Elastic, springy, or multi-property motion: escalate to step 4. Eyeballing a spring is
  unreliable.

### Step 4: Track and fit

**Run** `python3 scripts/track_motion.py <outdir>` to produce `metrics.json`. Pass
`--bbox X,Y,W,H` to restrict detection to one element when several move (one run per
element). Then **run** `python3 scripts/fit_curves.py <outdir>/metrics.json` to get
spring params, cubic-bezier, and a fit error per property. If you extracted with a
non-default `--fps`, pass the **same `--fps` to `fit_curves.py`**: its default is 30 and
a mismatch rescales every duration and stiffness (see Gotchas). Read
`references/curve-fitting.md` to interpret the numbers and pick the model. **High error
on both models means multi-phase motion**: split the timeline and fit each segment.

### Step 5: Annotate choreography

Load `references/choreography.md`. Build the timing-offset table (when each property starts
and settles). Those lead/lag gaps and the over-stretch carry more of the feel than any
single curve.

### Step 6: Emit code

Substitute the fitted parameters into the templates in `references/code-output.md` for the
requested target. Keep movement on `transform`/`opacity`. Emit **two** transitions when
open and close differ. Produce the consolidated **handoff motion spec** (timing table +
curves + snippet) from `references/code-output.md` so the result can be implemented without
the video.

### Step 7: Validate

Run the Validation checks below. The exit criterion is comparison evidence, never
"looks right".

## Gotchas

- `fit_curves.py` defaults to `--fps 30`. Extract at `--fps 60` and fit at the default,
  and every `duration_ms` doubles (a 500 ms transition reports as 1000 ms) while fitted
  stiffness drops to a quarter. Always pass the extraction fps to the fit.
- Sampling above the source frame rate duplicates frames: a 24 fps GIF extracted at
  `--fps 60` yields runs of identical values in `metrics.json` that plateau the progress
  curve and inflate both fit errors. Probe the source rate first and match it.
- Screen recordings drop frames under load, and iOS/QuickTime captures are
  variable-frame-rate. Consecutive identical `metrics.json` rows are duplicated frames,
  not a pause in the animation. If plateaus dominate, re-record at a steadier frame rate
  instead of chasing the fit.
- Fitting one global curve to multi-phase motion fails with high error on **both** models.
  Split into phases and compose keyframes (`references/curve-fitting.md`).
- Tracking only position misses blur/opacity, which usually *lead* the move by ~100 ms.
  That lead is where the polish lives.
- Open and close are never mirror images (open slower and springier, close faster and
  flatter). Measure each direction as its own clip; never reuse the open curve reversed.
- Reporting spring params without checking the fit `error`: a bad fit gives
  confident-looking but wrong numbers; treat error > 0.08 as suspect.
- Emitting code that animates layout props (`width`, `height`, `top`, `left`): reproduce
  the motion on `transform`/`opacity`/`filter` (defer to `ui-animation` rules).
- Re-reading a script to reconstruct its logic instead of running it: the scripts are the
  canonical, deterministic path.

## Validation

- Re-derive: play the emitted animation, screen-record it, run it back through
  `extract_frames.py`, and compare contact sheets side-by-side with the original.
- Slow to 0.1x in DevTools to confirm phase order (lead/lag) and the over-stretch survive.
- Confirm the emitted code only animates `transform`, `opacity`, and `filter`.
- Sanity-check fitted spring `overshoot`/`zeta` against what you saw; a clear bounce must
  not fit as a flat ease.

## Related skills

- `ui-animation`: turn the extracted spec into production-grade, interruptible motion and
  apply its easing defaults and anti-pattern rules.
