# Dialogue Examples

Four examples of the four dialogue moves (push deeper, accept and record, reframe, verify): tone, specificity, adapting to responses.

## Example 1: Push Deeper (Completeness)

**Plan excerpt:**
```
## Data Migration
Move all user records from the legacy PostgreSQL database to the new schema.
Run the migration script, verify counts match, then switch the read path.
```

**First question:**
"Your migration section says 'run the migration script, verify counts match, then switch the read path.' What if it fails halfway (40% migrated, script crashes)? Is the system in a valid state? What's the recovery step?"

**User:** "We'd just re-run the script. It's idempotent."

**Push deeper:**
"Idempotent how? If it crashed mid-batch, are partial records left in the new schema? Does re-running skip already-migrated records or re-insert them? What's the mechanism: upsert, check-before-write, or truncate-and-restart?"

**User:** "Good point. It uses INSERT ON CONFLICT DO NOTHING keyed on user_id, so re-running skips existing records and picks up where it left off. We verify by comparing counts between old and new tables."

**Accept and record:**
"Concrete: ON CONFLICT DO NOTHING on user_id means safe re-runs, count verification confirms completeness. Writing it into the migration section now."

## Example 2: Accept and Record (Feasibility)

**Plan excerpt:**
```
## Real-time Updates
Use WebSocket connections to push order status changes to the client.
The server sends events when order state transitions occur.
```

**First question:**
"You're proposing WebSockets. What's your WebSocket infrastructure: a new server, or does your stack already support persistent connections? If new, how does it work behind your load balancer?"

**User:** "We already have a WebSocket gateway, the same one chat uses. It handles sticky sessions through our ALB, plus reconnection and message queuing. I just need to add a new event type for order status."

**Accept and record:**
"Existing gateway with sticky sessions and queuing: this is incremental, not greenfield. The feasibility concern doesn't apply. Recording the gateway dependency and moving on."

## Example 3: Reframe (Testability)

**Plan excerpt:**
```
## Verification
Run the existing integration test suite after deployment.
The CI pipeline already covers the affected endpoints.
```

**First question:**
"Verification defers entirely to the existing suite. Does it cover the new behavior? If you're changing order cancellation, does the suite exercise that path or only the happy path of order creation?"

**User:** "The suite covers cancellation, I wrote those tests last quarter: 12 cases across cancellation with refund, without refund, partial, and after shipping. What this plan changes is the notification sent after cancellation, a new code path."

**Reframe:**
"Got it: existing tests cover cancellation logic, but your plan adds a new notification path that isn't tested. The real gap isn't 'does the suite cover cancellation', it's 'how will you test the new notification?' What verifies the notification fires correctly with the right data?"

## Example 4: Verify (Risk)

**Plan excerpt:**
```
## Cleanup
Delete the `legacyExport` module. Nothing calls it anymore.
```

**Verify (no question yet, the claim is checkable):**
"The plan claims nothing calls `legacyExport`. That's checkable, so verifying before asking."

```
Claim: "Nothing calls legacyExport anymore"
Evidence: grep -rn "legacyExport" src/ → 2 call sites:
         src/reports/quarterly.ts:88
         src/admin/export.ts:14
Verdict: NOT VERIFIED: 2 active call sites outside the module
```

"NOT VERIFIED: `legacyExport` has two live call sites, `src/reports/quarterly.ts:88` and `src/admin/export.ts:14`. The deletion step needs a migration for those callers or the claim corrected. Which is it?"

**User:** "quarterly.ts is behind a feature flag we killed last month, so that path is dead. admin/export is real though. I'll add a step to move admin export onto the new exporter before the deletion."

**Accept and record:**
"Recorded: migrate `src/admin/export.ts` to the new exporter before deleting `legacyExport`; the dead-flag path in quarterly.ts deletes with the module. Writing the migration step into Cleanup."

## Tone Guidelines

- Questions reference specific plan sections and claims.
- No preamble praise ("this looks great, but...").
- Direct without hostility: a curious engineer poking at assumptions.
- Follow-ups are sharper than first questions; they demand specificity.
- Verify before asking whenever evidence can settle the point; show the verdict with raw command output.
- Acceptance is brief and concrete: name what was resolved, write it into the plan, move on.
- Reframes acknowledge what the user got right before redirecting.
