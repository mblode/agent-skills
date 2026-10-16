# Visual Review of Captures

Read when reviewing a UI change or capturing named states. This adds inspection to the existing probes; it does not introduce a persistent pixel-baseline service or a second route map.

## Comparable evidence

Use the same target selection, viewport, theme, fixture, clock, font readiness and motion settings for before and after. Record the source revision and any local edits for each run. Prefer an isolated base checkout; do not switch a live dev server's source underneath a capture. For deployed builds, record the served build identity rather than assuming the URL names the intended commit. An unidentified build leaves that claim unverified.

Keep both captures. A narrower rerun must not overwrite a broader baseline and silently turn missing frames into new UI. New UI can have after-only evidence; name the missing baseline rather than manufacture one. Shared-component changes require checking affected consumers, not just directory-glob matches.

## Inspect, then report

Open the actual images with the host's image-viewing tool. Review each changed state in the scoped capture set, including unchanged areas that could already be broken. State the intended visual change, unexpected differences, and which captures were inspected. A successful screenshot command or passing functional test cannot establish alignment, clipping, stacking or visual correctness. Uninspected captures remain explicitly unreviewed.

Use an existing diff tool to prioritize images when available, but inspect the rendered frame as well as its diff. Freeze irrelevant variability or mask a named volatile region; do not raise the threshold until a defect disappears. Record masks because masked areas are untested. Motion claims need a recording or frame sequence with motion enabled.

For a visible defect, attach the image and run a focused measurement where possible, such as the checkbox and label bounds. Report visual observations separately from measured rule results. Subjective design choices and severity still belong to `ui-design`; a capture review does not assign a ship verdict.

## Suspicious duplicates

When adding capture coverage or named states, compare frames that should differ under the same capture conditions. Prefer the existing image tooling's decoded-pixel equality, including dimensions; PNG file hashes can differ only because of metadata or encoding. If no comparator is available, inspect side by side and label the check manual rather than claiming an automated sweep.

For each identical group, confirm the state precondition: did the dialog open, did the loading fixture activate, did the theme attribute change? Assert the distinguishing state before recapturing. Identical pixels can be intentional, such as a monochrome logo in two themes; record that explanation. A fixture that never activated is a harness failure, not proof of an app defect. A state that cannot be reached stays unknown.

## Sources

Adapted from the user-supplied `verify-skills.tgz` bundle, `verify-ui`: agent image review, comparable captures and duplicate-state investigation. No vendor code is included. Company-specific recipes, automatic harness creation and PR publishing are excluded; existing repo tooling and authorization own those decisions.
