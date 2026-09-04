# Monitoring

What to check, on what cadence, and what earns a message. Scheduling itself belongs to the host's available scheduler; this file defines the content of each check.

## Contents

- Principles
- Daily anomaly check
- Weekly performance digest
- Weekly AI visibility
- New-request watch

## Principles

- Report state changes, not state. A flat week is not a report.
- Never fabricate a metric. If a property is inaccessible, name it in one line and stop.
- Track what has been reported. The same drop raised on three consecutive days trains the reader to ignore the channel.
- Read-only against the source. Monitoring reads Search Console, the analytics warehouse, and chat; it does not write back to them.

## Daily anomaly check

Compare against the recent baseline and stay quiet unless one of these fires:

| Signal | Threshold |
|---|---|
| Clicks or impressions | moved roughly 20% or more |
| Average position | worsened meaningfully on a tracked query or page |
| 5xx responses | count jumped |
| 404 responses | count jumped |

On the day the weekly digest runs, alert only on signals that are new since the digest, so the two do not restate each other.

## Weekly performance digest

For the mapped property, skimmable and in this order:

1. Last 28 days versus the prior 28: clicks, impressions, CTR, average position.
2. Top queries, with movement.
3. Top pages, with movement.
4. Indexing issues that are actionable. A coverage note nobody can act on is noise.

Send once. If a digest already went out for the period, stay quiet rather than re-sending a near-identical one.

## Weekly AI visibility

For topics already tracked, refresh Exact prompt volumes for the last complete week against the prior week, per engine rather than pooled. Report the week window alongside the numbers so the comparison is checkable. Report a new finding, material change, or access blocker; a newly recorded but unchanged week does not require a message.

Match-type discipline from `research-protocol.md` applies here too: Exact is the number, and a missing Exact is "No data", never a Phrase figure in disguise.

## Citation and share statistics

Treat any "X% of citations come from Y" figure as a dated snapshot, including ones from a vendor report or another skill. Third-party citation mixes move with model and retrieval updates rather than on a quarterly cycle, and a source worth a quarter of your citations can be worth none within days. Cite the date beside the figure, and where a decision rests on it, verify against your own tracking before spending on it.

## New-request watch

Watch the pipeline (sheet, database, or board) for new rows in a request state. Notify once per row and record the row IDs already notified. Do not modify the row: the watcher reads, the owner writes.

If authentication fails twice in a row, pause the watch and tell the user which credential expired rather than retrying into a lockout.
