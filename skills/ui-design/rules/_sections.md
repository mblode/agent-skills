# Sections

The canonical index for `ui-design/rules/`. One heading per category; the id in parentheses is the filename prefix that groups the rules in it (`<prefix>-<slug>.md`) and the value of each rule's `category` key. Category impact is the default; per-rule tiers live in each rule file's `defaultTier`.

Pure design-decision scoring (choice architecture, information hierarchy, mental-model fit, visual polish) is out of the audit's lane; route it to `product-design`, and to the build-side guidance in this skill for visual direction. The perception and cognition rules kept here catch built and rendered defects, not taste.

---

## One folder, three lineages

These rules came from three earlier sets: source-reasoned behavior rules, rendered-quality rules, and the perception and cognition laws. That distinction is now recorded per rule in the `detect` key, not in a folder name:

- `detect: static` reads the source. Grep, AST, file presence.
- `detect: rendered` needs the built output. Screenshot, computed style, a real viewport.
- `detect: rubric` is scored 1-5 against the anchor table in the rule's own file, because the defect does not reduce to a boolean.

Do not reintroduce a second rules folder. A rule that needs the browser says so in `detect`; splitting the corpus by lineage again is what produced three drifting indexes and three templates.

---

## 1. Forms and Validation (forms)

**Impact:** CRITICAL
**Default tier:** release-blocker for submit and data-loss bugs, fix-this-sprint elsewhere
**Rules:** 10
**Description:** Forms are conversion paths, and form-handling bugs are the most common ship-blockers. Labels, autocomplete, paste and IME support, error association, and mobile input sizing decide whether users can complete a form at all. React 19's `useActionState`, `useFormStatus`, and `useOptimistic` address the behavior half only if used correctly: form clears on validation error, double-submit, `useFormStatus` misuse with its always-false bug, no server-side normalization.

## 2. States (states)

**Impact:** CRITICAL
**Default tier:** release-blocker on critical paths, fix-this-sprint elsewhere
**Rules:** 4
**Description:** Missing or broken states is the single highest-impact production UX bug. Every data-fetching component needs loading, empty, error, success, and, if paginated, partial. The most common bug is happy path only. This category owns empty, loading, and error states wherever they appear; the layout rules cover the container, not the state.

## 3. Async (async)

**Impact:** CRITICAL
**Default tier:** mostly release-blocker
**Rules:** 4
**Description:** Async work introduces race conditions, optimistic updates with no rollback, and missing Suspense or error boundaries. Silent until they are not.

## 4. Focus and Keyboard (focus)

**Impact:** CRITICAL
**Default tier:** release-blocker for traps and restoration, fix-this-sprint for dynamic content
**Rules:** 3
**Description:** Focus management is invisible to mouse users and breaks the experience entirely for keyboard and screen reader users. axe checks landmarks but not where focus went after an action.

## 5. Accessibility and Semantics (a11y)

**Impact:** CRITICAL
**Default tier:** mostly release-blocker
**Rules:** 8
**Description:** Semantic structure, accessible names, non-color state cues, media alternatives, and document language. Failures exclude assistive-tech users entirely, so run this category first. Contrast ratios are not checked here: axe-core computes them, so run it rather than eyeballing hex values.

## 6. Keyboard and Interaction (interaction)

**Impact:** CRITICAL
**Default tier:** release-blocker for focus and operability, fix-this-sprint for sizing and latency
**Rules:** 5
**Description:** Every interactive element must be keyboard-operable with visible focus and adequate hit targets. A mouse-only control is broken for keyboard, switch, and many touch users. Also covers the motor and temporal properties of interaction: target acquisition under Fitts's Law and feedback latency under the Doherty threshold.

## 7. Navigation and Feedback (nav)

**Impact:** HIGH
**Default tier:** mostly fix-this-sprint
**Rules:** 3
**Description:** Real links for navigation, live-region announcements, and stable loading-indicator timing. Users need to know where they are and what the system is doing.

## 8. Microcopy (microcopy)

**Impact:** HIGH
**Default tier:** fix-this-sprint, release-blocker for leaked errors
**Rules:** 5
**Description:** Microcopy quality is a major UX gap no tool catches semantically. Vague errors, leaked exception text with PII or stack traces, generic loading copy, and unspecific action labels hurt trust, lower completion, and can leak security-sensitive information.

## 9. Mobile and Touch (mobile)

**Impact:** HIGH
**Default tier:** mostly fix-this-sprint
**Rules:** 2
**Description:** Patterns that work on desktop but fail on touch: hover-only affordances, missing viewport meta, `100vh` on mobile, no safe-area insets. Lighthouse catches some tap-target failures; these rules add the affordance and viewport patterns.

## 10. Dark Mode and i18n (dark-i18n)

**Impact:** MEDIUM
**Default tier:** mostly backlog
**Rules:** 7
**Description:** Patterns that pass a desk-check but fail with non-Latin text, RTL, or in dark theme. `dark-i18n-color-only-state` is the highest-severity rule here under WCAG 1.4.1: fix-this-sprint by default, release-blocker on sign-in and checkout, where an unperceivable error blocks the task. Take the tier from the rule file's override table, not from this category default.

