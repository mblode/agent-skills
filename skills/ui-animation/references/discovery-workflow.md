# Discovery workflow

Use this branch when the request is "where should this animate", not "animate this". Every other mode starts from motion that exists; this one starts from its absence. It reports and never implements: hand a surviving suggestion back to the implementation workflow in SKILL.md to build it.

```text
Discovery progress:
- [ ] Step 1: Recon the stack, existing motion tokens, and product personality
- [ ] Step 2: Sweep every seam class
- [ ] Step 3: Gate each candidate
- [ ] Step 4: Report survivors and rejections
```

1. **Recon.** Identify the motion library (if any), the easing and duration tokens already in use, and how often each surface is visited. Suggestions extend the existing vocabulary rather than introducing a parallel one, and a dense dashboard earns fewer and subtler suggestions than a playful consumer app.
2. **Sweep.** Walk the seam table in the decision framework loaded by SKILL.md, which carries the grep signature for each. Clear a seam explicitly rather than skipping it silently.
3. **Gate.** Run each candidate through questions 1 and 2 of the same file: frequency, then purpose. "It looks cool" is not a purpose. Most candidates die here, which is the point.
4. **Report.** Order suggestions by impact, each with `file:line`, what happens today, the named purpose, the frequency tier, and exact values (property, duration, curve) drawn from the core easing and transition tables in SKILL.md. Include rejected candidates only when the reason clarifies a likely alternative. Close with which single suggestion has the highest leverage.

Where the interface already carries the right amount of motion, say so. That is the correct result for a well-built UI, not an empty report.

