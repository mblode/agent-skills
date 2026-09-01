# Adopt, Adapt, or Author

Use when a public skill already covers the ground you were about to write, or when deciding whether to vendor, fork, or replace a third-party skill you installed earlier.

The default answer keeps moving toward "author". A current frontier model already carries general craft: WCAG thresholds, React hygiene, REST conventions, the standard library. A fetched skill that teaches those buys tokens and reconciliation, not capability. What no model carries is what *this* project decided. Weight the sort accordingly: adopt less than the skill's star count suggests, author more.

## The Sort

Classify the candidate before you read it closely. The kind decides the action.

| Kind | What it is | Action |
|------|-----------|--------|
| Process | A method that holds whatever the product is: how to audit a surface, how to decide whether a thing should animate at all | Adopt. Change little. |
| Craft | A rule that composes with anything: a contrast threshold, a budget, a measurement | Take the rules, override the numbers with this project's numbers |
| Taste | What this product looks like, sounds like, and refuses to do | Author. No fetched file knows the constraints. |

Most candidates are mixed. Sort each *section*, not each file: a design skill is usually process in its audit steps and taste in its token values, and taking the whole file imports someone else's taste along with their method.

A frontier model will apply plausible defaults for anything you leave unstated. That is why taste has to be written down and why craft numbers have to be explicit: the failure is not a gap, it is a confident wrong answer that reads as intentional.

## Why Not Just Install Both

Two skills that each answer "what should this look like" do not compose. They arrive in the same context and the model reconciles them before it can act, usually by following whichever it read last or whichever was more specific about the wrong thing.

This is the reason behind the IS / IS NOT boundary opener, not a separate rule. A boundary is only enforceable if exactly one skill owns each question. Installing an overlapping skill breaks the boundary from outside the file, where the audit will not catch it.

Before adopting, check the candidate against every sibling already installed. If a sibling's description would also fire on the same prompt, one of them has to change or go.

## The Vendoring Cost Rule

Vendoring verbatim is worth its cost only while the file still diffs usefully against upstream and still works.

- **Diffs usefully.** You can pull upstream fixes and read what changed. Once you have edited it heavily, every diff is noise and you are maintaining a fork while pretending you are not.
- **Still works.** A skill lifted out of a family of nine references its siblings. Take two, and both point at files that are not there. The model follows the pointer, finds nothing, and improvises.

When either fails, rewrite it as your own file and record where it came from. A rewrite you own beats a vendored file you have already diverged from.

Check for sibling dependencies *before* installing, not after: grep the candidate for relative paths and skill names, and confirm each one resolves in your bundle.

## Record the Rejection

Write down what you rejected and why, next to what you adopted.

A rejection is worth more later than an adoption. The next agent, or you in six months, finds the same well-starred skill and has no way to know it was already evaluated and turned down. Without the record it gets installed, collides with the skill that replaced it, and the boundary work is redone.

Two forms, both fine:

- **Machine-readable, for vendored files.** A `skills-lock.json` beside the bundle, pinning each vendored skill's upstream source and a content hash, so drift is detectable rather than assumed.
- **Prose, for derivations.** A short `## Sources` section in the skill that names what it drew on, what it took, and what it left. Put it in the file, not only in the commit message: the next repo is cloned from a copy, not from the history, so anything that lives only in a commit message does not travel.

Record the reason, not just the verdict. "Rejected: teaches craft the model already has" and "Rejected: depends on six siblings we did not take" lead to different decisions next time.
