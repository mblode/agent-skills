# Dialogue Examples

Four examples showing the four dialogue moves (push deeper, accept and record, reframe, verify). Each demonstrates tone, specificity, and how to adapt to user responses.

## Contents

1. [Example 1: Push Deeper (Completeness)](#example-1-push-deeper-completeness)
2. [Example 2: Accept and Record (Feasibility)](#example-2-accept-and-record-feasibility)
3. [Example 3: Reframe (Testability)](#example-3-reframe-testability)
4. [Example 4: Verify (Risk)](#example-4-verify-risk)
5. [Tone Guidelines](#tone-guidelines)

## Example 1: Push Deeper (Completeness)

**Plan excerpt:**
```
## Data Migration
Move all user records from the legacy PostgreSQL database to the new schema.
Run the migration script, verify counts match, then switch the read path.
```

**First question:**
"Your migration section says 'run the migration script, verify counts match, then switch the read path.' What happens if the migration fails halfway, say 40% of records migrated and the script crashes? Is the system in a valid state? What's the recovery step?"

**User response:**
"We'd just re-run the script. It's idempotent."

**Push deeper (push 1):**
"Idempotent how? If the script crashed mid-batch, are partially written records left in the new schema? Does re-running skip already-migrated records, or does it attempt to re-insert them? What's the specific mechanism: upsert, check-before-write, or truncate-and-restart?"

**User response:**
"Good point. It uses INSERT ON CONFLICT DO NOTHING keyed on user_id. So re-running skips existing records and picks up where it left off. We verify by comparing counts between old and new tables."

**Accept and record:**
"That's concrete: ON CONFLICT DO NOTHING with user_id key means safe re-runs, and count verification confirms completeness. Writing it into the migration section now."

---

## Example 2: Accept and Record (Feasibility)

**Plan excerpt:**
```
## Real-time Updates
Use WebSocket connections to push order status changes to the client.
The server sends events when order state transitions occur.
```

**First question:**
"You're proposing WebSockets for real-time updates. What's your WebSocket infrastructure? Are you adding a new WebSocket server, or does your stack already support persistent connections? If new, how does this work behind your load balancer?"

**User response:**
"We already have a WebSocket gateway running on our infrastructure. It's the same one the chat feature uses, and it handles sticky sessions through our ALB. I just need to add a new event type for order status. The gateway already handles reconnection and message queuing."

**Accept and record:**
"Existing WebSocket gateway with sticky sessions and message queuing: this is incremental, not greenfield. The feasibility concern doesn't apply. Recording the gateway dependency in the plan and moving on."

---

## Example 3: Reframe (Testability)

**Plan excerpt:**
```
## Verification
Run the existing integration test suite after deployment.
The CI pipeline already covers the affected endpoints.
```

**First question:**
"The verification section defers entirely to the existing test suite. Does the existing suite actually cover the new behavior you're adding? Specifically, if you're changing how order cancellation works, does the suite exercise that path, or only the happy path of order creation?"

**User response:**
"The test suite covers order cancellation. I actually wrote those tests last quarter. There are 12 test cases covering cancellation with refund, cancellation without refund, partial cancellation, and cancellation after shipping. What this plan changes is the notification sent after cancellation, which is a new code path."

**Reframe:**
"Got it: the existing tests cover cancellation logic, but your plan adds a new notification path that isn't tested yet. The real gap isn't 'does the suite cover cancellation', it's 'how will you test the new notification behavior specifically?' That's the question: what verifies the notification fires correctly and contains the right data?"

---

## Example 4: Verify (Risk)

**Plan excerpt:**
```
## Cleanup
Delete the `legacyExport` module. Nothing calls it anymore.
```

**Verify (no question needed yet, the claim is checkable):**
"The plan claims nothing calls `legacyExport`. That's checkable, so verifying before asking anything."

```
Claim: "Nothing calls legacyExport anymore"
Evidence: grep -rn "legacyExport" src/ → 2 call sites:
         src/reports/quarterly.ts:88
         src/admin/export.ts:14
Verdict: NOT VERIFIED: 2 active call sites outside the module
```

"NOT VERIFIED: `legacyExport` has two live call sites, `src/reports/quarterly.ts:88` and `src/admin/export.ts:14`. The deletion step needs either a migration for those callers or the claim corrected. Which is it?"

**User response:**
"quarterly.ts is behind a feature flag we killed last month, so that path is dead. admin/export is real though. I'll add a step to move admin export onto the new exporter before the deletion."

**Accept and record:**
"Recorded: migrate `src/admin/export.ts` to the new exporter before deleting `legacyExport`; the dead-flag path in quarterly.ts deletes with the module. Writing the new migration step into the Cleanup section."

---

## Tone Guidelines

Across all examples, note:
- Questions reference specific plan sections and specific claims
- No preamble praise ("this looks great, but...")
- Direct without being hostile; the tone is "curious engineer poking at assumptions"
- Follow-ups are sharper than first questions; they demand specificity
- Verification runs before asking whenever evidence can settle the point, and the verdict is shown with the raw command output
- Acceptance is brief and concrete: name what was resolved, write it into the plan, then move on
- Reframes acknowledge what the user got right before redirecting
