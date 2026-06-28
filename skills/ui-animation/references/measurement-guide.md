# Measurement Guide

What to measure in a recording, when to trust your eyes vs the scripts, and how to read
`track_motion.py` output.

## Contents

- Property checklist
- By eye vs scripted
- Reading metrics.json
- Choosing an ROI / bbox
- Pixel-tracking pitfalls

## Property checklist

Walk every animation against this list. Most "magic" comes from the properties people
forget to look for: opacity and blur lead the move, not the position.

| Property | What it looks like | Field in metrics.json |
|---|---|---|
| Translate | Element changes position | `cx`, `cy` |
| Scale (per axis) | Box grows/shrinks, may over-stretch one axis | `width` → `scaleX`, `height` → `scaleY` |
| Opacity | Fades in/out, or a backdrop dims | `opacity` |
| Blur | Soft on entry, sharpens as it settles (or backdrop blur) | `blur` |
| Corner radius | Pill morphs to card; corners round/sharpen | `radius` |
| Shadow / elevation | Shadow grows as the element lifts | (measure by eye) |
| Color / fill | Background or tint shifts | (measure by eye) |

Anisotropic scale matters: a "fluid" morph usually stretches `height` ahead of `width`
(or vice versa) and lets them settle independently. `fit_curves.py` fits `scaleX` (width)
and `scaleY` (height) as separate curves for exactly this reason. Compare the two; don't
assume uniform scale.

## By eye vs scripted

Reach for the contact sheet first; escalate to scripts only where precision pays off.

| Decide by eye | Measure with scripts |
|---|---|
| Which element moves, and the effect list | Exact per-frame position / size |
| Rough phase order (blur-in, then move, then settle) | Whether motion overshoots and by how much |
| Direction and origin of the motion | Spring vs bezier and its parameters |
| Whether open and close differ | Precise duration and per-property timing offsets |

A plain fade or linear slide does not need tracking: read the timing off the contact
sheet and go straight to code. Spend the OpenCV/scipy budget on elastic, springy, or
multi-property motion where eyeballing the curve is unreliable.

## Reading metrics.json

`track_motion.py` writes one record per frame:

```json
{ "frame": 7, "file": "frame_0008.png",
  "x": 38, "y": 96, "width": 318, "height": 360,
  "cx": 197.0, "cy": 276.0, "opacity": 0.82, "blur": 0.31, "radius": 0.44 }
```

- Frames before entry or after exit show `{"present": false}`. That's the element being
  absent, not an error. The summary line reports how many frames were skipped.
- All values are **pixel-derived proxies**, not ground truth. `opacity` is box fill-ratio,
  `blur` is inverse Laplacian sharpness, `radius` is empty-corner fraction. Treat them as
  *shapes over time* to fit curves against, not absolute CSS values.
- Watch the **trend**, not the absolute number. A `blur` that falls 0.6 -> 0.1 over the
  first third tells you blur leads the move, regardless of the exact figures.

## Choosing an ROI / bbox

Auto-detection diffs each frame against frame 1 and tracks the changed region. It works
when one element animates over a still backdrop. `--bbox X,Y,W,H` restricts that same
frame-diff detection to the region: the element is still tracked *inside* it, so
position, scale, and opacity stay meaningful. Pass it when:

- Multiple things move and you want just one (measure each separately, one bbox each).
- The backdrop also animates (e.g. a dimming overlay) and pollutes the diff.
- The element starts off-screen: pick the bbox where it ends up.

Use `--threshold` to loosen/tighten detection and `--invert` when the element is the
*still* part and the background moves. Read the bbox coordinates straight off a frame.

## Pixel-tracking pitfalls

- **Dynamic Island / notch occlusion**: an element tucked under the island reads as a
  smaller box for the first frames. Expect `height` to be clipped early; trust the later
  frames for true size.
- **Anti-aliasing & motion blur**: fast frames smear edges, inflating the `blur` proxy
  and softening the bounding box. Sample at a higher `--fps` if the motion is very fast.
- **Drop shadows**: a soft shadow extends the detected box beyond the element. If `width`
  looks too large, tighten `--threshold` so faint shadow pixels fall below it.
- **Compression artifacts**: heavy video compression adds diff noise; `MIN_AREA_FRAC`
  filters specks but a high-bitrate recording always tracks cleaner.
