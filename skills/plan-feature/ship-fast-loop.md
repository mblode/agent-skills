# Ship-Fast Loop

A repeatable loop to ship, learn, and iterate.

## Core loop
- Invert: list what makes shipping slow; delete that list aggressively.
- Aim for ~80% confidence, then ship and talk to users.
- Keep loops short: one owner per feature, minimal handoffs, clear "done".

## When to add structure
Add standards only when:
- Customers pay.
- More than one person touches the code.
- Bugs cost real time or money.

## Layered build order
1. Wizard of Oz: fake the outcome if needed.
2. Low-fi UI in code.
3. Data model and constraints.
4. API contract.
5. Backend.
6. Frontend polish.

## Feedback instrumentation
- Session replay.
- Analytics.
- Logs and metrics.
- Alerts (Slack or equivalent).
