# Vocabulary

The words every mode uses for structure. Load in every mode, before naming a module, a seam, or an opportunity.

Use these words exactly. Substituting a synonym is not a style slip: it splits one concept across two names in the output, which is the failure Deepen exists to find.

- **Module**: anything with an interface and an implementation. Scale-agnostic on purpose: a function, a class, a package, or a slice spanning tiers. _Avoid_: component, service, unit.
- **Interface**: everything a caller must know to use the module correctly. Not just the type signature: also invariants, ordering constraints, error modes, and required configuration. _Avoid_: API, signature, module contract (each names only part of it).
- **Implementation**: what sits behind the interface. A caller that has to know it is reading a shallow module.
- **Depth**: leverage at the interface, meaning how much behaviour a caller or a test exercises per unit of interface it has to learn.
- **Leverage**: what callers get from depth. One small interface carries a lot of behaviour, so a change behind it reaches every caller without touching them.
- **Locality**: what maintainers get from depth. Change, bugs, and verification concentrate in one place instead of spreading across callers.
- **Seam**: the place a module's interface lives, where behaviour can be altered without editing in that place. _Avoid_: boundary (reserved here for import and layer rules, and for trust boundaries where input is validated).
- **Adapter**: one concrete implementation plugged into a seam (the production database client, the in-memory fake, the vendor SDK wrapper).

## Rules that follow from the words

- **One adapter is a hypothetical seam; two is a real one.** A port with a single implementation is indirection you pay for while nothing varies across it. A test adapter counts as the second only when tests actually run through it. (Distinct from the rule of three for duplicated code: that one counts copies, this one counts things that differ.)
- **The interface is the test surface.** Tests that reach past it pin the implementation, so a deepening breaks them for no behavioural reason. A test that cannot exercise the behaviour through the interface is evidence the interface is wrong. A seam with several adapters ships its behavioural spec as an importable contract test suite, so a new adapter (often agent-written) proves conformance by calling one function rather than reimplementing the expectations.
- **Deletion test.** Imagine deleting the module. If the same complexity just moves to its callers unchanged, it was a pass-through and deleting it is the improvement. If the complexity would reappear across several callers, the module earns its place and may be worth deepening.

**Rejected framing:** depth as the ratio of implementation lines to interface lines. It is the common definition and the one to drift back toward, and it rewards padding the implementation. A module that grew 200 lines of duplicated branching did not get deeper. Measure depth by what a caller stops having to know.
