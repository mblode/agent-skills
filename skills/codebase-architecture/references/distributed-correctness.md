# Distributed Correctness Patterns

Load when designing flows that call external systems, consume webhooks, retry, need an audit trail, or move money. Three principles, each enforced by a test, barrier, or constraint:

- **No invented data.** A retry or duplicate must not double-apply: dedupe, idempotency, reconciliation.
- **No lost data.** What happened survives a crash: durable progress, at-least-once delivery, append-only history.
- **No trust.** Providers, components, and the world fail or lie: verify at the boundary, fail loud, cross-check.

## Idempotency

Retried calls must collapse into one effect.

- Explicit key scoped to operation and client; deriving one from the payload is fragile.
- The check-and-record barrier must be atomic, or concurrent duplicates both pass.
- Replay the stored result (including a stored error); do not reprocess.
- A step that already advanced the state re-runs as a no-op, not an error.
- **Derive the row id from the key** for creates: hash the idempotency key into the new record's primary id (and any batch/transaction ids). A retried create then targets the same id and collapses on the existing unique constraint, so no separate dedupe table is needed.

## Deterministic ids across clients

Offline-first and multi-client systems cannot round-trip to the server to mint an id before writing.

- Compute the id on the client from stable inputs: a UUIDv5 over a frozen namespace constant plus the logical key (for a join row, the two parent ids). Every client derives the same id for the same logical entity, so concurrent inserts of the same edge converge instead of colliding.
- The namespace constant is load-bearing: changing it regenerates every id in the system. Freeze it and treat a change as a data migration.
- Keep cross-language ports (a Swift or Kotlin client and the server) in lockstep on the same algorithm and namespace, with a shared test vector, or clients silently disagree on ids.

## Full resumability

A flow can die between any two steps; assume it will.

- Durable state machine; commit each step before the next.
- An independent driver resumes incomplete flows so a crashed orchestrator cannot strand them.
- Every step safe to re-run (see Idempotency).
- External effects do not roll back: roll forward (retry) or compensate (a saga of undo actions).

## Reliable notification (dual-write problem)

A DB change and an event publish share no transaction: publish-then-commit can lose or fabricate notifications.

- **Outbox:** write the publish intent in the change's transaction; a relay retries until delivered. CDC and the event log are alternatives.
- Delivery is at-least-once; consumers dedupe on a stable event id.

## Reconciliation

External-fed data drifts.

- Missing records are easy; differing ones (same id, different value) are hard. Bake timing in so in-flight items are not flagged, and match on a stored external id.
- Fix each discrepancy with a correction or reprocess, never a silent overwrite.

## Consuming external APIs

You control none of a third party's schema, quality, or uptime.

- Validate only the fields you use, and fail loud on those; validating ignored fields turns a harmless provider change into an outage.
- Persist every request and response: audit trail and reprocessing material.
- Sandboxes diverge from production; verify critical paths live (canary, small volume).

## Webhooks are hints, not truth

- No guarantees on ordering, validity, delivery, or single delivery.
- Verify the signature over the raw received bytes; re-serialization breaks it.
- Acknowledge fast (2xx after storing the raw payload), then process asynchronously.
- Query the provider's API for authoritative state instead of trusting the payload; retry, since the API can lag. Back delivery with reconciliation.

## Invariants

Enforce three layers together: **by construction** (invalid states unrepresentable via types or constraints; cannot express cross-system rules), **at runtime** (assert at the point of violation), **post-factum** (jobs that catch what shipped).

- Forbidden is not unrepresentable: do not encode an externally-forceable invariant ("balance never negative") as an unsigned type or hard constraint, or the system crashes or clamps when the world forces the state. Represent it, detect it, recover.

## Money

- Never floats; store integer minor units, compute chained math in arbitrary precision. In JSON, money is a string or a minor-unit integer, never a bare number (a JSON number is a double).
- Pair amount with currency in one type and forbid cross-currency arithmetic; conversion is explicit, at a controlled rate.
- Derive balances from a ledger of movements; a stored mutable balance is a cache, never the source of truth. Book fees explicitly, never leave them as rounding residue.
- Round late and once, at the boundary. Splitting then rounding breaks the sum; track the residual explicitly instead of dropping it.
- Reserve before spending: check-and-reserve against available balance (total minus reserved) must be linearizable, or two concurrent flows back their spends with the same funds.

## Immutable audit trails

Keep the history, not just the latest value.

- Append-only. Capture **what** happened, **when**, **who** triggered it, and **why**.
- Audit every create/update/delete as one structured record: operation, entity, entity id, and before+after state on updates. Attach the actor from ambient request context so a call site cannot forget it.
- Corrections are new records linked both ways to the original, never edits or deletes.
- Record event-time and record-time separately; one `created_at` loses information you cannot reconstruct.
- For erasure: keep PII in a separate store keyed by opaque id, or encrypt per-user and delete the key (crypto-shredding), so erasure never rewrites history.
