# Reverse-Engineer Motion From a Recording


Use this branch to measure an existing animation from a screen recording, then emit code and a handoff spec that reproduce it. The scripts under `scripts/motion/` are the canonical, deterministic path; run them rather than reconstructing their logic.

Resolve every `scripts/motion/` command below relative to the installed skill directory, not the application working directory.

**Dependencies:** `ffmpeg` for frame extraction (`brew install ffmpeg`); Python with `pip install opencv-python numpy scipy` for tracking and curve fitting. Degrades gracefully: with only ffmpeg you can extract frames and reason visually; tracking and fitting need the Python packages.

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

1. **Extract.** Run `python3 scripts/motion/extract_frames.py <video> <outdir>`. Trim to just the transition with `--start`/`--duration`; if the interaction has both an open and a close, trim two windows and run the pipeline once per direction (they are almost never mirror images). Match `--fps` to the source (probe with `ffprobe`), never sampling above the source rate. Open `contact_sheet.png` first.
2. **Vision pass.** Name the element(s) that move, every effect (translate, scale often anisotropic, opacity, blur, corner radius, shadow, color), and the phases, noting which property leads and lags. Use the checklist in `measurement-guide.md`.
3. **Decide precision.** Simple fade or linear slide: read timing off the contact sheet, skip to step 5. Elastic, springy, or multi-property motion: escalate to step 4 (eyeballing a spring is unreliable).
4. **Track and fit.** Run `python3 scripts/motion/track_motion.py <outdir>` for `metrics.json` (pass `--bbox X,Y,W,H` to isolate one element), then `python3 scripts/motion/fit_curves.py <outdir>/metrics.json` for spring params, cubic-bezier, and per-property fit error. `extract_frames.py` records its fps and the fit reads it back through `metrics.json`; pass `--fps` only for frames extracted some other way. Read `curve-fitting.md` to pick the model; high error on both means multi-phase motion (split and fit each segment).
5. **Annotate.** Load `choreography.md`. Build the timing-offset table (when each property starts and settles); lead/lag gaps and over-stretch carry more feel than any single curve.
6. **Emit.** Substitute fitted parameters into the templates in `code-output.md` for the target. Keep movement on `transform`/`opacity`. Emit two transitions when open and close differ, plus the consolidated handoff spec so it can be implemented without the video.
7. **Validate.** Re-derive: play the emitted animation, screen-record it, run it back through `extract_frames.py`, and compare contact sheets side by side. Slow to 0.1x to confirm phase order and over-stretch survive. Confirm the code only animates `transform`, `opacity`, and `filter`.

**Reverse-engineer gotchas:**

- `fit_curves.py` fits at the fps recorded in `metrics.json`. Frames not produced by `extract_frames.py` carry none, and the fit falls back to 30 with a warning: extract at 60, fit at 30, and every `duration_ms` doubles while fitted stiffness drops to a quarter. Pass `--fps` there.
- Sampling above the source rate duplicates frames: a 24 fps GIF extracted at 60 inflates fit error with plateaued runs in `metrics.json`. Probe and match the source rate.
- Screen recordings drop frames and iOS/QuickTime captures are variable-frame-rate; consecutive identical rows are duplicated frames, not a pause. Re-record at a steadier rate if plateaus dominate.
- Measure open and close as separate clips and report two curves; never fit one and reuse it reversed (see `choreography.md`). Treat a fit `error` above 0.08 as suspect.