## 11. Typography and Readability (type)

**Impact:** HIGH
**Default tier:** mostly fix-this-sprint
**Rules:** 3
**Description:** Surface-level readability: scale, measure, leading, link distinction. Deep typography such as pairing, brand, and display type belongs to the typography-audit skill, not this category.

## 12. Layout and Resilience (layout)

**Impact:** HIGH
**Default tier:** fix-this-sprint
**Rules:** 2
**Description:** Layouts must survive long content, sparse or dense data, and edge states without overflow or collapse. Empty, loading, and error states themselves are owned by the `states` category, not by these rules; report the container failure here and the missing state there.

## 13. Performance and Visual Stability (perf)

**Impact:** HIGH
**Default tier:** fix-this-sprint, release-blocker for image-dimension CLS
**Rules:** 5
**Description:** Prevent layout shift, lazy-load offscreen work, hint the critical request chain, and keep rendering predictable under realistic content loads. Image-dimension failures are CLS regressions and rate CRITICAL.

## 14. Motion (motion)

**Impact:** HIGH
**Default tier:** fix-this-sprint
**Rules:** 2
**Description:** Animate transform and opacity only, and respect `prefers-reduced-motion`. Unreduced motion can cause vestibular distress; animating layout properties causes jank.

## 15. Cognitive Load (cognitive)

**Impact:** CRITICAL
**Default tier:** mostly release-blocker
**Rules:** 4
**Description:** How much mental effort an interface demands. Excessive load is the top cause of abandonment, error, and "I don't get it" friction. Covers the working-memory limit and chunking.

## 16. Decision-Making (decision)

**Impact:** HIGH
**Default tier:** fix-this-sprint
**Rules:** 4
**Description:** How users choose between options or commit to actions. Covers choice architecture, simplification, and the pull toward whatever users already use.

## 17. Perception (perception)

**Impact:** HIGH
**Default tier:** fix-this-sprint
**Rules:** 6
**Description:** Gestalt grouping and attention laws governing how users parse a layout pre-attentively. What looks grouped is read as semantically grouped, for better or worse.

## 18. Memory and Expectation (memory)

**Impact:** MEDIUM-HIGH
**Default tier:** fix-this-sprint
**Rules:** 5
**Description:** How users remember experiences through peak and end effects and position effects, how unfinished tasks linger under the Zeigarnik effect, how nearing a goal accelerates effort, and how prior products shape expectations under Jakob's Law.

## 19. Generated-UI Slop (slop)

**Impact:** MEDIUM
**Default tier:** backlog
**Rules:** 6
**Description:** The house style of machine-generated interfaces: default-everything spacing, stock gradient hero, emoji as iconography, filler copy shipped as real copy, and the other tells that make a screen read as unfinished rather than broken. Nothing here blocks a task, which is why it defaults to backlog, but it is what a reviewer means by "this looks AI-made."

---

## Cross-category interactions

These pairings often co-fire. Emit both findings with the same `surface` to make the link explicit, except where a bullet below names a single owner: three findings and three near-identical fixes for one defect read as padding, not thoroughness.

- **Hick's + Miller's**: Both push toward fewer choices. A nav with 12+ items fails both.
- **Hick's + Chunking**: When count cannot drop, group. Chunking softens Hick's penalty.
- **Miller's + Chunking + Cognitive Load**: One 12-field ungrouped form trips all three, and all three fixes are the same `<fieldset>`/`<legend>` pass. `cognitive-chunking` owns the finding, since it owns form grouping. Add Miller's only if any group still exceeds 7 fields after grouping, and Cognitive Load only if the surface also has competing primary CTAs.
- **Hick's + Choice Overload**: A flat pricing grid trips both. `decision-choice-overload` owns the recommended-option finding; `decision-hicks-law` owns cutting the visible count. Don't emit "flag a recommended plan" from both.
- **The three grouping laws**: `perception-proximity`, `perception-common-region`, and `perception-uniform-connectedness` all co-fire on an ungrouped list. Report the weakest cue actually missing, per the established precedence of Uniform Connectedness over Common Region over Proximity: no spacing ratio at all is proximity's, a dense dashboard or list with no boundaries is common-region's, and a radio, segmented, or step set with no shared connector is uniform-connectedness's.
- **Fitts's + Proximity**: Tap targets need both adequate size and adequate spacing.
- **Peak-End + Goal-Gradient**: A strong end matters more if the user accelerated into it.
- **Serial Position + Von Restorff**: Position effect predicts edge-recall; distinctiveness breaks the pattern.
- **Zeigarnik + Goal-Gradient**: Open loops plus visible progress accelerate completion.
- **States + Layout**: `states` owns the missing empty, loading, or error state. `layout` owns the container that overflows or collapses once that state renders. One defect, one owner, per the `states` category description above.

---

Total: 88 rules across 19 categories.
